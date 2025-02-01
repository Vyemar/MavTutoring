// import React, { useEffect, useState } from "react";
// import axios from "axios";
import styles from "./styles/FindSessions.module.css";
import StudentSideBar from "./components/Sidebar/StudentSidebar";

function FindSessions() {
  return (
    <div className={styles.container}>
      <StudentSideBar selected="find-sessions"></StudentSideBar>
      <div className={styles.mainContent}>
        <h1 className={styles.heading}>Find Sessions</h1>
      </div>
    </div>
  );
}

export default FindSessions;
