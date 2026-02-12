const School = require('./School');

// @desc    Get all schools
// @route   GET /api/schools
// @access  Private (Regional Admin)
exports.getSchools = async (req, res) => {
  try {
    const schools = await School.find().sort({ name: 1 });
    res.json(schools);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Create a school
// @route   POST /api/schools
// @access  Private (Regional Admin)
exports.createSchool = async (req, res) => {
  const { schoolCode, name, level, ownership, city } = req.body;

  try {
    let school = await School.findOne({ name });
    if (school) {
      return res.status(400).json({ msg: 'A school with this name already exists.' });
    }

    school = new School({
      schoolCode,
      name,
      level,
      ownership,
      city
    });

    await school.save();
    res.json(school);
  } catch (err) {
    console.error(err.message);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ msg: err.message });
    }
    res.status(500).send('Server Error');
  }
};


// @desc    Search schools by name
// @route   GET /api/schools/search
// @access  Public
exports.searchSchoolsByName = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ msg: 'Search query is required' });
    }

    const schools = await School.find({
      $text: { $search: q }
    }).limit(10);

    res.json(schools);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get all schools for public registration
// @route   GET /api/schools/public
// @access  Public
exports.getPublicSchools = async (req, res) => {
  try {
    // Select only name and id for the dropdown
    const schools = await School.find().select('name').sort({ name: 1 });
    res.json(schools);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};