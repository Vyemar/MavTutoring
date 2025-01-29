const express = require("express");
const moment = require("moment");
const router = express.Router();
const User = require("../models/User");

// Get tutor availability
router.get("/:id", async (req, res) => {
    try {
        const tutor = await User.findById(req.params.id);

        if (!tutor || tutor.role !== "Tutor") {
            return res.status(404).json({ message: "Tutor not found" });
        }

        // Convert availability into calendar-compatible format
        const formattedAvailability = tutor.availability.map((slot) => {
            const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
            const dayIndex = daysOfWeek.indexOf(slot.day);
            const currentWeekStart = moment().startOf("week"); // Get the current week's Sunday
            const dateForDay = currentWeekStart.clone().add(dayIndex, "days"); // Get correct date for the day

            return {
                id: slot._id,
                start: dateForDay
                    .clone()
                    .hour(parseInt(slot.startTime.split(":")[0], 10))
                    .minute(parseInt(slot.startTime.split(":")[1], 10))
                    .toDate(),
                end: dateForDay
                    .clone()
                    .hour(parseInt(slot.endTime.split(":")[0], 10))
                    .minute(parseInt(slot.endTime.split(":")[1], 10))
                    .toDate(),
            };
        });

        res.status(200).json(formattedAvailability);
    } catch (err) {
        console.error("Error fetching availability:", err);
        res.status(500).json({ message: "Failed to fetch availability" });
    }
});


// Submit availability (replace all existing slots)
router.post("/:id/submit", async (req, res) => {
    const { availability } = req.body;

    if (!Array.isArray(availability)) {
        return res.status(400).json({ message: "Invalid availability format" });
    }

    try {
        const tutor = await User.findById(req.params.id);

        if (!tutor || tutor.role !== "Tutor") {
            return res.status(404).json({ message: "Tutor not found" });
        }

        // If availability is empty, clear the tutor's availability
        if (availability.length === 0) {
            tutor.availability = [];
        } else {
            // Overwrite availability, saving day, startTime, and endTime as strings
            tutor.availability = availability.map((slot) => ({
                day: slot.day, // Save day as "Monday", "Tuesday", etc.
                startTime: slot.startTime, // Save startTime as "HH:mm"
                endTime: slot.endTime, // Save endTime as "HH:mm"
            }));
        }

        await tutor.save();

        res.status(200).json({ message: "Availability successfully updated" });
    } catch (err) {
        console.error("Error submitting availability:", err);
        res.status(500).json({ message: "Failed to submit availability" });
    }
});

module.exports = router;