const mongoose = require('mongoose');
const EntranceExam = require('./models/EntranceExam');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const entranceExamsData = [
  // Grade 10 Entrance Exams
  {
    grade: 10,
    stream: "All",
    name: "Grade 10 Entrance Exam",
    description: "Entrance examination for grade 10 students",
    subjects: [
      { code: "ENG", name: "English" },
      { code: "CIV", name: "Civics & Ethical Education" },
      { code: "ITE", name: "Information Technology" }
    ],
    totalQuestions: 60,
    durationMinutes: 120,
    isActive: true
  },
  
  // Grade 12 Natural Science Entrance Exam
  {
    grade: 12,
    stream: "Natural",
    name: "Grade 12 Natural Science Entrance Exam",
    description: "Entrance examination for Natural Science stream students",
    subjects: [
      { code: "ENG", name: "English" },
      { code: "MAT_NAT", name: "Mathematics" },
      { code: "PHY", name: "Physics" },
      { code: "CHE", name: "Chemistry" },
      { code: "BIO", name: "Biology" }
    ],
    totalQuestions: 100,
    durationMinutes: 180,
    isActive: true
  },
  
  // Grade 12 Social Science Entrance Exam
  {
    grade: 12,
    stream: "Social",
    name: "Grade 12 Social Science Entrance Exam",
    description: "Entrance examination for Social Science stream students",
    subjects: [
      { code: "ENG", name: "English" },
      { code: "MAT_SOC", name: "Mathematics" },
      { code: "GEO", name: "Geography" },
      { code: "HIS", name: "History" },
      { code: "ECO", name: "Economics" }
    ],
    totalQuestions: 100,
    durationMinutes: 180,
    isActive: true
  }
];

const seedEntranceExams = async () => {
  try {
    await connectDB();
    
    // Clear existing entrance exams
    console.log('Deleting existing entrance exams...');
    await EntranceExam.deleteMany();
    
    // Insert new entrance exams
    console.log('Inserting new entrance exams...');
    await EntranceExam.insertMany(entranceExamsData);
    
    console.log('Entrance exams seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedEntranceExams();