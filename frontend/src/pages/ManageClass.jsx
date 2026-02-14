import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import { getClassStudents, getUsers, addStudentToClass, removeStudentFromClass } from '@/api';

const ManageClass = () => {
  const navigate = useNavigate();
  const { classId } = useParams();
  const [classData, setClassData] = useState(null);
  const [students, setStudents] = useState([]);
  const [allStudents, setAllStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState('');

  useEffect(() => {
    fetchClassData();
  }, []);

  const fetchClassData = async () => {
    try {
      setLoading(true);

      // Fetch class details
      const classResult = await getClassStudents(classId);

      if (classResult.success) {
        setClassData(classResult.data);
      }

      // Fetch all students in the school
      const studentsResult = await getUsers('Student');

      if (studentsResult.success) {
        setAllStudents(studentsResult.data.users || []);
      }
    } catch (error) {
      console.error('Error fetching class data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddStudent = async () => {
    if (!selectedStudent) return;

    try {
      const result = await addStudentToClass(classId, selectedStudent);

      if (result.success) {
        setClassData(result.data);
        setShowAddStudentModal(false);
        setSelectedStudent('');
      } else {
        alert(result.data?.msg || result.data?.message || 'Failed to add student');
      }
    } catch (error) {
      console.error('Error adding student:', error);
      alert('Error adding student');
    }
  };

  const handleRemoveStudent = async (studentId) => {
    if (!window.confirm('Are you sure you want to remove this student from the class?')) {
      return;
    }

    try {
      const result = await removeStudentFromClass(classId, studentId);

      if (result.success) {
        setClassData(result.data);
      } else {
        alert(result.data?.msg || result.data?.message || 'Failed to remove student');
      }
    } catch (error) {
      console.error('Error removing student:', error);
      alert('Error removing student');
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  // Filter out students already in the class
  const availableStudents = allStudents.filter(student => 
    !classData?.students?.some(s => s._id === student._id)
  );

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{classData?.name}</h1>
              <p className="text-gray-600 mt-2">{classData?.description}</p>
            </div>
            <button
              onClick={() => navigate('/teacher/classes')}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Back to Classes
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Class Details</h2>
            <div className="space-y-3">
              <div>
                <span className="text-sm text-gray-500">Subject</span>
                <p className="font-medium">{classData?.subject}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Grade</span>
                <p className="font-medium">Grade {classData?.grade}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Created</span>
                <p className="font-medium">{new Date(classData?.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Students ({classData?.students?.length || 0})</h2>
              <button
                onClick={() => setShowAddStudentModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm"
              >
                Add Student
              </button>
            </div>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {classData?.students?.map((student) => (
                <div key={student._id} className="flex justify-between items-center p-2 border-b">
                  <span>{student.name}</span>
                  <button
                    onClick={() => handleRemoveStudent(student._id)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Remove
                  </button>
                </div>
              ))}
              {(!classData?.students || classData.students.length === 0) && (
                <p className="text-gray-500 text-center py-4">No students in this class yet</p>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Actions</h2>
            <div className="space-y-3">
              <button
                onClick={() => navigate(`/teacher/analytics/${classId}`)}
                className="w-full text-left p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors flex items-center"
              >
                <span className="mr-3">📊</span>
                <span>View Analytics</span>
              </button>
              <button
                onClick={() => navigate(`/teacher/classes/${classId}/assignments`)}
                className="w-full text-left p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors flex items-center"
              >
                <span className="mr-3">📋</span>
                <span>Create Assignment</span>
              </button>
              <button
                onClick={() => navigate(`/teacher/classes/${classId}/materials`)}
                className="w-full text-left p-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors flex items-center"
              >
                <span className="mr-3">📖</span>
                <span>Learning Materials</span>
              </button>
            </div>
          </div>
        </div>

        {/* Add Student Modal */}
        {showAddStudentModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h2 className="text-xl font-semibold mb-4">Add Student to Class</h2>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Student</label>
                <select
                  value={selectedStudent}
                  onChange={(e) => setSelectedStudent(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Choose a student</option>
                  {availableStudents.map(student => (
                    <option key={student._id} value={student._id}>
                      {student.name} ({student.email})
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddStudentModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddStudent}
                  disabled={!selectedStudent}
                  className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  Add Student
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ManageClass;