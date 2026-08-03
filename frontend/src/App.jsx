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
import StaffProfilePage from './pages/staff-profile'
import StaffSettingsPage from './pages/staff-settings'
import StaffDepartmentsPage from './pages/staff-departments'
import StaffPatientsPage from './pages/staff-patients'
import StaffDoctorsPage from './pages/staff-doctors'
import StaffNotificationsPage from './pages/staff-notifications'
import StaffBillingPage from './pages/staff-billing'
import StaffReportsPage from './pages/staff-reports'
import StaffLabPage from './pages/staff-lab'
import StaffPharmacyPage from './pages/staff-pharmacy'

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
          <Route path="/staff/profile" element={<ProtectedRoute><StaffProfilePage /></ProtectedRoute>} />
          <Route path="/staff/settings" element={<ProtectedRoute><StaffSettingsPage /></ProtectedRoute>} />
          <Route path="/staff/departments" element={<ProtectedRoute><StaffDepartmentsPage /></ProtectedRoute>} />
          <Route path="/staff/patients" element={<ProtectedRoute><StaffPatientsPage /></ProtectedRoute>} />
          <Route path="/staff/doctors" element={<ProtectedRoute><StaffDoctorsPage /></ProtectedRoute>} />
          <Route path="/staff/notifications" element={<ProtectedRoute><StaffNotificationsPage /></ProtectedRoute>} />
          <Route path="/staff/billing" element={<ProtectedRoute><StaffBillingPage /></ProtectedRoute>} />
          <Route path="/staff/reports" element={<ProtectedRoute><StaffReportsPage /></ProtectedRoute>} />
          <Route path="/staff/lab" element={<ProtectedRoute><StaffLabPage /></ProtectedRoute>} />
          <Route path="/staff/pharmacy" element={<ProtectedRoute><StaffPharmacyPage /></ProtectedRoute>} />

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
