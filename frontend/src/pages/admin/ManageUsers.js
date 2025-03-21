import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import AdminSidebar from '../../components/Sidebar/AdminSidebar';
import ViewProfile from './ViewProfile';
import styles from '../../styles/ManageUsers.module.css';

// Get configuration from environment variables
const PROTOCOL = process.env.REACT_APP_PROTOCOL || 'https';
const BACKEND_HOST = process.env.REACT_APP_BACKEND_HOST || 'localhost';
const BACKEND_PORT = process.env.REACT_APP_BACKEND_PORT || '4000';

// Construct the backend URL dynamically
const BACKEND_URL = `${PROTOCOL}://${BACKEND_HOST}:${BACKEND_PORT}`;

function ManageUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedRole, setSelectedRole] = useState("Tutor");

    const navigate = useNavigate();  // Initialize navigate using useNavigate

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get(`${BACKEND_URL}/api/users`);
                const filteredUsers = response.data
                    .filter(user => selectedRole === "All" ? true : user.role === selectedRole)
                    .sort((a, b) => a.lastName.localeCompare(b.lastName));
                setUsers(filteredUsers);
            } catch (error) {
                console.error("Error fetching users:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [selectedRole]);

    return (
        <div className={styles.container}>
            {/* Sidebar */}
            <AdminSidebar selected="manage-users"/>

            {/* Main Content */}
            <div className={styles.mainContent}>
                <div className={styles.headerSection}>
                    <h1 className={styles.heading}>Manage Users</h1>
                    <div className={styles.roleSelector}>
                        <label htmlFor="role">Select Role:</label>
                        <select id="role" value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)}>
                            <option value="Tutor">Tutors</option>
                            <option value="Student">Students</option>
                            <option value="Admin">Admins</option>
                            <option value="All">All Users</option>
                        </select>
                    </div>
                </div>

                {/* Table Container for Independent Scrolling */}
                <div className={styles.tableContainer}>
                    {loading ? (
                        <div className={styles.spinnerContainer}>
                            <div className={styles.spinner}></div>
                            <p>Loading users...</p>
                        </div>
                    ) : users.length > 0 ? (
                        <table className={styles.userTable}>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(user => (
                                    <tr key={user._id}>
                                        <td>{user.firstName} {user.lastName}</td>
                                        <td>{user.email}</td>
                                        <td>{user.phone}</td>
                                        <td>
                                            <button 
                                                className={styles.viewProfileButton} 
                                                onClick={() => navigate(`/ViewProfile/${user._id}`)}
                                            >
                                                View Profile
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>No users found.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ManageUsers;
