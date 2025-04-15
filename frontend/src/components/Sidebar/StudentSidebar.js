import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../styles/component/SideBar.module.css";
import { handleLogout } from "../../utils/authUtils";
import BaseSidebar from "./BaseSidebar";
//import * as FaIcons from "react-icons/fa";
import { FaSearch } from "react-icons/fa";
//import * as AiIcons from "react-icons/ai";
import { AiOutlineSchedule } from "react-icons/ai";
import { RiCalendarScheduleLine } from "react-icons/ri";
import { CgProfile } from "react-icons/cg";
import { MdOutlineSpaceDashboard, MdOutlineFeedback, MdLogout} from "react-icons/md";
import { IoPeopleSharp } from "react-icons/io5";
import { IoMdNotificationsOutline } from "react-icons/io";
import { FiChevronsRight } from "react-icons/fi";
import { HiChevronDoubleLeft } from "react-icons/hi";
import { GrSchedules } from "react-icons/gr";


import { IconContext } from "react-icons";


const StudentSidebar = ({ selected }) => {
  /*const location = useLocation();


  const[closeMenu, setCloseMenu] = useState(false);


  const handleCloseMenu = () => {
    setCloseMenu(!closeMenu);
  }*/
 
  //const navigate = useNavigate();


  return (
    <BaseSidebar >
      {/*<div className = {styles.burgerContainer}>
        <div className = "burgerTrigger"></div>
        <div className = "burgerMenu"></div>
      </div>*/}
      <div>
        {/*<img src></img>Should contain profile image
        <p className = "name">Hello, User</p> */} {/*Change this so that it gets the users name*/}
        <div className = {styles.contentsContainer}>
          <ul className = {styles.ulStudent}>
            <li className = {styles.liStudent}>
              <MdOutlineSpaceDashboard className = {styles.sidebarIcon} />
              <a className = {styles.aItem} href = "/home"> Dashboard</a>
            </li>
            <li className = {styles.liStudent}>
              <CgProfile className = {styles.sidebarIcon} />
              <a className = {styles.aItem} href = "/student-profile"> My Profile</a>
            </li>
            <li className = {styles.liStudent}>
              <FaSearch className = {styles.sidebarIcon} />
              <a className = {styles.aItem} href = "/find-tutors"> Find Tutors</a>
            </li>
            <li className = {styles.liStudent}>
              <AiOutlineSchedule className = {styles.sidebarIcon} />
              <a className = {styles.aItem} href = "/StudentSchedule"> Schedule a Session</a>
            </li>
            <li className = {styles.liStudent}>
              <RiCalendarScheduleLine className = {styles.sidebarIcon} />
              <a className = {styles.aItem} href = "/my-sessions"> My Sessions</a>
            </li>
            <li className = {styles.liStudent}>
              <IoPeopleSharp className = {styles.sidebarIcon} />
              <a className = {styles.aItem} href = "/my-tutors"> My Tutors</a>
            </li>
            <li className = {styles.liStudent}>
              <MdOutlineFeedback className = {styles.sidebarIcon} />
              <a className = {styles.aItem} href = "/feedback"> Leave Feedback</a>
            </li>
            <li className = {styles.liStudent}>
              <IoMdNotificationsOutline className = {styles.sidebarIcon} />
              <a className = {styles.aItem} href = "/notifications"> Notifications</a>
            </li>
            <li className = {styles.liStudent}>
              <MdLogout className = {styles.sidebarIcon} />
              <a className = {styles.aItem} onClick={handleLogout}> Log Out</a>
            </li>
          </ul>
        </div>
      </div>
    </BaseSidebar>
    /*<div className = {closeMenu === false ? "sidebar" : "sidebar active"}>
      <div
        className = {
          closeMenu === false
            ? "logoContainer"
            : "logoContainer active"
        }
      >
        <img src = {Icon} alt = "icon" className = "logo" />
        <h2 className = "title">BugHouse</h2>
      </div>
      <div className={ closeMenu === false ? "burgerContainer"  : "burgerContainer active"}>
        <div className="burgerTrigger" onClick={() => {handleCloseMenu();}}></div>


      </div>
    <BaseSidebar >
      <button
        className={selected === "home" ? `${styles.selected}` : ""}
        onClick={() => navigate("/home")}
      >
        Dashboard
      </button>
      <button
        className={selected === "profile" ? `${styles.selected}` : ""}
        onClick={() => navigate("/student-profile")}
      >
        Profile
      </button>
      <button
        className={selected === "find-tutors" ? `${styles.selected}` : ""}
        onClick={() => navigate("/find-tutors")}
      >
        Find Tutors
      </button>
      <button
        className={selected === "my-sessions" ? `${styles.selected}` : ""}
        onClick={() => navigate("/my-sessions")}
      >
        My Sessions
      </button>
      <button
        className={selected === "my-tutors" ? `${styles.selected}` : ""}
        onClick={() => navigate("/my-tutors")}
      >
        My Tutors
      </button>
      <button
        className={selected === "student-schedule" ? `${styles.selected}` : ""}
        onClick={() => navigate("/StudentSchedule")}
      >
        Schedule
      </button>
      <button
        className={selected === "notifications" ? `${styles.selected}` : ""}
        onClick={() => navigate("/notifications")}
      >
        Notifications
      </button>
      <button
        className={selected === "feedback" ? `${styles.selected}` : ""}
        onClick={() => navigate("/feedback")}
      >
        Leave Feedback
      </button>
      <button className={styles.logoutButton} onClick={handleLogout}>
        Log Out
      </button>
      </BaseSidebar>
    </div>*/
  );
};


export default StudentSidebar;
