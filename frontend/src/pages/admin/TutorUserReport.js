import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from '../../styles/UserReport.module.css';
import { useParams, useNavigate } from 'react-router-dom';

const BACKEND_URL = 'http://localhost:4000';

const TutorUserReport = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [sessions, setSessions] = useState([]);
  const navigate = useNavigate();

  const formatDateTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await axios.get(`${BACKEND_URL}/api/users/${userId}`);
        setUser(userRes.data);

        const sessionsRes = await axios.get(`${BACKEND_URL}/api/sessions/tutor/${userId}`);
        setSessions(sessionsRes.data);
      } catch (error) {
        console.error('Error fetching tutor report data', error);
      }
    };

    fetchData();
  }, [userId]);

  if (!user) return <p>Loading tutor data...</p>;

  return (
    <div className={styles.mainContent}>
      <div className={styles.topBar}>
        <button onClick={() => navigate(-1)} className={styles.backButton}>
          ← Back
        </button>
      </div>

      <h1 className={styles.heading}>Tutor Report</h1>

      <div className={styles.reportSection}>
        <h2>Tutor Information</h2>
        <p><strong>Name:</strong> {user.firstName} {user.lastName}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Phone:</strong> {user.phone}</p>
        <p><strong>Department:</strong> {user.department}</p>
      </div>

      <div className={styles.reportSection}>
        <h2>Session History</h2>
        {sessions.length > 0 ? (
          <ul className={styles.sessionList}>
            {sessions.map((session, index) => (
              <li key={index} className={styles.sessionItem}>
                <span>{formatDateTime(session.sessionTime)}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p>No sessions found.</p>
        )}
      </div>
    </div>
  );
};

export default TutorUserReport;
