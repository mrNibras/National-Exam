const mongoose = require('mongoose');

const InvitationSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  school: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'School',
    required: true,
  },
  role: {
    type: String,
    enum: ['Student', 'Teacher', 'School Admin'],
    required: true,
  },
  scienceStream: {
    type: String,
    enum: ['Natural Science', 'Social Science'],
    required: function() {
      // Science stream is required when inviting a student
      return this.role === 'Student';
    }
  },
  token: {
    type: String,
    required: true,
    unique: true,
  },
  expires: Date,
});

module.exports = mongoose.model('invitation', InvitationSchema);