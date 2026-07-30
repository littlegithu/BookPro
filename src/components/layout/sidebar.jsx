import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../../context/auth-context'
import { LayoutGrid, Calendar, Stethoscope, ClipboardList, User } from 'lucide-react'
import ThemeToggle from '../theme/theme-toggle'

const navItems = [
  { label: 'Dashboard', to: '/dashboard', icon: <LayoutGrid size={18} />, end: true },
  { label: 'Appointments', to: '/appointments', icon: <Calendar size={18} /> },
  { label: 'Find a doctor', to: '/doctors', icon: <Stethoscope size={18} /> },
  { label: 'Medical records', to: '/appointments', icon: <ClipboardList size={18} /> },
]
const accountItems = [
  { label: 'Profile', to: '/profile', icon: <User size={18} /> },
]

export default function Sidebar() {
  const { user } = useAuth()

  const initials = user?.name
    ? user.name.split(' ').filter(Boolean).map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : 'G'

  const cls = ({ isActive }) =>
    `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm w-full text-left ${
      isActive ? 'bg-teal text-white font-medium' : 'text-white/50'
    }`

  return (
    <aside className="w-60 shrink-0 bg-navy flex flex-col fixed top-0 left-0 h-screen overflow-y-auto">
      <Link to="/" className="px-5 py-6 border-b border-white/10 flex items-center justify-between">
        <span className="font-display font-bold text-[19px] text-white">Book<span style={{color:'#5CD6C4'}}>Pro</span></span>
        <ThemeToggle />
      </Link>
      <div className="flex-1 px-3 py-4 flex flex-col">
        <p className="text-[10px] font-semibold text-white/30 uppercase tracking-widest px-2 pt-1 pb-2">Main</p>
        {navItems.map(item => (
          <NavLink key={item.label} to={item.to} end={item.end} className={cls}>
            <span>{item.icon}</span>{item.label}
          </NavLink>
        ))}
        <p className="text-[10px] font-semibold text-white/30 uppercase tracking-widest px-2 pt-4 pb-2">Account</p>
        {accountItems.map(item => (
          <NavLink key={item.label} to={item.to} className={cls}>
            <span>{item.icon}</span>{item.label}
          </NavLink>
        ))}
        <div className="flex-1" />
        <NavLink to="/doctors" className="flex items-center gap-2 px-3 py-2.5 mt-4 rounded-lg text-sm font-medium transition-colors" style={{background:'rgba(92,214,196,0.13)',border:'1px solid rgba(92,214,196,0.25)',color:'#5CD6C4'}}>
          <span>+</span> Book appointment
        </NavLink>
        <div className="mt-3 px-3 py-3 rounded-lg flex items-center gap-2.5" style={{background:'rgba(255,255,255,0.05)'}}>
          <div className="w-8 h-8 rounded-full bg-teal flex items-center justify-center text-white text-xs font-semibold shrink-0">
            {initials}
          </div>
          <div>
            <p className="text-white text-[13px] font-medium leading-tight">{user?.name || 'Guest User'}</p>
            <p className="text-[11px]" style={{color:'rgba(255,255,255,0.38)'}}>{user ? 'Patient' : 'Guest'}</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
