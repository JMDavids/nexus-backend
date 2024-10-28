const express = require('express');
const router = express.Router();
const { registerUser, loginUser, forgotPassword, resetPassword, updateUserSettings } = require('../controller/userController');
const authMiddleware = require('../middleware/auth');

// Register route (for both tutors and students)
router.post('/register', registerUser);

// Login route
router.post('/login', loginUser);

router.post('/forgot-password', forgotPassword);

router.post('/reset-password', resetPassword);

router.put('/settings', authMiddleware.authenticateToken, updateUserSettings);

module.exports = router;
