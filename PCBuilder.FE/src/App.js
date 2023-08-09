// import { useState } from "react";
import "./App.css";
// import Routers from "./components/router/Routers";
// import layoutAdmin from './router/layoutAdmin';
import jwt from "jwt-decode";
import Layout from "./router/Layout";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { loginSuccess, loginFailed } from "./redux/authSlice";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Check if the token exists in local storage
    const token = localStorage.getItem("tokenUser");
    if (token) {
      // If the token exists, decode it and dispatch the login success action
      try {
        const decodedUser = jwt(token);
        dispatch(loginSuccess(decodedUser));
      } catch (error) {
        // If there's an error decoding the token, dispatch the login failed action
        dispatch(loginFailed());
      }
    }
  }, [dispatch]);
  return (
    <div>
      <Layout />
    </div>
  );
}

export default App;
