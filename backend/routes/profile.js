const express = require('express');
const router = express.Router();
const TutorProfile = require('../models/TutorProfile');
const multer = require('multer');
const upload = multer();

// GET profile by user ID
router.get('/:userId', async (req, res) => {
    try {
        const profile = await TutorProfile.findOne({ userId: req.params.userId });
        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' });
        }
        res.json(profile);
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ message: 'Error fetching profile', error: error.message });
    }
});

// Create or update profile
router.post('/', upload.single('profilePicture'), async (req, res) => {
    try {
        const { userId, name, bio, courses, skills, major, currentYear } = req.body;
        
        if (!userId || !name || !major || !currentYear) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Convert image file to base64 if provided
        let profilePicture = null;
        if (req.file) {
            profilePicture = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
        }

        const profileData = {
            userId,
            name,
            bio,
            courses,
            skills,
            major,
            currentYear,
            ...(profilePicture && { profilePicture })
        };

        // Update if exists, create if doesn't
        const profile = await TutorProfile.findOneAndUpdate(
            { userId },
            profileData,
            { new: true, upsert: true }
        );

        res.json({
            message: 'Profile updated successfully',
            profile
        });

    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ message: 'Error updating profile', error: error.message });
    }
});

module.exports = router;