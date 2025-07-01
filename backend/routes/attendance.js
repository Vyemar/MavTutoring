const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');
const Session = require('../models/Session');
const User = require('../models/User');

// GET all attendance records with student, session, and tutor info
router.get('/all', async (req, res) => {
    try {
        const attendanceRecords = await Attendance.find()
            .populate('studentID', 'firstName lastName')
            .populate({
                path: 'sessionID',
                populate: { path: 'tutorID', select: 'firstName lastName' }
            });
        res.json(attendanceRecords);
    } catch (error) {
        console.error("Error fetching attendance records:", error);
        res.status(500).json({ 
            message: 'Error fetching attendance records', 
            error: error.message 
        });
    }
});

router.post("/check", async (req, res) => {
    const { cardID, firstName, lastName, studentID } = req.body;

    try {
        let user = null;
        if (cardID) user = await User.findOne({ cardID });
        if (!user && studentID) user = await User.findOne({ studentID });
        if (!user && firstName && lastName) {
            user = await User.findOne({
                firstName: new RegExp(`^${firstName}$`, "i"),
                lastName: new RegExp(`^${lastName}$`, "i")
            });
        }

        if (user && !user.cardID && cardID) {
            user.cardID = cardID;
            await user.save();
        }

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found." });
        }

        const now = new Date();
        const startOfDay = new Date(); startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(); endOfDay.setHours(23, 59, 59, 999);

        const sessionsToday = await Session.find({
            studentID: user._id,
            sessionTime: { $gte: startOfDay, $lte: endOfDay },
            status: 'Scheduled'
        }).populate('tutorID', 'firstName lastName');

        if (!sessionsToday.length) {
            return res.status(404).json({ success: false, message: "No scheduled session found for today." });
        }

        let closestSession = sessionsToday.reduce((prev, curr) => {
            return Math.abs(new Date(curr.sessionTime) - now) < Math.abs(new Date(prev.sessionTime) - now)
                ? curr : prev;
        });

        const sessionEnd = new Date(closestSession.sessionTime.getTime() + closestSession.duration * 60000);

        let attendance = await Attendance.findOne({
            sessionID: closestSession._id,
            studentID: user._id
        });

        // Case 1: No attendance yet — CHECK IN
        if (!attendance || attendance.wasNoShow === true) {
            const diffInMinutes = (now - closestSession.sessionTime) / 60000;
            let checkInStatus = 'On Time';
            if (diffInMinutes < -5) checkInStatus = 'Early';
            else if (diffInMinutes > 5) checkInStatus = 'Late';

            attendance = new Attendance({
                sessionID: closestSession._id,
                studentID: user._id,
                checkInTime: now,
                checkInStatus,
                wasNoShow: false
            });

            await attendance.save();

            return res.status(201).json({
                success: true,
                message: `Checked in for session with ${closestSession.tutorID.firstName} for student ${user.firstName}.`,
                session: {
                    tutorName: `${closestSession.tutorID.firstName} ${closestSession.tutorID.lastName}`,
                    studentName: `${user.firstName} ${user.lastName}`,
                    sessionTime: closestSession.sessionTime,
                    duration: closestSession.duration
                }
            });
        // Case 2: Already checked in, not yet checked out — MANUAL CHECK OUT
        } else if (!attendance.checkOutTime) {
            const duration = Math.max(1, Math.round((now - attendance.checkInTime) / 60000));
            let checkOutStatus = 'On Time';
            if (now < sessionEnd) checkOutStatus = 'Early';
            else if (now > sessionEnd.getTime() + 5 * 60000) checkOutStatus = 'Late';

            attendance.checkOutTime = now;
            attendance.duration = duration;
            attendance.checkOutStatus = checkOutStatus;
            attendance.updatedAt = new Date();

            await attendance.save();

            closestSession.status = 'Completed';
            closestSession.updatedAt = new Date();
            await closestSession.save();

            return res.status(200).json({
                success: true,
                message: `Checked out from session with ${closestSession.tutorID.firstName} for student ${user.firstName}. Duration: ${duration} minutes.`,
                session: {
                    tutorName: `${closestSession.tutorID.firstName} ${closestSession.tutorID.lastName}`,
                    studentName: `${user.firstName} ${user.lastName}`,
                    sessionTime: closestSession.sessionTime,
                    duration
                }
            });
        } else {
            // Case 3: Already fully checked in and out
            return res.status(200).json({
                success: true,
                message: "Already checked in and out for this session.",
                session: {
                    tutorName: `${closestSession.tutorID.firstName} ${closestSession.tutorID.lastName}`,
                    studentName: `${user.firstName} ${user.lastName}`,
                    sessionTime: closestSession.sessionTime,
                    duration: closestSession.duration
                }
            });
        }

    } catch (error) {
        console.error("Error checking card:", error);
        return res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
});

module.exports = router;

