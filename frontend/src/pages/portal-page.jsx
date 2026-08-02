import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/auth-context'
import AuthForm from '../components/auth/auth-form'
import Navbar from '../components/layout/navbar'
import { registerDoctor, registerHospital, registerStaff } from '../services/api'

const ROLES = [
  { key: 'doctor', label: 'Doctor', icon: '🏥', description: 'Register as a medical practitioner' },
  { key: 'hospital', label: 'Hospital', icon: '🏥', description: 'Register your hospital or clinic' },
  { key: 'staff', label: 'Staff', icon: '👥', description: 'Register as hospital staff' },
]

export default function PortalPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [role, setRole] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleRoleSelect = (r) => {
    setRole(r)
    setError('')
  }

  const handleSubmit = async (formData) => {
    setError('')
    setLoading(true)
    try {
      let result
      if (role === 'doctor') {
        result = await registerDoctor(formData)
      } else if (role === 'hospital') {
        result = await registerHospital(formData)
      } else if (role === 'staff') {
        result = await registerStaff(formData)
      }
      const user = result.user || result.data?.user
      if (user) {
        const userData = {
          id: user.id,
          name: `${user.first_name} ${user.last_name}`,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          patientId: user.patient?.id || null,
          profile_image: user.profile_image || null,
        }
        login(userData, 'mock-jwt-token')
        navigate('/dashboard', { replace: true })
      }
    } catch (err) {
      setError(err.message || 'Registration failed')
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
                className="bg-card rounded-2xl border border-border p-8 shadow-card hover:shadow-lg transition-shadow text-center cursor-pointer"
              >
                <span className="text-4xl mb-4 block">{r.icon}</span>
                <h3 className="font-display font-bold text-lg text-navy mb-2">{r.label}</h3>
                <p className="text-sm text-slate-light">{r.description}</p>
              </button>
            ))}
          </div>
        ) : (
          <div className="max-w-md mx-auto">
            <button
              onClick={() => setRole(null)}
              className="text-teal text-sm mb-4 hover:underline"
            >
              ← Back to role selection
            </button>
            <AuthForm
              title={`Register as ${role === 'doctor' ? 'a Doctor' : role === 'hospital' ? 'a Hospital' : 'Staff'}`}
              subtitle="Fill in the details below to get started"
              fields={getFields(role)}
              submitLabel="Create account"
              onSubmit={handleSubmit}
              error={error}
              loading={loading}
              footer={
                <span>
                  Already have an account? <Link to="/login" className="text-teal hover:underline font-medium">Log in</Link>
                </span>
              }
            />
          </div>
        )}
      </div>
    </div>
  )
}

function getFields(role) {
  const baseFields = [
    { name: 'first_name', label: 'First name', type: 'text', placeholder: 'Your first name' },
    { name: 'last_name', label: 'Last name', type: 'text', placeholder: 'Your last name' },
    { name: 'email', label: 'Email address', type: 'email', placeholder: 'you@email.com' },
    { name: 'phone', label: 'Phone number', type: 'tel', placeholder: '0712345678' },
    { name: 'password', label: 'Password', type: 'password', placeholder: 'Create a password' },
  ]

  if (role === 'doctor') {
    return [
      ...baseFields,
      { name: 'specialty', label: 'Specialty', type: 'text', placeholder: 'e.g. Cardiology' },
      { name: 'years_practice', label: 'Years of practice', type: 'number', placeholder: '5' },
      { name: 'working_hours', label: 'Working hours', type: 'text', placeholder: 'Mon-Fri 8AM-5PM' },
      { name: 'fee', label: 'Consultation fee (KSh)', type: 'number', placeholder: '2000' },
      { name: 'hospital_id', label: 'Hospital ID (optional)', type: 'number', placeholder: '1' },
    ]
  }

  if (role === 'hospital') {
    return [
      ...baseFields,
      { name: 'name', label: 'Hospital name', type: 'text', placeholder: 'e.g. Nairobi General Hospital' },
      { name: 'address', label: 'Address', type: 'text', placeholder: 'Hospital address' },
      { name: 'city', label: 'City', type: 'text', placeholder: 'Nairobi' },
      { name: 'website', label: 'Website', type: 'text', placeholder: 'https://example.com' },
    ]
  }

  if (role === 'staff') {
    return [
      ...baseFields,
      { name: 'role', label: 'Role', type: 'text', placeholder: 'Receptionist', value: 'Receptionist' },
      { name: 'hospital_id', label: 'Hospital ID', type: 'number', placeholder: '1' },
    ]
  }

  return baseFields
}