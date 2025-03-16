import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import styles from "../../styles/TutorSessions.module.css";
import TutorSideBar from "../../components/Sidebar/TutorSidebar";

function TutorSessions() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sessionLoading, setSessionLoading] = useState(true);
  const [error, setError] = useState("");
  const [userData, setUserData] = useState(null);

  // Fetch the user session data
  useEffect(() => {
    const fetchUserSession = async () => {
      try {
        const response = await axios.get("https://localhost:4000/api/auth/session", {
          withCredentials: true
        });
        
        if (response.data && response.data.user) {
          setUserData(response.data.user);
        } else {
          setError("No user session found. Please log in again.");
        }
      } catch (error) {
        console.error("Error fetching user session:", error);
        setError("Failed to authenticate user. Please log in again.");
      } finally {
        setSessionLoading(false);
      }
    };
    
    fetchUserSession();
  }, []);

  // Define fetchSessions as a useCallback function
  const fetchSessions = useCallback(async () => {
    if (!userData || !userData.id) return;
    
    try {
      setError(""); // Clear any previous errors
      const response = await axios.get(
        `https://localhost:4000/api/sessions/tutor/${userData.id}`,
        { withCredentials: true }
      );
      setSessions(response.data);
    } catch (error) {
      console.error("Error fetching sessions:", error);
      if (error.response) {
        setError(`Failed to load sessions: ${error.response.data.message || error.response.statusText}`);
      } else if (error.request) {
        setError("Server not responding. Please try again later.");
      } else {
        setError(`Failed to load sessions: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  }, [userData]);

  // Fetch sessions when userData changes
  useEffect(() => {
    if (userData && userData.id) {
      fetchSessions();
    }
  }, [userData, fetchSessions]);

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
    if (!userData || !userData.id) {
      setError("User session expired. Please log in again.");
      return;
    }
    
    try {
      await axios.put(
        `https://localhost:4000/api/sessions/${sessionId}/status`, 
        { status: newStatus },
        { withCredentials: true }
      );
      // Refresh sessions after status update
      fetchSessions();
    } catch (error) {
      console.error("Error updating session status:", error);
      if (error.response) {
        setError(`Failed to update session: ${error.response.data.message || error.response.statusText}`);
      } else {
        setError("Failed to update session status. Please try again.");
      }
    }
  };

  // Show loading spinner while either session or data is loading
  if (sessionLoading || loading) {
    return (
      <div className={styles.container}>
        <TutorSideBar selected="sessions" />
        <div className={styles.mainContent}>
          <div className={styles.spinnerContainer}>
            <div className={styles.spinner}></div>
            <p>Loading sessions...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error if no user session is found
  if (!userData) {
    return (
      <div className={styles.container}>
        <TutorSideBar selected="sessions" />
        <div className={styles.mainContent}>
          <div className={styles.error}>
            Session expired or not found. Please log in again.
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
                        {session.specialRequest && (
                          <p><strong>Special Request:</strong> {session.specialRequest}</p>
                        )}
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
                        {session.specialRequest && (
                          <p><strong>Special Request:</strong> {session.specialRequest}</p>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <p className={styles.noSessions}>No completed sessions</p>
            )}
          </div>

          <div className={styles.cancelledSessions}>
            <h2>Cancelled Sessions</h2>
            {sessions.filter(session => session.status === 'Cancelled').length > 0 ? (
              <div className={styles.sessionsList}>
                {sessions
                  .filter(session => session.status === 'Cancelled')
                  .sort((a, b) => new Date(b.sessionTime) - new Date(a.sessionTime))
                  .map((session) => (
                    <div key={session._id} className={`${styles.sessionCard} ${styles.cancelledCard}`}>
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
              <p className={styles.noSessions}>No cancelled sessions</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TutorSessions;