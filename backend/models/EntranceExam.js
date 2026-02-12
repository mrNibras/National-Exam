const mongoose = require('mongoose');

const entranceExamSchema = new mongoose.Schema({
  grade: {
    type: Number,
    required: true,
    enum: [10, 12]
  },
  stream: {
    type: String,
    required: true,
    enum: ['All', 'Natural', 'Social']
  },
  subjects: [{
    code: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    }
  }],
  totalQuestions: {
    type: Number,
    required: true
  },
  durationMinutes: {
    type: Number,
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
entranceExamSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('EntranceExam', entranceExamSchema);