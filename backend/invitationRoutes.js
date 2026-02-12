const express = require('express');
const router = express.Router();
const authMiddleware = require('./authMiddleware');
const authorize = require('./authorize');
const invitationController = require('./invitationController');
const { check } = require('express-validator');

// @route   POST /api/invitations
// @desc    Create an invitation for a new user
// @access  Private (School Admin, Regional Admin)
router.post('/', [
  authMiddleware,
  authorize('School Admin', 'Regional Admin'),
  check('email', 'Please include a valid email').isEmail(),
  check('role').isIn(['Student', 'Teacher', 'School Admin']),
  check('scienceStream').optional().isIn(['Natural Science', 'Social Science'])
], invitationController.createInvitation);

// @route   GET /api/invitations
// @desc    Get pending invitations for the school
// @access  Private (School Admin, Regional Admin)
router.get('/', [authMiddleware, authorize('School Admin', 'Regional Admin')], invitationController.getInvitations);

// @route   DELETE /api/invitations/:id
// @desc    Delete an invitation
// @access  Private (School Admin, Regional Admin)
router.delete('/:id', [authMiddleware, authorize('School Admin', 'Regional Admin')], invitationController.deleteInvitation);

// @route   GET /api/invitations/:token
// @desc    Get invitation details by token
// @access  Public
router.get('/token/:token', invitationController.getInvitationByToken);

module.exports = router;