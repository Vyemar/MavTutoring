import React, { useState } from "react";
import { useMsal } from "@azure/msal-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import styles from "../styles/Login.module.css"; 

// Get configuration from environment variables
const PROTOCOL = process.env.REACT_APP_PROTOCOL || "https";
const BACKEND_HOST = process.env.REACT_APP_BACKEND_HOST || "localhost";
const BACKEND_PORT = process.env.REACT_APP_BACKEND_PORT || "4000";
const BACKEND_URL = `${PROTOCOL}://${BACKEND_HOST}:${BACKEND_PORT}`;

function MicrosoftLogin() {
    const { instance } = useMsal();
    const navigate = useNavigate();
    const [loggingIn, setLoggingIn] = useState(false); 
    const [errors, setErrors] = useState("");
  
    const handleLogin = async () => {
        if (loggingIn) 
            return; // Redirects to page if logged in already
        setLoggingIn(true);

    try {
        // Start login
        const msalResponse = await instance.loginPopup({
            scopes: ["User.Read", "Calendars.ReadWrite"], // Permissions the App is requesting 
            prompt: "select_account", // Forces user to select an account to log into
            redirectUri: "http://localhost:3000/blank.html", 
        });

        instance.setActiveAccount(msalResponse.account); // Set active account of what user chose

        const email = msalResponse.account.username; // Username is the email

        const backendResponse = await axios.post(`${BACKEND_URL}/api/auth/microsoft-login`, // Send email to backend, checking if it's in Database
            { email },
            { withCredentials: true }
        );

        if (!backendResponse || !backendResponse.data) {
            setErrors("Your Microsoft account is not registered.");
        } else {
            navigate("/home");
        }

    } catch (err) {
      
        console.error("Microsoft login failed:", err);
      
    } finally { 

        setLoggingIn(false); // Button is disabled if not false

    }
  };

    return (
        <div className="text-center mt-3">
        <button
            onClick={handleLogin}
            className={`btn ${styles.ssologinButton}`} // Use same style as SSO
            disabled={loggingIn}
        >
            {loggingIn ? "Logging in..." : "Login with Microsoft"}
        </button>
        {errors && <div className={styles.textDanger}>{errors}</div>}
        </div>
  );
}

export default MicrosoftLogin;
