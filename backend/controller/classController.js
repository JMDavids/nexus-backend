// controllers/classController.js

const Class = require('../models/Class');
const User = require('../models/User');

exports.createClass = async (req, res) => {
    try {
        const tutorId = req.user.userId;
        const role = req.user.role;

        if (role !== 'tutor') {
            return res.status(403).json({ message: 'Access denied. Only tutors can create classes.' });
        }

        const { subject, title, date, startTime, endTime, isOnline } = req.body;

        // Validate required fields
        if (!subject || !title || !date || !startTime || !endTime) {
            return res.status(400).json({ message: 'Please provide all required fields.' });
        }

        const newClass = new Class({
            tutor: tutorId,
            subject,
            title,
            date,
            startTime,
            endTime,
            isOnline
        });

        await newClass.save();

        res.status(201).json({ message: 'Class created successfully.', class: newClass });
    } catch (error) {
        console.error('Error creating class:', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};

exports.getTutors = async (req, res) => {
    try {
        // Find all users with the role 'tutor'
        const tutors = await User.find({ role: 'tutor' }).select('-password');

        res.status(200).json({ tutors });
    } catch (error) {
        console.error('Error fetching tutors:', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};

exports.getClassesByTutorId = async (req, res) => {
    try {
        const tutorId = req.params.tutorId;

        // Fetch classes for the given tutor ID
        const classes = await Class.find({ tutor: tutorId });

        res.status(200).json({ classes });
    } catch (error) {
        console.error('Error fetching classes by tutor ID:', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};

// Controller function for authenticated tutor
exports.getMyClasses = async (req, res) => {
    try {
        const tutorId = req.user.userId;
        const role = req.user.role;

        if (role !== 'tutor') {
            return res.status(403).json({ message: 'Access denied. Only tutors can view their classes.' });
        }

        // Fetch classes for the authenticated tutor
        const classes = await Class.find({ tutor: tutorId });

        res.status(200).json({ classes });
    } catch (error) {
        console.error('Error fetching tutors own classes:', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};


exports.enrollInClass = async (req, res) => {
    try {
        const studentId = req.user.userId;
        const role = req.user.role;

        if (role !== 'student') {
            return res.status(403).json({ message: 'Access denied. Only students can enroll in classes.' });
        }

        const classId = req.params.classId;

        // Find the class
        const classToEnroll = await Class.findById(classId);
        if (!classToEnroll) {
            return res.status(404).json({ message: 'Class not found.' });
        }

        // Check if student is already enrolled
        if (classToEnroll.studentsEnrolled.includes(studentId)) {
            return res.status(400).json({ message: 'You are already enrolled in this class.' });
        }

        // Check if maxStudents limit is reached (if applicable)
        if (classToEnroll.maxStudents > 0 && classToEnroll.studentsEnrolled.length >= classToEnroll.maxStudents) {
            return res.status(400).json({ message: 'Class is full.' });
        }

        // Enroll the student
        classToEnroll.studentsEnrolled.push(studentId);
        await classToEnroll.save();

        res.status(200).json({ message: 'Enrolled in class successfully.' });
    } catch (error) {
        console.error('Error enrolling in class:', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};

exports.getEnrolledStudents = async (req, res) => {
    try {
        const tutorId = req.user.userId;
        const role = req.user.role;

        if (role !== 'tutor') {
            return res.status(403).json({ message: 'Access denied. Only tutors can view enrolled students.' });
        }

        const classId = req.params.classId;

        // Find the class
        const classInfo = await Class.findById(classId).populate('studentsEnrolled', '-password');
        if (!classInfo) {
            return res.status(404).json({ message: 'Class not found.' });
        }

        // Ensure the class belongs to the tutor
        if (classInfo.tutor.toString() !== tutorId) {
            return res.status(403).json({ message: 'Access denied. You do not own this class.' });
        }

        res.status(200).json({ students: classInfo.studentsEnrolled });
    } catch (error) {
        console.error('Error fetching enrolled students:', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};
