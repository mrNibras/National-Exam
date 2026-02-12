const express = require('express');
const router = express.Router();
const { 
  getSubjectsByGradeAndStream, 
  getAllSubjects, 
  createSubject, 
  getSubjectById 
} = require('../controllers/subjectController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.route('/')
  .get(getAllSubjects)
  .post(protect, createSubject); // Only admin can create subjects

router.get('/grade-stream', getSubjectsByGradeAndStream);
router.route('/:id')
  .get(getSubjectById);

module.exports = router;