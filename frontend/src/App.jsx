import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/auth-context'
import { ThemeProvider } from './context/theme-context'
import ProtectedRoute from './components/layout/protected-route'
import RoleDashboard from './components/layout/role-dashboard'
import DashboardLayout from './components/layout/dashboard-layout'
import AdminLayout from './admin/components/AdminLayout'

import LandingPage from './pages/landing-page'
import LoginPage from './pages/login-page'
import StaffLoginPage from './pages/staff-login'
import RegisterPage from './pages/register-page'
import PortalPage from './pages/portal-page'
import ResetPasswordPage from './pages/reset-password'
import BrowsePage from './pages/browse-page'
import DoctorProfilePage from './pages/doctor-profile-page'
import AppointmentsPage from './pages/appointment-page'
import MedicalRecordsPage from './pages/medical-records-page'
import AppointmentDetailPage from './pages/appointment-detail'
import ProfilePage from './pages/profile-page'

import DoctorsAdminPage from './admin/pages/Doctors'

import StaffDashboardPage from './pages/staff-dashboard' // eslint-disable-line no-unused-vars
import StaffCheckInPage from './pages/staff-check-in'
import StaffQueuePage from './pages/staff-queue'
import StaffAppointmentsPage from './pages/staff-appointments'
import StaffRegistrationPage from './pages/staff-registration'

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/staff/login" element={<StaffLoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/portal" element={<PortalPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/doctors" element={<DashboardLayout><BrowsePage /></DashboardLayout>} />
          <Route path="/doctors/:id" element={<DashboardLayout><DoctorProfilePage /></DashboardLayout>} />

          <Route path="/dashboard" element={<ProtectedRoute><RoleDashboard /></ProtectedRoute>} />
          <Route path="/staff/dashboard" element={<ProtectedRoute><RoleDashboard /></ProtectedRoute>} />
          <Route path="/staff/login" element={<StaffLoginPage />} />
          <Route path="/staff/check-in" element={<ProtectedRoute><StaffCheckInPage /></ProtectedRoute>} />
          <Route path="/staff/queue" element={<ProtectedRoute><StaffQueuePage /></ProtectedRoute>} />
          <Route path="/staff/appointments" element={<ProtectedRoute><StaffAppointmentsPage /></ProtectedRoute>} />
          <Route path="/staff/register" element={<ProtectedRoute><StaffRegistrationPage /></ProtectedRoute>} />

          <Route path="/appointments" element={<AppointmentsPage />} />
          <Route path="/appointments/:id" element={<AppointmentDetailPage />} />
          <Route path="/medical-records" element={<MedicalRecordsPage />} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<DoctorsAdminPage />} />
            <Route path="doctors" element={<DoctorsAdminPage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </ThemeProvider>
  )
}
