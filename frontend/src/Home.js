import React from "react";
import { useNavigate } from "react-router-dom";
import TutorHome from "./TutorHome";
import AdminHome from "./AdminHome";
import StudentHome from "./StudentHome";
import styles from './styles/Home.module.css'; // Import CSS module

function Home() {
    const navigate = useNavigate();

    // Get the role from localStorage (or context if you're using React Context API)
    const role = localStorage.getItem('role');

    // Logout function to clear localStorage and navigate back to login page
    const handleLogout = () => {
        localStorage.removeItem('role');
        navigate('/login'); // Redirect back to the login page
    };

    // Conditional rendering based on the user's role
    let heading;
    switch (role) {
        case 'Admin':
            return <AdminHome handleLogout={handleLogout}/>;
            break;
        case 'Tutor':
            return <TutorHome handleLogout={handleLogout}/>;
            break;
        case 'Student':
            return <StudentHome handleLogout={handleLogout}/>;
            break;
        default:
            heading = 'Home Page';
            break;
    }

    

    return (
        <div className={styles.container}>
            <h1 className={styles.heading}>{heading}</h1>
            <p className={styles.welcome}>Welcome to the home page, {role ? role : 'guest'}!</p>
            <button className={styles.logoutButton} onClick={handleLogout}>Logout</button>
        </div>
    );
}

export default Home;
