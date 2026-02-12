/**
 * User Model
 * 
 * Represents a user in the National Exam Preparation System.
 * Users can have different roles: Student, Teacher, School Admin, or Regional Admin.
 * 
 * Role-specific fields:
 * - Student: Requires scienceStream and grade
 * - Teacher: Requires subjects, experience, and about fields
 * - School Admin: Administrative privileges for a specific school
 * - Regional Admin: Highest level of administrative privileges
 */

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
  grade: {
    type: Number,
    min: 7,
    max: 12,
    required: function() {
      // Grade is required for students
      return this.role === 'Student';
    }
  },
  subjects: {
    type: [String], // Array of subject names for teachers
    required: function() {
      // Subjects are required for teachers
      return this.role === 'Teacher';
    }
  },
  experience: {
    type: String, // Experience level for teachers
    required: function() {
      // Experience is required for teachers
      return this.role === 'Teacher';
    }
  },
  about: {
    type: String, // About information for teachers
    required: function() {
      // About is required for teachers
      return this.role === 'Teacher';
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