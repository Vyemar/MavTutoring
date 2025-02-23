import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import axios from "axios";
import "react-big-calendar/lib/css/react-big-calendar.css";
import styles from "../../styles/FindMyTutorProfile.module.css";
import StudentSidebar from "../../components/Sidebar/AdminSidebar";

const localizer = momentLocalizer(moment);

function ViewProfile() {
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

        // Convert availability data to calendar events
        const formattedEvents = [];
        // Start from Monday of current week
        const currentDate = moment().startOf('week').add(1, 'days');

        availabilityResponse.data.forEach((slot) => {
          // Skip slots with empty times
          if (slot.startTime === "00:00" && slot.endTime === "00:00") {
            return;
          }

          // Skip weekend days
          if (['Saturday', 'Sunday'].includes(slot.day)) {
            return;
          }
          
          // Get the day index (1-5 for Monday-Friday)
          const dayMapping = {
            'Monday': 0,
            'Tuesday': 1,
            'Wednesday': 2,
            'Thursday': 3,
            'Friday': 4
          };
          
          // Create date for this week's occurrence of the day
          const eventDate = currentDate.clone().add(dayMapping[slot.day], 'days');
          
          // Create start and end times
          const startDateTime = eventDate.clone()
            .set('hour', parseInt(slot.startTime.split(':')[0]))
            .set('minute', parseInt(slot.startTime.split(':')[1]));
          
          const endDateTime = eventDate.clone()
            .set('hour', parseInt(slot.endTime.split(':')[0]))
            .set('minute', parseInt(slot.endTime.split(':')[1]));

          formattedEvents.push({
            id: `${slot.day}-${slot.startTime}-${slot.endTime}`,
            start: startDateTime.toDate(),
            end: endDateTime.toDate(),
            title: 'Available'
          });
        });

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
      await Promise.all([
        fetchTutorProfile(),
        fetchTutorAvailability(),
        fetchUserData()
      ]);
      setLoading(false);
    };

    fetchData();
  }, [tutorId]);

  // Custom day header component
  const customDayHeader = ({ label }) => {
    const dayName = label.split(" ")[0]; // Extract only the day name
    return <div style={{ textAlign: "center", fontWeight: "bold" }}>{dayName}</div>;
  };

  // Event style getter
  const eventStyleGetter = () => ({
    style: {
      backgroundColor: '#4CAF50',
      borderRadius: '3px',
      opacity: 0.8,
      color: 'white',
      border: '0',
      display: 'block'
    }
  });

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
            date={moment().toDate()}
            toolbar={false}
            min={moment().hours(10).minutes(0).toDate()}
            max={moment().hours(18).minutes(0).toDate()}
            step={30}
            timeslots={2}
            eventPropGetter={eventStyleGetter}
            components={{
              work_week: {
                header: customDayHeader,
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default ViewProfile;