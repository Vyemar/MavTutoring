const mongoose = require("mongoose");

const TutorScheduleSchema = new mongoose.Schema({
  tutorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  slots: [
    {
      date: { type: String, required: true }, // Format: YYYY-MM-DD
      time: { type: String, required: true }, // Format: HH:MM AM/PM
      status: { type: String, enum: ["available", "booked", "unavailable"], default: "available" }
    }
  ]
});

module.exports = mongoose.model("TutorSchedule", TutorScheduleSchema);






