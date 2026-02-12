const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true
  },
  name: {
    type: String,
    required: true
  },
  stream: {
    type: String,
    enum: ['Natural', 'Social', 'Both'],
    required: true,
    default: 'Both'
  },
  category: {
    type: String,
    enum: ['Common', 'Natural', 'Social'],
    required: true
  },
  grades: [{
    type: Number,
    enum: [9, 10, 11, 12],
    required: true
  }],
  isEntranceSubject: {
    type: Boolean,
    default: false
  },
  entranceGrades: [{
    type: Number,
    enum: [10, 12]
  }],
  order: {
    type: Number,
    default: 0
  },
  syllabusVersion: {
    type: String,
    trim: true
  },
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
subjectSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Subject', subjectSchema);