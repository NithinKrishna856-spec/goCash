use base64::{engine::general_purpose, Engine as _}; 
use dotenv::dotenv;
use reqwest::Client;
use serde_json::json;
use std::env;

pub async fn send_balance_update(
    account_id: &str,
    balance: rust_decimal::Decimal,
) -> Result<(), Box<dyn std::error::Error>> {
    dotenv().ok();

    // Load ABLY_URL and ABLY_API_KEY from .env file
    let url = env::var("ABLY_URL")?;
    let api_key = env::var("ABLY_API_KEY")?;

    // Encode the API key correctly
    let auth_header = format!(
        "Basic {}",
        general_purpose::STANDARD.encode(api_key.as_bytes())
    );

    let body = json!({
        "name": "update_balance",
        "data": {
            "account_id": account_id,
            "balance": balance
        }
    });

    // Create the HTTP client
    let client = Client::new();

    // Send the POST request to the Ably API
    let response = client
        .post(&url)
        .header("Authorization", auth_header)
        .header("Content-Type", "application/json")
        .json(&body)
        .send()
        .await?;

    // Store status before consuming response
    let status = response.status();
    let error_text = response.text().await?;

    // Handle the response
    if status.is_success() {
        println!("Message published successfully.");
    } else {
        println!("Failed to send message: {} - {}", status, error_text);
    }

    Ok(())
}
