import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();
  
  // If no user is logged in, redirect to login
  if (!currentUser) {
    return <Navigate to="/" replace />;
  }
  
  // If user is logged in, show the protected content
  return children;
};

export default ProtectedRoute;