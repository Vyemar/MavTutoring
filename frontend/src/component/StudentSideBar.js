import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/component/StudentSideBar.module.css";

const StudentSideBar = (props) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("role"); // Clear the role from localStorage
    navigate("/login"); // Redirect to login page
  };

  return (
    <div className={styles.sidebar}>
      <h1>bugHouse</h1>
      <button onClick={() => navigate("/home")}>Dashboard</button>
      <button onClick={() => navigate("/find-sessions")}>Find Sessions</button>
      <button onClick={() => navigate("/find-tutors")}>Find Tutors</button>
      <button onClick={() => navigate("/my-sessions")}>My Sessions</button>
      <button onClick={() => navigate("/my-tutors")}>My Tutors</button>
      <button onClick={() => navigate("/schedule")}>Schedule</button>
      <button onClick={() => navigate("/notifications")}>Notifications</button>
      <button className={styles.logoutButton} onClick={handleLogout}>
        Log Out
      </button>
    </div>
  );
};

export default StudentSideBar;
