import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../styles/TutorSidebar.module.css';
import { handleLogout } from "../../utils/authUtils";

function TutorSidebar({ onLogout }) {
    const navigate = useNavigate();

    return (
        <div className={styles.sidebar}>
            <h1>bugHouse</h1>
            <button onClick={() => navigate('/home')}>Dashboard</button>
            <button onClick={() => navigate('/courses')}>Courses</button>
            <button onClick={() => navigate('/availability')}>Set Availability</button>
            <button onClick={() => navigate('/schedule')}>View Schedule</button>
            <button onClick={() => navigate('/sessions')}>Sessions</button>
            <button onClick={() => navigate('/notifications')}>Notifications</button>
            <button className={styles.logoutButton} onClick={handleLogout}>
                Log Out
            </button>
        </div>
    );
}

export default TutorSidebar;
