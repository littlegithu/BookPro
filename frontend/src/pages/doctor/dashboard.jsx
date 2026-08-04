import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Calendar, CheckCircle, ClipboardList, Clock, Users, Star,
  DollarSign, AlertCircle, Eye, Play, X, RefreshCw, CheckCheck,
  FileText, ArrowRight, TrendingUp, Activity, Pill, Hospital,
  Bell, UserPlus, FileBarChart, Stethoscope, Settings2, Timer
} from 'lucide-react'
import Topbar from '../../components/layout/topbar'
import DoctorDashboardLayout from '../../components/layout/doctor-dashboard-layout'
import { useAuth } from '../../context/auth-context'
import {
  fetchDoctorDashboard,
  fetchDoctorAppointments,
  cancelDoctorAppointment,
  fetchDoctorNotifications,
  fetchDoctorSchedule,
  markNotificationRead
} from '../../services/api'
import StatusBadge from '../../components/doctor/shared/status-badge'
import { getStatusColor } from '../../components/doctor/shared/status-utils'

export default function DoctorDashboardPage() {
  const { user, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()
  const [dashboard, setDashboard] = useState(null)
  const [todayAppointments, setTodayAppointments] = useState([])
  const [upcomingAppointments, setUpcomingAppointments] = useState([])
  const [notifications, setNotifications] = useState([])
  const [recentSchedule, setRecentSchedule] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionLoading, setActionLoading] = useState({})
  const [authError, setAuthError] = useState(false)

  useEffect(() => {
    async function load() {
      if (!isAuthenticated) {
        setLoading(false)
        setError('Please log in to access the doctor dashboard.')
        return
      }
      try {
        const [dashboardData, todayAppts, upcomingAppts, notifs, scheduleData] = await Promise.all([
          fetchDoctorDashboard(),
          fetchDoctorAppointments({ tab: 'today' }),
          fetchDoctorAppointments({ tab: 'upcoming' }),
          fetchDoctorNotifications(true),
          fetchDoctorSchedule().catch(() => [])
        ])
        setDashboard(dashboardData)
        setTodayAppointments(Array.isArray(todayAppts) ? todayAppts : [])
        setUpcomingAppointments(Array.isArray(upcomingAppts) ? upcomingAppts : [])
        setNotifications(Array.isArray(notifs) ? notifs : [])
        setRecentSchedule(Array.isArray(scheduleData) ? scheduleData : [])
      } catch (err) {
        if (err.status === 401) {
          setAuthError(true)
          return
        }
        setError(err.message || 'Failed to load dashboard')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [isAuthenticated])

  useEffect(() => {
    if (authError) {
      logout()
      navigate('/login', { replace: true })
    }
  }, [authError, logout, navigate])

  const handleAction = async (id, action) => {
    setActionLoading(prev => ({ ...prev, [id]: action }))
    try {
      if (action === 'cancel') {
        await cancelDoctorAppointment(id)
        setTodayAppointments(prev => prev.filter(a => a.id !== id))
        setUpcomingAppointments(prev => prev.filter(a => a.id !== id))
        setRecentSchedule(prev => prev.filter(a => a.id !== id))
      }
    } catch (err) {
      console.error(`Failed to ${action} appointment:`, err)
    } finally {
      setActionLoading(prev => ({ ...prev, [id]: null }))
    }
  }

  const getPatientName = (apt) => {
    if (apt.patient?.first_name && apt.patient?.last_name) {
      return `${apt.patient.first_name} ${apt.patient.last_name}`
    }
    return apt.patient_name || apt.name || 'Unknown Patient'
  }

  const getSpecialty = (apt) => {
    return apt.specialty || apt.doctor?.specialty || apt.consultation_type || 'General Consultation'
  }

  const getHospital = (apt) => {
    return apt.hospital?.name || apt.hospital_name || 'BookPro Clinic'
  }

  const formatTime = (time) => {
    if (!time) return 'N/A'
    return time
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A'
    try {
      return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    } catch {
      return dateStr
    }
  }

  const getStatusColor = (status) => {
    const colors = {
      'Scheduled': 'bg-blue-light text-blue',
      'Completed': 'bg-green-light text-green',
      'Cancelled': 'bg-red-light text-red',
      'Pending': 'bg-yellow-light text-yellow',
      'Checked In': 'bg-purple-light text-purple',
      'Called': 'bg-indigo-light text-indigo'
    }
    return colors[status] || 'bg-gray-light text-gray'
  }

  const handleNotificationClick = async (notif) => {
    try {
      await markNotificationRead(notif.id, true)
      setNotifications(prev => prev.filter(n => n.id !== notif.id))
    } catch (err) {
      console.error('Failed to mark notification as read:', err)
    }
  }

  if (loading) {
    return (
      <DoctorDashboardLayout>
        <Topbar title="Doctor Dashboard" subtitle="Loading your practice overview..." />
        <div className="p-7">
          <div className="flex items-center justify-center py-20">
            <span className="inline-block w-8 h-8 border-2 border-teal border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      </DoctorDashboardLayout>
    )
  }

  if (error) {
    return (
      <DoctorDashboardLayout>
        <Topbar title="Doctor Dashboard" subtitle="" />
        <div className="p-7">
          <div className="text-red-600 text-center py-10">{error}</div>
        </div>
      </DoctorDashboardLayout>
    )
  }

  const stats = dashboard || {}
  const fullName = user?.name || (user?.first_name && user?.last_name ? `${user.first_name} ${user.last_name}` : 'User')
  const doctorName = fullName.split(' ')[0] || 'User'

  const statCards = [
    { label: "Today's Appointments", value: stats.today_appointments || 0, icon: <Calendar size={20} />, color: 'bg-teal-light text-teal' },
    { label: 'Pending Requests', value: stats.pending_appointments || 0, icon: <AlertCircle size={20} />, color: 'bg-yellow-light text-yellow' },
    { label: 'Patients Seen', value: stats.completed_appointments || 0, icon: <CheckCircle size={20} />, color: 'bg-green-light text-green' },
    { label: 'Total Patients', value: stats.total_patients || 0, icon: <Users size={20} />, color: 'bg-purple-light text-purple' },
    { label: 'Average Rating', value: stats.average_rating ? `${stats.average_rating}` : '0', icon: <Star size={20} />, color: 'bg-orange-light text-orange' },
    { label: 'Monthly Earnings', value: stats.monthly_earnings ? `$${stats.monthly_earnings.toLocaleString()}` : '$0', icon: <DollarSign size={20} />, color: 'bg-blue-light text-blue' },
  ]

  const quickActions = [
    { label: 'Schedule', to: '/doctor/schedule', icon: <Calendar size={18} />, color: 'bg-teal-light text-teal' },
    { label: 'New Patient', to: '/doctor/patients', icon: <UserPlus size={18} />, color: 'bg-purple-light text-purple' },
    { label: 'Medical Records', to: '/doctor/medical-records', icon: <ClipboardList size={18} />, color: 'bg-blue-light text-blue' },
    { label: 'Prescriptions', to: '/doctor/prescriptions', icon: <Pill size={18} />, color: 'bg-green-light text-green' },
    { label: 'Availability', to: '/doctor/availability', icon: <Settings2 size={18} />, color: 'bg-orange-light text-orange' },
    { label: 'Analytics', to: '/doctor/analytics', icon: <TrendingUp size={18} />, color: 'bg-indigo-light text-indigo' },
  ]

  const scheduleItems = recentSchedule.length > 0 ? recentSchedule : todayAppointments.length > 0 ? todayAppointments : upcomingAppointments.slice(0, 5)

  return (
    <DoctorDashboardLayout>
      <Topbar
        title={`Good ${new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 17 ? 'Afternoon' : 'Evening'}, Dr. ${doctorName}`}
        subtitle="Manage your appointments, patients, and practice"
      />

      <div className="p-7 space-y-6">
        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {statCards.map((stat, idx) => (
            <div key={idx} className="rounded-xl border border-border p-4 bg-card">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.color} mb-3`}>
                {stat.icon}
              </div>
              <p className="font-display font-bold text-[22px] text-navy leading-tight">{stat.value}</p>
              <p className="text-[11px] text-slate-light mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-card rounded-xl border border-border p-5">
          <h2 className="font-display font-semibold text-[17px] text-navy mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {quickActions.map((action, idx) => (
              <Link
                key={idx}
                to={action.to}
                className="flex flex-col items-center gap-2 p-4 bg-surface rounded-lg border border-border hover:border-teal/30 hover:shadow-md transition-all group"
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${action.color} group-hover:scale-110 transition-transform`}>
                  {action.icon}
                </div>
                <span className="text-xs font-medium text-slate group-hover:text-navy">{action.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Today's Schedule */}
        <div className="bg-card rounded-xl border border-border p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-semibold text-[17px] text-navy">Today's Schedule</h2>
            <Link to="/doctor/schedule" className="text-[12px] font-medium text-teal hover:underline">View all →</Link>
          </div>
          {scheduleItems.length === 0 ? (
            <div className="text-center py-10 text-slate-light">
              <Calendar className="w-12 h-12 mx-auto mb-3 opacity-40" />
              <p className="text-sm">No appointments scheduled for today</p>
            </div>
          ) : (
            <div className="space-y-3">
              {scheduleItems.slice(0, 5).map((apt) => (
                <div key={apt.id} className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 bg-surface rounded-lg border border-border hover:border-teal/30 transition-colors">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-teal-light flex items-center justify-center text-teal font-semibold text-sm shrink-0">
                      {getPatientName(apt)?.charAt(0) || 'P'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-navy truncate">{getPatientName(apt)}</p>
                      <p className="text-[12px] text-slate-light flex flex-wrap items-center gap-x-3 gap-y-1">
                        <span className="flex items-center gap-1"><Clock size={12} /> {formatTime(apt.appointment_time)}</span>
                        <span className="flex items-center gap-1"><Calendar size={12} /> {formatDate(apt.appointment_date)}</span>
                        <span>{getSpecialty(apt)}</span>
                        <span className="hidden sm:inline">• {getHospital(apt)}</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-medium shrink-0 ${getStatusColor(apt.status)}`}>{apt.status}</span>
                    <div className="flex items-center gap-1.5">
                      <Link to={`/doctor/patients/${apt.patient_id}`} className="p-1.5 rounded-md text-slate hover:text-teal hover:bg-teal-light transition-colors" title="View patient">
                        <Eye size={14} />
                      </Link>
                      <Link to={`/doctor/consultation?appointment_id=${apt.id}`} className="p-1.5 rounded-md text-slate hover:text-green hover:bg-green-light transition-colors" title="Start consultation">
                        <Play size={14} />
                      </Link>
                      <Link to={`/doctor/medical-records?appointment_id=${apt.id}`} className="p-1.5 rounded-md text-slate hover:text-blue hover:bg-blue-light transition-colors" title="Medical record">
                        <ClipboardList size={14} />
                      </Link>
                      <button onClick={() => handleAction(apt.id, 'reschedule')} className="p-1.5 rounded-md text-slate hover:text-orange hover:bg-orange-light transition-colors" title="Reschedule">
                        <RefreshCw size={14} />
                      </button>
                      <button onClick={() => handleAction(apt.id, 'complete')} className="p-1.5 rounded-md text-slate hover:text-green hover:bg-green-light transition-colors" title="Mark complete">
                        <CheckCheck size={14} />
                      </button>
                      <button onClick={() => handleAction(apt.id, 'cancel')} className="p-1.5 rounded-md text-slate hover:text-red hover:bg-red-light transition-colors" title="Cancel" disabled={actionLoading[apt.id] === 'cancel'}>
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="bg-card rounded-xl border border-border p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-semibold text-[17px] text-navy">Recent Activity</h2>
            <Link to="/doctor/notifications" className="text-[12px] font-medium text-teal hover:underline">View all →</Link>
          </div>
          {notifications.length === 0 ? (
            <div className="text-center py-10 text-slate-light">
              <Bell className="w-12 h-12 mx-auto mb-3 opacity-40" />
              <p className="text-sm">No recent notifications</p>
            </div>
          ) : (
            <div className="space-y-2">
              {notifications.slice(0, 5).map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => handleNotificationClick(notif)}
                  className="flex items-start gap-3 p-3 bg-surface rounded-lg border border-border hover:border-teal/30 cursor-pointer transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-teal-light flex items-center justify-center text-teal shrink-0 mt-0.5">
                    <Bell size={14} />
                  </div>
                  <div className="flex-1 min-w-0">
                     <p className="text-[13px] text-navy">
                       {typeof notif.message === 'string' ? notif.message : notif.title || 'Notification'}
                     </p>
                    <p className="text-[11px] text-slate-light mt-0.5">
                      {notif.created_at ? new Date(notif.created_at).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : ''}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DoctorDashboardLayout>
  )
}
