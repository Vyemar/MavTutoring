import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './styles/StudentHome.module.css';

function StudentHome() {
    const navigate = useNavigate();
    const [schedule] = useState([
        { id: 1, time: '1:00pm - 2:00pm' },
        { id: 2, time: '3:00pm - 4:00pm' },
    ]);

    useEffect(() => {
        // Fetch schedule from MongoDB here
        // Example:
        // axios.get('/api/schedule').then(response => setSchedule(response.data));
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('role'); // Clear the role from localStorage
        navigate('/login'); // Redirect to login page
    };

    return (
        <div className={styles.container}>
            {/* Sidebar */}
            <div className={styles.sidebar}>
                <h1>bugHouse</h1>
                <button onClick={() => navigate('/home')}>Dashboard</button>
                <button onClick={() => navigate('/find-sessions')}>Find Sessions</button>
                <button onClick={() => navigate('/find-tutors')}>Find Tutors</button>
                <button onClick={() => navigate('/my-sessions')}>My Sessions</button>
                <button onClick={() => navigate('/my-tutors')}>My Tutors</button>
                <button onClick={() => navigate('/schedule')}>Schedule</button>
                <button onClick={() => navigate('/notifications')}>Notifications</button>
                <button className={styles.logoutButton} onClick={handleLogout}>
                    Log Out
                </button>
            </div>

            {/* Main Content */}
            <div className={styles.mainContent}>
                <h1 className={styles.heading}>Dashboard</h1>

                {/* Schedule Section */}
                <section>
                    <h2>This Week's Schedule</h2>
                    <div className={styles.schedule}>
                        {schedule.map((session) => (
                            <div key={session.id} className={styles.card}>
                                <p>Session {session.id}</p>
                                <p>{session.time}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Notifications Section */}
                <section className={styles.notifications}>
                    <h2>Notifications</h2>
                    <p>No new notifications</p>
                </section>
            </div>
        </div>
    );
}

export default StudentHome;