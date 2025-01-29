import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../styles/AdminSidebar.module.css';
import { handleLogout } from "../../utils/authUtils";

function TutorSidebar({ onLogout }) {
    const navigate = useNavigate();

    return (
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
    );
}

export default TutorSidebar;
