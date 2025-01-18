const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    sessionID: { type: mongoose.Schema.Types.ObjectId, ref: "Session", required: true },
    studentID: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    checkInTime: { type: Date },
    checkOutTime: { type: Date },
    duration: { type: Number }, // Calculated in minutes
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Attendance", attendanceSchema);
