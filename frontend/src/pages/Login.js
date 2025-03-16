import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import styles from '../styles/Login.module.css'; // Import CSS module
import { validateLogin } from '../utils/LoginValidation'; // Import validation function
import { axiosPostData, axiosGetData } from '../utils/api'; // Import API functions

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    // Check if the user is already authenticated via SSO or session
    useEffect(() => {
        async function checkSession() {
            try {
                const response = await axiosGetData('https://localhost:4000/api/auth/session'); // Fetch user session
                if (response.user) {
                    navigate('/home'); // Redirect if already logged in
                }
            } catch (error) {
                console.error("Session check failed", error);
            }
        }

        checkSession();
    }, [navigate]);

    // Handle traditional email/password login
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent form submission from refreshing the page
        console.log("Login form submitted", { email, password });

        const validationError = validateLogin({ email, password });
        setErrors(validationError);

        if (Object.keys(validationError).length === 0) {
            setIsLoading(true);
            try {
                console.log("Sending login request to server");
                const response = await axiosPostData('https://localhost:4000/api/auth/login', { email, password });
                console.log("Login response received:", response);

                // Check if response or response.data is undefined
                if (!response || !response.data) {
                    throw new Error("Invalid response format");
                }

                // Set user state and navigate to home
                if (response.data.success) {
                    navigate('/home');
                } else {
                    console.log("Login failed - response was not successful");
                    setErrors({ password: response.data.message || "Invalid email or password" });
                }
            } catch (error) {
                console.error("Login request failed", error);
                
                // Check what type of error we're dealing with
                console.log("Error type:", typeof error);
                console.log("Error properties:", Object.keys(error));
                
                if (error.response) {
                    // The request was made and the server responded with a status code
                    // that falls out of the range of 2xx
                    console.log("Error response data:", error.response.data);
                    console.log("Error response status:", error.response.status);
                    
                    if (error.response.status === 400) {
                        setErrors((prevErrors) => ({
                            ...prevErrors,
                            password: error.response.data.error || "Invalid credentials",
                        }));
                    } else {
                        setErrors({ password: `Server error: ${error.response.status}` });
                    }
                } else if (error.request) {
                    // The request was made but no response was received
                    console.log("No response received from server");
                    setErrors({ password: "No response from server. Please check if the server is running." });
                } else {
                    // Something happened in setting up the request that triggered an Error
                    console.log("Error message:", error.message);
                    setErrors({ password: `Request setup error: ${error.message}` });
                }
            } finally {
                setIsLoading(false);
            }
        }
    };

    // Handle SSO login
    const handleSSOLogin = () => {
        window.location.href = "https://localhost:4000/api/auth/saml"; // Redirect to SAML login
    };

    return (
        <div className={`d-flex justify-content-center align-items-center vh-100 ${styles.background}`}>
            <div className={styles.container}>
                <div className={styles.productName}>bugHouse</div>

                <div className={`shadow-lg ${styles.formContainer}`}>
                    <h2 className={styles.title}>Login</h2>

                    {/* Display success message if redirected from signup */}
                    {location.state?.message && (
                        <div className="alert alert-success" role="alert">
                            {location.state.message}
                        </div>
                    )}

                    {/* Email/Password Login Form */}
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="email" className={styles.label}>Email address</label>
                            <input
                                type="email"
                                id="email"
                                placeholder="Enter email"
                                className="form-control input"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            {errors.email && <div className={styles.textDanger}>{errors.email}</div>}
                        </div>
                        <div className="mb-3">
                            <label htmlFor="password" className={styles.label}>Password</label>
                            <input
                                type="password"
                                id="password"
                                placeholder="Enter password"
                                className="form-control input"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            {errors.password && <div className={styles.textDanger}>{errors.password}</div>}
                        </div>
                        <button 
                            type="submit" 
                            className={`btn ${styles.loginButton}`}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Logging in...' : 'Login'}
                        </button>
                    </form>

                    {/* SSO Login Button */}
                    <button 
                        onClick={handleSSOLogin} 
                        className={`btn ${styles.ssologinButton}`}
                        disabled={isLoading}
                    >
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