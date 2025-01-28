import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import styles from "../styles/SetAvailability.module.css";
import TutorSidebar from '../components/Sidebar/TutorSidebar';

const localizer = momentLocalizer(moment);

const SetAvailability = () => {
    const [events, setEvents] = useState([]);

    const handleLogout = () => {
        localStorage.removeItem('role');
        localStorage.removeItem('userID');
        window.location.href = '/login';
    };

    // Fetch availability from the backend when the component loads
    useEffect(() => {
        const fetchAvailability = async () => {
            try {
                const response = await fetch(`/api/availability/${localStorage.getItem("userID")}`);
                const data = await response.json();
    
                // Update events with valid Date objects
                const formattedEvents = data.map((slot) => ({
                    id: slot.id,
                    start: new Date(slot.start), // Already a valid date from backend
                    end: new Date(slot.end), // Already a valid date from backend
                }));
    
                setEvents(formattedEvents);
            } catch (error) {
                console.error("Error fetching availability:", error);
            }
        };
    
        fetchAvailability();
    }, []);
    

    // Prevent overlapping events
    const hasOverlap = (newStart, newEnd) => {
        return events.some(
            ({ start, end }) =>
                (newStart >= start && newStart < end) || // New start overlaps
                (newEnd > start && newEnd <= end) || // New end overlaps
                (newStart <= start && newEnd >= end) // Encompasses existing event
        );
    };

    // Handle slot selection (add new events locally)
    const handleSelectSlot = (slotInfo) => {
        if (
            !hasOverlap(slotInfo.start, slotInfo.end) &&
            slotInfo.start.getHours() >= 10 &&
            slotInfo.end.getHours() <= 18
        ) {
            const newEvent = {
                id: Date.now(), // Temporary unique ID for the event
                start: slotInfo.start,
                end: slotInfo.end,
            };
            setEvents((prevEvents) => [...prevEvents, newEvent]);
        }
    };

    // Handle event deletion (remove events locally)
    const handleEventDelete = (event) => {
        setEvents((prevEvents) => prevEvents.filter((e) => e.id !== event.id));
    };

    // Handle Submit Availability (send events to backend)
    const handleSubmitAvailability = async () => {
        const formattedEvents = events.length === 0 ? [] : events.map((event) => ({
            day: moment(event.start).format("dddd"), // Save the day of the week
            startTime: moment(event.start).format("HH:mm"), // Save as "HH:mm"
            endTime: moment(event.end).format("HH:mm"), // Save as "HH:mm"
        }));

        try {
            const response = await fetch(`/api/availability/${localStorage.getItem("userID")}/submit`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ availability: formattedEvents }),
            });

            if (response.ok) {
                alert("Availability submitted successfully!");
            } else {
                alert("Failed to submit availability.");
                alert(JSON.stringify(await response.json()));
            }
        } catch (error) {
            console.error("Error submitting availability:", error);
        }
    };
    
    // Custom header to show only day names (e.g., Mon, Tue)
    const customDayHeader = ({ label }) => {
        const dayName = label.split(" ")[0]; // Extract only the day name
        return <div style={{ textAlign: "center", fontWeight: "bold" }}>{dayName}</div>;
    };

    return (
        <div className={styles.container}>
            {/* Sidebar */}
            <TutorSidebar onLogout={handleLogout} />
        
        <div className={styles.mainContent}>
            <h1 className={styles.heading}>Set Availability</h1>
            <div className={styles.calendarContainer}>
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
                    selectable
                    onSelectSlot={handleSelectSlot}
                    onSelectEvent={handleEventDelete}
                    min={new Date(1970, 1, 1, 10, 0, 0)}
                    max={new Date(1970, 1, 1, 18, 0, 0)}
                    step={30}
                    timeslots={2}
                    components={{
                        work_week: {
                            header: customDayHeader,
                        },
                    }}
                    formats={{
                        dayFormat: (date, culture, localizer) =>
                            localizer.format(date, "dddd", culture),
                    }}
                />
            </div>
            <button className={styles.submitButton} onClick={handleSubmitAvailability}>
                Submit Availability
            </button>
        </div>
    </div>
    );
};

export default SetAvailability;
