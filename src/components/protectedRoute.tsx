// components/ProtectedRoute.tsx

import { useAuth } from '@/services/authContext';
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';


const ProtectedRoute = () => {
  const authContext = useAuth();

  // If the auth context is not ready (session is loading), show a loading state
  if (!authContext) {
    return <div>Loading...</div>;
  }

  const { user ,accessToken } = authContext;
 console.log('User in ProtectedRoute:', user);

  // If no user is authenticated, redirect to the /auth page
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // If the user is authenticated, render the protected route (Outlet)
  return <Outlet />;
};

export default ProtectedRoute;
