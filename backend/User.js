const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['Student', 'Teacher', 'School Admin', 'Regional Admin'],
    default: 'Student',
  },
  school: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'School', // Updated to match the actual model name
    required: function() {
      // School is required for all roles
      return true;
    }
  },
  scienceStream: {
    type: String,
    enum: ['Natural Science', 'Social Science'],
    required: function() {
      // Science stream is required for students
      return this.role === 'Student';
    }
  },
  abilityScore: {
    type: Number,
    default: 1000, // Starting ability score, similar to an Elo rating
  },
  phoneNumber: {
    type: String, // E.164 format
  },
  phoneVerificationCode: {
    type: String,
  },
  phoneVerificationExpires: {
    type: Date,
  },
  isPhoneVerified: {
    type: Boolean,
    default: false,
  },
  passwordResetToken: {
    type: String,
  },
  passwordResetExpires: {
    type: Date,
  },
  parentEmail: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('user', UserSchema);