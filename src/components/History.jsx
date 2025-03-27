import { useState } from "react";
import Modal from "./Modal";

function History({ transaction }) {
  const [showModal, setShowModal] = useState(false);
  const handleModel = (event) => {
    event.preventDefault();
    setShowModal(!showModal);
  };
  const handleClose = () => {
    setShowModal(false);
  };

  const HistoryButton = (
    <div>
      <button
        className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        onClick={handleClose}
      >
        Close
      </button>
    </div>
  );

  const modelHistory = (
    <Modal onClose={handleClose} actionBar={HistoryButton}>
      <table className="table-auto border-collapse border border-gray-400 w-full text-left">
        <thead>
          <tr>
            <th className="border border-gray-400 px-4 py-2">Type</th>
            <th className="border border-gray-400 px-4 py-2">Amount</th>
            <th className="border border-gray-400 px-4 py-2">Date</th>
          </tr>
        </thead>
        <tbody>
          {transaction.map((item, index) => {
            const formattedDate = new Date(
              item.transaction_date
            ).toLocaleString();
            return (
              <tr key={index}>
                <td className="border border-gray-400 px-4 py-2">
                  {item.transaction_type}
                </td>
                <td className="border border-gray-400 px-4 py-2">
                  {item.amount}
                </td>
                <td className="border border-gray-400 px-4 py-2">
                  {formattedDate}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </Modal>
  );

  return (
    <div>
      <button
        onClick={handleModel}
        className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded"
      >
        History
      </button>
      {showModal && modelHistory}
    </div>
  );
}

export default History;
