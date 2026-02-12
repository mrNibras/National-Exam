const Question = require('./Question');
const TestAttempt = require('./TestAttempt');
const User = require('./User');
const { createAuditLog } = require('./auditService');
const mongoose = require('mongoose');

// @desc    Start an exam simulation
// @route   POST /api/tests/exam-simulation
// @access  Private
exports.startExamSimulation = async (req, res) => {
  try {
    const { subject, grade, durationMinutes = 180 } = req.body; // 3 hours by default

    // Get the user's science stream
    const user = await User.findById(req.user.id);
    const userScienceStream = user.scienceStream;

    // Validate input
    if (!subject) {
      return res.status(400).json({ msg: 'Subject is required for exam simulation' });
    }

    // Build query for exam questions
    const query = {
      subject,
      // Scope by school unless Regional Admin
      ...(req.user.role !== 'Regional Admin' && { school: new mongoose.Types.ObjectId(req.user.school) }),
      // Filter by user's science stream if they have one
      ...(userScienceStream && { scienceStream: userScienceStream })
    };

    if (grade) {
      query.grade = grade;
    }

    // For exam simulation, we want a good mix of difficulty levels
    const questions = await Question.aggregate([
      { $match: query },
      { $sample: { size: 50 } }, // Full-length exam with 50 questions
      {
        $project: {
          correctAnswer: 0, // Exclude the correct answer from the payload
          createdBy: 0,
          createdAt: 0,
        },
      },
    ]);

    if (questions.length === 0) {
      return res.status(404).json({ msg: 'No questions found for this subject and grade' });
    }

    // Create an exam session record
    const examSession = {
      questions: questions,
      startedAt: new Date(),
      durationMinutes: durationMinutes,
      userId: req.user.id,
      subject: subject,
      grade: grade || 'Any',
      totalQuestions: questions.length
    };

    // Store session info in the response (in a real app, this would be stored in database/session)
    res.json({
      questions: questions,
      examInfo: {
        totalQuestions: questions.length,
        durationMinutes: durationMinutes,
        startedAt: examSession.startedAt,
        timeRemaining: durationMinutes * 60 // in seconds
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Submit an exam simulation
// @route   POST /api/tests/exam-simulation/submit
// @access  Private
exports.submitExamSimulation = async (req, res) => {
  const { answers, timeSpent } = req.body; // answers is an object { questionId: answerText }

  if (!answers || Object.keys(answers).length === 0) {
    return res.status(400).json({ msg: 'Answers are required.' });
  }

  const questionIds = Object.keys(answers);

  try {
    // Fetch the full question objects for the submitted questions
    const questions = await Question.find({
      _id: { $in: questionIds.map(id => new mongoose.Types.ObjectId(id)) },
    });
    const user = await User.findById(req.user.id);

    let score = 0;
    const results = {};
    const K_FACTOR = 32; // Elo K-factor for rating adjustment
    const questionBulkOps = [];
    let abilityScoreChange = 0;

    for (const question of questions) {
      const questionIdStr = question._id.toString();
      const userAnswer = answers[questionIdStr];

      if (!userAnswer) continue; // Skip unanswered questions

      const isCorrect = userAnswer === question.correctAnswer;
      if (isCorrect) {
        score++;
      }
      results[questionIdStr] = { isCorrect, correctAnswer: question.correctAnswer };

      // --- Elo-like Rating Adjustment ---
      const expectedScore = 1 / (1 + Math.pow(10, (question.difficultyRating - user.abilityScore) / 400));
      const actualScore = isCorrect ? 1 : 0;

      // Accumulate change for the user's ability score
      abilityScoreChange += K_FACTOR * (actualScore - expectedScore);

      // Prepare a bulk update operation for the question's difficulty rating
      const newQuestionRating = question.difficultyRating + K_FACTOR * (actualScore - expectedScore);
      questionBulkOps.push({
        updateOne: {
          filter: { _id: question._id },
          update: { $set: { difficultyRating: newQuestionRating } }
        }
      });
    }

    if (questionBulkOps.length > 0) {
      await Question.bulkWrite(questionBulkOps);
    }

    // Apply the total change to the user's ability score
    const previousAbilityScore = user.abilityScore;
    user.abilityScore += abilityScoreChange;
    await user.save();

    // Format answers to match the Map schema expected by TestAttempt
    const formattedAnswers = new Map();
    for (const [questionId, answerText] of Object.entries(answers)) {
      formattedAnswers.set(questionId, {
        answer: answerText,
        timeSpent: 0 // We can enhance this with actual time per question if needed
      });
    }

    // Save the test attempt to the database as an exam simulation
    const newAttempt = new TestAttempt({
      user: req.user.id,
      questions: questionIds.map(id => new mongoose.Types.ObjectId(id)),
      answers: formattedAnswers,
      score,
      total: questionIds.length,
      examType: 'simulation', // Mark as exam simulation for analytics
      timeSpent: timeSpent // Store total time spent
    });
    await newAttempt.save();

    // Create audit log entry
    await createAuditLog(
      'TEST_SUBMITTED',
      req.user.id,
      req.user.role,
      {
        targetEntity: 'TestAttempt',
        targetEntityId: newAttempt._id,
        description: `Exam simulation submitted by user ${user.name} with score ${score}/${questionIds.length}`,
        newValue: {
          score: score,
          total: questionIds.length,
          abilityScore: user.abilityScore,
          previousAbilityScore: previousAbilityScore,
          examType: 'simulation'
        }
      }
    );

    res.json({ 
      score, 
      total: questionIds.length, 
      results,
      timeSpent,
      percentage: questionIds.length > 0 ? Math.round((score / questionIds.length) * 100) : 0
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get available subjects for exam simulation
// @route   GET /api/tests/exam-simulation/subjects
// @access  Private
exports.getExamSimulationSubjects = async (req, res) => {
  try {
    // Get the user's science stream
    const user = await User.findById(req.user.id);
    const userScienceStream = user.scienceStream;

    // Get distinct subjects from questions, filtered by user's science stream if applicable
    const query = {};
    if (userScienceStream) {
      query.scienceStream = userScienceStream;
    }

    // Get distinct subjects from questions
    const subjects = await Question.distinct('subject', query);

    res.json({ subjects });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
