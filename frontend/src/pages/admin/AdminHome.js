
import React from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar  from '../../components/Sidebar/AdminSidebar';
import styles from '../../styles/AdminHome.module.css';

function AdminHome() {
  const navigate = useNavigate();


    // Function to handle logout and navigate back to login page
    const handleLogout = () => {
        localStorage.removeItem('role'); // Clear the role from localStorage
        localStorage.removeItem('userID'); // Clear the ID from localStorage
        navigate('/login'); // Redirect to login page
    };

    return (
        <div className={styles.container}>
            {/* Sidebar */}
      <AdminSidebar selected="home"></AdminSidebar>
      {/* Main Content */}
      <div className={styles.mainContent}>
        <h1 className={styles.heading}>Admin Dashboard</h1>
        {/* User Management Section */}
        <section className={styles.section}>
          <h2>User Management</h2>
          <p>Manage users in the system, including tutors and students.</p>
          <button onClick={() => navigate("/manage-users")}>
            View and Manage Users
          </button>
        </section>

        {/* Analytics Section */}
        <section className={styles.section}>
          <h2>System Analytics</h2>
          <p>View system analytics and performance data.</p>
          <button onClick={() => navigate("/analytics")}>View Analytics</button>
        </section>

        {/* Settings Section */}
        <section className={styles.section}>
          <h2>Settings</h2>
          <p>Configure system settings, roles, and permissions.</p>
          <button onClick={() => navigate("/admin-settings")}>
            Go to Settings
          </button>
        </section>
      </div>
    </div>
  );
}

export default AdminHome;
