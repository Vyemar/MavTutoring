// import React, { useEffect, useState } from "react";
// import axios from "axios";
import styles from "./styles/StudentSchedule.module.css";
import StudentSideBar from "./component/StudentSideBar";

function Schedule() {
  return (
    <div className={styles.container}>
      <StudentSideBar selected="student-schedule"></StudentSideBar>
      <div className={styles.mainContent}>
        <h1 className={styles.heading}>Schedule</h1>
      </div>
    </div>
  );
}

export default Schedule;
