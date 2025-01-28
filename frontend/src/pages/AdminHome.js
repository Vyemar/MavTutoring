import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/AdminHome.module.css';

function AdminHome() {
    const navigate = useNavigate();

    // Function to handle logout and navigate back to login page
    const handleLogout = () => {
        localStorage.removeItem('role'); // Clear the role from localStorage
        localStorage.removeItem('userID'); // Clear the ID from localStorage
        navigate('/login'); // Redirect to login page
    };

    return (
        <div className={styles.container}>
            {/* Sidebar */}
            <div className={styles.sidebar}>
                <h1>bugHouse</h1>
                <button onClick={() => navigate('/home')}>Dashboard</button>
                <button onClick={() => navigate('/manage-users')}>Manage Users</button>
                <button onClick={() => navigate('/analytics')}>System Analytics</button>
                <button onClick={() => navigate('/settings')}>Settings</button>
                <button className={styles.logoutButton} onClick={handleLogout}>
                    Log Out
                </button>
            </div>

            {/* Main Content */}
            <div className={styles.mainContent}>
                <h1 className={styles.heading}>Admin Dashboard</h1>

                {/* User Management Section */}
                <section className={styles.section}>
                    <h2>User Management</h2>
                    <p>Manage users in the system, including tutors and students.</p>
                    <button onClick={() => navigate('/manage-users')}>View and Manage Users</button>
                </section>

                {/* Analytics Section */}
                <section className={styles.section}>
                    <h2>System Analytics</h2>
                    <p>View system analytics and performance data.</p>
                    <button onClick={() => navigate('/analytics')}>View Analytics</button>
                </section>

                {/* Settings Section */}
                <section className={styles.section}>
                    <h2>Settings</h2>
                    <p>Configure system settings, roles, and permissions.</p>
                    <button onClick={() => navigate('/settings')}>Go to Settings</button>
                </section>
            </div>
        </div>
    );
}

export default AdminHome;