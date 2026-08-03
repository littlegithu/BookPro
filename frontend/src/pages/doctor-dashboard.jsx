import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, CheckCircle, ClipboardList, Clock, Stethoscope, User } from 'lucide-react'
import DashboardLayout from '../components/layout/dashboard-layout'
import Topbar from '../components/layout/topbar'
import AppointmentList from '../components/appointment/appointment-list'
import PastVisitList from '../components/appointment/past-visit-list'
import { useAuth } from '../context/auth-context'
import { fetchAppointments, cancelAppointment } from '../services/api'

export default function DoctorDashboardPage() {
  const { user, isAuthenticated } = useAuth()
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeView, setActiveView] = useState(null)
  const [cancelError, setCancelError] = useState('')
  const [cancellingId, setCancellingId] = useState(null)

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchAppointments()
        const myAppointments = data.filter(a => a.doctor_id === user?.id)
        setAppointments(myAppointments)
      } catch (err) {
        console.error('Failed to load appointments:', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [isAuthenticated, user?.id])

  const upcoming = appointments.filter(a => a.status === 'confirmed' || a.status === 'pending' || a.status === 'Scheduled')
  const past = appointments.filter(a => a.status === 'completed' || a.status === 'cancelled')
  const completed = past.filter(a => a.status === 'completed')
  const cancelled = past.filter(a => a.status === 'cancelled')

  const showUpcoming = activeView === null || activeView === 'upcoming'
  const showPast = activeView === 'completed' || activeView === 'all'
  const filteredPast = activeView === 'completed' ? completed : activeView === 'all' ? past : activeView === 'cancelled' ? cancelled : completed

  const pastTitle = activeView === 'completed' ? 'Completed visits' : activeView === 'all' ? 'Medical records' : activeView === 'cancelled' ? 'Cancelled' : 'Past visits'

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

  return (
    <DashboardLayout>
      <Topbar title={isAuthenticated ? `Dr. ${user?.name?.split(' ')[0] || 'User'}` : "Doctor Dashboard"} subtitle={isAuthenticated ? "Manage your appointments and patient records" : "Login to manage your practice"} />
      <div className="p-7 grid grid-cols-[1fr_272px] gap-5 flex-1">

        {/* Left column */}
        <div className="flex flex-col gap-5">
          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3.5">
            <button onClick={() => setActiveView(activeView === 'upcoming' ? null : 'upcoming')} className={`block rounded-lg border p-5 text-left transition-colors cursor-pointer ${activeView === 'upcoming' ? 'bg-teal text-white border-teal' : 'bg-card text-navy border-border hover:border-teal dark:bg-card dark:text-navy'}`}>
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3.5 ${activeView === 'upcoming' ? 'bg-white/25 text-black' : 'text-slate bg-teal-light dark:bg-white/10 dark:text-white/70'}`}><Calendar size={20} /></div>
              <p className={`font-display font-bold text-[28px] dark:text-white`}>{upcoming.length}</p>
              <p className={`text-[12px] mt-0.5 ${activeView === 'upcoming' ? 'text-white/62' : 'text-slate-light dark:text-white/60'}`}>Patients today</p>
            </button>
            <button onClick={() => setActiveView(activeView === 'completed' ? null : 'completed')} className={`block rounded-lg border p-5 text-left transition-colors cursor-pointer ${activeView === 'completed' ? 'bg-teal text-white border-teal' : 'bg-card text-navy border-border hover:bg-teal hover:text-white hover:border-teal dark:bg-card dark:text-navy'}`}>
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3.5 ${activeView === 'completed' ? 'bg-white/25 text-black' : 'text-slate bg-teal-light dark:bg-white/10 dark:text-white/70'}`}><CheckCircle size={20} /></div>
              <p className={`font-display font-bold text-[28px] dark:text-white`}>{completed.length}</p>
              <p className={`text-[12px] mt-0.5 ${activeView === 'completed' ? 'text-white/62' : 'text-slate-light dark:text-white/60'}`}>Consultations done</p>
            </button>
            <button onClick={() => setActiveView(activeView === 'all' ? null : 'all')} className={`block rounded-lg border p-5 text-left transition-colors cursor-pointer ${activeView === 'all' ? 'bg-teal text-white border-teal' : 'bg-card text-navy border-border hover:bg-teal hover:text-white hover:border-teal dark:bg-card dark:text-navy'}`}>
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3.5 ${activeView === 'all' ? 'bg-white/25 text-black' : 'text-slate bg-teal-light dark:bg-white/10 dark:text-white/70'}`}><ClipboardList size={20} /></div>
              <p className={`font-display font-bold text-[28px] dark:text-white`}>{past.length}</p>
              <p className={`text-[12px] mt-0.5 ${activeView === 'all' ? 'text-white/62' : 'text-slate-light dark:text-white/60'}`}>Total patients</p>
            </button>
          </div>

          {/* Upcoming */}
          {showUpcoming && (
            <div className="bg-card rounded-lg border border-border p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display font-semibold text-[17px] text-navy">Today's appointments</h2>
                {isAuthenticated && <Link to="/appointments" className="text-[12px] font-medium text-teal hover:underline">View all →</Link>}
              </div>
              {loading ? (
                <div className="flex items-center justify-center py-10">
                  <span className="inline-block w-6 h-6 border-2 border-teal border-t-transparent rounded-full animate-spin" aria-hidden="true" />
                </div>
              ) : (
                <AppointmentList appointments={upcoming} onCancel={isAuthenticated ? handleCancel : undefined} cancellingId={cancellingId} />
              )}
              {cancelError && (
                <div className="mt-3 text-[13px] text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5">
                  {cancelError}
                  <button onClick={() => setCancelError('')} className="ml-2 text-red-800 hover:text-red-900 font-medium">Dismiss</button>
                </div>
              )}
            </div>
          )}

          {/* Past visits */}
          {showPast && (
            <div className="bg-card rounded-lg border border-border p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display font-semibold text-[17px] text-navy">{pastTitle}</h2>
                {isAuthenticated && <Link to="/appointments" className="text-[12px] font-medium text-teal hover:underline">View all →</Link>}
              </div>
              <PastVisitList appointments={filteredPast} />
            </div>
          )}
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-4">
          {/* Next appointment */}
          {upcoming[0] && (
            <div className="bg-teal rounded-lg p-5">
              <p className="text-[10px] font-semibold text-white/62 uppercase tracking-wider mb-2">Next patient</p>
              <p className="font-display font-semibold text-[16px] text-white mb-1.5">{upcoming[0].doctorName}</p>
              <div className="text-[12px] text-white/70 flex flex-col gap-1">
                <span className="flex items-center gap-2"><Calendar size={14} /> {upcoming[0].date}</span>
                <span className="flex items-center gap-2"><Clock size={14} /> {upcoming[0].time}</span>
                <span className="flex items-center gap-2"><Stethoscope size={14} /> {upcoming[0].specialty}</span>
              </div>
              {isAuthenticated ? (
                <button onClick={() => handleCancel(upcoming[0].id)} className="flex-1 w-full mt-3.5 py-2 rounded-md text-[12px] font-medium text-white cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-lg active:translate-y-0" style={{background:'rgba(255,255,255,0.15)'}}>
                  Cancel appointment
                </button>
              ) : (
                <Link to="/login" className="block w-full mt-3.5 text-center text-[13px] font-medium text-white bg-white/15 py-2 rounded-lg hover:bg-white/25 transition-colors">Login to manage</Link>
              )}
            </div>
          )}

          {/* Doctor profile card */}
          {isAuthenticated ? (
            <div className="bg-card rounded-lg border border-border p-5">
              <div className="flex flex-col items-center text-center pb-3.5 border-b border-border mb-3.5">
                <div className="w-13 h-13 rounded-full bg-teal flex items-center justify-center text-white text-[17px] font-semibold mb-2.5 overflow-hidden">
                  {user?.profile_image ? (
                    <img src={user.profile_image} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'U'
                  )}
                </div>
                <p className="font-display font-semibold text-[16px] text-navy">{user?.name || 'User'}</p>
                <p className="text-[12px] text-slate-light mt-0.5">Doctor</p>
              </div>
              {[
                ['Today', upcoming.length],
                ['Completed', completed.length],
                ['Cancelled', cancelled.length],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between items-center py-1.5">
                  <span className="text-[12px] text-slate-light">{k}</span>
                  <span className="text-[12px] font-medium text-navy">{v}</span>
                </div>
              ))}
              <Link to="/profile" className="block w-full mt-3.5 text-center text-[13px] font-medium text-teal bg-teal-light py-2 rounded-lg hover:bg-teal hover:text-white transition-colors">
                Edit profile
              </Link>
            </div>
          ) : (
            <div className="bg-card rounded-lg border border-border p-5">
              <div className="flex flex-col items-center text-center">
                <div className="w-13 h-13 rounded-full bg-navy/10 flex items-center justify-center text-navy mb-2.5">
                  <User size={24} />
                </div>
                <p className="font-display font-semibold text-[16px] text-navy">Guest Doctor</p>
                <p className="text-[12px] text-slate-light mt-0.5">Not logged in</p>
              </div>
              <Link to="/login" className="block w-full mt-3.5 text-center text-[13px] font-medium text-white bg-teal py-2 rounded-lg hover:bg-teal-mid transition-colors">Login to manage your practice</Link>
            </div>
          )}

          {/* Summary card */}
          <div className="bg-teal rounded-lg p-5">
            <p className="text-[12px] font-medium mb-3.5 text-white/70">This week</p>
            <div className="flex justify-between">
              {[
                [String(upcoming.length), 'Today'],
                [String(completed.length), 'Done'],
                [String(cancelled.length), 'Cancelled'],
              ].map(([n, l]) => (
                <div key={l} className="text-center">
                  <p className="font-display font-bold text-[24px] text-white">{n}</p>
                  <p className="text-[10px] mt-0.5 text-white/60">{l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
