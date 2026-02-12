const TestAttempt = require('./TestAttempt');
const Question = require('./Question');
const User = require('./User');
const School = require('./School');
const mongoose = require('mongoose');

// @desc    Get anonymous national performance benchmarks
// @route   GET /api/analytics/national-benchmarks
// @access  Private (All users)
exports.getNationalBenchmarks = async (req, res) => {
  try {
    // Get national averages across all users
    const nationalStats = await TestAttempt.aggregate([
      {
        $group: {
          _id: null,
          avgScore: { $avg: { $divide: ['$score', '$total'] } },
          totalTests: { $sum: 1 },
          avgTimeSpent: { $avg: '$timeSpent' }
        }
      }
    ]);

    if (nationalStats.length === 0) {
      return res.json({
        nationalAvgScore: 0,
        totalTests: 0,
        avgTimeSpent: 0
      });
    }

    const benchmark = nationalStats[0];
    
    res.json({
      nationalAvgScore: (benchmark.avgScore || 0) * 100, // Convert to percentage
      totalTests: benchmark.totalTests,
      avgTimeSpent: benchmark.avgTimeSpent || 0
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get performance by grade and subject
// @route   GET /api/analytics/performance-by-grade
// @access  Private (All users)
exports.getPerformanceByGrade = async (req, res) => {
  try {
    const performanceByGrade = await TestAttempt.aggregate([
      {
        $lookup: {
          from: 'questions',
          localField: 'questions',
          foreignField: '_id',
          as: 'questionData'
        }
      },
      {
        $unwind: '$questionData'
      },
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'userData'
        }
      },
      {
        $unwind: '$userData'
      },
      {
        $group: {
          _id: {
            grade: '$questionData.grade',
            subject: '$questionData.subject'
          },
          avgScore: { $avg: { $divide: ['$score', '$total'] } },
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          grade: '$_id.grade',
          subject: '$_id.subject',
          avgScore: { $multiply: ['$avgScore', 100] }, // Convert to percentage
          count: 1
        }
      }
    ]);

    res.json(performanceByGrade);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get regional performance comparisons
// @route   GET /api/analytics/regional-comparisons
// @access  Private (Admin roles)
exports.getRegionalComparisons = async (req, res) => {
  try {
    // Only allow this for admin roles
    if (req.user.role !== 'Regional Admin') {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    const regionalComparisons = await TestAttempt.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'userData'
        }
      },
      {
        $unwind: '$userData'
      },
      {
        $lookup: {
          from: 'schools',
          localField: 'userData.school',
          foreignField: '_id',
          as: 'schoolData'
        }
      },
      {
        $unwind: '$schoolData'
      },
      {
        $group: {
          _id: {
            region: '$schoolData.region',
            examType: '$examType'
          },
          avgScore: { $avg: { $divide: ['$score', '$total'] } },
          totalTests: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          region: '$_id.region',
          examType: '$_id.examType',
          avgScore: { $multiply: ['$avgScore', 100] }, // Convert to percentage
          totalTests: 1
        }
      }
    ]);

    res.json(regionalComparisons);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get anonymous user performance comparison
// @route   GET /api/analytics/user-comparison
// @access  Private (Student)
exports.getUserComparison = async (req, res) => {
  try {
    // Get the user's average performance
    const userStats = await TestAttempt.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(req.user.id) } },
      {
        $group: {
          _id: null,
          avgScore: { $avg: { $divide: ['$score', '$total'] } },
          totalTests: { $sum: 1 }
        }
      }
    ]);

    // Get national average for the same subjects
    const nationalStats = await TestAttempt.aggregate([
      {
        $lookup: {
          from: 'questions',
          localField: 'questions',
          foreignField: '_id',
          as: 'questionData'
        }
      },
      {
        $unwind: '$questionData'
      },
      {
        $group: {
          _id: '$questionData.subject',
          avgScore: { $avg: { $divide: ['$score', '$total'] } }
        }
      },
      {
        $project: {
          _id: 1,
          avgScore: { $multiply: ['$avgScore', 100] } // Convert to percentage
        }
      }
    ]);

    // Get school average for the same subjects
    const schoolStats = await TestAttempt.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'userData'
        }
      },
      { $unwind: '$userData' },
      { $match: { 'userData.school': new mongoose.Types.ObjectId(req.user.school) } },
      {
        $lookup: {
          from: 'questions',
          localField: 'questions',
          foreignField: '_id',
          as: 'questionData'
        }
      },
      { $unwind: '$questionData' },
      {
        $group: {
          _id: '$questionData.subject',
          avgScore: { $avg: { $divide: ['$score', '$total'] } }
        }
      },
      {
        $project: {
          _id: 1,
          avgScore: { $multiply: ['$avgScore', 100] } // Convert to percentage
        }
      }
    ]);

    // Prepare response
    const userAvgScore = userStats.length > 0 ? userStats[0].avgScore * 100 : 0;
    const comparisonData = {
      userAvgScore: userAvgScore,
      nationalStats: nationalStats,
      schoolStats: schoolStats,
      totalTestsTaken: userStats.length > 0 ? userStats[0].totalTests : 0
    };

    res.json(comparisonData);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get school, regional and national comparison for a user
// @route   GET /api/analytics/comprehensive-comparison
// @access  Private (All users)
exports.getComprehensiveComparison = async (req, res) => {
  try {
    // Get user's performance
    const userStats = await TestAttempt.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(req.user.id) } },
      {
        $group: {
          _id: null,
          avgScore: { $avg: { $divide: ['$score', '$total'] } },
          totalTests: { $sum: 1 }
        }
      }
    ]);

    // Get school's performance
    const schoolStats = await TestAttempt.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'userData'
        }
      },
      { $unwind: '$userData' },
      { $match: { 'userData.school': new mongoose.Types.ObjectId(req.user.school) } },
      {
        $group: {
          _id: null,
          schoolAvgScore: { $avg: { $divide: ['$score', '$total'] } }
        }
      }
    ]);

    // Get national performance for the same subjects as user answered
    const userAttemptQuestions = await TestAttempt.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(req.user.id) } },
      { $project: { questions: 1 } },
      { $unwind: '$questions' }
    ]);

    let nationalStats = { avgScore: 0 };
    if (userAttemptQuestions.length > 0) {
      const questionIds = userAttemptQuestions.map(attempt => attempt.questions);
      nationalStats = await TestAttempt.aggregate([
        {
          $match: {
            questions: { $in: questionIds }
          }
        },
        {
          $group: {
            _id: null,
            avgScore: { $avg: { $divide: ['$score', '$total'] } }
          }
        }
      ]);
    }

    const result = {
      userAvgScore: userStats.length > 0 ? userStats[0].avgScore * 100 : 0,
      schoolAvgScore: schoolStats.length > 0 ? schoolStats[0].schoolAvgScore * 100 : 0,
      nationalAvgScore: nationalStats.length > 0 ? nationalStats[0].avgScore * 100 : 0,
      totalTestsTaken: userStats.length > 0 ? userStats[0].totalTests : 0
    };

    res.json(result);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
