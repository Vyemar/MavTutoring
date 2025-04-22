import React, { useState } from "react";
import { useNavigate, useLocation} from "react-router-dom";
import styles from "../../styles/component/SideBar.module.css";
import { handleLogout } from "../../utils/authUtils";
import BaseSidebar from "./BaseSidebar";
//import * as FaIcons from "react-icons/fa";
import { FaSearch } from "react-icons/fa";
//import * as AiIcons from "react-icons/ai";
import { AiOutlineSchedule } from "react-icons/ai";
import { RiCalendarScheduleLine } from "react-icons/ri";
import { CgProfile } from "react-icons/cg";
import { MdOutlineSpaceDashboard, MdOutlineFeedback, MdLogout, MdOutlineSchedule} from "react-icons/md";
import { IoMdNotificationsOutline } from "react-icons/io";
import { SlCalender } from "react-icons/sl";

function TutorSidebar({ onLogout/*, selected*/}) {
  const location = useLocation();


  const[closeMenu, setCloseMenu] = useState(true);


  const handleCloseMenu = () => {
  setCloseMenu(!closeMenu);
  };

  //const navigate = useNavigate();
    return (
      <div className={`${styles.sidebar} ${closeMenu ? styles.sidebarActive : ""}`}>
      <BaseSidebar isCollapsed={closeMenu}>
      <div className={`${styles.burgerContainer} ${closeMenu ? styles.burgerContainerActive : ""}`}>
        <div className={styles.burgerTrigger} onClick={() => {handleCloseMenu();}}></div> {/*CHECK HERE*/}
          <div className = {styles.burgerMenu}></div>
        </div>
        <div>
          {/*<img src></img>Should contain profile image
          <p className = "name">Hello, User</p> */} {/*Change this so that it gets the users name*/}
          <div className={`${styles.contentsContainer} ${closeMenu ? styles.contentsContainerActive : ""}`}>
            <ul className = {styles.ulStudent}>
              <li
                className={styles.liStudent}
                onClick={() => (window.location.href = "/home")}
              >
                <MdOutlineSpaceDashboard className={styles.sidebarIcon} />
                <span className={styles.aItem}>Dashboard</span>
              </li>
  
              <li
                className={styles.liStudent}
                onClick={() => (window.location.href = "/tutor-profile")}
              >
                <CgProfile className={styles.sidebarIcon} />
                <span className={styles.aItem}>My Profile</span>
              </li>
  
              <li
                className={styles.liStudent}
                onClick={() => (window.location.href = "/availability")}
              >
                <MdOutlineSchedule className={styles.sidebarIcon} />
                <span className={styles.aItem}>Set Availability</span>
              </li>
  
              <li
                className={styles.liStudent}
                onClick={() => (window.location.href = "/schedule")}
              >
                <SlCalender className={styles.sidebarIcon} />
                <span className={styles.aItem}>View Calender</span>
              </li>
  
              <li
                className={styles.liStudent}
                onClick={() => (window.location.href = "/sessions")}
              >
                <RiCalendarScheduleLine className={styles.sidebarIcon} />
                <span className={styles.aItem}>Sessions</span>
              </li>
  
              <li
                className={styles.liStudent}
                onClick={() => (window.location.href ="/TutorNotifications")}
              >
                <IoMdNotificationsOutline className={styles.sidebarIcon} />
                <span className={styles.aItem}>Notifications</span>
              </li>
  
              <li
                className={styles.liStudent}
                onClick={handleLogout}
              >
                <MdLogout className={styles.sidebarIcon} />
                <span className={styles.aItem}>Log Out</span>
              </li>
            </ul>
  
          </div>
        </div>
      </BaseSidebar>
      </div>
  );
};

export default TutorSidebar;
