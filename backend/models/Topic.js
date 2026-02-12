const mongoose = require('mongoose');

const topicSchema = new mongoose.Schema({
  subjectCode: {
    type: String,
    required: true,
    uppercase: true,
    trim: true
  },
  subjectName: {
    type: String,
    required: true
  },
  grade: {
    type: Number,
    required: true,
    enum: [9, 10, 11, 12]
  },
  stream: {
    type: String,
    enum: ['Natural', 'Social', 'Both'],
    default: 'Both'
  },
  topics: [{
    type: String,
    required: true,
    trim: true
  }],
  description: {
    type: String,
    trim: true
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
topicSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Topic', topicSchema);