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

export { registerStudent, registerTeacher };