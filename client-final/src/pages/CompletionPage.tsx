import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { updateUserProgress } from '../services/api';

interface CompletionData {
  topicId: string;
  topicName: string;
  score: number;
  totalProblems: number;
}

const CompletionPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const completionData = location.state as CompletionData;

  if (!completionData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
          <h1 className="text-2xl font-bold mb-4">No Completion Data Found</h1>
          <p className="text-gray-700 mb-6">
            It seems you landed on this page without completing a topic.
          </p>
          <button
            onClick={() => navigate('/learning-path')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Go to Learning Path
          </button>
        </div>
      </div>
    );
  }

  const handleContinue = async () => {
    try {
      await updateUserProgress({
        topicId: completionData.topicId,
        score: (completionData.score / completionData.totalProblems) * 100,
        lastAccessed: new Date().toISOString(),
      });
      navigate('/learning-path');
    } catch (error) {
      console.error('Failed to update user progress:', error);
      alert('Failed to save your progress. Please try again.');
    }
  };

  const completionPercentage = (completionData.score / completionData.totalProblems) * 100;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-2xl font-bold mb-2">Topic Completed!</h1>
        <h2 className="text-xl text-blue-600 mb-6">{completionData.topicName}</h2>

        <div className="mb-6">
          <p className="text-gray-700 mb-2">
            You solved {completionData.score} out of {completionData.totalProblems} problems
          </p>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full"
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            {Math.round(completionPercentage)}% Accuracy
          </p>
        </div>

        <button
          onClick={handleContinue}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Continue Learning
        </button>
      </div>
    </div>
  );
};

export default CompletionPage;
