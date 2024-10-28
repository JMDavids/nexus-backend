const express = require('express');
const router = express.Router();
const { createClass, getTutors, getClassesByTutorId, enrollInClass, getEnrolledStudents, getMyClasses } = require('../controller/classController');
const authMiddleware = require('../middleware/auth');

// Create a class (Tutor only)
router.post('/create', authMiddleware.authenticateToken, createClass);

router.get('/tutors', getTutors);

// Existing route for students to get classes by tutor ID
router.get('/tutor/:tutorId/classes', getClassesByTutorId);

// New route for tutors to get their own classes
router.get('/my-classes', authMiddleware.authenticateToken, getMyClasses);

// Enroll in a class (Student only)
router.post('/enroll/:classId', authMiddleware.authenticateToken, enrollInClass);

// Get enrolled students for a class (Tutor only)
router.get('/class/:classId/students', authMiddleware.authenticateToken, getEnrolledStudents);

module.exports = router;