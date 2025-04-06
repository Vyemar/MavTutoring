const mongoose = require('mongoose');

const tutorProfileSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    studentID: {
        type: String,
        required: true,
        trim: true
    },
    profilePicture: {
        type: String,
        default: null
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    bio: {
        type: String,
        trim: true
    },
    courses: {
        type: String,
        trim: true
    },
    skills: {
        type: String,
        trim: true
    },
    major: {
        type: String,
        trim: true
    },
    currentYear: {
        type: String,
        enum: ['Freshman', 'Sophomore', 'Junior', 'Senior', "Master's Student", 'PhD Student', 'Not Specified'],
        default: 'Not Specified',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('TutorProfile', tutorProfileSchema);