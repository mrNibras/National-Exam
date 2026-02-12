const express = require('express');
const router = express.Router();
const authMiddleware = require('./authMiddleware');
const { check } = require('express-validator');
const userController = require('./userController');

// @route   POST api/users/register
// @desc    Register a user
// @access  Public
router.post(
  '/register',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check(
      'password',
      'Please enter a password with 6 or more characters'
    ).isLength({ min: 6 }),
    check('role').optional().isIn(['Student', 'Teacher', 'School Admin', 'Regional Admin']),
    check('scienceStream').optional().isIn(['Natural Science', 'Social Science']),
    check('grade').optional().isInt({ min: 9, max: 12 }),
    check('school.name').optional().notEmpty(),
    check('subjects').optional().isArray(),
    check('experience').optional().notEmpty(),
    check('about').optional().notEmpty(),
  ],
  userController.registerUser,
);
// @route   PUT api/users/phone
// @desc    Update user's phone number and send verification code
// @access  Private
router.put('/phone', authMiddleware, userController.updatePhoneNumber);

// @route   POST api/users/phone/verify
// @desc    Verify user's phone number with code
// @access  Private
router.post('/phone/verify', authMiddleware, userController.verifyPhoneNumber);

// @route   PUT api/users/parent-email
// @desc    Update user's parent email address
// @access  Private
router.put('/parent-email', authMiddleware, userController.updateParentEmail);

// @route   PUT api/users/change-password
// @desc    Change user's password
// @access  Private
router.put('/change-password', [
    authMiddleware,
    check('newPassword', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
], userController.changePassword);

// @route   PUT api/users/stream
// @desc    Update user's stream selection
// @access  Private
router.put('/stream', [
    authMiddleware,
    check('scienceStream').isIn(['Natural Science', 'Social Science']),
], userController.updateStream);

module.exports = router;
