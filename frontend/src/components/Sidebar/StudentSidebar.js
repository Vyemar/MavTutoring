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
} from "react-icons/md";
import { IoMdNotificationsOutline } from "react-icons/io";

const StudentSidebar = ({ selected }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isCollapsed, toggleSidebar } = useSidebar();
  
  const goTo = (path) => {
    if (location.pathname !== path) {
      navigate(path);
    }
  };
  
  return (
    <div className={`${styles.sidebar} ${isCollapsed ? styles.sidebarActive : ""}`}>
      <BaseSidebar isCollapsed={isCollapsed}>
        <div className={`${styles.burgerContainer} ${isCollapsed ? styles.burgerContainerActive : ""}`}>
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
              className={`${styles.liStudent} ${selected === "student-profile" ? styles.active : ""}`} 
              onClick={() => goTo("/student-profile")}
            >
              <div className={styles.iconContainer}>
                <CgProfile className={styles.sidebarIcon} />
              </div>
              <span className={styles.aItem}>My Profile</span>
            </li>
            <li 
              className={`${styles.liStudent} ${selected === "find-tutors" ? styles.active : ""}`} 
              onClick={() => goTo("/find-tutors")}
            >
              <div className={styles.iconContainer}>
                <FaSearch className={styles.sidebarIcon} />
              </div>
              <span className={styles.aItem}>Find Tutors</span>
            </li>
            <li 
              className={`${styles.liStudent} ${selected === "student-schedule" ? styles.active : ""}`} 
              onClick={() => goTo("/StudentSchedule")}
            >
              <div className={styles.iconContainer}>
                <AiOutlineSchedule className={styles.sidebarIcon} />
              </div>
              <span className={styles.aItem}>Schedule a Session</span>
            </li>
            <li 
              className={`${styles.liStudent} ${selected === "my-sessions" ? styles.active : ""}`} 
              onClick={() => goTo("/my-sessions")}
            >
              <div className={styles.iconContainer}>
                <RiCalendarScheduleLine className={styles.sidebarIcon} />
              </div>
              <span className={styles.aItem}>My Sessions</span>
            </li>
            <li 
              className={`${styles.liStudent} ${selected === "student-card-swipe" ? styles.active : ""}`} 
              onClick={() => goTo("/student/card-swipe")}
            >
              <div className={styles.iconContainer}>
                <FaRegAddressCard className={styles.sidebarIcon} />
              </div>
              <span className={styles.aItem}>Session Check-In</span>
            </li>
            <li 
              className={`${styles.liStudent} ${selected === "feedback" ? styles.active : ""}`} 
              onClick={() => goTo("/feedback")}
            >
              <div className={styles.iconContainer}>
                <MdOutlineFeedback className={styles.sidebarIcon} />
              </div>
              <span className={styles.aItem}>Leave Feedback</span>
            </li>
            <li 
              className={`${styles.liStudent} ${selected === "notifications" ? styles.active : ""}`} 
              onClick={() => goTo("/notifications")}
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
};

export default StudentSidebar;