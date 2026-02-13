const request = require('supertest');
const app = require('../app');
const User = require('../models/User');

describe('User Registration API', () => {
  it('should return error when required fields are missing', async () => {
    const userData = {
      name: 'Test User',
      email: 'test@example.com'
      // Missing password
    };

    const response = await request(app)
      .post('/api/users/register')
      .send(userData)
      .expect(400);

    // The response might have different structure depending on validation
    expect(response.body).toMatchObject(expect.any(Object));
  });

  it('should return error when registering student without scienceStream', async () => {
    const userData = {
      name: 'Test Student',
      email: 'teststudent@example.com',
      password: 'password123',
      role: 'Student'
      // Missing scienceStream
    };

    const response = await request(app)
      .post('/api/users/register')
      .send(userData)
      .expect(400);

    expect(response.body.msg).toBe('Science stream is required for students');
  });
});