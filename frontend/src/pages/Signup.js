import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from '../styles/Signup.module.css'; // Import CSS module
import { validateSignup } from '../utils/SignupValidation'; // Import validation function
import { axiosPostData } from '../utils/api'; // Import the axios post function

function Signup() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('Student');
    const [errors, setErrors] = useState({}); // State for storing validation errors
    const [successMessage, setSuccessMessage] = useState(''); // State for success message
    const navigate = useNavigate(); // Hook for navigation

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate form inputs
        const validationError = validateSignup({ firstName, lastName, phone, email, password });
        if (validationError.firstName || validationError.lastName || validationError.phone || validationError.email || validationError.password) {
            setErrors(validationError); // Set errors if validation fails
            return;
        }

        // Clear any previous errors
        setErrors({});

        // Use the axiosPostData function to send the form data
        try {
            const response = await axiosPostData('https://localhost:4000/api/auth/signup', {
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
        }
    };

    return (
        <div className={`d-flex justify-content-center align-items-center vh-100 ${styles.background}`}>
            <div className={styles.container}>
                {/* The product name outside and above the form */}
                <div className={styles.productName}>
                    bugHouse
                </div>

                <div className={`shadow-lg ${styles.formContainer}`}>
                    <h2 className={styles.title}>Sign Up</h2>
                    {successMessage && <div className="text-success">{successMessage}</div>}
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
                                {errors.email && <div className={styles.textDanger}>{errors.email}</div>}
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
