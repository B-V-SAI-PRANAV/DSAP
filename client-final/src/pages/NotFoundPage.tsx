import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="text-center px-4">
        <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-6">
          Page Not Found
        </h2>
        <p className="text-gray-600 mb-8 max-w-md">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/home"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
