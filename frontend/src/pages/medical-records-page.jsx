import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import DashboardLayout from '../components/layout/dashboard-layout'
import Topbar from '../components/layout/topbar'
import MedicalRecordCard from '../components/appointment/medical-record-card'
import { fetchAppointments } from '../services/api'
import { useAuth } from '../context/auth-context'

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

  const records = appts.filter(a => a.status === 'completed' && a.record)

  return (
    <DashboardLayout>
      <Topbar title="Medical records" subtitle={isAuthenticated ? "Your past visits and records" : "Browse medical records"} />
      <div className="p-7">
        {!isAuthenticated && (
          <div className="bg-teal-light border border-teal rounded-lg p-4 mb-6 flex items-center justify-between dark:bg-teal/20 dark:border-teal/60">
            <p className="text-[13px] text-teal font-medium dark:text-teal">Login to view your full medical records</p>
            <Link to="/login" className="text-[13px] font-medium text-white bg-teal px-4 py-2 rounded-lg hover:bg-teal-mid transition-colors">Login</Link>
          </div>
        )}
        {loading ? (
          <div className="flex items-center justify-center py-10">
            <span className="inline-block w-6 h-6 border-2 border-teal border-t-transparent rounded-full animate-spin" aria-hidden="true" />
          </div>
        ) : records.length === 0 ? (
          <div className="bg-card rounded-xl border border-border p-10 text-center dark:bg-card dark:border-border">
            <p className="text-slate text-[15px] dark:text-white/80">No medical records found.</p>
            <p className="text-slate-light text-[13px] mt-2 dark:text-white/60">Completed appointments with records will appear here.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            {records.map(record => (
              <MedicalRecordCard key={record.id} record={record.record} appointment={record} />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
