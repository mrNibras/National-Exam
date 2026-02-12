const TestAttempt = require('./TestAttempt');
const mongoose = require('mongoose');
const { getWeaknessAnalysisForUser } = require('./analyticsService');

// @desc    Get class performance analytics
// @route   GET /api/analytics/class-performance
// @access  Private (Teacher, School Admin)
exports.getClassPerformance = async (req, res) => {
  try {
    // In a multi-tenant system, you would filter by teacher's school or class ID.
    // For now, we aggregate across all students for demonstration.
    const performanceData = await TestAttempt.aggregate([
      {
        $group: {
          _id: '$user',
          totalAttempts: { $sum: 1 },
          averageScore: { $avg: { $divide: ['$score', '$total'] } },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'student',
        },
      },
      {
        $unwind: '$student',
      },
      {
        $project: {
          studentName: '$student.name',
          totalAttempts: 1,
          averageScore: { $multiply: ['$averageScore', 100] }, // As percentage
        },
      },
    ]);

    res.json(performanceData);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get performance details for a single student
// @route   GET /api/analytics/student-performance/:studentId
// @access  Private (Teacher, School Admin)
exports.getStudentPerformanceDetails = async (req, res) => {
  try {
    // In a real system, you'd also check if the teacher has permission to view this student.
    const attempts = await TestAttempt.find({ user: req.params.studentId })
      .populate('user', 'name scienceStream') // Get student's name and science stream
      .sort({ createdAt: -1 });

    if (!attempts) {
      return res.status(404).json({ msg: 'No test history found for this student.' });
    }

    res.json(attempts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get a student's weakness analysis for a study plan
// @route   GET /api/analytics/study-plan
// @access  Private (Student)
exports.getStudyPlanAnalysis = async (req, res) => {
  try {
    const analysis = await getWeaknessAnalysisForUser(req.user.id);
    res.json(analysis);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get a school's leaderboard
// @route   GET /api/analytics/leaderboard
// @access  Private
exports.getSchoolLeaderboard = async (req, res) => {
  try {
    const schoolId = req.user.school;

    if (!schoolId) {
      return res.status(400).json({ msg: 'User is not associated with a school.' });
    }

    const leaderboardData = await TestAttempt.aggregate([
      // Find attempts from users belonging to the specific school
      {
        $lookup: { from: 'users', localField: 'user', foreignField: '_id', as: 'userInfo' }
      },
      { $unwind: '$userInfo' },
      { $match: { 'userInfo.school': new mongoose.Types.ObjectId(schoolId) } },
      // Group by user to calculate average score
      {
        $group: {
          _id: '$user',
          studentName: { $first: '$userInfo.name' },
          averageScore: { $avg: { $divide: ['$score', '$total'] } },
          testsTaken: { $sum: 1 }
        }
      },
      // Sort by average score descending
      { $sort: { averageScore: -1 } },
      // Limit to top 10
      { $limit: 10 },
      { $project: { studentName: 1, averageScore: { $multiply: ['$averageScore', 100] }, testsTaken: 1 } }
    ]);

    res.json(leaderboardData);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};