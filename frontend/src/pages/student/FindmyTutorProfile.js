import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import axios from "axios";
import "react-big-calendar/lib/css/react-big-calendar.css";
import styles from "../../styles/FindMyTutorProfile.module.css";
import StudentSidebar from "../../components/Sidebar/StudentSidebar";

const localizer = momentLocalizer(moment);

function FindMyTutorProfile() {
  const { tutorId } = useParams();
  const [profile, setProfile] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchTutorProfile = async () => {
      try {
        const profileResponse = await axios.get(
          `http://localhost:4000/api/profile/${tutorId}`
        );
        setProfile(profileResponse.data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    const fetchTutorAvailability = async () => {
      try {
        const availabilityResponse = await axios.get(
          `http://localhost:4000/api/availability/${tutorId}`
        );

        const formattedEvents = availabilityResponse.data.map((slot) => ({
          id: slot.id,
          start: new Date(slot.start),
          end: new Date(slot.end),
          title: "Available",
        }));

        setEvents(formattedEvents);
      } catch (error) {
        console.error("Error fetching availability:", error);
      }
    };

    const fetchUserData = async () => {
      try {
        const userResponse = await axios.get(
          `http://localhost:4000/api/users/${tutorId}`
        );
        setUser(userResponse.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    const fetchData = async () => {
      await Promise.all([fetchTutorProfile(), fetchTutorAvailability(), fetchUserData()]);
      setLoading(false);
    };

    fetchData();
  }, [tutorId]);

  if (loading) {
    return (
      <div className={styles.spinnerContainer}>
        <div className={styles.spinner}></div>
      </div>
    );
  }

  if (!profile) {
    return <p>Profile not found.</p>;
  }

  return (
    <div className={styles.container}>
      <StudentSidebar />
      <div className={styles.mainContent}>
        <div className={styles.profileContainer}>
          <div className={styles.profileSection}>
            <h1 className={styles.heading}>
              {profile.name || `${user?.firstName} ${user?.lastName}`}'s Profile
            </h1>
            {profile.profilePicture ? (
              <img
                src={profile.profilePicture}
                alt={profile.name}
                className={styles.profileImage}
              />
            ) : (
              <div className={styles.profilePlaceholder}>
                <span>No Image</span>
              </div>
            )}
            <div className={styles.profileInfo}>
             <p><strong>Name:</strong> {profile.name}</p>
             <p><strong>Bio:</strong> {profile.bio}</p>
             <p><strong>Courses:</strong> {profile.courses}</p>
             <p><strong>Skills:</strong> {profile.skills}</p>
              <p><strong>Major:</strong> {profile.major}</p>
              <p><strong>Year:</strong> {profile.currentYear}</p>
            </div>
          </div>
        </div>

        <div className={styles.calendarContainer}>
          <h2 className={styles.heading}>Availability</h2>
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 500, width: "100%" }}
            views={["work_week"]}
            defaultView="work_week"
            date={new Date()}
            toolbar={false}
            min={new Date(new Date().setHours(10, 0, 0))} // 10:00 AM today
            max={new Date(new Date().setHours(18, 0, 0))} // 6:00 PM today
            step={30}
            timeslots={2}
          />
        </div>
      </div>
    </div>
  );
}

export default FindMyTutorProfile;