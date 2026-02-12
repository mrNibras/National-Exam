# System Design: National Exam Preparation & Performance Analytics Platform

This document outlines the high-level architecture and design principles of the National Exam Preparation & Performance Analytics Platform, as implemented.

## 1. Guiding Principles

- **Modular & Service-Oriented**: The backend is structured into distinct services (Auth, Exam, Analytics, etc.) to promote separation of concerns and scalability.
- **Offline-First**: The frontend is designed as a Progressive Web App (PWA) to ensure functionality in low-bandwidth and offline environments, a critical requirement for the target user base.
- **Data-Driven**: Core learning loops are driven by performance data, enabling features like adaptive testing and personalized study plans.
- **Secure & Role-Based**: Access to data and features is strictly controlled through a Role-Based Access Control (RBAC) system enforced by backend middleware.

## 2. Technology Stack

- **Frontend**:

  - **Framework**: React
  - **Styling**: Plain CSS (with a structure ready for Tailwind CSS or other utility-first frameworks)
  - **State Management**: React Context API (for global auth state)
  - **Routing**: React Router
  - **API Communication**: Axios
  - **Offline Storage**: IndexedDB (via `idb` library)
  - **PWA**: Service Workers (via Workbox) for caching and background sync.

- **Backend**:

  - **Framework**: Node.js with Express.js
  - **Authentication**: JSON Web Tokens (JWT)
  - **Password Hashing**: bcrypt.js
  - **Notifications**: Twilio for SMS

- **Database**:
  - **Type**: MongoDB (NoSQL)
  - **ODM**: Mongoose for data modeling and validation

## 3. High-Level Architecture

The system follows a classic client-server architecture with a RESTful API.

```
┌──────────────────┐      ┌──────────────────┐
│   Frontend PWA   │      │      Backend     │
│     (React)      │◀─────▶│ (Node.js/Express)│
└──────────────────┘      └──────────────────┘
        │ ▲                       │
        │ │ (Offline Sync)        │
        ▼ │                       ▼
┌──────────────────┐      ┌──────────────────┐
│ IndexedDB (Client) │      │  MongoDB (Server)  │
└──────────────────┘      └──────────────────┘
```

### Key Flows:

1.  **Authentication**:

    - User registers/logs in via the frontend.
    - Backend validates credentials, hashes the password, and returns a JWT.
    - Frontend stores the JWT in `localStorage`.
    - The Axios interceptor automatically attaches the JWT to the `x-auth-token` header of all subsequent API requests.
    - Backend `authMiddleware` validates the token on protected routes.

2.  **Registration Process**:

    - Student registers via the frontend, providing name, email, password, and selecting their science stream (Natural Science or Social Science).
    - Backend validates credentials, hashes the password, and creates a user with the selected science stream.
    - Backend returns a JWT for authentication.

3.  **Adaptive Testing**:

    - Student requests to start a test.
    - Backend retrieves the user's science stream and filters questions accordingly.
    - Backend provides an initial, medium-difficulty question from the user's science stream.
    - Student submits an answer. Frontend checks correctness against the backend and requests the next question, indicating if the previous answer was correct.
    - Backend `getNextQuestion` endpoint uses the user's `abilityScore`, science stream, and the correctness of the last answer to select a new question with a suitable `difficultyRating` from the appropriate science stream.
    - This loop continues until the test length is met.
    - Upon submission, the backend `submitTest` endpoint recalculates and updates the `abilityScore` for the user and the `difficultyRating` for each question using an Elo-based algorithm.

4.  **Offline Test Submission**:
    - The frontend checks `navigator.onLine` before submitting a test.
    - If offline, the test attempt payload is saved to IndexedDB.
    - A `sync` event is registered with the service worker (`sync-offline-submissions`).
    - When connectivity is restored, the browser triggers the service worker's sync event.
    - The service worker reads the attempt from IndexedDB, sends it to the `/api/tests/submit` endpoint, and deletes the local copy upon success.

## 4. Data Models (High-Level)

- **User**:

  - `name`, `email`, `password` (hashed)
  - `role` (enum: Student, Teacher, etc.)
  - `scienceStream` (enum: Natural Science, Social Science) - required for students
  - `abilityScore` (Number, default: 1000)

- **Question**:

  - `questionText`, `subject`, `grade`, `topic`
  - `scienceStream` (enum: Natural Science, Social Science, default: Natural Science)
  - `options` (Array), `correctAnswer`
  - `difficultyRating` (Number, default: 1000)
  - `totalAttempts`, `correctAttempts` (for analytics)

- **TestAttempt**:
  - `user` (Ref to User)
  - `questions` (Array of Refs to Question)
  - `answers` (Map of questionId -> { answer, timeSpent })
  - `score`, `total`

- **Class**:
  - `name`, `grade`, `subject`, `description`
  - `scienceStream` (enum: Natural Science, Social Science)
  - `teacher` (Ref to User), `school` (Ref to School)
  - `students` (Array of Refs to User)

## 5. Security Considerations

- **Authentication**: Handled via JWTs, which are stateless and scalable.
- **Authorization**: A flexible `authorize` middleware allows for granular, role-based protection of API endpoints.
- **Data Integrity**: Password hashing with `bcrypt` prevents plaintext password storage.
- **Secret Management**: Sensitive keys (JWT secret, database URI, Twilio tokens) are stored in a `.env` file and are not committed to version control.

## 6. Future Enhancements & Scalability

- **Multi-Tenancy**: To support data isolation by school (FR-28), a `schoolId` field would need to be added to major models (`User`, `Question`, `TestAttempt`). All database queries would then need to be scoped to the user's school.
- **Caching**: A Redis layer could be introduced to cache frequently accessed data (like user profiles or popular questions) to reduce database load.
- **Background Jobs**: The `recalculate-difficulty` process is resource-intensive. For a large-scale system, this should be moved to a separate worker process or a serverless function triggered on a schedule, rather than being a synchronous API endpoint.
- **Real-time Features**: WebSockets could be used for real-time teacher dashboards or collaborative features.

---

This document provides a snapshot of the current system design. It should be updated as new features and architectural changes are introduced.
