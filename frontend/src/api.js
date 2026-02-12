import { toast } from "sonner";

// API functions for registration
const registerStudent = async (studentData) => {
  try {
    const response = await fetch('/api/users/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(studentData)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.msg || 'Registration failed');
    }
    
    const data = await response.json();
    return { success: true, token: data.token, message: 'Student registered successfully!' };
  } catch (error) {
    console.error('Registration error:', error);
    return { success: false, message: error.message };
  }
};

const registerTeacher = async (teacherData) => {
  try {
    const response = await fetch('/api/users/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(teacherData)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.msg || 'Registration failed');
    }
    
    const data = await response.json();
    return { success: true, token: data.token, message: 'Teacher registered successfully!' };
  } catch (error) {
    console.error('Registration error:', error);
    return { success: false, message: error.message };
  }
};

export { registerStudent, registerTeacher };