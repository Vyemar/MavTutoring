// import React, { useEffect, useState } from "react";
// import axios from "axios";
import styles from "./styles/Notifications.module.css";
import StudentSideBar from "./components/Sidebar/StudentSidebar";

function Notifications() {
  return (
    <div className={styles.container}>
      <StudentSideBar selected="notifications"></StudentSideBar>
      <div className={styles.mainContent}>
        <h1 className={styles.heading}>Notifications</h1>
      </div>
    </div>
  );
}

export default Notifications;
