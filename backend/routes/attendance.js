const express = require("express");
const router = express.Router();
const Attendance = require("../models/Attendance");
const Session = require("../models/Session");
const User = require("../models/User");

// Fetch all attendance records
router.get("/", async (req, res) => {
    try {
        const records = await Attendance.find()
            .populate("sessionID", "sessionTime duration") // Populate session details
            .populate("studentID", "firstname lastname"); // Populate student details
        res.status(200).json(records);
    } catch (err) {
        console.error("Error fetching attendance records:", err);
        res.status(500).json({ message: "Failed to fetch attendance records" });
    }
});

// Fetch attendance for a specific student
router.get("/student/:studentID", async (req, res) => {
    try {
        const records = await Attendance.find({ studentID: req.params.studentID })
            .populate("sessionID", "sessionTime duration")
            .populate("studentID", "firstname lastname");
        res.status(200).json(records);
    } catch (err) {
        console.error("Error fetching attendance for student:", err);
        res.status(500).json({ message: "Failed to fetch attendance for student" });
    }
});

// Add or update attendance record
router.post("/", async (req, res) => {
    const { sessionID, studentID, checkInTime, checkOutTime } = req.body;

    try {
        // Calculate duration if both check-in and check-out times are provided
        let duration = null;
        if (checkInTime && checkOutTime) {
            const checkIn = new Date(checkInTime);
            const checkOut = new Date(checkOutTime);
            duration = Math.floor((checkOut - checkIn) / (1000 * 60)); // Convert to minutes
        }

        // Check if an attendance record already exists for the session and student
        let attendance = await Attendance.findOne({ sessionID, studentID });

        if (attendance) {
            // Update existing record
            attendance.checkInTime = checkInTime || attendance.checkInTime;
            attendance.checkOutTime = checkOutTime || attendance.checkOutTime;
            attendance.duration = duration || attendance.duration;
            attendance.updatedAt = Date.now();
            await attendance.save();
            return res.status(200).json({ message: "Attendance updated", attendance });
        }

        // Create a new attendance record
        attendance = new Attendance({
            sessionID,
            studentID,
            checkInTime,
            checkOutTime,
            duration,
        });

        const savedAttendance = await attendance.save();
        res.status(201).json({ message: "Attendance created", attendance: savedAttendance });
    } catch (err) {
        console.error("Error saving attendance record:", err);
        res.status(500).json({ message: "Failed to save attendance record" });
    }
});

// Delete an attendance record
router.delete("/:id", async (req, res) => {
    try {
        const deletedAttendance = await Attendance.findByIdAndDelete(req.params.id);
        if (!deletedAttendance) {
            return res.status(404).json({ message: "Attendance record not found" });
        }
        res.status(200).json({ message: "Attendance record deleted", attendance: deletedAttendance });
    } catch (err) {
        console.error("Error deleting attendance record:", err);
        res.status(500).json({ message: "Failed to delete attendance record" });
    }
});

module.exports = router;