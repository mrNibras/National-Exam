const cron = require('node-cron');
const User = require('./User');
const TestAttempt = require('./TestAttempt');
const Question = require('./Question');
const { sendSms } = require('./notificationService');
const { getWeaknessAnalysisForUser } = require('./analyticsService');
const { recalculateQuestionDifficulty } = require('./difficultyService');

/**
 * This function schedules all the recurring jobs for the application.
 */
const scheduleJobs = () => {
  // Schedule a job to run every day at 9:00 AM.
  // The cron expression '0 9 * * *' means: at minute 0 of hour 9 on every day-of-month, every month, and every day-of-week.
  cron.schedule('0 9 * * *', async () => {
    console.log('Running daily study reminder job...');
    try {
      const usersToRemind = await User.find({
        role: 'Student',
        isPhoneVerified: true,
        phoneNumber: { $ne: null },
      });

      for (const user of usersToRemind) {
        const analysis = await getWeaknessAnalysisForUser(user._id);
        let message;

        if (analysis.weaknesses && analysis.weaknesses.length > 0) {
          message = `Hi ${user.name}, time for some practice! Your top area for improvement is "${analysis.weaknesses[0].topic}". Keep up the great work!`;
        } else {
          message = `Hi ${user.name}, this is your daily reminder to practice for your exams on the National Exam Prep Platform!`;
        }
        await sendSms(user.phoneNumber, message);
      }
    } catch (error) {
      console.error('Failed to run daily study reminder job:', error);
    }
  });

  // Schedule a job to run every Sunday at 7:00 PM.
  // The cron expression '0 19 * * 0' means: at minute 0 of hour 19 on day-of-week 0 (Sunday).
  cron.schedule('0 19 * * 0', async () => {
    console.log('Running weekly parental report job...');
    try {
      const studentsWithParents = await User.find({
        role: 'Student',
        parentEmail: { $ne: null, $ne: '' },
      });

      for (const student of studentsWithParents) {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        const weeklyAttempts = await TestAttempt.find({
          user: student._id,
          createdAt: { $gte: oneWeekAgo },
        });

        if (weeklyAttempts.length > 0) {
          const totalScore = weeklyAttempts.reduce((sum, attempt) => sum + attempt.score, 0);
          const totalPossible = weeklyAttempts.reduce((sum, attempt) => sum + attempt.total, 0);
          const averageScore = totalPossible > 0 ? (totalScore / totalPossible) * 100 : 0;

          const reportMessage =
            `Weekly Progress Report for ${student.name}:\n` +
            `Tests Taken this week: ${weeklyAttempts.length}\n` +
            `Average Score: ${averageScore.toFixed(1)}%\n` +
            `Keep encouraging them to practice!`;

          // In a real app, you would send an email to student.parentEmail.
          // For now, we will log it to the console.
          console.log(`--- EMAIL TO: ${student.parentEmail} ---`);
          console.log(reportMessage);
          console.log(`------------------------------------`);
        }
      }
    } catch (error) {
      console.error('Failed to run weekly parental report job:', error);
    }
  });

  // Schedule a job to run every Sunday at 11:59 PM for automatic difficulty reclassification
  // The cron expression '59 23 * * 0' means: at minute 59 of hour 23 on day-of-week 0 (Sunday).
  cron.schedule('59 23 * * 0', async () => {
    console.log('Running automatic difficulty reclassification job...');
    try {
      // Call the recalculateQuestionDifficulty function from the difficulty service
      const result = await recalculateQuestionDifficulty();
      console.log('Automatic difficulty reclassification completed:', result.msg);
    } catch (error) {
      console.error('Failed to run automatic difficulty reclassification job:', error);
    }
  });
};

module.exports = { scheduleJobs };