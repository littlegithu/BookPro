import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/auth-context'
import { ThemeProvider } from './context/theme-context'
import ProtectedRoute from './components/layout/protected-route'
import DashboardLayout from './components/layout/dashboard-layout'

import LandingPage from './pages/landing-page'
import LoginPage from './pages/login-page'
import RegisterPage from './pages/register-page'
import ResetPasswordPage from './pages/reset-password'
import BrowsePage from './pages/browse-page'
import DoctorProfilePage from './pages/doctor-profile-page'
import DashboardPage from './pages/dashboard'
import AppointmentsPage from './pages/appointment-page'
import MedicalRecordsPage from './pages/medical-records-page'
import AppointmentDetailPage from './pages/appointment-detail'
import ProfilePage from './pages/profile-page'

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/doctors" element={<DashboardLayout><BrowsePage /></DashboardLayout>} />
          <Route path="/doctors/:id" element={<DashboardLayout><DoctorProfilePage /></DashboardLayout>} />

          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/appointments" element={<AppointmentsPage />} />
          <Route path="/appointments/:id" element={<AppointmentDetailPage />} />
          <Route path="/medical-records" element={<MedicalRecordsPage />} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        </Routes>
      </AuthProvider>
    </ThemeProvider>
  )
}
