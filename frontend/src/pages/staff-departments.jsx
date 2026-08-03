import { useState, useEffect } from 'react'
import { Hospital, Search } from 'lucide-react'
import StaffDashboardLayout from '../components/layout/staff-dashboard-layout'
import Topbar from '../components/layout/topbar'
import { useAuth } from '../context/auth-context'
import { fetchDepartments } from '../services/api'

export default function StaffDepartmentsPage() {
  const { isAuthenticated } = useAuth()
  const [departments, setDepartments] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadDepartments() {
      setLoading(true)
      try {
        const data = await fetchDepartments()
        setDepartments(data)
      } catch (err) {
        console.error('Failed to load departments:', err)
      } finally {
        setLoading(false)
      }
    }
    loadDepartments()
  }, [])

  const filteredDepartments = searchQuery
    ? departments.filter(d => d.name?.toLowerCase().includes(searchQuery.toLowerCase()))
    : departments

  if (!isAuthenticated) {
    return (
      <StaffDashboardLayout>
        <Topbar title="Staff Dashboard" subtitle="" />
        <div className="p-7">
          <div className="text-center py-20">
            <p className="text-navy mb-4">Please log in to view departments</p>
          </div>
        </div>
      </StaffDashboardLayout>
    )
  }

  return (
    <StaffDashboardLayout>
      <Topbar title="Departments" subtitle="Browse hospital departments" />
      <div className="p-7">
        <div className="mb-5">
          <div className="relative max-w-md">
            <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-light" />
            <input
              type="text"
              placeholder="Search departments..."
              className="w-full pl-12 pr-4 py-3 bg-card border border-border rounded-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <span className="inline-block w-10 h-10 border-3 border-teal border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDepartments.map(dept => (
              <div key={dept.name} className="bg-card rounded-lg border border-border p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-teal flex items-center justify-center text-white font-semibold">
                    {dept.name?.[0] || 'D'}
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-navy">{dept.name}</h3>
                    <p className="text-[13px] text-slate-light">{dept.doctors_count} doctors</p>
                    {dept.doctors && (
                      <ul className="text-[12px] text-slate-light mt-2">
                        {dept.doctors.slice(0, 3).map((doc, idx) => (
                          <li key={idx}>{doc.name}</li>
                        ))}
                        {dept.doctors.length > 3 && <li>...`+${dept.doctors.length - 3} more`</li>}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {filteredDepartments.length === 0 && (
              <div className="text-center py-20 text-slate-light">
                <p>No departments found</p>
              </div>
            )}
          </div>
        )}
      </div>
    </StaffDashboardLayout>
  )
}