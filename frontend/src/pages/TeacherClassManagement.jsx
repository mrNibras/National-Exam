import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import { getClasses, makeApiRequest } from '@/api';

const TeacherClassManagement = () => {
  const navigate = useNavigate();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createClassData, setCreateClassData] = useState({
    name: '',
    description: '',
    subject: '',
    grade: ''
  });

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const result = await getClasses();

      if (result.success) {
        setClasses(result.data);
      } else {
        console.error('Error fetching classes:', result.data?.msg || result.data?.message);
      }
    } catch (error) {
      console.error('Error fetching classes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateClass = async (e) => {
    e.preventDefault();

    try {
      const result = await makeApiRequest('classes', {
        method: 'POST',
        body: JSON.stringify(createClassData)
      });

      if (result.success) {
        setClasses([...classes, result.data]);
        setShowCreateModal(false);
        setCreateClassData({ name: '', description: '', subject: '', grade: '' });
      } else {
        alert(result.data?.msg || result.data?.message || 'Failed to create class');
      }
    } catch (error) {
      console.error('Error creating class:', error);
      alert('Error creating class');
    }
  };

  const handleDeleteClass = async (classId) => {
    if (window.confirm('Are you sure you want to delete this class? This will not affect the students.')) {
      try {
        const result = await makeApiRequest(`classes/${classId}`, {
          method: 'DELETE'
        });

        if (result.success) {
          setClasses(classes.filter(cls => cls._id !== classId));
        } else {
          alert(result.data?.msg || result.data?.message || 'Failed to delete class');
        }
      } catch (error) {
        console.error('Error deleting class:', error);
        alert('Error deleting class');
      }
    }
  };

  const handleViewClass = (classId) => {
    navigate(`/teacher/classes/${classId}`);
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Class Management</h1>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
            >
              <span className="mr-2">+</span>
              Create New Class
            </button>
          </div>
          <p className="text-gray-600 mt-2">Manage your classes and track student progress.</p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {classes.map((classItem) => (
              <div key={classItem._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{classItem.name}</h3>
                      <p className="text-gray-600 mt-1">{classItem.description}</p>
                    </div>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      Grade {classItem.grade}
                    </span>
                  </div>
                  
                  <div className="mt-4 flex items-center text-sm text-gray-500">
                    <span>📚 {classItem.subject}</span>
                    <span className="mx-2">•</span>
                    <span>👥 {classItem.students?.length || 0} students</span>
                  </div>
                  
                  <div className="mt-6 flex space-x-3">
                    <button
                      onClick={() => handleViewClass(classItem._id)}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md text-sm font-medium"
                    >
                      View Class
                    </button>
                    <button
                      onClick={() => handleDeleteClass(classItem._id)}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md text-sm font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
            
            {classes.length === 0 && (
              <div className="col-span-full text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">📚</div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">No classes yet</h3>
                <p className="text-gray-500 mb-4">Get started by creating your first class.</p>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md text-sm font-medium"
                >
                  Create Class
                </button>
              </div>
            )}
          </div>
        )}

        {/* Create Class Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h2 className="text-xl font-semibold mb-4">Create New Class</h2>
              
              <form onSubmit={handleCreateClass}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Class Name</label>
                  <input
                    type="text"
                    value={createClassData.name}
                    onChange={(e) => setCreateClassData({...createClassData, name: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Grade 10 Mathematics"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={createClassData.description}
                    onChange={(e) => setCreateClassData({...createClassData, description: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Brief description of the class"
                    rows="3"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                    <select
                      value={createClassData.subject}
                      onChange={(e) => setCreateClassData({...createClassData, subject: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="">Select Subject</option>
                      <option value="Mathematics">Mathematics</option>
                      <option value="Physics">Physics</option>
                      <option value="Chemistry">Chemistry</option>
                      <option value="Biology">Biology</option>
                      <option value="English">English</option>
                      <option value="Amharic">Amharic</option>
                      <option value="History">History</option>
                      <option value="Geography">Geography</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Grade</label>
                    <select
                      value={createClassData.grade}
                      onChange={(e) => setCreateClassData({...createClassData, grade: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="">Select Grade</option>
                      <option value="7">Grade 7</option>
                      <option value="8">Grade 8</option>
                      <option value="9">Grade 9</option>
                      <option value="10">Grade 10</option>
                      <option value="11">Grade 11</option>
                      <option value="12">Grade 12</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700"
                  >
                    Create Class
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default TeacherClassManagement;