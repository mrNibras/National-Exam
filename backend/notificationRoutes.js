const express = require('express');
const router = express.Router();
const authMiddleware = require('./authMiddleware');
const notificationController = require('./notificationController');

// @route   POST /api/notifications/send-test
// @desc    Send a test SMS
// @access  Private
router.post('/send-test', authMiddleware, notificationController.sendTestSms);

module.exports = router;