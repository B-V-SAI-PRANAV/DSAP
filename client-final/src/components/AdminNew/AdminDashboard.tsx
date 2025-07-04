import React, { useState } from 'react';
import AdminUsers from './AdminUsers';
import AdminTopics from './AdminTopics';
import AdminResources from './AdminResources';
import AdminProblems from './AdminProblems';
import AdminQuiz from './AdminQuiz';
import AdminAnalytics from './AdminAnalytics';

const TABS = [
  { key: 'users', label: 'Users' },
  { key: 'topics', label: 'Topics' },
  { key: 'resources', label: 'Resources' },
  { key: 'problems', label: 'Problems' },
  { key: 'quiz', label: 'Quiz Questions' },
  { key: 'analytics', label: 'Analytics' },
];

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('users');

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col p-4 space-y-2">
        <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
        {TABS.map(tab => (
          <button
            key={tab.key}
            className={`text-left px-4 py-2 rounded hover:bg-gray-700 font-semibold ${activeTab === tab.key ? 'bg-blue-600' : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </aside>
      {/* Main Content */}
      <main className="flex-1 p-8 bg-gray-50 overflow-auto">
        {activeTab === 'users' && <AdminUsers />}
        {activeTab === 'topics' && <AdminTopics />}
        {activeTab === 'resources' && <AdminResources />}
        {activeTab === 'problems' && <AdminProblems />}
        {activeTab === 'quiz' && <AdminQuiz />}
        {activeTab === 'analytics' && <AdminAnalytics />}
      </main>
    </div>
  );
};

export default AdminDashboard; 