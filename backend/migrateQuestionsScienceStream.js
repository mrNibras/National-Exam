const connectDB = require('./db');
const Question = require('./Question');

const migrateQuestions = async () => {
  try {
    await connectDB();
    
    console.log('Starting migration: Setting default science stream for existing questions...');
    
    // Update all questions that don't have a scienceStream value to 'Natural Science'
    const result = await Question.updateMany(
      { scienceStream: { $exists: false } },
      { $set: { scienceStream: 'Natural Science' } }
    );
    
    console.log(`Migration completed: ${result.modifiedCount} questions updated`);
    
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

migrateQuestions();