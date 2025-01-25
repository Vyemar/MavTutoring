import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/component/AdminSideBar.module.css";

const AdminSideBar = ({ selected }) => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("role"); // Clear the role from localStorage
    navigate("/login"); // Redirect to login page
  };
  return (
    <div className={styles.sidebar}>
      <h1>bugHouse</h1>
      <button
        className={selected === "home" ? `${styles.selected}` : ""}
        onClick={() => navigate("/home")}
      >
        Dashboard
      </button>
      <button
        className={selected === "manage-users" ? `${styles.selected}` : ""}
        onClick={() => navigate("/manage-users")}
      >
        Manage Users
      </button>
      <button
        className={selected === "analytics" ? `${styles.selected}` : ""}
        onClick={() => navigate("/analytics")}
      >
        System Analytics
      </button>
      <button
        className={selected === "admin-settings" ? `${styles.selected}` : ""}
        onClick={() => navigate("/admin-settings")}
      >
        Settings
      </button>
      <button className={styles.logoutButton} onClick={handleLogout}>
        Log Out
      </button>
    </div>
  );
};

export default AdminSideBar;
