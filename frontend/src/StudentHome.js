import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './styles/StudentHome.module.css';
import StudentWeeklyCalendar from './StudentWeeklyCalendar';

function StudentHome() {
    const navigate = useNavigate();
    const [schedule, setSchedule] = useState([
        { id: 1, day: 'Monday', time: '1:00 PM', title: 'CSE 1325 Tutoring' },
        { id: 2, day: 'Wednesday', time: '3:00 PM', title: 'Coding Assignment Help' },
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

            {/* Section for viewing tutors */}
            <div className={styles.section}>
                <h2>View Tutors</h2>
                <button className={styles.button} onClick={() => navigate('/Viewtutors')}>Find a Tutor</button>
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
        </div>
    );
}

export default StudentHome;