import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from '../../styles/UserReport.module.css';
import { useParams, useNavigate } from 'react-router-dom';

const BACKEND_URL = 'http://localhost:4000';

const StudentUserReport = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [viewOption, setViewOption] = useState('sessions');
  const [courseHistory, setCourseHistory] = useState([]);
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

        const sessionsRes = await axios.get(`${BACKEND_URL}/api/sessions/student/${userId}`);
        setSessions(sessionsRes.data);

        const coursesRes = await axios.get(`${BACKEND_URL}/api/sessions/student/${userId}/courses`);
        setCourseHistory(coursesRes.data);
        
      } catch (error) {
        console.error('Error fetching student report data', error);
      }
    };

    fetchData();
  }, [userId]);

  if (!user) return <p>Loading student data...</p>;

  return (
    <div className={styles.mainContent}>
      <div className={styles.topBar}>
        <button onClick={() => navigate(-1)} className={styles.backButton}>
          ← Back
        </button>
      </div>

      <h1 className={styles.heading}>Student Report</h1>

      <div className={styles.reportSection}>
        <h2>Student Information</h2>
        <p><strong>Name:</strong> {user.firstName} {user.lastName}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Major:</strong> {user.major && user.major.trim() !== "" ? user.major : "N/A"}</p>
        <p><strong>Student ID:</strong> {user.studentID}</p>
      </div>

      <div className={styles.reportSection}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <select
            value={viewOption}
            onChange={(e) => setViewOption(e.target.value)}
            style={{ padding: '6px 10px', fontSize: '1rem' }}
          >
            <option value="sessions">Session History</option>
            <option value="courses">Full Course History</option>
          </select>

          <select style={{ padding: '6px 10px', fontSize: '1rem' }}>
            <option value="alphabetical">Sort by: Alphabetical</option>
            <option value="highest">Sort by: Most Recent</option>
            <option value="lowest">Sort by: Oldest</option>
          </select>
        </div>

        {viewOption === 'sessions' ? (
          sessions.length > 0 ? (
            <ul className={styles.sessionList}>
              {sessions.map((session, index) => (
                <li key={index} className={styles.sessionItem}>
                  <span>{formatDateTime(session.sessionTime)}</span>
                  <span>Tutor: {session.tutorID?.firstName} {session.tutorID?.lastName}</span>
                  <span>Course: {session.courseID?.code} - {session.courseID?.title}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p>No sessions found.</p>
          )
        ) : (
          courseHistory.length > 0 ? (
            <ul className={styles.sessionList}>
              {courseHistory.map((course, index) => (
                <li key={index} className={styles.sessionItem}>
                  <span>{course.code} - {course.title}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p>No courses found.</p>
          )
        )}
      </div>
    </div>
  );
};

export default StudentUserReport;
