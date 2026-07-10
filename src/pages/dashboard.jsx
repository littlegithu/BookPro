import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, CheckCircle, ClipboardList, Clock, Stethoscope } from 'lucide-react'
import DashboardLayout from '../components/layout/DashboardLayout'
import Topbar from '../components/layout/Topbar'
import AppointmentList from '../components/appointment/AppointmentList'
import PastVisitList from '../components/appointment/PastVisitList'
import StatusBadge from '../components/shared/StatusBadge'

const UPCOMING = [
  { id: 1, doctorName: 'Dr. Jane Mwangi', specialty: 'General Practice', date: 'Mon 14 Jul', time: '10:00 AM', status: 'confirmed'},
  { id: 2, doctorName: 'Dr. Kevin Omondi', specialty: 'Pediatrics', date: 'Wed 16 Jul', time: '2:00 PM', status: 'pending'},
]
const PAST = [
  { id: 3, doctorName: 'Dr. Amara Patel', specialty: 'Dermatology', date: '12 May 2025', status: 'completed'},
  { id: 4, doctorName: 'Dr. Rita Lee', specialty: 'General Practice', date: '3 Apr 2025', status: 'cancelled'},
  { id: 5, doctorName: 'Dr. Brian Mutua', specialty: 'Dentistry', date: '18 Feb 2025', status: 'completed'},
]

export default function DashboardPage() {
  const [upcoming, setUpcoming] = useState(UPCOMING)

  const handleCancel = (id) => setUpcoming(prev => prev.filter(a => a.id !== id))

  return (
    <DashboardLayout>
      <Topbar title="Good morning, Iann" subtitle="Tuesday, 7 July 2026" />
      <div className="p-7 grid grid-cols-[1fr_272px] gap-5 flex-1">

        {/* Left column */}
        <div className="flex flex-col gap-5">
          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3.5">
            <div className="bg-teal rounded-lg border border-teal p-5">
              <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center mb-3.5"><Calendar size={20} /></div>
              <p className="font-display font-bold text-[28px] text-white">{upcoming.length}</p>
              <p className="text-[12px] text-white/62 mt-0.5">Upcoming appointments</p>
            </div>
            <div className="bg-card rounded-lg border border-border p-5">
              <div className="w-8 h-8 rounded-lg bg-teal-light flex items-center justify-center mb-3.5"><CheckCircle size={20} /></div>
              <p className="font-display font-bold text-[28px] text-navy">4</p>
              <p className="text-[12px] text-slate-light mt-0.5">Completed visits</p>
            </div>
            <div className="bg-card rounded-lg border border-border p-5">
              <div className="w-8 h-8 rounded-lg bg-teal-light flex items-center justify-center mb-3.5"><ClipboardList size={20} /></div>
              <p className="font-display font-bold text-[28px] text-navy">3</p>
              <p className="text-[12px] text-slate-light mt-0.5">Medical records</p>
            </div>
          </div>

          {/* Upcoming */}
          <div className="bg-card rounded-lg border border-border p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-semibold text-[17px] text-navy">Upcoming appointments</h2>
              <Link to="/appointments" className="text-[12px] font-medium text-teal hover:underline">View all →</Link>
            </div>
            <AppointmentList appointments={upcoming} onCancel={handleCancel} />
          </div>

          {/* Past visits */}
          <div className="bg-card rounded-lg border border-border p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-semibold text-[17px] text-navy">Past visits</h2>
              <Link to="/appointments" className="text-[12px] font-medium text-teal hover:underline">View all →</Link>
            </div>
            <PastVisitList appointments={PAST} />
          </div>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-4">
          {/* Next appointment */}
          {upcoming[0] && (
            <div className="bg-teal rounded-lg p-5">
              <p className="text-[10px] font-semibold text-white/62 uppercase tracking-wider mb-2">Next appointment</p>
              <p className="font-display font-semibold text-[16px] text-white mb-1.5">{upcoming[0].doctorName}</p>
              <div className="text-[12px] text-white/70 flex flex-col gap-1">
                <span className="flex items-center gap-2"><Calendar size={14} /> Monday, 14 July 2026</span>
                <span className="flex items-center gap-2"><Clock size={14} /> 10:00 – 10:30 AM</span>
                <span className="flex items-center gap-2"><Stethoscope size={14} /> {upcoming[0].specialty}</span>
              </div>
              <div className="flex gap-2 mt-3.5">
                <button onClick={() => handleCancel(upcoming[0].id)} className="flex-1 py-2 rounded-md text-[12px] font-medium text-white cursor-pointer" style={{background:'rgba(255,255,255,0.15)'}}>Cancel</button>
                <button className="flex-1 py-2 rounded-md bg-white text-teal text-[12px] font-medium cursor-pointer">Reschedule</button>
              </div>
            </div>
          )}

          {/* Profile card */}
          <div className="bg-card rounded-lg border border-border p-5">
            <div className="flex flex-col items-center text-center pb-3.5 border-b border-border mb-3.5">
              <div className="w-13 h-13 rounded-full bg-teal flex items-center justify-center text-white text-[17px] font-semibold mb-2.5">IA</div>
              <p className="font-display font-semibold text-[16px] text-navy">Iann</p>
              <p className="text-[12px] text-slate-light mt-0.5">iann@email.com</p>
            </div>
            {[['Total visits','6'],['Member since','Jan 2025'],['Last checkup','12 May 2025']].map(([k,v]) => (
              <div key={k} className="flex justify-between items-center py-1.5">
                <span className="text-[12px] text-slate-light">{k}</span>
                <span className="text-[12px] font-medium text-navy">{v}</span>
              </div>
            ))}
            <Link to="/profile" className="block w-full mt-3.5 text-center text-[13px] font-medium text-teal bg-teal-light py-2 rounded-lg hover:bg-teal hover:text-white transition-colors">Edit profile</Link>
          </div>

          {/* Summary card */}
          <div className="bg-navy rounded-lg p-5">
            <p className="text-[12px] font-medium mb-3.5" style={{color:'rgba(255,255,255,0.55)'}}>Visit summary</p>
            <div className="flex justify-between">
              {[['2','Upcoming'],['4','Completed'],['1','Cancelled']].map(([n,l]) => (
                <div key={l} className="text-center">
                  <p className="font-display font-bold text-[24px] text-white">{n}</p>
                  <p className="text-[10px] mt-0.5" style={{color:'rgba(255,255,255,0.38)'}}>{l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
