const Question = require('./Question');
const TestAttempt = require('./TestAttempt');

/**
 * Recalculates difficulty metrics for all questions automatically
 * This is used by the scheduled job for automatic difficulty reclassification
 */
const recalculateQuestionDifficulty = async () => {
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

    console.log(`Question difficulty metrics recalculated successfully for ${bulkOps.length} questions.`);
    return { msg: `Question difficulty metrics recalculated successfully for ${bulkOps.length} questions.` };
  } catch (err) {
    console.error('Error in automatic difficulty reclassification:', err.message);
    throw err;
  }
};

module.exports = {
  recalculateQuestionDifficulty
};
