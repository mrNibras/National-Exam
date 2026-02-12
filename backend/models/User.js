const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  school: {
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'School',
      default: null
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    region: {
      type: String,
      required: true,
      trim: true
    },
    zone: {
      type: String,
      required: true,
      trim: true
    },
    woreda: {
      type: String,
      required: true,
      trim: true
    }
  },
  grade: {
    type: Number,
    enum: [9, 10, 11, 12],
    required: function() {
      return this.role === 'student';
    },
    validate: {
      validator: function(value) {
        // If role is student, grade is required and must be in the enum
        if (this.role === 'student') {
          return value != null && [9, 10, 11, 12].includes(value);
        }
        // If role is not student, grade can be null/undefined
        return true;
      },
      message: 'Grade is required for students and must be between 9 and 12.'
    }
  },
  scienceStream: {
    type: String,
    enum: ['Natural Science', 'Social Science'],
    default: null
  },
  // Teacher-specific fields
  experience: {
    type: String,
    default: ''
  },
  about: {
    type: String,
    default: ''
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
  role: {
    type: String,
    enum: ['student', 'teacher', 'admin'],
    default: 'student'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
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

// Hash password before saving
userSchema.pre('save', function(next) {
  if (!this.isModified('password')) {
    return next();
  }

  bcrypt.genSalt(10, (err, salt) => {
    if (err) return next(err);

    bcrypt.hash(this.password, salt, (hashErr, hashedPassword) => {
      if (hashErr) return next(hashErr);

      this.password = hashedPassword;
      this.updatedAt = Date.now();
      next();
    });
  });
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);