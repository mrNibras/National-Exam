const express = require('express');
const router = express.Router();
const authMiddleware = require('./authMiddleware');
const enhancedAnalyticsController = require('./enhancedAnalyticsController');

// @route   GET /api/analytics/national-benchmarks
// @desc    Get anonymous national performance benchmarks
// @access  Private (All users)
router.get('/national-benchmarks', authMiddleware, enhancedAnalyticsController.getNationalBenchmarks);

// @route   GET /api/analytics/performance-by-grade
// @desc    Get performance by grade and subject
// @access  Private (All users)
router.get('/performance-by-grade', authMiddleware, enhancedAnalyticsController.getPerformanceByGrade);

// @route   GET /api/analytics/regional-comparisons
// @desc    Get regional performance comparisons
// @access  Private (Admin roles)
router.get('/regional-comparisons', authMiddleware, enhancedAnalyticsController.getRegionalComparisons);

// @route   GET /api/analytics/user-comparison
// @desc    Get anonymous user performance comparison
// @access  Private (Student)
router.get('/user-comparison', authMiddleware, enhancedAnalyticsController.getUserComparison);

// @route   GET /api/analytics/comprehensive-comparison
// @desc    Get school, regional and national comparison for a user
// @access  Private (All users)
router.get('/comprehensive-comparison', authMiddleware, enhancedAnalyticsController.getComprehensiveComparison);

module.exports = router;
