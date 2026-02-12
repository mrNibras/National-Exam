const express = require('express');
const router = express.Router();
const authMiddleware = require('./authMiddleware');
const authorize = require('./authorize');
const { check } = require('express-validator');
const questionController = require('./questionController');

// @route   POST /api/questions
// @desc    Create a question
// @access  Private (Teacher, Admin)
router.post(
  '/',
  [
    authMiddleware,
    authorize('Teacher'),
    [
      check('questionText', 'Question text is required').not().isEmpty(),
      check('subject', 'Subject is required').not().isEmpty(),
      check('grade', 'Grade is required').not().isEmpty(),
      check('topic', 'Topic is required').not().isEmpty(),
      check('competency', 'Competency is required').not().isEmpty(),
      check('options', 'At least one option is required').isArray({ min: 1 }),
      check('correctAnswer', 'Correct answer is required').not().isEmpty(),
    ],
  ],
  questionController.createQuestion
);

// @route   POST /api/questions/teacher
// @desc    Create a question by a teacher (with grade and subject validation)
// @access  Private (Teacher)
router.post(
  '/teacher',
  [
    authMiddleware,
    authorize('Teacher'),
    [
      check('questionText', 'Question text is required').not().isEmpty(),
      check('subject', 'Subject is required').not().isEmpty(),
      check('grade', 'Grade is required').not().isEmpty(),
      check('topic', 'Topic is required').not().isEmpty(),
      check('competency', 'Competency is required').not().isEmpty(),
      check('options', 'At least one option is required').isArray({ min: 1 }),
      check('correctAnswer', 'Correct answer is required').not().isEmpty(),
    ],
  ],
  questionController.createQuestion
);

// @route   POST /api/questions/recalculate-difficulty
// @desc    Recalculate difficulty metrics for all questions
// @access  Private (School Admin)
router.post('/recalculate-difficulty', [authMiddleware, authorize('School Admin')], questionController.recalculateDifficulty);

// @route   GET /api/questions
// @desc    Get all questions with pagination and filtering
// @access  Private
router.get('/', authMiddleware, questionController.getQuestions);

// @route   GET /api/questions/:id
// @desc    Get a single question by ID
// @access  Private
router.get('/:id', authMiddleware, questionController.getQuestionById);

// @route   PUT /api/questions/:id
// @desc    Update a question
// @access  Private
router.put('/:id', authMiddleware, questionController.updateQuestion);

// @route   DELETE /api/questions/:id
// @desc    Delete a question
// @access  Private
router.delete('/:id', authMiddleware, questionController.deleteQuestion);

module.exports = router;
