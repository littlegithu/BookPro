import { useParams, Link } from 'react-router-dom'
import DashboardLayout from '../components/layout/dashboard-layout'
import Topbar from '../components/layout/topbar'
import StatusBadge from '../components/shared/status-badge'
import MedicalRecordCard from '../components/appointment/medical-record-card'
import Breadcrumb from '../components/shared/breadcrumb'
import { fetchAppointments, cancelAppointment } from '../services/api'
import { useState, useEffect } from 'react'

export default function AppointmentDetailPage() {
  const { id } = useParams()
  const [appt, setAppt] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchAppointments()
        const found = data.find(a => a.id === Number(id))
        setAppt(found || data[0])
      } catch (err) {
        console.error('Failed to load appointment:', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  const handleCancel = async () => {
    if (!appt) return
    try {
      await cancelAppointment(appt.id)
      setAppt(prev => ({ ...prev, status: 'cancelled' }))
    } catch (err) {
      console.error('Failed to cancel appointment:', err)
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <Topbar title="Appointment details" />
        <div className="p-7 max-w-2xl">
          <div className="flex items-center justify-center py-10">
            <span className="inline-block w-6 h-6 border-2 border-teal border-t-transparent rounded-full animate-spin" aria-hidden="true" />
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (!appt) {
    return (
      <DashboardLayout>
        <Topbar title="Appointment details" />
        <div className="p-7 max-w-2xl">
          <p className="text-slate">Appointment not found.</p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <Topbar title="Appointment details" />
      <div className="p-7 max-w-2xl">
        <Breadcrumb items={[{label:'Dashboard',to:'/dashboard'},{label:'Appointments',to:'/appointments'},{label:'Details'}]} />
        <div className="bg-card rounded-xl border border-border p-7 mt-2">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-teal-light flex items-center justify-center text-teal font-semibold text-[16px]">
                {appt.doctorName.split(' ').filter(n=>n!=='Dr.').map(n=>n[0]).join('').slice(0,2)}
              </div>
              <div>
                <h2 className="font-display font-bold text-[20px] text-navy">{appt.doctorName}</h2>
                <p className="text-[13px] text-slate-light">{appt.specialty}</p>
              </div>
            </div>
            <StatusBadge status={appt.status} />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            {[['Date',appt.date],['Time',appt.time],['Specialty',appt.specialty],['Reason',appt.reason || 'Not specified']].map(([k,v])=>(
              <div key={k} className="bg-surface rounded-lg p-4">
                <p className="text-[11px] font-medium text-teal uppercase tracking-wider mb-1">{k}</p>
                <p className="text-[13px] font-medium text-navy">{v}</p>
              </div>
            ))}
          </div>

          {appt.record && <MedicalRecordCard record={appt.record} appointment={appt} />}

          {(appt.status === 'confirmed' || appt.status === 'pending') && (
            <div className="flex gap-3 mt-6 pt-6 border-t border-border">
              <button onClick={handleCancel} className="flex-1 py-2.5 border border-border rounded-lg text-[13px] font-medium text-slate hover:border-danger-text hover:text-danger-text transition-colors">Cancel appointment</button>
              <Link to={`/doctors/${appt.doctor_id}`} className="flex-1 py-2.5 bg-teal text-white text-[13px] font-medium rounded-lg text-center hover:bg-teal-mid transition-colors">Reschedule</Link>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
