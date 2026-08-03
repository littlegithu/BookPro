import { Link } from 'react-router-dom'
import { LayoutGrid, Calendar, User, ClipboardList, FileText, BarChart2, Stethoscope, Shield, Settings, Bell, LogOut, CalendarClock } from 'lucide-react'

export const doctorNavItems = [
  { label: 'Dashboard', to: '/doctor/dashboard', icon: <LayoutGrid size={18} />, end: true },
  { label: "Today's Schedule", to: '/doctor/schedule', icon: <CalendarClock size={18} /> },
  { label: 'Appointments', to: '/doctor/appointments', icon: <Calendar size={18} /> },
  { label: 'Patients', to: '/doctor/patients', icon: <User size={18} /> },
  { label: 'Medical Records', to: '/doctor/medical-records', icon: <ClipboardList size={18} /> },
  { label: 'Prescriptions', to: '/doctor/prescriptions', icon: <FileText size={18} /> },
  { label: 'Availability', to: '/doctor/availability', icon: <Calendar size={18} /> },
  { label: 'Reviews', to: '/doctor/reviews', icon: <Stethoscope size={18} /> },
  { label: 'Analytics', to: '/doctor/analytics', icon: <BarChart2 size={18} /> },
  { label: 'Hospital', to: '/doctor/hospitals', icon: <Shield size={18} /> },
  { label: 'Documents', to: '/doctor/documents', icon: <FileText size={18} /> },
]

export const doctorAccountItems = [
  { label: 'Profile', to: '/doctor/profile', icon: <User size={18} /> },
  { label: 'Settings', to: '/doctor/settings', icon: <Settings size={18} /> },
  { label: 'Notifications', to: '/doctor/notifications', icon: <Bell size={18} /> },
  { label: 'Logout', to: '/logout', icon: <LogOut size={18} /> },
]
