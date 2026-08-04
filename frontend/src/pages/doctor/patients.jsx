import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Search, UserPlus, Calendar, FileText, Phone, Mail, Eye } from 'lucide-react'
import Topbar from '../../components/layout/topbar'
import DoctorDashboardLayout from '../../components/layout/doctor-dashboard-layout'
import { fetchDoctorPatients, fetchDoctorAppointments } from '../../services/api'

export default function DoctorPatientsPage() {
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    loadPatients()
  }, [searchQuery])

  async function loadPatients() {
    setLoading(true)
    try {
      const data = await fetchDoctorPatients(searchQuery)
      setPatients(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err.message || 'Failed to load patients')
    } finally {
      setLoading(false)
    }
  }

  const calculateAge = (dob) => {
    if (!dob) return 'N/A'
    const diff = Date.now() - new Date(dob).getTime()
    return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25))
  }

  const getInitials = (patient) => {
    if (patient.first_name && patient.last_name) return `${patient.first_name[0]}${patient.last_name[0]}`.toUpperCase()
    if (patient.name) return patient.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    return 'P'
  }

  return (
    <DoctorDashboardLayout>
      <Topbar title="Patients" subtitle="Manage your patients and their records" />

      <div className="p-7 space-y-5">
        {/* Search */}
        <div className="bg-card rounded-xl border border-border p-4">
          <form onSubmit={(e) => { e.preventDefault() }} className="flex flex-col sm:flex-row gap-3 items-center">
            <div className="flex-1 relative w-full">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-light" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, phone, or email..."
                className="w-full pl-9 pr-4 py-2 bg-surface border border-border rounded-lg text-sm text-navy placeholder:text-slate-light outline-none focus:border-teal"
              />
            </div>
            <Link to="/doctor/patients/new" className="px-4 py-2 bg-teal text-white rounded-lg text-sm font-medium hover:bg-teal/90 transition-colors flex items-center gap-1.5">
              <UserPlus size={14} />Add Patient
            </Link>
          </form>
        </div>

        {error && (
          <div className="text-red-600 text-center py-5 bg-red-50 rounded-xl border border-red-200">{error}</div>
        )}

        {/* Patients Table */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <span className="inline-block w-8 h-8 border-2 border-teal border-t-transparent rounded-full animate-spin" />
          </div>
        ) : patients.length === 0 ? (
          <div className="bg-card rounded-xl border border-border p-10 text-center">
            <UserPlus className="w-16 h-16 mx-auto mb-4 text-slate-light opacity-40" />
            <p className="text-lg font-medium text-navy mb-1">No patients found</p>
            <p className="text-sm text-slate-light">Start by adding a new patient or adjusting your search.</p>
          </div>
        ) : (
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-surface border-b border-border">
                  <tr>
                    <th className="px-4 py-3 text-xs font-semibold text-slate uppercase tracking-wider">Patient</th>
                    <th className="px-4 py-3 text-xs font-semibold text-slate uppercase tracking-wider">Age / Gender</th>
                    <th className="px-4 py-3 text-xs font-semibold text-slate uppercase tracking-wider">Phone</th>
                    <th className="px-4 py-3 text-xs font-semibold text-slate uppercase tracking-wider">Last Visit</th>
                    <th className="px-4 py-3 text-xs font-semibold text-slate uppercase tracking-wider">Next Appointment</th>
                    <th className="px-4 py-3 text-xs font-semibold text-slate uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {patients.map((patient) => (
                    <tr key={patient.id} className="hover:bg-surface/50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-full bg-teal-light flex items-center justify-center text-teal text-xs font-semibold shrink-0">
                            {getInitials(patient)}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-navy">{patient.name || `${patient.first_name} ${patient.last_name}`}</p>
                            <p className="text-[11px] text-slate-light">{patient.email || ''}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate">
                        {calculateAge(patient.dob)} / {patient.gender || 'N/A'}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate">{patient.phone || 'N/A'}</td>
                      <td className="px-4 py-3 text-sm text-slate">{patient.last_visit || 'N/A'}</td>
                      <td className="px-4 py-3 text-sm text-slate">{patient.next_appointment || 'N/A'}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <Link to={`/doctor/patients/${patient.id}`} className="p-1.5 rounded-md text-slate hover:text-teal hover:bg-teal-light transition-colors" title="View Profile">
                            <Eye size={14} />
                          </Link>
                          <Link to={`/doctor/medical-records?patient_id=${patient.id}`} className="p-1.5 rounded-md text-slate hover:text-blue hover:bg-blue-light transition-colors" title="Medical Records">
                            <FileText size={14} />
                          </Link>
                          <Link to={`/doctor/consultation?patient_id=${patient.id}`} className="p-1.5 rounded-md text-slate hover:text-green hover:bg-green-light transition-colors" title="New Consultation">
                            <Calendar size={14} />
                          </Link>
                          <Link to={`/doctor/appointments?patient_id=${patient.id}`} className="p-1.5 rounded-md text-slate hover:text-orange hover:bg-orange-light transition-colors" title="Appointments">
                            <Calendar size={14} />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </DoctorDashboardLayout>
  )
}
