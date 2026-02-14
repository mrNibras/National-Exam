const EntranceExam = require('../models/EntranceExam');

// @desc    Get all entrance exams
// @route   GET /api/entrance-exams
// @access  Public
exports.getEntranceExams = async (req, res) => {
  try {
    const { grade, stream } = req.query;
    
    // Build query object
    const query = { isActive: true };
    
    if (grade) {
      query.grade = parseInt(grade);
    }
    
    if (stream) {
      query.stream = stream;
    }
    
    const entranceExams = await EntranceExam.find(query).sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: entranceExams.length,
      data: entranceExams
    });
  } catch (error) {
    console.error('Error fetching entrance exams:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching entrance exams',
      error: error.message
    });
  }
};

// @desc    Get entrance exam by ID
// @route   GET /api/entrance-exams/:id
// @access  Public
exports.getEntranceExamById = async (req, res) => {
  try {
    const entranceExam = await EntranceExam.findById(req.params.id);
    
    if (!entranceExam) {
      return res.status(404).json({
        success: false,
        message: 'Entrance exam not found'
      });
    }
    
    if (!entranceExam.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Entrance exam is not active'
      });
    }
    
    res.json({
      success: true,
      data: entranceExam
    });
  } catch (error) {
    console.error('Error fetching entrance exam:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching entrance exam',
      error: error.message
    });
  }
};

// @desc    Create a new entrance exam
// @route   POST /api/entrance-exams
// @access  Private (Admin only)
exports.createEntranceExam = async (req, res) => {
  try {
    const { 
      grade, 
      stream, 
      subjects, 
      totalQuestions, 
      durationMinutes, 
      name, 
      description 
    } = req.body;

    // Validate required fields
    if (!grade || !stream || !subjects || !totalQuestions || !durationMinutes || !name) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: grade, stream, subjects, totalQuestions, durationMinutes, and name are required'
      });
    }

    // Validate grade
    if (![10, 12].includes(parseInt(grade))) {
      return res.status(400).json({
        success: false,
        message: 'Grade must be either 10 or 12'
      });
    }

    // Validate stream
    if (!['All', 'Natural', 'Social'].includes(stream)) {
      return res.status(400).json({
        success: false,
        message: 'Stream must be either "All", "Natural", or "Social"'
      });
    }

    // Validate subjects array
    if (!Array.isArray(subjects) || subjects.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Subjects must be a non-empty array'
      });
    }

    // Validate subjects format
    for (const subject of subjects) {
      if (!subject.code || !subject.name) {
        return res.status(400).json({
          success: false,
          message: 'Each subject must have a code and name'
        });
      }
    }

    // Create new entrance exam
    const newEntranceExam = new EntranceExam({
      grade: parseInt(grade),
      stream,
      subjects,
      totalQuestions: parseInt(totalQuestions),
      durationMinutes: parseInt(durationMinutes),
      name,
      description: description || '',
      isActive: true
    });

    await newEntranceExam.save();

    res.status(201).json({
      success: true,
      message: 'Entrance exam created successfully',
      data: newEntranceExam
    });
  } catch (error) {
    console.error('Error creating entrance exam:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating entrance exam',
      error: error.message
    });
  }
};

// @desc    Update an entrance exam
// @route   PUT /api/entrance-exams/:id
// @access  Private (Admin only)
exports.updateEntranceExam = async (req, res) => {
  try {
    const { 
      grade, 
      stream, 
      subjects, 
      totalQuestions, 
      durationMinutes, 
      name, 
      description,
      isActive 
    } = req.body;

    const updateData = {};

    if (grade !== undefined) updateData.grade = parseInt(grade);
    if (stream !== undefined) updateData.stream = stream;
    if (subjects !== undefined) updateData.subjects = subjects;
    if (totalQuestions !== undefined) updateData.totalQuestions = parseInt(totalQuestions);
    if (durationMinutes !== undefined) updateData.durationMinutes = parseInt(durationMinutes);
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (isActive !== undefined) updateData.isActive = isActive;

    const entranceExam = await EntranceExam.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!entranceExam) {
      return res.status(404).json({
        success: false,
        message: 'Entrance exam not found'
      });
    }

    res.json({
      success: true,
      message: 'Entrance exam updated successfully',
      data: entranceExam
    });
  } catch (error) {
    console.error('Error updating entrance exam:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating entrance exam',
      error: error.message
    });
  }
};

// @desc    Delete an entrance exam
// @route   DELETE /api/entrance-exams/:id
// @access  Private (Admin only)
exports.deleteEntranceExam = async (req, res) => {
  try {
    const entranceExam = await EntranceExam.findByIdAndDelete(req.params.id);

    if (!entranceExam) {
      return res.status(404).json({
        success: false,
        message: 'Entrance exam not found'
      });
    }

    res.json({
      success: true,
      message: 'Entrance exam deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting entrance exam:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting entrance exam',
      error: error.message
    });
  }
};