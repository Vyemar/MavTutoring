import React, { useState, useEffect } from "react";
import styles from "../../styles/StudentHome.module.css";
import StudentCalendar from "./StudentCalendar";
import StudentSidebar from "../../components/Sidebar/StudentSidebar";

function StudentHome(/*{ handleLogout }*/) {

  return (
    <div className={styles.container}>
      {/* Sidebar */}
      <StudentSidebar selected="home"></StudentSidebar>

      {/* Main Content */}
      <div className={styles.mainContent}>
        <h1 className={styles.heading}>Student Dashboard</h1>

        {/* Schedule Section */}
        <section>
          <h2 className = {styles.calSubHeading}>Calendar</h2>
          <StudentCalendar />
        </section>

        {/* Notifications Section */}
        <section className={styles.notifications}>
          <h2>Notifications</h2>
          <p>No new notifications</p>
        </section>
      </div>
    </div>
  );
}

export default StudentHome;
