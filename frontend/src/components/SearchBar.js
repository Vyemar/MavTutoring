import React, {useState} from "react";
import {FaSearch} from "react-icons/fa";
import "../styles/SearchBar.css";

// Get configuration from environment variables
const PROTOCOL = process.env.REACT_APP_PROTOCOL || 'https';
const BACKEND_HOST = process.env.REACT_APP_BACKEND_HOST || 'localhost';
const BACKEND_PORT = process.env.REACT_APP_BACKEND_PORT || '4000';

// Construct the backend URL dynamically
const BACKEND_URL = `${PROTOCOL}://${BACKEND_HOST}:${BACKEND_PORT}`;

export const SearchBar = ({allTutors,setResults}) => {
  //Will store user input
    const [input, setInput] = useState("");

    const handleSubmit = (e) => e.preventDefault()
    
    //Fetch relevant tutors from database
    const fetchFilteredTutors = (value) => {
      fetch(`${BACKEND_URL}/api/users`)
      .then((response) => response.json())
      .then((json) => {
        const results = json.filter((user) => {
          const name = user.firstName + user.lastName;
          return (
            //Filters our results so that it's only tutors with those whose name match the input in the searchbar
            value &&
            user &&
            user.role === "Tutor" &&
            (name.replaceAll(" ","").toLowerCase().includes(value.replaceAll(" ","").toLowerCase()))
          );
        });
        //Sets our results to the filtered objects we just got
        setResults(results);
      });
    };

    //Handles any changes in input in the searchbar
    const handleChange = (e) => {
      //If nothing has been entered so far, ALL TUTORS are returned
      if (!e.target.value) return setResults(allTutors)
      
      setInput(e.target.value);
      fetchFilteredTutors(e.target.value);
    };

    return (
        <div className = "input-wrapper" onSubmit={handleSubmit} >
            <FaSearch id="search-icon" />

            {/*Allows user to enter input in the searchbar*/}
            <input
                placeholder="Type to search..."
                onChange={handleChange}
            />
            <button className = "searchButton"> Search </button>
        </div>
    );
};
