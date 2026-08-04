import { useState, useEffect } from 'react'
import { Stethoscope, Search, Calendar, Star } from 'lucide-react'
import StaffDashboardLayout from '../components/layout/staff-dashboard-layout'
import Topbar from '../components/layout/topbar'
import { useAuth } from '../context/auth-context'
import { fetchStaffDoctorsAvailability } from '../services/api'

export default function StaffDoctorsPage() {
  const { isAuthenticated } = useAuth()
  const [doctors, setDoctors] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadDoctors() {
      setLoading(true)
      try {
        const data = await fetchStaffDoctorsAvailability()
        setDoctors(data)
      } catch (err) {
        console.error('Failed to load doctors:', err)
      } finally {
        setLoading(false)
      }
    }
    loadDoctors()
  }, [])

  const filteredDoctors = searchQuery
    ? doctors.filter(d => d.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          d.specialty?.toLowerCase().includes(searchQuery.toLowerCase()))
    : doctors

  const getStatus = (doctor) => {
    if (!doctor.available) return { text: 'On Leave', color: 'gray' }
    return { text: 'Available', color: 'green' }
  }

  if (!isAuthenticated) {
    return (
      <StaffDashboardLayout>
        <Topbar title="Staff Dashboard" subtitle="" />
        <div className="p-7">
          <div className="text-center py-20">
            <p className="text-navy mb-4">Please log in to view doctors</p>
          </div>
        </div>
      </StaffDashboardLayout>
    )
  }

  return (
    <StaffDashboardLayout>
      <Topbar title="Doctors" subtitle="View available doctors" />
      <div className="p-7">
        <div className="mb-5">
          <div className="relative max-w-md">
            <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-light" />
            <input
              type="text"
              placeholder="Search doctors by name or specialty..."
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
          <div className="space-y-3">
            {filteredDoctors.map(doctor => {
              const status = getStatus(doctor)
              return (
                <div key={doctor.id} className="bg-card rounded-lg border border-border p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-teal flex items-center justify-center text-white font-semibold">
                        {doctor.full_name?.[0] || 'D'}
                      </div>
                      <div>
                        <h3 className="font-display font-semibold text-navy">{doctor.full_name}</h3>
                        <p className="text-[13px] text-slate-light">{doctor.specialty}</p>
                        <p className="text-[12px] text-slate-light">Rating: {doctor.rating || 0} <Star size={12} className="inline" /></p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`px-3 py-1 rounded-full text-[11px] font-medium ${
                        status.color === 'green' ? 'bg-green/20 text-green' : 'bg-gray/20 text-gray'
                      }`}>
                        {status.text}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
            {filteredDoctors.length === 0 && (
              <div className="text-center py-20 text-slate-light">
                <p>No doctors found</p>
              </div>
            )}
          </div>
        )}
      </div>
    </StaffDashboardLayout>
  )
}