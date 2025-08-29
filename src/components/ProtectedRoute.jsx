import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();
  
  // If no user is logged in, don't show the protected content
  if (!currentUser) {
    return null;
  }
  
  // If user is logged in, show the protected content
  return children;
};

export default ProtectedRoute;
