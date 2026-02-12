const mongoose = require('mongoose');

const AuditLogSchema = new mongoose.Schema({
  action: {
    type: String,
    required: true,
    enum: [
      'TEST_SUBMITTED',
      'TEST_SCORE_MODIFIED',
      'RESULT_VIEWED',
      'QUESTION_CREATED',
      'QUESTION_UPDATED',
      'QUESTION_DELETED',
      'USER_CREATED',
      'USER_UPDATED',
      'USER_DELETED'
    ]
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  userRole: {
    type: String,
    required: true,
    enum: ['Student', 'Teacher', 'School Admin', 'Regional Admin']
  },
  targetUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  targetEntity: {
    type: String,
    enum: ['TestAttempt', 'Question', 'User', 'Class', 'School']
  },
  targetEntityId: {
    type: mongoose.Schema.Types.ObjectId,
  },
  oldValue: {
    type: mongoose.Schema.Types.Mixed,
  },
  newValue: {
    type: mongoose.Schema.Types.Mixed,
  },
  description: {
    type: String,
  },
  ipAddress: {
    type: String,
  },
  userAgent: {
    type: String,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('AuditLog', AuditLogSchema);
