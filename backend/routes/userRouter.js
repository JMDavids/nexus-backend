const express = require('express');
const router = express.Router();
const { registerUser, loginUser, forgotPassword, resetPassword, updateUserSettings, getUserById } = require('../controller/userController');
const authMiddleware = require('../middleware/auth');

// Register route (for both tutors and students)
router.post('/register', registerUser);

// Login route
router.post('/login', loginUser);

router.post('/forgot-password', forgotPassword);

router.post('/reset-password', resetPassword);

router.put('/settings', authMiddleware.authenticateToken, updateUserSettings);

// Get user information by ID (Public)
router.get('/:userId', getUserById);

module.exports = router;
