// import React, { useEffect, useState } from "react";
// import axios from "axios";
import styles from "./styles/MySessions.module.css";
import StudentSideBar from "./components/Sidebar/StudentSidebar";

function MySessions() {
  return (
    <div className={styles.container}>
      <StudentSideBar selected="my-sessions"></StudentSideBar>
      <div className={styles.mainContent}>
        <h1 className={styles.heading}>My Sessions</h1>
      </div>
    </div>
  );
}

export default MySessions;
