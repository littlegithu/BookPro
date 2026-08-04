import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/auth-context'
import { ThemeProvider } from './context/theme-context'
import ProtectedRoute from './components/layout/protected-route'
import StaffProtectedRoute from './components/layout/staff-protected-route'
import RoleDashboard from './components/layout/role-dashboard'
import AdminLayout from './admin/components/AdminLayout'

import LandingPage from './pages/landing-page'
import AboutPage from './pages/about-page'
import PrivacyPolicyPage from './pages/privacy-policy-page'
import TermsOfUsePage from './pages/terms-of-use-page'
import CookiePolicyPage from './pages/cookie-policy-page'
import ContactPage from './pages/contact-page'
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

import StaffDashboardPage from './pages/staff-dashboard'
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

import HospitalDashboardPage from './pages/hospital-dashboard'

import DoctorDashboardPage from './pages/doctor/dashboard'
import DoctorSchedulePage from './pages/doctor/schedule'
import DoctorAppointmentsPage from './pages/doctor/appointments'
import DoctorPatientsPage from './pages/doctor/patients'
import DoctorMedicalRecordsPage from './pages/doctor/medical-records'
import DoctorPrescriptionsPage from './pages/doctor/prescriptions'
import DoctorAvailabilityPage from './pages/doctor/availability'
import DoctorReviewsPage from './pages/doctor/reviews'
import DoctorAnalyticsPage from './pages/doctor/analytics'
import DoctorHospitalsPage from './pages/doctor/hospitals'
import DoctorDocumentsPage from './pages/doctor/documents'
import DoctorProfileSettingsPage from './pages/doctor/profile-settings'
import DoctorSettingsPage from './pages/doctor/settings'
import DoctorNotificationsPage from './pages/doctor/notifications'
import DoctorConsultationPage from './pages/doctor/consultation'
import DoctorMessagesPage from './pages/doctor/messages'

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/terms-of-use" element={<TermsOfUsePage />} />
          <Route path="/cookie-policy" element={<CookiePolicyPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/staff/login" element={<StaffLoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/portal" element={<PortalPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/doctors" element={<BrowsePage />} />
          <Route path="/doctors/:id" element={<DoctorProfilePage />} />

          <Route path="/dashboard" element={<ProtectedRoute><RoleDashboard /></ProtectedRoute>} />
          <Route path="/staff/dashboard" element={<StaffProtectedRoute><RoleDashboard /></StaffProtectedRoute>} />
          <Route path="/staff/login" element={<StaffLoginPage />} />
          <Route path="/staff/check-in" element={<StaffProtectedRoute><StaffCheckInPage /></StaffProtectedRoute>} />
          <Route path="/staff/queue" element={<StaffProtectedRoute><StaffQueuePage /></StaffProtectedRoute>} />
          <Route path="/staff/appointments" element={<StaffProtectedRoute><StaffAppointmentsPage /></StaffProtectedRoute>} />
          <Route path="/staff/register" element={<StaffProtectedRoute><StaffRegistrationPage /></StaffProtectedRoute>} />
          <Route path="/staff/profile" element={<StaffProtectedRoute><StaffProfilePage /></StaffProtectedRoute>} />
          <Route path="/staff/settings" element={<StaffProtectedRoute><StaffSettingsPage /></StaffProtectedRoute>} />
          <Route path="/staff/departments" element={<StaffProtectedRoute><StaffDepartmentsPage /></StaffProtectedRoute>} />
          <Route path="/staff/patients" element={<StaffProtectedRoute><StaffPatientsPage /></StaffProtectedRoute>} />
          <Route path="/staff/doctors" element={<StaffProtectedRoute><StaffDoctorsPage /></StaffProtectedRoute>} />
          <Route path="/staff/notifications" element={<StaffProtectedRoute><StaffNotificationsPage /></StaffProtectedRoute>} />
          <Route path="/staff/billing" element={<StaffProtectedRoute><StaffBillingPage /></StaffProtectedRoute>} />
          <Route path="/staff/reports" element={<StaffProtectedRoute><StaffReportsPage /></StaffProtectedRoute>} />
          <Route path="/staff/lab" element={<StaffProtectedRoute><StaffLabPage /></StaffProtectedRoute>} />
          <Route path="/staff/pharmacy" element={<StaffProtectedRoute><StaffPharmacyPage /></StaffProtectedRoute>} />
          <Route path="/staff/tasks" element={<StaffProtectedRoute><StaffDashboardPage /></StaffProtectedRoute>} />
          <Route path="/staff/transactions" element={<StaffProtectedRoute><StaffDashboardPage /></StaffProtectedRoute>} />
          <Route path="/staff/records" element={<StaffProtectedRoute><StaffDashboardPage /></StaffProtectedRoute>} />
          <Route path="/staff/archives" element={<StaffProtectedRoute><StaffDashboardPage /></StaffProtectedRoute>} />
          <Route path="/staff/management" element={<StaffProtectedRoute><StaffDashboardPage /></StaffProtectedRoute>} />
          <Route path="/staff/nurses/patients" element={<StaffProtectedRoute><StaffDashboardPage /></StaffProtectedRoute>} />
          <Route path="/staff/nurses/appointments" element={<StaffProtectedRoute><StaffDashboardPage /></StaffProtectedRoute>} />
          <Route path="/staff/lab/orders" element={<StaffProtectedRoute><StaffDashboardPage /></StaffProtectedRoute>} />
          <Route path="/staff/lab/results" element={<StaffProtectedRoute><StaffDashboardPage /></StaffProtectedRoute>} />
          <Route path="/staff/pharmacy/prescriptions" element={<StaffProtectedRoute><StaffDashboardPage /></StaffProtectedRoute>} />
          <Route path="/staff/pharmacy/medications" element={<StaffProtectedRoute><StaffDashboardPage /></StaffProtectedRoute>} />
          <Route path="/hospital/dashboard" element={<ProtectedRoute><HospitalDashboardPage /></ProtectedRoute>} />
          <Route path="/hospital/doctors" element={<ProtectedRoute><HospitalDashboardPage /></ProtectedRoute>} />
          <Route path="/hospital/appointments" element={<ProtectedRoute><HospitalDashboardPage /></ProtectedRoute>} />

          <Route path="/doctor/dashboard" element={<ProtectedRoute><DoctorDashboardPage /></ProtectedRoute>} />
          <Route path="/doctor/schedule" element={<ProtectedRoute><DoctorSchedulePage /></ProtectedRoute>} />
          <Route path="/doctor/appointments" element={<ProtectedRoute><DoctorAppointmentsPage /></ProtectedRoute>} />
          <Route path="/doctor/patients" element={<ProtectedRoute><DoctorPatientsPage /></ProtectedRoute>} />
          <Route path="/doctor/medical-records" element={<ProtectedRoute><DoctorMedicalRecordsPage /></ProtectedRoute>} />
          <Route path="/doctor/prescriptions" element={<ProtectedRoute><DoctorPrescriptionsPage /></ProtectedRoute>} />
          <Route path="/doctor/availability" element={<ProtectedRoute><DoctorAvailabilityPage /></ProtectedRoute>} />
          <Route path="/doctor/reviews" element={<ProtectedRoute><DoctorReviewsPage /></ProtectedRoute>} />
          <Route path="/doctor/analytics" element={<ProtectedRoute><DoctorAnalyticsPage /></ProtectedRoute>} />
          <Route path="/doctor/hospitals" element={<ProtectedRoute><DoctorHospitalsPage /></ProtectedRoute>} />
          <Route path="/doctor/documents" element={<ProtectedRoute><DoctorDocumentsPage /></ProtectedRoute>} />
          <Route path="/doctor/profile" element={<ProtectedRoute><DoctorProfileSettingsPage /></ProtectedRoute>} />
          <Route path="/doctor/settings" element={<ProtectedRoute><DoctorSettingsPage /></ProtectedRoute>} />
          <Route path="/doctor/notifications" element={<ProtectedRoute><DoctorNotificationsPage /></ProtectedRoute>} />
          <Route path="/doctor/consultation" element={<ProtectedRoute><DoctorConsultationPage /></ProtectedRoute>} />
          <Route path="/doctor/messages" element={<ProtectedRoute><DoctorMessagesPage /></ProtectedRoute>} />

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
