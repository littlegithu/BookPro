import { useState, useEffect } from 'react'
import { Calendar, CheckCircle, User, Stethoscope } from 'lucide-react'
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
        setError('Failed to load dashboard data')
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

  if (error) {
    return (
      <StaffDashboardLayout>
        <Topbar title="Staff Dashboard" subtitle="" />
        <div className="p-7">
          <div className="text-red-600 text-center py-10">{error}</div>
        </div>
      </StaffDashboardLayout>
    )
  }

  const staffName = (user?.staff?.first_name || user?.first_name || 'Staff') + ' ' + (user?.staff?.last_name || user?.last_name || '').trim()
  const staffRole = user?.staff?.role || user?.role || 'Receptionist'
  const staffData = dashboardData || user?.staff || {}

  return (
    <StaffDashboardLayout>
      <Topbar title={`Welcome ${staffName}`} subtitle={isAuthenticated ? staffRole : 'Staff Dashboard'} />
      <div className="p-7 grid grid-cols-[1fr_272px] gap-5 flex-1">
        {/* Left column */}
        <div className="flex flex-col gap-5">
          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3.5">
            <button className="block rounded-lg border p-5 text-left bg-card text-navy border-border dark:bg-card dark:text-navy">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-3.5 bg-teal-light dark:bg-white/10"><Calendar size={20} /></div>
              <p className="font-display font-bold text-[28px] dark:text-white">{dashboardData?.appointments_today || 0}</p>
              <p className="text-[12px] mt-0.5 text-slate-light dark:text-white/60">Today's Appointments</p>
            </button>
            <button className="block rounded-lg border p-5 text-left bg-card text-navy border-border dark:bg-card dark:text-navy">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-3.5 bg-teal-light dark:bg-white/10"><User size={20} /></div>
              <p className="font-display font-bold text-[28px] dark:text-white">{dashboardData?.today_patients_count || 0}</p>
              <p className="text-[12px] mt-0.5 text-slate-light dark:text-white/60">Today's Patients</p>
            </button>
            <button className="block rounded-lg border p-5 text-left bg-card text-navy border-border dark:bg-card dark:text-navy">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-3.5 bg-teal-light dark:bg-white/10"><CheckCircle size={20} /></div>
              <p className="font-display font-bold text-[28px] dark:text-white">{dashboardData?.check_ins_today || 0}</p>
              <p className="text-[12px] mt-0.5 text-slate-light dark:text-white/60">Check-ins Today</p>
            </button>
          </div>

          {/* Quick actions for Receptionist */}
          {staffRole === 'Receptionist' && (
            <div className="bg-card rounded-lg border border-border p-5">
              <h2 className="font-display font-semibold text-[17px] text-navy mb-4">Quick Actions</h2>
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
          )}
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-4">
          {/* Today's Stats */}
          <div className="bg-teal rounded-lg p-5">
            <p className="text-[12px] font-medium mb-3.5 text-white/70">Today's Summary</p>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="font-display font-bold text-[24px] text-white">{dashboardData?.appointments_today || 0}</p>
                <p className="text-[10px] mt-0.5 text-white/60">Appointments</p>
              </div>
              <div className="text-center">
                <p className="font-display font-bold text-[24px] text-white">{dashboardData?.today_patients_count || 0}</p>
                <p className="text-[10px] mt-0.5 text-white/60">Patients</p>
              </div>
              <div className="text-center">
                <p className="font-display font-bold text-[24px] text-white">{dashboardData?.pending_tasks_count || 0}</p>
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
            {[
              ['Employee ID', staffData?.employee_id || user?.staff?.employee_id || '—'],
              ['Department', staffData?.department || user?.staff?.department || '—'],
              ['Hospital', staffData?.hospital_name || user?.staff?.hospital_name || '—'],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between items-center py-1.5">
                <span className="text-[12px] text-slate-light">{k}</span>
                <span className="text-[12px] font-medium text-navy">{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </StaffDashboardLayout>
  )
}