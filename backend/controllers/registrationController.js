const User = require('../models/User');
const Subject = require('../models/Subject');
const EntranceExam = require('../models/EntranceExam');

// Helper function to get subjects based on grade and stream
const getSubjectsForStudent = async (grade, stream) => {
  let query = {
    grades: { $in: [parseInt(grade)] },
    isEntranceSubject: true
  };

  if ([9, 10, 11, 12].includes(parseInt(grade)) && stream) {
    // For grades 9-12, filter by stream
    query = {
      ...query,
      $or: [
        { stream: stream },
        { stream: 'Both' }
      ]
    };
  }

  const subjects = await Subject.find(query);
  return subjects.map(subject => ({
    code: subject.code,
    name: subject.name
  }));
};

// Register a new student
const registerStudent = async (req, res) => {
  try {
    const { 
      fullName, 
      email, 
      password, 
      school, 
      grade, 
      stream 
    } = req.body;

    // Validate required fields
    if (!fullName || !email || !password || !grade) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: fullName, email, password, and grade are required'
      });
    }

    // Validate school object structure
    let validatedSchool;
    if (typeof school === 'string') {
      // If school is a string (school name), create a basic school object
      validatedSchool = {
        name: school,
        region: "Not Specified", // Default value to meet schema requirement
        zone: "Not Specified",   // Default value to meet schema requirement
        woreda: "Not Specified"  // Default value to meet schema requirement
      };
    } else if (typeof school === 'object' && school.name) {
      // If school is an object, validate required properties
      if (!school.name || !school.region || !school.zone || !school.woreda) {
        return res.status(400).json({
          success: false,
          message: 'School object must include name, region, zone, and woreda properties'
        });
      }
      validatedSchool = school;
    } else {
      return res.status(400).json({
        success: false,
        message: 'School must be either a string (school name) or an object with name, region, zone, and woreda properties'
      });
    }

    // Validate grade range
    if (![9, 10, 11, 12].includes(parseInt(grade))) {
      return res.status(400).json({
        success: false,
        message: 'Grade must be 9, 10, 11, or 12'
      });
    }

    // Validate stream for grades 9-12
    if ([9, 10, 11, 12].includes(parseInt(grade)) && !stream) {
      return res.status(400).json({
        success: false,
        message: 'Stream is required for grades 9, 10, 11 and 12'
      });
    }

    if ([9, 10, 11, 12].includes(parseInt(grade)) && !['Natural', 'Social'].includes(stream)) {
      return res.status(400).json({
        success: false,
        message: 'Stream must be either "Natural" or "Social" for grades 9, 10, 11 and 12'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Determine subjects based on grade and stream
    const subjects = await getSubjectsForStudent(grade, stream);

    // Create new user
    const newUser = new User({
      fullName,
      email,
      password,
      school: validatedSchool,
      grade: parseInt(grade),
      stream: stream, // Set stream for all grades 9-12
      subjects,
      role: 'student' // Set default role for registrants
    });

    await newUser.save();

    // Return success response without password
    const userResponse = {
      _id: newUser._id,
      fullName: newUser.fullName,
      email: newUser.email,
      school: newUser.school,
      grade: newUser.grade,
      stream: newUser.stream,
      subjects: newUser.subjects,
      role: newUser.role,
      createdAt: newUser.createdAt
    };

    res.status(201).json({
      success: true,
      message: 'Student registered successfully',
      data: userResponse
    });
  } catch (error) {
    console.error('Error registering student:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration',
      error: error.message
    });
  }
};

// Get student profile
const getStudentProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching profile',
      error: error.message
    });
  }
};

// Update student profile
const updateStudentProfile = async (req, res) => {
  try {
    const { fullName, school, grade, stream } = req.body;

    // Prepare update object
    const updateData = {};
    if (fullName) updateData.fullName = fullName;

    // Handle school update
    if (school) {
      if (typeof school === 'string') {
        // If school is a string (school name), update with basic school object
        updateData.school = {
          name: school,
          region: req.user.school?.region || "Not Specified",
          zone: req.user.school?.zone || "Not Specified",
          woreda: req.user.school?.woreda || "Not Specified"
        };
      } else if (typeof school === 'object' && school.name) {
        // If school is an object, validate required properties
        if (!school.name || !school.region || !school.zone || !school.woreda) {
          return res.status(400).json({
            success: false,
            message: 'School object must include name, region, zone, and woreda properties'
          });
        }
        updateData.school = school;
      } else {
        return res.status(400).json({
          success: false,
          message: 'School must be either a string (school name) or an object with name, region, zone, and woreda properties'
        });
      }
    }
    if (grade !== undefined) updateData.grade = parseInt(grade);
    
    // Allow stream updates for grades 9-12
    if (grade !== undefined && [9, 10, 11, 12].includes(parseInt(grade)) && stream) {
      if (['Natural', 'Social'].includes(stream)) {
        updateData.stream = stream;

        // Update subjects based on new stream
        const subjects = await getSubjectsForStudent(updateData.grade || req.user.grade, stream);
        updateData.subjects = subjects;
      } else {
        return res.status(400).json({
          success: false,
          message: 'Stream must be either "Natural" or "Social" for grades 9, 10, 11 and 12'
        });
      }
    } else if (grade !== undefined && ![9, 10, 11, 12].includes(parseInt(grade))) {
      // If grade is changed to something outside 9-12, remove stream
      updateData.stream = null;
      const subjects = await getSubjectsForStudent(updateData.grade, null);
      updateData.subjects = subjects;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-password');

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedUser
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating profile',
      error: error.message
    });
  }
};

module.exports = {
  registerStudent,
  getStudentProfile,
  updateStudentProfile
};