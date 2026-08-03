import { useState, useEffect } from 'react'
import StaffDashboardLayout from '../components/layout/staff-dashboard-layout'
import Topbar from '../components/layout/topbar'
import { useAuth } from '../context/auth-context'
import { fetchStaffQueue } from '../services/api'

export default function StaffQueuePage() {
  const { isAuthenticated } = useAuth()
  const [queue, setQueue] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadQueue() {
      setLoading(true)
      try {
        const queueData = await fetchStaffQueue()
        setQueue(queueData)
      } catch (err) {
        console.error('Failed to load queue:', err)
        setError('Failed to load queue')
      } finally {
        setLoading(false)
      }
    }
    loadQueue()
  }, [])

  const handleCallNext = () => {
    if (queue.length > 0) {
      setQueue(prev => prev.slice(1))
    }
  }

  if (!isAuthenticated) {
    return (
      <StaffDashboardLayout>
        <Topbar title="Staff Dashboard" subtitle="" />
        <div className="p-7">
          <div className="text-center py-20">
            <p className="text-navy mb-4">Please log in to manage the queue</p>
          </div>
        </div>
      </StaffDashboardLayout>
    )
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Waiting': return 'bg-yellow/20 text-yellow'
      case 'Checked In': return 'bg-blue/20 text-blue'
      case 'Called': return 'bg-teal/20 text-teal'
      case 'With Doctor': return 'bg-purple/20 text-purple'
      case 'Complete': return 'bg-green/20 text-green'
      default: return 'bg-slate/10 text-slate'
    }
  }

  return (
    <StaffDashboardLayout>
      <Topbar title="Queue Management" subtitle="Manage patient waiting order" />
      <div className="p-7">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <span className="inline-block w-10 h-10 border-3 border-teal border-t-transparent rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="text-red-600 text-center py-10">{error}</div>
        ) : (
          <div className="space-y-3">
            {queue.map(patient => (
              <div key={patient.id} className="bg-card rounded-lg border border-border p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-teal flex items-center justify-center text-white font-semibold text-sm">
                      {patient.room || 'R'}
                    </div>
                    <div>
                      <h3 className="font-display font-semibold text-navy">{patient.patient_name || 'Patient Name'}</h3>
                      <p className="text-[12px] text-slate-light">
                        {patient.appointment_time || 'Time'} • {patient.doctor_name || 'Doctor'}
                      </p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[11px] font-medium ${getStatusColor(patient.status)}`}>
                    {patient.status || 'Waiting'}
                  </span>
                </div>
              </div>
            ))}
            {queue.length === 0 && (
              <div className="text-center py-20 text-slate-light">
                <p>No patients in queue</p>
              </div>
            )}
          </div>
        )}

        <div className="mt-6">
          <button
            onClick={handleCallNext}
            className="px-6 py-3 bg-teal text-white rounded-lg font-medium hover:bg-teal-mid transition-colors"
          >
            Call Next Patient
          </button>
        </div>
      </div>
    </StaffDashboardLayout>
  )
}