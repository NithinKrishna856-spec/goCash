use crate::models::Account;
use crate::models::Transaction;
use crate::models::User;
use crate::websocket_pub::send_balance_update;
use dotenv::dotenv;
use mysql::prelude::Queryable;
use mysql::{params, Opts, OptsBuilder, Pool, PooledConn};
use rust_decimal::Decimal;
use std::env;
use std::error::Error;
use std::panic;
use std::sync::{Arc, OnceLock};
use tokio;
use uuid::Uuid;
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
impl mysql::prelude::FromRow for User {
    fn from_row(row: mysql::Row) -> Self {
        let (name, user_id): (String, String) = mysql::from_row(row);
        User { name, user_id }
    }

    fn from_row_opt(row: mysql::Row) -> Result<Self, mysql::FromRowError> {
        let (name, user_id): (String, String) = mysql::from_row_opt(row)?;
        Ok(User { name, user_id })
    }
}
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
impl mysql::prelude::FromRow for Account {
    fn from_row(row: mysql::Row) -> Self {
        let (account_id, balance): (String, rust_decimal::Decimal) = mysql::from_row(row);
        Account {
            account_id,
            balance,
        }
    }

    fn from_row_opt(row: mysql::Row) -> Result<Self, mysql::FromRowError> {
        let (account_id, balance): (String, rust_decimal::Decimal) = mysql::from_row_opt(row)?;
        Ok(Account {
            account_id,
            balance,
        })
    }
}
pub fn fetch_balance(user_id: &str) -> Result<Option<Account>, Box<dyn Error + Send + Sync>> {
    let mut conn = connect_to_db()?;
    let result: Option<Account> = conn.exec_first(
        "SELECT account_id, balance FROM accounts WHERE user_id_1 = ? OR user_id_2 = ?",
        (user_id, user_id),
    )?;

    Ok(result)
}

//Generate a new Transaction ID
fn generate_transaction_id() -> String {
    Uuid::new_v4().to_string()[..6].to_string()
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

//Fetch Transaction
impl mysql::prelude::FromRow for Transaction {
    fn from_row(row: mysql::Row) -> Self {
        let (transaction_id, account_id, user_id, transaction_type, amount, transaction_date): (
            String,
            String,
            String,
            String,
            rust_decimal::Decimal,
            chrono::NaiveDateTime,
        ) = mysql::from_row(row);

        Transaction {
            transaction_id,
            account_id,
            user_id,
            transaction_type,
            amount,
            transaction_date,
        }
    }

    fn from_row_opt(row: mysql::Row) -> Result<Self, mysql::FromRowError> {
        let (transaction_id, account_id, user_id, transaction_type, amount, transaction_date) =
            mysql::from_row_opt(row)?;
        Ok(Transaction {
            transaction_id,
            account_id,
            user_id,
            transaction_type,
            amount,
            transaction_date,
        })
    }
}
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
//Insert Transaction

pub fn insert_transaction(
    conn: &mut PooledConn,
    account_id: &str,
    user_id: &str,
    amount: Decimal,
    transaction_type: &str,
) -> Result<Transaction, Box<dyn Error + Send + Sync>> {
    // Fetch Account Balance for the User
    let account = fetch_balance(user_id)?;
    let account = match account {
        Some(account) => account,
        None => return Err("Account not found".into()),
    };

    if transaction_type == "withdrawal" && account.balance < amount {
        return Err("Insufficient funds for withdrawal".into());
    }

    let transaction_id = generate_transaction_id();

    // ✅ Ensure transaction_date is stored
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

    update_account_balance(conn, account_id, amount, transaction_type)?;
    // Fetch the updated balance after the update
    let updated_account = fetch_balance(user_id)?;
    let updated_balance = match updated_account {
        Some(account) => account.balance,
        None => return Err("Account not found after update".into()),
    };
    let transaction = fetch_transaction(conn, &transaction_id)?;
    let account_id_cloned = account_id.to_string();
    tokio::spawn(async move {
        let result = panic::catch_unwind(|| {
            // Synchronous closure, no async code here
            async {
                // The async block now returns a Result type
                send_balance_update(&account_id_cloned, updated_balance).await
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
