const express = require('express');
const router = express.Router();
const authMiddleware = require('./authMiddleware');
const { check, validationResult } = require('express-validator');
const examSimulationController = require('./examSimulationController');

// @route   POST /api/tests/exam-simulation
// @desc    Start an exam simulation
// @access  Private
router.post(
  '/',
  [
    authMiddleware,
    [
      check('subject', 'Subject is required').not().isEmpty(),
    ],
  ],
  examSimulationController.startExamSimulation
);

// @route   POST /api/tests/exam-simulation/submit
// @desc    Submit an exam simulation
// @access  Private
router.post('/submit', authMiddleware, examSimulationController.submitExamSimulation);

// @route   GET /api/tests/exam-simulation/subjects
// @desc    Get available subjects for exam simulation
// @access  Private
router.get('/subjects', authMiddleware, examSimulationController.getExamSimulationSubjects);

module.exports = router;
