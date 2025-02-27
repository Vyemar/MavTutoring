import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import styles from '../styles/Login.module.css'; // Import CSS module
import { validateLogin } from '../utils/LoginValidation'; // Import validation function
import { axiosPostData, axiosGetData } from '../utils/api'; // Import API functions

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    // Check if the user is already authenticated via SSO or session
    useEffect(() => {
        async function checkSession() {
            try {
                const response = await axiosGetData('https://localhost:4000/api/auth/session'); // Fetch user session
                if (response.user) {
                    localStorage.setItem('role', response.user.role);
                    localStorage.setItem('userID', response.user.id);
                    setUser(response.user);
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
        e.preventDefault();

        const validationError = await validateLogin({ email, password });
        setErrors(validationError);

        if (!validationError.email && !validationError.password) {
            try {
                const response = await axiosPostData('http://localhost:4000/api/auth/login', { email, password });

                if (response.success) {
                    // Store user data in localStorage
                    localStorage.setItem('role', response.role);
                    localStorage.setItem('userID', response.ID);

                    // Navigate to home
                    navigate('/home');
                }
            } catch (error) {
                if (error.response && error.response.status === 400) {
                    setErrors((prevErrors) => ({
                        ...prevErrors,
                        password: error.response.data.error,
                    }));
                } else {
                    console.error("Login error", error);
                }
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
                                placeholder="Enter email"
                                className="form-control input"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            {errors.email && <div className={styles.textDanger}>{errors.email}</div>}
                        </div>
                        <div className="mb-3">
                            <label htmlFor="password" className={styles.label}>Password</label>
                            <input
                                type="password"
                                placeholder="Enter password"
                                className="form-control input"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            {errors.password && <div className={styles.textDanger}>{errors.password}</div>}
                        </div>
                        <button type="submit" className={`btn ${styles.loginButton}`}>
                            Login
                        </button>
                    </form>

                    {/* SSO Login Button */}
                    <button onClick={handleSSOLogin} className={`btn ${styles.ssologinButton}`}>
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