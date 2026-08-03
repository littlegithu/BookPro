import { useAuth } from '../../context/auth-context'
import DoctorDashboardLayout from '../components/layout/doctor-dashboard-layout'
import DoctorDashboardPage from '../../pages/doctor/dashboard'
import DoctorSchedulePage from '../../pages/doctor/schedule'
import DoctorAppointmentsPage from '../../pages/doctor/appointments'
import DoctorPatientsPage from '../../pages/doctor/patients'
import DoctorMedicalRecordsPage from '../../pages/doctor/medical-records'
import DoctorPrescriptionsPage from '../../pages/doctor/prescriptions'
import DoctorAvailabilityPage from '../../pages/doctor/availability'
import DoctorReviewsPage from '../../pages/doctor/reviews'
import DoctorAnalyticsPage from '../../pages/doctor/analytics'
import DoctorHospitalsPage from '../../pages/doctor/hospitals'
import DoctorDocumentsPage from '../../pages/doctor/documents'
import DoctorProfilePage from '../../pages/doctor/profile'
import DoctorSettingsPage from '../../pages/doctor/settings'
import DoctorNotificationsPage from '../../pages/doctor/notifications'

export default function RoleDashboard() {
  const { user, isStaff, staffRole } = useAuth()

  if (isStaff && staffRole()) return <StaffDashboardPage />
  if (user?.role === 'doctor') return <DoctorDashboardPage />
  return <DashboardPage />
}