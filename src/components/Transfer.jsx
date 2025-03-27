import { useState } from "react";
import Modal from "./Modal";

function Transfer() {
  const [showModal, setShowModal] = useState(false);
  const handleModel = (event) => {
    event.preventDefault();
    setShowModal(!showModal);
  };
  const handleClose = () => {
    setShowModal(false);
  };

  const TransferButton = (
    <div>
      <button
        className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
        onClick={handleClose}
      >
        Transfer
      </button>
    </div>
  );

  const modelTransfer = (
    <Modal onClose={handleClose} actionBar={TransferButton}>
      Not Implemented
    </Modal>
  );

  return (
    <div>
      <button
        onClick={handleModel}
        className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
      >
        Transfer
      </button>
      {showModal && modelTransfer}
    </div>
  );
}

export default Transfer;
