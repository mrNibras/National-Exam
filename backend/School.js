const mongoose = require('mongoose');

const SchoolSchema = new mongoose.Schema({
  schoolCode: {
    type: String,
    unique: true,
    sparse: true // Allows null values for entries without codes
  },
  name: {
    type: String,
    required: true,
    unique: true,
  },
  level: {
    type: String,
    enum: ['Primary', 'Secondary', 'Preparatory'],
    required: true
  },
  ownership: {
    type: String,
    enum: ['Public', 'Private', 'NGO'],
    required: true
  },
  city: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true
});

// Create indexes for performance
SchoolSchema.index({ name: "text" }); // Text index for search

module.exports = mongoose.model('School', SchoolSchema);
