const mongoose = require('mongoose');

const TestAttemptSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  questions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question',
    },
  ],
  answers: {
    type: Map,
    of: new mongoose.Schema({
      answer: String,
      timeSpent: Number, // in seconds
    }),
  },
  score: {
    type: Number,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
  examType: {
    type: String,
    enum: ['practice', 'simulation', 'mock'],
    default: 'practice',
  },
  timeSpent: {
    type: Number, // Total time spent on the exam in seconds
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('TestAttempt', TestAttemptSchema);