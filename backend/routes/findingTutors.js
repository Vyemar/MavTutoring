const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Tutor = require('../models/TutorProfile');
const Course = require('../models/Course');
const Feedback = require('../models/Feedback');
const User = require('../models/User');

router.get('/tutors/ALL', async (req, res) => {
    try{
        const users = await User.find({role : 'Tutor'}).populate({
            path: 'tutorProfile',
            populate: {path: 'courses'}
        });
        
        const tutors = users.filter(user => user.tutorProfile).map(user => {
            const profile = user.tutorProfile;
            return {
                _id : profile._id,
                userId: user._id,
                firstName: user.firstName || "",
                lastName: user.lastName || "",
                profilePicture: profile.profilePicture || null,
                courses: profile.courses || [],
                rating: typeof user.rating === 'number' ? user.rating: 0,
                numberOfRating: typeof user.numberOfRating === 'number' ? user.numberOfRating : 0,
            };
        });
        res.json(tutors.map(showFilterTutors));
    }
    catch(error){
        console.error("Error fetching tutor data", error);
        res.status(500).json({message: "Error fetching tutors", error: error.message});
    }
});

function showFilterTutors(tutor) {
    if(!tutor || !tutor._id) {
        console.warn("Invalid Tutor:", tutor);
        return null;
    }
    
    const courseNames = Array.isArray(tutor.courses) ? tutor.courses.map(c => `${c.code} - ${c.title || c.name || "Unknown Course"}`) : [];

    return {
        _id: tutor._id.toString(),
        userId: tutor.userId?.toString() || "",
        firstName : tutor.firstName || "",
        lastName: tutor.lastName || "",
        profile: {
            profilePicture: tutor.profilePicture || null,
            courses: courseNames,
        },
        courseNames,
        rating: typeof tutor.rating === 'number' ? tutor.rating: 0,
        numberOfRating: typeof tutor.numberOfRating === 'number' ? tutor.numberOfRating: 0,
    };
}

router.get('/search', async (req,res) => {
    try{
        const q = req.query.q;
        let tutors;
        if(!q || q.trim() === ''){
            tutors = await Tutor.find().populate('courses').populate('userId');
        }
        else {
            const regex = new RegExp(q, 'i');
            const matchingCourses = await Course.find({ $or: [{name: regex}, {code: regex}]
            });
            const courseIds = matchingCourses.map(c => c._id);
            const tutorsWithMatchingName = await Tutor.find({name: regex}).populate('courses').populate('userId');
            const tutorsWithMatchingCourses = await Tutor.find({courses: {$in: courseIds}}).populate('courses').populate('userId');
            const combinedTutorsMap = new Map();
            tutorsWithMatchingName.forEach(t => combinedTutorsMap.set(t._id.toString(), t));
            tutorsWithMatchingCourses.forEach(t => combinedTutorsMap.set(t._id.toString(), t));
            tutors = Array.from(combinedTutorsMap.values());
        }

        const userIdToTutorMap = {};
        const userIds = [];
        const tutorsMapped = tutors.map(tutor => {
            const user = tutor.userId || {};
            const mappedTutor = {
                _id: tutor._id,
                userId : user._id,
                firstName: user.firstName || "",
                lastName: user.lastName || "",
                profilePicture: tutor.profilePicture || null,
                courses: tutor.courses || [],
                rating: 0,
                numberOfRating: 0,
            };
            if(user._id){
                const idStr = user._id.toString();
                userIdToTutorMap[idStr] = mappedTutor;
                userIds.push(new mongoose.Types.ObjectId(idStr));
            }
            return mappedTutor;
        });

        if(userIds.length > 0){
            const ratings = await Feedback.aggregate([{$match: {tutorUniqueId: {$in: userIds}}}, {$group: {_id: "$tutorUniqueId",averageRating: {$avg: "$rating"}, numberOfRating: {$sum:1}}}]);
            ratings.forEach(r=>{const tutor = userIdToTutorMap[r._id.toString()];
                if(tutor){
                    tutor.rating = r.averageRating;
                    tutor.numberOfRating = r.numberOfRating;
                }
            });
        }
        const filteredTutors = tutorsMapped.filter(t => t._id);
        const transformed = filteredTutors.map(showFilterTutors).filter(t=>t !==null);
        res.json(transformed);
    }
    catch(err){
        console.error("Error in search", err);
        res.status(500).json({error: err.message});
    }
});

module.exports = router;
