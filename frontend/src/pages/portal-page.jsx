import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { useAuth } from '../context/auth-context'
import AuthForm from '../components/auth/auth-form'
import Navbar from '../components/layout/navbar'
import { registerDoctor, registerHospital, registerStaff } from '../services/api'
import { Stethoscope, Building2, Users } from 'lucide-react'

const ROLES = [
  { key: 'doctor', label: 'Doctor', icon: Stethoscope, description: 'Register as a doctor' },
  { key: 'hospital', label: 'Hospital', icon: Building2, description: 'Register your hospital' },
  { key: 'staff', label: 'Staff', icon: Users, description: 'Register as hospital staff' },
]

const STAFF_ROLES = ['Receptionist', 'Nurse', 'Lab Technician', 'Pharmacist', 'Cashier', 'Records Officer']
const EMPLOYMENT_TYPES = ['Full Time', 'Part Time', 'Contract']
const DEPARTMENTS = ['Front Office', 'Nursing', 'Laboratory', 'Pharmacy', 'Billing', 'Records', 'Administration', 'Radiology', 'ICU', 'Outpatient']

export default function PortalPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [role, setRole] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({})

  const handleRoleSelect = (r) => {
    setRole(r)
    setError('')
    setFormData({})
  }

  const handleFieldChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const getFields = (role) => {
    const baseFieldConfigs = [
      { name: 'first_name', label: 'First name', type: 'text', placeholder: 'Your first name' },
      { name: 'last_name', label: 'Last name', type: 'text', placeholder: 'Your last name' },
      { name: 'email', label: 'Email address', type: 'email', placeholder: 'you@email.com' },
      { name: 'phone', label: 'Phone number', type: 'tel', placeholder: '0712345678' },
      { name: 'password', label: 'Password', type: 'password', placeholder: 'Create a password' },
      { name: 'password_confirm', label: 'Confirm Password', type: 'password', placeholder: 'Confirm your password' },
    ]

    const fieldConfigs = role === 'doctor'
      ? [
          ...baseFieldConfigs,
          { name: 'specialty', label: 'Specialty', type: 'select', options: ['Cardiology', 'Dermatology', 'Dentistry', 'Emergency Medicine', 'Endocrinology', 'Gastroenterology', 'Gynecology', 'Hematology', 'Infectious Disease', 'Neurology', 'Oncology', 'Ophthalmology', 'Orthopedics', 'Otolaryngology', 'Pediatrics', 'Psychiatry', 'Radiology', 'Rheumatology', 'Surgery', 'Urology'] },
          { name: 'years_practice', label: 'Years of practice', type: 'number', placeholder: '5' },
          { name: 'working_date', label: 'Working date', type: 'date', fullWidth: true },
          { name: 'working_time_from', label: 'Working time from', type: 'time', fullWidth: true },
          { name: 'working_time_to', label: 'Working time to', type: 'time', fullWidth: true },
          { name: 'fee', label: 'Consultation fee (KSh)', type: 'number', placeholder: '2000' },
          { name: 'hospital_id', label: 'Hospital ID (optional)', type: 'number', placeholder: 'e.g. 1', fullWidth: true },
        ]
      : role === 'hospital'
      ? [
          ...baseFieldConfigs,
          { name: 'name', label: 'Hospital name', type: 'text', placeholder: 'e.g. Nairobi General Hospital' },
          { name: 'address', label: 'Address', type: 'text', placeholder: 'Hospital address' },
          { name: 'city', label: 'City', type: 'text', placeholder: 'Nairobi' },
          { name: 'website', label: 'Website', type: 'text', placeholder: 'https://example.com' },
        ]
      : role === 'staff'
      ? [
          ...baseFieldConfigs,
          { name: 'role', label: 'Role', type: 'select', options: STAFF_ROLES },
          { name: 'hospital_id', label: 'Hospital ID', type: 'number', placeholder: 'e.g. 1' },
          { name: 'department', label: 'Department', type: 'select', options: DEPARTMENTS },
          { name: 'employment_type', label: 'Employment Type', type: 'select', options: EMPLOYMENT_TYPES },
        ]
      : baseFieldConfigs

    return fieldConfigs.map(config => ({
      ...config,
      value: formData[config.name] || '',
      onChange: (value) => handleFieldChange(config.name, value),
    }))
  }

  const handleSubmit = async () => {
    setError('')
    setLoading(true)
    try {
      let result
      if (role === 'doctor') {
        const doctorData = { ...formData }
         if (doctorData.working_date && doctorData.working_time_from && doctorData.working_time_to) {
          doctorData.working_hours = `${doctorData.working_date} ${doctorData.working_time_from}-${doctorData.working_time_to}`
        }
        delete doctorData.working_date
        delete doctorData.working_time_from
        delete doctorData.working_time_to
        if (doctorData.hospital_id) {
          const parsedId = parseInt(doctorData.hospital_id, 10)
          if (!isNaN(parsedId)) {
            doctorData.hospital_id = parsedId
          } else {
            delete doctorData.hospital_id
          }
        }
        result = await registerDoctor(doctorData)
      } else if (role === 'hospital') {
        result = await registerHospital(formData)
      } else if (role === 'staff') {
        const staffData = { ...formData }
        if (staffData.hospital_id) {
          staffData.hospital_id = parseInt(staffData.hospital_id, 10)
        }
        result = await registerStaff(staffData)
      }
const user = result.user || result.data?.user
        const token = result.token || 'mock-jwt-token'
        if (user) {
          const userData = {
            id: user.id,
            name: `${user.first_name} ${user.last_name}`,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            role: user.role,
            staff: result.staff || user.staff,
            patientId: user.patient?.id || null,
            profile_image: user.profile_image || null,
          }
          login(userData, token)
          toast.success(`${role.charAt(0).toUpperCase() + role.slice(1)} account created successfully!`)
          navigate(role === 'staff' ? '/staff/dashboard' : role === 'hospital' ? '/staff/dashboard' : '/dashboard', { replace: true })
        }
    } catch (err) {
      const errorMsg = err.message || "Please check your information and try again"
      setError(errorMsg)
      toast.error(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-surface pt-16">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="font-display font-bold text-3xl text-navy text-center mb-2">Join BookPro</h1>
        <p className="text-center text-slate-light mb-8">Create your account and start booking appointments</p>

        {!role ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {ROLES.map(r => (
              <button
                key={r.key}
                onClick={() => handleRoleSelect(r.key)}
                className="bg-card rounded-2xl border border-border p-8 shadow-card hover:shadow-lg transition-shadow text-center cursor-pointer flex flex-col items-center justify-center min-h-60"
              >
                <div className="flex-1 flex items-center justify-center w-full">
                  <div className="w-24 h-24 rounded-full bg-teal/10 flex items-center justify-center">
                    <r.icon size={48} className="text-teal" />
                  </div>
                </div>
                <h3 className="font-display font-bold text-lg text-navy mb-2">{r.label}</h3>
                <p className="text-sm text-slate-light">{r.description}</p>
              </button>
            ))}
          </div>
        ) : (
          <div>
            <div className="w-full mb-4 fixed top-20 left-15 z-50 flex justify-start">
              <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-lg">
                <button
                  onClick={() => setRole(null)}
                  className="text-teal text-xl hover:text-teal-mid transition-colors"
                >
                  ←
                </button>
              </div>
            </div>
            <div className="max-w-xl mx-auto">
              <AuthForm
                title={`Register as ${role === 'doctor' ? 'a Doctor' : role === 'hospital' ? 'a Hospital' : 'Staff'}`}
                subtitle="Fill in the details below to get started"
                fields={getFields(role)}
                submitLabel="Create account"
                onSubmit={handleSubmit}
                error={error}
                loading={loading}
                twoColumn={role === 'doctor'}
                footer={
                  <span>
                    Already have an account? <Link to="/login" className="text-teal hover:underline font-medium">Log in</Link>
                  </span>
                }
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
