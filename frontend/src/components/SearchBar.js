import React, {useState} from "react";
//import axios from "axios";
import {FaSearch} from "react-icons/fa";
import "../styles/SearchBar.css";


export const SearchBar = ({setResults}) => {
    const [input, setInput] = useState("");


    //Fetch relevant tutors from database
    const fetchTutors = (value) => {
      fetch("http://localhost:4000/api/users")
      .then((response) => response.json())
      .then((json) => {
        const results = json.filter((user) => {
          const name = user.firstName + user.lastName;
          return (
            //Filters our results so that it's only tutors and those whose name match
            value &&
            user &&
            user.role === "Tutor" &&
            (name.replaceAll(" ","").toLowerCase().includes(value.replaceAll(" ","").toLowerCase()))
          );
        });
        //Sets our results the filtered objects we just got
        setResults(results);
        /*console.log(results);*/
      });
    };




    /*const fetchTutorsWithProfiles = async (value) => {
      try {
        // Fetch all users
        const response = await axios.get("http://localhost:4000/api/users");
        const tutors = response.data.filter((user) => user.role === "Tutor");*/


        // Fetch profiles for each tutor
        /*const tutorsWithProfiles = await Promise.all(
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
        );*/
        /*setUsers(tutorsWithProfiles);
        setLoading(false);
        console.log("Fetched tutors with profiles:", tutorsWithProfiles);*/
      /*} catch (error) {
        console.error("Error fetching users:", error);
        setLoading(false);
      }
    };*/


    //What happens whenever the input changes
    const handleChange = (value) => {
      setInput(value);
      fetchTutors(value);
    };


    return (
        <div className = "input-wrapper">
            <FaSearch id="search-icon" />
            <input
                placeholder="Type to search..."
                value={input}
                //Passes our value through our function that handles changes in input
                onChange={(e) => handleChange(e.target.value)}
            />
        </div>
    );
};
