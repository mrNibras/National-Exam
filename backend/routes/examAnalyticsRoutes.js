const express = require('express');
const router = express.Router();
const authMiddleware = require('../authMiddleware');
const examAnalyticsController = require('../controllers/examAnalyticsController');

// @route   GET /api/analytics/exam-wise
// @desc    Get exam-wise analytics for a user
// @access  Private
router.get('/', authMiddleware, examAnalyticsController.getExamWiseAnalytics);

module.exports = router;