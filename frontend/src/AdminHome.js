import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './styles/AdminHome.module.css';

function AdminHome() {
    const navigate = useNavigate();

    // Function to handle logout and navigate back to login page
    const handleLogout = () => {
        localStorage.removeItem('role'); // Clear the role from localStorage
        navigate('/login'); // Redirect to login page
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.heading}>Admin Dashboard</h1>
            <p className={styles.welcome}>Welcome, Admin! Here’s an overview of your administrative tools.</p>

            {/* User Management Section */}
            <section className={styles.section}>
                <h2>User Management</h2>
                <p>Manage users in the system, including tutors and students.</p>
                <button className={styles.button} onClick={() => navigate('/manage-users')}>
                    View and Manage Users
                </button>
            </section>

            {/* Analytics Section */}
            <section className={styles.section}>
                <h2>System Analytics</h2>
                <p>View system analytics and performance data.</p>
                <button className={styles.button} onClick={() => navigate('/analytics')}>
                    View Analytics
                </button>
            </section>

            {/* Settings Section */}
            <section className={styles.section}>
                <h2>Settings</h2>
                <p>Configure system settings, roles, and permissions.</p>
                <button className={styles.button} onClick={() => navigate('/settings')}>
                    Go to Settings
                </button>
            </section>

            {/* Logout Button */}
            <button className={styles.logoutButton} onClick={handleLogout}>Logout</button>
        </div>
    );
}

export default AdminHome;
