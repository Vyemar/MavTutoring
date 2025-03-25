const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');
const Session = require('../models/Session');
const User = require('../models/User');

// Get attendance records by sessionID
router.get('/', async (req, res) => {
  try {
    const { sessionID } = req.query;
    
    if (!sessionID) {
      return res.status(400).json({ message: 'Session ID is required' });
    }
    
    const attendanceRecords = await Attendance.find({ sessionID })
      .populate('studentID', 'firstName lastName')
      .sort({ createdAt: 1 });
      
    res.json(attendanceRecords);
  } catch (error) {
    console.error('Error fetching attendance records:', error);
    res.status(500).json({ message: 'Error fetching attendance records', error: error.message });
  }
});

// Get specific attendance record
router.get('/:id', async (req, res) => {
  try {
    const attendance = await Attendance.findById(req.params.id)
      .populate('studentID', 'firstName lastName')
      .populate('sessionID');
      
    if (!attendance) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }
    
    res.json(attendance);
  } catch (error) {
    console.error('Error fetching attendance record:', error);
    res.status(500).json({ message: 'Error fetching attendance record', error: error.message });
  }
});

// Create a new attendance record (check-in)
router.post('/', async (req, res) => {
  try {
    const { sessionID, studentID, checkInTime } = req.body;
    
    // Validate required fields
    if (!sessionID || !studentID) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    // Check if session exists and is completed
    const session = await Session.findById(sessionID);
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }
    
    // Check if student exists
    const student = await User.findById(studentID);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    // Check if attendance record already exists
    const existingRecord = await Attendance.findOne({ sessionID, studentID });
    if (existingRecord) {
      return res.status(400).json({ message: 'Attendance record already exists for this student' });
    }
    
    // Create new attendance record
    const attendance = new Attendance({
      sessionID,
      studentID,
      checkInTime: checkInTime || new Date(),
    });
    
    await attendance.save();
    
    res.status(201).json({ 
      success: true, 
      attendance,
      message: 'Check-in recorded successfully' 
    });
  } catch (error) {
    console.error('Error recording attendance:', error);
    res.status(500).json({ message: 'Error recording attendance', error: error.message });
  }
});

// Update attendance record (check-out)
router.put('/:attendanceId', async (req, res) => {
  try {
    const { checkOutTime, duration } = req.body;
    
    const attendance = await Attendance.findByIdAndUpdate(
      req.params.attendanceId,
      { 
        checkOutTime: checkOutTime || new Date(),
        duration,
        updatedAt: new Date()
      },
      { new: true }
    );
    
    if (!attendance) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }
    
    res.json({
      success: true,
      attendance,
      message: 'Check-out recorded successfully'
    });
  } catch (error) {
    console.error('Error updating attendance record:', error);
    res.status(500).json({ message: 'Error updating attendance record', error: error.message });
  }
});

// Get attendance summary by date range
router.get('/summary', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({ message: 'Start and end dates are required' });
    }
    
    // Find sessions in date range
    const sessions = await Session.find({
      sessionTime: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      },
      status: 'Completed'
    });
    
    const sessionIds = sessions.map(session => session._id);
    
    // Get attendance records for these sessions
    const attendanceRecords = await Attendance.find({
      sessionID: { $in: sessionIds }
    }).populate('studentID', 'firstName lastName');
    
    // Calculate summary statistics
    const summary = {
      totalSessions: sessions.length,
      totalAttendance: attendanceRecords.length,
      completeAttendance: attendanceRecords.filter(record => record.checkOutTime).length,
      incompleteAttendance: attendanceRecords.filter(record => !record.checkOutTime).length,
      averageDuration: attendanceRecords.filter(record => record.duration)
        .reduce((sum, record) => sum + record.duration, 0) / 
        attendanceRecords.filter(record => record.duration).length || 0
    };
    
    res.json({
      summary,
      sessions,
      attendanceRecords
    });
  } catch (error) {
    console.error('Error generating attendance summary:', error);
    res.status(500).json({ message: 'Error generating attendance summary', error: error.message });
  }
});

module.exports = router;