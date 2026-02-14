require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./db');
const { scheduleJobs } = require('./reminderJobs');

const app = express();

// Connect to Database
// Note: For integration tests, we'll handle DB connection separately
if (process.env.NODE_ENV !== 'test' || process.env.TEST_WITH_DB === 'true') {
  connectDB();
}

// Handle CORS - Different configurations for development vs production
const corsOptions = {
  credentials: true,
  optionsSuccessStatus: 200
};

// In production, allow only the frontend domain
if (process.env.NODE_ENV === 'production') {
  corsOptions.origin = process.env.FRONTEND_URL || false; // Use production frontend URL
} else {
  corsOptions.origin = true; // Allow all origins in development
}

app.use(cors(corsOptions));

app.use(express.json({ extended: false }));

app.get('/', (req, res) => res.send('API Running'));

// Define Routes
app.use('/api/auth', require('./authRoutes'));
app.use('/api/users', require('./userRoutes'));
app.use('/api/questions', require('./questionRoutes'));
app.use('/api/tests', require('./testRoutes'));
app.use('/api/tests/exam-simulation', require('./examSimulationRoutes'));
app.use('/api/analytics', require('./analyticsRoutes'));
app.use('/api/analytics/enhanced', require('./enhancedAnalyticsRoutes'));
app.use('/api/notifications', require('./notificationRoutes'));
app.use('/api/schools', require('./schoolRoutes'));
app.use('/api/invitations', require('./invitationRoutes'));
app.use('/api/classes', require('./classRoutes'));
app.use('/api/subjects', require('./routes/subjectRoutes'));
app.use('/api/register', require('./routes/registrationRoutes'));
app.use('/api/analytics/exam-wise', require('./routes/examAnalyticsRoutes'));
app.use('/api/entrance-exams', require('./routes/entranceExamRoutes'));

// Start scheduled jobs
scheduleJobs();

module.exports = app;