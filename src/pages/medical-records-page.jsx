import { useState, useEffect } from 'react'
import DashboardLayout from '../components/layout/dashboard-layout'
import Topbar from '../components/layout/topbar'
import PastVisitList from '../components/appointment/past-visit-list'
import { useAuth } from '../context/auth-context'
import { fetchAppointments } from '../services/api'

export default function MedicalRecordsPage() {
  const { isAuthenticated } = useAuth()
  const [appts, setAppts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchAppointments()
        setAppts(data)
      } catch (err) {
        console.error('Failed to load medical records:', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const past = appts.filter(a => a.status === 'completed' || a.status === 'cancelled')

  return (
    <DashboardLayout>
      <Topbar title="Medical Records" subtitle={isAuthenticated ? "Your complete visit history" : "Browse medical records"} />
      <div className="p-7">
        {!isAuthenticated && (
          <div className="bg-teal-light border border-teal rounded-lg p-4 mb-6 flex items-center justify-between">
            <p className="text-[13px] text-teal font-medium">Login to view your personal medical records</p>
            <a href="/login" className="text-[13px] font-medium text-white bg-teal px-4 py-2 rounded-lg hover:bg-teal-mid transition-colors">Login</a>
          </div>
        )}
        {loading ? (
          <p className="text-slate">Loading medical records...</p>
        ) : (
          <div className="bg-card rounded-xl border border-border p-5">
            <h2 className="font-display font-semibold text-[17px] text-navy mb-4">Past visits</h2>
            <PastVisitList appointments={past} />
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
