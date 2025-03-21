import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "../../styles/Feedback.module.css";
import StudentSidebar from "../../components/Sidebar/StudentSidebar";

// Get configuration from environment variables
const PROTOCOL = process.env.REACT_APP_PROTOCOL || 'https';
const BACKEND_HOST = process.env.REACT_APP_BACKEND_HOST || 'localhost';
const BACKEND_PORT = process.env.REACT_APP_BACKEND_PORT || '4000';

// Construct the backend URL dynamically
const BACKEND_URL = `${PROTOCOL}://${BACKEND_HOST}:${BACKEND_PORT}`;

function Feedback() {
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTutor, setSelectedTutor] = useState("");
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(0);
  const [successMessage, setSuccessMessage] = useState("");
  const [userData, setUserData] = useState(null);
  const [sessionLoading, setSessionLoading] = useState(true);
  
  // Fetch the user session data
  useEffect(() => {
    const fetchUserSession = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/auth/session`, {
          withCredentials: true
        });
        
        if (response.data && response.data.user) {
          setUserData(response.data.user);
        } else {
          console.error("No user session found");
        }
      } catch (error) {
        console.error("Error fetching user session:", error);
      } finally {
        setSessionLoading(false);
      }
    };
    
    fetchUserSession();
  }, []);

  // Fetch tutors data
  useEffect(() => {
    // Fetch tutors from the backend
    axios
      .get(`${BACKEND_URL}/api/users`, {
        withCredentials: true
      })
      .then((response) => {
        const tutorList = response.data.filter((user) => user.role === "Tutor");
        setTutors(tutorList);
      })
      .catch((error) => {
        console.error("Error fetching tutors:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!userData || !userData.id) {
      alert("User session not found. Please log in again.");
      return;
    }
    
    const studentId = userData.id;

    // Validate inputs
    if (!selectedTutor) {
      alert("Please select a tutor.");
      return;
    }

    if (!feedback.trim()) {
      alert("Please provide valid feedback.");
      return;
    }

    if (rating === 0) {
      alert("Please select a rating.");
      return;
    }

    axios
      .post(`${BACKEND_URL}/api/feedback`, {
        studentUniqueId: studentId,
        tutorUniqueId: selectedTutor,
        feedbackText: feedback,
        rating,
      }, {
        withCredentials: true // Include cookies for session authentication
      })
      .then((response) => {
        setSuccessMessage("Thank you, your feedback was received!");
        setSelectedTutor("");
        setFeedback("");
        setRating(0);

        // Clear the success message after a few seconds
        setTimeout(() => {
          setSuccessMessage("");
        }, 5000);
      })
      .catch((error) => {
        console.error("Detailed error submitting feedback:", error.response);

        // More informative error handling
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "Failed to submit feedback. Please try again.";

        alert(errorMessage);
      });
  };

  // Show loading state if either session or tutors are still loading
  if (sessionLoading || loading) {
    return (
      <div className={styles.container}>
        <StudentSidebar selected="feedback"></StudentSidebar>
        <div className={styles.mainContent}>
          <h1 className={styles.heading}>Give Feedback</h1>
          <div className={styles.loadingContainer}>
            <p>Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error if no user session is found
  if (!userData) {
    return (
      <div className={styles.container}>
        <StudentSidebar selected="feedback"></StudentSidebar>
        <div className={styles.mainContent}>
          <h1 className={styles.heading}>Give Feedback</h1>
          <div className={styles.errorContainer}>
            <p>Session expired or not found. Please log in again.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <StudentSidebar selected="feedback"></StudentSidebar>
      <div className={styles.mainContent}>
        <h1 className={styles.heading}>Give Feedback</h1>
        {successMessage && (
          <p className={styles.successMessage}>{successMessage}</p>
        )}
        <form onSubmit={handleSubmit}>
          <label className={styles.label} htmlFor="tutor">
            Select Tutor
          </label>
          <select
            id="tutor"
            className={styles.select}
            value={selectedTutor}
            onChange={(e) => setSelectedTutor(e.target.value)}
          >
            <option value="">-- Choose a Tutor --</option>
            {tutors.map((tutor) => (
              <option key={tutor._id} value={tutor._id}>
                {tutor.firstName} {tutor.lastName}
              </option>
            ))}
          </select>

          <label className={styles.label} htmlFor="feedback">
            Feedback
          </label>
          <textarea
            id="feedback"
            className={styles.textarea}
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Write your feedback here"
          />

          <label className={styles.label} htmlFor="rating">
            Rating
          </label>
          <div className={styles.stars}>
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`${styles.star} ${
                  rating >= star ? styles.starSelected : ""
                }`}
                onClick={() => setRating(star)}
              >
                ★
              </span>
            ))}
          </div>

          <button type="submit" className={styles.submitButton}>
            Submit Feedback
          </button>
        </form>
      </div>
    </div>
  );
}

export default Feedback;