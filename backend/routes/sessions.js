const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Session = require('../models/Session');

// Get available time slots for a tutor on a specific date
router.get('/availability/:tutorId/:date', async (req, res) => {
  try {
    const { tutorId, date } = req.params;
    const tutor = await User.findById(tutorId);
    
    if (!tutor) {
      return res.status(404).json({ message: 'Tutor not found' });
    }

    // Use UTC date to get consistent day of week
    const selectedDate = new Date(date + 'T00:00:00.000Z');
    const dayOfWeek = selectedDate.toLocaleDateString('en-US', { 
      weekday: 'long',
      timeZone: 'UTC'
    });
    
    // Find the tutor's availability for that day
    const dayAvailability = tutor.availability.find(a => a.day === dayOfWeek);
    
    if (!dayAvailability) {
      return res.json([]);
    }

    // Get existing bookings for that date in UTC
    const startOfDay = new Date(date + 'T00:00:00.000Z');
    const endOfDay = new Date(date + 'T23:59:59.999Z');

    const bookedSessions = await Session.find({
      tutorID: tutorId,
      sessionTime: {
        $gte: startOfDay,
        $lt: endOfDay
      },
      status: { $ne: 'Cancelled' }
    });

    const availableSlots = generateTimeSlots(
      dayAvailability.startTime,
      dayAvailability.endTime,
      bookedSessions,
      date
    );

    res.json(availableSlots);
  } catch (error) {
    console.error('Error fetching availability:', error);
    res.status(500).json({ message: 'Error fetching availability' });
  }
});

// Book a session
router.post('/', async (req, res) => {
  try {
    const { tutorId, studentId, sessionTime, duration } = req.body;

    // Validate required fields
    if (!tutorId || !studentId || !sessionTime || !duration) {
      return res.status(400).json({ 
        message: 'Missing required fields',
        details: { tutorId, studentId, sessionTime, duration }
      });
    }

    // Parse the session time and ensure UTC
    const sessionDate = new Date(sessionTime);
    console.log('Received session time:', sessionTime);
    console.log('Parsed session date:', sessionDate.toISOString());
    
    // Check if the slot is still available
    const existingSession = await Session.findOne({
      tutorID: tutorId,
      sessionTime: sessionDate,
      status: { $ne: 'Cancelled' }
    });

    if (existingSession) {
      return res.status(400).json({ message: 'Time slot no longer available' });
    }

    // Create new session
    const session = new Session({
      tutorID: tutorId,
      studentID: studentId,
      sessionTime: sessionDate,
      duration,
      status: 'Scheduled'
    });

    await session.save();

    // Update tutor's booked sessions
    await User.findByIdAndUpdate(tutorId, {
      $push: {
        bookedSessions: {
          sessionTime: sessionDate,
          duration
        }
      }
    });

    res.json({ 
      success: true, 
      session,
      message: 'Session booked successfully'
    });
  } catch (error) {
    console.error('Error booking session:', error);
    res.status(500).json({ 
      message: 'Error booking session', 
      error: error.message 
    });
  }
});

// Get all sessions for a student
router.get('/student/:studentId', async (req, res) => {
  try {
    const sessions = await Session.find({ 
      studentID: req.params.studentId
    })
    .populate('tutorID', 'firstName lastName')
    .sort({ sessionTime: 1 });
    
    // Ensure consistent time format in response
    const formattedSessions = sessions.map(session => ({
      ...session.toObject(),
      sessionTime: new Date(session.sessionTime).toISOString()
    }));
    
    res.json(formattedSessions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching sessions', error: error.message });
  }
});

// Get all sessions for a tutor
router.get('/tutor/:tutorId', async (req, res) => {
  try {
    const sessions = await Session.find({ 
      tutorID: req.params.tutorId
    })
    .populate('studentID', 'firstName lastName')
    .sort({ sessionTime: 1 });
    
    // Ensure consistent time format in response
    const formattedSessions = sessions.map(session => ({
      ...session.toObject(),
      sessionTime: new Date(session.sessionTime).toISOString()
    }));
    
    res.json(formattedSessions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching sessions', error: error.message });
  }
});

// Update session status
router.put('/:sessionId/status', async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['Scheduled', 'Completed', 'Cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const session = await Session.findByIdAndUpdate(
      req.params.sessionId,
      { status },
      { new: true }
    ).populate('studentID', 'firstName lastName');

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    res.json(session);
  } catch (error) {
    res.status(500).json({ message: 'Error updating session status', error: error.message });
  }
});

// Helper function to generate available time slots
function generateTimeSlots(startTime, endTime, bookedSessions, date) {
  const slots = [];
  const [startHour, startMinute] = startTime.split(':').map(Number);
  const [endHour, endMinute] = endTime.split(':').map(Number);
  
  // Create Date objects for the specific date using UTC to avoid timezone issues
  const startDate = new Date(`${date}T${startTime}:00.000Z`);
  const endDate = new Date(`${date}T${endTime}:00.000Z`);
  
  // If the date is today, don't show past times
  const now = new Date();
  const isToday = now.toDateString() === new Date(date).toDateString();
  const effectiveStartDate = isToday && now > startDate ? now : startDate;
  
  // Generate slots in 1-hour intervals
  for (let time = effectiveStartDate; time < endDate; time = new Date(time.getTime() + 60 * 60 * 1000)) {
    const timeString = `${time.getUTCHours().toString().padStart(2, '0')}:${time.getUTCMinutes().toString().padStart(2, '0')}`;
    
    const isBooked = bookedSessions.some(session => {
      const sessionTime = new Date(session.sessionTime);
      return sessionTime.getUTCHours() === time.getUTCHours() && 
             sessionTime.getUTCMinutes() === time.getUTCMinutes();
    });

    if (!isBooked) {
      slots.push(timeString);
    }
  }
  
  return slots;
}

module.exports = router;