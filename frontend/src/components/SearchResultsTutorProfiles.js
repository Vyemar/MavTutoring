import React,{useEffect,useState} from "react";
import axios from "axios";
import styles from "../styles/ViewTutors.module.css"
import TutorCard from "./Sidebar/TutorCard";

/*We want this to function similar to the SearchResultsList component*/
export const SearchResultsTutorProfiles = ({results}) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    //console.log(results)
   
    useEffect(() => {
        const fetchTutorsWithProfiles = async () => {
            try {
                // Fetch profiles for each tutor
                const tutorsWithProfiles = await Promise.all(
                    results.map(async (tutor) => {
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
    }, [results]);
   
    if (loading) {
        return <p>Loading...</p>;
    }


    /*useEffect(() => {
        const fetchTutorsWithProfiles = async () => {
          try {
            // Fetch profiles for each tutor
            const tutorsWithProfiles = await Promise.all(
              results.map(async (tutor) => {
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

    return (
        <div className={styles.container}>
            <div className={styles.mainContent}>
                <div className={styles.cardContainer}>
                    {users.length > 0 ? (
                        users.map((user) => (
                        <TutorCard user={user} key={user._id}></TutorCard>
                    ))
                    ) : (
                        <p>No tutors of this name found.</p>
                    )}
                </div>
            </div>
        </div>
    );
};


