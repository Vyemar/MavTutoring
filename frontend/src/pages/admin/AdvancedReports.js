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
  const [tutorDepartments, setTutorDepartments] = useState([]);
  const [topTutorCourses, setTopTutorCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [studentStats, setStudentStats] = useState([]);
  const [tutorStats, setTutorStats] = useState({});
  const [tutorRatings, setTutorRatings] = useState([]);

  // Retrieves tutor's and student's analytics
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

  // Retrieves the top 5 courses being requested
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

  // Retrieves the majors of all students
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

  // Retrieves the learning style of what students have on their profile
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

  useEffect(() => {
    const fetchStudentStats = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/api/analytics/student-stats`, {
          withCredentials: true
        });
        setStudentStats(res.data);
      } catch (err) {
        console.error("Failed to fetch student stats", err);
      }
    };

    fetchStudentStats();
  }, []);

  useEffect(() => {
    const fetchTutorStats = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/api/analytics/tutor-stats`);
        setTutorStats(res.data);
      } catch (err) {
        console.error("Failed to fetch tutor stats", err);
      }
    };
    
    fetchTutorStats();
  }, []);

  useEffect(() => {
    const fetchTutorDepartments = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/api/analytics/tutor-departments`, {
          withCredentials: true
        });
        setTutorDepartments(res.data);
      } catch (err) {
        console.error("Failed to fetch tutor department data", err);
      }
    };

    fetchTutorDepartments();
  }, []);

  useEffect(() => {
    const fetchTopTutorCourses = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/api/analytics/top-courses-by-tutors`, {
          withCredentials: true
        });
        setTopTutorCourses(res.data);
      } catch (err) {
        console.error("Failed to fetch top tutor courses", err);
      }
    };

    fetchTopTutorCourses();
  }, []);

  useEffect(() => {
    const fetchTutorRatings = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/api/analytics/tutors-average-rating`);
        setTutorRatings(res.data);
      } catch (error) {
        console.error('Error fetching tutor ratings:', error);
      }
    };

    fetchTutorRatings();
  }, []);

  const toggleExpand = (id) => {
    setExpandedIds(prev =>
      prev.includes(id)
        ? prev.filter(i => i !== id)
        : [...prev, id]
    );
  };

  const filteredTutors = tutors.filter(t =>
    t.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );


  const filteredStudents = students.filter(s =>
    s.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );


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
            <>
              <div className={styles.pieChartsContainer}>
                {/* Tutors by Department */}
                {tutorDepartments.length > 0 && (
                  <div className={styles.pieChart}>
                    <h2>Tutors by Department</h2>
                   <Pie
                      data={{
                        labels: tutorDepartments.map(dep => dep.major),
                        datasets: [{
                          data: tutorDepartments.map(dep => dep.count),
                          backgroundColor: ['#36a2eb', '#ff6384', '#ffcd56', '#4bc0c0', '#9966ff']
                        }]
                      }}
                    />
                  </div>
                )}

                {/* Top 5 Courses by Tutor Count */}
                {topTutorCourses.length > 0 && (
                  <div className={styles.pieChart}>
                    <h2>Top 5 Courses by Tutor Count</h2>
                    <Pie
                      data={{
                        labels: topTutorCourses.map(course => course.name), 
                        datasets: [{
                          data: topTutorCourses.map(course => course.count), 
                          backgroundColor: ['#ff6384', '#36a2eb', '#ffcd56', '#4bc0c0', '#9966ff']
                        }]
                      }}
                    />
                  </div>
                )}

                {/* Tutors by Average Rating */}
                {tutorRatings.length > 0 && (
                <div className={styles.pieChart}>
                  <h2>Tutors by Average Rating</h2>
                  <Pie
                    data={{
                      labels: tutorRatings.map(r => r._id),
                      datasets: [{
                        data: tutorRatings.map(r => r.count),
                        backgroundColor: ['#0eaf29ff', '#4bc0c0', '#ffcd56', '#9966ff', '#ff6384', '#36a2eb', '#ff9f40']
                      }]
                    }}
                  />
                </div>
              )}
              </div>


              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name..."
                  style={{
                    width: '300px',
                    padding: '10px',
                    fontSize: '16px',
                    borderRadius: '8px',
                    border: '1px solid #ccc',
                    backgroundColor: '#fff'
                  }}
                />
              </div>

              <ul className={styles.reportList}>
                {filteredTutors.map(tutor => (
                  <li key={tutor.id} className={styles.reportCard}>
                    <div onClick={() => toggleExpand(tutor.id)} style={{ cursor: 'pointer' }}>
                      <Link to={`/admin/report/tutor/${tutor.id}`} className={styles.nameLink}>
                        {tutor.name}
                      </Link>
                    </div>

                    {expandedIds.includes(tutor.id) && (() => {
                      const stats = tutorStats[tutor.id];
                      return stats ? (
                        <div className={styles.details}>
                          <p>Average Rating: {tutor.avgRating || 'N/A'}</p>
                          <p>Number of Ratings: {tutor.ratingCount || 0}</p>
                          <p>Most Frequent Course: {stats.mostFrequentCourse || 'N/A'}</p>
                          <p>Most Frequent Student: {stats.mostFrequentStudent || 'N/A'}</p>
                          <p>Total Sessions Completed: {stats.completedSessions || 0}</p>
                        </div>
                      ) : (
                        <p>This tutor has no session details yet.</p>
                      );
                    })()}
                  </li>
                ))}
              </ul>
            </>
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
                            backgroundColor: ['#36a2eb', '#ff6384', '#ffcd56', '#9966ff']
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

              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name..."
                  style={{
                    width: '300px',
                    padding: '10px',
                    fontSize: '16px',
                    borderRadius: '8px',
                    border: '1px solid #ccc',
                    backgroundColor: '#fff'
                  }}
                />
              </div>

              {/* Student list*/}
              <ul className={styles.reportList}>
                {filteredStudents.map(student => (
                  <li key={student.id} className={styles.reportCard}>
                    <div onClick={() => toggleExpand(student.id)} style={{ cursor: 'pointer' }}>
                      <Link to={`/admin/report/student/${student.id}`} className={styles.nameLink}>
                        {student.name}
                      </Link>
                    </div>

                    {expandedIds.includes(student.id) && (() => {
                      const stats = studentStats[student.id];
                      return stats ? (
                        <div className={styles.details}>
                          {/* Total is based on student scheduling a session, completed is based on if tutor marks session as complete */}
                          <p>Total Sessions Scheduled: {student.totalSessions}</p>
                          <p>Completed Sessions: {stats.completedSessions}</p>
                          <p>Attendance Rate: {student.totalSessions > 0 
                                              ? " " + ((stats.completedSessions / student.totalSessions) * 100).toFixed(1) + "%" 
                                              : "0%"} </p>
                          <p>Most Frequent Course: {stats.mostFrequentCourseCode 
                                              ? `${stats.mostFrequentCourseCode} - ${stats.mostFrequentCourseTitle}` 
                                              : "N/A"} </p>
                          <p>Preferred Learning Style: {stats.preferredLearningStyle}</p>
                          <p className={styles.uniqueCoursesLabel} > 
                              Unique Courses Visited: {stats.uniqueCoursesCount} 
                          </p>
                          
                          {stats.uniqueCourses && stats.uniqueCourses.length > 0 ? ( 
                            <div className={styles.uniqueCoursesList}>
                              <ul>
                                {stats.uniqueCourses.map((course, idx) => (
                                  <li key={idx}>
                                    {course.code} - {course.title}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            ) : (
                              <li>N/A</li>
                            )}
                          
                        </div>
                      ) : (
                        <p>Student has no details, schedule a session!</p>
                      );
                    })()}
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
