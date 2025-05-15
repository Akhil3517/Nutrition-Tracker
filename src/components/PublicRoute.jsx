import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const PublicRoute = ({ children }) => {
  const { currentUser } = useAuth();
  const location = useLocation();

  if (currentUser) {
    // If user is authenticated, redirect to the page they were trying to access
    // or to dashboard if no specific page was requested
    const from = location.state?.from?.pathname || '/dashboard';
    return <Navigate to={from} replace />;
  }

  return <>{children}</>;
};

export default PublicRoute; 