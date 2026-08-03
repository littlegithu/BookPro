import { useState, useEffect } from 'react'
import { Calendar, User, Mail, Phone, IdCard } from 'lucide-react'
import StaffDashboardLayout from '../components/layout/staff-dashboard-layout'
import Topbar from '../components/layout/topbar'
import { useAuth } from '../context/auth-context'
import { fetchHospitals } from '../services/api'

const STAFF_ROLES = [
  'Receptionist',
  'Nurse',
  'Lab Technician',
  'Pharmacist',
  'Cashier',
  'Records Officer',
]

const EMPLOYMENT_TYPES = [
  'Full Time',
  'Part Time',
  'Contract',
]

export default function StaffRegistrationPage() {
  const { isAuthenticated } = useAuth()
  const [hospitals, setHospitals] = useState([])

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    dob: '',
    gender: 'Male',
    address: '',
    employee_id: '',
    role: 'Receptionist',
    department: '',
    hospital_id: '',
    employment_type: 'Full Time',
    staff_id_photo: '',
    national_id: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    password: '',
    password_confirm: '',
  })

  useEffect(() => {
    async function loadHospitals() {
      try {
        const data = await fetchHospitals()
        setHospitals(data)
      } catch (err) {
        console.error('Failed to load hospitals:', err)
      }
    }
    loadHospitals()
  }, [])

  const handleChange = (field) => (e) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (formData.password !== formData.password_confirm) {
      alert('Passwords do not match')
      return
    }
    console.log('Submit registration:', formData)
  }

  if (!isAuthenticated) {
    return (
      <StaffDashboardLayout>
        <Topbar title="Staff Dashboard" subtitle="" />
        <div className="p-7">
          <div className="text-center py-20">
            <p className="text-navy mb-4">Please log in to access the staff management</p>
          </div>
        </div>
      </StaffDashboardLayout>
    )
  }

  return (
    <StaffDashboardLayout>
      <Topbar title="Create Staff Account" subtitle="Register a new staff member" />
      <div className="p-7 max-w-3xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[13px] font-medium text-navy mb-1">First Name</label>
              <div className="relative">
                <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-light" />
                <input
                  type="text"
                  value={formData.first_name}
                  onChange={handleChange('first_name')}
                  className="w-full pl-10 pr-4 py-3 bg-card border border-border rounded-lg"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-[13px] font-medium text-navy mb-1">Last Name</label>
              <div className="relative">
                <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-light" />
                <input
                  type="text"
                  value={formData.last_name}
                  onChange={handleChange('last_name')}
                  className="w-full pl-10 pr-4 py-3 bg-card border border-border rounded-lg"
                  required
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[13px] font-medium text-navy mb-1">Email</label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-light" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={handleChange('email')}
                  className="w-full pl-10 pr-4 py-3 bg-card border border-border rounded-lg"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-[13px] font-medium text-navy mb-1">Phone</label>
              <div className="relative">
                <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-light" />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange('phone')}
                  className="w-full pl-10 pr-4 py-3 bg-card border border-border rounded-lg"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[13px] font-medium text-navy mb-1">Date of Birth</label>
              <div className="relative">
                <Calendar size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-light" />
                <input
                  type="date"
                  value={formData.dob}
                  onChange={handleChange('dob')}
                  className="w-full pl-10 pr-4 py-3 bg-card border border-border rounded-lg"
                />
              </div>
            </div>
            <div>
              <label className="block text-[13px] font-medium text-navy mb-1">Role</label>
              <select
                value={formData.role}
                onChange={handleChange('role')}
                className="w-full py-3 bg-card border border-border rounded-lg"
              >
                {STAFF_ROLES.map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[13px] font-medium text-navy mb-1">Employee ID</label>
              <div className="relative">
                <IdCard size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-light" />
                <input
                  type="text"
                  value={formData.employee_id}
                  onChange={handleChange('employee_id')}
                  className="w-full pl-10 pr-4 py-3 bg-card border border-border rounded-lg"
                />
              </div>
            </div>
            <div>
              <label className="block text-[13px] font-medium text-navy mb-1">Department</label>
              <input
                type="text"
                value={formData.department}
                onChange={handleChange('department')}
                className="w-full py-3 bg-card border border-border rounded-lg"
                placeholder="e.g., Front Office, Nursing"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[13px] font-medium text-navy mb-1">Hospital</label>
              <select
                value={formData.hospital_id}
                onChange={handleChange('hospital_id')}
                className="w-full py-3 bg-card border border-border rounded-lg"
                required
              >
                <option value="">Select Hospital</option>
                {hospitals.map(h => (
                  <option key={h.id} value={h.id}>{h.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[13px] font-medium text-navy mb-1">Employment Type</label>
              <select
                value={formData.employment_type}
                onChange={handleChange('employment_type')}
                className="w-full py-3 bg-card border border-border rounded-lg"
              >
                {EMPLOYMENT_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[13px] font-medium text-navy mb-1">Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={handleChange('password')}
              className="w-full py-3 bg-card border border-border rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-[13px] font-medium text-navy mb-1">Confirm Password</label>
            <input
              type="password"
              value={formData.password_confirm}
              onChange={handleChange('password_confirm')}
              className="w-full py-3 bg-card border border-border rounded-lg"
              required
            />
          </div>

          <button type="submit" className="w-full py-3 bg-teal text-white rounded-lg font-medium hover:bg-teal-mid transition-colors">
            Create Staff Account
          </button>
        </form>
      </div>
    </StaffDashboardLayout>
  )
}