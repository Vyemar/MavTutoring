import React, { useEffect, useState } from "react";
import styles from "../../styles/TutorAvailability.module.css";
import { useNavigate } from "react-router-dom";

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const TutorAvailability = () => {
  const [availability, setAvailability] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    fetch(`/api/availability/week/${today}`)
      .then(res => res.json())
      .then(data => {
        console.log("Received availability:", data);
        setAvailability(data);
      })
      .catch(err => console.error("Error fetching availability:", err));
  }, []);

  const handleBookClick = (tutorId) => {
    navigate("/StudentSchedule", {state: { tutorId } });
  };

  const getDayName = (dateStr) => {
    const d = new Date(dateStr);
    return days[d.getDay()];
  };

  return (
    <div className={styles.availabilityWrapper}>
      <div className={styles.availabilityGrid}>
        {Object.entries(availability).map(([date, tutors]) => (
          <div className={styles.availabilityDay} key={date}>
            <h4>{getDayName(date)}</h4>
            <p className={styles.date}>{date}</p>
            {tutors.length === 0 ? (
              <p className={styles.noTutors}>No tutors available</p>
            ) : (
              tutors.map(t => (
                <div className={styles.tutorCard} key={t.tutorId}>
                  <img 
                    src={t.profilePic || "/default.png"} 
                    alt={t.name} 
                    onError={(e) => e.target.style.display = "none"}
                  />
                  <div>
                    <p className={styles.tutorName}>{t.name}</p>
                    <p className={styles.slots}>{t.slots.join(", ")}</p>

                  </div>
                  <button
                    className={styles.bookButton}
                    onClick={() => handleBookClick(t.tutorId)}
                    >
                      Book Session
                    </button>
                </div>
              ))
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TutorAvailability;
