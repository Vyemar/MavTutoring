// import React, { useEffect, useState } from "react";
// import axios from "axios";
import styles from "../../styles/FindSessions.module.css";
import StudentSidebar from "../../components/Sidebar/StudentSidebar";

function FindSessions() {
  return (
    <div className={styles.container}>
      <StudentSidebar selected="find-sessions"></StudentSidebar>
      <div className={styles.mainContent}>
        <h1 className={styles.heading}>Find Sessions</h1>
      </div>
    </div>
  );
}

export default FindSessions;
