use serde::Serialize;

#[derive(Debug, PartialEq, Eq, Serialize)]
pub struct User {
  pub name: String,
  pub user_id: String,
}

#[derive(Debug, PartialEq, Eq, Serialize)]
pub struct Account {
    pub account_id: String,
    pub balance: rust_decimal::Decimal,
}

#[derive(Debug, PartialEq, Eq, Serialize)]
pub struct Transaction {
  pub transaction_id: String,
  pub account_id: String,
  pub user_id: String,
  pub transaction_type: String, 
  pub amount: rust_decimal::Decimal,
  pub transaction_date: chrono::NaiveDateTime, 
}
