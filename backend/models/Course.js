const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    code: {
        type: String, 
        required: true, 
        unique: true
    },
    description: {
        type: String
    }
});

module.exports = mongoose.model('Course', courseSchema);