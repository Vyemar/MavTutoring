// routes/analytics.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Session = require('../models/Session');
const Feedback = require('../models/Feedback');
const TutorProfile = require('../models/TutorProfile');
const mongoose = require('mongoose');

// GET /api/analytics/tutors
// Retrieves analytics for all tutors including profile info, average rating, and session count
router.get('/tutors', async (req, res) => {
  try {
    // Step 1: Get all tutors
    const tutors = await User.find({ role: 'Tutor' }).select('_id firstName lastName');
    
    // Step 2: Get tutor profiles for profile pictures
    const tutorProfiles = await TutorProfile.find({ 
      userId: { $in: tutors.map(tutor => tutor._id.toString()) } 
    }).select('userId profilePicture name');
    
    // Convert to a map for easier lookup
    const profileMap = {};
    tutorProfiles.forEach(profile => {
      profileMap[profile.userId] = {
        profilePicture: profile.profilePicture,
        name: profile.name // Use name from profile if available
      };
    });
    
    // Step 3: Get session counts for each tutor
    const sessionCounts = await Session.aggregate([
      { $match: { 
          tutorID: { $exists: true, $ne: null },
          status: { $in: ['Scheduled', 'Completed'] } 
        } 
      },
      { $group: { 
          _id: '$tutorID', 
          totalSessions: { $sum: 1 } 
        } 
      }
    ]);
    
    // Convert to a map for easier lookup
    const sessionCountMap = {};
    sessionCounts.forEach(item => {
      const idStr = item._id instanceof mongoose.Types.ObjectId 
        ? item._id.toString() 
        : String(item._id);
      sessionCountMap[idStr] = item.totalSessions;
    });
    
    // Step 4: Get average ratings for each tutor
    const ratings = await Feedback.aggregate([
      { $match: { tutorUniqueId: { $exists: true, $ne: null } } },
      { $group: { 
          _id: '$tutorUniqueId', 
          avgRating: { $avg: '$rating' },
          ratingCount: { $sum: 1 }
        } 
      }
    ]);
    
    // Convert to a map for easier lookup
    const ratingMap = {};
    ratings.forEach(item => {
      const idStr = item._id instanceof mongoose.Types.ObjectId 
        ? item._id.toString() 
        : String(item._id);
      
      let avgRating = 0;
      if (item.avgRating && !isNaN(item.avgRating)) {
        avgRating = parseFloat(item.avgRating.toFixed(1));
      }
      
      ratingMap[idStr] = {
        avgRating: avgRating,
        ratingCount: item.ratingCount
      };
    });
    
    // Step 5: Combine the data
    const tutorAnalytics = tutors.map(tutor => {
      const tutorId = tutor._id.toString();
      const profile = profileMap[tutorId];
      
      return {
        id: tutorId,
        name: profile?.name || `${tutor.firstName} ${tutor.lastName}`,
        profilePic: profile?.profilePicture || '/default-avatar.png',
        avgRating: ratingMap[tutorId] ? ratingMap[tutorId].avgRating : 0,
        ratingCount: ratingMap[tutorId] ? ratingMap[tutorId].ratingCount : 0,
        totalSessions: sessionCountMap[tutorId] || 0
      };
    });
    
    res.json(tutorAnalytics);
  } catch (error) {
    console.error('Error retrieving tutor analytics:', error);
    res.status(500).json({ message: 'Error retrieving tutor analytics', error: error.message });
  }
});

module.exports = router;