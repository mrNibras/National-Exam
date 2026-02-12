const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  subject: {
    type: String,
    required: true,
  },
  grade: {
    type: String,
    required: true,
    enum: ['Grade 9', 'Grade 10', 'Grade 11', 'Grade 12', 'University'],
  },
  topic: {
    type: String,
    required: true,
  },
  competency: {
    type: String,
    required: true,
  },
  scienceStream: {
    type: String,
    enum: ['Natural Science', 'Social Science'],
    default: 'Natural Science', // Default to Natural Science for backward compatibility
  },
  questionText: {
    type: String,
    required: true,
  },
  options: [{
    type: String,
    required: true,
  }],
  correctAnswer: {
    type: String,
    required: true,
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Medium',
  },
  difficultyRating: {
    type: Number,
    default: 1200, // Starting Elo rating
  },
  version: {
    type: String,
    default: '1.0',
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true
});

module.exports = mongoose.model('Question', QuestionSchema);
