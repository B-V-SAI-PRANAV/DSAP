import React, { useState, useEffect } from 'react';
import { getPersonalAnalytics } from '../../services/api';
import { PersonalAnalytics as PersonalAnalyticsType } from '../../types';
import ProgressRadial from './ProgressRadial';

interface PersonalAnalyticsProps {
  className?: string;
}

const PersonalAnalytics: React.FC<PersonalAnalyticsProps> = ({ className = '' }) => {
  const [analytics, setAnalytics] = useState<PersonalAnalyticsType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const data = await getPersonalAnalytics();
        setAnalytics(data);
      } catch (err) {
        console.error('Failed to fetch personal analytics:', err);
        setError('Failed to load analytics data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (isLoading) return <div className="text-center py-4">Loading analytics...</div>;
  if (error) return <div className="text-red-500 text-center py-4">{error}</div>;
  if (!analytics) return <div className="text-center py-4 text-gray-500">No analytics data available</div>;

  const { engagement, performance, progress, trends } = analytics;

  return (
    <div className={`space-y-6 ${className}`}>
      <h2 className="text-2xl font-bold">Your Analytics</h2>

      {/* Engagement Metrics */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Engagement</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{engagement.completedTopics}</div>
            <div className="text-sm text-gray-600">Topics Completed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{engagement.completionRate.toFixed(1)}%</div>
            <div className="text-sm text-gray-600">Completion Rate</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{engagement.lastWeekActivity}</div>
            <div className="text-sm text-gray-600">Active This Week</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{Math.round(engagement.totalStudyTime / 60)}h</div>
            <div className="text-sm text-gray-600">Total Study Time</div>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Performance</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <ProgressRadial
              value={performance.averageQuizScore}
              size={80}
              strokeWidth={8}
              label={`${performance.averageQuizScore.toFixed(1)}%`}
            />
            <div className="mt-2 text-sm text-gray-600">Average Quiz Score</div>
          </div>
          <div className="text-center">
            <ProgressRadial
              value={performance.quizPassRate}
              size={80}
              strokeWidth={8}
              label={`${performance.quizPassRate.toFixed(1)}%`}
            />
            <div className="mt-2 text-sm text-gray-600">Quiz Pass Rate</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-indigo-600">{performance.totalQuizAttempts}</div>
            <div className="text-sm text-gray-600">Total Quiz Attempts</div>
          </div>
        </div>
      </div>

      {/* Progress Breakdown */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Progress Breakdown</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{progress.strongTopicsCount}</div>
            <div className="text-sm text-gray-600">Strong Topics</div>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <div className="text-2xl font-bold text-red-600">{progress.weakTopicsCount}</div>
            <div className="text-sm text-gray-600">Weak Topics</div>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{engagement.inProgressTopics}</div>
            <div className="text-sm text-gray-600">In Progress</div>
          </div>
        </div>
      </div>

      {/* Trends */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Learning Trends</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">+{trends.weeklyProgress}%</div>
            <div className="text-sm text-gray-600">Weekly Progress</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">+{trends.monthlyProgress}%</div>
            <div className="text-sm text-gray-600">Monthly Progress</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">+{trends.improvementRate}%</div>
            <div className="text-sm text-gray-600">Improvement Rate</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalAnalytics; 