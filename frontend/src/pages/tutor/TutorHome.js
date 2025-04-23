import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../styles/TutorHome.module.css';
import TutorSidebar from '../../components/Sidebar/TutorSidebar';
import axios from 'axios';
import TutorCalendar from "./TutorCalendar";

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

    return (
        <div className={styles.container}>
            {/* Use the TutorSidebar component */}
            <TutorSidebar selected="home"/>

            {/* Main Content */}
            <div className={styles.mainContent}>
                <h1 className={styles.heading}>Tutor Dashboard</h1>

                {/* Schedule Section */}
                <section className = {styles.tutorHomeSec}>
                    <h2 className = {styles.calSubHeading}>Calendar</h2>
                        <TutorCalendar />
                    </section>

                {/* Availability Section */}
                <section className = {styles.tutorHomeSec}>
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