import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./styles/TutorHome.module.css";
import axios from "axios";
import TutorSideBar from "./component/TutorSideBar";

function TutorHome() {
  const [availability, setAvailability] = useState([]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Fetch availability and notifications from the server
    axios
      .get("/api/availability/tutor")
      .then((response) => setAvailability(response.data))
      .catch((err) => console.error("Error fetching availability:", err));

    axios
      .get("/api/notifications/tutor")
      .then((response) => setNotifications(response.data))
      .catch((err) => console.error("Error fetching notifications:", err));
  }, []);

  return (
    <div className={styles.container}>
      {/* Sidebar */}
      <TutorSideBar selected="home"></TutorSideBar>
      {/* Main Content */}
      <div className={styles.mainContent}>
        <h1 className={styles.heading}>Dashboard</h1>

        {/* Availability Section */}
        <section>
          <h2>Your Availability</h2>
          <div className={styles.availability}>
            {availability.length > 0 ? (
              availability.map((slot, index) => (
                <div key={index} className={styles.card}>
                  <p>{slot.day}</p>
                  <p>{slot.time}</p>
                </div>
              ))
            ) : (
              <p>
                No availability set. Use the "Set Availability" option to add
                slots.
              </p>
            )}
          </div>
        </section>

        {/* Notifications Section */}
        <section className={styles.notifications}>
          <h2>Notifications</h2>
          {notifications.length > 0 ? (
            <ul>
              {notifications.map((notification, index) => (
                <li key={index}>{notification}</li>
              ))}
            </ul>
          ) : (
            <p>No new notifications</p>
          )}
        </section>
      </div>
    </div>
  );
}

export default TutorHome;
