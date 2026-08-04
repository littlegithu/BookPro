import { useState, useEffect } from 'react'
import { Calendar, CheckCircle, User, Stethoscope, AlertCircle } from 'lucide-react'
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

  // Use local user data if API data unavailable
  const staffName = (user?.staff?.first_name || user?.first_name || user?.name?.split(' ')[0] || 'Staff') + ' ' + 
                    (user?.staff?.last_name || user?.last_name || '').trim()
  const staffRole = user?.staff?.role || user?.role || 'Receptionist'
  const staffData = dashboardData || {
    appointments_today: 0,
    today_patients_count: 0,
    check_ins_today: 0,
    pending_tasks_count: 0,
    department: user?.staff?.department || '',
    hospital_name: user?.staff?.hospital_name || '',
    employee_id: user?.staff?.employee_id || ''
  }

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
                <p className="text-navy font-medium">{staffData.employee_id || '—'}</p>
              </div>
              <div className="bg-surface rounded-lg p-4">
                <p className="text-[12px] text-slate-light mb-1">Department</p>
                <p className="text-navy font-medium">{staffData.department || '—'}</p>
              </div>
            </div>
          </div>
        </div>
      </StaffDashboardLayout>
    )
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
              <p className="font-display font-bold text-[24px]">{staffData.appointments_today || 0}</p>
              <p className="text-[12px] text-slate-light">Today's Appointments</p>
            </div>
            <div className="bg-card rounded-lg border border-border p-5 text-center">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-3.5 bg-teal-light"><User size={20} /></div>
              <p className="font-display font-bold text-[24px]">{staffData.today_patients_count || 0}</p>
              <p className="text-[12px] text-slate-light">Today's Patients</p>
            </div>
            <div className="bg-card rounded-lg border border-border p-5 text-center">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-3.5 bg-teal-light"><CheckCircle size={20} /></div>
              <p className="font-display font-bold text-[24px]">{staffData.check_ins_today || 0}</p>
              <p className="text-[12px] text-slate-light">Check-ins Today</p>
            </div>
          </div>

          {/* Quick actions */}
          <div className="bg-card rounded-lg border border-border p-5">
            <h2 className="font-display font-semibold text-navy text-[17px] mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-3">
              <a href="/staff/check-in" className="bg-teal text-white p-4 rounded-lg text-center hover:bg-teal-mid transition-colors">
                <Calendar size={24} className="mx-auto mb-2" />
                <p className="text-sm font-medium">Patient Check-In</p>
              </a>
              <a href="/staff/queue" className="bg-teal text-white p-4 rounded-lg text-center hover:bg-teal-mid transition-colors">
                <Stethoscope size={24} className="mx-auto mb-2" />
                <p className="text-sm font-medium">View Queue</p>
              </a>
            </div>
          </div>

          {/* Staff Info */}
          <div className="bg-card rounded-lg border border-border p-5">
            <h2 className="font-display font-semibold text-navy text-[17px] mb-4">Your Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-surface rounded-lg p-4">
                <p className="text-[12px] text-slate-light mb-1">Employee ID</p>
                <p className="text-navy font-medium">{staffData.employee_id || '—'}</p>
              </div>
              <div className="bg-surface rounded-lg p-4">
                <p className="text-[12px] text-slate-light mb-1">Department</p>
                <p className="text-navy font-medium">{staffData.department || '—'}</p>
              </div>
              <div className="bg-surface rounded-lg p-4">
                <p className="text-[12px] text-slate-light mb-1">Role</p>
                <p className="text-navy font-medium">{staffRole}</p>
              </div>
              <div className="bg-surface rounded-lg p-4">
                <p className="text-[12px] text-slate-light mb-1">Hospital</p>
                <p className="text-navy font-medium">{staffData.hospital_name || '—'}</p>
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
                <p className="font-display font-bold text-[24px] text-white">{staffData.appointments_today || 0}</p>
                <p className="text-[10px] mt-0.5 text-white/60">Appointments</p>
              </div>
              <div className="text-center">
                <p className="font-display font-bold text-[24px] text-white">{staffData.today_patients_count || 0}</p>
                <p className="text-[10px] mt-0.5 text-white/60">Patients</p>
              </div>
              <div className="text-center">
                <p className="font-display font-bold text-[24px] text-white">{staffData.pending_tasks_count || 0}</p>
                <p className="text-[10px] mt-0.5 text-white/60">Pending Tasks</p>
              </div>
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
                <p className="text-navy font-medium">{staffData.employee_id || '—'}</p>
              </div>
              <div className="bg-surface rounded-lg p-4">
                <p className="text-[12px] text-slate-light mb-1">Department</p>
                <p className="text-navy font-medium">{staffData.department || '—'}</p>
              </div>
              <div className="bg-surface rounded-lg p-4">
                <p className="text-[12px] text-slate-light mb-1">Role</p>
                <p className="text-navy font-medium">{staffRole}</p>
              </div>
              <div className="bg-surface rounded-lg p-4">
                <p className="text-[12px] text-slate-light mb-1">Hospital</p>
                <p className="text-navy font-medium">{staffData.hospital_name || '—'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </StaffDashboardLayout>
  )
}