const express = require('express');
const router = express.Router();
const { 
  registerStudent, 
  getStudentProfile, 
  updateStudentProfile 
} = require('../controllers/registrationController');
const { protect } = require('../middleware/authMiddleware');

// Public route for registration
router.post('/', registerStudent);

// Protected routes for authenticated users
router.route('/profile')
  .get(protect, getStudentProfile)
  .put(protect, updateStudentProfile);

module.exports = router;