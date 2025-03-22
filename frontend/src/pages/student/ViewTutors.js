import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "../../styles/ViewTutors.module.css";
import StudentSidebar from "../../components/Sidebar/StudentSidebar";
import { SearchBar } from "../../components/SearchBar";
//import { SearchResultsList } from "../../components/SearchResultsList";
import { SearchResultsTutorProfiles } from "../../components/SearchResultsTutorProfiles";

// Get configuration from environment variables
const PROTOCOL = process.env.REACT_APP_PROTOCOL || "https";
const BACKEND_HOST = process.env.REACT_APP_BACKEND_HOST || "localhost";
const BACKEND_PORT = process.env.REACT_APP_BACKEND_PORT || "4000";

// Construct the backend URL dynamically
const BACKEND_URL = `${PROTOCOL}://${BACKEND_HOST}:${BACKEND_PORT}`;

function ViewTutors() {
  const [allTutors, setAllTutors] = useState([]); //Stores ALL tutor profiles
  const [loading, setLoading] = useState(true); //Allows us to output "loading.."" when somthing is loading
  const [results, setResults] = useState([]); //Will store the filtered tutor user objects (that is used for our search results) we get each time a user enters something in the searchbar

  //Fetching ALL tutor profiles (the default case)
  useEffect(() => {
    const /*fetchTutorsWithProfiles*/ fetchAllTutors = async () => {
        try {
          // Fetch all users
          const response = await axios.get(
            `${BACKEND_URL}/api/users/tutors/ALL`
          );
          const tutors = response.data.filter((user) => user.role === "Tutor");

          setResults(tutors);
          setAllTutors(tutors);
          setLoading(false);
          //console.log("Fetched all tutors:", tutors);
        } catch (error) {
          console.error("Error fetching users:", error);
          setLoading(false);
        }
      };

    //fetchTutorsWithProfiles();
    fetchAllTutors();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className={styles.container}>
      <StudentSidebar selected="find-tutors"></StudentSidebar>
      <div className={styles.mainContent}>
        <h1 className={styles.heading}>Our Tutors</h1>
        <div className="App">
          <div className="search-bar-container">
            <SearchBar allTutors={allTutors} setResults={setResults} />{" "}
            {/*Creates a searchbar the user can enter inputs in*/}
            {/*<SearchResultsList results = {results}/>/*Takes results from user input and lists Tutor profile name suggestions*/}
          </div>
          <SearchResultsTutorProfiles results={results} />{" "}
          {/*Takes results from user input and lists Tutor profile cards*/}
        </div>
      </div>
    </div>
  );
}

export default ViewTutors;
