import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import styles from "../../styles/SetAvailability.module.css";
import TutorSidebar from '../../components/Sidebar/TutorSidebar';
import { axiosGetData } from '../../utils/api'; // Import the API utility

// Get configuration from environment variables
const PROTOCOL = process.env.REACT_APP_PROTOCOL || 'https';
const BACKEND_HOST = process.env.REACT_APP_BACKEND_HOST || 'localhost';
const BACKEND_PORT = process.env.REACT_APP_BACKEND_PORT || '4000';

// Construct the backend URL dynamically
const BACKEND_URL = `${PROTOCOL}://${BACKEND_HOST}:${BACKEND_PORT}`;

const localizer = momentLocalizer(moment);

// Define custom formats for the calendar
const formats = {
  dayFormat: 'dddd', // Use full day name (Monday, Tuesday, etc.)
};

// Custom components for the calendar
const customComponents = {
  week: {
    header: ({ date }) => {
      return (
        <div style={{ textAlign: "center", fontWeight: "bold" }}>
          {moment(date).format('dddd')}
        </div>
      );
    },
  },
  work_week: {
    header: ({ date }) => {
      return (
        <div style={{ textAlign: "center", fontWeight: "bold" }}>
          {moment(date).format('dddd')}
        </div>
      );
    },
  }
};

const SetAvailability = () => {
    const [events, setEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [userData, setUserData] = useState(null);
    
    // Fetch the user session data
    useEffect(() => {
        const fetchUserSession = async () => {
            try {
                const sessionResponse = await axiosGetData(`${BACKEND_URL}/api/auth/session`);
                
                if (sessionResponse && sessionResponse.user) {
                    setUserData(sessionResponse.user);
                } else {
                    console.error("No user session found");
                    throw new Error("No active session found. Please log in again.");
                }
            } catch (error) {
                console.error("Error fetching user session:", error);
                alert("Failed to authenticate. Please log in again.");
            }
        };
        
        fetchUserSession();
    }, []);
    
    // Fetch availability using the session data
    useEffect(() => {
        const fetchAvailability = async () => {
            if (!userData || !userData.id) {
                return; // Don't proceed if we don't have user data yet
            }
            
            try {
                setIsLoading(true);
                const response = await fetch(`${BACKEND_URL}/api/availability/${userData.id}`, {
                    credentials: 'include' // Include cookies for session authentication
                });
                
                if (!response.ok) {
                    throw new Error(`Error fetching availability: ${response.status}`);
                }
                
                const data = await response.json();
    
                // Convert availability data to calendar events
                const formattedEvents = [];
                // Start from Monday of current week
                const currentDate = moment().startOf('week').add(1, 'days');

                data.forEach((slot) => {
                    // Skip slots with empty times
                    if (slot.startTime === "00:00" && slot.endTime === "00:00") {
                        return;
                    }

                    // Skip weekend days
                    if (['Saturday', 'Sunday'].includes(slot.day)) {
                        return;
                    }
                    
                    // Get the day index (0-4 for Monday-Friday)
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
                        end: endDateTime.toDate()
                    });
                });

                setEvents(formattedEvents);
            } catch (error) {
                console.error("Error fetching availability:", error);
                alert("Failed to load availability. Please try again.");
            } finally {
                setIsLoading(false);
            }
        };
    
        fetchAvailability();
    }, [userData]); // This will run when userData changes

    // Prevent overlapping events
    const hasOverlap = (newStart, newEnd) => {
        return events.some(
            ({ start, end }) =>
                (newStart >= start && newStart < end) || // New start overlaps
                (newEnd > start && newEnd <= end) || // New end overlaps
                (newStart <= start && newEnd >= end) // Encompasses existing event
        );
    };

    // Handle slot selection (add new events)
    const handleSelectSlot = (slotInfo) => {
        // Check if it's a weekend day
        const day = moment(slotInfo.start).format('dddd');
        if (['Saturday', 'Sunday'].includes(day)) {
            alert("Cannot set availability for weekends");
            return;
        }

        if (
            !hasOverlap(slotInfo.start, slotInfo.end) &&
            slotInfo.start.getHours() >= 10 &&
            slotInfo.end.getHours() <= 18
        ) {
            const newEvent = {
                id: Date.now(), // Temporary unique ID
                start: slotInfo.start,
                end: slotInfo.end,
            };
            setEvents((prevEvents) => [...prevEvents, newEvent]);
        } else {
            alert("Cannot create overlapping availability or outside of 10 AM - 6 PM");
        }
    };

    // Handle event deletion
    const handleEventDelete = (event) => {
        if (window.confirm("Do you want to remove this availability slot?")) {
            setEvents((prevEvents) => prevEvents.filter((e) => e.id !== event.id));
        }
    };

    const handleSubmitAvailability = async () => {
        if (!userData || !userData.id) {
            alert("User session not found. Please log in again.");
            return;
        }
        
        // Convert events to availability slots
        const formattedEvents = events
            .map((event) => ({
                day: moment(event.start).format("dddd"),
                startTime: moment(event.start).format("HH:mm"),
                endTime: moment(event.end).format("HH:mm"),
            }))
            .filter(event => !['Saturday', 'Sunday'].includes(event.day)) // Filter out weekends
            .sort((a, b) => { // Sort by day of week
                const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
                return days.indexOf(a.day) - days.indexOf(b.day);
            });

        try {
            const response = await fetch(`${BACKEND_URL}/api/availability/${userData.id}/submit`, {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json"
                },
                credentials: 'include', // Include cookies for session authentication
                body: JSON.stringify({ availability: formattedEvents }),
            });

            if (response.ok) {
                alert("Availability successfully submitted!");
            } else {
                const errorData = await response.json();
                alert(`Failed to submit availability: ${errorData.message || 'Unknown error'}`);
            }
        } catch (error) {
            console.error("Error submitting availability:", error);
            alert("Failed to submit availability. Please try again.");
        }
    };

    return (
        <div className={styles.container}>
            <TutorSidebar selected="availability" />
            <div className={styles.mainContent}>
                <h1 className={styles.heading}>Set Availability</h1>
                {isLoading ? (
                    <div className={styles.spinnerContainer}>
                        <div className={styles.spinner}></div>
                        <p>Loading availability...</p>
                    </div>
                ) : (
                    <>
                        <div className={styles.calendarContainer}>
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
                                selectable
                                onSelectSlot={handleSelectSlot}
                                onSelectEvent={handleEventDelete}
                                min={moment().hours(10).minutes(0).toDate()}
                                max={moment().hours(18).minutes(0).toDate()}
                                step={30}
                                timeslots={2}
                                formats={formats}
                                components={customComponents}
                            />
                        </div>
                        <button 
                            className={styles.submitButton} 
                            onClick={handleSubmitAvailability}
                            disabled={!userData}
                        >
                            Submit Availability
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default SetAvailability;