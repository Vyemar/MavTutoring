import React, { useEffect, useState } from "react";
import styles from "../../styles/StudentHome.module.css";
import StudentCalendar from "./StudentCalendar";
import StudentSidebar from "../../components/Sidebar/StudentSidebar";
import { useSidebar } from "../../components/Sidebar/SidebarContext";

function StudentHome() {
  const { isCollapsed } = useSidebar();
  const [ studentName, setStudentName ] = useState("");

  // As of now getting username from localstorage that's where user name and role will be once logged in
  useEffect(() => {
    const storeUser = JSON.parse(localStorage.getItem("user"));
     console.log("Fetched user:", storeUser);
    if(storeUser?.name) {
      setStudentName(storeUser.name);
    }
  }, []);
  
  return (
    <div className={styles.container}>
      <StudentSidebar selected="home" />
      <div
        className={styles.mainContent}
        style={{ marginLeft: isCollapsed ? "90px" : "280px" , transition: "margin-left 0.5s ease"}}
      >
        <h1 className={styles.heading}>
          {studentName ? `${studentName}'s Dashboard` : "Student Dashboard"}
        </h1>
        <section>
          <h2 className={styles.calSubHeading}>Calendar</h2>
          <StudentCalendar />
        </section>
        <section className={styles.notifications}>
          <h2>Notifications</h2>
          <p>No new notifications</p>
        </section>
      </div>
    </div>
  );
}

export default StudentHome;