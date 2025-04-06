const mongoose = require('mongoose');

const studentProfileSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
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
    coursesEnrolled: {
        type: [String],
        default: []
    },
    areasOfInterest: {
        type: [String],
        default: []
    },
    preferredLearningStyle: {
        type: String,
        enum: ['Visual', 'Auditory', 'Reading/Writing', 'Kinesthetic', 'Not Specified'],
        default: 'Not Specified'
    },
    academicGoals: {
        type: String,
        default: ''
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    }
});

studentProfileSchema.pre('save', function(next) {
    this.lastUpdated = Date.now();
    next();
});

module.exports = mongoose.model('StudentProfile', studentProfileSchema);