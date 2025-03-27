import { useState } from "react";
import Modal from "./Modal";

import { useTransaction } from "../hooks/use-trasactions";

function Deposit({ account, user, onTransactionComplete }) {
  const [showModal, setShowModal] = useState(false);
  const [amount, setAmount] = useState(0);
  const [error, setError] = useState(null);

  const handleSetAmount = (event) => {
    const value = parseFloat(event.target.value);
    setAmount(value);
  };
  const handleModel = (event) => {
    event.preventDefault();
    setShowModal(!showModal);
  };
  const handleModelClose = () => {
    setAmount(0);
    setError(null);
    setShowModal(false);
  };
  const handleClose = async (event) => {
    event.preventDefault();

    if (isNaN(amount) || amount <= 0) {
      setError("Please enter a valid amount greater than zero.");
      setAmount(0);
      return;
    }
    if (!account || !account.account_id) {
      setError("Account information is missing. Please try again.");
      return;
    }

    const account_id = account.account_id;
    const user_id = user?.user_id;
    const transaction_type = "deposit";

    const result = await useTransaction(
      account_id,
      user_id,
      amount,
      transaction_type
    );
    if (result && onTransactionComplete) {
      onTransactionComplete(result);
    }
    setAmount(0);
    setShowModal(false);
  };

  const DepositButton = (
    <div className="flex justify-end space-x-4">
      <button
        className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        onClick={handleModelClose}
      >
        Close
      </button>
      <button
        className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        onClick={handleClose}
      >
        Deposit
      </button>
    </div>
  );

  const modelDeposit = (
    <Modal onClose={handleClose} actionBar={DepositButton}>
      <form onSubmit={handleClose} className="p-4 space-y-4">
        <label className="block text-gray-300 font-bold mb-2">
          Enter amount you want to Deposit $
        </label>
        <input
          value={amount || ""}
          onChange={handleSetAmount}
          type="number"
          placeholder="$00.00"
          className="w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
        />
      </form>
      {error && <p className="text-red-500 p-4 space-y-4 text-sm">{error}</p>}
    </Modal>
  );

  return (
    <div>
      <button
        onClick={handleModel}
        className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
      >
        Deposit
      </button>
      {showModal && modelDeposit}
    </div>
  );
}

export default Deposit;
