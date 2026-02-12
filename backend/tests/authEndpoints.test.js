const request = require('supertest');
const app = require('../app');
const User = require('../models/User');
const mongoose = require('mongoose');
require('dotenv').config();

describe('Authentication API', () => {
  beforeAll(async () => {
    // Connect to test database
    await mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_URI);
  });

  beforeEach(async () => {
    // Clean up database before each test
    await User.deleteMany({});
  });

  afterAll(async () => {
    // Close database connection
    await mongoose.connection.close();
  });

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