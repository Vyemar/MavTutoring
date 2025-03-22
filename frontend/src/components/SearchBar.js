import React, { useState, useRef } from "react";
import { FaSearch } from "react-icons/fa";
import "../styles/SearchBar.css";
import axios from "axios";

// Get configuration from environment variables
const PROTOCOL = process.env.REACT_APP_PROTOCOL || "https";
const BACKEND_HOST = process.env.REACT_APP_BACKEND_HOST || "localhost";
const BACKEND_PORT = process.env.REACT_APP_BACKEND_PORT || "4000";

// Construct the backend URL dynamically
const BACKEND_URL = `${PROTOCOL}://${BACKEND_HOST}:${BACKEND_PORT}`;

export const SearchBar = ({ allTutors, setResults }) => {
  //Will store user input
  const [input, setInput] = useState("");
  const debounceTimer = useRef(null);

  const handleSubmit = (e) => e.preventDefault();

  //Fetch relevant tutors from database
  const fetchFilteredTutors = async (value) => {
    if (value) {
      //console.log(`${BACKEND_URL}/api/users/tutors/${value}`);
      const response = await axios.get(
        `${BACKEND_URL}/api/users/tutors/${value}`
      );
      //console.log(response.data);
      setResults(response.data);
    } else {
      //console.log("All Tutors");
      setResults(allTutors);
    }
  };

  //Handles any changes in input in the searchbar
  const handleChange = (e) => {
    const value = e.target.value;
    setInput(value);

    // Clear previous timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // Set new debounce timer
    debounceTimer.current = setTimeout(() => {
      fetchFilteredTutors(value.trim());
    }, 300);
  };

  /*const handleClick = (input) => {
      //If nothing has been entered so far, ALL TUTORS are returned
      if (!input) return setResults(allTutors)

      fetchFilteredTutors(input);
    }*/

  return (
    <div className="input-wrapper" onSubmit={handleSubmit}>
      <FaSearch id="search-icon" />

      {/*Allows user to enter input in the searchbar*/}
      <input
        placeholder="Type to search..."
        onChange={handleChange}
        value={input}
        /*onChange = {(e)=> setInput(e.target.value)}*/
      />

      <button /*onClick = {handleClick(input)}*/ className="searchButton">
        {" "}
        Search{" "}
      </button>
    </div>
  );
};
