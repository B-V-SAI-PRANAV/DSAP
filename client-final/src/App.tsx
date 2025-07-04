// File: src/App.tsx
import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet
} from 'react-router-dom';

import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ReactQueryProvider } from './lib/react-query';
import SetupCheck from './components/Auth/SetupCheck';

import Navbar from './components/Navigation/Navbar';

import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import KnownTopicsPage from './pages/KnownTopicsPage';
import LearningPathPage from './pages/LearningPathPage';
import TopicDetailPage from './pages/TopicDetailPage';
import ProblemsPage from './pages/ProblemsPage';
import CompletionPage from './pages/CompletionPage';
import SubmissionPage from './pages/SubmissionPage';
import ProfilePage from './pages/ProfilePage';
import ProgressPage from './pages/ProgressPage';
import MasteryPlanPage from './pages/MasteryPlanPage';
import MasteryTopicPage from './pages/MasteryTopicPage';
import ResourcePage from './pages/ResourcePage';
import SettingsPage from './pages/SettingsPage';
import DashboardPage from './pages/DashboardPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import NotFoundPage from './pages/NotFoundPage';
import ScratchPage from './pages/ScratchPage';

// Chart.js setup
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <ReactQueryProvider>
          <Navbar />
          <main className="pt-16">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Navigate to="/home" />} />
              <Route path="/home" element={<HomePage />} />
              <Route path="/login" element={<AuthPage />} />
              <Route path="/signup" element={<AuthPage />} />

              {/* Private Routes */}
              <Route element={<PrivateRouteWrapper />}>
                <Route path="/dashboard" element={
                  <SetupCheck>
                    <DashboardPage />
                  </SetupCheck>
                } />
                <Route path="/known-topics" element={<KnownTopicsPage />} />
                <Route path="/learning-path" element={
                  <SetupCheck>
                    <LearningPathPage />
                  </SetupCheck>
                } />
                <Route path="/topic/:id" element={
                  <SetupCheck>
                    <TopicDetailPage />
                  </SetupCheck>
                } />
                <Route path="/problems/:topicId" element={
                  <SetupCheck>
                    <ProblemsPage />
                  </SetupCheck>
                } />
                <Route path="/completion" element={
                  <SetupCheck>
                    <CompletionPage />
                  </SetupCheck>
                } />
                <Route path="/submit/:problemId" element={
                  <SetupCheck>
                    <SubmissionPage />
                  </SetupCheck>
                } />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/progress" element={
                  <SetupCheck>
                    <ProgressPage />
                  </SetupCheck>
                } />
                <Route path="/mastery-plan" element={<MasteryPlanPage />} />
                <Route path="/mastery/:topicId" element={<MasteryTopicPage />} />
                <Route path="/resources/:topicId" element={
                  <SetupCheck>
                    <ResourcePage />
                  </SetupCheck>
                } />
                <Route path="/settings" element={
                  <SetupCheck>
                    <SettingsPage />
                  </SetupCheck>
                } />
                <Route path="/admin-dashboard" element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                } />
                <Route path="/start-from-scratch" element={<ScratchPage />} />
              </Route>

              {/* 404 */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
        </ReactQueryProvider>
      </AuthProvider>
    </Router>
  );
};

const PrivateRouteWrapper: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'admin') return <Navigate to="/home" replace />;
  return <>{children}</>;
};

export default App;
