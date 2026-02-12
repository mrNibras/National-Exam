const { sendSms } = require('./notificationService');

// @desc    Send a test SMS
// @route   POST /api/notifications/send-test
// @access  Private
exports.sendTestSms = async (req, res) => {
  try {
    // In a real app, you'd get the user's phone number from their profile.
    // For this test, we'll use a placeholder from the request body.
    const { to } = req.body;
    const body = 'Hello from the National Exam Prep Platform! Your setup is working.';
    await sendSms(to, body);
    res.json({ msg: 'Test SMS sent successfully.' });
  } catch (err) {
    res.status(500).json({ msg: 'Failed to send test SMS.' });
  }
};