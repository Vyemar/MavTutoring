// routes/analytics.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Session = require('../models/Session');
const Feedback = require('../models/Feedback');
const TutorProfile = require('../models/TutorProfile');
const StudentProfile = require('../models/StudentProfile');
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

// GET /api/analytics/students
router.get('/students', async (req, res) => {
  try {

    // Step 1: Get all students
    const students = await User.find({ role: 'Student' }).select('_id firstName lastName');

    // Step 2: Get session count and sum it all up 
    const sessionCounts = await Session.aggregate([
      {
        $group: {
          _id: '$studentID',
          totalSessions: { $sum: 1 }
        }
      }
    ]);

    // Step 3: Create a lookup map to quickly access totalSessions for a given student ID
    const sessionMap = {};
    sessionCounts.forEach(session => {
      if (session._id) {
        sessionMap[session._id.toString()] = session.totalSessions;
      }
    });

    // Step 4: Combine results
    const result = students.map(student => ({
      id: student._id,
      name: `${student.firstName} ${student.lastName}`,
      totalSessions: sessionMap[student._id.toString()] || 0
    }));

    res.json(result);

  } catch (error) {
    console.error("Error in /students route:", error);
    res.status(500).json({ message: "Failed to get student data" });
  }
});


// GET /api/analytics/top-courses
// Receives the top 5 most booked courses
router.get('/top-courses', async (req, res) => {
  try {
    const topCourses = await Session.aggregate([ // Filters sessions that have courseIDs
      {
        $match: {
          courseID: { $exists: true, $ne: null },
          status: "Completed" // Only count for completed sessions
        }
      },
      {
        $group: {
          _id: '$courseID',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 } // Sorts courses by highest count
      },
      {
        $limit: 5 // Only returns the top 5 booked courses
      },
      {
        $lookup: { // Matches id from the courses collection and the Sessions collection, stores them as an array
          from: 'courses',
          localField: '_id',
          foreignField: '_id',
          as: 'courseInfo'
        }
      },
      { 
        $unwind: '$courseInfo' // flattens array to use the fields (courseInfo.code, the course number)
      },
      {
        $project: { // Shapes output
          name: '$courseInfo.code',
          count: 1,
          _id: 0
        }
      }
    ]);

    // console.log("Top courses final output:", topCourses);
    res.json(topCourses);
  } catch (error) {
    console.error("Error fetching top courses:", error);
    res.status(500).json({ message: "Failed to get top courses" });
  }
});


// /api/analytics/student-departments
// Receives the number of students from each department (major)
router.get('/student-majors', async (req, res) => {
  try {
    const result = await StudentProfile.aggregate([
      {
        $match: {
          major: {
            $in: ['Computer Science', 'Computer Engineering', 'Software Engineering', 'N/A'] // Only include these majors and the N/A for the chart
          }
        }
      },
      {
        $group: {
          _id: '$major',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }, 
      {
        $project: {
          major: '$_id',
          count: 1,
          _id: 0
        }
      }
    ]);

    res.json(result);
  } catch (error) {
    console.error('Error fetching student department counts:', error);
    res.status(500).json({ message: 'Failed to fetch department data' });
  }
});

// GET /api/analytics/student-learning-styles
// Receives the number of students for each learning style
router.get('/student-learning-styles', async (req, res) => {
  try {
    const result = await StudentProfile.aggregate([
      {
        $match: {
          preferredLearningStyle: {
            $nin: ["", null, "Not Specified", "Not Provided"] // Not include empty learning styles
          }
        }
      },
      {
        $group: {
          _id: '$preferredLearningStyle',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      },
       {
        $project: {
          style: '$_id',
          count: 1,
          _id: 0
        }
      }
    ]); 

    res.json(result);

  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch preferred learning styles'})
  }
});

// GET /api/analytics/student-stats
// On advanced reports, only tracks COMPLETED courses, NOT cancelled courses
router.get('/student-stats', async (req, res) => {
  try {
    const sessionStats = await Session.aggregate([
      {
        $match: {
          studentID: { $exists: true, $ne: null }
        }
      },
      {
        $group: {
          _id: '$studentID',
          completedSessions: {
            $sum: {
              $cond: [{ $eq: ['$status', 'Completed'] }, 1, 0] // If status is Complete, add 1 to sum, else add 0
            }
          }
        }
      }
    ]);

    // Convert to lookup map
    const statsMap = {};
    sessionStats.forEach(stat => {
      statsMap[stat._id.toString()] = {
        completedSessions: stat.completedSessions
      };
    });

    res.json(statsMap);
  } catch (err) {
    console.error('Error fetching student stats:', err);
    res.status(500).json({ message: 'Failed to fetch student stats' });
  }
});





module.exports = router;