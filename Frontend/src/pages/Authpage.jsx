import React, { useState } from "react";
import Login from "../components/Login";
import Register from "../components/Register";

const AuthPage = () => {
  const [showLogin, setShowLogin] = useState(true);

  return showLogin ? (
    <Login state={setShowLogin} />
  ) : (
    <Register state={setShowLogin} />
  );
};

export default AuthPage;