import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "../../styles/CourseManager.module.css";
import AdminSideBar from "../../components/Sidebar/AdminSidebar";
import { useSidebar } from "../../components/Sidebar/SidebarContext";

const PROTOCOL = process.env.REACT_APP_PROTOCOL || "http";
const BACKEND_HOST = process.env.REACT_APP_BACKEND_HOST || "localhost";
const BACKEND_PORT = process.env.REACT_APP_BACKEND_PORT || "4000";
const BACKEND_URL = `${PROTOCOL}://${BACKEND_HOST}:${BACKEND_PORT}`;

function CourseManager() {
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState({ title: "", code: "", description: "" });
  const [editId, setEditId] = useState(null);
  const { isCollapsed } = useSidebar();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/courses`, { withCredentials: true });
      setCourses(res.data);
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
      <AdminSideBar selected="manage-courses" />
      <div className={styles.mainContent} style={{ marginLeft: isCollapsed ? "100px" : "290px", transition: "margin-left 0.5s ease" }}>
        <h2 className={styles.heading}>Course Manager (Admin)</h2>
        <form className={styles.form} onSubmit={handleSubmit}>
          <input placeholder="Course Code" value={form.code} onChange={e => setForm({ ...form, code: e.target.value })} required />
          <input placeholder="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
          <input placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
          <div className={styles.buttons}>
            <button type="submit">{editId ? "Update" : "Add"} Course</button>
            {editId && <button type="button" onClick={() => { setEditId(null); setForm({ title: "", code: "", description: "" }); }}>Cancel</button>}
          </div>
        </form>

        <table className={styles.table}>
          <thead>
            <tr>
              <th>Code</th>
              <th>Title</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.map(course => (
              <tr key={course._id}>
                <td>{course.code}</td>
                <td>{course.title}</td>
                <td>{course.description}</td>
                <td>
                  <button onClick={() => handleEdit(course)}>Edit</button>
                  <button onClick={() => handleDelete(course._id)}>Delete</button>
                </td>
              </tr>
            ))}
            {courses.length === 0 && (
              <tr><td colSpan="4">No courses found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CourseManager;
