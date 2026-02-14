import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import { makeApiRequest } from '@/api';

const EditQuestion = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [questionData, setQuestionData] = useState({
    questionText: '',
    subject: '',
    grade: '',
    topic: '',
    competency: '',
    options: [],
    correctAnswer: '',
    explanation: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuestion();
  }, []);

  const fetchQuestion = async () => {
    try {
      const result = await makeApiRequest(`questions/${id}`, {
        method: 'GET'
      });

      if (result.success) {
        setQuestionData(result.data);
      } else {
        alert(result.data?.msg || result.data?.message || 'Failed to load question');
        navigate('/teacher/questions');
      }
    } catch (error) {
      console.error('Error fetching question:', error);
      alert('Error loading question');
      navigate('/teacher/questions');
    } finally {
      setLoading(false);
    }
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...questionData.options];
    newOptions[index] = value;
    setQuestionData({
      ...questionData,
      options: newOptions
    });
  };

  const addOption = () => {
    setQuestionData({
      ...questionData,
      options: [...questionData.options, '']
    });
  };

  const removeOption = (index) => {
    if (questionData.options.length > 2) { // Keep at least 2 options
      const newOptions = questionData.options.filter((_, i) => i !== index);
      setQuestionData({
        ...questionData,
        options: newOptions
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!questionData.questionText || !questionData.subject || !questionData.grade ||
        !questionData.topic || !questionData.competency || !questionData.correctAnswer) {
      alert('Please fill in all required fields');
      return;
    }

    // Check if correct answer is valid
    if (!questionData.options.includes(questionData.correctAnswer)) {
      alert('Correct answer must be one of the options');
      return;
    }

    setLoading(true);
    try {
      const result = await makeApiRequest(`questions/${id}`, {
        method: 'PUT',
        body: JSON.stringify(questionData)
      });

      if (result.success) {
        alert('Question updated successfully!');
        navigate('/teacher/questions');
      } else {
        alert(result.data?.msg || result.data?.message || 'Failed to update question');
      }
    } catch (error) {
      console.error('Error updating question:', error);
      alert('Error updating question');
    } finally {
      setLoading(false);
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

  return (
    <DashboardLayout>
      <div className="p-6 max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Edit Question</h1>
          <p className="text-gray-600 mt-2">Update your question details.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subject <span className="text-red-500">*</span>
              </label>
              <select
                value={questionData.subject}
                onChange={(e) => setQuestionData({...questionData, subject: e.target.value})}
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Grade <span className="text-red-500">*</span>
              </label>
              <select
                value={questionData.grade}
                onChange={(e) => setQuestionData({...questionData, grade: e.target.value})}
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
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Topic <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={questionData.topic}
                onChange={(e) => setQuestionData({...questionData, topic: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Algebra, Mechanics"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Competency <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={questionData.competency}
                onChange={(e) => setQuestionData({...questionData, competency: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Problem Solving, Analysis"
                required
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Question <span className="text-red-500">*</span>
            </label>
            <textarea
              value={questionData.questionText}
              onChange={(e) => setQuestionData({...questionData, questionText: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 min-h-[120px]"
              placeholder="Enter your question here..."
              required
            />
          </div>

          <div className="mb-6">
            <div className="flex justify-between items-center mb-3">
              <label className="block text-sm font-medium text-gray-700">
                Options <span className="text-red-500">*</span>
              </label>
              <button
                type="button"
                onClick={addOption}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                + Add Option
              </button>
            </div>
            
            <div className="space-y-3">
              {questionData.options.map((option, index) => (
                <div key={index} className="flex items-center">
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder={`Option ${String.fromCharCode(65 + index)}`}
                  />
                  {questionData.options.length > 2 && (
                    <button
                      type="button"
                      onClick={() => removeOption(index)}
                      className="ml-2 p-2 text-red-600 hover:text-red-800"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Correct Answer <span className="text-red-500">*</span>
              </label>
              <select
                value={questionData.correctAnswer}
                onChange={(e) => setQuestionData({...questionData, correctAnswer: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select Correct Answer</option>
                {questionData.options.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Explanation (Optional)
              </label>
              <textarea
                value={questionData.explanation}
                onChange={(e) => setQuestionData({...questionData, explanation: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 min-h-[100px]"
                placeholder="Provide explanation for the correct answer..."
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/teacher/questions')}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Updating...' : 'Update Question'}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default EditQuestion;