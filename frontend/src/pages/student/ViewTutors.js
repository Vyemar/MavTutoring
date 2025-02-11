import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "../../styles/ViewTutors.module.css";
//import TutorCard from "../../components/Sidebar/TutorCard";
import StudentSidebar from "../../components/Sidebar/StudentSidebar";
import { SearchBar } from "../../components/SearchBar";
import { SearchResultsList } from "../../components/SearchResultsList";

function ViewTutors() {
  /*const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTutorsWithProfiles = async () => {
      try {
        // Fetch all users
        const response = await axios.get("http://localhost:4000/api/users");
        const tutors = response.data.filter((user) => user.role === "Tutor");

        // Fetch profiles for each tutor
        const tutorsWithProfiles = await Promise.all(
          tutors.map(async (tutor) => {
            try {
              const profileResponse = await axios.get(
                `http://localhost:4000/api/profile/${tutor._id}`
              );
              return {
                ...tutor,
                profile: profileResponse.data
              };
            } catch (error) {
              // Return tutor without profile if profile doesn't exist
              return tutor;
            }
          })
        );

        setUsers(tutorsWithProfiles);
        setLoading(false);
        console.log("Fetched tutors with profiles:", tutorsWithProfiles);
      } catch (error) {
        console.error("Error fetching users:", error);
        setLoading(false);
      }
    };

    fetchTutorsWithProfiles();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }*/

  const[results,setResults] = useState([]);

  return (
    <div className={styles.container}>
      <StudentSidebar selected="find-tutors"></StudentSidebar>
      <div className={styles.mainContent}>
        <h1 className={styles.heading}>Our Tutors</h1>
        <div className="App">
          <div className="search-bar-container">
            <SearchBar setResults = {setResults}/>
            <SearchResultsList results={results}/>
          </div>
        </div>
        {/*<div className={styles.cardContainer}>
          {users.length > 0 ? (
            users.map((user) => (
              <TutorCard user={user} key={user._id}></TutorCard>
            ))
          ) : (
            <p>No tutors found in the system.</p>
          )}
        </div>*/}
      </div>
    </div>
  );
}

export default ViewTutors;


