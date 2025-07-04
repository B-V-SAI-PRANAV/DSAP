import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getNextRecommendedTopic } from '../../services/api';
import { NextRecommendedTopic as NextRecommendedTopicType } from '../../types';

interface NextTopicButtonProps {
  topicId: string;
  isCompleted: boolean;
  className?: string;
}

const NextTopicButton: React.FC<NextTopicButtonProps> = ({ topicId, isCompleted, className = '' }) => {
  const [nextTopic, setNextTopic] = useState<NextRecommendedTopicType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isCompleted) {
      fetchNextTopic();
    }
  }, [topicId, isCompleted]);

  const fetchNextTopic = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getNextRecommendedTopic(topicId);
      setNextTopic(data);
    } catch (err) {
      console.error('Failed to fetch next topic:', err);
      setError('Failed to load next topic recommendation');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNextTopicClick = () => {
    if (nextTopic && nextTopic.id !== 'all-completed') {
      navigate(`/topic/${nextTopic.id}`);
    } else {
      // If all topics completed, go to dashboard or mastery plan
      navigate('/mastery-plan');
    }
  };

  if (!isCompleted) {
    return null;
  }

  if (isLoading) {
    return (
      <div className={`bg-blue-50 border border-blue-200 rounded-lg p-4 ${className}`}>
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
          <span className="text-blue-600 text-sm">Loading next topic...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-red-50 border border-red-200 rounded-lg p-4 ${className}`}>
        <p className="text-red-600 text-sm">{error}</p>
      </div>
    );
  }

  if (!nextTopic) {
    return null;
  }

  const isAllCompleted = nextTopic.id === 'all-completed';
  const isReinforcement = nextTopic.type === 'reinforcement';

  return (
    <div className={`bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h3 className="font-semibold text-green-800 mb-1">
            {isAllCompleted ? '🎉 All Topics Completed!' : '🚀 Ready for Next Topic!'}
          </h3>
          <p className="text-sm text-green-700 mb-2">
            {isAllCompleted 
              ? 'Congratulations! You have completed all available topics.'
              : isReinforcement
                ? nextTopic.description
                : nextTopic.description
            }
          </p>
          {nextTopic.name && (
            <p className="text-sm font-medium text-green-800">
              {isReinforcement ? '📚 ' : '➡️ '}{nextTopic.name}
            </p>
          )}
        </div>
        <button
          onClick={handleNextTopicClick}
          className={`ml-4 px-4 py-2 rounded-lg font-medium transition-colors ${
            isAllCompleted
              ? 'bg-green-600 hover:bg-green-700 text-white'
              : isReinforcement
                ? 'bg-orange-600 hover:bg-orange-700 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {isAllCompleted ? 'View Mastery Plan' : 'Continue'}
        </button>
      </div>
    </div>
  );
};

export default NextTopicButton; 