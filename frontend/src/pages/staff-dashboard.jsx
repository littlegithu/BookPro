import { useState, useEffect } from 'react'
import { Calendar, CheckCircle, User, Stethoscope, AlertCircle, Microscope, CreditCard, FileText, Hospital } from 'lucide-react'
import StaffDashboardLayout from '../components/layout/staff-dashboard-layout'
import Topbar from '../components/layout/topbar'
import { useAuth } from '../context/auth-context'
import { fetchStaffDashboard } from '../services/api'

export default function StaffDashboardPage() {
  const { user, isAuthenticated } = useAuth()
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadDashboard() {
      setLoading(true)
      try {
        const data = await fetchStaffDashboard()
        setDashboardData(data)
      } catch (err) {
        console.error('Failed to load staff dashboard:', err)
        setError(err.message || 'Failed to load dashboard data')
      } finally {
        setLoading(false)
      }
    }
    loadDashboard()
  }, [isAuthenticated])

  if (loading) {
    return (
      <StaffDashboardLayout>
        <Topbar title="Staff Dashboard" subtitle="Loading..." />
        <div className="p-7">
          <div className="flex items-center justify-center py-20">
            <span className="inline-block w-10 h-10 border-3 border-teal border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      </StaffDashboardLayout>
    )
  }

  const staffName = (user?.staff?.first_name || user?.first_name || user?.name?.split(' ')[0] || 'Staff') + ' ' + 
                    (user?.staff?.last_name || user?.last_name || '').trim()
  const staffRole = user?.staff?.role || user?.role || 'Receptionist'
  const roleData = dashboardData || {}

  if (error) {
    return (
      <StaffDashboardLayout>
        <Topbar title="Staff Dashboard" subtitle="" />
        <div className="p-7">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 flex items-center gap-3 text-red-700">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
          <div className="bg-card rounded-lg border border-border p-5">
            <h2 className="font-display font-semibold text-navy mb-4">Staff Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-surface rounded-lg p-4">
                <p className="text-[12px] text-slate-light mb-1">Employee ID</p>
                <p className="text-navy font-medium">{roleData.employee_id || '—'}</p>
              </div>
              <div className="bg-surface rounded-lg p-4">
                <p className="text-[12px] text-slate-light mb-1">Department</p>
                <p className="text-navy font-medium">{roleData.department || '—'}</p>
              </div>
            </div>
          </div>
        </div>
      </StaffDashboardLayout>
    )
  }

  const renderRoleSpecificSection = () => {
    switch (staffRole) {
      case 'Nurse':
        return (
          <div className="bg-card rounded-lg border border-border p-5">
            <h2 className="font-display font-semibold text-navy text-[17px] mb-4 flex items-center gap-2">
              <User size={18} />
              Nurse Dashboard
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="bg-surface rounded-lg p-3">
                <p className="text-[12px] text-slate-light mb-1">My Patients Today</p>
                <p className="text-navy font-bold text-[22px]">{roleData.nurse_data?.my_patients_count || 0}</p>
              </div>
              <div className="bg-surface rounded-lg p-3">
                <p className="text-[12px] text-slate-light mb-1">Patients Seen</p>
                <p className="text-navy font-bold text-[22px]">{roleData.nurse_data?.patients_seen_today || 0}</p>
              </div>
            </div>
            {roleData.nurse_data?.upcoming_appointments && roleData.nurse_data.upcoming_appointments.length > 0 && (
              <div>
                <p className="text-[12px] text-slate-light mb-2">Upcoming Appointments</p>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {roleData.nurse_data.upcoming_appointments.map((appt, idx) => (
                    <div key={idx} className="bg-surface rounded-lg p-3 flex justify-between items-center">
                      <div>
                        <p className="text-navy font-medium">{appt.patient_name}</p>
                        <p className="text-[12px] text-slate-light">{appt.appointment_time}</p>
                      </div>
                      <span className="text-[12px] px-2 py-1 rounded" style={{
                        backgroundColor: appt.status === 'Checked In' ? '#FCE8E8' : '#FFF5E6',
                        color: appt.status === 'Checked In' ? '#C53030' : '#9B552D'
                      }}>
                        {appt.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )

      case 'Lab Technician':
        return (
          <div className="bg-card rounded-lg border border-border p-5">
            <h2 className="font-display font-semibold text-navy text-[17px] mb-4 flex items-center gap-2">
              <Microscope size={18} />
              Lab Technician Dashboard
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-surface rounded-lg p-3 text-center">
                <p className="text-[24px] font-bold text-navy">{roleData.lab_data?.pending_tests || 0}</p>
                <p className="text-[12px] text-slate-light">Pending Tests</p>
              </div>
              <div className="bg-surface rounded-lg p-3 text-center">
                <p className="text-[24px] font-bold text-navy">{roleData.lab_data?.tests_today || 0}</p>
                <p className="text-[12px] text-slate-light">Tests Today</p>
              </div>
              <div className="bg-surface rounded-lg p-3 text-center">
                <p className="text-[24px] font-bold text-navy">{roleData.lab_data?.total_tests || 0}</p>
                <p className="text-[12px] text-slate-light">Total Tests</p>
              </div>
            </div>
          </div>
        )

      case 'Pharmacist':
        return (
          <div className="bg-card rounded-lg border border-border p-5">
            <h2 className="font-display font-semibold text-navy text-[17px] mb-4 flex items-center gap-2">
              <CreditCard size={18} />
              Pharmacist Dashboard
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-surface rounded-lg p-3 text-center">
                <p className="text-[24px] font-bold text-navy">{roleData.pharmacy_data?.pending_prescriptions || 0}</p>
                <p className="text-[12px] text-slate-light">Pending Prescriptions</p>
              </div>
              <div className="bg-surface rounded-lg p-3 text-center">
                <p className="text-[24px] font-bold text-navy">{roleData.pharmacy_data?.dispensed_today || 0}</p>
                <p className="text-[12px] text-slate-light">Dispensed Today</p>
              </div>
              <div className="bg-surface rounded-lg p-3 text-center">
                <p className="text-[24px] font-bold text-navy">{roleData.pharmacy_data?.completed_today || 0}</p>
                <p className="text-[12px] text-slate-light">Completed Today</p>
              </div>
            </div>
          </div>
        )

      case 'Cashier':
        return (
          <div className="bg-card rounded-lg border border-border p-5">
            <h2 className="font-display font-semibold text-navy text-[17px] mb-4 flex items-center gap-2">
              <CreditCard size={18} />
              Cashier Dashboard
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-surface rounded-lg p-3 text-center">
                <p className="text-[24px] font-bold text-navy">{roleData.billing_data?.pending_payments || 0}</p>
                <p className="text-[12px] text-slate-light">Pending Payments</p>
              </div>
              <div className="bg-surface rounded-lg p-3 text-center">
                <p className="text-[24px] font-bold text-navy">{roleData.billing_data?.payments_today || 0}</p>
                <p className="text-[12px] text-slate-light">Payments Today</p>
              </div>
              <div className="bg-surface rounded-lg p-3 text-center">
                <p className="text-[24px] font-bold text-navy">KSh {roleData.billing_data?.outstanding_balance || 0}</p>
                <p className="text-[12px] text-slate-light">Outstanding</p>
              </div>
            </div>
          </div>
        )

      case 'Records Officer':
        return (
          <div className="bg-card rounded-lg border border-border p-5">
            <h2 className="font-display font-semibold text-navy text-[17px] mb-4 flex items-center gap-2">
              <Hospital size={18} />
              Records Officer Dashboard
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="bg-surface rounded-lg p-3 text-center">
                <p className="text-[24px] font-bold text-navy">{roleData.records_data?.total_records || 0}</p>
                <p className="text-[12px] text-slate-light">Total Records</p>
              </div>
              <div className="bg-surface rounded-lg p-3 text-center">
                <p className="text-[24px] font-bold text-navy">{roleData.records_data?.records_needing_attention || 0}</p>
                <p className="text-[12px] text-slate-light">Needs Attention</p>
              </div>
              <div className="bg-surface rounded-lg p-3 text-center">
                <p className="text-[24px] font-bold text-navy">{roleData.check_ins_today || 0}</p>
                <p className="text-[12px] text-slate-light">Today's Activity</p>
              </div>
            </div>
          </div>
        )

      default:
        return (
          <div className="bg-card rounded-lg border border-border p-5">
            <h2 className="font-display font-semibold text-navy text-[17px] mb-4">Dashboard Summary</h2>
            <div className="text-slate-light text-center py-8">
              <p>Welcome to your {staffRole} dashboard</p>
              <p className="text-[12px] mt-2">Use the sidebar to navigate to specific sections</p>
            </div>
          </div>
        )
    }
  }

  const getQuickActions = () => {
    switch (staffRole) {
      case 'Nurse':
        return [
          { to: '/staff/nurses/patients', label: 'My Patients', icon: <User size={24} /> },
          { to: '/staff/nurses/appointments', label: 'Appointments', icon: <Calendar size={24} /> },
        ]
      case 'Lab Technician':
        return [
          { to: '/staff/lab/orders', label: 'Lab Orders', icon: <Microscope size={24} /> },
          { to: '/staff/lab/results', label: 'Test Results', icon: <FileText size={24} /> },
        ]
      case 'Pharmacist':
        return [
          { to: '/staff/pharmacy/prescriptions', label: 'Prescriptions', icon: <FileText size={24} /> },
          { to: '/staff/pharmacy/medications', label: 'Medications', icon: <CreditCard size={24} /> },
        ]
      case 'Cashier':
        return [
          { to: '/staff/billing', label: 'Billing', icon: <CreditCard size={24} /> },
          { to: '/staff/transactions', label: 'Transactions', icon: <FileText size={24} /> },
        ]
      case 'Records Officer':
        return [
          { to: '/staff/records', label: 'Patient Records', icon: <FileText size={24} /> },
          { to: '/staff/archives', label: 'Archives', icon: <Hospital size={24} /> },
        ]
      default:
        return [
          { to: '/staff/check-in', label: 'Patient Check-In', icon: <Calendar size={24} /> },
          { to: '/staff/queue', label: 'View Queue', icon: <Stethoscope size={24} /> },
        ]
    }
  }

  return (
    <StaffDashboardLayout>
      <Topbar title={`Welcome ${staffName}`} subtitle={staffRole} />
      <div className="p-7 grid grid-cols-[1fr_272px] gap-5 flex-1">
        {/* Left column */}
        <div className="flex flex-col gap-5">
          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3.5">
            <div className="bg-card rounded-lg border border-border p-5 text-center">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-3.5 bg-teal-light"><Calendar size={20} /></div>
              <p className="font-display font-bold text-[24px]">{roleData.appointments_today || 0}</p>
              <p className="text-[12px] text-slate-light">Today's Appointments</p>
            </div>
            <div className="bg-card rounded-lg border border-border p-5 text-center">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-3.5 bg-teal-light"><User size={20} /></div>
              <p className="font-display font-bold text-[24px]">{roleData.today_patients_count || 0}</p>
              <p className="text-[12px] text-slate-light">Today's Patients</p>
            </div>
            <div className="bg-card rounded-lg border border-border p-5 text-center">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-3.5 bg-teal-light"><CheckCircle size={20} /></div>
              <p className="font-display font-bold text-[24px]">{roleData.check_ins_today || 0}</p>
              <p className="text-[12px] text-slate-light">Check-ins Today</p>
            </div>
          </div>

          {/* Role-specific section */}
          {renderRoleSpecificSection()}

          {/* Staff Info */}
          <div className="bg-card rounded-lg border border-border p-5">
            <h2 className="font-display font-semibold text-navy text-[17px] mb-4">Your Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-surface rounded-lg p-4">
                <p className="text-[12px] text-slate-light mb-1">Employee ID</p>
                <p className="text-navy font-medium">{roleData.employee_id || '—'}</p>
              </div>
              <div className="bg-surface rounded-lg p-4">
                <p className="text-[12px] text-slate-light mb-1">Department</p>
                <p className="text-navy font-medium">{roleData.department || '—'}</p>
              </div>
              <div className="bg-surface rounded-lg p-4">
                <p className="text-[12px] text-slate-light mb-1">Role</p>
                <p className="text-navy font-medium">{staffRole}</p>
              </div>
              <div className="bg-surface rounded-lg p-4">
                <p className="text-[12px] text-slate-light mb-1">Hospital</p>
                <p className="text-navy font-medium">{roleData.hospital_name || '—'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-4">
          {/* Today's Stats */}
          <div className="bg-teal rounded-lg p-5">
            <p className="text-[12px] font-medium mb-3.5 text-white/70">Today's Summary</p>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="font-display font-bold text-[24px] text-white">{roleData.appointments_today || 0}</p>
                <p className="text-[10px] mt-0.5 text-white/60">Appointments</p>
              </div>
              <div className="text-center">
                <p className="font-display font-bold text-[24px] text-white">{roleData.today_patients_count || 0}</p>
                <p className="text-[10px] mt-0.5 text-white/60">Patients</p>
              </div>
              <div className="text-center">
                <p className="font-display font-bold text-[24px] text-white">{roleData.pending_tasks_count || 0}</p>
                <p className="text-[10px] mt-0.5 text-white/60">Pending Tasks</p>
              </div>
            </div>
          </div>

          {/* Quick actions based on role */}
          <div className="bg-card rounded-lg border border-border p-5">
            <h2 className="font-display font-semibold text-navy text-[17px] mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-3">
              {getQuickActions().map((action) => (
                <a key={action.to} href={action.to} className="bg-teal text-white p-4 rounded-lg text-center hover:bg-teal-mid transition-colors">
                  {action.icon}
                  <p className="text-sm font-medium mt-2">{action.label}</p>
                </a>
              ))}
            </div>
          </div>

          {/* Profile card */}
          <div className="bg-card rounded-lg border border-border p-5">
            <div className="flex flex-col items-center text-center pb-3.5 border-b border-border mb-3.5">
              <div className="w-13 h-13 rounded-full bg-teal flex items-center justify-center text-white text-[17px] font-semibold mb-2.5 overflow-hidden">
                {user?.profile_image ? (
                  <img src={user.profile_image} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  staffName?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
                )}
              </div>
              <p className="font-display font-semibold text-[16px] text-navy">{staffName}</p>
              <p className="text-[12px] text-slate-light mt-0.5">{staffRole}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-surface rounded-lg p-4">
                <p className="text-[12px] text-slate-light mb-1">Employee ID</p>
                <p className="text-navy font-medium">{roleData.employee_id || '—'}</p>
              </div>
              <div className="bg-surface rounded-lg p-4">
                <p className="text-[12px] text-slate-light mb-1">Department</p>
                <p className="text-navy font-medium">{roleData.department || '—'}</p>
              </div>
              <div className="bg-surface rounded-lg p-4">
                <p className="text-[12px] text-slate-light mb-1">Role</p>
                <p className="text-navy font-medium">{staffRole}</p>
              </div>
              <div className="bg-surface rounded-lg p-4">
                <p className="text-[12px] text-slate-light mb-1">Hospital</p>
                <p className="text-navy font-medium">{roleData.hospital_name || '—'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </StaffDashboardLayout>
  )
}