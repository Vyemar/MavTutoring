// import React, { useEffect, useState } from "react";
// import axios from "axios";
import styles from "./styles/Settings.module.css";
import AdminSideBar from "./component/AdminSideBar";

function Settings() {
  return (
    <div className={styles.container}>
      <AdminSideBar selected="admin-settings"></AdminSideBar>
      <div className={styles.mainContent}>
        <h1 className={styles.heading}>Admin Settings</h1>
      </div>
    </div>
  );
}

export default Settings;
