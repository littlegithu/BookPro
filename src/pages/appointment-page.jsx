import { useState } from 'react'
import DashboardLayout from '../components/ui/app/layout/dashboard-layout'
import Topbar from '../components/ui/app/layout/topbar'
import AppointmentList from '../components/ui/app/appointment/appointment-list'
import PastVisitList from '../components/ui/app/appointment/past-visit-list'

const ALL = [
  { id: 1, doctorName: 'Dr. Jane Mwangi', specialty: 'General Practice', date: 'Mon 14 Jul', time: '10:00 AM', status: 'confirmed' },
  { id: 2, doctorName: 'Dr. Kevin Omondi', specialty: 'Pediatrics', date: 'Wed 16 Jul', time: '2:00 PM', status: 'pending' },
  { id: 3, doctorName: 'Dr. Amara Patel', specialty: 'Dermatology', date: '12 May 2025', status: 'completed' },
  { id: 4, doctorName: 'Dr. Rita Lee', specialty: 'General Practice', date: '3 Apr 2025', status: 'cancelled' },
  { id: 5, doctorName: 'Dr. Brian Mutua', specialty: 'Dentistry', date: '18 Feb 2025', status: 'completed' },
]

const TABS = ['All','Upcoming','Completed','Cancelled']

export default function AppointmentsPage() {
  const [tab, setTab] = useState('All')
  const [appts, setAppts] = useState(ALL)

  const filtered = tab === 'All' ? appts
    : tab === 'Upcoming' ? appts.filter(a => a.status === 'confirmed' || a.status === 'pending')
    : tab === 'Completed' ? appts.filter(a => a.status === 'completed')
    : appts.filter(a => a.status === 'cancelled')

  const upcoming = filtered.filter(a => a.status === 'confirmed' || a.status === 'pending')
  const past = filtered.filter(a => a.status === 'completed' || a.status === 'cancelled')

  return (
    <DashboardLayout>
      <Topbar title="Appointments" subtitle="Manage all your bookings" />
      <div className="p-7">
        <div className="flex gap-2 mb-6">
          {TABS.map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`text-[13px] font-medium px-4 py-2 rounded-lg transition-colors cursor-pointer ${tab === t ? 'bg-teal text-white' : 'bg-card text-slate border border-border hover:border-teal hover:text-teal'}`}
            >
              {t}
            </button>
          ))}
        </div>

        {upcoming.length > 0 && (
          <div className="bg-card rounded-xl border border-border p-5 mb-5">
            <h2 className="font-display font-semibold text-[17px] text-navy mb-4">Upcoming</h2>
            <AppointmentList appointments={upcoming} onCancel={id => setAppts(prev => prev.filter(a => a.id !== id))} />
          </div>
        )}

        {past.length > 0 && (
          <div className="bg-card rounded-xl border border-border p-5">
            <h2 className="font-display font-semibold text-[17px] text-navy mb-4">Past visits</h2>
            <PastVisitList appointments={past} />
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
