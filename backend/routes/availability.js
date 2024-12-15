const express = require("express");
const router = express.Router();
const User = require("../models/User");

// Get tutor availability
router.get("/:tutorId", async (req, res) => {
    try {
        const tutor = await User.findById(req.params.tutorId);

        if (!tutor || tutor.role !== "Tutor") {
            return res.status(404).json({ message: "Tutor not found" });
        }

        res.status(200).json(tutor.availability);
    } catch (err) {
        console.error("Error fetching tutor availability:", err);
        res.status(500).json({ message: "Failed to fetch availability" });
    }
});

// Set tutor availability
router.post("/:tutorId", async (req, res) => {
    const { availability } = req.body;

    if (!Array.isArray(availability) || availability.length === 0) {
        return res.status(400).json({ message: "Invalid availability format" });
    }

    try {
        const tutor = await User.findById(req.params.tutorId);

        if (!tutor || tutor.role !== "Tutor") {
            return res.status(404).json({ message: "Tutor not found" });
        }

        // Update availability
        tutor.availability = availability;
        await tutor.save();

        res.status(200).json({ message: "Availability updated", availability: tutor.availability });
    } catch (err) {
        console.error("Error updating tutor availability:", err);
        res.status(500).json({ message: "Failed to update availability" });
    }
});

module.exports = router;