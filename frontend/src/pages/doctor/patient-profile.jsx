import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  User, Phone, Mail, Calendar, MapPin, FileText, Pill,
  Edit3, Download, Printer, Stethoscope, Activity, Heart,
  AlertTriangle, Clock, Shield, ChevronRight
} from 'lucide-react'
import Topbar from '../../components/layout/topbar'
import DoctorDashboardLayout from '../../components/layout/doctor-dashboard-layout'
import { fetchDoctorPatient, fetchDoctorMedicalRecords, fetchDoctorPrescriptions, fetchDoctorAppointments } from '../../services/api'

export default function DoctorPatientProfilePage() {
  const { id } = useParams()
  const [patient, setPatient] = useState(null)
  const [medicalRecords, setMedicalRecords] = useState([])
  const [prescriptions, setPrescriptions] = useState([])
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('info')

  useEffect(() => {
    async function loadPatient() {
      try {
        const [patientData, records, rx, appts] = await Promise.all([
          fetchDoctorPatient(id),
          fetchDoctorMedicalRecords(`patient_id=${id}`),
          fetchDoctorPrescriptions(`patient_id=${id}`),
          fetchDoctorAppointments({ patient_id: id })
        ])
        setPatient(patientData)
        setMedicalRecords(Array.isArray(records) ? records : [])
        setPrescriptions(Array.isArray(rx) ? rx : [])
        setAppointments(Array.isArray(appts) ? appts : [])
      } catch (err) {
        setError(err.message || 'Failed to load patient profile')
      } finally {
        setLoading(false)
      }
    }
    if (id) loadPatient()
  }, [id])

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A'
    try {
      return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    } catch {
      return dateStr
    }
  }

  const getInitials = () => {
    if (patient?.first_name && patient?.last_name) return `${patient.first_name[0]}${patient.last_name[0]}`.toUpperCase()
    return 'P'
  }

  if (loading) {
    return (
      <DoctorDashboardLayout>
        <Topbar title="Patient Profile" subtitle="Loading..." />
        <div className="p-7">
          <div className="flex items-center justify-center py-20">
            <span className="inline-block w-8 h-8 border-2 border-teal border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      </DoctorDashboardLayout>
    )
  }

  if (error || !patient) {
    return (
      <DoctorDashboardLayout>
        <Topbar title="Patient Profile" subtitle="" />
        <div className="p-7">
          <div className="text-red-600 text-center py-10 bg-red-50 rounded-xl border border-red-200">{error || 'Patient not found'}</div>
        </div>
      </DoctorDashboardLayout>
    )
  }

  const tabs = [
    { key: 'info', label: 'Personal Info', icon: <User size={16} /> },
    { key: 'medical', label: 'Medical Info', icon: <Heart size={16} /> },
    { key: 'appointments', label: 'Appointments', icon: <Calendar size={16} /> },
    { key: 'records', label: 'Medical Records', icon: <FileText size={16} /> },
    { key: 'prescriptions', label: 'Prescriptions', icon: <Pill size={16} /> },
  ]

  return (
    <DoctorDashboardLayout>
      <Topbar
        title={`${patient.first_name} ${patient.last_name}`}
        subtitle={`Patient ID: ${patient.id}`}
      />

      <div className="p-7 space-y-5">
        {/* Patient Header */}
        <div className="bg-card rounded-xl border border-border p-5">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-teal-light flex items-center justify-center text-teal text-xl font-semibold shrink-0">
              {getInitials()}
            </div>
            <div className="flex-1">
              <h2 className="font-display font-bold text-xl text-navy">{patient.first_name} {patient.last_name}</h2>
              <p className="text-sm text-slate-light mt-1 flex flex-wrap gap-3">
                {patient.email && <span className="flex items-center gap-1"><Mail size={13} />{patient.email}</span>}
                {patient.phone && <span className="flex items-center gap-1"><Phone size={13} />{patient.phone}</span>}
                {patient.gender && <span className="flex items-center gap-1"><User size={13} />{patient.gender}</span>}
                {patient.dob && <span className="flex items-center gap-1"><Calendar size={13} />{formatDate(patient.dob)}</span>}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Link to={`/doctor/consultation?patient_id=${patient.id}`} className="px-4 py-2 bg-green-light text-green rounded-lg text-sm font-medium hover:bg-green hover:text-white transition-colors flex items-center gap-1.5">
                <Stethoscope size={14} />Start Consultation
              </Link>
              <Link to={`/doctor/medical-records?patient_id=${patient.id}`} className="px-4 py-2 bg-blue-light text-blue rounded-lg text-sm font-medium hover:bg-blue hover:text-white transition-colors flex items-center gap-1.5">
                <FileText size={14} />Medical Records
              </Link>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-card rounded-xl border border-border p-1.5">
          <div className="flex gap-1 overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  activeTab === tab.key ? 'bg-navy text-white' : 'text-slate hover:bg-surface hover:text-navy'
                }`}
              >
                {tab.icon}{tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-card rounded-xl border border-border p-6">
          {activeTab === 'info' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-display font-semibold text-navy mb-3">Personal Information</h3>
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-sm text-slate-light">Full Name</span>
                    <span className="text-sm font-medium text-navy">{patient.first_name} {patient.last_name}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-sm text-slate-light">Email</span>
                    <span className="text-sm font-medium text-navy">{patient.email || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-sm text-slate-light">Phone</span>
                    <span className="text-sm font-medium text-navy">{patient.phone || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-sm text-slate-light">Gender</span>
                    <span className="text-sm font-medium text-navy">{patient.gender || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-sm text-slate-light">Date of Birth</span>
                    <span className="text-sm font-medium text-navy">{formatDate(patient.dob)}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-sm text-slate-light">Address</span>
                    <span className="text-sm font-medium text-navy text-right max-w-[60%]">{patient.address || 'N/A'}</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-display font-semibold text-navy mb-3">Actions</h3>
                <div className="space-y-2">
                  <button className="w-full px-4 py-2.5 border border-border rounded-lg text-sm text-navy hover:bg-surface transition-colors flex items-center gap-2">
                    <Edit3 size={14} />Edit Notes
                  </button>
                  <button className="w-full px-4 py-2.5 border border-border rounded-lg text-sm text-navy hover:bg-surface transition-colors flex items-center gap-2">
                    <Download size={14} />Download Record
                  </button>
                  <button className="w-full px-4 py-2.5 border border-border rounded-lg text-sm text-navy hover:bg-surface transition-colors flex items-center gap-2">
                    <Printer size={14} />Print Summary
                  </button>
                  <Link to={`/doctor/consultation?patient_id=${patient.id}`} className="w-full px-4 py-2.5 bg-teal text-white rounded-lg text-sm font-medium hover:bg-teal/90 transition-colors flex items-center justify-center gap-2">
                    <Stethoscope size={14} />Start Consultation
                  </Link>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'medical' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-display font-semibold text-navy mb-3">Medical Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-surface rounded-lg border border-border">
                    <p className="text-xs text-slate-light mb-1">Blood Group</p>
                    <p className="text-sm font-medium text-navy">{patient.blood_group || 'Not recorded'}</p>
                  </div>
                  <div className="p-4 bg-surface rounded-lg border border-border">
                    <p className="text-xs text-slate-light mb-1">Allergies</p>
                    <p className="text-sm font-medium text-navy">{patient.allergies || 'None known'}</p>
                  </div>
                  <div className="p-4 bg-surface rounded-lg border border-border">
                    <p className="text-xs text-slate-light mb-1">Chronic Conditions</p>
                    <p className="text-sm font-medium text-navy">{patient.chronic_conditions || 'None'}</p>
                  </div>
                  <div className="p-4 bg-surface rounded-lg border border-border">
                    <p className="text-xs text-slate-light mb-1">Current Medication</p>
                    <p className="text-sm font-medium text-navy">{patient.current_medication || 'None'}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'appointments' && (
            <div>
              <h3 className="font-display font-semibold text-navy mb-3">Appointment History</h3>
              {appointments.length === 0 ? (
                <p className="text-sm text-slate-light py-6 text-center">No appointments found</p>
              ) : (
                <div className="space-y-2">
                  {appointments.slice(0, 10).map(apt => (
                    <div key={apt.id} className="flex items-center justify-between p-3 bg-surface rounded-lg border border-border">
                      <div>
                        <p className="text-sm font-medium text-navy">{formatDate(apt.appointment_date)} at {apt.appointment_time || 'N/A'}</p>
                        <p className="text-xs text-slate-light">{apt.notes || 'General consultation'}</p>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-medium ${getStatusColor(apt.status)}`}>{apt.status}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'records' && (
            <div>
              <h3 className="font-display font-semibold text-navy mb-3">Medical Records</h3>
              {medicalRecords.length === 0 ? (
                <p className="text-sm text-slate-light py-6 text-center">No medical records found</p>
              ) : (
                <div className="space-y-2">
                  {medicalRecords.map(record => (
                    <Link key={record.id} to={`/doctor/medical-records/${record.id}`} className="flex items-center justify-between p-3 bg-surface rounded-lg border border-border hover:border-teal/30 transition-colors">
                      <div>
                        <p className="text-sm font-medium text-navy">{record.diagnosis || 'Medical Record'}</p>
                        <p className="text-xs text-slate-light">{formatDate(record.created_at)}</p>
                      </div>
                      <ChevronRight size={16} className="text-slate-light" />
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'prescriptions' && (
            <div>
              <h3 className="font-display font-semibold text-navy mb-3">Prescriptions</h3>
              {prescriptions.length === 0 ? (
                <p className="text-sm text-slate-light py-6 text-center">No prescriptions found</p>
              ) : (
                <div className="space-y-2">
                  {prescriptions.map(prescription => (
                    <div key={prescription.id} className="flex items-center justify-between p-3 bg-surface rounded-lg border border-border">
                      <div>
                        <p className="text-sm font-medium text-navy">{prescription.medicine || prescription.medication || 'Prescription'}</p>
                        <p className="text-xs text-slate-light">{formatDate(prescription.created_at)}</p>
                      </div>
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-medium bg-blue-light text-blue">{prescription.status || 'Active'}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </DoctorDashboardLayout>
  )
}

function getStatusColor(status) {
  switch (status) {
    case 'Scheduled': return 'bg-blue-light text-blue'
    case 'Completed': return 'bg-green-light text-green'
    case 'Cancelled': return 'bg-red-light text-red'
    case 'Pending': return 'bg-yellow-light text-yellow'
    case 'Checked In': return 'bg-purple-light text-purple'
    default: return 'bg-gray-light text-gray'
  }
}
