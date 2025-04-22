import { useState, useEffect } from "react";
import axios from "axios";
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";
import styles from "../../styles/component/SideBar.module.css";

const PROTOCOL = process.env.REACT_APP_PROTOCOL || "https";
const BACKEND_HOST = process.env.REACT_APP_BACKEND_HOST || "localhost";
const BACKEND_PORT = process.env.REACT_APP_BACKEND_PORT || "4000";
const BACKEND_URL = `${PROTOCOL}://${BACKEND_HOST}:${BACKEND_PORT}`;

function BaseSidebar({ children, isCollapsed }) {
  const [bugHouseInfo, setBugHouseInfo] = useState({
    logo: "",
    contactInfo: {
      email: "",
      phone: "",
      address: "",
    },
  });

  useEffect(() => {
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
    <div className={`${styles.sidebar} ${isCollapsed ? styles.sidebarActive : ""}`}>
      <div className={styles.sidebarLogoGroup}>
        {bugHouseInfo.logo && (
          <img
            src={bugHouseInfo.logo}
            alt="BugHouse Logo"
            className={styles.sidebarLogo}
          />
        )}
        <div className={`${styles.sidebarTitle} ${isCollapsed ? styles.sidebarTitleHidden : ""}`}>bugHouse</div>
      </div>

      {/* Render the menu items passed as children */}
      {children}
      
      {!isCollapsed && (
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
        )}
      </div>
  );
}

export default BaseSidebar;