# National Exam Preparation & Performance Analytics Platform

**Version:** 2.0 (Updated As-Built)

## 1. Introduction

### 1.1 Purpose

This Software Requirements Specification (SRS) defines the functional and non-functional requirements for the National Exam Preparation & Performance Analytics Platform. The system is designed to support Ethiopian students preparing for Grades 9-12 and University Examinations through data-driven assessment, adaptive learning, and performance analytics.

This document serves as a reference for developers, educators, school administrators, stakeholders, and future maintainers.

### 1.2 Scope

The platform provides a national-scale, multi-tenant digital exam preparation system that continuously evaluates student performance, identifies competency gaps, and recommends personalized study plans. It supports students, teachers, schools, and education authorities, while operating effectively in low-bandwidth and offline-prone environments common in Ethiopia.

The system includes:

- Practice tests and adaptive exam simulations
- Performance analytics and personalized study plans
- Teacher and school administration dashboards
- Offline-first (PWA) and SMS-supported features
- Secure, role-based multi-tenancy for data isolation by school
- Teacher question creation with grade-based filtering
- Role-based registration (Student/Teacher)

### 1.3 Definitions, Acronyms, and Abbreviations

- **RBAC**: Role-Based Access Control
- **PWA**: Progressive Web Application
- **JWT**: JSON Web Token
- **Elo Rating**: A method for calculating the relative skill levels of players in competitor-versus-competitor games. Used here to model student ability and question difficulty.

### 1.4 References

- IEEE 830 / ISO/IEC/IEEE 29148 Software Requirements Standard
- Ethiopian National Curriculum Framework
- Ministry of Education assessment guidelines

---

## 2. Overall Description

### 2.1 Product Perspective

The system is a web-based, multi-tenant educational platform deployed centrally and accessed by schools nationwide. It integrates assessment delivery, analytics processing, and reporting modules within a modular service architecture. The frontend is a Progressive Web App (PWA) ensuring a high degree of offline functionality.

### 2.2 Product Functions

- Student exam practice and performance tracking
- Question bank and curriculum management
- Adaptive testing using a numerical Elo-based rating system
- Performance analytics and dashboards for all user roles
- Personalized study plan generation
- Multi-tenant school and user administration via a secure invitation system
- Automated SMS notifications for reminders and alerts
- Teacher question creation with grade-based filtering
- Role-based registration system (Student/Teacher)

### 2.3 User Classes and Characteristics

| User Class         | Description                                                                                                 |
| :----------------- | :---------------------------------------------------------------------------------------------------------- |
| **Student**        | Learners preparing for national exams. Can take tests, view results, and receive personalized study plans.  |
| **Teacher**        | Creates questions for specific grade levels, monitors and supports student progress, views class-level analytics. |
| **School Admin**   | Oversees school-level performance. Manages users and teachers within their school via an invitation system. |
| **Regional Admin** | (Future Scope) Analyzes regional trends.                                                                    |
| **System Admin**   | Manages platform configuration, including creating schools and overseeing the entire system.                |

### 2.4 Operating Environment

- Modern web browsers (desktop & mobile)
- PWA-capable devices for offline access
- Intermittent internet connectivity
- Cloud-hosted backend services (Node.js/Express on a scalable platform)
- MongoDB database

### 2.5 Design and Implementation Constraints

- Must function under low-bandwidth conditions.
- Must support offline test-taking with background synchronization.
- Must align with national curriculum structures.
- Data privacy and exam integrity must be enforced through multi-tenancy.

### 2.6 Assumptions and Dependencies

- System Admins provide accurate school creation data.
- School Admins manage user roles within their school.
- Users have access to at least a basic smartphone or computer.
- A third-party service (Twilio) is used for SMS notifications.

---

## 3. System Features and Functional Requirements

### 3.1 Student Learning & Practice Module

- **FR-1**: The system shall provide subject-wise and topic-specific practice tests.
- **FR-2**: The system shall support adaptive mock examinations that adjust difficulty based on performance.
- **FR-3**: The system shall allow topic-based quizzes, especially for areas of weakness.
- **FR-4**: The system shall provide instant feedback, including score and correct answers, after each test attempt.
- **FR-5**: The system shall calculate and display a user's `abilityScore`.

### 3.2 Question Bank & Curriculum Mapping

- **FR-6**: The system shall store questions mapped to grade, subject, and topic.
- **FR-7**: The system shall tag questions with a numerical `difficultyRating`.
- **FR-8**: The system shall support multiple question formats (initially MCQ).
- **FR-9**: The system shall scope questions to the school of the creator, with System Admins having global access.

### 3.3 Question Difficulty Modeling

- **FR-10**: The system shall compute question difficulty using success rate, time spent, and the ability score of the students attempting it.
- **FR-11**: The system shall automatically re-calculate a question's `difficultyRating` after each valid test submission using an Elo-based algorithm.

### 3.4 Adaptive Testing Engine

- **FR-12**: The system shall select the next question in a test based on the student's current `abilityScore` and their performance on the previous question.
- **FR-13**: The system shall adjust the student's `abilityScore` after each test submission based on their performance against the difficulty of the questions.
- **FR-14**: The system shall personalize test length (initially fixed, with logic to support dynamic length).

### 3.5 Performance Analytics & Dashboards

- **FR-15**: The system shall display strength and weakness maps for students in their "My Study Plan" page.
- **FR-16**: The system shall provide class-level analytics for teachers, scoped to their school.
- **FR-17**: The system shall generate a school-wide leaderboard to foster healthy competition.

### 3.6 Personalized Study Plan & Notifications

- **FR-18**: The system shall identify a student's top weaknesses based on historical performance.
- **FR-19**: The system shall provide direct links from a weakness topic to a targeted practice quiz.
- **FR-20**: The system shall send automated, personalized study reminders via SMS to students with verified phone numbers.

### 3.7 Administration & Multi-Tenancy

- **FR-21**: Teachers shall create, update, and delete questions for their school.
- **FR-22**: System Admins shall create and manage schools.
- **FR-23**: School Admins shall invite Teachers and other School Admins to their school using a secure, token-based invitation system.

### 3.8 Offline-First & Low-Bandwidth Support

- **FR-24**: The system shall support offline practice mode by caching questions using a Service Worker.
- **FR-25**: The system shall synchronize offline test attempts to the server using the Background Sync API when connectivity is restored.
- **FR-26**: The system shall provide a clear visual indicator to the user when the application is in offline mode.

### 3.9 User Account Management

- **FR-27**: Users shall be able to add and verify their phone number via an SMS code.
- **FR-28**: Logged-out users shall be able to reset their password via a secure, token-based link sent to their email.
- **FR-29**: Logged-in users shall be able to change their password from their profile page by providing their current password.

### 3.10 Role-Based Registration System

- **FR-33**: The system shall allow users to select their role (Student or Teacher) during registration.
- **FR-34**: Student registration shall require email, password, grade level, and academic stream.
- **FR-35**: Teacher registration shall require email, password, school name, school location, subjects taught, teaching experience, and a personal description.
- **FR-36**: The system shall validate role-specific information during registration.
- **FR-37**: The system shall store role-specific information in the user profile.

### 3.11 Grade-Based Question Filtering

- **FR-38**: The system shall filter questions for students based on their grade level and below.
- **FR-39**: Grade 9 students shall access only Grade 9 questions.
- **FR-40**: Grade 10 students shall access Grade 9 and Grade 10 questions.
- **FR-41**: Grade 11 students shall access Grade 9, 10, and Grade 11 questions.
- **FR-42**: Grade 12 students shall access all grade questions (9-12).
- **FR-43**: Teachers shall be able to create questions for specific grade levels (9-12).
- **FR-44**: Questions created for a grade level shall be accessible by all higher grade levels.

### 3.12 Teacher Question Management

- **FR-45**: Teachers shall have access to a dedicated dashboard for question creation.
- **FR-46**: Teachers shall be able to create questions with subject, grade level, topic, and competency information.
- **FR-47**: Teachers shall be able to edit and delete questions they have created.
- **FR-48**: The system shall associate created questions with the teacher's school.

### 3.13 Exam-Wise Analytics

- **FR-49**: The system shall provide exam-wise analytics for students and teachers.
- **FR-50**: The system shall display overall performance by exam with visual charts.
- **FR-51**: The system shall show subject-wise breakdown of performance.
- **FR-52**: The system shall present grade distribution of exam results.
- **FR-53**: The system shall show performance trends over time.
- **FR-54**: The system shall provide summary statistics (total exams, average score, highest score, pass rate).
- **FR-55**: The system shall allow filtering analytics by time range (last 7 days, 30 days, 90 days, all time).
- **FR-56**: The system shall provide detailed exam results in tabular format.

---

## 4. Role-Based Access Control (RBAC)

### 4.1 Roles

- **Student**: Access to practice tests, personal history, study plan, and leaderboard.
- **Teacher**: Student permissions + question management, class analytics for their school, and teacher dashboard.
- **School Admin**: Teacher permissions + user invitation for their school.
- **System Admin**: Full access to all data and administrative functions, including school creation.

### 4.2 Security Controls

- **FR-30**: The system shall enforce role-based access restrictions on all relevant API endpoints.
- **FR-31**: The system shall isolate all user, question, and analytics data by `schoolId`.
- **FR-32**: The system shall maintain audit logs for sensitive actions (e.g., result changes, user role changes). (Future Scope)

---

## 5. Additional Advanced Features

### 5.1 National Performance Benchmarking

- (Future Scope) Anonymous national averages and regional comparisons.

### 5.2 Exam Simulation Mode

- (Partially Implemented) The adaptive engine serves as the foundation for this.

### 5.3 Learning Content Recommendation

- (Future Scope) Link weak competencies to external or uploaded learning materials.

### 5.4 Parental Monitoring

- (Implemented) The system shall automatically generate and send weekly progress summaries to a linked parent's email address.

### 5.5 Integrity & Anti-Cheating Measures

- (Partially Implemented) Question randomization is inherent in the adaptive engine.

---

## 6. Non-Functional Requirements

- **Performance**: The system shall support thousands of concurrent users. API response times for critical paths should be under 500ms.
- **Security**: All data shall be encrypted in transit (HTTPS). Passwords and other sensitive data shall be hashed/encrypted at rest.
- **Scalability**: The architecture shall support national-level deployment through its modular and multi-tenant design.
- **Localization**: (Future Scope) The system shall be designed to support Amharic and additional local languages.
- **Availability**: The system shall maintain at least 99% uptime.
- **Usability**: The system shall provide intuitive interfaces for both students and teachers with clear role-based navigation.
- **Maintainability**: The system shall be designed with modularity to allow easy updates and feature additions.
- **Compatibility**: The system shall work across different browsers and devices, with particular attention to mobile experiences.

---

## 7. System Architecture Overview

### 7.1 High-Level Architecture Diagram (As-Built)

```
┌──────────────────────────────┐
│      Client (PWA/React)      │
│                              │
│  - UI Components (Pages)     │
│  - AuthContext (State Mgmt)  │
│  - React Router (Navigation) │
│  - Axios Interceptor (API)   │
│  - Service Worker (Offline)  │
│  - IndexedDB (Offline Data)  │
└───────────────┬──────────────┘
                │
                │ HTTPS/REST API
                ▼
┌──────────────────────────────┐
│      Backend (Node/Express)    │
│ ┌──────────────────────────┐ │
│ │       API Gateway        │ │
│ │ (Routing & Auth Middleware)│ │
│ └─────────────┬────────────┘ │
│               │              │
│   ┌───────────┴───────────┐  │
│   │      Controllers      │  │
│   └───────────┬───────────┘  │
│               │              │
│   ┌───────────┴───────────┐  │
│   │        Services       │  │
│   │ - Analytics Service   │  │
│   │ - Notification Service│  │
│   └───────────┬───────────┘  │
└───────────────│──────────────┘
                │
                │ Mongoose ODM
                ▼
┌──────────────────────────────┐
│       Data Layer (MongoDB)     │
│                              │
│  - Users (w/ abilityScore)   │
│  - Schools (Tenants)         │
│  - Questions (w/ diffRating) │
│  - TestAttempts              │
│  - Invitations               │
└──────────────────────────────┘

┌──────────────────────────────┐
│    Background Jobs (node-cron) │
│                              │
│  - Daily Study Reminders     │
│  - Weekly Parental Reports   │
└──────────────────────────────┘
```

### 7.2 Analytics & Adaptive Engine Flow

1.  **Test Submission**: A `TestAttempt` is saved with detailed answer and timing data.
2.  **Elo Calculation**: On submission, the backend calculates the expected outcome of each question based on the user's `abilityScore` and the question's `difficultyRating`.
3.  **Score Update**: The user's `abilityScore` and the `difficultyRating` of each question are adjusted based on the actual outcome.
4.  **Weakness Analysis**: A scheduled job or on-demand service (`analyticsService`) aggregates `TestAttempt` data to find topics with the highest number of incorrect answers for a given student.
5.  **Adaptive Selection**: During a new test, the `getNextQuestion` endpoint uses the student's current `abilityScore` to find a question with a closely matched `difficultyRating`, ensuring the test is challenging but not overwhelming.

### 7.3 Offline-First & Sync Architecture

1.  **App Shell Caching**: The service worker precaches all static assets (JS, CSS, HTML), allowing the app to load instantly, even offline.
2.  **API Data Caching**: API requests to `/api/tests/` are cached using a "Stale-While-Revalidate" strategy, making practice tests available offline.
3.  **Offline Submission**: If a user submits a test while offline (`navigator.onLine` is false), the `TestAttempt` payload is saved to IndexedDB.
4.  **Background Sync**: A `sync` event (`sync-offline-submissions`) is registered. When the browser detects network connectivity, it triggers the service worker.
5.  **Sync Execution**: The service worker reads the saved attempt from IndexedDB, sends it to the server's `/api/tests/submit` endpoint, and deletes the local record on success.

### 7.4 Role-Based Registration & Grade Filtering

1.  **Role Selection**: During registration, users select their role (Student or Teacher).
2.  **Form Adaptation**: The registration form dynamically shows fields appropriate for the selected role.
3.  **Grade Filtering**: When students take tests, the system filters questions based on their grade level and all grades below.
4.  **Teacher Question Creation**: Teachers can create questions for specific grade levels, which become accessible to appropriate student grade levels.

---

## 8. Future Enhancement

- AI tutor chatbot
- Voice-based learning support
- Integration with national student ID systems
- Teacher professional development analytics
- Gamification badges and achievements

---

## 9. Approval

This SRS establishes the as-built requirements for the National Exam Preparation & Performance Analytics Platform and serves as the definitive guide for future development and maintenance.

<!--
[PROMPT_SUGGESTION]How can I deploy this MERN stack application to production?[/PROMPT_SUGGESTION]
[PROMPT_SUGGESTION]Let's add a dark mode theme to the application.[/PROMPT_SUGGESTION]
```