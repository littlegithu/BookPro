import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/auth-context'
import ProtectedRoute from './components/layout/protected-route'

import LandingPage from './pages/landing-page'
import LoginPage from './pages/login-page'
import RegisterPage from './pages/register-page'
import ResetPasswordPage from './pages/reset-password'
import BrowsePage from './pages/browse-page'
import DoctorProfilePage from './pages/doctor-profile-page'
import DashboardPage from './pages/dashboard'
import AppointmentsPage from './pages/appointment-page'
import AppointmentDetailPage from './pages/appointment-detail'
import ProfilePage from './pages/profile-page'

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/doctors" element={<BrowsePage />} />
        <Route path="/doctors/:id" element={<DoctorProfilePage />} />

        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/appointments" element={<ProtectedRoute><AppointmentsPage /></ProtectedRoute>} />
        <Route path="/appointments/:id" element={<ProtectedRoute><AppointmentDetailPage /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
      </Routes>
    </AuthProvider>
  )
}
