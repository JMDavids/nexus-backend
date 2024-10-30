const express = require('express');
const router = express.Router();
const messageController = require('../controller/messageController');
const authMiddleware = require('../middleware/auth');

// Send a broadcast message to a class (Tutor only)
router.post('/broadcast', authMiddleware.authenticateToken, messageController.sendBroadcastMessage);

// Get messages for the authenticated student
router.get('/inbox', authMiddleware.authenticateToken, messageController.getStudentMessages);


module.exports = router;
