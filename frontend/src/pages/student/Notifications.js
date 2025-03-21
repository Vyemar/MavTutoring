// import React, { useEffect, useState } from "react";
// import axios from "axios";
import styles from "../../styles/Notifications.module.css";
import StudentSidebar from "../../components/Sidebar/StudentSidebar";
import { useEffect, useState } from "react";
import axios from "axios";

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  // const notifications = [
  //   {
  //     id: 1,
  //     content: "Your appointment with Tutor Smarika has been confirmed."
  //   },
  //   {
  //     id: 2,
  //     content: "Your appointment with Tutor Smarika has been confirmed."
  //   },
  //   {
  //     id: 3,
  //     content: "Your appointment with Tutor Smarika has been confirmed."
  //   },
  //   {
  //     id: 4,
  //     content: "Your appointment with Tutor Smarika has been confirmed."
  //   },
  //   {
  //     id: 5,
  //     content: "Your appointment with Tutor Smarika has been confirmed."
  //   }
  // ]
  const StudentID = localStorage.getItem("userID"); // Safely access currentUser's ID  


  useEffect(() => {
    axios
      .get("http://localhost:4000/api/notifications/" + StudentID)
      .then((response) => {
        const { data } = response;
        setNotifications(data);
      })
      .catch((error) => {
        console.error("Error fetching tutors:", error);
      })
      .finally(() => {
        setTimeout(() => {
          setLoading(false);
        }, 2000);
      });
  }, []);
  return (
    <div className={styles.container}>
      <StudentSidebar selected="notifications"></StudentSidebar>
      <div className={styles.mainContent}>
        <h1 className={styles.heading}>Notifications</h1>
        {loading && <div className={styles.spinnerContainer}>
          <div className={styles.spinner}></div>
        </div>}

        {!loading &&

          notifications && notifications.map((notification, index) =>
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>{notification.message}</h2>
              <p className={styles.cardCreatedAt}>{new Date(notification.createdAt).toLocaleString()}</p>
            </div>
          )

        }
      </div>

    </div>
  );
}

export default Notifications;
