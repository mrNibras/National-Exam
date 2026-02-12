const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const authController = require('./authController');
const authMiddleware = require('./authMiddleware');

// @route   GET api/auth
// @desc    Get logged in user
// @access  Private
router.get('/', authMiddleware, authController.getLoggedInUser);

// @route   POST api/auth/login
// @desc    Auth user & get token
// @access  Public
router.post(
  '/login',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists(),
  ],
  authController.loginUser
);

// @route   POST /api/auth/forgot-password
// @desc    Forgot password
// @access  Public
router.post('/forgot-password', authController.forgotPassword);

// @route   PUT /api/auth/reset-password/:token
// @desc    Reset password
// @access  Public
router.put('/reset-password/:token', [
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
], authController.resetPassword);

module.exports = router;