const express = require('express');
const router = express.Router();
const authMiddleware = require('../authMiddleware');
const authorize = require('../authorize');
const {
  getEntranceExams,
  getEntranceExamById,
  createEntranceExam,
  updateEntranceExam,
  deleteEntranceExam
} = require('../controllers/entranceExamController');

// @route   GET /api/entrance-exams
// @desc    Get all entrance exams
// @access  Public
router.get('/', getEntranceExams);

// @route   GET /api/entrance-exams/:id
// @desc    Get entrance exam by ID
// @access  Public
router.get('/:id', getEntranceExamById);

// @route   POST /api/entrance-exams
// @desc    Create a new entrance exam
// @access  Private (Admin only)
router.post('/', [authMiddleware, authorize(['School Admin', 'Regional Admin'])], createEntranceExam);

// @route   PUT /api/entrance-exams/:id
// @desc    Update an entrance exam
// @access  Private (Admin only)
router.put('/:id', [authMiddleware, authorize(['School Admin', 'Regional Admin'])], updateEntranceExam);

// @route   DELETE /api/entrance-exams/:id
// @access  Private (Admin only)
router.delete('/:id', [authMiddleware, authorize(['School Admin', 'Regional Admin'])], deleteEntranceExam);

module.exports = router;