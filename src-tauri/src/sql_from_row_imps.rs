
// used to convert SQL rows to their respective struct
use crate::models::{Account, Transaction, User};

// convert SQL rows to User struct
impl mysql::prelude::FromRow for User {
    fn from_row_opt(row: mysql::Row) -> Result<Self, mysql::FromRowError> {
        let (name, user_id): (String, String) = mysql::from_row_opt(row)?;
        Ok(User { name, user_id })
    }
}

// convert SQL rows to Account struct
impl mysql::prelude::FromRow for Account {
    fn from_row_opt(row: mysql::Row) -> Result<Self, mysql::FromRowError> {
        let (account_id, balance): (String, rust_decimal::Decimal) = mysql::from_row_opt(row)?;
        Ok(Account {
            account_id,
            balance,
        })
    }
}

// convert SQL rows to Transaction struct
impl mysql::prelude::FromRow for Transaction {
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