import React, { useState } from "react";
import styles from "./styles/SetAvailability.module.css";

function SetAvailability() {
    const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

    // State to hold availability
    const [availability, setAvailability] = useState(
        DAYS.reduce((acc, day) => ({ ...acc, [day]: [] }), {})
    );

    const [timeInputs, setTimeInputs] = useState({
        day: "Monday",
        startTime: "",
        endTime: "",
    });

    // Generate time slots in 15-minute intervals
    const generateTimeSlots = () => {
        const times = [];
        let start = new Date();
        start.setHours(10, 0, 0, 0); // Start at 10:00 AM
        const end = new Date();
        end.setHours(18, 0, 0, 0); // End at 6:00 PM

        while (start <= end) {
            const formattedTime = start.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
            });
            times.push(formattedTime);
            start.setMinutes(start.getMinutes() + 15); // Increment by 15 minutes
        }
        return times;
    };

    const timeSlots = generateTimeSlots();

    const handleAddTimeSlot = () => {
        const { day, startTime, endTime } = timeInputs;

        if (!startTime || !endTime) {
            alert("Please select both start and end times.");
            return;
        }

        // Prevent end time being before or equal to start time
        if (timeSlots.indexOf(startTime) >= timeSlots.indexOf(endTime)) {
            alert("End time must be after start time.");
            return;
        }

        // Prevent overlapping times
        const isOverlap = availability[day].some((slot) => {
            const existingStart = timeSlots.indexOf(slot.startTime);
            const existingEnd = timeSlots.indexOf(slot.endTime);
            const newStart = timeSlots.indexOf(startTime);
            const newEnd = timeSlots.indexOf(endTime);
            return (
                (newStart >= existingStart && newStart < existingEnd) ||
                (newEnd > existingStart && newEnd <= existingEnd)
            );
        });

        if (isOverlap) {
            alert("This time slot overlaps with an existing time slot.");
            return;
        }

        const newSlot = { startTime, endTime };

        setAvailability((prev) => ({
            ...prev,
            [day]: [...prev[day], newSlot],
        }));

        setTimeInputs({ day: "Monday", startTime: "", endTime: "" });
    };

    const handleDeleteSlot = (day, index) => {
        setAvailability((prev) => ({
            ...prev,
            [day]: prev[day].filter((_, i) => i !== index),
        }));
    };

    const handleSubmit = () => {
        console.log("Submitted Availability:", availability);
        alert("Availability submitted successfully!");
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.heading}>Set Availability</h1>

            {/* Input Section */}
            <div className={styles.inputSection}>
                <select
                    value={timeInputs.day}
                    onChange={(e) => setTimeInputs((prev) => ({ ...prev, day: e.target.value }))}
                    className={styles.select}
                >
                    {DAYS.map((day) => (
                        <option key={day} value={day}>
                            {day}
                        </option>
                    ))}
                </select>
                <select
                    value={timeInputs.startTime}
                    onChange={(e) =>
                        setTimeInputs((prev) => ({ ...prev, startTime: e.target.value }))
                    }
                    className={styles.select}
                >
                    <option value="">Start Time</option>
                    {timeSlots.map((time, index) => (
                        <option key={index} value={time}>
                            {time}
                        </option>
                    ))}
                </select>
                <select
                    value={timeInputs.endTime}
                    onChange={(e) =>
                        setTimeInputs((prev) => ({ ...prev, endTime: e.target.value }))
                    }
                    className={styles.select}
                >
                    <option value="">End Time</option>
                    {timeSlots.map((time, index) => (
                        <option key={index} value={time}>
                            {time}
                        </option>
                    ))}
                </select>
                <button className={styles.addButton} onClick={handleAddTimeSlot}>
                    Add Time Slot
                </button>
            </div>

            {/* Availability Summary */}
            <div className={styles.availability}>
                {DAYS.map((day) => (
                    <div key={day} className={styles.daySection}>
                        <h3>{day}</h3>
                        {availability[day].length > 0 ? (
                            availability[day].map((slot, index) => (
                                <div key={index} className={styles.timeSlot}>
                                    {slot.startTime} - {slot.endTime}
                                    <button
                                        className={styles.deleteButton}
                                        onClick={() => handleDeleteSlot(day, index)}
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))
                        ) : (
                            <p>No availability set</p>
                        )}
                    </div>
                ))}
            </div>

            <button className={styles.submitButton} onClick={handleSubmit}>
                Submit Availability
            </button>
        </div>
    );
}

export default SetAvailability;
