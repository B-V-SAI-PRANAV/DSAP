// FileName: MultipleFiles/auth.ts
import api from './api';
import { User } from '../types'; // Import User from consolidated types

const API_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5001/api';

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterCredentials {
  username: string;
  password: string;
  email: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    username: string;
    email: string;
    role: string;
  };
}

export const authService = {
  // Login user
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      const response = await api.post('/auth/login', credentials);
      const { token, user } = response.data;
      
      // Store token and user info
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      return response.data;
    } catch (error: any) {
      console.error('Login error:', error);
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  },

  // Register user
  register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    try {
      const response = await api.post('/auth/register', credentials);
      const { token, user } = response.data;
      
      // Store token and user info
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      return response.data;
    } catch (error: any) {
      console.error('Registration error:', error);
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  },

  // Get current user profile
  getProfile: async () => {
    try {
      const response = await api.get('/auth/profile');
      return response.data;
    } catch (error: any) {
      console.error('Get profile error:', error);
      throw new Error(error.response?.data?.message || 'Failed to get profile');
    }
  },

  // Logout user
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    const token = localStorage.getItem('token');
    return !!token;
  },

  // Get current user
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (error) {
        console.error('Error parsing user from localStorage:', error);
        return null;
      }
    }
    return null;
  },

  // Check if user is admin
  isAdmin: (): boolean => {
    const user = authService.getCurrentUser();
    return user?.role === 'admin';
  },

  // Refresh token (if needed)
  refreshToken: async () => {
    try {
      const response = await api.post('/auth/refresh');
      const { token } = response.data;
      localStorage.setItem('token', token);
      return token;
    } catch (error: any) {
      console.error('Token refresh error:', error);
      authService.logout();
      throw new Error('Token refresh failed');
    }
  },
};

export default authService;
