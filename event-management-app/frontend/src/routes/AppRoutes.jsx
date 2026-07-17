import { Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute.jsx';
import { HomeRedirect, RoleRoute } from './RoleRoute.jsx';
import { AdminLayout } from '../layouts/AdminLayout.jsx';
import { AdminRecordsPage } from '../pages/AdminRecordsPage.jsx';
import { DashboardPage } from '../pages/DashboardPage.jsx';
import { EventDetailPage } from '../pages/EventDetailPage.jsx';
import { EventExplorePage } from '../pages/EventExplorePage.jsx';
import { EventFormPage } from '../pages/EventFormPage.jsx';
import { EventReportPage } from '../pages/EventReportPage.jsx';
import { EventsListPage } from '../pages/EventsListPage.jsx';
import { ForgotPasswordPage } from '../pages/ForgotPasswordPage.jsx';
import { LoginPage } from '../pages/LoginPage.jsx';
import { NotFoundPage } from '../pages/NotFoundPage.jsx';
import { ProfilePage } from '../pages/ProfilePage.jsx';
import { ResendVerificationPage } from '../pages/ResendVerificationPage.jsx';
import { RegisterPage } from '../pages/RegisterPage.jsx';
import { RegistrationsPage } from '../pages/RegistrationsPage.jsx';
import { ResetPasswordPage } from '../pages/ResetPasswordPage.jsx';
import { SummaryPage } from '../pages/SummaryPage.jsx';
import { VerifyEmailPage } from '../pages/VerifyEmailPage.jsx';
import { adminOnly, userOnly } from '../utils/roles.js';

export function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <HomeRedirect />
          </ProtectedRoute>
        }
      />
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
              <RoleRoute allow={userOnly}>
                <DashboardPage />
              </RoleRoute>
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/events"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <RoleRoute allow={userOnly}>
                <EventsListPage />
              </RoleRoute>
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/events/new"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <RoleRoute allow={userOnly}>
                <EventFormPage />
              </RoleRoute>
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/events/explore"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <RoleRoute allow={userOnly}>
                <EventExplorePage />
              </RoleRoute>
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/events/:id"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <RoleRoute allow={userOnly}>
                <EventDetailPage />
              </RoleRoute>
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/events/:id/edit"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <RoleRoute allow={userOnly}>
                <EventFormPage />
              </RoleRoute>
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/registrations"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <RoleRoute allow={userOnly}>
                <RegistrationsPage />
              </RoleRoute>
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/records"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <RoleRoute allow={adminOnly}>
                <AdminRecordsPage />
              </RoleRoute>
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <ProfilePage />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/availability"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <RoleRoute allow={userOnly}>
                <EventReportPage type="available" />
              </RoleRoute>
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/full-events"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <RoleRoute allow={userOnly}>
                <EventReportPage type="full" />
              </RoleRoute>
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/summary"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <RoleRoute allow={userOnly}>
                <SummaryPage />
              </RoleRoute>
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/events/:id/attendees"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <RoleRoute allow={userOnly}>
                <RegistrationsPage />
              </RoleRoute>
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
