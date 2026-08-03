import { useState, useEffect } from 'react'
import { User, Search, Plus, Edit, FileText } from 'lucide-react'
import StaffDashboardLayout from '../components/layout/staff-dashboard-layout'
import Topbar from '../components/layout/topbar'
import { useAuth } from '../context/auth-context'
import { fetchStaffPatients } from '../services/api'

export default function StaffPatientsPage() {
  const { isAuthenticated } = useAuth()
  const [patients, setPatients] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadPatients() {
      setLoading(true)
      try {
        const data = await fetchStaffPatients(searchQuery)
        setPatients(data)
      } catch (err) {
        console.error('Failed to load patients:', err)
      } finally {
        setLoading(false)
      }
    }
    loadPatients()
  }, [searchQuery])

  if (!isAuthenticated) {
    return (
      <StaffDashboardLayout>
        <Topbar title="Staff Dashboard" subtitle="" />
        <div className="p-7">
          <div className="text-center py-20">
            <p className="text-navy mb-4">Please log in to view patients</p>
          </div>
        </div>
      </StaffDashboardLayout>
    )
  }

  return (
    <StaffDashboardLayout>
      <Topbar title="Patients" subtitle="Manage patient records" />
      <div className="p-7">
        <div className="mb-5 flex gap-3">
          <div className="relative max-w-md flex-1">
            <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-light" />
            <input
              type="text"
              placeholder="Search patients by name, email, phone..."
              className="w-full pl-12 pr-4 py-3 bg-card border border-border rounded-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-3 bg-teal text-white rounded-lg hover:bg-teal-mid transition-colors">
            <Plus size={18} />
            <span>Register</span>
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <span className="inline-block w-10 h-10 border-3 border-teal border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="space-y-3">
            {patients.map(patient => (
              <div key={patient.id} className="bg-card rounded-lg border border-border p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-teal flex items-center justify-center text-white font-semibold">
                      {patient.name?.[0] || 'P'}
                    </div>
                    <div>
                      <h3 className="font-display font-semibold text-navy">{patient.name}</h3>
                      <p className="text-[13px] text-slate-light">{patient.email}</p>
                      {patient.phone && <p className="text-[12px] text-slate-light">{patient.phone}</p>}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 bg-navy/10 text-navy rounded-lg hover:bg-navy/20 transition-colors">
                      <Edit size={18} />
                    </button>
                    <button className="p-2 bg-navy/10 text-navy rounded-lg hover:bg-navy/20 transition-colors">
                      <FileText size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {patients.length === 0 && (
              <div className="text-center py-20 text-slate-light">
                <p>No patients found</p>
              </div>
            )}
          </div>
        )}
      </div>
    </StaffDashboardLayout>
  )
}