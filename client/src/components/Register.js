import React, { useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import CancelIcon from '@mui/icons-material/Cancel';
import "./Register.css";
import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

const registerSuccess = () => {
  toast.success("Registration Completed! Now login.")
}

const registerFail = () => {
  toast.error("Please fill in the data correctly.")
}


export const Register = ({setShowRegister}) => {
  const [userName, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errorMessages, setErrorMessages] = useState([]);


  const [_, setCookies] = useCookies(["access_token"]);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.post("http://localhost:3001/auth/register", {
        userName,
        email,
        password,
      });
      // alert("Registration Completed! Now login.");
      registerSuccess()
      setShowRegister(false)
      // navigate("/login")
  //   } catch (error) {
  //     registerFail()
  //     console.error(error);
  //   }
  // };
// } catch (error) {
//     console.log(error)
//   }
// };
} catch (error) {
  if (error.response && error.response.data && error.response.data.errors) {
    setErrorMessages(error.response.data.errors);
  } else {
    setErrorMessages(["An error occurred during registration"]);
  }
  console.log(error);
}
};



  return (
    <div className="register-container">
      <div className="register-box">
        <PersonAddIcon/>
        <h2>Register</h2>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="userName">Username:</label>
          <input
            type="text"
            id="userName"
            placeholder="Enter a username"
            value={userName}
            onChange={(event) => setUsername(event.target.value)}
          />
        
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            placeholder="Enter a email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            placeholder="Enter a password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            />
          
        </div>
        {errorMessages.length > 0 && (
          <div className="error-messages">
            {errorMessages.map((errorMessage, index) => (
              <span key={index}>{errorMessage}</span>
            ))}
          </div>
        )}
        <button type="submit" className="register-button">Registro</button>
      </form>
      <CancelIcon className="cancel-icon" onClick={() => setShowRegister(false)} fontSize="small"/>
    </div>
  );
};
