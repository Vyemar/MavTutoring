import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "../../styles/TutorSessions.module.css";
import TutorSideBar from "../../components/Sidebar/TutorSidebar";

function TutorSessions() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const tutorId = localStorage.getItem("userID");

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const response = await axios.get(
        `http://localhost:4000/api/sessions/tutor/${tutorId}`
      );
      setSessions(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching sessions:", error);
      setError("Failed to load sessions");
      setLoading(false);
    }
  };

  const formatDateTime = (dateTime) => {
    // Create a date object and adjust for timezone
    const date = new Date(dateTime);
    return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
      .toLocaleString('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short',
        timeZone: 'UTC'
      });
  };

  const handleStatusChange = async (sessionId, newStatus) => {
    try {
      await axios.put(`http://localhost:4000/api/sessions/${sessionId}/status`, {
        status: newStatus
      });
      // Refresh sessions after status update
      fetchSessions();
    } catch (error) {
      console.error("Error updating session status:", error);
      setError("Failed to update session status");
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <TutorSideBar selected="sessions" />
        <div className={styles.mainContent}>
          <div className={styles.spinnerContainer}>
            <div className={styles.spinner}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <TutorSideBar selected="sessions" />
      <div className={styles.mainContent}>
        <h1 className={styles.heading}>Tutor Sessions</h1>
        {error && <div className={styles.error}>{error}</div>}

        <div className={styles.sessionsContainer}>
          <div className={styles.upcomingSessions}>
            <h2>Upcoming Sessions</h2>
            {sessions.filter(session => session.status === 'Scheduled').length > 0 ? (
              <div className={styles.sessionsList}>
                {sessions
                  .filter(session => session.status === 'Scheduled')
                  .sort((a, b) => new Date(a.sessionTime) - new Date(b.sessionTime))
                  .map((session) => (
                    <div key={session._id} className={styles.sessionCard}>
                      <div className={styles.sessionInfo}>
                        <p><strong>Student:</strong> {session.studentID.firstName} {session.studentID.lastName}</p>
                        <p><strong>Date & Time:</strong> {formatDateTime(session.sessionTime)}</p>
                        <p><strong>Duration:</strong> {session.duration} minutes</p>
                        <p><strong>Status:</strong> {session.status}</p>
                      </div>
                      <div className={styles.sessionActions}>
                        <button
                          className={`${styles.actionButton} ${styles.completeButton}`}
                          onClick={() => handleStatusChange(session._id, 'Completed')}
                        >
                          Mark as Completed
                        </button>
                        <button
                          className={`${styles.actionButton} ${styles.cancelButton}`}
                          onClick={() => handleStatusChange(session._id, 'Cancelled')}
                        >
                          Cancel Session
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <p className={styles.noSessions}>No upcoming sessions</p>
            )}
          </div>

          <div className={styles.completedSessions}>
            <h2>Completed Sessions</h2>
            {sessions.filter(session => session.status === 'Completed').length > 0 ? (
              <div className={styles.sessionsList}>
                {sessions
                  .filter(session => session.status === 'Completed')
                  .sort((a, b) => new Date(b.sessionTime) - new Date(a.sessionTime))
                  .map((session) => (
                    <div key={session._id} className={styles.sessionCard}>
                      <div className={styles.sessionInfo}>
                        <p><strong>Student:</strong> {session.studentID.firstName} {session.studentID.lastName}</p>
                        <p><strong>Date & Time:</strong> {formatDateTime(session.sessionTime)}</p>
                        <p><strong>Duration:</strong> {session.duration} minutes</p>
                        <p><strong>Status:</strong> {session.status}</p>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <p className={styles.noSessions}>No completed sessions</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TutorSessions;