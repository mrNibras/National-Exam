const Question = require('./Question');
const TestAttempt = require('./TestAttempt');
const { createAuditLog } = require('./auditService');
const { validationResult } = require('express-validator');

// @desc    Create a question
// @route   POST /api/questions
// @access  Private (only Teachers/Admins should be able to do this)
exports.createQuestion = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Get the requesting user to validate permissions
    const requestingUser = await User.findById(req.user.id).populate('school', 'name');
    
    // Validate that the teacher can create questions for the specified grade
    // For now, teachers can create questions for any grade in their school
    // In a more advanced system, we might restrict based on specific authorization
    
    const newQuestion = new Question({
      ...req.body,
      createdBy: req.user.id,
      school: req.user.school, // Associate question with the user's school
    });

    const question = await newQuestion.save();

    // Create audit log entry
    await createAuditLog(
      'QUESTION_CREATED',
      req.user.id,
      req.user.role,
      {
        targetEntity: 'Question',
        targetEntityId: question._id,
        description: `Question created by user ${req.user.id} in subject ${question.subject}, grade ${question.grade}`,
        newValue: {
          subject: question.subject,
          grade: question.grade,
          topic: question.topic,
          competency: question.competency
        }
      }
    );

    res.json(question);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Recalculate difficulty metrics for all questions
// @route   POST /api/questions/recalculate-difficulty
// @access  Private (Regional Admin)
exports.recalculateDifficulty = async (req, res) => {
  try {
    const questions = await Question.find();
    const bulkOps = [];

    for (const question of questions) {
      const attempts = await TestAttempt.find({ 'questions': question._id });

      let totalAttempts = 0;
      let correctAttempts = 0;
      let totalTimeSpent = 0;

      attempts.forEach(attempt => {
        const attemptData = attempt.answers.get(question._id.toString());
        if (attemptData && attemptData.answer !== undefined) { // Only count if the question was answered
          totalAttempts++;
          if (attemptData.answer === question.correctAnswer) {
            correctAttempts++;
          }
          if (typeof attemptData.timeSpent === 'number') {
            totalTimeSpent += attemptData.timeSpent;
          }
        }
      });

      // Prepare bulk update operation
      bulkOps.push({
        updateOne: {
          filter: { _id: question._id },
          update: {
            $set: {
              totalAttempts: totalAttempts,
              correctAttempts: correctAttempts,
              averageTimeSpent: totalAttempts > 0 ? totalTimeSpent / totalAttempts : 0,
            },
          },
        },
      });
    }

    if (bulkOps.length > 0) {
      await Question.bulkWrite(bulkOps);
    }

    res.json({ msg: 'Question difficulty metrics recalculated successfully.' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};


// @desc    Get all questions
// @route   GET /api/questions
// @access  Private
exports.getQuestions = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const { subject, grade, competency, topic, search } = req.query;

    // Build query object
    const query = {};
    if (subject) query.subject = subject;
    if (grade) query.grade = grade;
    if (competency) query.competency = competency;
    if (topic) query.topic = topic;
    if (search) {
      query.questionText = { $regex: search, $options: 'i' }; // Case-insensitive search
    }

    const total = await Question.countDocuments(query);
    const questions = await Question.find(query)
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({ questions, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get single question by ID
// @route   GET /api/questions/:id
// @access  Private
exports.getQuestionById = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({ msg: 'Question not found' });
    }

    res.json(question);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Question not found' });
    }
    res.status(500).send('Server Error');
  }
};

// @desc    Update a question
// @route   PUT /api/questions/:id
// @access  Private
exports.updateQuestion = async (req, res) => {
  try {
    let question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({ msg: 'Question not found' });
    }

    // Check if the user is the creator or a Regional Admin
    if (question.createdBy.toString() !== req.user.id && req.user.role !== 'Regional Admin') {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    const oldQuestion = { ...question.toJSON() }; // Store old values for audit log
    question = await Question.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });

    // Create audit log entry
    await createAuditLog(
      'QUESTION_UPDATED',
      req.user.id,
      req.user.role,
      {
        targetEntity: 'Question',
        targetEntityId: question._id,
        description: `Question updated by user ${req.user.id}`,
        oldValue: {
          subject: oldQuestion.subject,
          grade: oldQuestion.grade,
          topic: oldQuestion.topic,
          competency: oldQuestion.competency,
          difficulty: oldQuestion.difficulty
        },
        newValue: {
          subject: question.subject,
          grade: question.grade,
          topic: question.topic,
          competency: question.competency,
          difficulty: question.difficulty
        }
      }
    );

    res.json(question);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Delete a question
// @route   DELETE /api/questions/:id
// @access  Private
exports.deleteQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({ msg: 'Question not found' });
    }

    // Check if the user is the creator or a Regional Admin
    if (question.createdBy.toString() !== req.user.id && req.user.role !== 'Regional Admin') {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    // Create audit log entry before deletion
    await createAuditLog(
      'QUESTION_DELETED',
      req.user.id,
      req.user.role,
      {
        targetEntity: 'Question',
        targetEntityId: question._id,
        description: `Question deleted by user ${req.user.id}`,
        oldValue: {
          subject: question.subject,
          grade: question.grade,
          topic: question.topic,
          competency: question.competency,
          difficulty: question.difficulty
        }
      }
    );

    await Question.findByIdAndDelete(req.params.id);

    res.json({ msg: 'Question removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};