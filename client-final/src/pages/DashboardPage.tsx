// File: MultipleFiles/DashboardPage.tsx
import React, { useState, useEffect } from 'react';
import { getUserDashboardStats } from '../services/api'; // Ensure this function exists in api.ts
import ProgressRadial from '../components/Progress/ProgressRadial';
import CalendarHeatmap from '../components/Calendar/CalendarHeatmap';
import PersonalAnalytics from '../components/Progress/PersonalAnalytics';
import { DashboardStats } from '../types'; // Import DashboardStats from consolidated types

const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getUserDashboardStats();
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch dashboard stats', error);
        setError('Failed to load dashboard data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (isLoading) return <div className="text-center py-8">Loading dashboard...</div>;
  if (error) return <div className="text-red-500 text-center py-8">{error}</div>;
  if (!stats) return <div className="text-center py-8 text-gray-500">No dashboard data available.</div>;

  const topicsCompletionPercentage = stats.totalTopics > 0 ? (stats.completedTopics / stats.totalTopics) * 100 : 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-center mb-2">
            <ProgressRadial
              value={topicsCompletionPercentage}
              size={80}
              strokeWidth={8}
              label={`${stats.completedTopics}/${stats.totalTopics}`}
            />
          </div>
          <h3 className="text-center font-medium">Topics Completed</h3>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-4xl font-bold text-center mb-2">{stats.solvedProblems}</h2>
          <h3 className="text-center font-medium">Problems Solved</h3>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-4xl font-bold text-center mb-2">{stats.accuracy}%</h2>
          <h3 className="text-center font-medium">Accuracy</h3>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-4xl font-bold text-center mb-2">{stats.streakDays}</h2>
          <h3 className="text-center font-medium">Day Streak</h3>
        </div>

        {/* Mastery Progress Radial */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-center mb-2">
            <ProgressRadial
              value={stats.masteryProgress}
              size={80}
              strokeWidth={8}
              label={`${stats.masteryProgress}%`}
            />
          </div>
          <h3 className="text-center font-medium">Overall Mastery</h3>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Your Activity</h2>
        <div className="overflow-x-auto">
          <CalendarHeatmap
            data={stats.activityMap}
            colors={['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39']} // Pass colors prop
          />
        </div>
      </div>

      {/* Next Recommended Topic */}
      <div className="bg-white rounded-lg shadow p-6 mt-8">
        <h2 className="text-xl font-semibold mb-2">Next Recommended Topic</h2>
        {stats.nextRecommendedTopic ? (
          <div className="p-4 border rounded-lg bg-blue-50">
            <h3 className="text-lg font-bold">{stats.nextRecommendedTopic.name}</h3>
            <p className="text-gray-700 mb-2">{stats.nextRecommendedTopic.description}</p>
            <a
              href={`/topic/${stats.nextRecommendedTopic.id}`}
              className="inline-block mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Go to Topic
            </a>
          </div>
        ) : (
          <p className="text-gray-500">No recommendation available.</p>
        )}
      </div>

      {/* Quiz Summary */}
      <div className="bg-white rounded-lg shadow p-6 mt-8">
        <h2 className="text-xl font-semibold mb-2">Recent Quiz Summary</h2>
        {stats.quizSummary && stats.quizSummary.recentQuizzes.length > 0 ? (
          <table className="min-w-full text-sm">
            <thead>
              <tr>
                <th className="px-2 py-1 text-left">Topic</th>
                <th className="px-2 py-1 text-left">Score</th>
                <th className="px-2 py-1 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {stats.quizSummary.recentQuizzes.map((quiz, idx) => (
                <tr key={idx}>
                  <td className="px-2 py-1">{quiz.topic}</td>
                  <td className="px-2 py-1">{quiz.score}%</td>
                  <td className="px-2 py-1">{quiz.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-500">No recent quizzes.</p>
        )}
      </div>

      {/* Weak Areas */}
      <div className="bg-white rounded-lg shadow p-6 mt-8">
        <h2 className="text-xl font-semibold mb-2">Your Weak Areas</h2>
        {stats.weakAreas && stats.weakAreas.length > 0 ? (
          <ul className="list-disc pl-6">
            {stats.weakAreas.map((area, idx) => (
              <li key={idx} className="mb-1">
                <span className="font-medium">{area.topic}:</span> <span className="text-red-600">{area.accuracy}% accuracy</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No weak areas detected. Great job!</p>
        )}
      </div>

      {/* Personal Analytics */}
      <div className="mt-8">
        <PersonalAnalytics />
      </div>
    </div>
  );
};

export default DashboardPage;
