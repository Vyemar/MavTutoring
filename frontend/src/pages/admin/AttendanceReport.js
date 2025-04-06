import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import styles from "../../styles/AttendanceReport.module.css";
import AdminSideBar from "../../components/Sidebar/AdminSidebar";

// Get configuration from environment variables
const PROTOCOL = process.env.REACT_APP_PROTOCOL || 'https';
const BACKEND_HOST = process.env.REACT_APP_BACKEND_HOST || 'localhost';
const BACKEND_PORT = process.env.REACT_APP_BACKEND_PORT || '4000';

// Construct the backend URL dynamically
const BACKEND_URL = `${PROTOCOL}://${BACKEND_HOST}:${BACKEND_PORT}`;

// Create a cache object to store the sessions data
const sessionsCache = {
  data: null,
  timestamp: null,
  cacheDuration: 5 * 60 * 1000 // 5 minutes in milliseconds
};

// Helper function to calculate end time based on start time and duration
function calculateEndTime(startTime, duration) {
  if (!startTime || !duration) return 'N/A';
  
  try {
    // Parse duration (assuming format like "60 mins" or "1 hour 30 mins")
    let durationMinutes = 0;
    
    if (typeof duration === 'string') {
      if (duration.includes('hour')) {
        const hourPart = duration.match(/(\d+)\s*hour/);
        if (hourPart && hourPart[1]) {
          durationMinutes += parseInt(hourPart[1]) * 60;
        }
      }
      
      const minutePart = duration.match(/(\d+)\s*min/);
      if (minutePart && minutePart[1]) {
        durationMinutes += parseInt(minutePart[1]);
      }
      
      // If we couldn't parse the duration, try a direct integer parse
      if (durationMinutes === 0) {
        const directMinutes = parseInt(duration);
        if (!isNaN(directMinutes)) {
          durationMinutes = directMinutes;
        } else {
          return 'N/A';
        }
      }
    } else if (typeof duration === 'number') {
      durationMinutes = duration;
    } else {
      return 'N/A';
    }
    
    // Create a date object from the start time (assumes format like "10:00 AM")
    if (typeof startTime !== 'string') return 'N/A';
    
    const [time, period] = startTime.split(' ');
    if (!time || !period) return 'N/A';
    
    let [hours, minutes] = time.split(':').map(Number);
    if (isNaN(hours) || isNaN(minutes)) return 'N/A';
    
    // Convert to 24-hour format
    if (period === 'PM' && hours < 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;
    
    // Create a date object and add the duration
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    date.setTime(date.getTime() + durationMinutes * 60 * 1000);
    
    // Format the end time
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  } catch (error) {
    console.error('Error calculating end time:', error);
    return 'N/A';
  }
}

// Helper function to format date and time from ISO string
function formatDateTime(isoString) {
  if (!isoString) return { date: 'N/A', time: 'N/A' };
  
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return { date: 'N/A', time: 'N/A' };
    
    const formattedDate = date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    const formattedTime = date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
    
    return { date: formattedDate, time: formattedTime };
  } catch (error) {
    console.error('Error formatting date/time:', error);
    return { date: 'N/A', time: 'N/A' };
  }
}

function AttendanceReport() {
  const [sessions, setSessions] = useState([]);
  const [allSessionsCount, setAllSessionsCount] = useState(0);
  const [lastMonthCount, setLastMonthCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  
  // Define fetchSessions as a useCallback
  const fetchSessions = useCallback(async () => {
    try {
      setLoading(true);
      
      // Check if we have valid cached data
      const now = new Date();
      if (
        sessionsCache.data && 
        sessionsCache.timestamp && 
        now.getTime() - sessionsCache.timestamp < sessionsCache.cacheDuration
      ) {
        console.log("Using cached sessions data");
        setSessions(sessionsCache.data);
        setLastUpdated(new Date(sessionsCache.timestamp));
        setLoading(false);
        return;
      }
      
      console.log("Fetching fresh sessions data...");
      
      try {
        // This is a multi-step fetch to get all sessions with their user info properly populated
        
        // STEP 1: Fetch all sessions first
        const sessionsResponse = await axios.get(`${BACKEND_URL}/api/sessions`);
        let sessionsList = sessionsResponse.data || [];
        
        // Store counts for statistics
        setAllSessionsCount(sessionsList.length);
        
        // Calculate last month sessions
        const lastMonth = new Date();
        lastMonth.setMonth(lastMonth.getMonth() - 1);
        
        const lastMonthSessions = sessionsList.filter(session => {
          try {
            const sessionDate = new Date(session.sessionTime);
            return sessionDate >= lastMonth;
          } catch (error) {
            return false;
          }
        });
        
        setLastMonthCount(lastMonthSessions.length);
        
        // Filter to only include completed sessions for display in the table
        const completedSessions = sessionsList.filter(session => session.status === 'Completed');
        
        // STEP 3: Create a set of all unique student and tutor IDs
        const studentIds = new Set();
        const tutorIds = new Set();
        
        completedSessions.forEach(session => {
          if (session.studentID) studentIds.add(session.studentID);
          if (session.tutorID) tutorIds.add(session.tutorID);
        });
        
        // STEP 4: Fetch all required user information
        const userRequests = [];
        
        // Fetch student info
        for (const studentId of studentIds) {
          if (typeof studentId === 'string') {
            userRequests.push(
              axios.get(`${BACKEND_URL}/api/users/${studentId}`)
                .catch(err => {
                  console.error(`Error fetching student ${studentId}:`, err);
                  return { data: { _id: studentId, firstName: 'Unknown', lastName: 'Student' } };
                })
            );
          }
        }
        
        // Fetch tutor info
        for (const tutorId of tutorIds) {
          if (typeof tutorId === 'string') {
            userRequests.push(
              axios.get(`${BACKEND_URL}/api/users/${tutorId}`)
                .catch(err => {
                  console.error(`Error fetching tutor ${tutorId}:`, err);
                  return { data: { _id: tutorId, firstName: 'Unknown', lastName: 'Tutor' } };
                })
            );
          }
        }
        
        // Wait for all user fetch requests to complete
        const userResponses = await Promise.all(userRequests);
        
        // STEP 5: Build a user lookup map
        const userMap = {};
        userResponses.forEach(response => {
          if (response && response.data && response.data._id) {
            userMap[response.data._id] = response.data;
          }
        });
        
        console.log("User data map:", userMap);
        
        // STEP 6: Process the sessions data with proper user names
        const processedSessions = completedSessions.map(session => {
          // Get student info from map
          const student = session.studentID && userMap[session.studentID] 
            ? userMap[session.studentID] 
            : null;
            
          // Get tutor info from map
          const tutor = session.tutorID && userMap[session.tutorID] 
            ? userMap[session.tutorID] 
            : null;
          
          // Generate names
          const studentName = student 
            ? `${student.firstName || ''} ${student.lastName || ''}`.trim()
            : 'Unknown Student';
            
          const tutorName = tutor 
            ? `${tutor.firstName || ''} ${tutor.lastName || ''}`.trim()
            : 'Unknown Tutor';
          
          // Format date and time from sessionTime
          const { date, time } = formatDateTime(session.sessionTime);
          
          return {
            id: session._id || 'N/A',
            studentName,
            tutorName,
            date,
            startTime: time,
            duration: session.duration || 'N/A',
            endTime: calculateEndTime(time, session.duration),
            status: session.status || 'Unknown'
          };
        });
        
        // Sort sessions by date (most recent first)
        processedSessions.sort((a, b) => {
          try {
            return new Date(b.date) - new Date(a.date);
          } catch (error) {
            return 0;
          }
        });
        
        console.log("Processed sessions:", processedSessions);
        
        // Update the cache with the new data
        sessionsCache.data = processedSessions;
        sessionsCache.timestamp = now.getTime();
        
        setSessions(processedSessions);
        setLastUpdated(now);
        setLoading(false);
        
        // Clear any previous errors
        if (error) setError(null);
      } catch (axiosError) {
        console.error("Detailed Axios Error:", {
          message: axiosError.message,
          response: axiosError.response ? {
            status: axiosError.response.status,
            data: axiosError.response.data,
            headers: axiosError.response.headers
          } : 'No response',
          request: axiosError.request ? 'Request exists' : 'No request',
          config: axiosError.config ? {
            url: axiosError.config.url,
            method: axiosError.config.method,
            headers: axiosError.config.headers
          } : 'No config'
        });
  
        const errorMessage = axiosError.response 
          ? `Error: ${axiosError.response.status} - ${axiosError.response.data?.message || axiosError.response.statusText}` 
          : "Failed to connect to the server. Please try again later.";
        
        // Fallback to local sample data
        const sampleSessions = [
          {
            id: 1,
            studentName: "Emily Johnson",
            tutorName: "John Doe",
            date: "March 20, 2024",
            startTime: "10:00 AM",
            duration: "90 mins",
            endTime: "11:30 AM",
            status: "Completed"
          },
          {
            id: 2,
            studentName: "Michael Chen",
            tutorName: "Sarah Smith",
            date: "March 19, 2024",
            startTime: "02:00 PM",
            duration: "75 mins",
            endTime: "03:15 PM",
            status: "Completed"
          }
        ];
        
        setSessions(sampleSessions);
        setError(`${errorMessage} (Using sample data for display purposes)`);
        setAllSessionsCount(sampleSessions.length + 5); // Sample total count
        setLastMonthCount(sampleSessions.length + 3); // Sample last month count
        setLoading(false);
      }
    } catch (generalError) {
      console.error("General Error:", generalError);
      setError("An unexpected error occurred");
      setLoading(false);
    }
  }, [error]);

  // Fetch sessions data on component mount
  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);
  
  // Add enhanced styles for the statistics and tables
  useEffect(() => {
    // This will add the styles if they don't exist in your CSS file already
    const styleElement = document.createElement('style');
    styleElement.innerHTML = `
      /* Statistics Container Styles */
      .statisticsContainer {
        display: flex;
        justify-content: space-between;
        margin-bottom: 24px;
        flex-wrap: wrap;
        gap: 16px;
      }
      
      .statCard {
        flex: 1;
        min-width: 180px;
        background: linear-gradient(145deg, #ffffff, #f0f0f0);
        border-radius: 12px;
        padding: 20px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
        border: 1px solid #e1e4e8;
        transition: transform 0.3s ease, box-shadow 0.3s ease;
      }
      
      .statCard:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
      }
      
      .statTitle {
        margin: 0 0 10px 0;
        font-size: 14px;
        color: #5a6775;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        font-weight: 600;
      }
      
      .statValue {
        margin: 0;
        font-size: 28px;
        font-weight: bold;
        background: linear-gradient(90deg, #3498db, #2980b9);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        text-fill-color: transparent;
      }
      
      /* Enhanced Table Styles */
      .${styles.tableContainer} {
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
        transition: all 0.3s ease;
        border: 1px solid #e9ecef;
      }
      
      .${styles.sessionsTable} thead {
        background: linear-gradient(to right, #f8f9fa, #e9ecef);
      }
      
      .${styles.sessionsTable} th {
        padding: 15px;
        font-weight: 600;
        color: #394b59;
        text-transform: uppercase;
        font-size: 12px;
        letter-spacing: 0.7px;
        border-bottom: 2px solid #dee2e6;
      }
      
      .${styles.sessionsTable} td {
        padding: 12px 15px;
        vertical-align: middle;
        transition: background-color 0.2s ease;
      }
      
      .${styles.sessionsTable} tr:nth-child(even) {
        background-color: #f8f9fa;
      }
      
      .${styles.sessionsTable} tr:hover td {
        background-color: #e3f2fd;
      }
      
      /* Improved status styles */
      .statusBadge {
        display: inline-block;
        padding: 4px 10px;
        border-radius: 12px;
        font-size: 12px;
        font-weight: 600;
        text-align: center;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      
      .statusCompleted {
        background-color: #d4edda;
        color: #155724;
      }
      
      .statusScheduled {
        background-color: #cce5ff;
        color: #004085;
      }
      
      .statusCancelled {
        background-color: #f8d7da;
        color: #721c24;
      }
      
      .durationBadge {
        display: inline-block;
        padding: 4px 10px;
        border-radius: 12px;
        background-color: #e9ecef;
        color: #495057;
        font-size: 12px;
        font-weight: 600;
      }
      
      .${styles.sectionTitle} {
        font-size: 20px;
        color: #2c3e50;
        margin-bottom: 20px;
        padding-bottom: 12px;
        border-bottom: 2px solid #e1e4e8;
        position: relative;
      }
      
      .${styles.sectionTitle}::after {
        content: '';
        position: absolute;
        bottom: -2px;
        left: 0;
        width: 60px;
        height: 2px;
        background: #3498db;
      }
      
      .${styles.attendanceSection} {
        background-color: #ffffff;
        border-radius: 12px;
        padding: 25px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        margin-bottom: 20px;
      }
      
      /* Responsive Fixes */
      @media (max-width: 768px) {
        .statisticsContainer {
          flex-direction: column;
        }
        
        .statCard {
          width: 100%;
          margin-right: 0;
          margin-bottom: 16px;
        }
      }
    `;
    document.head.appendChild(styleElement);
    
    // Cleanup function to remove the style element when component unmounts
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  // Function to manually refresh the data
  const handleRefresh = () => {
    // Clear the cache and re-fetch
    sessionsCache.data = null;
    sessionsCache.timestamp = null;
    fetchSessions();
  };

  // Format the last updated time
  const formatLastUpdated = (date) => {
    if (!date) return "";
    
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: true
    }).format(date);
  };
  
  // Function to format the duration for better display
  const formatDuration = (duration) => {
    if (!duration) return 'N/A';
    
    if (typeof duration === 'number') {
      // If it's a number, assume it's minutes
      if (duration >= 60) {
        const hours = Math.floor(duration / 60);
        const minutes = duration % 60;
        return `${hours}h ${minutes > 0 ? `${minutes}m` : ''}`;
      }
      return `${duration}m`;
    }
    
    // If it's already a formatted string, return it
    return duration;
  };

  return (
    <div className={styles.container}>
      <AdminSideBar selected="attendance"></AdminSideBar>
      <div className={styles.mainContent}>
        <div className={styles.headerContainer}>
          <h1 className={styles.heading}>Attendance Report</h1>
          
          {lastUpdated && (
            <div className={styles.refreshContainer}>
              <span className={styles.lastUpdated}>
                Last updated: {formatLastUpdated(lastUpdated)}
              </span>
              <button 
                className={styles.refreshButton}
                onClick={handleRefresh}
                disabled={loading}
              >
                {loading ? "Refreshing..." : "Refresh Data"}
              </button>
            </div>
          )}
        </div>
        
        <div className={styles.attendanceSection}>
          <div className="statisticsContainer">
            <div className="statCard">
              <h3 className="statTitle">Total Booked Sessions</h3>
              <p className="statValue">{loading ? "..." : allSessionsCount}</p>
            </div>
            <div className="statCard">
              <h3 className="statTitle">Last Month's Booked Sessions</h3>
              <p className="statValue">{loading ? "..." : lastMonthCount}</p>
            </div>
            <div className="statCard">
              <h3 className="statTitle">Total Completed Sessions</h3>
              <p className="statValue">{loading ? "..." : sessions.length}</p>
            </div>
          </div>
          
          <h2 className={styles.sectionTitle}>Completed Sessions</h2>
          
          {loading ? (
            <div className={styles.loadingContainer}>
              <p>Loading session data...</p>
            </div>
          ) : error ? (
            <div className={styles.errorContainer}>
              <p>{error}</p>
            </div>
          ) : sessions.length === 0 ? (
            <div className={styles.emptyContainer}>
              <p>No completed sessions available.</p>
            </div>
          ) : (
            <div className={styles.tableContainer}>
              <table className={styles.sessionsTable}>
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Tutor</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Duration</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {sessions.map(session => (
                    <tr key={session.id}>
                      <td><strong>{session.studentName}</strong></td>
                      <td><strong>{session.tutorName}</strong></td>
                      <td>{session.date}</td>
                      <td>
                        {session.startTime} - {session.endTime}
                      </td>
                      <td>
                        <span className="durationBadge">
                          {formatDuration(session.duration)}
                        </span>
                      </td>
                      <td>
                        <span className={`statusBadge status${session.status}`}>
                          {session.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AttendanceReport;