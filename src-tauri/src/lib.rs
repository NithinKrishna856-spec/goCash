mod db;
mod models;
mod websocket_pub;
use crate::models::Account;
use crate::models::Transaction;
use crate::models::User;

// Login
#[tauri::command]
fn login(name: &str, pass: &str) -> Result<Option<User>, String> {
    match db::verify_user(name, pass) {
        Ok(Some(user)) => Ok(Some(User {
            name: user.name,
            user_id: user.user_id,
        })),
        Ok(None) => Ok(None),
        Err(err) => Err(format!("Error checking user in DB: {}", err)),
    }
}

// Fetch Account Details
#[tauri::command]
fn account(user_id: &str) -> Result<Option<Account>, String> {
    match db::fetch_balance(user_id) {
        Ok(Some(account)) => Ok(Some(Account {
            account_id: account.account_id,
            balance: account.balance,
        })),
        Ok(None) => Ok(None),
        Err(err) => Err(format!("Error fetching account balance from DB: {}", err)),
    }
}

// Compute Transaction
#[tauri::command]
fn transaction(
    account_id: &str,
    user_id: &str,
    amount: rust_decimal::Decimal,
    transaction_type: &str,
) -> Result<Option<Transaction>, String> {
    println!(
        "Received: account_id={}, user_id={}, amount={}, transaction_type={}",
        account_id, user_id, amount, transaction_type
    );
    let mut conn =
        crate::db::connect_to_db().map_err(|err| format!("Error connecting to DB: {}", err))?;
    match db::insert_transaction(&mut conn, account_id, user_id, amount, transaction_type) {
        Ok(transaction) => Ok(Some(Transaction {
            transaction_id: transaction.transaction_id,
            account_id: transaction.account_id,
            user_id: transaction.user_id,
            transaction_type: transaction.transaction_type,
            amount: transaction.amount,
            transaction_date: transaction.transaction_date,
        })),
        Err(err) => Err(format!("Error in Transaction: {}", err)),
    }
}
#[tauri::command]
fn get_websocket_sub_api_key() -> String {
    std::env::var("REACT_APP_ABLY_API_KEY").unwrap_or_else(|_| "default-api-key".to_string())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let runtime = tokio::runtime::Runtime::new().expect("Failed to create Tokio runtime");
    runtime.block_on(async {
        tauri::Builder::default()
            .plugin(tauri_plugin_opener::init())
            .invoke_handler(tauri::generate_handler![
                login,
                account,
                get_websocket_sub_api_key,
                transaction
            ])
            .setup(|_app| {
                // Perform any setup tasks here
                Ok(())
            })
            .run(tauri::generate_context!())
            .expect("Error while running Tauri application");
    });
}
