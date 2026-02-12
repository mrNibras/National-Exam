const Subject = require('../models/Subject');

// Get subjects by grade and stream
const getSubjectsByGradeAndStream = async (req, res) => {
  try {
    const { grade, stream } = req.query;

    if (!grade) {
      return res.status(400).json({ 
        success: false, 
        message: 'Grade is required' 
      });
    }

    let query = { 
      grades: { $in: [parseInt(grade)] },
      isEntranceSubject: true 
    };

    // If stream is provided, filter by stream
    if (stream) {
      if (stream === 'Natural' || stream === 'Social') {
        query = { 
          ...query, 
          $or: [
            { stream: stream },
            { stream: 'Both' }
          ]
        };
      } else {
        query.stream = 'Both';
      }
    } else {
      // If no stream specified, only return subjects that are for 'Both' streams
      query.stream = 'Both';
    }

    const subjects = await Subject.find(query).sort({ order: 1 });

    res.status(200).json({
      success: true,
      data: subjects
    });
  } catch (error) {
    console.error('Error fetching subjects:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching subjects',
      error: error.message
    });
  }
};

// Get all subjects
const getAllSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find().sort({ order: 1, name: 1 });
    
    res.status(200).json({
      success: true,
      count: subjects.length,
      data: subjects
    });
  } catch (error) {
    console.error('Error fetching all subjects:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching subjects',
      error: error.message
    });
  }
};

// Create a new subject
const createSubject = async (req, res) => {
  try {
    const { code, name, stream, category, grades, isEntranceSubject, entranceGrades, order, description, syllabusVersion } = req.body;

    // Check if subject with this code already exists
    const existingSubject = await Subject.findOne({ code: code.toUpperCase() });
    if (existingSubject) {
      return res.status(400).json({
        success: false,
        message: 'Subject with this code already exists'
      });
    }

    const subject = new Subject({
      code: code.toUpperCase(),
      name,
      stream,
      category,
      grades,
      isEntranceSubject: isEntranceSubject || false,
      entranceGrades,
      order,
      description,
      syllabusVersion
    });

    await subject.save();

    res.status(201).json({
      success: true,
      message: 'Subject created successfully',
      data: subject
    });
  } catch (error) {
    console.error('Error creating subject:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating subject',
      error: error.message
    });
  }
};

// Get subject by ID
const getSubjectById = async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id);

    if (!subject) {
      return res.status(404).json({
        success: false,
        message: 'Subject not found'
      });
    }

    res.status(200).json({
      success: true,
      data: subject
    });
  } catch (error) {
    console.error('Error fetching subject:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching subject',
      error: error.message
    });
  }
};

module.exports = {
  getSubjectsByGradeAndStream,
  getAllSubjects,
  createSubject,
  getSubjectById
};