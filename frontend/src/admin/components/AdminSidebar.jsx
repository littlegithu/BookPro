import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Users, Stethoscope, Hospital, Calendar, FileText, Star, Settings, LogOut } from 'lucide-react'

const navItems = [
  { label: 'Dashboard', to: '/admin', icon: <LayoutDashboard size={18} /> },
  { label: 'Doctors', to: '/admin/doctors', icon: <Stethoscope size={18} /> },
  { label: 'Patients', to: '/admin/patients', icon: <Users size={18} /> },
  { label: 'Hospitals', to: '/admin/hospitals', icon: <Hospital size={18} /> },
  { label: 'Appointments', to: '/admin/appointments', icon: <Calendar size={18} /> },
  { label: 'Reviews', to: '/admin/reviews', icon: <Star size={18} /> },
  { label: 'Medical Records', to: '/admin/medical-records', icon: <FileText size={18} /> },
]

export default function AdminSidebar() {
  return (
    <aside className="w-60 shrink-0 flex flex-col fixed top-0 left-0 h-screen overflow-y-auto z-[60]" style={{ background: '#1a2332' }}>
      <Link to="/admin" className="px-5 py-6 border-b border-white/10">
        <span className="font-display font-bold text-[19px] text-white">Book<span style={{ color: '#5CD6C4' }}>Pro</span> Admin</span>
      </Link>
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
        {navItems.map(item => (
          <NavLink
            key={item.label}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm w-full text-left transition-colors ${
                isActive ? 'bg-teal text-white font-medium' : 'text-white/50 hover:text-white hover:bg-white/5'
              }`
            }
          >
            <span>{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="px-3 py-4 border-t border-white/10">
        <NavLink
          to="/"
          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-white/50 hover:text-white hover:bg-white/5 transition-colors"
        >
          <LogOut size={18} />
          Back to Site
        </NavLink>
      </div>
    </aside>
  )
}