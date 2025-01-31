import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "../../styles/ViewTutors.module.css";
import TutorCard from "../../components/Sidebar/TutorCard";
import StudentSidebar from "../../components/Sidebar/StudentSidebar";

function ViewTutors() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch all users from the backend
    axios
      .get("http://localhost:4000/api/users")
      .then((response) => {
        // Filter users to only include those with the role "Tutor"
        const tutors = response.data.filter((users) => users.role === "Tutor");
        setUsers(tutors);
        setLoading(false);
        console.log("Fetching users with role Tutor"); //
        console.log("Query result:", tutors); //Testing purpose
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className={styles.container}>
      {/* Sidebar */}
      <StudentSidebar selected="find-tutors"></StudentSidebar>
      {/* Main Content */}
      <div className={styles.mainContent}>
        <h1 className={styles.heading}>Our Tutors</h1>
        <div className={styles.cardContainer}>
          {users.length > 0 ? (
            users.map((user) => (
              <TutorCard user={user} key={user._id}></TutorCard>
            ))
          ) : (
            <p>No tutors found in the system.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ViewTutors;
