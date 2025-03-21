import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from '../styles/Signup.module.css';
import { validateSignup } from '../utils/SignupValidation';
import { axiosPostData } from '../utils/api';

// Get configuration from environment variables
const PROTOCOL = process.env.REACT_APP_PROTOCOL || 'https';
const BACKEND_HOST = process.env.REACT_APP_BACKEND_HOST || 'localhost';
const BACKEND_PORT = process.env.REACT_APP_BACKEND_PORT || '4000';

// Construct the backend URL dynamically
const BACKEND_URL = `${PROTOCOL}://${BACKEND_HOST}:${BACKEND_PORT}`;

function Signup() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('Student');
    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');
    const [serverError, setServerError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Clear any previous errors
        setErrors({});
        setServerError('');

        // Validate form inputs
        const validationError = validateSignup({ firstName, lastName, phone, email, password });
        if (validationError.firstName || validationError.lastName || validationError.phone || validationError.email || validationError.password) {
            setErrors(validationError);
            return;
        }

        // Use the axiosPostData function to send the form data
        try {
            const response = await axiosPostData(`${BACKEND_URL}/api/auth/signup`, {
                firstName,
                lastName,
                phone,
                email,
                password, 
                role
            });
            
            console.log(response);
            setSuccessMessage("Signup successful!");

            // Navigate to login page and pass success message
            navigate('/login', { state: { message: "Account Successfully Created!" } });

        } catch (error) {
            console.error('There was an error submitting the form!', error);
            
            // Check if it's a duplicate email error
            if (error.response && error.response.data) {
                if (error.response.data.error === "Email already in use" || 
                    error.response.data.message?.includes("duplicate") || 
                    error.response.data.error?.includes("duplicate") ||
                    error.response.message?.includes("E11000")) {
                    setErrors({...errors, email: "This email is already registered"});
                } else {
                    // Handle other server errors
                    setServerError(error.response.data.message || 
                                  error.response.data.error || 
                                  "An error occurred during signup. Please try again.");
                }
            } else {
                // Network or other errors
                setServerError("Unable to connect to the server. Please try again later.");
            }
        }
    };

    return (
        <div className={`d-flex justify-content-center align-items-center vh-100 ${styles.background}`}>
            <div className={styles.container}>
                <div className={styles.productName}>
                    bugHouse
                </div>

                <div className={`shadow-lg ${styles.formContainer}`}>
                    <h2 className={styles.title}>Sign Up</h2>
                    {successMessage && <div className="text-success">{successMessage}</div>}
                    {serverError && <div className={styles.textDanger}>{serverError}</div>}
                    
                    <form onSubmit={handleSubmit}>
                        <div className={styles.row}>
                            <div className={styles.column}>
                                <label htmlFor="firstName" className={styles.label}>First Name</label>
                                <input
                                    type="text"
                                    placeholder="First Name"
                                    className={`form-control ${styles.input}`}
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                />
                                {errors.firstName && <div className={styles.textDanger}>{errors.firstName}</div>}
                            </div>
                            <div className={styles.column}>
                                <label htmlFor="lastName" className={styles.label}>Last Name</label>
                                <input
                                    type="text"
                                    placeholder="Last Name"
                                    className={`form-control ${styles.input}`}
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                />
                                {errors.lastName && <div className={styles.textDanger}>{errors.lastName}</div>}
                            </div>
                        </div>
                        <div className={styles.row}>
                            <div className={styles.column}>
                                <label htmlFor="phone" className={styles.label}>Phone</label>
                                <input
                                    type="tel"
                                    placeholder="Phone Number"
                                    className={`form-control ${styles.input}`}
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                />
                                {errors.phone && <div className={styles.textDanger}>{errors.phone}</div>}
                            </div>
                            <div className={styles.column}>
                                <label htmlFor="email" className={styles.label}>Email</label>
                                <input
                                    type="email"
                                    placeholder="Email"
                                    className={`form-control ${styles.input}`}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                {errors.email && <div className={styles.textDanger}>{errors.email}</div>}
                            </div>
                        </div>
                        <div className={styles.row}>
                            <div className={styles.column}>
                                <label htmlFor="password" className={styles.label}>Password</label>
                                <input
                                    type="password"
                                    placeholder="Password"
                                    className={`form-control ${styles.input}`}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                {errors.password && <div className={styles.textDanger}>{errors.password}</div>}
                            </div>
                            <div className={styles.column}>
                                <label htmlFor="role" className={styles.label}>Role</label>
                                <select
                                    className={`form-control ${styles.select}`}
                                    value={role} 
                                    onChange={e => setRole(e.target.value)}>
                                        <option value="Student">Student</option>
                                        <option value="Tutor">Tutor</option>
                                </select>
                            </div>
                        </div>
                        <button type="submit" className={`btn ${styles.signupButton}`}>
                            Sign Up
                        </button>
                        <p className="mt-3 text-center">
                            Already have an account? <Link to="/login" className={styles.link}>Login</Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Signup;