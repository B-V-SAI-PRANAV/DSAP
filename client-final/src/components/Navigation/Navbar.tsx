import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getUserDetailedProgress, getAllTopics } from '../../services/api';
import { useEffect, useState } from 'react';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();




  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-8">
          <Link to="/home" className="flex items-center">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mr-2">
              <span className="text-blue-600 font-bold text-xl">DSAR</span>
            </div>
            <span className="font-bold text-xl">DSA Recommender</span>
          </Link>
          
          {user && (
            <div className="hidden md:flex flex-col space-y-2">
              <div className="flex space-x-6">
                <Link 
                  to="/home" 
                  className={`hover:text-blue-200 transition ${location.pathname === '/home' ? 'font-semibold underline' : ''}`}
                >
                  Home
                </Link>
                <Link 
                  to="/progress" 
                  className={`hover:text-blue-200 transition ${location.pathname === '/progress' ? 'font-semibold underline' : ''}`}
                >
                  Your Progress
                </Link>
              </div>
            </div>
          )}
        </div>

        {user ? (
          <div className="flex items-center space-x-4">
            <span className="hidden sm:inline">Welcome, {user.username}</span>
            {user.role === 'admin' && (
              <Link 
                to="/admin-dashboard"
                className="bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded-md transition"
              >
                Admin Dashboard
              </Link>
            )}
            <Link 
              to="/profile"
              className="bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded-md transition flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.25a8.25 8.25 0 1115 0v.75a.75.75 0 01-.75.75h-13.5a.75.75 0 01-.75-.75v-.75z" />
              </svg>
              <span>{user.username}</span>
            </Link>
            <button 
              onClick={logout}
              className="bg-white text-blue-600 hover:bg-gray-100 px-4 py-2 rounded-md transition"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex space-x-3">
            <Link 
              to="/login" 
              className="bg-white text-blue-600 hover:bg-gray-100 px-4 py-2 rounded-md transition"
            >
              Login
            </Link>
            <Link 
              to="/signup" 
              className="bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded-md transition"
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
