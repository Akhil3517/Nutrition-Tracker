
import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { toast } from "../hooks/use-toast";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const user = localStorage.getItem('user');
  const location = useLocation();
  
  useEffect(() => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to view this page.",
        variant: "destructive",
      });
    }
  }, [user]);

  if (!user) {
    // Redirect to login page if not authenticated
    // Save the location they were trying to go to
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
