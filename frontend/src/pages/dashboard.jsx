import { useState, useEffect, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Calendar, CheckCircle, ClipboardList, Clock, Star,
  Heart, Shield, TrendingUp, ChevronRight, User, Building2, MapPin, Activity
} from 'lucide-react'
import DashboardLayout from '../components/layout/dashboard-layout'
import Topbar from '../components/layout/topbar'
import AppointmentCard from '../components/appointment/appointment-card'
import PastVisitList from '../components/appointment/past-visit-list'
import BookingForm from '../components/booking/booking-form'
import { useAuth } from '../context/auth-context'
import { fetchAppointments, cancelAppointment, fetchDoctors } from '../services/api'

export default function DashboardPage() {
  const { user, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeView, setActiveView] = useState(null)
  const [cancelError, setCancelError] = useState('')
  const [cancellingId, setCancellingId] = useState(null)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [doctors, setDoctors] = useState([])
  const [selectedDoctorId, setSelectedDoctorId] = useState('')

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    async function load() {
      try {
        const [apptsData, doctorsData] = await Promise.all([
          fetchAppointments(),
          fetchDoctors(),
        ])
        setAppointments(apptsData)
        setDoctors(doctorsData)
        if (doctorsData.length > 0) {
          setSelectedDoctorId(String(doctorsData[0].id))
        }
      } catch (err) {
        console.error('Failed to load dashboard data:', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [isAuthenticated])

  const upcoming = appointments.filter(a => a.status === 'confirmed' || a.status === 'pending' || a.status === 'Scheduled')
  const past = appointments.filter(a => a.status === 'completed' || a.status === 'cancelled')
  const completed = past.filter(a => a.status === 'completed')
  const cancelled = past.filter(a => a.status === 'cancelled')

  const showUpcoming = activeView === null || activeView === 'upcoming'
  const showPast = activeView === 'completed' || activeView === 'all'
  const filteredPast = activeView === 'completed' ? completed : activeView === 'cancelled' ? cancelled : activeView === 'all' ? past : completed
  const pastTitle = activeView === 'completed' ? 'Completed visits' : activeView === 'cancelled' ? 'Cancelled visits' : activeView === 'all' ? 'Medical records' : 'Past visits'

  const handleCancel = async (id) => {
    setCancelError('')
    setCancellingId(id)
    try {
      await cancelAppointment(id)
      setAppointments(prev => prev.filter(a => a.id !== id))
    } catch (err) {
      console.error('Failed to cancel appointment:', err)
      if (err.message && err.message.includes('404')) {
        setAppointments(prev => prev.filter(a => a.id !== id))
      } else {
        setCancelError(err.message || 'Failed to cancel appointment. Please try again.')
      }
    } finally {
      setCancellingId(null)
    }
  }

  const handleReschedule = () => {
    if (upcoming[0]?.doctor_id) {
      navigate(`/doctors/${upcoming[0].doctor_id}`)
    }
  }

  const getGreeting = () => {
    const hour = currentTime.getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 17) return 'Good afternoon'
    return 'Good evening'
  }

  const statsCards = useMemo(() => [
    {
      label: 'Upcoming appointments',
      value: upcoming.length,
      icon: Calendar,
      color: 'bg-teal-light text-teal',
      active: activeView === 'upcoming',
      trend: upcoming.length > 0 ? '+2 this week' : null,
      progress: Math.min(upcoming.length * 10, 100),
      onClick: () => setActiveView(activeView === 'upcoming' ? null : 'upcoming'),
    },
    {
      label: 'Completed visits',
      value: completed.length,
      icon: CheckCircle,
      color: 'bg-green-light text-green',
      active: activeView === 'completed',
      trend: completed.length > 0 ? `${completed.length} total` : null,
      progress: Math.min(completed.length * 10, 100),
      onClick: () => setActiveView(activeView === 'completed' ? null : 'completed'),
    },
    {
      label: 'Medical records',
      value: past.length,
      icon: ClipboardList,
      color: 'bg-blue-light text-blue',
      active: activeView === 'all',
      trend: past.length > 0 ? `${past.length} records` : null,
      progress: Math.min(past.length * 10, 100),
      onClick: () => setActiveView(activeView === 'all' ? null : 'all'),
    },
  ], [upcoming.length, completed.length, past.length, activeView])

  const recentDoctors = useMemo(() => {
    const seen = new Set()
    return appointments
      .filter(a => a.doctorName && !seen.has(a.doctorName))
      .slice(0, 3)
      .map(a => ({ name: a.doctorName, specialty: a.specialty }))
  }, [appointments])

  return (
    <DashboardLayout>
      <Topbar
        title={isAuthenticated ? `${getGreeting()}, ${user?.name?.split(' ')[0] || 'User'}` : "Dashboard"}
        subtitle={currentTime.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
      />
      <div className="p-7 grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-5 flex-1">

        {/* Left column */}
        <div className="flex flex-col gap-5">
          {/* Stats row - enhanced */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {statsCards.map((stat, idx) => (
              <button
                key={idx}
                onClick={stat.onClick}
                className={`group relative block rounded-xl border p-5 text-left transition-all duration-200 cursor-pointer overflow-hidden ${
                  stat.active
                    ? 'bg-teal text-white border-teal shadow-lg shadow-teal/20'
                    : 'bg-card text-navy border-border hover:border-teal/40 hover:shadow-md dark:bg-card dark:text-navy'
                }`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/5 dark:to-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-3.5 transition-transform group-hover:scale-110 ${stat.active ? 'bg-white/25' : stat.color}`}>
                  <stat.icon size={22} />
                </div>
                <p className={`font-display font-bold text-[32px] leading-none transition-colors ${stat.active ? 'text-white' : 'text-navy dark:text-white'}`}>
                  {stat.value}
                </p>
                <p className={`text-[12px] mt-1.5 font-medium ${stat.active ? 'text-white/80' : 'text-slate-light dark:text-white/60'}`}>
                  {stat.label}
                </p>
                {stat.trend && (
                  <div className={`mt-2 flex items-center gap-1 text-[11px] font-medium ${stat.active ? 'text-white/70' : 'text-slate-light dark:text-white/50'}`}>
                    <TrendingUp size={12} />
                    {stat.trend}
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/10 dark:bg-white/10">
                  <div
                    className={`h-full transition-all duration-500 ${stat.active ? 'bg-white/40' : 'bg-teal/40'}`}
                    style={{ width: `${stat.progress}%` }}
                  />
                </div>
              </button>
            ))}
          </div>

          {/* Upcoming appointments */}
          {showUpcoming && (
            <div className="bg-card rounded-xl border border-border p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display font-semibold text-[17px] text-navy dark:text-white">Upcoming appointments</h2>
                {isAuthenticated && (
                  <div className="flex items-center gap-3">
                    <Link to="/appointments" className="text-[12px] font-medium text-teal hover:underline">View all →</Link>
                  </div>
                )}
              </div>
              {loading ? (
                <div className="flex items-center justify-center py-10">
                  <span className="inline-block w-6 h-6 border-2 border-teal border-t-transparent rounded-full animate-spin" aria-hidden="true" />
                </div>
              ) : upcoming.length === 0 ? (
                <div className="text-center py-10 text-slate-light">
                  <Calendar className="w-12 h-12 mx-auto mb-3 opacity-40" />
                  <p className="text-sm">No upcoming appointments</p>
                  <Link to="/doctors" className="text-teal text-sm hover:underline mt-2 inline-block">Book an appointment</Link>
                </div>
              ) : (
                <div>
                  {upcoming.map((apt) => (
                    <AppointmentCard
                      key={apt.id}
                      appointment={apt}
                      onCancel={isAuthenticated ? handleCancel : undefined}
                      cancellingId={cancellingId}
                      onViewDetails={(appt) => navigate(`/appointments/${appt.id}`)}
                      onJoinMeeting={(appt) => alert(`Joining meeting for appointment ${appt.id}...`)}
                      onDownloadSlip={(appt) => alert(`Downloading appointment slip for ${appt.doctorName}...`)}
                    />
                  ))}
                </div>
              )}
              {cancelError && (
                <div className="mt-3 text-[13px] text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5 flex items-center justify-between">
                  <span>{cancelError}</span>
                  <button onClick={() => setCancelError('')} className="text-red-800 hover:text-red-900 font-medium">Dismiss</button>
                </div>
              )}
            </div>
          )}

          {/* Past visits / Medical records */}
          {showPast && (
            <div className="bg-card rounded-xl border border-border p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display font-semibold text-[17px] text-navy dark:text-white">{pastTitle}</h2>
                {isAuthenticated && <Link to="/appointments" className="text-[12px] font-medium text-teal hover:underline">View all →</Link>}
              </div>
              <PastVisitList appointments={filteredPast} />
            </div>
          )}
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-4">
          {/* Next appointment - enhanced */}
          {upcoming[0] && (
            <div className="bg-gradient-to-br from-teal to-teal-mid rounded-xl p-5 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10" />
              <p className="text-[10px] font-semibold text-white/70 uppercase tracking-wider mb-2">Next appointment</p>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white text-lg font-semibold">
                  {upcoming[0].doctorName?.split(' ').filter(n => n[0] !== '.').map(n => n[0]).join('').slice(0,2) ?? 'DR'}
                </div>
                <div>
                  <p className="font-display font-semibold text-[16px] text-white">{upcoming[0].doctorName}</p>
                  <p className="text-[12px] text-white/70">{upcoming[0].specialty}</p>
                </div>
              </div>
              <div className="text-[12px] text-white/80 flex flex-col gap-1.5 mb-3.5">
                <span className="flex items-center gap-2"><Calendar size={14} /> {upcoming[0].date}</span>
                <span className="flex items-center gap-2"><Clock size={14} /> {upcoming[0].time}</span>
                {upcoming[0].hospital_name && <span className="flex items-center gap-2"><Building2 size={14} /> {upcoming[0].hospital_name}</span>}
                {upcoming[0].room && <span className="flex items-center gap-2"><MapPin size={14} /> Room {upcoming[0].room}</span>}
              </div>
              {isAuthenticated ? (
                <div className="flex gap-2">
                  <button onClick={() => handleCancel(upcoming[0].id)} className="flex-1 py-2 rounded-md text-[12px] font-medium text-white bg-white/15 hover:bg-white/25 transition-colors">Cancel</button>
                  <button onClick={handleReschedule} className="flex-1 py-2 rounded-md bg-white text-teal text-[12px] font-medium hover:bg-white/90 transition-colors shadow-sm">Reschedule</button>
                </div>
              ) : (
                <Link to="/login" className="block w-full text-center text-[13px] font-medium text-white bg-white/15 py-2 rounded-lg hover:bg-white/25 transition-colors">Login to manage</Link>
              )}
            </div>
          )}

          {/* Booking form */}
          {isAuthenticated && (
            <div className="bg-card rounded-xl border border-border p-5">
              <h2 className="font-display font-semibold text-[17px] text-navy mb-3">Book an Appointment</h2>
              <div className="mb-3">
                <label className="block text-[12px] font-medium text-slate-light mb-1">Select a doctor</label>
                <select
                  value={selectedDoctorId}
                  onChange={e => setSelectedDoctorId(e.target.value)}
                  className="w-full border border-border rounded-lg px-3.5 py-2.5 text-[13px] text-navy bg-surface outline-none focus:border-teal focus:bg-card transition-colors cursor-pointer"
                >
                  <option value="">-- Choose a doctor --</option>
                  {doctors.map(doc => (
                    <option key={doc.id} value={String(doc.id)}>{doc.name} — {doc.specialty}</option>
                  ))}
                </select>
              </div>
              {selectedDoctorId && (
                <BookingForm
                  doctorId={Number(selectedDoctorId)}
                  hospitalIds={doctors.find(d => String(d.id) === String(selectedDoctorId))?.hospital_ids || ''}
                  fee={doctors.find(d => String(d.id) === String(selectedDoctorId))?.fee || 0}
                />
              )}
            </div>
          )}

          {/* Profile card - enhanced */}
          {isAuthenticated ? (
            <div className="bg-card rounded-xl border border-border p-5">
              <div className="flex flex-col items-center text-center pb-4 border-b border-border mb-4">
                <div className="w-16 h-16 rounded-full bg-teal flex items-center justify-center text-white text-[19px] font-semibold mb-2.5 overflow-hidden">
                  {user?.profile_image ? (
                    <img src={user.profile_image} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'U'
                  )}
                </div>
                <p className="font-display font-semibold text-[16px] text-navy dark:text-white">{user?.name || 'User'}</p>
                <p className="text-[12px] text-slate-light mt-0.5">{user?.email || 'your@email.com'}</p>

                {/* Health profile badges */}
                <div className="flex flex-wrap items-center justify-center gap-2 mt-3">
                  <span className="text-[10px] px-2.5 py-1 rounded-full bg-red-light text-red flex items-center gap-1"><Heart size={10} /> A+</span>
                  <span className="text-[10px] px-2.5 py-1 rounded-full bg-blue-light text-blue flex items-center gap-1"><Shield size={10} /> NHIF</span>
                  <span className="text-[10px] px-2.5 py-1 rounded-full bg-green-light text-green flex items-center gap-1"><Activity size={10} /> 85%</span>
                </div>
              </div>

              <div className="space-y-2.5">
                {[
                  ['Total visits', String(past.length + upcoming.length)],
                  ['Blood Group', 'A+'],
                  ['Insurance', 'NHIF Premium'],
                  ['Emergency Contact', '+254 712 345 678'],
                  ['Member since', 'Jan 2025'],
                  ['Last checkup', past[0]?.date || '—'],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between items-center py-1.5">
                    <span className="text-[12px] text-slate-light">{k}</span>
                    <span className="text-[12px] font-medium text-navy">{v}</span>
                  </div>
                ))}
              </div>

              <Link to="/profile" className="block w-full mt-4 text-center text-[13px] font-medium text-teal bg-teal-light py-2.5 rounded-lg hover:bg-teal hover:text-white transition-colors">Edit profile</Link>
            </div>
          ) : (
            <div className="bg-card rounded-xl border border-border p-5">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-navy/10 flex items-center justify-center text-navy mb-2.5">
                  <User size={28} />
                </div>
                <p className="font-display font-semibold text-[16px] text-navy">Guest User</p>
                <p className="text-[12px] text-slate-light mt-0.5">Not logged in</p>
              </div>
              <Link to="/login" className="block w-full mt-4 text-center text-[13px] font-medium text-white bg-teal py-2.5 rounded-lg hover:bg-teal-mid transition-colors">Login to book appointments</Link>
            </div>
          )}

          {/* Visit summary - enhanced */}
          <div className="bg-gradient-to-br from-navy to-navy/90 rounded-xl p-5 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-8 -mt-8" />
            <p className="text-[11px] font-medium text-white/70 mb-3.5 uppercase tracking-wider">Visit Summary</p>
            <div className="flex justify-between">
              {[
                [upcoming.length, 'Upcoming', 'bg-teal/20 text-teal'],
                [completed.length, 'Completed', 'bg-green/20 text-green'],
                [cancelled.length, 'Cancelled', 'bg-red/20 text-red'],
              ].map(([n, l, color]) => (
                <div key={l} className="text-center flex-1">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${color} mb-1.5`}>
                    <span className="font-display font-bold text-lg">{n}</span>
                  </div>
                  <p className="text-[10px] text-white/60">{l}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Recent doctors */}
          {recentDoctors.length > 0 && (
            <div className="bg-card rounded-xl border border-border p-5">
              <h3 className="font-display font-semibold text-[15px] text-navy dark:text-white mb-3 flex items-center gap-2">
                <Star size={16} className="text-yellow-500" /> Recent Doctors
              </h3>
              <div className="space-y-2.5">
                {recentDoctors.map((doc, idx) => (
                  <Link key={idx} to={`/doctors/${doc.id || idx}`} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-surface transition-colors group">
                    <div className="w-9 h-9 rounded-full bg-teal-light flex items-center justify-center text-teal text-xs font-semibold dark:bg-white/10 dark:text-teal">
                      {doc.name?.split(' ').filter(n => n[0] !== '.').map(n => n[0]).join('').slice(0,2) ?? 'DR'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-medium text-navy truncate group-hover:text-teal transition-colors">{doc.name}</p>
                      <p className="text-[11px] text-slate-light">{doc.specialty}</p>
                    </div>
                    <ChevronRight size={14} className="text-slate-light group-hover:text-teal transition-colors" />
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
