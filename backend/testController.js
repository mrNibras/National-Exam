const Question = require('./Question');
const TestAttempt = require('./TestAttempt');
const User = require('./User');
const { createAuditLog } = require('./auditService');
const mongoose = require('mongoose');

// @desc    Get the first question for a practice test
// @route   GET /api/tests/start
// @access  Private
exports.startPracticeTest = async (req, res) => {
  try {
    const { subject, topic, limit = 5 } = req.query;

    // Get the user's science stream and grade
    const user = await User.findById(req.user.id);
    const userScienceStream = user.scienceStream;
    const userGrade = user.grade;

    // Determine acceptable grades based on user's grade
    // Grade 9: only grade 9 questions
    // Grade 10: grades 9 and 10 questions
    // Grade 11: grades 9, 10, and 11 questions
    // Grade 12: all grades (9, 10, 11, 12) questions
    // This ensures grade 9 questions are accessible by grades 9, 10, 11, and 12 students
    let acceptableGrades = [];
    switch(userGrade) {
      case 9:
        acceptableGrades = ['Grade 9'];
        break;
      case 10:
        acceptableGrades = ['Grade 9', 'Grade 10'];
        break;
      case 11:
        acceptableGrades = ['Grade 9', 'Grade 10', 'Grade 11'];
        break;
      case 12:
        acceptableGrades = ['Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'];
        break;
      default:
        acceptableGrades = [`Grade ${userGrade}`];
    }

    const matchQuery = {
      // Scope by school, unless the user is a Regional Admin
      ...(req.user.role !== 'Regional Admin' && { school: new mongoose.Types.ObjectId(req.user.school) }),
      // Filter by user's science stream if they have one
      ...(userScienceStream && { scienceStream: userScienceStream }),
      // Filter by acceptable grades
      grade: { $in: acceptableGrades }
    };
    if (subject) matchQuery.subject = subject;
    if (topic) matchQuery.topic = topic;
    // Start with a medium difficulty rating
    matchQuery.difficultyRating = { $gte: 900, $lte: 1100 };

    // Use aggregation to get random questions and exclude the correct answer
    const questions = await Question.aggregate([
      { $match: matchQuery },
      { $sample: { size: 1 } }, // Only fetch one question to start
      {
        $project: {
          correctAnswer: 0, // Exclude the correct answer from the payload
          createdBy: 0,
          createdAt: 0,
        },
      },
    ]);

    res.json(questions);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get the next adaptive question
// @route   POST /api/tests/next-question
// @access  Private
exports.getNextQuestion = async (req, res) => {
  const { wasCorrect, answeredQuestionIds } = req.body;

  try {
    const user = await User.findById(req.user.id);
    const currentAbility = user.abilityScore;
    const userScienceStream = user.scienceStream;
    const userGrade = user.grade;

    // Determine acceptable grades based on user's grade
    // Grade 9: only grade 9 questions
    // Grade 10: grades 9 and 10 questions
    // Grade 11: grades 9, 10, and 11 questions
    // Grade 12: all grades (9, 10, 11, 12) questions
    // This ensures grade 9 questions are accessible by grades 9, 10, 11, and 12 students
    let acceptableGrades = [];
    switch(userGrade) {
      case 9:
        acceptableGrades = ['Grade 9'];
        break;
      case 10:
        acceptableGrades = ['Grade 9', 'Grade 10'];
        break;
      case 11:
        acceptableGrades = ['Grade 9', 'Grade 10', 'Grade 11'];
        break;
      case 12:
        acceptableGrades = ['Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'];
        break;
      default:
        acceptableGrades = [`Grade ${userGrade}`];
    }

    // More advanced adaptive logic: Adjust target difficulty based on performance
    // This is a simplified Elo-like adjustment. A real system might use a K-factor.
    let targetDifficulty;
    if (wasCorrect) {
      // If correct, look for a slightly harder question
      targetDifficulty = currentAbility + 50;
    } else {
      // If incorrect, look for a slightly easier question
      targetDifficulty = currentAbility - 50;
    }

    const nextQuestion = await Question.aggregate([
      {
        $match: {
          // Scope by school
          ...(req.user.role !== 'Regional Admin' && { school: new mongoose.Types.ObjectId(req.user.school) }),
          // Filter by user's science stream if they have one
          ...(userScienceStream && { scienceStream: userScienceStream }),
          // Filter by acceptable grades
          grade: { $in: acceptableGrades },
          // Find a question with a difficulty rating within a certain range of the target
          difficultyRating: { $gte: targetDifficulty - 50, $lte: targetDifficulty + 50 },
          _id: { $nin: answeredQuestionIds.map(id => new mongoose.Types.ObjectId(id)) }, // Don't repeat questions
        },
      },
      { $sample: { size: 1 } },
      {
        $project: {
          correctAnswer: 0,
          createdBy: 0,
          createdAt: 0,
        },
      },
    ]);

    if (nextQuestion.length > 0) {
      res.json(nextQuestion[0]);
    } else {
      // No more questions available at this difficulty, end the test
      res.status(200).json(null);
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Submit a test and get the score
// @route   POST /api/tests/submit
// @access  Private
exports.submitTest = async (req, res) => {
  const { answers } = req.body; // Expects { "answers": { "questionId": "answerText", ... } }

  if (!answers || Object.keys(answers).length === 0) {
    return res.status(400).json({ msg: 'Answers are required.' });
  }

  const questionIds = Object.keys(answers);

  try {
    // Fetch the full question objects for the submitted questions
    const questions = await Question.find({
      _id: { $in: questionIds },
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

      if (!userAnswer) continue;

      const isCorrect = userAnswer.answer === question.correctAnswer;
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

    // Save the test attempt to the database
    const newAttempt = new TestAttempt({
      user: req.user.id,
      questions: questionIds,
      answers,
      score,
      total: questionIds.length,
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
        description: `Test submitted by user ${user.name} with score ${score}/${questionIds.length}`,
        newValue: {
          score: score,
          total: questionIds.length,
          abilityScore: user.abilityScore,
          previousAbilityScore: previousAbilityScore
        }
      }
    );

    res.json({ score, total: questionIds.length, results });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get a user's test history
// @route   GET /api/tests/history
// @access  Private
exports.getTestHistory = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const total = await TestAttempt.countDocuments({ user: req.user.id });
    const attempts = await TestAttempt.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({ attempts, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get a user's test history
// @route   GET /api/tests/history
// @access  Private
exports.getTestHistory = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const total = await TestAttempt.countDocuments({ user: req.user.id });
    const attempts = await TestAttempt.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({ attempts, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};