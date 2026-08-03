import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/auth-context'
import AuthForm from '../components/auth/auth-form'
import { loginUser, loginStaff } from '../services/api'

export default function StaffLoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [isStaff, setIsStaff] = useState(false)

  const handleSubmit = async (isStaffLogin = false) => {
    if (!email || !password) { setError('Please fill in all fields.'); return }
    setError(''); setLoading(true)
    setIsStaff(isStaffLogin)
    try {
      const api = isStaffLogin ? loginStaff : loginUser
      const result = await api({ email, password })

      if (isStaffLogin && result.user && result.user.staff) {
        const staffData = result.user.staff
        const userData = {
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
        const userData = {
          id: result.user?.id,
          name: result.user?.name || result.user?.first_name + ' ' + result.user?.last_name,
          email: result.user?.email,
          first_name: result.user?.first_name,
          last_name: result.user?.last_name,
          role: result.user?.role || 'user',
          profile_image: result.user?.profile_image,
          staff: result.user?.staff,
          doctor: result.user?.doctor,
          patient: result.user?.patient,
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

  return (
    <div className="min-h-screen bg-surface pt-16 flex items-center justify-center">
      <AuthForm
        title={isStaff ? "Staff Login" : "User Login"}
        subtitle={isStaff ? "Log in to your staff account" : "Log in to your account"}
        fields={[
          { name:'email', label:'Email address', type:'email', placeholder:'you@hospital.com', value:email, onChange:setEmail },
          { name:'password', label:'Password', type:'password', placeholder:'Enter password', value:password, onChange:setPassword },
        ]}
        submitLabel={isStaff ? "Login as Staff" : "Continue"}
        onSubmit={() => handleSubmit(isStaff)}
        error={error}
        loading={loading}
        footer={
          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={isStaff} onChange={(e) => setIsStaff(e.target.checked)} className="w-4 h-4" />
              <span className="text-sm text-slate-light">Staff login</span>
            </label>
            <div className="mt-2">
              <Link to="/register" className="text-teal hover:underline text-sm">Need an account?</Link>
            </div>
          </div>
        }
      />
    </div>
  )
}