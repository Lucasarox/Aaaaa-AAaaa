import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ProfileSetup from './pages/ProfileSetup';
import RouteDetails from './pages/RouteDetails';
import Navbar from './components/Navbar';
import Settings from './pages/Settings';
import Notifications from './pages/Notifications';

function AppRoutes() {
  const { user, profile, loading, isAuthReady } = useAuth();

  if (!isAuthReady || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-zinc-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-zinc-900"></div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  if (!profile) {
    return <ProfileSetup />;
  }

  return (
    <div className="min-h-screen bg-zinc-50 pb-20">
      <Navbar />
      <main className="max-w-md mx-auto p-4">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/route/:id" element={<RouteDetails />} />
          <Route path="/profile" element={<ProfileSetup isEditing />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}
