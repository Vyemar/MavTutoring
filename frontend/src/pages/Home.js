import React from "react";
import { useNavigate } from "react-router-dom";
import TutorHome from "./tutor/TutorHome";
import AdminHome from "./admin/AdminHome";
import StudentHome from "./student/StudentHome";
import styles from '../styles/Home.module.css';
import { axiosGetData } from "../utils/api";
import { useEffect, useState } from "react";

function Home() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        async function fetchUserSession() {
            try {
                const response = await axiosGetData("https://localhost:4000/api/auth/session");
                if (response.user) {
                    setUser(response.user);
                } else {
                    navigate("/login", { replace: true }); // Redirect to login if not authenticated
                }
            } catch (error) {
                navigate("/login"); // Redirect to login
            }
        }

        fetchUserSession();
    }, [navigate]);

    // // Get the role from localStorage (or context if you're using React Context API)
    // const role = localStorage.getItem('role');

    // // Logout function to clear localStorage and navigate back to login page
    // const handleLogout = () => {
    //     localStorage.removeItem('role');
    //     navigate('/login'); // Redirect back to the login page
    // };

    const handleLogout = async () => {
        try {
            await axiosGetData("https://localhost:4000/api/auth/logout");
            navigate("/login"); // Redirect after logout
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    if (!user) {
        return null; // Return null if user is not authenticated
    }

    // Conditional rendering based on the user's role
    switch (user.role) {
        case 'Admin':
            return <AdminHome handleLogout={handleLogout}/>;
        case 'Tutor':
            return <TutorHome handleLogout={handleLogout}/>;
        case 'Student':
            return <StudentHome handleLogout={handleLogout}/>;
        default:
            return (
                <div className={styles.container}>
                    <h1 className={styles.heading}>Home Page</h1>
                    <p className={styles.welcome}>Welcome to the home page, guest!</p>
                    <button className={styles.logoutButton} onClick={handleLogout}>Logout</button>
                </div>
            );
        }
    }

export default Home;
