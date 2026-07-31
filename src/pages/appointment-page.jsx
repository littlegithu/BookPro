import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import DashboardLayout from '../components/layout/dashboard-layout'
import Topbar from '../components/layout/topbar'
import AppointmentList from '../components/appointment/appointment-list'
import PastVisitList from '../components/appointment/past-visit-list'
import { useAuth } from '../context/auth-context'
import { fetchAppointments, cancelAppointment } from '../services/api'

const TABS = ['All','Upcoming','Completed','Cancelled']

export default function AppointmentsPage() {
  const { isAuthenticated } = useAuth()
  const [searchParams] = useSearchParams()
  const initialTab = searchParams.get('tab') || 'All'
  const [tab, setTab] = useState(TABS.includes(initialTab) ? initialTab : 'All')
  const [appts, setAppts] = useState([])
  const [loading, setLoading] = useState(true)
  const [cancelError, setCancelError] = useState('')
  const [cancellingId, setCancellingId] = useState(null)

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchAppointments()
        setAppts(data)
      } catch (err) {
        console.error('Failed to load appointments:', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const filtered = tab === 'All' ? appts
    : tab === 'Upcoming' ? appts.filter(a => a.status === 'confirmed' || a.status === 'pending' || a.status === 'Scheduled')
    : tab === 'Completed' ? appts.filter(a => a.status === 'completed')
    : appts.filter(a => a.status === 'cancelled')

  const upcoming = filtered.filter(a => a.status === 'confirmed' || a.status === 'pending' || a.status === 'Scheduled')
  const past = filtered.filter(a => a.status === 'completed' || a.status === 'cancelled')

  const handleCancel = async (id) => {
    setCancelError('')
    setCancellingId(id)
    try {
      await cancelAppointment(id)
      setAppts(prev => prev.filter(a => a.id !== id))
    } catch (err) {
      console.error('Failed to cancel appointment:', err)
      setCancelError(err.message || 'Failed to cancel appointment. Please try again.')
    } finally {
      setCancellingId(null)
    }
  }

  return (
    <DashboardLayout>
      <Topbar title="Appointments" subtitle={isAuthenticated ? "Manage all your bookings" : "Browse all appointments"} />
      <div className="p-7">
        {!isAuthenticated && (
          <div className="bg-teal-light border border-teal rounded-lg p-4 mb-6 flex items-center justify-between">
            <p className="text-[13px] text-teal font-medium">Login to book and manage your own appointments</p>
            <Link to="/login" className="text-[13px] font-medium text-white bg-teal px-4 py-2 rounded-lg hover:bg-teal-mid transition-colors">Login</Link>
          </div>
        )}
        <div className="flex gap-2 mb-6">
          {TABS.map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`text-[13px] font-medium px-4 py-2 rounded-lg transition-colors cursor-pointer ${tab === t ? 'bg-teal text-white' : 'bg-card text-slate border border-border hover:border-teal hover:text-teal'}`}
            >
              {t}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-10">
            <span className="inline-block w-6 h-6 border-2 border-teal border-t-transparent rounded-full animate-spin" aria-hidden="true" />
          </div>
        ) : (
          <>
            {upcoming.length > 0 && (
              <div className="bg-card rounded-xl border border-border p-5 mb-5">
                <h2 className="font-display font-semibold text-[17px] text-navy mb-4">Upcoming</h2>
                <AppointmentList appointments={upcoming} onCancel={isAuthenticated ? handleCancel : undefined} cancellingId={cancellingId} />
              </div>
            )}
            {cancelError && (
              <div className="mb-5 text-[13px] text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5">
                {cancelError}
                <button onClick={() => setCancelError('')} className="ml-2 text-red-800 hover:text-red-900 font-medium">Dismiss</button>
              </div>
            )}

            {past.length > 0 && (
              <div className="bg-card rounded-xl border border-border p-5">
                <h2 className="font-display font-semibold text-[17px] text-navy mb-4">Past visits</h2>
                <PastVisitList appointments={past} />
              </div>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  )
}
