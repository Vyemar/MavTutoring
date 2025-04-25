import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../styles/TutorHome.module.css';
import TutorSidebar from '../../components/Sidebar/TutorSidebar';
import axios from 'axios';
import TutorCalendar from "./TutorCalendar";
import { useSidebar } from "../../components/Sidebar/SidebarContext";

function TutorHome() {
    const navigate = useNavigate();
    const { isCollapsed } = useSidebar();
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
            <div className={styles.mainContent} style={{ marginLeft: isCollapsed ? "90px" : "280px" , transition: "margin-left 0.5s ease"}}
>
                <h1 className={styles.heading}>Tutor Dashboard</h1>

                {/* Schedule Section */}
                <section className = {styles.tutorHomeSec}>
                    <h2 className = {styles.calSubHeading}>Calendar</h2>
                        <TutorCalendar />
                    </section>
            </div>
        </div>
    );
}

export default TutorHome;