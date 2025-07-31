import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminSidebar from "../../components/Sidebar/AdminSidebar";
import styles from "../../styles/TutorRequests.module.css";

const PROTOCOL = process.env.REACT_APP_PROTOCOL || "https";
const BACKEND_HOST = process.env.REACT_APP_BACKEND_HOST || "localhost";
const BACKEND_PORT = process.env.REACT_APP_BACKEND_PORT || "4000";
const BACKEND_URL = `${PROTOCOL}://${BACKEND_HOST}:${BACKEND_PORT}`;

const TutorRequests = () => {
    const [requests, setRequests] = useState([]);
    const [error, setError] = useState("");

    // Populates the tutor request list when initially loading
    useEffect(() => {
        getRequests();
    }, []);

    // Sends GET request when student requests
    const getRequests = async () => {
        try {
            const response = await axios.get(`${BACKEND_URL}/api/tutor-request/pending`, 
                { withCredentials: true }
            );

            setRequests(response.data);

        } catch (err) {
            console.error("Error fetching requests:", err);
            setError("Failed to load requests.");
        }
    };

    // Handles Accept or Reject buttons, sends a POST request with decision
    const handleReview = async (userId, decision) => {
        try {
            await axios.post(`${BACKEND_URL}/api/tutor-request/review`, 
                { userId, decision }, 
                { withCredentials: true, }
            );

            // Refresh list of appplicants after decision
            getRequests();

        } catch (err) {
            console.error(`Error submitting ${decision}:`, err);
        }
    };
    
    // https://stackoverflow.com/questions/2805330/opening-pdf-string-in-new-window-with-javascript
    const viewPDF = (base64Data) => {
    try {
        const base64String = base64Data.split(';base64,')[1]; // Removes "data:application/pdf;base64," and leaves the encoded data
        const byteCharacters = atob(base64String); // ASCII to binary
        const byteNumbers = new Array(byteCharacters.length);

        for (var i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        const file = new Blob([byteArray], { type: 'application/pdf' });

        const fileURL = URL.createObjectURL(file); // Generates a temporary URL
        window.open(fileURL, '_blank');
    } catch (err) {
        console.error("Failed to open PDF:", err);
    }
};

return (
    <div className={styles.container}>
      <AdminSidebar selected="tutor-requests" />
      <div className={styles.mainContent}>
        <h1>Incoming Tutor Requests</h1>
        {error && <p className={styles.error}>{error}</p>}

        {requests.length === 0 ? (
          <p>No pending requests.</p>
        ) : (
          <ul className={styles.requestList}>
            
            {/* Creates the list of "bubbles" (cards) for each request */}

            {requests.map((req) => (
              <li key={req._id} className={styles.requestItem}>
                <p><strong>Name:</strong> {req.name}</p>
                <p><strong>Student ID:</strong> {req.studentID}</p>
                {req.resume && (
                    <p>
                        <button
                            onClick={() => viewPDF(req.resume)}
                            style={{ color: "blue", textDecoration: "underline", background: "none", border: "none", padding: 0}}
                        >
                            View Resume
                        </button>
                    </p>
                    )}
                <div className={styles.buttonGroup}>
                  <button onClick={() => handleReview(req.userId._id, "approved")}>Approve</button> 
                  <button onClick={() => handleReview(req.userId._id, "rejected")}>Reject</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default TutorRequests;
