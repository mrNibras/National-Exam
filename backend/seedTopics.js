const mongoose = require('mongoose');
const Topic = require('./models/Topic');
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

const topicsData = [
  // Natural Science Mathematics Topics
  {
    subjectCode: "MAT_NAT",
    subjectName: "Mathematics",
    grade: 12,
    stream: "Natural",
    topics: [
      "Limits and Continuity",
      "Derivatives",
      "Applications of Derivatives",
      "Integrals",
      "Applications of Integrals",
      "Vectors",
      "Three Dimensional Geometry",
      "Linear Programming",
      "Probability"
    ],
    description: "Advanced mathematics topics for Natural Science students"
  },
  
  // Social Science Mathematics Topics
  {
    subjectCode: "MAT_SOC",
    subjectName: "Mathematics",
    grade: 12,
    stream: "Social",
    topics: [
      "Statistics",
      "Linear Programming",
      "Financial Mathematics",
      "Probability",
      "Graphs and Functions",
      "Matrices and Determinants"
    ],
    description: "Applied mathematics topics for Social Science students"
  },
  
  // Physics Topics
  {
    subjectCode: "PHY",
    subjectName: "Physics",
    grade: 12,
    stream: "Natural",
    topics: [
      "Mechanics",
      "Thermodynamics",
      "Waves and Oscillations",
      "Electricity and Magnetism",
      "Optics",
      "Modern Physics"
    ],
    description: "Physics topics for Natural Science students"
  },
  
  // Chemistry Topics
  {
    subjectCode: "CHE",
    subjectName: "Chemistry",
    grade: 12,
    stream: "Natural",
    topics: [
      "Atomic Structure",
      "Chemical Bonding",
      "States of Matter",
      "Chemical Thermodynamics",
      "Chemical Kinetics",
      "Equilibrium",
      "Redox Reactions",
      "Organic Chemistry Basics"
    ],
    description: "Chemistry topics for Natural Science students"
  },
  
  // Biology Topics
  {
    subjectCode: "BIO",
    subjectName: "Biology",
    grade: 12,
    stream: "Natural",
    topics: [
      "Cell Biology",
      "Genetics",
      "Evolution",
      "Ecology",
      "Human Physiology",
      "Plant Physiology"
    ],
    description: "Biology topics for Natural Science students"
  },
  
  // Geography Topics
  {
    subjectCode: "GEO",
    subjectName: "Geography",
    grade: 12,
    stream: "Social",
    topics: [
      "Physical Geography",
      "Human Geography",
      "Economic Geography",
      "Environmental Geography",
      "Geographic Information Systems"
    ],
    description: "Geography topics for Social Science students"
  },
  
  // History Topics
  {
    subjectCode: "HIS",
    subjectName: "History",
    grade: 12,
    stream: "Social",
    topics: [
      "Ancient Civilizations",
      "Medieval History",
      "Modern World History",
      "Ethiopian History",
      "Contemporary History"
    ],
    description: "History topics for Social Science students"
  },
  
  // Economics Topics
  {
    subjectCode: "ECO",
    subjectName: "Economics",
    grade: 12,
    stream: "Social",
    topics: [
      "Basic Economic Concepts",
      "Supply and Demand",
      "Market Structures",
      "National Income Accounting",
      "Money and Banking",
      "International Trade"
    ],
    description: "Economics topics for Social Science students"
  },
  
  // English Topics
  {
    subjectCode: "ENG",
    subjectName: "English",
    grade: 12,
    stream: "Both",
    topics: [
      "Grammar and Syntax",
      "Reading Comprehension",
      "Writing Skills",
      "Literature Analysis",
      "Communication Skills"
    ],
    description: "English topics for all students"
  }
];

const seedTopics = async () => {
  try {
    await connectDB();
    
    // Clear existing topics
    console.log('Deleting existing topics...');
    await Topic.deleteMany();
    
    // Insert new topics
    console.log('Inserting new topics...');
    await Topic.insertMany(topicsData);
    
    console.log('Topics seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedTopics();