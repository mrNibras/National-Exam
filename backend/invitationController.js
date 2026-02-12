const crypto = require('crypto');
const Invitation = require('./Invitation');

// @desc    Create an invitation
// @route   POST /api/invitations
// @access  Private (School Admin, Regional Admin)
exports.createInvitation = async (req, res) => {
  const { email, role, scienceStream } = req.body;

  try {
    // Check if an invitation for this email already exists
    let existingInvitation = await Invitation.findOne({ email });
    if (existingInvitation) {
      return res.status(400).json({ msg: 'An invitation for this email already exists.' });
    }

    const token = crypto.randomBytes(20).toString('hex');

    const newInvitation = new Invitation({
      email,
      role,
      scienceStream,
      school: req.user.school, // School is taken from the inviting admin's JWT
      token,
      expires: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    });

    await newInvitation.save();

    // In a real app, you would email this link to the user.
    res.json({ msg: 'Invitation created.', invitationLink: `/register?token=${token}` });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get invitation details by token
// @route   GET /api/invitations/:token
// @access  Public
exports.getInvitationByToken = async (req, res) => {
  try {
    const invitation = await Invitation.findOne({
      token: req.params.token,
      expires: { $gt: Date.now() },
    }).populate('school', 'name'); // Populate school name

    if (!invitation) {
      return res.status(400).json({ msg: 'Invitation is invalid or has expired.' });
    }

    res.json(invitation);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get all pending invitations for the admin's school
// @route   GET /api/invitations
// @access  Private (School Admin, Regional Admin)
exports.getInvitations = async (req, res) => {
  try {
    const query = {};
    // Regional Admins can see all invitations, others are scoped to their school
    if (req.user.role !== 'Regional Admin') {
      query.school = req.user.school;
    }

    const invitations = await Invitation.find(query).sort({ expires: 1 });
    res.json(invitations);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Delete/revoke an invitation
// @route   DELETE /api/invitations/:id
// @access  Private (School Admin, Regional Admin)
exports.deleteInvitation = async (req, res) => {
  try {
    const invitation = await Invitation.findById(req.params.id);

    if (!invitation) {
      return res.status(404).json({ msg: 'Invitation not found' });
    }

    // Ensure the admin has permission to delete this invitation
    if (req.user.role !== 'Regional Admin' && invitation.school.toString() !== req.user.school) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await invitation.remove();
    res.json({ msg: 'Invitation revoked.' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};