const Question = require('./Question');
const TestAttempt = require('./TestAttempt');
const User = require('./User');
const School = require('./School');
const Invitation = require('./Invitation');
const bcrypt = require('bcryptjs');
const { sendSms } = require('./notificationService');
const jwt = require('jsonwebtoken');

// @route   POST api/users/register
// @desc    Register a user
// @access  Public
exports.registerUser = async (req, res) => {
  const { name, email, password, role, schoolId, invitationToken, scienceStream, grade, school, subjects, experience, about } = req.body;

  try {
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    let finalEmail = email;
    let finalRole = role || 'Student';
    let finalSchool = schoolId;
    let finalScienceStream = scienceStream;
    let finalGrade = grade;
    let finalSubjects = subjects;
    let finalExperience = experience;
    let finalAbout = about;

    if (invitationToken) {
      const invitation = await Invitation.findOne({
        token: invitationToken,
        expires: { $gt: Date.now() },
      });

      if (!invitation) {
        return res.status(400).json({ msg: 'Invitation is invalid or has expired.' });
      }

      // Use data from the invitation, overriding any user input
      finalEmail = invitation.email;
      finalRole = invitation.role;
      finalSchool = invitation.school;
      // Use the scienceStream from the invitation if it's a student invitation
      if (invitation.scienceStream) {
        finalScienceStream = invitation.scienceStream;
      }

      // Delete the invitation after use
      await Invitation.findByIdAndDelete(invitation._id);
    }

    // Validate role-specific requirements
    if (finalRole === 'Student') {
      if (!finalScienceStream) {
        return res.status(400).json({ msg: 'Science stream is required for students' });
      }
      if (!finalGrade) {
        return res.status(400).json({ msg: 'Grade is required for students' });
      }
    } else if (finalRole === 'Teacher') {
      // For teachers, we need either finalSchool (from invitation) or school (direct registration)
      if (!finalSchool && !school) {
        return res.status(400).json({ msg: 'School information is required for teachers' });
      }
      if (!finalSubjects || finalSubjects.length === 0) {
        return res.status(400).json({ msg: 'Subjects taught is required for teachers' });
      }
      if (!finalExperience) {
        return res.status(400).json({ msg: 'Experience information is required for teachers' });
      }
      if (!finalAbout) {
        return res.status(400).json({ msg: 'About information is required for teachers' });
      }
    }

    // Handle school creation if it doesn't exist and is provided as a string
    let schoolToUse = finalSchool || school;
    
    // If schoolToUse is a string (school name), find or create the school
    if (typeof schoolToUse === 'string') {
      let schoolDoc = await School.findOne({ name: schoolToUse });
      if (!schoolDoc) {
        // Create new school
        schoolDoc = new School({
          name: schoolToUse,
          level: 'Preparatory', // Default level
          ownership: 'Public', // Default ownership
          city: 'Unknown' // Default city
        });
        await schoolDoc.save();
      }
      schoolToUse = schoolDoc._id;
    }

    user = new User({
      name,
      email: finalEmail,
      password,
      role: finalRole,
      school: schoolToUse,
      scienceStream: finalScienceStream,
      grade: finalGrade,
      subjects: finalSubjects,
      experience: finalExperience,
      about: finalAbout
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    const payload = {
      user: {
        id: user.id,
        role: user.role,
        school: user.school,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      {
        expiresIn: 360000,
      },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ msg: err.message });
    }
    res.status(500).send('Server Error');
  }
};

// @route   PUT api/users/phone
// @desc    Update user's phone number and send verification code
// @access  Private
exports.updatePhoneNumber = async (req, res) => {
  const { phoneNumber } = req.body;
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Generate a 6-digit verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    user.phoneNumber = phoneNumber;
    user.phoneVerificationCode = verificationCode; // In a real app, you should hash this code.
    user.phoneVerificationExpires = Date.now() + 10 * 60 * 1000; // 10 minutes from now
    user.isPhoneVerified = false;

    await user.save();

    // Send the verification code via SMS
    await sendSms(
      phoneNumber,
      `Your verification code is: ${verificationCode}`
    );

    res.json({ msg: 'Verification code sent to your phone number.' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};


exports.verifyPhoneNumber = async (req, res) => {
  const { code } = req.body;
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    if (
      !user.phoneVerificationCode ||
      user.phoneVerificationExpires < Date.now()
    ) {
      return res.status(400).json({ msg: 'Verification code is invalid or has expired.' });
    }

    if (user.phoneVerificationCode !== code) {
      return res.status(400).json({ msg: 'Invalid verification code.' });
    }

    // Verification successful
    user.isPhoneVerified = true;
    user.phoneVerificationCode = undefined;
    user.phoneVerificationExpires = undefined;
    await user.save();

    res.json({ msg: 'Phone number verified successfully.' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @route   PUT api/users/parent-email
// @desc    Update user's parent email address
// @access  Private (Student)
exports.updateParentEmail = async (req, res) => {
  const { parentEmail } = req.body;
  try {
    const user = await User.findById(req.user.id);

    if (!user || user.role !== 'Student') {
      return res.status(403).json({ msg: 'This action is only available for students.' });
    }

    user.parentEmail = parentEmail;
    await user.save();

    res.json({ msg: "Parent's email updated successfully." });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @route   PUT api/users/change-password
// @desc    Change user's password
// @access  Private
exports.changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Check if current password is correct
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Incorrect current password.' });
    }

    // Hash and set new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({ msg: 'Password changed successfully.' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @route   PUT api/users/stream
// @desc    Update user's stream selection
// @access  Private
exports.updateStream = async (req, res) => {
  const { scienceStream } = req.body;
  
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Only allow students to update their stream
    if (user.role !== 'Student') {
      return res.status(403).json({ msg: 'Only students can update their stream' });
    }

    // Only allow stream updates for grades 9 and 10
    if (![9, 10].includes(user.grade)) {
      return res.status(403).json({ msg: 'Stream can only be updated for grades 9 and 10' });
    }

    user.scienceStream = scienceStream;
    await user.save();

    res.json({ msg: 'Stream updated successfully', user: { ...user.toObject(), password: undefined } });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};