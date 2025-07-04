import React, { useState } from 'react';

interface AuthFormProps {
  type: 'login' | 'signup';
  onSubmit: (credentials: { username: string; password: string }) => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ type, onSubmit }) => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
    email: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(credentials);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="username" className="block text-sm font-medium text-gray-700">
          Username
        </label>
        <input
          type="text"
          id="username"
          name="username"
          value={credentials.username}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
          required
        />
      </div>
      {type === 'signup' && (
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={credentials.email}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
            required
          />
        </div>
      )}
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          type="password"
          id="password"
          name="password"
          value={credentials.password}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
          required
        />
      </div>
      
      <button
        type="submit"
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        {type === 'login' ? 'Sign In' : 'Sign Up'}
      </button>
    </form>
  );
};

export default AuthForm;
