// import React, { useEffect, useState } from "react";
// import axios from "axios";
import styles from "../../styles/MySessions.module.css";
import TutorSidebar from "../../components/Sidebar/TutorSidebar";

function TutorSchedule() {
  return (
    <div className={styles.container}>
      <TutorSidebar selected="schedule"></TutorSidebar>
      <div className={styles.mainContent}>
        <h1 className={styles.heading}>Tutor Schedule</h1>
      </div>
    </div>
  );
}

export default TutorSchedule;
