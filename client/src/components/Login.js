import React, { useState } from "react";
import axios from "axios";
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import CancelIcon from '@mui/icons-material/Cancel'
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import './Login.css';
import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

const logginSuccess = () => {
  toast.success("Login successfully! 🎬")
}

const logginFail = () => {
  toast.error("Please fill the data correctly.")
}


export const Login = ({setShowLogin}) => {
  const [_, setCookies] = useCookies(["access_token"]);

  const [userName, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const result = await axios.post("http://localhost:3001/auth/login", {
        userName,
        password,
      });

      setCookies("access_token", result.data.token);
      logginSuccess();
      window.localStorage.setItem("userID", result.data.userID);
      window.localStorage.setItem("userName", result.data.userName);
      // alert("login.");
      setShowLogin(false)
      // navigate("/home")
      console.log(result.data.userName)
      console.log("Access Token:", result.data.token);
    } catch (error) {
      logginFail();
      setError(error.response.data.message);
      console.log(error)
    }
  };

  return (
    <div className="login-container">
      <div className="login_box">
        <AccountBoxIcon/>
        <h2>Login</h2>
      </div>
      <form onSubmit={handleSubmit} className="form-1">
        <div className="form-group">
          <label htmlFor="userName">Username:</label>
          <input
            type="text"
            id="userName"
            placeholder="Enter your username"
            value={userName}
            onChange={(event) => setUsername(event.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            placeholder="Enter your password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>
        {error && <p className="error">{error}</p>}
        <button type="submit" className="login-button">Login</button>
      </form>
      <CancelIcon className="cancel-icon" onClick={() => setShowLogin(false)} fontSize="small"/>
    </div>
  );
};
