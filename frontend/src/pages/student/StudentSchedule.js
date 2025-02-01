// import React, { useEffect, useState } from "react";
// import axios from "axios";
import styles from "../../styles/StudentSchedule.module.css";
import StudentSidebar from "../../components/Sidebar/StudentSidebar";

function Schedule() {
  return (
    <div className={styles.container}>
      <StudentSidebar selected="student-schedule"></StudentSidebar>
      <div className={styles.mainContent}>
        <h1 className={styles.heading}>Schedule</h1>
      </div>
    </div>
  );
}

export default Schedule;
