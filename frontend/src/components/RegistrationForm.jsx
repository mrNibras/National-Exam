import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerStudent, registerTeacher } from '../api';

const RegistrationForm = ({ role = 'student' }) => {
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    schoolName: '',
    grade: '',
    stream: '',
    // Teacher-specific fields
    subjects: '',
    experience: ''
  });

  // Options state
  const [schools, setSchools] = useState([]);
  const [filteredSchools, setFilteredSchools] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Initialize component
  useEffect(() => {
    const fetchSchools = async () => {
      try {
        setSchools([]); // Placeholder for now
      } catch (error) {
        console.error('Error fetching schools:', error);
      }
    };

    fetchSchools();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate required fields
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (!formData.schoolName) newErrors.schoolName = 'School is required';

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    // Validate password strength
    if (formData.password && formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    // Validate grade for students
    if (role === 'student' && !formData.grade) {
      newErrors.grade = 'Grade is required';
    }

    // Validate stream for grades 11-12 students
    if (role === 'student' && parseInt(formData.grade) >= 11 && !formData.stream) {
      newErrors.stream = 'Stream is required for grades 11 and 12';
    }

    // Validate teacher-specific fields
    if (role === 'teacher') {
      if (!formData.subjects) newErrors.subjects = 'Subjects taught is required';
      if (!formData.experience) newErrors.experience = 'Teaching experience is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      if (role === 'teacher') {
        // Teacher registration data
        const teacherData = {
          name: formData.fullName,
          email: formData.email,
          password: formData.password,
          role: 'Teacher',
          school: formData.schoolName, // Send the school name as a string
          subjects: formData.subjects.split(',').map(subject => subject.trim()).filter(s => s), // Convert to array and remove empty strings
          experience: formData.experience,
          about: formData.experience ? `Experienced teacher with ${formData.experience} years of experience` : 'Experienced teacher'
        };

        const response = await registerTeacher(teacherData);
        if (response.success) {
          alert('Teacher registration successful!');
          navigate('/teacher/dashboard');
        } else {
          throw new Error(response.message || 'Registration failed');
        }
      } else {
        // Student registration data
        const studentData = {
          name: formData.fullName,
          email: formData.email,
          password: formData.password,
          role: 'Student',
          school: formData.schoolName, // Send the school name as a string
          grade: parseInt(formData.grade),
          scienceStream: parseInt(formData.grade) >= 11 ? formData.stream : undefined
        };

        const response = await registerStudent(studentData);
        if (response.success) {
          alert('Student registration successful!');
          navigate('/dashboard');
        } else {
          throw new Error(response.message || 'Registration failed');
        }
      }
    } catch (error) {
      console.error('Registration error:', error);
      setErrors({ general: error.message || 'An error occurred during registration' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-card text-card-foreground shadow-lg rounded-xl p-6 w-full">
        <h2 className="text-2xl font-bold text-center mb-6">{role === 'teacher' ? 'Teacher Registration' : 'Student Registration'}</h2>
        
        {errors.general && (
          <div className="bg-destructive/10 text-destructive p-3 rounded-lg mb-4 text-center">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Personal Information */}
          <div className="mb-4">
            <label htmlFor="fullName" className="block text-sm font-medium mb-2">Full Name *</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                errors.fullName ? 'border-destructive' : 'border-input'
              }`}
            />
            {errors.fullName && <span className="text-destructive text-sm">{errors.fullName}</span>}
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium mb-2">Email *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                errors.email ? 'border-destructive' : 'border-input'
              }`}
            />
            {errors.email && <span className="text-destructive text-sm">{errors.email}</span>}
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium mb-2">Password *</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                errors.password ? 'border-destructive' : 'border-input'
              }`}
            />
            {errors.password && <span className="text-destructive text-sm">{errors.password}</span>}
          </div>

          <div className="mb-4">
            <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">Confirm Password *</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                errors.confirmPassword ? 'border-destructive' : 'border-input'
              }`}
            />
            {errors.confirmPassword && <span className="text-destructive text-sm">{errors.confirmPassword}</span>}
          </div>

          {/* School Selection */}
          <div className="mb-4">
            <label htmlFor="schoolName" className="block text-sm font-medium mb-2">School *</label>
            <input
              type="text"
              id="schoolName"
              name="schoolName"
              value={formData.schoolName}
              onChange={handleChange}
              placeholder="Enter school name"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                errors.schoolName ? 'border-destructive' : 'border-input'
              }`}
            />
            {errors.schoolName && <span className="text-destructive text-sm">{errors.schoolName}</span>}
          </div>

          {/* Grade Selection - only for students */}
          {role === 'student' && (
            <div className="mb-4">
              <label htmlFor="grade" className="block text-sm font-medium mb-2">Grade *</label>
              <select
                id="grade"
                name="grade"
                value={formData.grade}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.grade ? 'border-destructive' : 'border-input'
                }`}
              >
                <option value="">Select Grade</option>
                <option value="9">Grade 9</option>
                <option value="10">Grade 10</option>
                <option value="11">Grade 11</option>
                <option value="12">Grade 12</option>
              </select>
              {errors.grade && <span className="text-destructive text-sm">{errors.grade}</span>}
            </div>
          )}

          {/* Stream Selection - only for students in grades 11-12 */}
          {role === 'student' && parseInt(formData.grade) >= 11 && (
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Stream *</label>
              <div className="flex gap-4 mt-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="stream"
                    value="Natural Science"
                    checked={formData.stream === 'Natural Science'}
                    onChange={handleChange}
                    className="h-4 w-4 text-primary focus:ring-primary"
                  />
                  <span>Natural Science</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="stream"
                    value="Social Science"
                    checked={formData.stream === 'Social Science'}
                    onChange={handleChange}
                    className="h-4 w-4 text-primary focus:ring-primary"
                  />
                  <span>Social Science</span>
                </label>
              </div>
              {errors.stream && <span className="text-destructive text-sm">{errors.stream}</span>}
            </div>
          )}

          {/* Teacher-specific fields - only for teachers */}
          {role === 'teacher' && (
            <div className="border-t border-border pt-4 mt-4">
              <div className="mb-4">
                <label htmlFor="subjects" className="block text-sm font-medium mb-2">Subjects Taught *</label>
                <input
                  type="text"
                  id="subjects"
                  name="subjects"
                  value={formData.subjects}
                  onChange={handleChange}
                  placeholder="e.g., Mathematics, Physics"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                    errors.subjects ? 'border-destructive' : 'border-input'
                  }`}
                />
                {errors.subjects && <span className="text-destructive text-sm">{errors.subjects}</span>}
                <p className="text-xs text-muted-foreground mt-1">Separate multiple subjects with commas</p>
              </div>
              
              <div className="mb-4">
                <label htmlFor="experience" className="block text-sm font-medium mb-2">Teaching Experience (years) *</label>
                <input
                  type="number"
                  id="experience"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  min="0"
                  placeholder="e.g., 5"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                    errors.experience ? 'border-destructive' : 'border-input'
                  }`}
                />
                {errors.experience && <span className="text-destructive text-sm">{errors.experience}</span>}
              </div>
            </div>
          )}

          <button 
            type="submit" 
            disabled={isLoading} 
            className="w-full py-2 px-4 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Registering...' : 'Register'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegistrationForm;