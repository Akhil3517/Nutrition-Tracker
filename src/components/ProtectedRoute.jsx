import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { toast } from "../hooks/use-toast";
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();
  const location = useLocation();
  
  useEffect(() => {
    if (!currentUser) {
      toast({
        title: "Authentication required",
        description: "Please log in to view this page.",
        variant: "destructive",
      });
    }
  }, [currentUser]);

  if (!currentUser) {
    // Redirect to login page if not authenticated
    // Save the location they were trying to go to
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
