// src/utils/RequireAuth.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

export default function RequireAuth({ children }) {
  const token = localStorage.getItem('token');
  const isGuest = localStorage.getItem('guest') === 'true';

  if (!token && !isGuest) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
