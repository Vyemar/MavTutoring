import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from '../../styles/UserReport.module.css';
import { useParams, useNavigate } from 'react-router-dom';

const BACKEND_URL = 'http://localhost:4000';

const TutorUserReport = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [viewOption, setViewOption] = useState('sessions');
  const [ratings, setRatings] = useState([]);
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

        const ratingsRes = await axios.get(`${BACKEND_URL}/api/feedback/ratings/tutor/${userId}`);
        setRatings(ratingsRes.data);

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
        <p><strong>Major:</strong> {user.major && user.major.trim() !== "" ? user.major : "N/A"}</p>
      </div>

      <div className={styles.reportSection}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <select
            value={viewOption}
            onChange={(e) => setViewOption(e.target.value)}
            style={{ padding: '6px 10px', fontSize: '1rem' }}
          >
            <option value="sessions">Session History</option>
            <option value="ratings">Ratings by Students</option>
          </select>

          <select style={{ padding: '6px 10px', fontSize: '1rem' }}>
            <option value="alphabetical">Sort by: Alphabetical</option>
            <option value="highest">Sort by: Highest Number</option>
            <option value="lowest">Sort by: Lowest Number</option>
          </select>
        </div>

        {viewOption === 'sessions' ? (
          sessions.length > 0 ? (
            <ul className={styles.sessionList}>
              {sessions.map((session, index) => (
                <li key={index} className={styles.sessionItem}>
                  <span>{formatDateTime(session.sessionTime)}</span>
                  <span>Student: {session.studentID?.firstName} {session.studentID?.lastName}</span>
                  <span>Course: {session.courseID?.code} - {session.courseID?.title}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p>No sessions found.</p>
          )
        ) : (
          ratings.length > 0 ? (
            <ul className={styles.sessionList}>
              {ratings.map((rating, index) => (
                <li key={index} className={styles.sessionItem}>
                  <span>
                     {rating.score} - "{rating.comment || 'No comment'}"
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p>No ratings found.</p>
          )
        )}
      </div>
    </div>
  );
};

export default TutorUserReport;
