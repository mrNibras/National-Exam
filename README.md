# National Exam Preparation System

A comprehensive platform for Ethiopian students to prepare for national examinations with adaptive learning technology and teacher management features.

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Installation](#installation)
- [Usage](#usage)
- [Teacher Functionality](#teacher-functionality)
- [API Documentation](#api-documentation)
- [Frontend Documentation](#frontend-documentation)
- [Backend Documentation](#backend-documentation)
- [Technologies Used](#technologies-used)
- [Contributing](#contributing)
- [License](#license)

## Overview

The National Exam Preparation System is designed to help Ethiopian students prepare for their national examinations through personalized practice tests, adaptive learning algorithms, and comprehensive analytics. The system includes features for students, teachers, and administrators to facilitate effective exam preparation.

## Features

### Student Features
- User registration and authentication
- Practice tests with adaptive difficulty
- Personalized study plans based on weak areas
- Performance analytics and progress tracking
- Leaderboards to encourage healthy competition

### Teacher Features
- Create and manage educational content (questions)
- Create and manage classes
- Add/remove students from classes
- Monitor student performance through analytics
- Generate reports on class progress
- Create assignments and learning materials

### Administrative Features
- User management
- School administration
- System-wide analytics
- Question difficulty adjustment

## Architecture

### Frontend
- React with Vite
- Tailwind CSS for styling
- React Router for navigation
- shadcn/ui components
- Responsive design for all devices

### Backend
- Node.js with Express
- MongoDB with Mongoose ODM
- JWT-based authentication
- RESTful API design
- Role-based authorization

### Models
- **User**: Student, Teacher, School Admin, Regional Admin roles
- **Question**: Educational content with metadata
- **TestAttempt**: Student performance tracking
- **Class**: Teacher-managed groups of students
- **School**: Educational institution management
- **AuditLog**: System activity tracking

## Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB
- npm or yarn

### Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/national-exam.git
cd national-exam
```

2. Install dependencies:
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

3. Set up environment variables:
Create `.env` files in both backend and frontend directories with appropriate configurations.

4. Start the applications:
```bash
# Backend
cd backend
npm start

# Frontend
cd frontend
npm run dev
```

## Usage

### For Students
1. Register as a student
2. Select your grade and science stream (for grades 11-12)
3. Take practice tests to improve your abilities
4. Review your study plan for focused improvement
5. Track your progress on the dashboard

### For Teachers
1. Register as a teacher
2. Create classes and add students
3. Create questions for your subjects
4. Monitor student performance through analytics
5. Adjust teaching strategies based on data insights

## Teacher Functionality

Teachers have access to a comprehensive suite of tools to manage their educational activities:

### Question Management
- Create new questions with detailed metadata (subject, grade, topic, competency)
- Edit existing questions
- Delete questions as needed
- Filter and search through question banks

### Class Management
- Create new classes with specific subjects and grades
- Add students to classes
- Remove students from classes
- View class rosters and student information

### Analytics Dashboard
- View class performance metrics
- Track individual student progress
- Identify common weaknesses across classes
- Generate reports for administrative purposes

### Content Creation
- Develop subject-specific questions
- Set difficulty levels and competencies
- Provide explanations for correct answers
- Organize content by topic and grade level

## API Documentation

### Authentication
- `POST /api/users/register` - Register a new user
- `POST /api/auth/login` - Authenticate user login
- `PUT /api/users/update-phone` - Update phone number with verification

### Questions
- `GET /api/questions` - Retrieve questions with filtering
- `POST /api/questions` - Create a new question (Teacher only)
- `GET /api/questions/:id` - Get a specific question
- `PUT /api/questions/:id` - Update a question (Creator or Admin)
- `DELETE /api/questions/:id` - Delete a question (Creator or Admin)

### Classes
- `GET /api/classes` - Retrieve classes (scoped by user role)
- `POST /api/classes` - Create a new class (Teacher only)
- `GET /api/classes/:id` - Get a specific class
- `PUT /api/classes/:id` - Update a class (Owner or Admin)
- `DELETE /api/classes/:id` - Delete a class (Owner or Admin)
- `PUT /api/classes/:id/add-student` - Add student to class
- `PUT /api/classes/:id/remove-student` - Remove student from class

### Analytics
- `GET /api/analytics/class-performance` - Get class performance data
- `GET /api/analytics/student-performance/:studentId` - Get specific student analytics
- `GET /api/analytics/study-plan` - Get student's study plan analysis

## Frontend Documentation

### Overview
The frontend provides a responsive user interface for students, teachers, and administrators to interact with the exam preparation platform. It features a modern UI with role-based access to different functionalities.

### Tech Stack
- React 18
- Vite (build tool)
- Tailwind CSS (styling)
- React Router (navigation)
- shadcn/ui (component library)
- Lucide React (icons)
- TanStack Query (state management)

### Project Structure
```
src/
├── components/     # Reusable UI components
├── pages/         # Page components
├── hooks/         # Custom React hooks
├── lib/           # Utility functions and libraries
├── assets/        # Static assets (images, fonts, etc.)
├── api.js         # API utility functions
└── App.jsx        # Main application component
```

### Components
- **DashboardLayout**: Consistent layout for authenticated users
- **StatCard**: Display key metrics in dashboard views
- **Navbar**: Navigation bar with role-based options

### Pages
- **Landing**: Homepage for unauthenticated users
- **Login/Register**: Authentication flows
- **Dashboard**: Student dashboard
- **TeacherDashboard**: Teacher-specific dashboard
- **Practice**: Practice test interface
- **StudyPlan**: Personalized study recommendations
- **Leaderboard**: Performance rankings
- **Teacher-specific pages** for question/class management

### API Integration
The frontend communicates with the backend API through the functions defined in `api.js`. All API calls include proper authentication headers when required.

### Styling
The application uses Tailwind CSS for styling with a consistent design system. Component styling follows the design system established in the shadcn/ui library.

### Environment Variables
- `VITE_API_URL`: Base URL for the backend API

## Backend Documentation

### Overview
The backend provides a RESTful API for the National Exam Preparation System, handling user authentication, question management, class management, and analytics.

### Tech Stack
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- Bcrypt
- Express Validator

### Models
- **User**: Student, Teacher, School Admin, Regional Admin roles
- **Question**: Educational content with metadata
- **TestAttempt**: Student performance tracking
- **Class**: Teacher-managed groups of students
- **School**: Educational institution management
- **AuditLog**: System activity tracking

### Controllers
- **authController**: Handle user authentication
- **userController**: Manage user operations
- **questionController**: Handle question management
- **classController**: Manage class operations
- **analyticsController**: Provide analytics data
- **testController**: Handle test operations

### Middleware
- **authMiddleware**: Verify JWT tokens
- **authorize**: Check user roles for specific operations

### Environment Variables
- `JWT_SECRET`: Secret for JWT signing
- `MONGODB_URI`: Connection string for MongoDB
- `PORT`: Port for the server to listen on

## Technologies Used

### Frontend
- React 18
- Vite
- Tailwind CSS
- React Router
- shadcn/ui
- Lucide React (icons)
- TanStack Query

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- Bcrypt
- Express Validator

### Development Tools
- ESLint
- Vitest
- Husky (for git hooks)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please contact [your-email@example.com] or open an issue in the repository.