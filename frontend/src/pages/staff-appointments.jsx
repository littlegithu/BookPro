import { useState, useEffect } from 'react'
import { Search } from 'lucide-react'
import StaffDashboardLayout from '../components/layout/staff-dashboard-layout'
import Topbar from '../components/layout/topbar'
import { useAuth } from '../context/auth-context'
import { fetchStaffAppointments } from '../services/api'

export default function StaffAppointmentsPage() {
  const { isAuthenticated } = useAuth()
  const [appointments, setAppointments] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      try {
        const apptsData = await fetchStaffAppointments()
        setAppointments(apptsData)
      } catch (err) {
        console.error('Failed to load data:', err)
        setError('Failed to load appointments')
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [searchQuery])

  const getStatusBadge = (status) => {
    const colors = {
      'Scheduled': 'bg-teal/20 text-teal',
      'Checked In': 'bg-blue/20 text-blue',
      'In Progress': 'bg-purple/20 text-purple',
      'Completed': 'bg-green/20 text-green',
      'Cancelled': 'bg-red/20 text-red',
    }
    return colors[status] || 'bg-slate/10 text-slate'
  }

  const filteredAppointments = statusFilter === 'all'
    ? appointments
    : appointments.filter(a => a.status === statusFilter)

  if (!isAuthenticated) {
    return (
      <StaffDashboardLayout>
        <Topbar title="Staff Dashboard" subtitle="" />
        <div className="p-7">
          <div className="text-center py-20">
            <p className="text-navy mb-4">Please log in to view appointments</p>
          </div>
        </div>
      </StaffDashboardLayout>
    )
  }

  return (
    <StaffDashboardLayout>
      <Topbar title="Appointments" subtitle="Manage hospital appointments" />
      <div className="p-7">
        <div className="mb-5">
          <div className="relative max-w-md">
            <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-light" />
            <input
              type="text"
              placeholder="Search patients..."
              className="w-full pl-12 pr-4 py-3 bg-card border border-border rounded-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="mb-4 flex gap-2">
          {['all', 'Scheduled', 'Checked In', 'Completed', 'Cancelled'].map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                statusFilter === status
                  ? 'bg-teal text-white'
                  : 'bg-card text-navy border border-border hover:border-teal'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <span className="inline-block w-10 h-10 border-3 border-teal border-t-transparent rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="text-red-600 text-center py-10">{error}</div>
        ) : (
          <div className="space-y-3">
            {filteredAppointments.map(appt => (
              <div key={appt.id} className="bg-card rounded-lg border border-border p-4">
                <div className="grid grid-cols-[1fr_auto] gap-4 items-start">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-teal flex items-center justify-center text-white font-semibold">
                      {appt.doctorName?.[0] || 'D'}
                    </div>
                    <div>
                      <h3 className="font-display font-semibold text-navy">{appt.doctorName || 'Patient'}</h3>
                      <p className="text-[13px] text-slate-light">
                        {appt.patient_name || 'Unknown patient'}
                      </p>
                      <p className="text-[12px] text-slate-light mt-1">
                        {appt.date} at {appt.time}
                      </p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[11px] font-medium ${getStatusBadge(appt.status)}`}>
                    {appt.status}
                  </span>
                </div>
              </div>
            ))}
            {filteredAppointments.length === 0 && (
              <div className="text-center py-20 text-slate-light">
                <p>No appointments found</p>
              </div>
            )}
          </div>
        )}
      </div>
    </StaffDashboardLayout>
  )
}