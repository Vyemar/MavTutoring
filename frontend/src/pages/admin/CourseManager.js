import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "../../styles/CourseManager.module.css";
import AdminSidebar from "../../components/Sidebar/AdminSidebar";
import { useSidebar } from "../../components/Sidebar/SidebarContext";

const PROTOCOL = process.env.REACT_APP_PROTOCOL || "http";
const BACKEND_HOST = process.env.REACT_APP_BACKEND_HOST || "localhost";
const BACKEND_PORT = process.env.REACT_APP_BACKEND_PORT || "4000";
const BACKEND_URL = `${PROTOCOL}://${BACKEND_HOST}:${BACKEND_PORT}`;

function CourseManager() {
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState({ title: "", code: "", description: "" });
  const [editId, setEditId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { isCollapsed } = useSidebar();
  const sidebarWidth = isCollapsed ? "80px" : "270px";

  useEffect(() => {
    fetchCourses();
  }, [searchTerm]);

  const fetchCourses = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/courses`, { withCredentials: true });
      const filtered = res.data.filter(course =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.code.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setCourses(filtered);
    } catch (err) {
      console.error("Failed to fetch courses:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(`${BACKEND_URL}/api/courses/${editId}`, form, { withCredentials: true });
      } else {
        await axios.post(`${BACKEND_URL}/api/courses`, form, { withCredentials: true });
      }
      fetchCourses();
      setForm({ title: "", code: "", description: "" });
      setEditId(null);
    } catch (err) {
      console.error("Error submitting course:", err);
      alert(err.response?.data?.message || "Submission failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;
    try {
      await axios.delete(`${BACKEND_URL}/api/courses/${id}`, { withCredentials: true });
      fetchCourses();
    } catch (err) {
      console.error("Error deleting course:", err);
      alert(err.response?.data?.message || "Deletion failed");
    }
  };

  const handleEdit = (course) => {
    setEditId(course._id);
    setForm({ title: course.title, code: course.code, description: course.description || "" });
  };

  return (
    <div className={styles.container}>
      <AdminSidebar selected="manage-courses" />

      <div
        className={styles.mainContent}
        style={{ marginLeft: isCollapsed ? "80px" : "260px", transition: "margin-left 0.5s ease", "--sidebar-width": sidebarWidth }}
      >
        <div className={styles.headerSection}>
          <h1 className={styles.heading}>Manage Courses</h1>
        </div>

        <div className={styles.formWrapper}>
          <div className={styles.formCard}>
            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.inputRow}>
              <input
                className={styles.input}
                placeholder="Course Code"
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value })}
                required
              />
              <input
                className={styles.input}
                placeholder="Title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />
              <input
                className={styles.input}
                placeholder="Description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
              </div>

              <div className={styles.buttons}>
                <button className={styles.actionButtonTop} type="submit">
                  {editId ? "Update" : "Add"} Course
                </button>
                {editId && (
                  <button
                    className={styles.actionButtonTop}
                    type="button"
                    onClick={() => {
                      setEditId(null);
                      setForm({ title: "", code: "", description: "" });
                    }}
                  >
                    Cancel
                  </button>
                )}
              </div>
              </form>
            </div>
          </div>

          <div className={styles.toolbar}>
            <input
              type="text"
              placeholder="Search by title or code"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchBar}
            />
          </div>

          <table className={styles.courseTable}>
            <thead>
              <tr>
                <th>Code</th>
                <th>Title</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr key={course._id}>
                  <td>{course.code}</td>
                  <td>{course.title}</td>
                  <td>{course.description}</td>
                  <td>
                    <button
                      className={styles.actionButton}
                      onClick={() => handleEdit(course)}
                    >
                      Edit
                    </button>
                    <button
                      className={styles.actionButton}
                      onClick={() => handleDelete(course._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {courses.length === 0 && (
                <tr>
                  <td colSpan="4">No courses found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
  );
}

export default CourseManager;
