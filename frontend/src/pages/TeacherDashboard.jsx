import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StatCard from '../components/StatCard';
import DashboardLayout from '../components/DashboardLayout';
import { getClasses, getQuestions } from '@/api';

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalClasses: 0,
    totalStudents: 0,
    totalQuestions: 0,
    pendingReviews: 0
  });

  useEffect(() => {
    // Fetch teacher statistics
    const fetchStats = async () => {
      try {
        const classesResult = await getClasses();

        if (classesResult.success) {
          const classes = classesResult.data;
          setStats(prev => ({
            ...prev,
            totalClasses: classes.length
          }));

          // Calculate total students
          const totalStudents = classes.reduce((acc, cls) => acc + (cls.students?.length || 0), 0);
          setStats(prev => ({
            ...prev,
            totalStudents
          }));
        } else {
          console.error('Error fetching classes:', classesResult.data?.msg || classesResult.data?.message);
        }

        // Fetch total questions created by this teacher
        const questionsResult = await getQuestions();

        if (questionsResult.success) {
          const questionsData = questionsResult.data;
          setStats(prev => ({
            ...prev,
            totalQuestions: questionsData.total || questionsData.questions?.length || 0
          }));
        } else {
          console.error('Error fetching questions:', questionsResult.data?.msg || questionsResult.data?.message);
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: "My Classes",
      value: stats.totalClasses,
      icon: "📚",
      color: "bg-blue-500",
      onClick: () => navigate('/teacher/classes')
    },
    {
      title: "My Students",
      value: stats.totalStudents,
      icon: "👥",
      color: "bg-green-500",
      onClick: () => navigate('/teacher/classes')
    },
    {
      title: "Questions Created",
      value: stats.totalQuestions,
      icon: "❓",
      color: "bg-purple-500",
      onClick: () => navigate('/teacher/questions')
    },
    {
      title: "Pending Reviews",
      value: stats.pendingReviews,
      icon: "📝",
      color: "bg-yellow-500",
      onClick: () => navigate('/teacher/analytics')
    }
  ];

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Teacher Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back! Here's what's happening with your classes and students.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((card, index) => (
            <StatCard
              key={index}
              title={card.title}
              value={card.value}
              icon={card.icon}
              color={card.color}
              onClick={card.onClick}
            />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <button 
                onClick={() => navigate('/teacher/questions/create')}
                className="w-full text-left p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors flex items-center"
              >
                <span className="mr-3">➕</span>
                <span>Create New Question</span>
              </button>
              <button 
                onClick={() => navigate('/teacher/classes/create')}
                className="w-full text-left p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors flex items-center"
              >
                <span className="mr-3">🏫</span>
                <span>Create New Class</span>
              </button>
              <button 
                onClick={() => navigate('/teacher/analytics')}
                className="w-full text-left p-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors flex items-center"
              >
                <span className="mr-3">📊</span>
                <span>View Analytics</span>
              </button>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="bg-blue-100 p-2 rounded-full mr-3">
                  <span>✏️</span>
                </div>
                <div>
                  <p className="font-medium">New question created</p>
                  <p className="text-sm text-gray-600">Mathematics - Algebra</p>
                  <p className="text-xs text-gray-500">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-green-100 p-2 rounded-full mr-3">
                  <span>👥</span>
                </div>
                <div>
                  <p className="font-medium">Student added to class</p>
                  <p className="text-sm text-gray-600">Grade 10 - Section A</p>
                  <p className="text-xs text-gray-500">Yesterday</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-purple-100 p-2 rounded-full mr-3">
                  <span>📈</span>
                </div>
                <div>
                  <p className="font-medium">Class performance report</p>
                  <p className="text-sm text-gray-600">Grade 11 - Physics</p>
                  <p className="text-xs text-gray-500">2 days ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TeacherDashboard;