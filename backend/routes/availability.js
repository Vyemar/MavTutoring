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

        // Filter out any invalid or weekend availability
        const validAvailability = tutor.availability.filter(slot => 
            slot.startTime !== "00:00" && 
            slot.endTime !== "00:00" &&
            !['Saturday', 'Sunday'].includes(slot.day)
        );

        res.status(200).json(validAvailability);
    } catch (err) {
        console.error("Error fetching availability:", err);
        res.status(500).json({ message: "Failed to fetch availability" });
    }
});

// Submit availability
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

        // Validate and sort availability by day
        const validAvailability = availability
            .filter(slot => {
                // Validate time format
                const isValidTime = (time) => /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time);
                // Only accept weekdays
                const isWeekday = !['Saturday', 'Sunday'].includes(slot.day);
                return isValidTime(slot.startTime) && isValidTime(slot.endTime) && isWeekday;
            })
            .sort((a, b) => {
                const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
                return days.indexOf(a.day) - days.indexOf(b.day);
            });

        // Update tutor's availability with only the valid slots
        tutor.availability = validAvailability;
        await tutor.save();

        res.status(200).json({ message: "Availability successfully updated" });
    } catch (err) {
        console.error("Error submitting availability:", err);
        res.status(500).json({ message: "Failed to submit availability" });
    }
});

module.exports = router;