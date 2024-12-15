import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import styles from './styles/Login.module.css'; // Import CSS module
import { validateLogin } from './LoginValidation'; // Import validation function
import { axiosPostData } from './api'; // Import axios post function

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    const location = useLocation(); // Hook to access passed state

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationError = await validateLogin({ email, password });
        setErrors(validationError);

        if (!validationError.email && !validationError.password) {
            try {
                const response = await axiosPostData('http://localhost:4000/api/auth/login', {
                    email,
                    password
                });

                if (response.success) {
                    // Store role in localStorage or state
                    localStorage.setItem('role', response.role); // Storing role

                    // Navigate to home
                    navigate('/home');
                }
            } catch (error) {
                // If error response is 400, display the server-side error message under password
                if (error.response && error.response.status === 400) {
                    setErrors((prevErrors) => ({
                        ...prevErrors,
                        password: error.response.data.error, // Display "Invalid email or password" under password field
                    }));
                } else {
                    console.error("Login error", error);
                }
            }
        }
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
                        <p className="mt-3 text-center">
                            Don't have an account? <Link to="/signup" className={styles.link}>Register</Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Login;
