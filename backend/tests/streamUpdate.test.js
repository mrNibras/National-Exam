const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app'); // Adjust path as needed
const User = require('../models/User');
const jwt = require('jsonwebtoken');

describe('PUT /api/users/stream', () => {
  let token;
  let user;

  beforeEach(async () => {
    // Create a test user
    user = new User({
      fullName: 'Test Student',
      email: 'teststudent@example.com',
      password: 'password123',
      school: {
        name: 'Test School',
        region: 'Test Region',
        zone: 'Test Zone',
        woreda: 'Test Woreda'
      },
      role: 'student',
      grade: 9,
      scienceStream: null
    });
    
    await user.save();
    
    // Generate JWT token for the user
    token = jwt.sign(
      { user: { id: user.id, role: user.role } },
      process.env.JWT_SECRET || 'testsecret',
      { expiresIn: '1h' }
    );
  });

  afterEach(async () => {
    // Clean up test data
    await User.deleteMany({ email: 'teststudent@example.com' });
  });

  it('should update the user stream for grades 9 and 10', async () => {
    const res = await request(app)
      .put('/api/users/stream')
      .set('x-auth-token', token)
      .send({ scienceStream: 'Natural Science' })
      .expect(200);

    expect(res.body.msg).toBe('Stream updated successfully');
    expect(res.body.user.scienceStream).toBe('Natural Science');

    // Verify the update in the database
    const updatedUser = await User.findById(user.id);
    expect(updatedUser.scienceStream).toBe('Natural Science');
  });

  it('should reject stream updates for grades 11 and 12', async () => {
    // Update user to grade 11
    user.grade = 11;
    await user.save();

    const newToken = jwt.sign(
      { user: { id: user.id, role: user.role } },
      process.env.JWT_SECRET || 'testsecret',
      { expiresIn: '1h' }
    );

    const res = await request(app)
      .put('/api/users/stream')
      .set('x-auth-token', newToken)
      .send({ scienceStream: 'Natural Science' })
      .expect(403);

    expect(res.body.msg).toBe('Stream can only be updated for grades 9 and 10');
  });

  it('should reject stream updates for non-students', async () => {
    // Update user role to teacher
    user.role = 'teacher';
    await user.save();

    const newToken = jwt.sign(
      { user: { id: user.id, role: user.role } },
      process.env.JWT_SECRET || 'testsecret',
      { expiresIn: '1h' }
    );

    const res = await request(app)
      .put('/api/users/stream')
      .set('x-auth-token', newToken)
      .send({ scienceStream: 'Natural Science' })
      .expect(403);

    expect(res.body.msg).toBe('Only students can update their stream');
  });

  it('should reject invalid stream values', async () => {
    const res = await request(app)
      .put('/api/users/stream')
      .set('x-auth-token', token)
      .send({ scienceStream: 'Invalid Stream' })
      .expect(400);

    // The validation middleware should catch this
    expect(res.status).toBe(400);
  });

  it('should require authentication', async () => {
    const res = await request(app)
      .put('/api/users/stream')
      .send({ scienceStream: 'Natural Science' })
      .expect(401);

    expect(res.body.msg).toBe('No token, authorization denied');
  });
});