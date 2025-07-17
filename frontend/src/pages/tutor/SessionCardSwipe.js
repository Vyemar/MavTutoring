import React, { useEffect, useRef, useState } from "react";
import styles from "../../styles/SessionCardSwipe.module.css";
import { axiosPostData } from "../../utils/api";
import TutorSidebar from "../../components/Sidebar/TutorSidebar";
import { useSidebar } from "../../components/Sidebar/SidebarContext";

function SessionCardSwipe() {
  const [statusMessage, setStatusMessage] = useState("Awaiting card swipe...");
  const [sessionDetails, setSessionDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastSwipeTime, setLastSwipeTime] = useState(0);
  const inputRef = useRef(null);

  const { isCollapsed, toggleSidebar } = useSidebar();
  const BACKEND_URL = 'http://localhost:4000';
  
  const parseCardData = (rawData) => {
    const match = rawData.match(/%B(\d+)\^([\w\-/ ]+)\^/);
    if (!match) return null;

    const cardID = match[1];
    const nameParts = match[2].split("/");
    const lastName = nameParts[0]?.trim();
    const firstName = nameParts[1]?.trim()?.split(" ")[0];
    return { cardID, firstName, lastName };
  };

  const processCardData = async (rawData) => {
    try {
      console.log("Raw data:", rawData);
      setStatusMessage("Processing swipe...");
      setSessionDetails(null);
      setIsLoading(true);

      let response;

      if (rawData.startsWith("%B")) {
        const parsed = parseCardData(rawData);
        console.log("Parsed card data:", parsed);

        if (!parsed) {
          setStatusMessage("Invalid card swipe format.");
          return;
        }

        response = await axiosPostData(`${BACKEND_URL}/api/attendance/check`, parsed);
      } else if (rawData.startsWith(";")) {
        const idMatch = rawData.match(/^;(\d{10})\?/);
        console.log("Parsed student ID from track 2:", idMatch?.[1]);

        if (!idMatch) {
          setStatusMessage("Invalid Track 2 swipe.");
          return;
        }

        const studentID = idMatch[1];
        console.log("Parsed student ID from track 2:", studentID);
        response = await axiosPostData(`${BACKEND_URL}/api/attendance/check`, { studentID });
      } else {
        setStatusMessage("Unrecognized card format.");
        return;
      }

      console.log("Response received:", response);
      setStatusMessage(response.data.message || "Success");

      if (response.data.session) {
        setSessionDetails(response.data.session);
      }
    } catch (error) {
      console.error("Swipe error:", error);
      const message =
        error.response?.data?.message || "Error occurred while checking in/out.";
      setStatusMessage(message);
    } finally {
      setIsLoading(false);
      // Reset status after 5 seconds
      setTimeout(() => {
        setStatusMessage("Awaiting card swipe...");
        setSessionDetails(null);
      }, 10000);
    }
  };

  useEffect(() => {
    const keepFocus = () => {
      if (inputRef.current) inputRef.current.focus();
    };

    keepFocus();
    window.addEventListener("click", keepFocus);
    window.addEventListener("keydown", keepFocus);
    return () => {
      window.removeEventListener("click", keepFocus);
      window.removeEventListener("keydown", keepFocus);
    };
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value.trim();
    if (!value || !value.includes("?")) return;

    const now = Date.now();
    if (now - lastSwipeTime < 1500) {
      e.target.value = "";
      return;
    }

    setLastSwipeTime(now);
    e.target.value = "";
    processCardData(value);
  };

  return (
  <div className={styles.container}>
    <button
      className={styles.sidebarToggle}
      onClick={toggleSidebar}
      aria-label="Toggle Sidebar"
    >
      {isCollapsed ? "☰" : "←"}
    </button>

    <TutorSidebar selected="tutor-card-swipe" />

    <div className={styles.mainContent}>
      <h1 className={styles.heading}>Tutor Session Check-In/Out</h1>

      <div className={styles.cardReaderBox}>
        <p className={styles.instruction}>
          Please swipe your student ID card to check in or out.
        </p>

        <input
          ref={inputRef}
          type="text"
          className={styles.hiddenInput}
          onChange={handleInputChange}
          autoFocus
        />

        {isLoading && <div className={styles.spinner}></div>}

        <div className={styles.status}>{statusMessage}</div>

        {sessionDetails && (
          <div className={styles.sessionBox}>
            <h3 className={styles.sessionTitle}>Session Details</h3>
            <p>
              <strong>Tutor:</strong> {sessionDetails.tutorName}
            </p>
            <p>
              <strong>Student:</strong> {sessionDetails.studentName}
            </p>
            <p>
              <strong>Time:</strong>{" "}
              {new Date(sessionDetails.sessionTime).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
            <p>
              <strong>Duration:</strong> {sessionDetails.duration} minutes
            </p>
          </div>
        )}
      </div>
    </div>
  </div>
 );
}

export default SessionCardSwipe;
