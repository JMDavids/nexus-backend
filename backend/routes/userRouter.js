const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controller/userController');

// Register route (for both tutors and students)
router.post('/register', registerUser);

// Login route
router.post('/login', loginUser);

module.exports = router;
