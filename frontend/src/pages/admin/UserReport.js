import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from '../../styles/UserReport.module.css'; 
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const BACKEND_URL = 'http://localhost:4000';

const UserReport = () => {
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
    const fetchUserAndSessions = async () => {
      try {
        const userRes = await axios.get(`${BACKEND_URL}/api/users/${userId}`);
        setUser(userRes.data);

        let sessionsRes;

        if (userRes.data.role === 'Student') {
          sessionsRes = await axios.get(`${BACKEND_URL}/api/sessions/student/${userId}`);
        } else if (userRes.data.role === 'Tutor') {
          sessionsRes = await axios.get(`${BACKEND_URL}/api/sessions/tutor/${userId}`);
        } else {
          sessionsRes = { data: [] };
        }

        setSessions(sessionsRes.data);
      } catch (error) {
        console.error('Error fetching report data', error);
      }
    };

    fetchUserAndSessions();
  }, [userId]);

  if (!user) return <p>Loading user data...</p>;

  return (
    <div className={styles.mainContent}>
      <div className={styles.topBar}>
        <button onClick={() => navigate(-1)} className={styles.backButton}>
          ← Back
        </button>
      </div>

      <h1 className={styles.heading}>User Report</h1>

      <div className={styles.reportSection}>
        <h2>User Information</h2>
        <p><strong>Name:</strong> {user.firstName} {user.lastName}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Phone:</strong> {user.phone}</p>
        <p><strong>Role:</strong> {user.role}</p>
        <p><strong>Student ID:</strong> {user.studentID}</p>
      </div>

      <div className={styles.reportSection}>
        <h2>Session History</h2>
        {sessions && sessions.length > 0 ? (
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
}

export default UserReport;
