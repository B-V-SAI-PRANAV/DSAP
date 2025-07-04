// File: src/components/Auth/PrivateRoute.tsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const PrivateRoute: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Or a spinner
  }

  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
