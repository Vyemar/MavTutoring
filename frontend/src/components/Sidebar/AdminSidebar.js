import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "../../styles/component/AdminSideBar.module.css";
import { handleLogout } from "../../utils/authUtils";
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";

// Get configuration from environment variables
const PROTOCOL = process.env.REACT_APP_PROTOCOL || "https";
const BACKEND_HOST = process.env.REACT_APP_BACKEND_HOST || "localhost";
const BACKEND_PORT = process.env.REACT_APP_BACKEND_PORT || "4000";

// Construct the backend URL dynamically
const BACKEND_URL = `${PROTOCOL}://${BACKEND_HOST}:${BACKEND_PORT}`;

function AdminSidebar({ onLogout, selected }) {
  const navigate = useNavigate();
  const [bugHouseInfo, setBugHouseInfo] = useState({
    logo: "",
    contactInfo: {
      email: "",
      phone: "",
      address: "",
    },
  });

  useEffect(() => {
    // Fetch BugHouse settings to get the logo
    const fetchBugHouseInfo = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/bughouse`);
        setBugHouseInfo(response.data);
      } catch (error) {
        console.error("Error fetching logo:", error);
      }
    };

    fetchBugHouseInfo();
  }, []);

  return (
    <div className={styles.sidebar}>
      <div className={styles.sidebarLogoGroup}>
        {bugHouseInfo.logo && (
          <img
            src={bugHouseInfo.logo}
            alt="BugHouse Logo"
            className={styles.sidebarLogo}
          />
        )}
        <h1 style={{ margin: 0 }}>bugHouse</h1>
      </div>
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
      <div className={styles.sidebarContactInfo}>
        <h3>Contact Us</h3>
        <div className={styles.contactDetails}>
          <div className={styles.contactItem}>
            <FaEnvelope className={styles.contactIcon} />
            <span>{bugHouseInfo.contactInfo.email}</span>
          </div>
          <div className={styles.contactItem}>
            <FaPhone className={styles.contactIcon} />
            <span>{bugHouseInfo.contactInfo.phone}</span>
          </div>
          <div className={styles.contactItem}>
            <FaMapMarkerAlt className={styles.contactIcon} />
            <span>{bugHouseInfo.contactInfo.address}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminSidebar;
