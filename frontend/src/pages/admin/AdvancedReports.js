import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import AdminSidebar from "../../components/Sidebar/AdminSidebar";
import styles from "../../styles/AdvancedReports.module.css";

// Pie Chart integration
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
ChartJS.register(ArcElement, Tooltip, Legend);


const PROTOCOL = process.env.REACT_APP_PROTOCOL || "https";
const BACKEND_HOST = process.env.REACT_APP_BACKEND_HOST || "localhost";
const BACKEND_PORT = process.env.REACT_APP_BACKEND_PORT || "4000";
const BACKEND_URL = `${PROTOCOL}://${BACKEND_HOST}:${BACKEND_PORT}`;

function AdvancedReports() {
  const [activeTab, setActiveTab] = useState("tutors");
  const [tutors, setTutors] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedIds, setExpandedIds] = useState([]);
  const [topCourses, setTopCourses] = useState([]);
  const [studentMajors, setStudentMajors] = useState([]);
  const [learningStyles, setLearningStyles] = useState([]);

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

  useEffect(() => {
    const fetchTopCourses = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/api/analytics/top-courses`, {
          withCredentials: true
        });
        //console.log("Top courses:", res.data);
        setTopCourses(res.data);
      } catch (err) {
        console.error("Failed to fetch top courses", err);
      }
    };

    fetchTopCourses();
  }, []);

  useEffect(() => {
    const fetchStudentMajors = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/api/analytics/student-majors`, {
          withCredentials: true
        });
        // console.log("Student majors:", res.data); 
        setStudentMajors(res.data);
      } catch (err) {
        console.error("Failed to fetch student major data", err);
      }
    };

    fetchStudentMajors();
  }, []);

  useEffect(() => {
    const fetchLearningStyle = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/api/analytics/student-learning-styles`, {
          withCredentials: true
        });
        console.log("Student Learning Styles:", res.data);
        setLearningStyles(res.data);
      } catch (err) {
        console.error("Failed to fetch student major data", err);
      }
    };

    fetchLearningStyle();
  }, []);


  const toggleExpand = (id) => {
    setExpandedIds(prev =>
      prev.includes(id)
        ? prev.filter(i => i !== id)
        : [...prev, id]
    );
  };

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
                  <Link to={`/admin/report/${tutor.id}`} className={styles.nameLink}>
                    {tutor.name}
                  </Link>
                  : Total sessions {tutor.totalSessions}
                </li>
              ))}
            </ul>
          ) : (
            <> {/* ALL PIE CHARTS */}
              <div className={styles.pieChartsContainer}>
                {/* Pie Chart for top 5 courses*/}
                {topCourses.length > 0 && (
                  <div className={styles.pieChart}>
                    <h2>Top 5 Most Visited Courses</h2>
                    <Pie
                      data={{
                        labels: topCourses.map(course => course.name),
                        datasets: [
                          {
                            data: topCourses.map(course => course.count),
                            backgroundColor: ['#4dc9f6', '#f67019', '#f53794', '#537bc4', '#acc236']
                          }
                        ]
                      }}
                    />
                  </div>
                )}

                {/* Pie Chart for the number of students in each department (major)*/}
                {studentMajors.length > 0 && (
                  <div className={styles.pieChart}>
                    <h2>Students by Major</h2>
                    <Pie
                      data={{
                        labels: studentMajors.map(m => m.major),
                        datasets: [
                          {
                            data: studentMajors.map(m => m.count),
                            backgroundColor: ['#36a2eb', '#ff6384', '#ffcd56', '#9966ff', '#4bc0c0']
                          }
                        ]
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: true
                      }}
                    />
                  </div>
                )}

                {/* Pie Chart for the preferred learning styles*/}
                {learningStyles.length > 0 && (
                  <div className={styles.pieChart}>
                    <h2>Preferred Learning Styles</h2>
                    <Pie
                      data={{
                        labels: learningStyles.map(ls => ls.style),
                        datasets: [
                          {
                            data: learningStyles.map(ls => ls.count),
                            backgroundColor: ['#ff9f40', '#4bc0c0', '#9966ff', '#ff6384', '#36a2eb']
                          }
                        ]
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Student list)*/}
              <ul className={styles.reportList}>
                {students.map(student => (
                  <li key={student.id} className={styles.reportCard}>
                    <div onClick={() => toggleExpand(student.id)}>
                      <Link to={`/admin/report/${student.id}`} className={styles.nameLink}>
                        {student.name}
                      </Link>
                      : Total Sessions {student.totalSessions}
                    </div>

                    {expandedIds.includes(student.id) && (
                      <div className={styles.details}>
                        <p>Completed: {student.completedSessions}</p>
                        <p>No-Shows: {student.noShowSessions}</p>
                        <p>Last Month: {student.lastMonthSessions}</p>
                        <p>Department: {student.department}</p>
                        <p>Frequent Course: {student.frequentCourse}</p>
                        {/* Add tutorsSeen list if needed */}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdvancedReports;
