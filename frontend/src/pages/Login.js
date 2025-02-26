import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import styles from '../styles/Login.module.css'; // Import CSS module
import { axiosGetData } from '../utils/api'; // Import axios GET function

function Login() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    // Check if the user is already authenticated
    useEffect(() => {
        async function checkSession() {
            try {
                const response = await axiosGetData('https://localhost:4000/api/auth/session'); // Fetch user session
                if (response.user) {
                    setUser(response.user);
                    navigate('/home'); // Redirect if already logged in
                }
            } catch (error) {
                console.error("Session check failed", error);
            }
        }

        checkSession();
    }, [navigate]);

    const handleSSOLogin = () => {
        window.location.href = "https://localhost:4000/api/auth/saml"; // Redirect to SAML login
    };

    return (
        <div className={`d-flex justify-content-center align-items-center vh-100 ${styles.background}`}>
            <div className={styles.container}>
                <div className={styles.productName}>bugHouse</div>

                <div className={`shadow-lg ${styles.formContainer}`}>
                    <h2 className={styles.title}>Login</h2>

                    {/* Display the success message if passed from signup */}
                    {location.state?.message && (
                        <div className="alert alert-success" role="alert">
                            {location.state.message}
                        </div>
                    )}

                    <button onClick={handleSSOLogin} className={`btn ${styles.loginButton}`}>
                        Login with SSO
                    </button>

                    <p className="mt-3 text-center">
                        Don't have an account? <Link to="/signup" className={styles.link}>Register</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login;
