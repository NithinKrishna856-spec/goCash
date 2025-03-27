import { invoke } from "@tauri-apps/api/core";

async function useTransaction(account_id, user_id, amount, transaction_type) {
  try {
    const transaction = await invoke("transaction", {
      accountId: account_id,
      userId: user_id,
      amount,
      transactionType: transaction_type,
    });

    return transaction ?? null;
  } catch (error) {
    console.error("Transaction failed:", error);
    return null;
  }
}

export { useTransaction };
