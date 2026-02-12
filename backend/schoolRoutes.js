const express = require('express');
const router = express.Router();
const schoolController = require('./schoolController');

// @route   GET /api/schools/public
// @desc    Get all schools for public registration
// @access  Public
router.get('/public', schoolController.getPublicSchools);


// @route   GET /api/schools/search
// @desc    Search schools by name
// @access  Public
router.get('/search', schoolController.searchSchoolsByName);

// Test route to verify routing is working
router.get('/test', (req, res) => {
  res.json({ message: 'Schools route is working', timestamp: new Date() });
});

module.exports = router;