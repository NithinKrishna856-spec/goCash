import { invoke } from "@tauri-apps/api/core";
import { useEffect, useState } from "react";
import Skeleton from "./Skeleton";
import Withdraw from "./Withdraw";
import Deposit from "./Deposit";
import History from "./History";
import useWebSocketSub from "../hooks/use-websocket-sub";
import CustomAlert from "./CustomAlert";

function Dashboard({ onLogOut, user }) {
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [successMessage, setSuccessMessage] = useState(null);
  const [type, setType] = useState("success");

  const fetchAccountDetails = async () => {
    try {
      setLoading(true);

      // DEV ONLY!!!!!!!!
      // await new Promise((resolve) => setTimeout(resolve, 3000));

      const accountDetails = await invoke("account", {
        userId: user.user_id,
      });

      setAccount(accountDetails);
    } catch (error) {
      console.error("Failed to fetch account details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccountDetails();
  }, [user.user_id]);

  const onAccountUpdate = (updatedBalance) => {
    if (updatedBalance.user_id !== user.user_id) {
      setType("info");
      setSuccessMessage("Updated by Other user");
      setAccount((prev) => ({ ...prev, balance: updatedBalance.balance }));
    }
  };

  useWebSocketSub(onAccountUpdate, user);

  const handleLogout = () => {
    onLogOut();
  };

  const handleTransactionComplete = (result) => {
<<<<<<< HEAD
    setTransaction([...transaction, result]);
    // fetchAccountDetails();
=======
    if (!result) {
      console.log("Error message received:", result);
      return;
    } else {
      setTransactions([...transactions, result]);

      const transactionType = result.transaction_type;
      const transactionAmount = result.amount;
      console.log(transactionAmount, transactionType);

      let message = "";
      if (transactionType === "deposit") {
        message = `Deposit of $${transactionAmount} was successful!`;
      } else if (transactionType === "withdrawal") {
        message = `Withdrawal of $${transactionAmount} was successful!`;
      } else {
        message = "Transaction successful!";
      }

      setSuccessMessage(message);
      setType("success");
      fetchAccountDetails();
    }
>>>>>>> upstream/main
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen p-6">
      <h1 className="text-4xl font-bold mb-4 text-green-500">GoCa$h</h1>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl">Dashboard</h3>
        <button
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
      <p className="text-lg mb-6">
        Welcome Back, <span className="text-green-500">{user.name}</span>
      </p>
      {account ? (
        <div className="bg-gray-800 p-4 rounded shadow-md">
          <h4 className="text-xl font-semibold mb-2 text-green-500">
            Account Details:
          </h4>
          <div className="flex">
            <p className="mb-1 mr-10">AccountNo:</p>
            <p className="mb-1 text-green-500">{account.account_id}</p>
          </div>
          <div className="flex">
            <p className="ml-6 mr-9">Balance:</p>
            {loading ? (
              <Skeleton times={1} className="h-10 w-full" />
            ) : (
              <p className="text-green-500">${account.balance}</p>
            )}
          </div>
        </div>
      ) : (
        <Skeleton times={3} className="h-10 w-full " />
      )}
      <div className="mt-6 flex justify-center gap-4 ">
        <Withdraw
          account={account}
          user={user}
          onTransactionComplete={handleTransactionComplete}
        />
        <Deposit
          account={account}
          user={user}
          onTransactionComplete={handleTransactionComplete}
        />
        <History transaction={transactions} />
        <Transfer />
      </div>

      {successMessage && (
        <CustomAlert
          message={successMessage}
          type={type}
          onClose={() => setSuccessMessage(null)}
        />
      )}
    </div>
  );
}

export default Dashboard;
