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
import { MdOutlineSpaceDashboard,  MdOutlineAnalytics ,MdLogout, MdOutlineSchedule} from "react-icons/md";
import { IoSettingsOutline } from "react-icons/io5";
import { SlCalender } from "react-icons/sl";
import { FaRegAddressCard } from "react-icons/fa";
import { FaUsers } from "react-icons/fa6";

const AdminSidebar = ({ onLogout/*, selected*/ }) => {
  const location = useLocation();


  const[closeMenu, setCloseMenu] = useState(true);


  const handleCloseMenu = () => {
  setCloseMenu(!closeMenu);
  };

  //const navigate = useNavigate();;

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
                onClick={() => (window.location.href = "/card-swipe")}
              >
                <FaRegAddressCard  className={styles.sidebarIcon} />
                <span className={styles.aItem}>ID Card Session</span>
              </li>
  
              <li
                className={styles.liStudent}
                onClick={() => (window.location.href = "/manage-users")}
              >
                <FaUsers  className={styles.sidebarIcon} />
                <span className={styles.aItem}>Manage Users</span>
              </li>
  
              <li
                className={styles.liStudent}
                onClick={() => (window.location.href = "/analytics")}
              >
                <MdOutlineAnalytics  className={styles.sidebarIcon} />
                <span className={styles.aItem}>System Analytics</span>
              </li>
  
              <li
                className={styles.liStudent}
                onClick={() => (window.location.href = "/admin-settings")}
              >
                <IoSettingsOutline  className={styles.sidebarIcon} />
                <span className={styles.aItem}>Settings</span>
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
    /*<BaseSidebar >
      <button
        className={selected === "home" ? `${styles.selected}` : ""}
        onClick={() => navigate("/home")}
      >
        Dashboard
      </button>
      <button
        className={selected === "ID Card Session" ? `${styles.selected}` : ""}
        onClick={() => navigate("/card-swipe")}
      >
        ID Card Session
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
    </BaseSidebar>*/
  );
};

export default AdminSidebar;
