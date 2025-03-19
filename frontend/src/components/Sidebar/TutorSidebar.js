import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../styles/component/TutorSideBar.module.css";
import { handleLogout } from "../../utils/authUtils";

function TutorSidebar({ onLogout, selected }) {
  const navigate = useNavigate();

  return (
    <div className={styles.sidebar}>
      <h1>bugHouse</h1>
      <button
        className={selected === "home" ? `${styles.selected}` : ""}
        onClick={() => navigate("/home")}
      >
        Dashboard
      </button>{" "}
      <button
        className={selected === "courses" ? `${styles.selected}` : ""}
        onClick={() => navigate("/TutorCourses")}
      >
        Courses
      </button>
      <button
        className={selected === "profile" ? `${styles.selected}` : ""}
        onClick={() => navigate("/tutor-profile")}
      >
        Profile
      </button>
      
      <button
        className={selected === "availability" ? `${styles.selected}` : ""}
        onClick={() => navigate("/availability")}
      >
        Set Availability
      </button>
      <button
        className={selected === "schedule" ? `${styles.selected}` : ""}
        onClick={() => navigate("/schedule")}
      >
        View Schedule
      </button>
      <button
        className={selected === "sessions" ? `${styles.selected}` : ""}
        onClick={() => navigate("/sessions")}
      >
        Sessions
      </button>
      <button
        className={selected === "notifications" ? `${styles.selected}` : ""}
        onClick={() => navigate("/TutorNotifications")}
      >
        Notifications
      </button>
      <button className={styles.logoutButton} onClick={handleLogout}>
        Log Out
      </button>
    </div>
  );
}

export default TutorSidebar;
