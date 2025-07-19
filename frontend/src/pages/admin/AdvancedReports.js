import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminSidebar from "../../components/Sidebar/AdminSidebar";
import styles from "../../styles/AdvancedReports.module.css";

const PROTOCOL = process.env.REACT_APP_PROTOCOL || "https";
const BACKEND_HOST = process.env.REACT_APP_BACKEND_HOST || "localhost";
const BACKEND_PORT = process.env.REACT_APP_BACKEND_PORT || "4000";
const BACKEND_URL = `${PROTOCOL}://${BACKEND_HOST}:${BACKEND_PORT}`;

function AdvancedReports() {
  const [activeTab, setActiveTab] = useState("tutors");
  const [tutors, setTutors] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const tutorRes = await axios.get(`${BACKEND_URL}/api/analytics/tutors`, 
            { withCredentials: true }
        );

        const studentRes = await axios.get(`${BACKEND_URL}/api/analytics/students`, 
            { withCredentials: true }
        );

        setTutors(tutorRes.data);
        setStudents(studentRes.data);
        setLoading(false);

      } catch (err) {
        console.error("Error fetching analytics:", err);
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  return (
    <div className={styles.container}>
      <AdminSidebar selected="advanced-reports" />
      <div className={styles.mainContent}>
        <h1 className={styles.heading}>Advanced Reports</h1>

        {/* Switches tabs between Tutor and Student */}
        <div className={styles.tabBar}>
          <button onClick={() => setActiveTab("tutors")} className={activeTab === "tutors" ? styles.active : ""}>Tutors</button>
          <button onClick={() => setActiveTab("students")} className={activeTab === "students" ? styles.active : ""}>Students</button>
        </div>

        {/* Display content based on selected tab */}
        <div className={styles.tabContent}>
          {loading ? (
            <p>Loading...</p>
          ) : activeTab === "tutors" ? (
            <ul className={styles.reportList}>
              {tutors.map(tutor => (
                <li key={tutor.id} className={styles.reportCard}>
                  {tutor.name}: Total sessions {tutor.totalSessions}
                </li>
              ))}
            </ul>
          ) : (
            <ul className={styles.reportList}>
              {students.map(student => (
                <li key={student.id} className={styles.reportCard}>
                  {student.name}: Total sessions {student.totalSessions}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdvancedReports;
