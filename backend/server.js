require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./db');
const { scheduleJobs } = require('./reminderJobs');

const app = express();

// Connect to Database
connectDB();

// Handle CORS
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    // Define allowed origins
    const allowedOrigins = [
      'http://localhost:3000',                    // Local frontend
      'https://national-exam-frontend.vercel.app', // Production frontend on Vercel
      process.env.FRONTEND_URL                     // Custom domain if set
    ];

    // Check if origin is in the allowed list or is a vercel.app subdomain
    const isAllowedOrigin = allowedOrigins.includes(origin) ||
                           (origin && origin.endsWith('.vercel.app'));

    if (isAllowedOrigin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};
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

// Start scheduled jobs
scheduleJobs();

module.exports = app;