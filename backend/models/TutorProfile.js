const mongoose = require('mongoose');

const tutorProfileSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Assuming there's a User model
        required: true
    },
    profilePicture: {
        type: String, // Storing the image URL (base64 or cloud storage)
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
    major: {
        type: String,
        required: true,
        trim: true
    },
    currentYear: {
        type: String,
        enum: ['Freshman', 'Sophomore', 'Junior', 'Senior', "Master's Student", 'PhD Student'],
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('TutorProfile', tutorProfileSchema);
