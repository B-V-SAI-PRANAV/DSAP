import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  if (!user) return <div className="text-center py-8">No user data.</div>;
  return (
    <div className="container mx-auto px-4 py-8 flex flex-col items-center">
      <div className="bg-white rounded-full shadow p-6 flex items-center justify-center mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 text-blue-600">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.25a8.25 8.25 0 1115 0v.75a.75.75 0 01-.75.75h-13.5a.75.75 0 01-.75-.75v-.75z" />
        </svg>
      </div>
      <h1 className="text-3xl font-bold mb-2">{user.username}</h1>
      <p className="text-gray-600 mb-2">{user.email}</p>
      <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold">{user.role?.toUpperCase()}</span>
    </div>
  );
};

export default ProfilePage;
