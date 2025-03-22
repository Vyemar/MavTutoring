import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "../styles/ViewTutors.module.css";
import TutorCard from "./Sidebar/TutorCard";

export const SearchResultsTutorProfiles = ({ results }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTutorsWithProfiles = async () => {
      setUsers(results);
    };
    fetchTutorsWithProfiles();
  }, [results]);

  return (
    <div className={styles.container}>
      <div className={styles.mainContent}>
        <div className={styles.cardContainer}>
          {users.length > 0 ? (
            users.map((user) => (
              <TutorCard user={user} key={user._id}></TutorCard>
            ))
          ) : (
            <p>No tutors found.</p>
          )}
        </div>
      </div>
    </div>
  );
};
