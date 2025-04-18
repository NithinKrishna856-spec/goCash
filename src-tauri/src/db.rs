use std::{
    env,
    error::Error,
    panic,
    sync::{Arc, OnceLock},
};

use dotenv::dotenv;
use mysql::{params, prelude::Queryable, Opts, OptsBuilder, Pool, PooledConn};
use rust_decimal::Decimal;
use tokio;
use ulid::Ulid;

use crate::models::{Account, Transaction, User};
use crate::websocket_pub::send_balance_update;

static DB_POOL: OnceLock<Arc<Pool>> = OnceLock::new();

// InitializeDB
pub fn init_db() -> Result<Arc<Pool>, Box<dyn Error + Send + Sync>> {
    let pool = DB_POOL.get_or_init(|| {
        dotenv().ok();
        let host = env::var("DB_HOST").expect("DB_HOST must be set");
        let user = env::var("DB_USER").expect("DB_USER must be set");
        let pass = env::var("DB_PASS").expect("DB_PASS must be set");
        let db_name = env::var("DB_NAME").expect("DB_NAME must be set");
        let port = env::var("DB_PORT").unwrap_or("3306".to_string());

        let opts = OptsBuilder::new()
            .ip_or_hostname(Some(host))
            .user(Some(user))
            .pass(Some(pass))
            .db_name(Some(db_name))
            .tcp_port(port.parse().expect("Invalid DB_PORT value"));

        let pool = Pool::new(Opts::from(opts)).expect("Failed to create database pool");
        println!("✅ Database connection pool initialized!");
        Arc::new(pool)
    });
    Ok(Arc::clone(pool))
}

//Connect to DB
pub fn connect_to_db() -> Result<PooledConn, Box<dyn Error + Send + Sync>> {
    let pool = init_db()?;
    let conn = pool.get_conn()?;
    Ok(conn)
}

// Fetch User
pub fn verify_user(name: &str, pass: &str) -> Result<Option<User>, Box<dyn Error + Send + Sync>> {
    let mut conn = connect_to_db()?;
    let result: Option<User> = conn.exec_first(
        "SELECT name, user_id FROM users WHERE name = ? AND pass = ?",
        (name, pass),
    )?;

    if let Some(user) = result {
        return Ok(Some(user));
    }
    Ok(None)
}

// Fetch Account
pub fn fetch_balance(user_id: &str) -> Result<Option<Account>, Box<dyn Error + Send + Sync>> {
    let mut conn = connect_to_db()?;
    let result: Option<Account> = conn.exec_first(
        "SELECT account_id, balance FROM accounts WHERE user_id_1 = ? OR user_id_2 = ?",
        (user_id, user_id),
    )?;

    Ok(result)
}

//Fetch Transaction
pub fn fetch_transaction(
    conn: &mut PooledConn,
    transaction_id: &str,
) -> Result<Transaction, Box<dyn Error + Send + Sync>> {
    let transaction: Option<Transaction> = conn.exec_first(
        r"SELECT transaction_id, account_id, user_id, transaction_type, amount, transaction_date 
        FROM transactions WHERE transaction_id = :transaction_id",
        params! { "transaction_id" => transaction_id },
    )?;

    transaction.ok_or_else(|| "Transaction not found".into())
}

// Update Account Balance
fn update_account_balance(
    conn: &mut PooledConn,
    account_id: &str,
    amount: Decimal,
    transaction_type: &str,
) -> Result<(), Box<dyn Error + Send + Sync>> {
    let query = match transaction_type {
        "deposit" => {
            r"UPDATE accounts SET balance = balance + :amount WHERE account_id = :account_id"
        }
        "withdrawal" => {
            r"UPDATE accounts SET balance = balance - :amount WHERE account_id = :account_id"
        }
        _ => return Err("Invalid transaction type".into()),
    };

    conn.exec_drop(
        query,
        params! {
            "amount" => amount,
            "account_id" => account_id,
        },
    )?;

    Ok(())
}

//Generate a new Transaction ID
fn generate_transaction_id() -> String {
    Ulid::new().to_string()
}

//Insert Transaction
pub fn insert_transaction(
    conn: &mut PooledConn,
    account_id: &str,
    user_id: &str,
    amount: Decimal,
    transaction_type: &str,
) -> Result<Transaction, Box<dyn Error + Send + Sync>> {
    // Fetch Account Balance for the User
    let balance = fetch_balance(user_id)?
        .ok_or("Account not found before update")?
        .balance;

    // if transaction is withdrawal, check balance
    if transaction_type == "withdrawal" && balance < amount {
        return Err("Insufficient funds for withdrawal".into());
    }

    let transaction_id = generate_transaction_id();

    // query to execute transaction
    conn.exec_drop(
        r"INSERT INTO transactions (transaction_id, account_id, user_id, transaction_type, amount, transaction_date) 
        VALUES (:transaction_id, :account_id, :user_id, :transaction_type, :amount, CURRENT_TIMESTAMP)",
        params! {
            "transaction_id" => &transaction_id,
            "account_id" => account_id,
            "user_id" => user_id,
            "transaction_type" => transaction_type,
            "amount" => amount,
        },
    )?;

    // Update Balance
    update_account_balance(conn, account_id, amount, transaction_type)?;
    // Fetch the updated balance after the update
    let updated_balance = fetch_balance(user_id)?
        .ok_or("Account not found after update")?
        .balance;

    // fetch Transaction
    let transaction = fetch_transaction(conn, &transaction_id)?;

    // publish to channel send_balance_update(ably)
    let account_id_cloned = account_id.to_string();
    let user_id_cloned = user_id.to_string();
    tokio::spawn(async move {
        let result = panic::catch_unwind(|| {
            // Synchronous closure, no async code here
            async {
                // The async block now returns a Result type
                send_balance_update(&account_id_cloned, updated_balance, &user_id_cloned).await
            }
        });

        match result {
            Ok(async_block) => {
                // Now handle the Result returned by async_block
                match async_block.await {
                    Ok(_) => {
                        // Handle success
                    }
                    Err(e) => {
                        // Handle the error (e.g., logging)
                        eprintln!("Failed to send balance update to Ably: {}", e);
                    }
                }
            }
            Err(err) => {
                eprintln!("Task panicked: {:?}", err);
            }
        }
    });

    Ok(transaction)
}
