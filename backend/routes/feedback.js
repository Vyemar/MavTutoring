const express = require('express');
const router = express.Router();
const User = require('../models/User');  // Assuming you have a User model
const Feedback = require('../models/Feedback');  // Using the Feedback model we created earlier

// GET /api/users - Get all tutors
router.get('/api/users', async (req, res) => {
    try {
        const users = await User.find({})
            .select('firstName lastName role _id');  // Only select necessary fields
        
        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ 
            message: 'Error fetching users', 
            error: error.message 
        });
    }
});

// POST /feedback - Create new feedback
router.post('/feedback', async (req, res) => {
    try {
        const { studentUniqueId, tutorUniqueId, feedbackText, rating } = req.body;

        // Validate request body
        if (!studentUniqueId || !tutorUniqueId || !feedbackText || !rating) {
            return res.status(400).json({ 
                message: 'Missing required fields' 
            });
        }

        // Validate that both student and tutor exist
        const [student, tutor] = await Promise.all([
            User.findById(studentUniqueId),
            User.findById(tutorUniqueId)
        ]);

        if (!student || !tutor) {
            return res.status(404).json({ 
                message: 'Student or tutor not found' 
            });
        }

        if (tutor.role !== 'Tutor') {
            return res.status(400).json({ 
                message: 'Selected user is not a tutor' 
            });
        }

        // Create new feedback
        const newFeedback = new Feedback({
            studentUniqueId,
            tutorUniqueId,
            feedbackText,
            rating
        });

        await newFeedback.save();

        res.status(201).json({
            message: 'Feedback submitted successfully',
            feedback: newFeedback
        });

    } catch (error) {
        console.error('Error submitting feedback:', error);
        res.status(500).json({ 
            message: 'Error submitting feedback', 
            error: error.message 
        });
    }
});

module.exports = router;