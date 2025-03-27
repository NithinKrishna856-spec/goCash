import { useEffect } from "react";
import ReactDOM from "react-dom";
function Modal({ onClose, children, actionBar }) {
  useEffect(() => {
    document.body.classList.add("overflow-hidden");
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, []);
  return ReactDOM.createPortal(
    <div>
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black opacity-50 backdrop-blur-2xl"
      ></div>
      <div className="fixed top-15 bottom-20 left-40 right-40 p-10 bg-gray-800 text-white rounded-lg shadow-lg">
        <div className="flex flex-col justify-between h-full">
          <div className="mb-4">{children}</div>
          <div className="flex justify-end space-x-4">{actionBar}</div>
        </div>
      </div>
    </div>,
    document.querySelector(".modal-container")
  );
}
export default Modal;
