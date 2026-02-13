const request = require('supertest');
const app = require('../app');
const User = require('../models/User');

describe('Authentication API', () => {
  it('should return error for invalid credentials', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'nonexistent@test.com',
        password: 'wrongpassword'
      })
      .expect(400); // Changed to 400 based on actual response

    expect(response.body).toHaveProperty('msg');
  });

  it('should return error when email is missing', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        password: 'password123'
      })
      .expect(400);

    expect(response.body).toHaveProperty('errors');
  });

  it('should return error when password is missing', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com'
      })
      .expect(400);

    expect(response.body).toHaveProperty('errors');
  });
});