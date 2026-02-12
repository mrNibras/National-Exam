import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';

const TeacherAnalytics = () => {
  const { classId } = useParams();
  const [analyticsData, setAnalyticsData] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    if (classId && classes.length > 0) {
      const selected = classes.find(cls => cls._id === classId);
      setSelectedClass(selected);
      if (selected) {
        fetchClassAnalytics(classId);
      }
    }
  }, [classId, classes]);

  const fetchClasses = async () => {
    try {
      const response = await fetch('/api/classes', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setClasses(data);
        
        // If no specific class is selected, fetch analytics for the first class
        if (!classId && data.length > 0) {
          setSelectedClass(data[0]);
          fetchClassAnalytics(data[0]._id);
        }
      }
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };

  const fetchClassAnalytics = async (classId) => {
    try {
      setLoading(true);
      
      // Fetch class performance data
      const response = await fetch('/api/analytics/class-performance', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setAnalyticsData(data);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  // Mock data for demonstration
  const mockClassPerformance = [
    { studentName: 'Abebe Kebede', totalAttempts: 5, averageScore: 85 },
    { studentName: 'Almaz Tefera', totalAttempts: 4, averageScore: 92 },
    { studentName: 'Kebede Lemma', totalAttempts: 6, averageScore: 78 },
    { studentName: 'Meron Tekle', totalAttempts: 3, averageScore: 88 },
    { studentName: 'Sara Kifle', totalAttempts: 5, averageScore: 95 },
  ];

  const mockSubjectPerformance = [
    { subject: 'Mathematics', avgScore: 85, totalStudents: 24 },
    { subject: 'Physics', avgScore: 78, totalStudents: 22 },
    { subject: 'Chemistry', avgScore: 82, totalStudents: 20 },
    { subject: 'Biology', avgScore: 90, totalStudents: 18 },
  ];

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Class Analytics</h1>
          <p className="text-gray-600 mt-2">Track student performance and class progress.</p>
        </div>

        {/* Class Selector */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-wrap items-center justify-between">
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium text-gray-700">Select Class:</label>
              <select
                value={selectedClass?._id || ''}
                onChange={(e) => {
                  const classObj = classes.find(cls => cls._id === e.target.value);
                  setSelectedClass(classObj);
                }}
                className="border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {classes.map(cls => (
                  <option key={cls._id} value={cls._id}>
                    {cls.name} ({cls.students?.length || 0} students)
                  </option>
                ))}
              </select>
            </div>
            <div className="mt-2 sm:mt-0">
              <span className="text-sm text-gray-600">
                {selectedClass ? `${selectedClass.students?.length || 0} students` : 'No class selected'}
              </span>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Performance Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Class Average Score</h3>
                <div className="text-4xl font-bold text-blue-600 mb-2">84%</div>
                <div className="text-sm text-gray-600">Based on all assessments</div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Students</h3>
                <div className="text-4xl font-bold text-green-600 mb-2">{selectedClass?.students?.length || 0}</div>
                <div className="text-sm text-gray-600">Currently enrolled</div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Completion Rate</h3>
                <div className="text-4xl font-bold text-purple-600 mb-2">78%</div>
                <div className="text-sm text-gray-600">Assessments completed</div>
              </div>
            </div>

            {/* Student Performance Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Student Performance</h3>
                <p className="text-sm text-gray-600">Individual student scores and activity</p>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg. Score</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tests Taken</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {mockClassPerformance.map((student, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{student.studentName}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 font-semibold">{student.averageScore}%</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{student.totalAttempts}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full" 
                                style={{ width: `${student.averageScore}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-500 ml-2">{student.averageScore}%</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Subject Performance */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Subject Performance</h3>
                <p className="text-sm text-gray-600">Average scores by subject</p>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {mockSubjectPerformance.map((subject, index) => (
                    <div key={index}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">{subject.subject}</span>
                        <span className="text-sm font-medium text-gray-700">{subject.avgScore}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-4">
                        <div 
                          className="bg-green-600 h-4 rounded-full" 
                          style={{ width: `${subject.avgScore}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">{subject.totalStudents} students</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default TeacherAnalytics;