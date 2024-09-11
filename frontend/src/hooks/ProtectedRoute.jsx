import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from './useAuth'; // Adjust the import

const ProtectedRoute = ({ element, restricted, ...rest }) => {
  const { auth } = useAuth();
  const { isLoggedIn } = auth;

  // If the route is restricted and the user is logged in, redirect to the home page
  if (isLoggedIn && restricted) {
    return <Navigate to="/home" />;
  }

  // If the user is not logged in and the route requires authentication, redirect to login
  if (!isLoggedIn && rest.requireAuth) {
    return <Navigate to="/login" />;
  }

  return element;
};

export default ProtectedRoute;
