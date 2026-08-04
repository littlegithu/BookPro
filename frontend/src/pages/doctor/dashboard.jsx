import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Calendar, CheckCircle, ClipboardList, Clock, Users, Star,
  DollarSign, AlertCircle, Eye, Play, X, RefreshCw, CheckCheck,
  Pill, Hospital, Bell, UserPlus, Settings2, Timer, Activity,
  TrendingUp, Stethoscope, Shield, MapPin, QrCode, Video
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
  const [currentTime, setCurrentTime] = useState(new Date())
  const [activeTab, setActiveTab] = useState('today')

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000)
    return () => clearInterval(timer)
  }, [])

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
  const initials = fullName.split(' ').filter(Boolean).map(n => n[0]).join('').slice(0, 2).toUpperCase()

  const statCards = [
    { label: "Today's Appointments", value: stats.today_appointments || 0, icon: Calendar, color: 'bg-teal-light text-teal', trend: '+3 from yesterday' },
    { label: 'Completed Today', value: stats.completed_appointments || 0, icon: CheckCircle, color: 'bg-green-light text-green', trend: '85% completion' },
    { label: 'Pending Requests', value: stats.pending_appointments || 0, icon: AlertCircle, color: 'bg-yellow-light text-yellow', trend: 'Needs attention' },
    { label: 'Follow-ups', value: stats.follow_ups || 0, icon: RefreshCw, color: 'bg-purple-light text-purple', trend: 'Scheduled' },
    { label: 'Emergency Cases', value: stats.emergency_cases || 0, icon: Activity, color: 'bg-red-light text-red', trend: 'Critical' },
    { label: 'Patients Waiting', value: stats.patients_waiting || 0, icon: Clock, color: 'bg-orange-light text-orange', trend: 'In queue' },
    { label: 'Monthly Patients', value: stats.monthly_patients || 0, icon: Users, color: 'bg-blue-light text-blue', trend: '+12% growth' },
    { label: 'Average Rating', value: stats.average_rating || '0', icon: Star, color: 'bg-yellow-light text-yellow', trend: `${stats.reviews || 0} reviews` },
    { label: 'Revenue', value: stats.revenue ? `$${stats.revenue.toLocaleString()}` : '$0', icon: DollarSign, color: 'bg-green-light text-green', trend: '+5.2% this month' },
    { label: 'Consultation Hours', value: stats.consultation_hours || '0h', icon: Timer, color: 'bg-indigo-light text-indigo', trend: 'Today' },
  ]

  const quickActions = [
    { label: 'Schedule', to: '/doctor/schedule', icon: Calendar, color: 'bg-teal-light text-teal' },
    { label: 'New Patient', to: '/doctor/patients', icon: UserPlus, color: 'bg-purple-light text-purple' },
    { label: 'Medical Records', to: '/doctor/medical-records', icon: ClipboardList, color: 'bg-blue-light text-blue' },
    { label: 'Prescriptions', to: '/doctor/prescriptions', icon: Pill, color: 'bg-green-light text-green' },
    { label: 'Availability', to: '/doctor/availability', icon: Settings2, color: 'bg-orange-light text-orange' },
    { label: 'Analytics', to: '/doctor/analytics', icon: TrendingUp, color: 'bg-indigo-light text-indigo' },
  ]

  const scheduleItems = recentSchedule.length > 0 ? recentSchedule : todayAppointments.length > 0 ? todayAppointments : upcomingAppointments.slice(0, 5)

  const getShift = () => {
    const hour = currentTime.getHours()
    if (hour >= 8 && hour < 17) return 'Day Shift'
    if (hour >= 17 && hour < 21) return 'Evening Shift'
    return 'Night Shift'
  }

  return (
    <DoctorDashboardLayout>
      <Topbar
        title={`Dr. ${doctorName}`}
        subtitle={`${getShift()} • ${currentTime.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}`}
      />

      {/* Doctor Profile Header */}
      <div className="px-7 pt-2 pb-0">
        <div className="bg-card rounded-xl border border-border p-5 flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-teal flex items-center justify-center text-white text-xl font-semibold shrink-0">
            {user?.profile_image ? (
              <img src={user.profile_image} alt="Profile" className="w-full h-full object-cover rounded-full" />
            ) : (
              initials
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="font-display font-bold text-xl text-navy">Dr. {fullName}</h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-[13px] text-slate-light">
              <span className="flex items-center gap-1.5"><Stethoscope size={14} /> {stats.specialty || 'General Practice'}</span>
              <span className="flex items-center gap-1.5"><Hospital size={14} /> {stats.hospital_name || 'BookPro Clinic'}</span>
              <span className="flex items-center gap-1.5"><Shield size={14} /> {getShift()}</span>
              <span className="flex items-center gap-1.5"><Clock size={14} /> {stats.working_hours || '8AM - 5PM'}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Bell size={20} className="text-slate hover:text-navy cursor-pointer" />
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red text-white text-[9px] rounded-full flex items-center justify-center">{notifications.length}</span>
              )}
            </div>
            <Link to="/doctor/profile" className="p-2 rounded-lg hover:bg-surface text-slate hover:text-navy transition-colors">
              <Settings2 size={20} />
            </Link>
          </div>
        </div>
      </div>

      <div className="p-7 space-y-6">
        {/* Stats Row - expanded */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {statCards.slice(0, 10).map((stat, idx) => (
            <div key={idx} className="group rounded-xl border border-border p-4 bg-card hover:shadow-md hover:border-teal/30 transition-all cursor-pointer">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${stat.color}`}>
                <stat.icon size={20} />
              </div>
              <p className="font-display font-bold text-[22px] text-navy leading-tight">{stat.value}</p>
              <p className="text-[11px] text-slate-light mt-1">{stat.label}</p>
              {stat.trend && (
                <p className="text-[10px] text-slate-light mt-1 flex items-center gap-1">
                  <TrendingUp size={10} /> {stat.trend}
                </p>
              )}
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
                  {action.icon && <action.icon size={18} />}
                </div>
                <span className="text-xs font-medium text-slate group-hover:text-navy">{action.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Today's Schedule - redesigned */}
        <div className="bg-card rounded-xl border border-border p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-semibold text-[17px] text-navy">Today's Schedule</h2>
            <div className="flex items-center gap-3">
              <div className="flex bg-surface rounded-lg p-0.5 border border-border">
                {['today', 'upcoming', 'all'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-3 py-1.5 rounded-md text-[12px] font-medium transition-colors ${
                      activeTab === tab ? 'bg-teal text-white' : 'text-slate hover:text-navy'
                    }`}
                  >
                    {tab === 'today' ? "Today" : tab === 'upcoming' ? 'Upcoming' : 'All'}
                  </button>
                ))}
              </div>
              <Link to="/doctor/schedule" className="text-[12px] font-medium text-teal hover:underline">View all →</Link>
            </div>
          </div>

          {scheduleItems.length === 0 ? (
            <div className="text-center py-10 text-slate-light">
              <Calendar className="w-12 h-12 mx-auto mb-3 opacity-40" />
              <p className="text-sm">No appointments scheduled</p>
            </div>
          ) : (
            <div className="space-y-3">
              {scheduleItems.slice(0, 5).map((apt) => {
                const patientName = getPatientName(apt)
                const queueNumber = apt.id ? `Q-${((apt.id * 7 + 3) % 90 + 10)}` : null
                const isVirtual = apt.consultation_type === 'Online' || apt.consultation_type === 'Both'
                const isPhysical = apt.consultation_type === 'Physical' || apt.consultation_type === 'Both'

                return (
                  <div key={apt.id} className="flex flex-col lg:flex-row lg:items-center gap-4 p-4 bg-surface rounded-lg border border-border hover:border-teal/30 transition-colors">
                    {/* Patient info */}
                    <div className="flex items-center gap-3.5 flex-1 min-w-0">
                      <div className="w-11 h-11 rounded-full bg-teal-light flex items-center justify-center text-teal font-semibold text-sm shrink-0">
                        {patientName?.charAt(0) || 'P'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-medium text-navy truncate">{patientName}</p>
                          <span className="text-[11px] px-2 py-0.5 rounded-full bg-blue-light text-blue">{getSpecialty(apt)}</span>
                        </div>
                        <p className="text-[12px] text-slate-light mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                          <span className="flex items-center gap-1"><Clock size={12} /> {formatTime(apt.appointment_time)}</span>
                          <span className="flex items-center gap-1"><Calendar size={12} /> {formatDate(apt.appointment_date)}</span>
                          <span className="flex items-center gap-1"><Hospital size={12} /> {getHospital(apt)}</span>
                          {apt.room && <span className="flex items-center gap-1"><MapPin size={12} /> Room {apt.room}</span>}
                        </p>
                      </div>
                    </div>

                    {/* Details badges */}
                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-medium shrink-0 ${getStatusColor(apt.status)}`}>{apt.status}</span>
                      {queueNumber && (
                        <span className="text-[11px] px-2.5 py-1 rounded-lg bg-purple-light text-purple font-medium flex items-center gap-1">
                          <QrCode size={12} /> {queueNumber}
                        </span>
                      )}
                      {isVirtual && (
                        <span className="text-[11px] px-2.5 py-1 rounded-lg bg-blue-light text-blue font-medium flex items-center gap-1">
                          <Video size={12} /> Virtual
                        </span>
                      )}
                      {isPhysical && apt.room && (
                        <span className="text-[11px] px-2.5 py-1 rounded-lg bg-green-light text-green font-medium flex items-center gap-1">
                          <MapPin size={12} /> Room {apt.room}
                        </span>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1.5 lg:ml-auto shrink-0">
                      <Link to={`/doctor/patients/${apt.patient_id}`} className="p-2 rounded-md text-slate hover:text-teal hover:bg-teal-light transition-colors" title="View patient">
                        <Eye size={14} />
                      </Link>
                      <Link to={`/doctor/consultation?appointment_id=${apt.id}`} className="p-2 rounded-md text-slate hover:text-green hover:bg-green-light transition-colors" title="Start consultation">
                        <Play size={14} />
                      </Link>
                      <Link to={`/doctor/medical-records?appointment_id=${apt.id}`} className="p-2 rounded-md text-slate hover:text-blue hover:bg-blue-light transition-colors" title="Medical record">
                        <ClipboardList size={14} />
                      </Link>
                      <Link to={`/doctor/prescriptions?appointment_id=${apt.id}`} className="p-2 rounded-md text-slate hover:text-purple hover:bg-purple-light transition-colors" title="Prescription">
                        <Pill size={14} />
                      </Link>
                      <button onClick={() => handleAction(apt.id, 'reschedule')} className="p-2 rounded-md text-slate hover:text-orange hover:bg-orange-light transition-colors" title="Reschedule">
                        <RefreshCw size={14} />
                      </button>
                      <button onClick={() => handleAction(apt.id, 'complete')} className="p-2 rounded-md text-slate hover:text-green hover:bg-green-light transition-colors" title="Mark complete">
                        <CheckCheck size={14} />
                      </button>
                      <button onClick={() => handleAction(apt.id, 'cancel')} className="p-2 rounded-md text-slate hover:text-red hover:bg-red-light transition-colors" title="Cancel" disabled={actionLoading[apt.id] === 'cancel'}>
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Recent Activity / Notifications */}
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
