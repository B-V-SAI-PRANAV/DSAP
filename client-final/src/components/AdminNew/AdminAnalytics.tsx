import React, { useEffect, useState } from 'react';
import { getAdminStatistics, getAdminAnalytics } from '../../services/adminApi';

interface AdminStats {
  totalUsers?: number;
  totalTopics?: number;
  totalResources?: number;
  totalProblems?: number;
  totalQuizQuestions?: number;
  activeUsers?: number;
  newUsersThisWeek?: number;
  averageCompletionRate?: number;
}

interface AnalyticsData {
  userGrowth: any[];
  topicCompletion: any[];
  resourceUsage: any[];
  problemAttempts: any[];
}

const AdminAnalytics: React.FC = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [_analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = async () => {
    setLoading(true);
    setError(null);
    try {
      const [statsData, analyticsData] = await Promise.all([
        getAdminStatistics(),
        getAdminAnalytics()
      ]);
      setStats(statsData);
      setAnalytics(analyticsData);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch analytics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading) {
    return <div className="py-8 text-center">Loading analytics...</div>;
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Analytics Dashboard</h2>
        <button
          onClick={fetchAnalytics}
          className="px-4 py-2 bg-blue-600 text-white rounded-md font-semibold shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
        >
          Refresh
        </button>
      </div>

      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900">Total Users</h3>
            <p className="text-3xl font-bold text-blue-600">{stats.totalUsers}</p>
            <p className="text-sm text-gray-500">Active: {stats.activeUsers}</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900">Total Topics</h3>
            <p className="text-3xl font-bold text-green-600">{stats.totalTopics}</p>
            <p className="text-sm text-gray-500">Core topics available</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900">Total Resources</h3>
            <p className="text-3xl font-bold text-purple-600">{stats.totalResources}</p>
            <p className="text-sm text-gray-500">Learning materials</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900">Problems & Questions</h3>
            <p className="text-3xl font-bold text-orange-600">{(stats.totalProblems || 0) + (stats.totalQuizQuestions || 0)}</p>
            <p className="text-sm text-gray-500">Practice content</p>
          </div>
        </div>
      )}

      {/* Additional Analytics */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900">New Users (This Week)</h3>
            <p className="text-2xl font-bold text-blue-600">{stats.newUsersThisWeek}</p>
            <p className="text-sm text-gray-500">Recent registrations</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900">Completion Rate</h3>
            <p className="text-2xl font-bold text-green-600">{stats.averageCompletionRate}%</p>
            <p className="text-sm text-gray-500">Average across users</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900">Active Users</h3>
            <p className="text-2xl font-bold text-purple-600">{stats.activeUsers}</p>
            <p className="text-sm text-gray-500">Currently learning</p>
          </div>
        </div>
      )}

      {/* Placeholder for Charts */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Learning Progress</h3>
        <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
          <p className="text-gray-500">Charts and detailed analytics coming soon...</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
            <div>
              <p className="font-medium">New user registered</p>
              <p className="text-sm text-gray-500">2 minutes ago</p>
            </div>
            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">User</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
            <div>
              <p className="font-medium">Topic completed</p>
              <p className="text-sm text-gray-500">15 minutes ago</p>
            </div>
            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">Progress</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
            <div>
              <p className="font-medium">Resource uploaded</p>
              <p className="text-sm text-gray-500">1 hour ago</p>
            </div>
            <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">Content</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics; 