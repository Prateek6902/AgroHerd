// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import AnimalPage from './components/AnimalPage';
import ProductPage from './components/ProductPage';
import ShedManagerPage from './components/ShedManagerPage';
import FeedingSchedulePage from './components/FeedingSchedulePage';
import AnalyticsPage from './components/AnalyticsPage';

import LoginPage from './auth/LoginPage';
import RegisterPage from './auth/RegisterPage';
import RequireAuth from './utils/RequireAuth';
import { getName } from './utils/auth';

function AuthenticatedLayout() {
  const name = getName();

  return (
    <div className="flex w-full">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-6">
        <Header user={{ name, avatar: '/icons/farmer-avatar.png' }} />
        <Routes>
          {/* Redirect root to dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" />} />

          {/* Dashboard and animal routes */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/cow" element={<AnimalPage type="cow" />} />
          <Route path="/pig" element={<AnimalPage type="pig" />} />
          <Route path="/sheep" element={<AnimalPage type="sheep" />} />
          <Route path="/hen" element={<AnimalPage type="hen" />} />
          <Route path="/buffalo" element={<AnimalPage type="buffalo" />} />
          <Route path="/goat" element={<AnimalPage type="goat" />} /> {/* ✅ Added goat */}

          {/* Other management pages */}
          <Route path="/products" element={<ProductPage />} />
          <Route path="/shed" element={<ShedManagerPage />} />
          <Route path="/feeding" element={<FeedingSchedulePage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />

          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Public auth pages */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected app pages */}
        <Route
          path="/*"
          element={
            <RequireAuth>
              <AuthenticatedLayout />
            </RequireAuth>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
