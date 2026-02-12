const express = require('express');
const router = express.Router();
const authMiddleware = require('./authMiddleware');
const authorize = require('./authorize');
const { check } = require('express-validator');
const classController = require('./classController');

// @route   POST /api/classes
// @desc    Create a class
// @access  Private (Teacher, School Admin)
router.post(
  '/',
  [
    authMiddleware,
    authorize('Teacher', 'School Admin'),
    [
      check('name', 'Class name is required').not().isEmpty(),
      check('grade', 'Grade is required').not().isEmpty(),
      check('subject', 'Subject is required').not().isEmpty(),
    ],
  ],
  classController.createClass
);

// @route   GET /api/classes
// @desc    Get all classes
// @access  Private
router.get('/', authMiddleware, classController.getClasses);

// @route   GET /api/classes/:id
// @desc    Get a specific class by ID
// @access  Private
router.get('/:id', authMiddleware, classController.getClassById);

// @route   PUT /api/classes/:id
// @desc    Update a class
// @access  Private
router.put(
  '/:id',
  [
    authMiddleware,
    [
      check('name', 'Class name is required').not().isEmpty(),
      check('grade', 'Grade is required').not().isEmpty(),
      check('subject', 'Subject is required').not().isEmpty(),
    ],
  ],
  classController.updateClass
);

// @route   DELETE /api/classes/:id
// @desc    Delete a class
// @access  Private
router.delete('/:id', authMiddleware, classController.deleteClass);

// @route   PUT /api/classes/:id/add-student
// @desc    Add a student to a class
// @access  Private
router.put(
  '/:id/add-student',
  [
    authMiddleware,
    [
      check('studentId', 'Student ID is required').not().isEmpty(),
    ],
  ],
  classController.addStudentToClass
);

// @route   PUT /api/classes/:id/remove-student
// @desc    Remove a student from a class
// @access  Private
router.put(
  '/:id/remove-student',
  [
    authMiddleware,
    [
      check('studentId', 'Student ID is required').not().isEmpty(),
    ],
  ],
  classController.removeStudentFromClass
);

module.exports = router;
