const mongoose = require('mongoose');
const Subject = require('./models/Subject');
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

const subjectsData = [
  // Common subjects for all streams
  {
    code: "ENG",
    name: "English",
    stream: "Both",
    category: "Common",
    grades: [9, 10, 11, 12],
    isEntranceSubject: true,
    entranceGrades: [10, 12],
    order: 1,
    description: "National English curriculum for all streams"
  },
  {
    code: "CIV",
    name: "Civics & Ethical Education",
    stream: "Both",
    category: "Common",
    grades: [9, 10, 11, 12],
    isEntranceSubject: true,
    entranceGrades: [10, 12],
    order: 2,
    description: "Civics and Ethical Education for all grades"
  },
  {
    code: "ITE",
    name: "Information Technology",
    stream: "Both",
    category: "Common",
    grades: [9, 10, 11, 12],
    isEntranceSubject: true,
    entranceGrades: [10, 12],
    order: 3,
    description: "Basic Information Technology skills"
  },
  
  // Natural Science Mathematics (different from Social Science Mathematics)
  {
    code: "MAT_NAT",
    name: "Mathematics",
    stream: "Natural",
    category: "Common",
    grades: [11, 12],
    isEntranceSubject: true,
    entranceGrades: [12],
    order: 4,
    syllabusVersion: "MoE-2023",
    description: "Advanced mathematics for Natural Science students"
  },
  
  // Social Science Mathematics (different from Natural Science Mathematics)
  {
    code: "MAT_SOC",
    name: "Mathematics",
    stream: "Social",
    category: "Common",
    grades: [11, 12],
    isEntranceSubject: true,
    entranceGrades: [12],
    order: 4,
    syllabusVersion: "MoE-2023",
    description: "Applied mathematics for Social Science students"
  },
  
  // Natural Science subjects
  {
    code: "PHY",
    name: "Physics",
    stream: "Natural",
    category: "Natural",
    grades: [9, 10, 11, 12],
    isEntranceSubject: true,
    entranceGrades: [10, 12],
    order: 5,
    description: "Study of matter, energy, and forces"
  },
  {
    code: "CHE",
    name: "Chemistry",
    stream: "Natural",
    category: "Natural",
    grades: [9, 10, 11, 12],
    isEntranceSubject: true,
    entranceGrades: [10, 12],
    order: 6,
    description: "Study of substances and their properties"
  },
  {
    code: "BIO",
    name: "Biology",
    stream: "Natural",
    category: "Natural",
    grades: [9, 10, 11, 12],
    isEntranceSubject: true,
    entranceGrades: [10, 12],
    order: 7,
    description: "Study of living organisms"
  },
  
  // Social Science subjects
  {
    code: "GEO",
    name: "Geography",
    stream: "Social",
    category: "Social",
    grades: [9, 10, 11, 12],
    isEntranceSubject: true,
    entranceGrades: [10, 12],
    order: 8,
    description: "Study of Earth's landscapes and environments"
  },
  {
    code: "HIS",
    name: "History",
    stream: "Social",
    category: "Social",
    grades: [9, 10, 11, 12],
    isEntranceSubject: true,
    entranceGrades: [10, 12],
    order: 9,
    description: "Study of past events and civilizations"
  },
  {
    code: "ECO",
    name: "Economics",
    stream: "Social",
    category: "Social",
    grades: [11, 12],
    isEntranceSubject: true,
    entranceGrades: [12],
    order: 10,
    description: "Study of production, distribution, and consumption"
  }
];

const seedSubjects = async () => {
  try {
    await connectDB();
    
    // Clear existing subjects
    console.log('Deleting existing subjects...');
    await Subject.deleteMany();
    
    // Insert new subjects
    console.log('Inserting new subjects...');
    await Subject.insertMany(subjectsData);
    
    console.log('Subjects seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedSubjects();