const connectDB = require('./db');
const User = require('./User');

const migrateUsers = async () => {
  try {
    await connectDB();
    
    console.log('Starting migration: Setting default science stream for existing student users...');
    
    // Update all student users that don't have a scienceStream value to 'Natural Science'
    const result = await User.updateMany(
      { role: 'Student', scienceStream: { $exists: false } },
      { $set: { scienceStream: 'Natural Science' } }
    );
    
    console.log(`Migration completed: ${result.modifiedCount} student users updated`);
    
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

migrateUsers();