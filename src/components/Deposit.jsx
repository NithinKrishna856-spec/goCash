import { useState } from "react";
import Modal from "./Modal";
import { useTransaction } from "../hooks/use-trasactions";
import CustomAlert from "./CustomAlert";
function Deposit({ account, user, onTransactionComplete }) {
  const [showModal, setShowModal] = useState(false);
  const [amount, setAmount] = useState("");
  const [error, setError] = useState(null);

  const handleSetAmount = (event) => {
    const value = event.target.value;
    setAmount(value);
  };

  const handleModalToggle = (event) => {
    event.preventDefault();
    setShowModal(!showModal);
  };

  const handleCloseModal = () => {
    setAmount("");
    setError(null);
    setShowModal(false);
  };

  const handleDeposit = async (event) => {
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
      "deposit"
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

  const DepositButton = (
    <div className="flex justify-end space-x-4">
      <button
        className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        onClick={handleCloseModal}
      >
        Close
      </button>
      <button
        className={`bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded ${
          !isAmountValid ? "opacity-50 cursor-not-allowed" : ""
        }`}
        onClick={handleDeposit}
        disabled={!isAmountValid}
      >
        Deposit
      </button>
    </div>
  );

  const modelDeposit = (
    <Modal onClose={handleCloseModal} actionBar={DepositButton}>
      <form onSubmit={handleDeposit} className="p-4 space-y-4">
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
    </Modal>
  );

  return (
    <div>
      <button
        onClick={handleModalToggle}
        className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
      >
        Deposit
      </button>
      {showModal && modelDeposit}
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

export default Deposit;
