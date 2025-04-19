import { useEffect } from "react";

function CustomAlert({ message, type, onClose }) {
  let alertColor;

  switch (type) {
    case "success":
      alertColor = "bg-green-600";
      break;
    case "error":
      alertColor = "bg-red-600";
      break;
    case "warning":
      alertColor = "bg-yellow-600";
      break;
    case "info":
      alertColor = "bg-blue-600";
      break;
    default:
      alertColor = "bg-gray-600";
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 10000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
  className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4 rounded-lg shadow-lg ${alertColor} text-white z-50`}
>

      <div className="flex justify-between items-center">
        <p>{message}</p>
        <button
          className="ml-4 bg-white text-black font-bold py-1 px-2 rounded"
          onClick={onClose}
        >
          X
        </button>
      </div>
    </div>
  );
}

export default CustomAlert;
