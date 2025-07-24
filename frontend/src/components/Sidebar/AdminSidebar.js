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
  MdRateReview,
} from "react-icons/md";
import { IoSettingsOutline } from "react-icons/io5";
import { FaRegAddressCard } from "react-icons/fa";
import { FaUsers } from "react-icons/fa6";

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
          <div className={styles.burgerTrigger} onClick={toggleSidebar} role="button" tabIndex={0} />
          <div className={styles.burgerMenu}></div>
        </div>
        <div className={`${styles.contentsContainer} ${isCollapsed ? styles.contentsContainerActive : ""}`}>
          <ul className={styles.ulStudent}>
            {[
              { key: "home", label: "Dashboard", icon: <MdOutlineSpaceDashboard />, path: "/home" },
              { key: "card-swipe", label: "ID Card Session", icon: <FaRegAddressCard />, path: "/card-swipe" },
              { key: "manage-users", label: "Manage Users", icon: <FaUsers />, path: "/manage-users" },
              { key: "analytics", label: "System Analytics", icon: <MdOutlineAnalytics />, path: "/analytics" },
              { key: "admin-settings", label: "Settings", icon: <IoSettingsOutline />, path: "/admin-settings" },
              { key: "admin-reviews", label: "Tutor Reviews", icon: <MdRateReview />, path: "/admin-reviews" },
            ].map(({ key, label, icon, path }) => (
              <li
                key={key}
                className={`${styles.liStudent} ${selected === key ? styles.active : ""}`}
                onClick={() => goTo(path)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if(e.key === "Enter") goTo(path); }}
              >
                <div className={styles.iconContainer}>{React.cloneElement(icon, { className: styles.sidebarIcon })}</div>
                <span className={styles.aItem}>{label}</span>
              </li>
            ))}
            <li
              className={styles.liStudent}
              onClick={handleLogout}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if(e.key === "Enter") handleLogout(); }}
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
