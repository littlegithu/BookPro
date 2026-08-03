import { NavLink } from 'react-router-dom'
import { useAuth } from '../../context/auth-context'
import {
  LayoutGrid,
  Calendar,
  User,
  Stethoscope,
  Shield,
  Settings,
  Hospital,
  FileText,
  CreditCard,
  Microscope,
  BarChart2
} from 'lucide-react'

const roleNavItems = {
  'Receptionist': [
    { label: 'Dashboard', to: '/staff/dashboard', icon: <LayoutGrid size={18} />, end: true },
    { label: 'Check-In', to: '/staff/check-in', icon: <Calendar size={18} /> },
    { label: 'Queue', to: '/staff/queue', icon: <Shield size={18} /> },
    { label: 'Appointments', to: '/staff/appointments', icon: <Calendar size={18} /> },
    { label: 'Patients', to: '/staff/patients', icon: <User size={18} /> },
    { label: 'Doctors', to: '/staff/doctors', icon: <Stethoscope size={18} /> },
    { label: 'Reports', to: '/staff/reports', icon: <BarChart2 size={18} /> },
  ],
  'Nurse': [
    { label: 'Dashboard', to: '/staff/dashboard', icon: <LayoutGrid size={18} />, end: true },
    { label: 'My Patients', to: '/staff/nurses/patients', icon: <User size={18} /> },
    { label: 'Appointments', to: '/staff/nurses/appointments', icon: <Calendar size={18} /> },
  ],
  'Lab Technician': [
    { label: 'Dashboard', to: '/staff/dashboard', icon: <LayoutGrid size={18} />, end: true },
    { label: 'Lab Orders', to: '/staff/lab/orders', icon: <Microscope size={18} /> },
    { label: 'Test Results', to: '/staff/lab/results', icon: <FileText size={18} /> },
  ],
  'Pharmacist': [
    { label: 'Dashboard', to: '/staff/dashboard', icon: <LayoutGrid size={18} />, end: true },
    { label: 'Prescriptions', to: '/staff/pharmacy/prescriptions', icon: <FileText size={18} /> },
    { label: 'Medications', to: '/staff/pharmacy/medications', icon: <CreditCard size={18} /> },
  ],
  'Cashier': [
    { label: 'Dashboard', to: '/staff/dashboard', icon: <LayoutGrid size={18} />, end: true },
    { label: 'Billing', to: '/staff/billing', icon: <CreditCard size={18} /> },
    { label: 'Transactions', to: '/staff/transactions', icon: <FileText size={18} /> },
  ],
  'Records Officer': [
    { label: 'Dashboard', to: '/staff/dashboard', icon: <LayoutGrid size={18} />, end: true },
    { label: 'Patient Records', to: '/staff/records', icon: <FileText size={18} /> },
    { label: 'Archives', to: '/staff/archives', icon: <Hospital size={18} /> },
  ],
  'Hospital Admin': [
    { label: 'Dashboard', to: '/staff/dashboard', icon: <LayoutGrid size={18} />, end: true },
    { label: 'Staff', to: '/staff/management', icon: <Shield size={18} /> },
    { label: 'Appointments', to: '/staff/appointments', icon: <Calendar size={18} /> },
    { label: 'Patients', to: '/staff/patients', icon: <User size={18} /> },
    { label: 'Doctors', to: '/staff/doctors', icon: <Stethoscope size={18} /> },
    { label: 'Departments', to: '/staff/departments', icon: <Hospital size={18} /> },
    { label: 'Reports', to: '/staff/reports', icon: <BarChart2 size={18} /> },
  ],
}

const accountItems = [
  { label: 'Profile', to: '/staff/profile', icon: <User size={18} /> },
  { label: 'Settings', to: '/staff/settings', icon: <Settings size={18} /> },
]

export default function StaffSidebar() {
  const { user } = useAuth()
  const staffData = user?.staff || {}
  const staffRole = staffData?.role || 'Receptionist'

  const initials = user?.name
    ? user.name.split(' ').filter(Boolean).map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : 'G'

  const navItems = roleNavItems[staffRole] || roleNavItems['Receptionist']

  const cls = ({ isActive }) =>
    `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm w-full text-left ${
      isActive ? 'bg-teal text-white font-medium' : 'text-white/50'
    }`

  return (
    <aside className="w-60 shrink-0 flex flex-col fixed top-0 left-0 h-screen overflow-y-auto z-[60]" style={{ background: '#1a2332' }}>
      <div className="px-5 py-6 border-b border-white/10">
        <span className="font-display font-bold text-[19px] text-white">Book<span style={{ color: '#5CD6C4' }}>Pro</span> - Staff</span>
      </div>
      <div className="flex-1 px-3 py-4 flex flex-col">
        <p className="text-[10px] font-semibold text-white/30 uppercase tracking-widest px-2 pt-1 pb-2">Main</p>
        {navItems.map(item => (
          <NavLink key={item.label} to={item.to} end={item.end} className={cls}>
            <span>{item.icon}</span>{item.label}
          </NavLink>
        ))}
        <p className="text-[10px] font-semibold text-white/30 uppercase tracking-widest px-2 pt-4 pb-2">{staffRole}</p>
        {accountItems.map(item => (
          <NavLink key={item.label} to={item.to} className={cls}>
            <span>{item.icon}</span>{item.label}
          </NavLink>
        ))}
        <div className="flex-1" />
        <div className="mt-3 px-3 py-3 rounded-lg flex items-center gap-2.5" style={{ background: 'rgba(255,255,255,0.05)' }}>
          <div className="w-8 h-8 rounded-full bg-teal flex items-center justify-center text-white text-xs font-semibold shrink-0 overflow-hidden">
            {user?.profile_image ? (
              <img src={user.profile_image} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              initials
            )}
          </div>
          <div>
            <p className="text-white text-[13px] font-medium leading-tight">{user?.name || 'Staff User'}</p>
            <p className="text-[11px]" style={{ color: 'rgba(255,255,255,0.38)' }}>{staffRole}</p>
          </div>
        </div>
      </div>
    </aside>
  )
}