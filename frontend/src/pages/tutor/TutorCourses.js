// import React, { useEffect, useState } from "react";
// import axios from "axios";
import styles from "../../styles/TutorCourses.module.css";
import TutorSidebar from '../../components/Sidebar/TutorSidebar';

function TutorCourses() {
  return (
    <div className={styles.container}>
      <TutorSidebar selected="courses"></TutorSidebar>
      <div className={styles.mainContent}>
        <h1 className={styles.heading}>Tutor Courses</h1>
      </div>
    </div>
  );
}

export default TutorCourses;
