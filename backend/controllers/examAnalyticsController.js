const TestAttempt = require('../TestAttempt');
const Question = require('../Question');
const User = require('../User');

// @desc    Get exam-wise analytics for a user
// @route   GET /api/analytics/exam-wise
// @access  Private
exports.getExamWiseAnalytics = async (req, res) => {
  try {
    const userId = req.user.id;
    const { timeRange = 'last30days' } = req.query;

    // Calculate date range based on timeRange
    const now = new Date();
    let startDate = new Date(now);
    
    switch(timeRange) {
      case 'last7days':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case 'last30days':
        startDate.setDate(startDate.getDate() - 30);
        break;
      case 'last90days':
        startDate.setDate(startDate.getDate() - 90);
        break;
      case 'alltime':
      default:
        // No date restriction
        break;
    }

    // Get all test attempts for the user
    const attemptsQuery = { user: userId };
    if (timeRange !== 'alltime') {
      attemptsQuery.createdAt = { $gte: startDate };
    }
    
    const attempts = await TestAttempt.find(attemptsQuery)
      .sort({ createdAt: -1 });

    if (!attempts || attempts.length === 0) {
      return res.json({
        overallPerformance: [],
        subjectBreakdown: [],
        gradeDistribution: [],
        performanceTrend: [],
        summary: {
          totalExams: 0,
          averageScore: 0,
          highestScore: 0,
          passRate: 0
        }
      });
    }

    // Calculate overall performance by exam
    const overallPerformance = attempts.map(attempt => ({
      exam: `Test Attempt ${attempt._id.toString().substring(0, 8)}`,
      score: attempt.score,
      maxScore: attempt.total,
      date: attempt.createdAt.toISOString().split('T')[0],
      percentage: Math.round((attempt.score / attempt.total) * 100)
    }));

    // Calculate subject breakdown
    const subjectScores = {};
    for (const attempt of attempts) {
      // Get questions for this attempt to determine subjects
      const questionIds = attempt.questions;
      const questions = await Question.find({ _id: { $in: questionIds } });
      
      for (const question of questions) {
        if (!subjectScores[question.subject]) {
          subjectScores[question.subject] = { scores: [], count: 0 };
        }
        // Find the score for this question in the attempt
        const questionAttempt = attempt.answers[question._id.toString()];
        if (questionAttempt && questionAttempt.isCorrect !== undefined) {
          subjectScores[question.subject].scores.push(questionAttempt.isCorrect ? 1 : 0);
          subjectScores[question.subject].count++;
        }
      }
    }

    const subjectBreakdown = Object.entries(subjectScores).map(([subject, data]) => {
      const avgScore = data.scores.length > 0 
        ? Math.round((data.scores.filter(Boolean).length / data.scores.length) * 100) 
        : 0;
      return {
        subject,
        avgScore,
        totalExams: data.count
      };
    });

    // Calculate grade distribution
    const gradeCounts = { A: 0, B: 0, C: 0, D: 0, F: 0 };
    overallPerformance.forEach(exam => {
      let grade = 'F';
      if (exam.percentage >= 90) grade = 'A';
      else if (exam.percentage >= 80) grade = 'B';
      else if (exam.percentage >= 70) grade = 'C';
      else if (exam.percentage >= 60) grade = 'D';
      
      gradeCounts[grade]++;
    });

    const totalExams = overallPerformance.length;
    const gradeDistribution = Object.entries(gradeCounts).map(([grade, count]) => ({
      grade,
      count,
      percentage: totalExams > 0 ? Math.round((count / totalExams) * 100) : 0
    }));

    // Calculate performance trend by month
    const monthlyScores = {};
    overallPerformance.forEach(exam => {
      const monthYear = new Date(exam.date).toISOString().slice(0, 7); // YYYY-MM
      if (!monthlyScores[monthYear]) {
        monthlyScores[monthYear] = { scores: [], count: 0 };
      }
      monthlyScores[monthYear].scores.push(exam.percentage);
      monthlyScores[monthYear].count++;
    });

    const performanceTrend = Object.entries(monthlyScores)
      .sort(([monthA], [monthB]) => monthA.localeCompare(monthB))
      .map(([month, data]) => ({
        month,
        avgScore: Math.round(data.scores.reduce((a, b) => a + b, 0) / data.scores.length)
      }));

    // Calculate summary statistics
    const totalScore = overallPerformance.reduce((sum, exam) => sum + exam.percentage, 0);
    const averageScore = totalExams > 0 ? Math.round(totalScore / totalExams) : 0;
    const highestScore = overallPerformance.length > 0 
      ? Math.max(...overallPerformance.map(exam => exam.percentage)) 
      : 0;
    const passedExams = overallPerformance.filter(exam => exam.percentage >= 60).length;
    const passRate = totalExams > 0 ? Math.round((passedExams / totalExams) * 100) : 0;

    res.json({
      overallPerformance,
      subjectBreakdown,
      gradeDistribution,
      performanceTrend,
      summary: {
        totalExams,
        averageScore,
        highestScore,
        passRate
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};