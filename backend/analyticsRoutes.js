const express = require('express');
const router = express.Router();
const authMiddleware = require('./authMiddleware');
const authorize = require('./authorize');
const analyticsController = require('./analyticsController');

// @route   GET api/analytics/class-performance
// @desc    Get performance data for the class
// @access  Private (Teacher, School Admin)
router.get(
  '/class-performance',
  [authMiddleware, authorize('Teacher', 'School Admin')],
  analyticsController.getClassPerformance
);

// @route   GET api/analytics/student-performance/:studentId
// @desc    Get performance details for a single student
// @access  Private (Teacher, School Admin)
router.get(
  '/student-performance/:studentId',
  [authMiddleware, authorize('Teacher', 'School Admin')],
  analyticsController.getStudentPerformanceDetails
);

// @route   GET api/analytics/study-plan
// @desc    Get weakness analysis for a personalized study plan
// @access  Private (Student)
router.get(
  '/study-plan',
  [authMiddleware, authorize('Student')],
  analyticsController.getStudyPlanAnalysis
);

// @route   GET /api/analytics/leaderboard
// @desc    Get the school leaderboard
// @access  Private
router.get('/leaderboard', authMiddleware, analyticsController.getSchoolLeaderboard);

module.exports = router;