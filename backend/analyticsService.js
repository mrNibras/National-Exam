const TestAttempt = require('./TestAttempt');
const User = require('./User');

/**
 * Analyzes a user's test history to find their weakest topics.
 * @param {string} userId - The ID of the user to analyze.
 * @returns {Promise<object>} An object containing the user's weaknesses.
 */
exports.getWeaknessAnalysisForUser = async (userId) => {
  // Get the user's science stream
  const user = await User.findById(userId);
  const userScienceStream = user.scienceStream;

  // Build the query to filter attempts based on the science stream of the questions
  const attempts = await TestAttempt.find({ user: userId }).populate({
    path: 'questions',
    match: userScienceStream ? { scienceStream: userScienceStream } : {} // Only populate questions matching the user's science stream
  });

  if (attempts.length === 0) {
    return { weaknesses: [], message: 'Take a few tests to generate your study plan!' };
  }

  const topicPerformance = {};

  attempts.forEach(attempt => {
    attempt.questions.forEach(question => {
      // Guard against deleted/malformed questions or questions that didn't match the science stream filter
      if (!question || !question.topic) return;

      const topic = question.topic;
      if (!topicPerformance[topic]) {
        topicPerformance[topic] = { correct: 0, incorrect: 0, subject: question.subject, scienceStream: question.scienceStream };
      }

      const questionIdStr = question._id.toString();
      const userAnswer = attempt.answers.get(questionIdStr);

      // The answer map now stores an object, so we need to access the 'answer' property
      if (userAnswer && userAnswer.answer === question.correctAnswer) {
        topicPerformance[topic].correct++;
      } else {
        topicPerformance[topic].incorrect++;
      }
    });
  });

  const weaknesses = Object.entries(topicPerformance)
    .map(([topic, stats]) => ({
      topic,
      subject: stats.subject,
      scienceStream: stats.scienceStream,
      incorrectCount: stats.incorrect,
      accuracy: stats.correct + stats.incorrect === 0 ? 0 : (stats.correct / (stats.correct + stats.incorrect)) * 100,
    }))
    .filter(item => item.incorrectCount > 0)
    .sort((a, b) => b.incorrectCount - a.incorrectCount || a.accuracy - b.accuracy);

  return { weaknesses: weaknesses.slice(0, 5) }; // Return top 5 weaknesses
};