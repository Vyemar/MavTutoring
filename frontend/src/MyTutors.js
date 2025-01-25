// import React, { useEffect, useState } from "react";
// import axios from "axios";
import styles from "./styles/MyTutors.module.css";
import StudentSideBar from "./component/StudentSideBar";

function MyTutors() {
  return (
    <div className={styles.container}>
      <StudentSideBar selected="my-tutors"></StudentSideBar>
      <div className={styles.mainContent}>
        <h1 className={styles.heading}>My Tutors</h1>
      </div>
    </div>
  );
}

export default MyTutors;
