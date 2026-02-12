const express = require('express');
const router = express.Router();
const authMiddleware = require('./authMiddleware');
const { check } = require('express-validator');
const testController = require('./testController');

// @route   GET /api/tests/start
// @desc    Get the first question for a practice test
// @access  Private
router.get('/start', authMiddleware, testController.startPracticeTest);

// @route   POST /api/tests/next-question
// @desc    Get the next adaptive question
// @access  Private
router.post(
  '/next-question',
  [
    authMiddleware,
    [
      check('wasCorrect', 'wasCorrect is required').exists(),
      check('answeredQuestionIds', 'answeredQuestionIds is required').isArray(),
    ],
  ],
  testController.getNextQuestion
);

// @route   POST /api/tests/submit
// @desc    Submit a test and get the score
// @access  Private
router.post('/submit', authMiddleware, testController.submitTest);

// @route   GET /api/tests/history
// @desc    Get a user's test history
// @access  Private
router.get('/history', authMiddleware, testController.getTestHistory);

module.exports = router;
