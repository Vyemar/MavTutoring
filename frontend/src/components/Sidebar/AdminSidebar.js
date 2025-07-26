import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "../../styles/component/SideBar.module.css";
import { handleLogout } from "../../utils/authUtils";
import BaseSidebar from "./BaseSidebar";
import { useSidebar } from "./SidebarContext";
import {
  MdOutlineSpaceDashboard,
  MdOutlineAnalytics,
  MdLogout,
} from "react-icons/md";
import { IoSettingsOutline } from "react-icons/io5";
import { FaUsers } from "react-icons/fa6";
import { FaBookOpen } from "react-icons/fa";
import { FaInbox } from 'react-icons/fa';


const AdminSidebar = ({ selected }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isCollapsed, toggleSidebar } = useSidebar();
  
  const goTo = (path) => {
    if (location.pathname !== path) {
      navigate(path);
    }
  };
  
  return (
    <div className={`${styles.sidebar} ${isCollapsed ? styles.sidebarActive : ""}`}>
      <BaseSidebar isCollapsed={isCollapsed}>
        <div
          className={`${styles.burgerContainer} ${isCollapsed ? styles.burgerContainerActive : ""}`}
        >
          <div className={styles.burgerTrigger} onClick={toggleSidebar}></div>
          <div className={styles.burgerMenu}></div>
        </div>
        <div className={`${styles.contentsContainer} ${isCollapsed ? styles.contentsContainerActive : ""}`}>
          <ul className={styles.ulStudent}>
            <li 
              className={`${styles.liStudent} ${selected === "home" ? styles.active : ""}`} 
              onClick={() => goTo("/home")}
            >
              <div className={styles.iconContainer}>
                <MdOutlineSpaceDashboard className={styles.sidebarIcon} />
              </div>
              <span className={styles.aItem}>Dashboard</span>
            </li>
            <li 
              className={`${styles.liStudent} ${selected === "manage-users" ? styles.active : ""}`} 
              onClick={() => goTo("/manage-users")}
            >
              <div className={styles.iconContainer}>
                <FaUsers className={styles.sidebarIcon} />
              </div>
              <span className={styles.aItem}>Manage Users</span>
            </li>
            <li 
              className={`${styles.liStudent} ${selected === "manage-courses" ? styles.active : ""}`} 
              onClick={() => goTo("/manage-courses")}
            >
              <div className={styles.iconContainer}>
                <FaBookOpen className={styles.sidebarIcon} />
              </div>
              <span className={styles.aItem}>Manage Courses</span>
            </li>
            <li 
              className={`${styles.liStudent} ${selected === "analytics" ? styles.active : ""}`} 
              onClick={() => goTo("/analytics")}
            >
              <div className={styles.iconContainer}>
                <MdOutlineAnalytics className={styles.sidebarIcon} />
              </div>
              <span className={styles.aItem}>System Analytics</span>
            </li>
            <li 
              className={`${styles.liStudent} ${selected === "tutor-requests" ? styles.active : ""}`} 
              onClick={() => goTo("/tutor-requests")}
            >
              <div className={styles.iconContainer}>
                <FaInbox className={styles.sidebarIcon} />
              </div>
              <span className={styles.aItem}>Tutor Requests</span>
            </li>
            <li 
              className={`${styles.liStudent} ${selected === "admin-settings" ? styles.active : ""}`} 
              onClick={() => goTo("/admin-settings")}
            >
              <div className={styles.iconContainer}>
                <IoSettingsOutline className={styles.sidebarIcon} />
              </div>
              <span className={styles.aItem}>Settings</span>
            </li>
            <li 
              className={styles.liStudent} 
              onClick={handleLogout}
            >
              <div className={styles.iconContainer}>
                <MdLogout className={styles.sidebarIcon} />
              </div>
              <span className={styles.aItem}>Log Out</span>
            </li>
          </ul>
        </div>
      </BaseSidebar>
    </div>
  );
};

export default AdminSidebar;