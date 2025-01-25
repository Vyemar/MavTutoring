// import React, { useEffect, useState } from "react";
// import axios from "axios";
import styles from "./styles/MySessions.module.css";
import TutorSideBar from "./component/TutorSideBar";

function TutorSessions() {
  return (
    <div className={styles.container}>
      <TutorSideBar selected="sessions"></TutorSideBar>
      <div className={styles.mainContent}>
        <h1 className={styles.heading}>Tutor Sessions</h1>
      </div>
    </div>
  );
}

export default TutorSessions;
