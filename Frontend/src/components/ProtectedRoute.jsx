import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role');

  if (!token) {
    // If not logged in, redirect to index / landing page
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    // If logged in but does not have required role, redirect to their home page if possible
    if (userRole === 'Admin') return <Navigate to="/admin_home" replace />;
    if (userRole === 'Hospital') return <Navigate to="/hospital_home" replace />;
    if (userRole === 'Patient') return <Navigate to="/patient_home" replace />;
    if (userRole === 'Lab') return <Navigate to="/lab_home" replace />;
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
