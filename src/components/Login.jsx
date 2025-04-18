import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import CustomAlert from "./CustomAlert";
function Login({ onLogIn }) {
  const [name, setName] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState(null);

  async function login() {
    const user = await invoke("login", { name, pass });

    if (user) {
      onLogIn(user);
    } else {
      setError({
        message: "Invalid credentials. Please try again.",
        type: "error",
      });
    }
  }

  const handleCloseError = () => {
    setError(null);
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-800 to-gray-900">
      <h1 className="text-5xl font-extrabold text-green-500 mb-10 drop-shadow-lg">
        GoCa$h
      </h1>

      <form
        className="bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-md"
        onSubmit={(e) => {
          e.preventDefault();
          login();
        }}
      >
        <div className="mb-6">
          <label className="block text-gray-300 font-medium mb-2">
            Username
          </label>
          <input
            className="w-full px-4 py-3 border border-gray-600 bg-gray-700 text-gray-200 rounded-lg focus:outline-none focus:ring-4 focus:ring-green-500"
            onChange={(e) => setName(e.currentTarget.value)}
            placeholder="Enter your username"
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-300 font-medium mb-2">
            Password
          </label>
          <input
            className="w-full px-4 py-3 border border-gray-600 bg-gray-700 text-gray-200 rounded-lg focus:outline-none focus:ring-4 focus:ring-green-500"
            onChange={(e) => setPass(e.currentTarget.value)}
            placeholder="Enter your password"
            type="password"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition duration-300 shadow-md"
        >
          Login
        </button>
      </form>

      {/* Display CustomAlert if error exists */}
      {error && (
        <CustomAlert
          message={error.message}
          type={error.type}
          onClose={handleCloseError}
        />
      )}
    </main>
  );
}

export default Login;
