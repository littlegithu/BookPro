import { useState, useEffect } from 'react'
import { Calendar, Clock } from 'lucide-react'
import StaffDashboardLayout from '../components/layout/staff-dashboard-layout'
import Topbar from '../components/layout/topbar'
import { useAuth } from '../context/auth-context'
import { fetchStaffAppointments, checkInPatient } from '../services/api'
import { useNavigate } from 'react-router-dom'

export default function StaffCheckInPage() {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [checkInLoading, setCheckInLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadAppointments() {
      setLoading(true)
      try {
        const appointmentsData = await fetchStaffAppointments()
        const today = new Date()
        setAppointments(appointmentsData.filter(a => {
          const apptDate = new Date(a.appointment_date)
          return apptDate.toDateString() === today.toDateString()
        }))
      } catch (err) {
        console.error('Failed to load appointments:', err)
        setError('Failed to load appointments')
      } finally {
        setLoading(false)
      }
    }
    loadAppointments()
  }, [])

  const handleCheckIn = async (appointmentId) => {
    setCheckInLoading(true)
    setError('')
    try {
      await checkInPatient(appointmentId)
      setAppointments(prev => prev.filter(a => a.id !== appointmentId))
    } catch (err) {
      console.error('Failed to check in patient:', err)
      setError(err.message || 'Failed to check in patient')
    } finally {
      setCheckInLoading(false)
    }
  }

  if (!isAuthenticated) {
    return (
      <StaffDashboardLayout>
        <Topbar title="Staff Dashboard" subtitle="" />
        <div className="p-7">
          <div className="text-center py-20">
            <p className="text-navy mb-4">Please log in to access the check-in system</p>
            <button onClick={() => navigate('/login')} className="py-2 px-6 bg-teal text-white rounded-lg hover:bg-teal-mid transition-colors">
              Go to Login
            </button>
          </div>
        </div>
      </StaffDashboardLayout>
    )
  }

  return (
    <StaffDashboardLayout>
      <Topbar title="Patient Check-In" subtitle="Check in patients for their appointments" />
      <div className="p-7">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <span className="inline-block w-10 h-10 border-3 border-teal border-t-transparent rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="text-red-600 text-center py-10">{error}</div>
        ) : (
          <div className="space-y-4">
            {appointments.map(appt => (
              <div key={appt.id} className="bg-card rounded-lg border border-border p-5">
                <div className="grid grid-cols-[1fr_auto] gap-4 items-start">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-teal flex items-center justify-center text-white font-semibold">
                      {appt.doctorName?.[0] || 'D'}
                    </div>
                    <div>
                      <h3 className="font-display font-semibold text-navy text-[16px]">
                        {appt.doctorName || 'Patient Name'}
                      </h3>
                      <p className="text-[13px] text-slate-light mt-1">
                        {appt.patient_name || 'Unknown'}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-[12px] text-slate-light">
                        <span className="flex items-center gap-1"><Clock size={12} /> {appt.time}</span>
                        <span className="flex items-center gap-1"><Calendar size={12} /> {appt.date}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleCheckIn(appt.id)}
                      disabled={checkInLoading}
                      className="px-4 py-2 bg-teal text-white rounded-lg hover:bg-teal-mid transition-colors disabled:opacity-50"
                    >
                      {checkInLoading ? 'Checking In...' : 'Check In'}
                    </button>
                    <button
                      onClick={() => {}}
                      className="px-4 py-2 bg-navy/10 text-navy rounded-lg hover:bg-navy/20 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {appointments.length === 0 && (
              <div className="text-center py-20 text-slate-light">
                <p>No appointments for today</p>
              </div>
            )}
          </div>
        )}
      </div>
    </StaffDashboardLayout>
  )
}