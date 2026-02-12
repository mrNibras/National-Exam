const request = require('supertest');
const app = require('../app');
const Subject = require('../models/Subject');
const mongoose = require('mongoose');
require('dotenv').config();

describe('Subject API', () => {
  beforeAll(async () => {
    // Connect to test database
    await mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_URI);
  });

  afterAll(async () => {
    // Close database connection
    await mongoose.connection.close();
  });

  it('should return all subjects', async () => {
    const response = await request(app)
      .get('/api/subjects')
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.data.length).toBeGreaterThan(0);
    
    // Check that first subject has expected properties
    const firstSubject = response.body.data[0];
    expect(firstSubject).toHaveProperty('_id');
    expect(firstSubject).toHaveProperty('name');
    expect(firstSubject).toHaveProperty('code');
    expect(firstSubject).toHaveProperty('stream');
  });

  it('should return subjects filtered by grade and stream', async () => {
    const response = await request(app)
      .get('/api/subjects/grade-stream?grade=12&stream=Natural')
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);
  });

  it('should return a specific subject by ID', async () => {
    // First get a subject to use its ID
    const subjectsResponse = await request(app)
      .get('/api/subjects')
      .expect(200);

    if (subjectsResponse.body.data.length > 0) {
      const subjectId = subjectsResponse.body.data[0]._id;
      
      const response = await request(app)
        .get(`/api/subjects/${subjectId}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data._id).toBe(subjectId);
    }
  });
});