import { DoctorDashboardLayout } from '../components/layout/doctor-dashboard-layout'
import Topbar from '../components/layout/topbar'

export default function DoctorAppointmentsPage() {
  return (
    <DoctorDashboardLayout>
      <Topbar title="Appointment Management" subtitle="View and manage all your appointments" />
      <div className="p-7">Appointments management page content goes here.</div>
    </DoctorDashboardLayout>
  )
}