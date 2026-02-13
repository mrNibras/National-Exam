// Main application entry point
const app = require('./server');

// Use Render's PORT environment variable or default to 5000
const PORT = process.env.PORT || 5000;

// Only start the server if this file is run directly (not imported)
if (require.main === module) {
  app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
}

module.exports = app;