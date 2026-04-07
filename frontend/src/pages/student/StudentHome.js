import React, { useEffect, useState } from "react";
import styles from "../../styles/StudentHome.module.css";
import StudentCalendar from "./StudentCalendar";
import StudentSidebar from "../../components/Sidebar/StudentSidebar";
import { useSidebar } from "../../components/Sidebar/SidebarContext";
import TutorAvailability from "./TutorAvailability";
import Mysession from "./MySessions";
import { useNavigate } from "react-router-dom";

function StudentHome() {
  const { isCollapsed } = useSidebar();
  const [ studentName, setStudentName ] = useState("");
  const [ view, setView ] = useState("sessions"); 
  const navigate = useNavigate();

  // As of now getting username from localstorage that's where user name and role will be once logged in
  useEffect(() => {
    const storeUser = JSON.parse(localStorage.getItem("user"));
     console.log("Fetched user:", storeUser);
    if(storeUser?.firstName) {
      setStudentName(storeUser.firstName);
    }
  }, []);


  return (
    <div className={styles.container}>
      <StudentSidebar selected="home" />
      <div
        className={styles.mainContent}
        style={{ marginLeft: isCollapsed ? "90px" : "280px" , 
          transition: "margin-left 0.5s ease"}}
      >
        <div className={styles.headingRow}>
          <div>
            <h1>
              Welcome, {studentName || "Student"} <span role="img">👋</span>
            </h1>
            <p>Here's your tutoring calendar & availability</p>
          </div>

          <div className={styles.topTabs}>
            <div
              className={`${styles.tabCard} ${view === "availability" ? styles.activeTab : ""}`}
              onClick={() => setView("availability")}
            >
              <div className={styles.cardIcon}>📅</div>
              <div>
                <h3>Tutor Availability</h3>
                <p>Available slots by tutors</p>
              </div>
            </div>
            <div
              className={`${styles.tabCard}`}
              onClick={() => navigate("/my-sessions")}
            >
              <div className={styles.cardIcon}>📋</div>
              <div>
                <h3>My Sessions</h3>
                <p>Upcoming booked sessions</p>
              </div>
            </div>
          </div>
        </div>

        {/* Conditional View */}
        <section>
          {view === "sessions" ? (
            <>
              <h2 className={styles.calSubHeading}>Calendar</h2>
              <StudentCalendar />
            </>
          ) : (
            <>
              <h2 className={styles.calSubHeading}>Weekly Tutor Availability</h2>
              <TutorAvailability />
            </>
          )}
        </section>

        <section className={styles.notifications}>
          <h2>Notifications</h2>
          <p>No new notifications</p>
        </section>
      </div>
    </div>
  );
}

export default StudentHome;