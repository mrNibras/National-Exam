const Class = require('./Class');
const User = require('./User');
const School = require('./School');
const { validationResult } = require('express-validator');

// @desc    Create a class
// @route   POST /api/classes
// @access  Private (Teacher, School Admin, System Admin)
exports.createClass = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Verify that the user is a teacher if they're not a Regional Admin
    if (req.user.role !== 'Regional Admin' && req.user.role !== 'Teacher') {
      return res.status(401).json({ msg: 'User not authorized to create classes' });
    }

    const newClass = new Class({
      ...req.body,
      teacher: req.user.id,
      school: req.user.school, // Use the user's school
    });

    const classObj = await newClass.save();
    res.json(classObj);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get all classes for a school
// @route   GET /api/classes
// @access  Private
exports.getClasses = async (req, res) => {
  try {
    const query = {};
    // Regional Admins can see all classes, others are scoped to their school
    if (req.user.role !== 'Regional Admin') {
      query.school = req.user.school;
    }

    // If user is a teacher, only show classes they teach
    if (req.user.role === 'Teacher') {
      query.teacher = req.user.id;
    }

    const classes = await Class.find(query)
      .populate('teacher', 'name email')
      .populate('students', 'name email')
      .populate('school', 'name')
      .sort({ createdAt: -1 });

    res.json(classes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get a specific class by ID
// @route   GET /api/classes/:id
// @access  Private
exports.getClassById = async (req, res) => {
  try {
    const classObj = await Class.findById(req.params.id)
      .populate('teacher', 'name email')
      .populate('students', 'name email')
      .populate('school', 'name');

    if (!classObj) {
      return res.status(404).json({ msg: 'Class not found' });
    }

    // Check authorization: Regional Admins can access any class, others need to belong to the same school
    if (req.user.role !== 'Regional Admin' && classObj.school.toString() !== req.user.school.toString()) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    res.json(classObj);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Class not found' });
    }
    res.status(500).send('Server Error');
  }
};

// @desc    Update a class
// @route   PUT /api/classes/:id
// @access  Private
exports.updateClass = async (req, res) => {
  try {
    let classObj = await Class.findById(req.params.id);

    if (!classObj) {
      return res.status(404).json({ msg: 'Class not found' });
    }

    // Check authorization: Only teacher who created the class, school admin, or regional admin can update
    if (classObj.teacher.toString() !== req.user.id &&
        req.user.role !== 'School Admin' &&
        req.user.role !== 'Regional Admin') {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    classObj = await Class.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    )
    .populate('teacher', 'name email')
    .populate('students', 'name email');

    res.json(classObj);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Delete a class
// @route   DELETE /api/classes/:id
// @access  Private
exports.deleteClass = async (req, res) => {
  try {
    const classObj = await Class.findById(req.params.id);

    if (!classObj) {
      return res.status(404).json({ msg: 'Class not found' });
    }

    // Check authorization: Only teacher who created the class, school admin, or regional admin can delete
    if (classObj.teacher.toString() !== req.user.id &&
        req.user.role !== 'School Admin' &&
        req.user.role !== 'Regional Admin') {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await Class.findByIdAndDelete(req.params.id);

    res.json({ msg: 'Class removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Add a student to a class
// @route   PUT /api/classes/:id/add-student
// @access  Private
exports.addStudentToClass = async (req, res) => {
  const { studentId } = req.body;

  try {
    const classObj = await Class.findById(req.params.id);

    if (!classObj) {
      return res.status(404).json({ msg: 'Class not found' });
    }

    // Check authorization: Only teacher of the class, school admin, or regional admin can add students
    if (classObj.teacher.toString() !== req.user.id &&
        req.user.role !== 'School Admin' &&
        req.user.role !== 'Regional Admin') {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    // Verify the student exists and belongs to the same school
    const student = await User.findById(studentId);
    if (!student) {
      return res.status(404).json({ msg: 'Student not found' });
    }

    if (student.school.toString() !== req.user.school.toString()) {
      return res.status(401).json({ msg: 'Student does not belong to your school' });
    }

    // Add student to class if not already enrolled
    if (classObj.students.includes(studentId)) {
      return res.status(400).json({ msg: 'Student already enrolled in this class' });
    }

    classObj.students.push(studentId);
    await classObj.save();

    res.json(classObj);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Remove a student from a class
// @route   PUT /api/classes/:id/remove-student
// @access  Private
exports.removeStudentFromClass = async (req, res) => {
  const { studentId } = req.body;

  try {
    const classObj = await Class.findById(req.params.id);

    if (!classObj) {
      return res.status(404).json({ msg: 'Class not found' });
    }

    // Check authorization: Only teacher of the class, school admin, or regional admin can remove students
    if (classObj.teacher.toString() !== req.user.id &&
        req.user.role !== 'School Admin' &&
        req.user.role !== 'Regional Admin') {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    // Remove student from class
    classObj.students = classObj.students.filter(student => student.toString() !== studentId);
    await classObj.save();

    res.json(classObj);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
