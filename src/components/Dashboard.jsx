import { invoke } from "@tauri-apps/api/core";
import { useEffect, useState } from "react";
import Skeleton from "./Skeleton";
import Withdraw from "./Withdraw";
import Deposit from "./Deposit";
import Transfer from "./Transfer";
import History from "./History";
import useWebSocketSub from "../hooks/use-websocket-sub";

function Dashboard({ onLogOut, user }) {
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [transaction, setTransaction] = useState([]);

  const fetchAccountDetails = async () => {
    try {
      setLoading(true);

      // DEV ONLY!!!!!!!!
      await new Promise((resolve) => setTimeout(resolve, 3000));

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

  useWebSocketSub(setAccount, setLoading);

  const handleLogout = () => {
    onLogOut();
  };
  const handleTransactionComplete = (result) => {
    setTransaction([...transaction, result]);
    // fetchAccountDetails();
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
        <History transaction={transaction} />
        <Transfer />
      </div>
    </div>
  );
}

export default Dashboard;
