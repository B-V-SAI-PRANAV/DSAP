import React, { useState, useEffect } from 'react';
import { getTopicProblemProgress } from '../../services/api';

interface ProblemProgressSummaryProps {
  topicId: string;
  className?: string;
  key?: string | number;
}

const ProblemProgressSummary: React.FC<ProblemProgressSummaryProps> = ({ topicId, className = '' }) => {
  const [progress, setProgress] = useState<{
    completedProblems: string[];
    totalProblems: number;
    progressPercentage: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProgress = async () => {
      setIsLoading(true);
      try {
        const data = await getTopicProblemProgress(topicId);
        setProgress(data);
      } catch (error) {
        console.error('Failed to load problem progress:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadProgress();
  }, [topicId]);

  if (isLoading) {
    return (
      <div className={`bg-gray-50 rounded-lg p-4 ${className}`}>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-2 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (!progress) {
    return null;
  }

  const { completedProblems, totalProblems, progressPercentage } = progress;

  return (
    <div className={`bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 ${className}`}>
      <h3 className="font-semibold text-blue-800 mb-2">Problem Progress</h3>
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-blue-700">
          {completedProblems.length} of {totalProblems} problems completed
        </span>
        <span className="text-sm font-medium text-blue-800">
          {Math.round(progressPercentage)}%
        </span>
      </div>
      <div className="w-full bg-blue-200 rounded-full h-2">
        <div
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
      {completedProblems.length === totalProblems && totalProblems > 0 && (
        <div className="mt-2 text-center">
          <span className="text-sm font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">
            🎉 All problems completed!
          </span>
        </div>
      )}
    </div>
  );
};

export default ProblemProgressSummary; 