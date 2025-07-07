import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "../../styles/component/SideBar.module.css";
import { handleLogout } from "../../utils/authUtils";
import BaseSidebar from "./BaseSidebar";
import { useSidebar } from "./SidebarContext";
import { FaSearch } from "react-icons/fa";
import { AiOutlineSchedule } from "react-icons/ai";
import { RiCalendarScheduleLine } from "react-icons/ri";
import { CgProfile } from "react-icons/cg";
import { FaRegAddressCard } from "react-icons/fa";
import {
  MdOutlineSpaceDashboard,
  MdOutlineFeedback,
  MdLogout,
  MdOutlineSchedule
} from "react-icons/md";
import { IoMdNotificationsOutline } from "react-icons/io";
import { SlCalender } from "react-icons/sl";

const TutorSidebar = ({ selected }) => {
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
              className={`${styles.liStudent} ${selected === "tutor-profile" ? styles.active : ""}`} 
              onClick={() => goTo("/tutor-profile")}
            >
              <div className={styles.iconContainer}>
                <CgProfile className={styles.sidebarIcon} />
              </div>
              <span className={styles.aItem}>My Profile</span>
            </li>
            <li 
              className={`${styles.liStudent} ${selected === "availability" ? styles.active : ""}`} 
              onClick={() => goTo("/availability")}
            >
              <div className={styles.iconContainer}>
                <MdOutlineSchedule className={styles.sidebarIcon} />
              </div>
              <span className={styles.aItem}>Set Availability</span>
            </li>
            <li 
              className={`${styles.liStudent} ${selected === "schedule" ? styles.active : ""}`} 
              onClick={() => goTo("/schedule")}
            >
              <div className={styles.iconContainer}>
                <SlCalender className={styles.sidebarIcon} />
              </div>
              <span className={styles.aItem}>View Calendar</span>
            </li>
            <li 
              className={`${styles.liStudent} ${selected === "sessions" ? styles.active : ""}`} 
              onClick={() => goTo("/sessions")}
            >
              <div className={styles.iconContainer}>
                <RiCalendarScheduleLine className={styles.sidebarIcon} />
              </div>
              <span className={styles.aItem}>My Sessions</span>
            </li>
            <li  
              className={`${styles.liTutor} ${selected === "tutor-card-swipe" ? styles.active : ""}`} 
              onClick={() => goTo("/tutor/card-swipe")}
            >
              <div className={styles.iconContainer}>
                <FaRegAddressCard className={styles.sidebarIcon} />
              </div>
              <span className={styles.aItem}>Session Check-In</span>
            </li>
            <li 
              className={`${styles.liStudent} ${selected === "tutor-notifications" ? styles.active : ""}`} 
              onClick={() => goTo("/TutorNotifications")}
            >
              <div className={styles.iconContainer}>
                <IoMdNotificationsOutline className={styles.sidebarIcon} />
              </div>
              <span className={styles.aItem}>Notifications</span>
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
}

export default TutorSidebar;