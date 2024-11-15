import React from "react";
import { useNavigate } from "react-router-dom";
import styles from './styles/StudentHome.module.css'; // Import CSS module

function StudentHome() {
    const navigate = useNavigate();

    // Logout function to clear localStorage and navigate back to login page
    const handleLogout = () => {
        localStorage.removeItem('role');
        navigate('/login');
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.heading}>Home Page (Student)</h1>
            <p className={styles.welcome}>Welcome to your dashboard!</p>
            
            {/* Section for viewing courses */}
            <div className={styles.section}>
                <h2>View CSE Courses</h2>
                <button className={styles.button} onClick={() => navigate('/courses')}>Browse Courses</button>
            </div>

            {/* Section for viewing tutors */}
            <div className={styles.section}>
                <h2>View Tutors</h2>
                <button className={styles.button} onClick={() => navigate('/tutors')}>Find a Tutor</button>
            </div>

            {/* Section for scheduling a session */}
            <div className={styles.section}>
                <h2>Schedule a Session</h2>
                <button className={styles.button} onClick={() => navigate('/schedule')}>Schedule Now</button>
            </div>

            {/* Section for leaving feedback */}
            <div className={styles.section}>
                <h2>Leave Feedback</h2>
                <button className={styles.button} onClick={() => navigate('/feedback')}>Give Feedback</button>
            </div>

            {/* Logout button */}
            <button className={styles.logoutButton} onClick={handleLogout}>Logout</button>
        </div>
    );
}

export default StudentHome;
