import { useState } from "react";
import Modal from "./Modal";
import { useTransaction } from "../hooks/use-trasactions";
import CustomAlert from "./CustomAlert";

function Withdraw({ account, user, onTransactionComplete }) {
  const [showModal, setShowModal] = useState(false);
  const [amount, setAmount] = useState("");
  const [error, setError] = useState(null);

  const handleSetAmount = (event) => {
    setAmount(event.target.value);
  };

  const handleModalToggle = (event) => {
    event.preventDefault();
    setShowModal((prev) => !prev);
  };

  const handleCloseModal = () => {
    setAmount("");
    setError(null);
    setShowModal(false);
  };

  const handleWithdraw = async (event) => {
    event.preventDefault();

    if (isNaN(amount) || amount <= 0) {
      setError("Please enter a valid amount greater than zero.");
      setAmount("");
      return;
    }

    if (!account?.account_id || !user?.user_id) {
      setError("Account or user information is missing. Please try again.");
      return;
    }

    const { transaction, error: txError } = await useTransaction(
      account.account_id,
      user.user_id,
      parseFloat(amount),
      "withdrawal"
    );

    if (transaction) {
      onTransactionComplete?.(transaction);
      handleCloseModal();
    } else {
      // console.error(txError);
      setError(txError || "Transaction failed. Please try again.");
    }
  };

  const isAmountValid = !isNaN(amount) && amount > 0;

  const WithdrawButton = (
    <div className="flex justify-end space-x-4">
      <button
        className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        onClick={handleCloseModal}
      >
        Close
      </button>
      <button
        className={`bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${
          !isAmountValid ? "opacity-50 cursor-not-allowed" : ""
        }`}
        onClick={handleWithdraw}
        disabled={!isAmountValid}
      >
        Withdraw
      </button>
    </div>
  );

  // Modal content
  const modalWithdraw = (
    <Modal onClose={handleCloseModal} actionBar={WithdrawButton}>
      <form onSubmit={handleWithdraw} className="p-4 space-y-4">
        <label className="block text-gray-300 font-bold mb-2">
          Enter amount you want to Withdraw $
        </label>
        <input
          value={amount}
          onChange={handleSetAmount}
          type="number"
          placeholder="$00.00"
          className="w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </form>
    </Modal>
  );

  return (
    <div>
      <button
        onClick={handleModalToggle}
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Withdraw
      </button>
      {showModal && modalWithdraw}
      {error && (
        <CustomAlert
          message={error}
          type="error"
          onClose={() => setError(null)}
        />
      )}
    </div>
  );
}

export default Withdraw;
