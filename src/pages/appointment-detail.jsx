import { useParams, Link } from 'react-router-dom'
import DashboardLayout from '../components/layout/DashboardLayout'
import Topbar from '../components/layout/Topbar'
import StatusBadge from '../components/shared/StatusBadge'
import MedicalRecordCard from '../components/appointment/MedicalRecordCard'
import Breadcrumb from '../components/shared/Breadcrumb'

const APPOINTMENTS = {
  3: { id:3, doctorName:'Dr. Amara Patel', specialty:'Dermatology', date:'12 May 2025', time:'11:00 AM', status:'completed', reason:'Skin checkup', record:{ diagnosis:'Mild eczema', prescription:'Hydrocortisone cream 1%, apply twice daily', followUpDate:'12 August 2025' } },
  1: { id:1, doctorName:'Dr. Jane Mwangi', specialty:'General Practice', date:'Mon 14 Jul', time:'10:00 AM', status:'confirmed', reason:'Routine checkup', record:null },
}

export default function AppointmentDetailPage() {
  const { id } = useParams()
  const appt = APPOINTMENTS[id] ?? APPOINTMENTS[3]

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
            {[['Date',appt.date],['Time',appt.time],['Specialty',appt.specialty],['Reason',appt.reason]].map(([k,v])=>(
              <div key={k} className="bg-surface rounded-lg p-4">
                <p className="text-[11px] font-medium text-teal uppercase tracking-wider mb-1">{k}</p>
                <p className="text-[13px] font-medium text-navy">{v}</p>
              </div>
            ))}
          </div>

          {appt.record && <MedicalRecordCard record={appt.record} />}

          {(appt.status === 'confirmed' || appt.status === 'pending') && (
            <div className="flex gap-3 mt-6 pt-6 border-t border-border">
              <button className="flex-1 py-2.5 border border-border rounded-lg text-[13px] font-medium text-slate hover:border-danger-text hover:text-danger-text transition-colors cursor-pointer">Cancel appointment</button>
              <Link to={`/book/${appt.id}`} className="flex-1 py-2.5 bg-teal text-white text-[13px] font-medium rounded-lg text-center hover:bg-teal-mid transition-colors">Reschedule</Link>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
