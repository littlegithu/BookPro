import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/auth-context'
import AuthForm from '../components/auth/auth-form'
import Navbar from '../components/layout/navbar'
import { loginUser, loginStaff, loginHospital } from '../services/api'

const LOGIN_MODES = [
  { key: 'user', label: 'Patient / User' },
  { key: 'staff', label: 'Staff' },
  { key: 'hospital', label: 'Hospital Admin' },
]

export default function StaffLoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [mode, setMode] = useState('user')

  const handleSubmit = async () => {
    if (!email || !password) { setError('Please fill in all fields.'); return }
    setError(''); setLoading(true)
    try {
      let result
      let userData
      if (mode === 'hospital') {
        result = await loginHospital({ email, password })
        const hospital = result.hospital
        userData = {
          id: hospital.id,
          name: hospital.name,
          email: hospital.email,
          role: 'hospital_admin',
          profile_image: null,
        }
        login(userData, result.token)
        navigate('/hospital/dashboard', { replace: true })
      } else if (mode === 'staff') {
        result = await loginStaff({ email, password })
        const staffData = result.user?.staff
        if (staffData) {
          userData = {
            id: result.user.id,
            name: `${staffData.first_name || result.user.first_name} ${staffData.last_name || result.user.last_name}`,
            email: result.user.email,
            first_name: staffData.first_name || result.user.first_name,
            last_name: staffData.last_name || result.user.last_name,
            role: 'staff',
            profile_image: result.user.profile_image,
            staff: staffData,
          }
          login(userData, result.token)
          navigate('/staff/dashboard', { replace: true })
        } else {
          setError('No staff record found for this user.')
        }
      } else {
        result = await loginUser({ email, password })
        const user = result.user
        userData = {
          id: user?.id,
          name: user?.name || user?.first_name + ' ' + user?.last_name,
          email: user?.email,
          first_name: user?.first_name,
          last_name: user?.last_name,
          role: user?.role || 'user',
          profile_image: user?.profile_image,
          staff: user?.staff,
          doctor: user?.doctor,
          patient: user?.patient,
        }
        login(userData, result.token)
        if (userData.role === 'doctor') {
          navigate('/dashboard', { replace: true })
        } else if (userData.role === 'staff') {
          navigate('/staff/dashboard', { replace: true })
        } else {
          navigate('/dashboard', { replace: true })
        }
      }
    } catch (err) {
      setError(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  const titles = {
    user: 'User Login',
    staff: 'Staff Login',
    hospital: 'Hospital Login',
  }
  const subtitles = {
    user: 'Log in to your patient or doctor account',
    staff: 'Log in to your staff account',
    hospital: 'Log in to your hospital admin account',
  }
  const labels = {
    user: 'Continue',
    staff: 'Login as Staff',
    hospital: 'Login as Hospital',
  }

  return (
    <div className="min-h-screen bg-surface pt-16">
      <Navbar />
      <div className="flex items-center justify-center">
        <div className="w-full max-w-md px-4">
          <div className="bg-card rounded-2xl border border-border p-6 shadow-card">
            <div className="text-center mb-6">
              <h1 className="font-display font-bold text-2xl text-navy mb-2">{titles[mode]}</h1>
              <p className="text-sm text-slate-light">{subtitles[mode]}</p>
            </div>

            <div className="flex rounded-lg bg-surface p-1 mb-5 border border-border">
              {LOGIN_MODES.map(item => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setMode(item.key)}
                  className={`flex-1 py-1.5 rounded-md text-[12px] font-medium transition-colors ${
                    mode === item.key ? 'bg-teal text-white shadow-sm' : 'text-slate hover:text-navy'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <AuthForm
              title=""
              subtitle=""
              fields={[
                { name:'email', label:'Email address', type:'email', placeholder:'you@hospital.com', value:email, onChange:setEmail },
                { name:'password', label:'Password', type:'password', placeholder:'Enter password', value:password, onChange:setPassword },
              ]}
              submitLabel={labels[mode]}
              onSubmit={handleSubmit}
              error={error}
              loading={loading}
              footer={
                <span>
                  Need an account?{' '}
                  <Link to="/register" className="text-teal hover:underline font-medium">Sign up</Link>
                </span>
              }
            />
          </div>
        </div>
      </div>
    </div>
  )
}
