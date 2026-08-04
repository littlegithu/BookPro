import { Calendar, FileText, ClipboardList, User, BarChart2, Settings, Bell, LogOut, Mail, Home, Users, Pill, Clock, Star, Hospital } from 'lucide-react'

export const doctorNavItems = [
  { label: 'Dashboard', to: '/doctor/dashboard', icon: <Home size={18} />, end: true },
  { label: "Today's Schedule", to: '/doctor/schedule', icon: <Calendar size={18} /> },
  { label: 'Appointments', to: '/doctor/appointments', icon: <ClipboardList size={18} /> },
  { label: 'Patients', to: '/doctor/patients', icon: <Users size={18} /> },
  { label: 'Medical Records', to: '/doctor/medical-records', icon: <FileText size={18} /> },
  { label: 'Prescriptions', to: '/doctor/prescriptions', icon: <Pill size={18} /> },
  { label: 'Availability', to: '/doctor/availability', icon: <Clock size={18} /> },
  { label: 'Reviews', to: '/doctor/reviews', icon: <Star size={18} /> },
  { label: 'Analytics', to: '/doctor/analytics', icon: <BarChart2 size={18} /> },
  { label: 'Hospital', to: '/doctor/hospitals', icon: <Hospital size={18} /> },
  { label: 'Documents', to: '/doctor/documents', icon: <FileText size={18} /> },
  { label: 'Messages', to: '/doctor/messages', icon: <Mail size={18} /> },
]

export const doctorAccountItems = [
  { label: 'Profile', to: '/doctor/profile', icon: <User size={18} /> },
  { label: 'Settings', to: '/doctor/settings', icon: <Settings size={18} /> },
  { label: 'Notifications', to: '/doctor/notifications', icon: <Bell size={18} /> },
  { label: 'Logout', to: '/logout', icon: <LogOut size={18} /> },
]
