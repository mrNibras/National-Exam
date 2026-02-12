import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerStudent, registerTeacher } from '../api';
import ethiopianRegions from '../data/ethiopianAdministrativeDivisions';
import './RegistrationForm.css';

const RegistrationForm = ({ role = 'student' }) => {
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    region: '',
    zone: '',
    woreda: '',
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
    if (!formData.region) newErrors.region = 'Region is required';
    if (!formData.zone) newErrors.zone = 'Zone is required';
    if (!formData.woreda) newErrors.woreda = 'Woreda is required';
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
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
          role: 'teacher',
          school: {
            name: formData.schoolName,
            region: formData.region,
            zone: formData.zone,
            woreda: formData.woreda
          },
          subjects: formData.subjects.split(',').map(subject => subject.trim()), // Convert to array
          experience: parseInt(formData.experience) || 0
        };

        const response = await registerTeacher(teacherData);
        if (response.success) {
          alert('Teacher registration successful!');
          navigate('/dashboard');
        } else {
          throw new Error(response.message || 'Registration failed');
        }
      } else {
        // Student registration data
        const studentData = {
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
          role: 'student',
          school: {
            name: formData.schoolName,
            region: formData.region,
            zone: formData.zone,
            woreda: formData.woreda
          },
          grade: parseInt(formData.grade),
          ...(parseInt(formData.grade) >= 11 && { stream: formData.stream })
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
    <div className="registration-container">
      <div className="registration-form">
        <h2>{role === 'teacher' ? 'Teacher Registration' : 'Student Registration'}</h2>
        
        {errors.general && <div className="error-message">{errors.general}</div>}

        <form onSubmit={handleSubmit}>
          {/* Personal Information */}
          <div className="form-group">
            <label htmlFor="fullName">Full Name *</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className={errors.fullName ? 'error' : ''}
            />
            {errors.fullName && <span className="error">{errors.fullName}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'error' : ''}
            />
            {errors.email && <span className="error">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password *</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? 'error' : ''}
            />
            {errors.password && <span className="error">{errors.password}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password *</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={errors.confirmPassword ? 'error' : ''}
            />
            {errors.confirmPassword && <span className="error">{errors.confirmPassword}</span>}
          </div>

          {/* Location Information */}
          <div className="form-group">
            <label htmlFor="region">Region *</label>
            <select
              id="region"
              name="region"
              value={formData.region}
              onChange={handleChange}
              className={errors.region ? 'error' : ''}
            >
              <option value="">Select Region</option>
              {ethiopianRegions.map(region => (
                <option key={region.id} value={region.id}>{region.name}</option>
              ))}
            </select>
            {errors.region && <span className="error">{errors.region}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="zone">Zone *</label>
            <select
              id="zone"
              name="zone"
              value={formData.zone}
              onChange={handleChange}
              disabled={!formData.region}
              className={errors.zone ? 'error' : ''}
            >
              <option value="">Select Zone</option>
              {(ethiopianRegions.find(r => r.id === formData.region)?.zones || []).map(zone => (
                <option key={zone.id} value={zone.id}>{zone.name}</option>
              ))}
            </select>
            {errors.zone && <span className="error">{errors.zone}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="woreda">Woreda *</label>
            <select
              id="woreda"
              name="woreda"
              value={formData.woreda}
              onChange={handleChange}
              disabled={!formData.zone}
              className={errors.woreda ? 'error' : ''}
            >
              <option value="">Select Woreda</option>
              {(ethiopianRegions.find(r => r.id === formData.region)?.zones.find(z => z.id === formData.zone)?.woredas || []).map((woreda, index) => (
                <option key={index} value={woreda}>{woreda}</option>
              ))}
            </select>
            {errors.woreda && <span className="error">{errors.woreda}</span>}
          </div>

          {/* School Selection */}
          <div className="form-group">
            <label htmlFor="schoolName">School *</label>
            <input
              type="text"
              id="schoolName"
              name="schoolName"
              value={formData.schoolName}
              onChange={handleChange}
              placeholder="Enter school name"
              className={errors.schoolName ? 'error' : ''}
            />
            {errors.schoolName && <span className="error">{errors.schoolName}</span>}
          </div>

          {/* Grade Selection - only for students */}
          {role === 'student' && (
            <div className="form-group">
              <label htmlFor="grade">Grade *</label>
              <select
                id="grade"
                name="grade"
                value={formData.grade}
                onChange={handleChange}
                className={errors.grade ? 'error' : ''}
              >
                <option value="">Select Grade</option>
                <option value="9">Grade 9</option>
                <option value="10">Grade 10</option>
                <option value="11">Grade 11</option>
                <option value="12">Grade 12</option>
              </select>
              {errors.grade && <span className="error">{errors.grade}</span>}
            </div>
          )}

          {/* Stream Selection - only for students in grades 11-12 */}
          {role === 'student' && parseInt(formData.grade) >= 11 && (
            <div className="form-group">
              <label>Stream *</label>
              <div className="radio-group">
                <label>
                  <input
                    type="radio"
                    name="stream"
                    value="Natural"
                    checked={formData.stream === 'Natural'}
                    onChange={handleChange}
                  />
                  Natural Science
                </label>
                <label>
                  <input
                    type="radio"
                    name="stream"
                    value="Social"
                    checked={formData.stream === 'Social'}
                    onChange={handleChange}
                  />
                  Social Science
                </label>
              </div>
              {errors.stream && <span className="error">{errors.stream}</span>}
            </div>
          )}

          {/* Teacher-specific fields - only for teachers */}
          {role === 'teacher' && (
            <div className="teacher-fields">
              <div className="form-group">
                <label htmlFor="subjects">Subjects Taught *</label>
                <input
                  type="text"
                  id="subjects"
                  name="subjects"
                  value={formData.subjects}
                  onChange={handleChange}
                  placeholder="e.g., Mathematics, Physics"
                  className={errors.subjects ? 'error' : ''}
                />
                {errors.subjects && <span className="error">{errors.subjects}</span>}
                <p className="help-text">Separate multiple subjects with commas</p>
              </div>
              
              <div className="form-group">
                <label htmlFor="experience">Teaching Experience (years) *</label>
                <input
                  type="number"
                  id="experience"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  min="0"
                  placeholder="e.g., 5"
                  className={errors.experience ? 'error' : ''}
                />
                {errors.experience && <span className="error">{errors.experience}</span>}
              </div>
            </div>
          )}

          <button type="submit" disabled={isLoading} className="submit-btn">
            {isLoading ? 'Registering...' : 'Register'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegistrationForm;