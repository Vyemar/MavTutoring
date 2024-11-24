const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Import your User model

// Fetch all users (for reference)
router.get('/', async (req, res) => {
    try {
        const users = await User.find(); // Fetch all users
        res.status(200).json(users);
    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).json({ message: 'Failed to fetch users' });
    }
});

// Fetch only tutors
router.get('/tutors', async (req, res) => {
    try {
        const tutors = await User.find({ role: 'Tutor' }); // Fetch users with role "Tutor"
        res.status(200).json(tutors);
    } catch (err) {
        console.error('Error fetching tutors:', err);
        res.status(500).json({ message: 'Failed to fetch tutors' });
    }
});

module.exports = router;
