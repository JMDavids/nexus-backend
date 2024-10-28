// models/Class.js

const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
    tutor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    startTime: {
        type: String, // Alternatively, use Date if including date and time
        required: true
    },
    endTime: {
        type: String,
        required: true
    },
    isOnline: {
        type: Boolean,
        default: false
    },
    studentsEnrolled: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    maxStudents: {
        type: Number,
        default: 0 // 0 means no limit
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Class', classSchema);
