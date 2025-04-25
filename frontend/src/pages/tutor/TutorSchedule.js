import React, { useState, useEffect } from 'react';
import TutorSidebar from '../../components/Sidebar/TutorSidebar';
import TutorCalendar from './TutorCalendar';
import styles from '../../styles/TutorSchedule.module.css'; // Your existing CSS
import { useSidebar } from "../../components/Sidebar/SidebarContext";

function TutorSchedule() {
  const { isCollapsed } = useSidebar();
  
  return (
    <div className={styles.container}>
      <TutorSidebar selected="schedule" />
      <div 
        className={styles.mainContent} 
        style={{ marginLeft: isCollapsed ? "80px" : "280px" , transition: "margin-left 0.5s ease"}}
      >
        <h1 className={styles.heading}>Calendar</h1>
        <div className={styles.calendarContainer}>
          <TutorCalendar />
        </div>
      </div>
    </div>
  );
}

export default TutorSchedule;