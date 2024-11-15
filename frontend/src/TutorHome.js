import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './styles/TutorHome.module.css'; // Adjust the path if needed

function TutorHome() {
    const navigate = useNavigate();

    // Function to handle logout and navigate back to login page
    const handleLogout = () => {
        localStorage.removeItem('role');  // Clear the role from localStorage
        navigate('/login');  // Redirect to login page
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.heading}>Welcome to the Tutor Dashboard</h1>
            <p className={styles.description}>
                Here you can access your tutoring schedule, review students’ progress, and manage your sessions.
            </p>
            <button className={styles.logoutButton} onClick={handleLogout}>Logout</button>
        </div>
    );
}

export default TutorHome;
