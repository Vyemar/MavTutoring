const mongoose = require ('mongoose');

const notificationschema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    userType: { 
        type: String, 
        enum: ['student', 'tutor'], 
        // required: true 
    },
    message: { 
        type: String, 
        required: true 
    }, // Notification message
    
    appointmentId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Appointment' 
    }, // Related appointment

    appointmentDate: { 
        type: Date 
    },

    appointmentTime: { 
        type: String 
    },
    duration: { 
        type: String 
    },

    status: { 
        type: String, 
        enum: ['Scheduled', 'Completed', 'Canceled'], 
        default: 'Scheduled'
    },
    
    isRead: { 
        type: Boolean, 
        default: false 
    }, // Read/unread status
    
    createdAt: { 
        type: Date, 
        default: Date.now 
    }

});
module.exports = mongoose.model('Notification', notificationschema);