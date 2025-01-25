// import React, { useEffect, useState } from "react";
// import axios from "axios";
import styles from "./styles/SystemAnalytics.module.css";
import AdminSideBar from "./component/AdminSideBar";

function SystemAnalytics() {
  return (
    <div className={styles.container}>
      <AdminSideBar selected="analytics"></AdminSideBar>
      <div className={styles.mainContent}>
        <h1 className={styles.heading}>System Analytics</h1>
      </div>
    </div>
  );
}

export default SystemAnalytics;
