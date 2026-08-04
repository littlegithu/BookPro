import { useAuth } from '../../context/auth-context'
import DashboardPage from '../../pages/dashboard'
import DoctorDashboardPage from '../../pages/doctor/dashboard'
import StaffDashboardPage from '../../pages/staff-dashboard'
import HospitalDashboardPage from '../../pages/hospital-dashboard'

export default function RoleDashboard() {
  const { user, isStaff, staffRole, isHospital } = useAuth()

  if (isStaff && staffRole()) return <StaffDashboardPage />
  if (isHospital && isHospital()) return <HospitalDashboardPage />
  if (user?.role === 'doctor' || user?.doctor) return <DoctorDashboardPage />
  return <DashboardPage />
}