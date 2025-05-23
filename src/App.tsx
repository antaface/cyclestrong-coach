
import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"

import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import ProgramPage from './pages/ProgramPage';
import WorkoutPage from './pages/WorkoutPage';
import CalendarPage from './pages/CalendarPage';
import HabitHistoryPage from './pages/HabitHistoryPage';
import OnboardingPage from './pages/OnboardingPage';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import FormCheckPage from './pages/FormCheckPage';

function App() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <AuthProvider>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
        <Routes>
          {/* Redirect root to landing */}
          <Route path="/" element={<Navigate to="/landing" replace />} />
          
          {/* Public routes */}
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/auth" element={<AuthPage />} />
          
          {/* Apply ProtectedRoute to both onboarding and other authenticated routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/onboarding" element={<OnboardingPage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/program" element={<ProgramPage />} />
            <Route path="/workout" element={<WorkoutPage />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/habit-history" element={<HabitHistoryPage />} />
            <Route path="/form-check" element={<FormCheckPage />} />
          </Route>
          
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
