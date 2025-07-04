import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthForm from '../components/Auth/AuthForm';

import { useAuth } from '../contexts/AuthContext';

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Changed from useHistory
  const { login: authLogin, register: authRegister } = useAuth();

  const handleSubmit = async (credentials: { username: string; password: string; email?: string }) => {
    try {
      if (isLogin) {
        await authLogin(credentials.username, credentials.password);
      } else {
        await authRegister(credentials.username, credentials.password, credentials.email!);
      }
      navigate('/home');
    } catch (err) {
      setError('Authentication failed. Please try again.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-6 text-center">
          {isLogin ? 'Login' : 'Sign Up'}
        </h1>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <AuthForm type={isLogin ? 'login' : 'signup'} onSubmit={handleSubmit} />
        <div className="mt-4 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-600 hover:underline"
          >
            {isLogin ? 'Create an account' : 'Already have an account?'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
