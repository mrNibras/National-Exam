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

// Handle CORS - Allow all origins for development
app.use(cors({
  origin: true, // Allow all origins
  credentials: true,
  optionsSuccessStatus: 200
}));

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

// Start scheduled jobs
scheduleJobs();

module.exports = app;