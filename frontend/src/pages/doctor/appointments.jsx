import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Calendar, Clock, User, MapPin, Search, Filter, Eye, Edit3,
  CheckCircle, XCircle, RefreshCw, CheckCheck, Printer, FileDown,
  ChevronDown, MoreVertical, Phone, Mail, Pill
} from 'lucide-react'
import Topbar from '../../components/layout/topbar'
import DoctorDashboardLayout from '../../components/layout/doctor-dashboard-layout'
import { fetchDoctorAppointments, fetchDoctorHospitals, updateDoctorAppointment, cancelDoctorAppointment } from '../../services/api'
import StatusBadge from '../../components/doctor/shared/status-badge'
import { getStatusColor } from '../../components/doctor/shared/status-utils'

const TABS = [
  { key: 'today', label: 'Today' },
  { key: 'upcoming', label: 'Upcoming' },
  { key: 'pending', label: 'Pending' },
  { key: 'completed', label: 'Completed' },
  { key: 'cancelled', label: 'Cancelled' },
]

export default function DoctorAppointmentsPage() {
  const navigate = useNavigate()
  const [appointments, setAppointments] = useState([])
  const [hospitals, setHospitals] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('today')
  const [actionLoading, setActionLoading] = useState({})
  const [searchQuery, setSearchQuery] = useState('')
  const [hospitalFilter, setHospitalFilter] = useState('')
  const [consultationTypeFilter, setConsultationTypeFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [showExportMenu, setShowExportMenu] = useState(false)

  useEffect(() => {
    loadHospitals()
  }, [])

  useEffect(() => {
    loadAppointments()
  }, [activeTab, hospitalFilter, consultationTypeFilter, statusFilter])

  async function loadHospitals() {
    try {
      const data = await fetchDoctorHospitals()
      setHospitals(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Failed to load hospitals:', err)
    }
  }

  async function loadAppointments() {
    setLoading(true)
    try {
      const params = {
        tab: activeTab,
        q: searchQuery,
        hospital_id: hospitalFilter,
        consultation_type: consultationTypeFilter,
        status: statusFilter
      }
      const data = await fetchDoctorAppointments(params)
      setAppointments(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err.message || 'Failed to load appointments')
    } finally {
      setLoading(false)
    }
  }

  const handleAction = async (id, action) => {
    setActionLoading(prev => ({ ...prev, [id]: action }))
    try {
      if (action === 'cancel') {
        await cancelDoctorAppointment(id)
        setAppointments(prev => prev.filter(a => a.id !== id))
      } else if (action === 'accept') {
        await updateDoctorAppointment(id, { status: 'Scheduled' })
        setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: 'Scheduled' } : a))
      } else if (action === 'reject') {
        await updateDoctorAppointment(id, { status: 'Cancelled' })
        setAppointments(prev => prev.filter(a => a.id !== id))
      } else if (action === 'complete') {
        await updateDoctorAppointment(id, { status: 'Completed' })
        setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: 'Completed' } : a))
      }
    } catch (err) {
      console.error(`Failed to ${action} appointment:`, err)
    } finally {
      setActionLoading(prev => ({ ...prev, [id]: null }))
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    loadAppointments()
  }

  const getPatientName = (apt) => {
    if (apt.patient?.first_name && apt.patient?.last_name) return `${apt.patient.first_name} ${apt.patient.last_name}`
    return apt.patient_name || 'Unknown Patient'
  }

  const getHospital = (apt) => {
    return apt.hospital?.name || apt.hospital_name || 'BookPro Clinic'
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A'
    try {
      return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    } catch {
      return dateStr
    }
  }

  const formatTime = (time) => {
    if (!time) return 'N/A'
    return time
  }

  const handlePrint = (apt) => {
    const printWindow = window.open('', '_blank')
    printWindow.document.write(`
      <html>
        <head><title>Appointment #${apt.id}</title></head>
        <body>
          <h1>Appointment Details</h1>
          <p><strong>ID:</strong> ${apt.id}</p>
          <p><strong>Patient:</strong> ${getPatientName(apt)}</p>
          <p><strong>Date:</strong> ${formatDate(apt.appointment_date)}</p>
          <p><strong>Time:</strong> ${formatTime(apt.appointment_time)}</p>
          <p><strong>Hospital:</strong> ${getHospital(apt)}</p>
          <p><strong>Status:</strong> ${apt.status}</p>
          <p><strong>Notes:</strong> ${apt.notes || 'N/A'}</p>
        </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.print()
  }

  const handleExportPDF = () => {
    alert('PDF export functionality - would generate PDF of all filtered appointments')
  }

  return (
    <DoctorDashboardLayout>
      <Topbar title="Appointment Management" subtitle="View and manage all your appointments" />

      <div className="p-7 space-y-5">
        {/* Tabs */}
        <div className="bg-card rounded-xl border border-border p-1.5">
          <div className="flex gap-1 overflow-x-auto">
            {TABS.map(tab => (
              <button
                key={tab.key}
                onClick={() => { setActiveTab(tab.key); setShowExportMenu(false) }}
                className={`px-5 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab.key
                    ? 'bg-navy text-white'
                    : 'text-slate hover:bg-surface hover:text-navy'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="bg-card rounded-xl border border-border p-4">
          <form onSubmit={handleSearch} className="flex flex-col lg:flex-row gap-3">
            <div className="flex-1 relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-light" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by patient name or appointment ID..."
                className="w-full pl-9 pr-4 py-2 bg-surface border border-border rounded-lg text-sm text-navy placeholder:text-slate-light outline-none focus:border-teal"
              />
            </div>
            <select
              value={hospitalFilter}
              onChange={(e) => setHospitalFilter(e.target.value)}
              className="px-4 py-2 bg-surface border border-border rounded-lg text-sm text-navy outline-none focus:border-teal"
            >
              <option value="">All Hospitals</option>
              {hospitals.map(h => (
                <option key={h.id} value={h.id}>{h.name}</option>
              ))}
            </select>
            <select
              value={consultationTypeFilter}
              onChange={(e) => setConsultationTypeFilter(e.target.value)}
              className="px-4 py-2 bg-surface border border-border rounded-lg text-sm text-navy outline-none focus:border-teal"
            >
              <option value="">All Consultation Types</option>
              <option value="Physical">Physical</option>
              <option value="Virtual">Virtual</option>
              <option value="Both">Both</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 bg-surface border border-border rounded-lg text-sm text-navy outline-none focus:border-teal"
            >
              <option value="">All Statuses</option>
              <option value="Scheduled">Scheduled</option>
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
            <button type="submit" className="px-4 py-2 bg-teal text-white rounded-lg text-sm font-medium hover:bg-teal/90 transition-colors">
              <Filter size={14} className="inline mr-1" />Apply
            </button>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="px-4 py-2 border border-border rounded-lg text-sm font-medium text-slate hover:bg-surface transition-colors"
              >
                <FileDown size={14} className="inline mr-1" />Export
              </button>
              {showExportMenu && (
                <div className="absolute right-0 top-full mt-1 bg-card border border-border rounded-lg shadow-lg z-20 min-w-[160px]">
                  <button onClick={handlePrint} className="w-full text-left px-4 py-2 text-sm text-navy hover:bg-surface transition-colors">Print</button>
                  <button onClick={handleExportPDF} className="w-full text-left px-4 py-2 text-sm text-navy hover:bg-surface transition-colors">Export PDF</button>
                </div>
              )}
            </div>
          </form>
        </div>

        {error && (
          <div className="text-red-600 text-center py-5 bg-red-50 rounded-xl border border-red-200">{error}</div>
        )}

        {/* Appointments Table */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <span className="inline-block w-8 h-8 border-2 border-teal border-t-transparent rounded-full animate-spin" />
          </div>
        ) : appointments.length === 0 ? (
          <div className="bg-card rounded-xl border border-border p-10 text-center">
            <Calendar className="w-16 h-16 mx-auto mb-4 text-slate-light opacity-40" />
            <p className="text-lg font-medium text-navy mb-1">No appointments found</p>
            <p className="text-sm text-slate-light">No appointments match your current filters.</p>
          </div>
        ) : (
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-surface border-b border-border">
                  <tr>
                    <th className="px-4 py-3 text-xs font-semibold text-slate uppercase tracking-wider">Patient</th>
                    <th className="px-4 py-3 text-xs font-semibold text-slate uppercase tracking-wider">Date</th>
                    <th className="px-4 py-3 text-xs font-semibold text-slate uppercase tracking-wider">Time</th>
                    <th className="px-4 py-3 text-xs font-semibold text-slate uppercase tracking-wider">Hospital</th>
                    <th className="px-4 py-3 text-xs font-semibold text-slate uppercase tracking-wider">Type</th>
                    <th className="px-4 py-3 text-xs font-semibold text-slate uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-xs font-semibold text-slate uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {appointments.map((apt) => (
                    <tr key={apt.id} className="hover:bg-surface/50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-teal-light flex items-center justify-center text-teal text-xs font-semibold shrink-0">
                            {getPatientName(apt)?.charAt(0) || 'P'}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-navy">{getPatientName(apt)}</p>
                            <p className="text-[11px] text-slate-light">#{apt.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate">{formatDate(apt.appointment_date)}</td>
                      <td className="px-4 py-3 text-sm text-slate">{formatTime(apt.appointment_time)}</td>
                      <td className="px-4 py-3 text-sm text-slate">{getHospital(apt)}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${getConsultationTypeColor(apt.consultation_type)}`}>
                          {apt.consultation_type || 'Physical'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={apt.status} />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <Link to={`/doctor/patients/${apt.patient_id}`} className="p-1.5 rounded-md text-slate hover:text-teal hover:bg-teal-light transition-colors" title="View">
                            <Eye size={14} />
                          </Link>
                          <button onClick={() => handleAction(apt.id, 'accept')} className="p-1.5 rounded-md text-slate hover:text-green hover:bg-green-light transition-colors" title="Accept" disabled={actionLoading[apt.id]}>
                            <CheckCircle size={14} />
                          </button>
                          <button onClick={() => handleAction(apt.id, 'reject')} className="p-1.5 rounded-md text-slate hover:text-red hover:bg-red-light transition-colors" title="Reject" disabled={actionLoading[apt.id]}>
                            <XCircle size={14} />
                          </button>
                          <button onClick={() => handleAction(apt.id, 'complete')} className="p-1.5 rounded-md text-slate hover:text-green hover:bg-green-light transition-colors" title="Complete" disabled={actionLoading[apt.id]}>
                            <CheckCheck size={14} />
                          </button>
                          <button onClick={() => handlePrint(apt)} className="p-1.5 rounded-md text-slate hover:text-blue hover:bg-blue-light transition-colors" title="Print">
                            <Printer size={14} />
                          </button>
                          <button onClick={() => handleAction(apt.id, 'cancel')} className="p-1.5 rounded-md text-slate hover:text-red hover:bg-red-light transition-colors" title="Cancel" disabled={actionLoading[apt.id] === 'cancel'}>
                            <X size={14} />
                          </button>
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

function getConsultationTypeColor(type) {
  switch (type) {
    case 'Physical': return 'bg-teal-light text-teal'
    case 'Virtual': return 'bg-blue-light text-blue'
    case 'Both': return 'bg-purple-light text-purple'
    default: return 'bg-gray-light text-gray'
  }
}
