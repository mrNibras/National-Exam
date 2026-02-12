import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerStudent } from '../api';
import ethiopianRegions from '../data/ethiopianAdministrativeDivisions';
import './RegistrationForm.css';

const RegistrationForm = () => {
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    region: '',
    zone: '',
    woreda: '', // Using woreda instead of city to match Ethiopian administrative divisions
    schoolId: '',
    schoolName: '',
    grade: '',
    stream: '' // Will be 'Natural' or 'Social' for grades 11-12
  });

  // Options state
  const [schools, setSchools] = useState([]);
  const [filteredSchools, setFilteredSchools] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showCustomSchoolInput, setShowCustomSchoolInput] = useState(false);

  // Initialize component
  React.useEffect(() => {
    const fetchSchools = async () => {
      try {
        setSchools([]); // Placeholder for now
      } catch (error) {
        console.error('Error fetching schools:', error);
      }
    };

    fetchSchools();
  }, []);

  // Filter schools when location changes
  React.useEffect(() => {
    const filterSchools = async () => {
      if (formData.region || formData.zone || formData.woreda) {
        try {
          // For now, using client-side filtering
          const filtered = schools.filter(school => {
            // Map the selected IDs to actual names for comparison
            const selectedRegionObj = ethiopianRegions.find(r => r.id === formData.region);
            const selectedZoneObj = selectedRegionObj?.zones.find(z => z.id === formData.zone);

            // Match the selected region name - school.region is an object with name property
            const regionMatch = !formData.region ||
              (school.region && typeof school.region === 'object'
                ? school.region.name.toLowerCase() === (selectedRegionObj?.name.toLowerCase() || '')
                : school.region.toLowerCase() === (selectedRegionObj?.name.toLowerCase() || ''));

            // Match the selected zone name - school.zone is an object with name property
            const zoneMatch = !formData.zone ||
              (school.zone && typeof school.zone === 'object'
                ? school.zone.name.toLowerCase() === (selectedZoneObj?.name.toLowerCase() || '')
                : school.zone.toLowerCase() === (selectedZoneObj?.name.toLowerCase() || ''));

            // Match the selected woreda - school.woreda is an object with name property
            const woredaMatch = !formData.woreda ||
              (school.woreda && typeof school.woreda === 'object'
                ? school.woreda.name.toLowerCase() === formData.woreda.toLowerCase()
                : school.woreda.toLowerCase() === formData.woreda.toLowerCase());

            return regionMatch && zoneMatch && woredaMatch;
          });

          setFilteredSchools(filtered);
        } catch (error) {
          console.error('Error filtering schools:', error);
          // Fallback to client-side filtering
          const selectedRegionObj = ethiopianRegions.find(r => r.id === formData.region);
          const selectedZoneObj = selectedRegionObj?.zones.find(z => z.id === formData.zone);

          const filtered = schools.filter(school => {
            // Match the selected region name - school.region is an object with name property
            const regionMatch = !formData.region ||
              (school.region && typeof school.region === 'object'
                ? school.region.name.toLowerCase() === (selectedRegionObj?.name.toLowerCase() || '')
                : school.region.toLowerCase() === (selectedRegionObj?.name.toLowerCase() || ''));

            // Match the selected zone name - school.zone is an object with name property
            const zoneMatch = !formData.zone ||
              (school.zone && typeof school.zone === 'object'
                ? school.zone.name.toLowerCase() === (selectedZoneObj?.name.toLowerCase() || '')
                : school.zone.toLowerCase() === (selectedZoneObj?.name.toLowerCase() || ''));

            // Match the selected woreda - school.woreda is an object with name property
            const woredaMatch = !formData.woreda ||
              (school.woreda && typeof school.woreda === 'object'
                ? school.woreda.name.toLowerCase() === formData.woreda.toLowerCase()
                : school.woreda.toLowerCase() === formData.woreda.toLowerCase());

            return regionMatch && zoneMatch && woredaMatch;
          });

          setFilteredSchools(filtered);
        }
      } else {
        setFilteredSchools([]);
      }
    };
    
    filterSchools();
  }, [formData.region, formData.zone, formData.woreda, schools]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData(prev => {
      const newData = {
        ...prev,
        [name]: value
      };

      // Reset dependent fields when parent changes
      if (name === 'region') {
        newData.zone = '';  // Reset zone when region changes
        newData.woreda = ''; // Reset woreda when region changes
      } else if (name === 'zone') {
        newData.woreda = ''; // Reset woreda when zone changes
      }

      // Reset school selection when region/zone/woreda changes
      if (['region', 'zone', 'woreda'].includes(name)) {
        newData.schoolId = '';
        newData.schoolName = '';
        newData.customSchoolName = '';
        setShowCustomSchoolInput(false);
      }

      return newData;
    });

    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSchoolSelect = (e) => {
    const selectedValue = e.target.value;
    if (selectedValue === 'custom') {
      setShowCustomSchoolInput(true);
      setFormData(prev => ({
        ...prev,
        schoolId: '',
        schoolName: '',
        customSchoolName: ''
      }));
    } else {
      // Find the selected school object to get its name
      const selectedSchool = filteredSchools.find(school => school._id === selectedValue);
      setFormData(prev => ({
        ...prev,
        schoolId: selectedValue,
        schoolName: selectedSchool ? selectedSchool.name : '',
        customSchoolName: ''
      }));
      setShowCustomSchoolInput(false);
    }
  };

  const handleCustomSchoolChange = (e) => {
    setFormData(prev => ({
      ...prev,
      customSchoolName: e.target.value
    }));
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
    if (!formData.schoolName && !formData.customSchoolName) newErrors.schoolName = 'School is required';
    if (!formData.grade) newErrors.grade = 'Grade is required';

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    // Validate password strength
    if (formData.password && formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    // Validate stream for grades 11-12
    if (parseInt(formData.grade) >= 11 && !formData.stream) {
      newErrors.stream = 'Stream is required for grades 11 and 12';
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
      // Map the region/zone IDs to names for registration
      const selectedRegionObj = ethiopianRegions.find(r => r.id === formData.region);
      const selectedZoneObj = selectedRegionObj?.zones.find(z => z.id === formData.zone);

      const schoolData = {
        _id: formData.schoolId,  // Include the school ID if selected from the list
        name: formData.customSchoolName || formData.schoolName,
        region: selectedRegionObj?.name || formData.region,
        zone: selectedZoneObj?.name || formData.zone,
        woreda: formData.woreda
      };

      // If user entered a custom school name, we would create the school first
      if (formData.customSchoolName) {
        try {
          // Map the region/zone IDs to names for the school creation
          const selectedRegionObj = ethiopianRegions.find(r => r.id === formData.region);
          const selectedZoneObj = selectedRegionObj?.zones.find(z => z.id === formData.zone);

          // In a real implementation, we would create the school here
          // const createdSchool = await SchoolService.createSchool({
          //   name: formData.customSchoolName,
          //   region: { name: selectedRegionObj?.name || formData.region },
          //   zone: { name: selectedZoneObj?.name || formData.zone },  // Using selectedZoneObj here
          //   woreda: { name: formData.woreda },
          //   level: 'Secondary',
          //   ownership: 'Public'
          // });
        } catch (schoolError) {
          console.error('Error creating school:', schoolError);
        }
      }

      // Prepare registration data
      const registrationData = {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        school: {
          name: schoolData.name,
          region: { name: schoolData.region },
          zone: { name: schoolData.zone },
          woreda: { name: schoolData.woreda }
        },
        grade: parseInt(formData.grade),
        ...(parseInt(formData.grade) >= 11 && { stream: formData.stream })
      };

      // Call the registration API
      const response = await registerStudent(registrationData);

      if (response.success) {
        // Redirect to login or dashboard
        alert('Registration successful! Please log in.');
        navigate('/login');
      } else {
        setErrors({ general: response.message || 'Registration failed' });
      }
    } catch (error) {
      console.error('Registration error:', error);
      setErrors({ general: 'An error occurred during registration. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="registration-container">
      <div className="registration-form">
        <h2>Student Registration</h2>
        
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
            <select
              id="schoolName"
              value={formData.schoolId || (showCustomSchoolInput ? 'custom' : '')}
              onChange={handleSchoolSelect}
              disabled={!formData.woreda}
              className={errors.schoolName ? 'error' : ''}
            >
              <option value="">Select School</option>
              {filteredSchools.map(school => (
                <option key={school._id} value={school._id}>{school.name}</option>
              ))}
              <option value="custom">Add New School</option>
            </select>

            {showCustomSchoolInput && (
              <div className="custom-school-input">
                <input
                  type="text"
                  placeholder="Enter school name"
                  value={formData.customSchoolName || ''}
                  onChange={handleCustomSchoolChange}
                  className={errors.schoolName ? 'error' : ''}
                />
              </div>
            )}

            {errors.schoolName && <span className="error">{errors.schoolName}</span>}
          </div>

          {/* Grade Selection */}
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

          {/* Stream Selection (only for grades 11-12) */}
          {parseInt(formData.grade) >= 11 && (
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

          <button type="submit" disabled={isLoading} className="submit-btn">
            {isLoading ? 'Registering...' : 'Register'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegistrationForm;