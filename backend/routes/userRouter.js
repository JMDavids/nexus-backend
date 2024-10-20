const express = require('express');
const router = express.Router();
const { registerUser, loginUser, forgotPassword, resetPassword } = require('../controller/userController');

// Register route (for both tutors and students)
router.post('/register', registerUser);

// Login route
router.post('/login', loginUser);

router.post('/forgot-password', forgotPassword);

router.post('/reset-password', resetPassword);

module.exports = router;
