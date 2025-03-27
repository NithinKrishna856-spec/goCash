import React, { useState } from "react";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({});

  const handleLogin = (user) => {
    setUser(user);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <main>
      {isLoggedIn ? (
        <Dashboard onLogOut={handleLogout} user={user} />
      ) : (
        <Login onLogIn={handleLogin} />
      )}
    </main>
  );
}

export default App;
