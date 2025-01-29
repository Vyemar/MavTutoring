import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../styles/TutorHome.module.css';
import TutorSidebar from '../../components/Sidebar/TutorSidebar';
import axios from 'axios';

function TutorHome() {
    const navigate = useNavigate();
    const [availability, setAvailability] = useState([]);
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        // Fetch availability and notifications from the server
        axios.get('/api/notifications/tutor')
            .then((response) => setNotifications(response.data))
            .catch((err) => console.error('Error fetching notifications:', err));
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('role'); // Clear the role from localStorage
        localStorage.removeItem('userID'); // Clear the ID from localStorage
        navigate('/login'); // Redirect to login page
    };

    return (
        <div className={styles.container}>
            {/* Use the TutorSidebar component */}
            <TutorSidebar onLogout={handleLogout} />

            {/* Main Content */}
            <div className={styles.mainContent}>
                <h1 className={styles.heading}>Dashboard</h1>

                {/* Availability Section */}
                <section>
                    <h2>Your Availability</h2>
                    <div className={styles.availability}>
                        {availability.length > 0 ? (
                            availability.map((slot, index) => (
                                <div key={index} className={styles.card}>
                                    <p>{slot.day}</p>
                                    <p>{slot.time}</p>
                                </div>
                            ))
                        ) : (
                            <p>No availability set. Use the "Set Availability" option to add slots.</p>
                        )}
                    </div>
                </section>

                {/* Notifications Section */}
                <section className={styles.notifications}>
                    <h2>Notifications</h2>
                    {notifications.length > 0 ? (
                        <ul>
                            {notifications.map((notification, index) => (
                                <li key={index}>{notification}</li>
                            ))}
                        </ul>
                    ) : (
                        <p>No new notifications</p>
                    )}
                </section>
            </div>
        </div>
    );
}

export default TutorHome;