import { Navigate, Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute.jsx';
import { AdminLayout } from '../layouts/AdminLayout.jsx';
import { DashboardPage } from '../pages/DashboardPage.jsx';
import { EventDetailPage } from '../pages/EventDetailPage.jsx';
import { EventExplorePage } from '../pages/EventExplorePage.jsx';
import { EventFormPage } from '../pages/EventFormPage.jsx';
import { EventsListPage } from '../pages/EventsListPage.jsx';
import { ForgotPasswordPage } from '../pages/ForgotPasswordPage.jsx';
import { LoginPage } from '../pages/LoginPage.jsx';
import { NotFoundPage } from '../pages/NotFoundPage.jsx';
import { ResendVerificationPage } from '../pages/ResendVerificationPage.jsx';
import { RegisterPage } from '../pages/RegisterPage.jsx';
import { RegistrationsPage } from '../pages/RegistrationsPage.jsx';
import { ResetPasswordPage } from '../pages/ResetPasswordPage.jsx';
import { VerifyEmailPage } from '../pages/VerifyEmailPage.jsx';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/verify-email" element={<VerifyEmailPage />} />
      <Route path="/resend-verification" element={<ResendVerificationPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <DashboardPage />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/events"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <EventsListPage />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/events/new"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <EventFormPage />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/events/explore"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <EventExplorePage />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/events/:id"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <EventDetailPage />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/events/:id/edit"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <EventFormPage />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/registrations"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <RegistrationsPage />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/events/:id/attendees"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <RegistrationsPage />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
