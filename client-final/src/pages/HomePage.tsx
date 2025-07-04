import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const HomePage: React.FC = () => {
  const { user } = useAuth();

  const featureCards = [
    {
      id: 'known-topics',
      title: 'Enter Known Topics',
      description: 'Tell us what you already know and we\'ll recommend the perfect learning path for you.',
      icon: '📚',
      path: '/known-topics',
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      id: 'scratch',
      title: 'Start from Scratch',
      description: 'Begin your DSA journey from the very beginning with our comprehensive learning path.',
      icon: '🚀',
      path: '/start-from-scratch',
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      id: 'mastery',
      title: 'Mastery Plan',
      description: 'Access organized PDFs and resources to master topics systematically.',
      icon: '🎯',
      path: '/mastery-plan',
      color: 'bg-purple-500 hover:bg-purple-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to DSA PathRecommender
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Master Data Structures and Algorithms with personalized learning paths tailored to your knowledge level.
          </p>
          {!user && (
            <div className="mt-6">
              <Link
                to="/login"
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors mr-4"
              >
                Get Started
              </Link>
              <Link
                to="/signup"
                className="inline-block bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>

        {/* Main Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {featureCards.map((card) => (
            <Link
              key={card.id}
              to={card.path}
              className="group block"
            >
              <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 p-8 h-full">
                <div className="text-center">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${card.color} text-white text-2xl mb-6 group-hover:scale-110 transition-transform`}>
                    {card.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {card.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {card.description}
                  </p>
                </div>
                
                <div className="mt-6 text-center">
                  <span className="inline-flex items-center text-blue-600 font-semibold group-hover:text-blue-700 transition-colors">
                    Get Started
                    <svg className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Features Section */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why Choose DSA PathRecommender?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Personalized Learning</h3>
              <p className="text-gray-600">Get recommendations based on your current knowledge and learning style.</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Progress Tracking</h3>
              <p className="text-gray-600">Monitor your progress with detailed analytics and completion rates.</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💡</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Rich Resources</h3>
              <p className="text-gray-600">Access videos, articles, and practice problems from top platforms.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;