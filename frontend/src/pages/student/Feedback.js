import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "../../styles/Feedback.module.css";
import StudentSideBar from "../../components/Sidebar/StudentSidebar";

function Feedback() {
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTutor, setSelectedTutor] = useState("");
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(0);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    // Fetch tutors from the backend
    axios
      .get("http://localhost:4000/api/users")
      .then((response) => {
        const tutorList = response.data.filter((user) => user.role === "Tutor");
        setTutors(tutorList);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching tutors:", error);
        setLoading(false);
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const StudentID = localStorage.getItem("userID"); // Safely access currentUser's ID

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

    if (!StudentID) {
      alert("Unable to submit feedback. Please try again later.");
      return;
    }

    // Extensive validation
    if (!selectedTutor || !feedback || rating === 0 || !StudentID) {
      alert("Please fill in all fields before submitting.");
      return;
    }

    axios
      .post("http://localhost:4000/api/feedback", {
        studentUniqueId: StudentID, // Using MongoDB's _id
        tutorUniqueId: selectedTutor,
        feedbackText: feedback,
        rating,
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

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className={styles.container}>
      <StudentSideBar></StudentSideBar>
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
