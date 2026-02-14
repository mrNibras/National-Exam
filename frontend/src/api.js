import { toast } from "sonner";

// Determine the API base URL based on environment
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Helper function to create API endpoints
const createApiUrl = (endpoint) => {
  if (endpoint.startsWith('/')) {
    endpoint = endpoint.substring(1); // Remove leading slash
  }
  return `${API_BASE_URL}/api/${endpoint}`;
};

// API functions for registration
const registerStudent = async (studentData) => {
  try {
    const response = await fetch(createApiUrl('users/register'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(studentData)
    });

    const responseBody = await response.text(); // Get response as text first

    if (!response.ok) {
      // Try to parse as JSON, fallback to plain text if it's not JSON
      try {
        const errorData = JSON.parse(responseBody);
        throw new Error(errorData.msg || 'Registration failed');
      } catch (e) {
        // If parsing fails, throw the raw response
        throw new Error(responseBody || `HTTP error! status: ${response.status}`);
      }
    }

    // Parse successful response as JSON
    const data = JSON.parse(responseBody);
    return { success: true, token: data.token, message: 'Student registered successfully!' };
  } catch (error) {
    console.error('Registration error:', error);
    return { success: false, message: error.message };
  }
};

const registerTeacher = async (teacherData) => {
  try {
    const response = await fetch(createApiUrl('users/register'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(teacherData)
    });

    const responseBody = await response.text(); // Get response as text first

    if (!response.ok) {
      // Try to parse as JSON, fallback to plain text if it's not JSON
      try {
        const errorData = JSON.parse(responseBody);
        throw new Error(errorData.msg || 'Registration failed');
      } catch (e) {
        // If parsing fails, throw the raw response
        throw new Error(responseBody || `HTTP error! status: ${response.status}`);
      }
    }

    // Parse successful response as JSON
    const data = JSON.parse(responseBody);
    return { success: true, token: data.token, message: 'Teacher registered successfully!' };
  } catch (error) {
    console.error('Registration error:', error);
    return { success: false, message: error.message };
  }
};

// Generic API function for making requests
const makeApiRequest = async (endpoint, options = {}) => {
  try {
    const url = createApiUrl(endpoint);
    const defaultHeaders = { 'Content-Type': 'application/json' };
    
    // Include authorization header if token exists
    const token = localStorage.getItem('token');
    if (token) {
      defaultHeaders['Authorization'] = `Bearer ${token}`;
    }
    
    const config = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers
      }
    };

    const response = await fetch(url, config);

    // Get response as text first to handle both JSON and non-JSON responses
    const responseBody = await response.text();

    let data;
    try {
      // Attempt to parse as JSON
      data = responseBody ? JSON.parse(responseBody) : {};
    } catch (e) {
      // If parsing fails, return the raw response
      data = { rawResponse: responseBody };
    }

    if (!response.ok) {
      const error = new Error(data.msg || data.message || `HTTP error! status: ${response.status}`);
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return { success: true, data };
  } catch (error) {
    console.error('API request error:', error);
    return { 
      success: false, 
      error: error.message, 
      status: error.status,
      data: error.data 
    };
  }
};

// Login function
const login = async (email, password) => {
  return makeApiRequest('auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });
};

// Function to get user profile
const getUserProfile = async () => {
  return makeApiRequest('users/profile');
};

// Function to get questions
const getQuestions = async (params = {}) => {
  const queryParams = new URLSearchParams(params).toString();
  const endpoint = queryParams ? `questions?${queryParams}` : 'questions';
  return makeApiRequest(endpoint);
};

// Function to create a question
const createQuestion = async (questionData) => {
  return makeApiRequest('questions', {
    method: 'POST',
    body: JSON.stringify(questionData)
  });
};

// Function to get classes
const getClasses = async () => {
  return makeApiRequest('classes');
};

// Function to get students in a class
const getClassStudents = async (classId) => {
  return makeApiRequest(`classes/${classId}`);
};

// Function to add student to class
const addStudentToClass = async (classId, studentId) => {
  return makeApiRequest(`classes/${classId}/add-student`, {
    method: 'PUT',
    body: JSON.stringify({ studentId })
  });
};

// Function to remove student from class
const removeStudentFromClass = async (classId, studentId) => {
  return makeApiRequest(`classes/${classId}/remove-student`, {
    method: 'PUT',
    body: JSON.stringify({ studentId })
  });
};

// Function to get class analytics
const getClassAnalytics = async (classId) => {
  return makeApiRequest(`analytics/class-performance?classId=${classId}`);
};

// Function to get all users
const getUsers = async (role = null) => {
  const endpoint = role ? `users?role=${role}` : 'users';
  return makeApiRequest(endpoint);
};

export { 
  registerStudent, 
  registerTeacher,
  login,
  getUserProfile,
  getQuestions,
  createQuestion,
  getClasses,
  getClassStudents,
  addStudentToClass,
  removeStudentFromClass,
  getClassAnalytics,
  getUsers
};