const express = require("express");
const router = express.Router();
const Session = require("../../models/Session");

// Get schedule for a tutor
router.get("/tutor/:tutorID", async (req, res) => {
    try {
        const sessions = await Session.find({ tutorID: req.params.tutorID })
            .populate("studentID", "firstname lastname") // Fetch student details
            .sort({ sessionTime: 1 }); // Sort by session time
    } catch (err) {
        console.error("Error fetching tutor schedule:", err);
        res.status(500).json({ message: "Failed to fetch tutor schedule" });
    }
});

// Admin sets or updates a tutor's schedule
router.post("/admin/set-schedule", async (req, res) => {
  try {
    const { tutorId, slots } = req.body; // Slots: [{date, time, status}]
    let schedule = await TutorSchedule.findOne({ tutorId });

    if (schedule) {
      // If schedule exists, update it
      schedule.slots = slots;
      await schedule.save();
    } else {
      // Otherwise, create a new schedule
      schedule = new TutorSchedule({ tutorId, slots });
      await schedule.save();
    }

    res.status(200).json({ message: "Schedule updated successfully", schedule });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});

router.get("/tutors/schedule/:tutorId", async (req, res) => {
    try {
      const { tutorId } = req.params;
      const schedule = await TutorSchedule.findOne({ tutorId });
      if (!schedule) return res.status(404).json({ message: "No schedule found" });
  
      res.status(200).json(schedule);
    } catch (error) {
      res.status(500).json({ message: "Server Error", error });
    }
  });

  router.delete("/admin/remove-slot", async (req, res) => {
    try {
      const { tutorId, date, time } = req.body;
      const schedule = await TutorSchedule.findOne({ tutorId });
  
      if (!schedule) return res.status(404).json({ message: "No schedule found" });
  
      schedule.slots = schedule.slots.filter(slot => !(slot.date === date && slot.time === time));
      await schedule.save();
  
      res.status(200).json({ message: "Slot removed successfully", schedule });
    } catch (error) {
      res.status(500).json({ message: "Server Error", error });
    }
  });
  
  


module.exports = router;
