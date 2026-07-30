import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/auth-context'
import AuthForm from '../components/auth/auth-form'
import Navbar from '../components/layout/navbar'
import { loginUser as apiLoginUser, fetchPatientByEmail } from '../services/api'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname ?? '/dashboard'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!email || !password) { setError('Please fill in all fields.'); return }
    setError(''); setLoading(true)
    try {
      const result = await apiLoginUser({ email, password })
      const user = result.user
      const patient = await fetchPatientByEmail(user.email)
      const userData = {
        id: user.id,
        name: `${user.first_name} ${user.last_name}`,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        patientId: patient?.id || null,
      }
      login(userData, 'mock-jwt-token')
      navigate(from, { replace: true })
    } catch (err) {
      setError(err.message || 'Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      <div className="max-w-md mx-auto px-4 pt-10">
        <AuthForm
          title="Welcome back"
          subtitle="Log in to your BookPro account"
          fields={[
            { name:'email', label:'Email address', type:'email', placeholder:'you@email.com', value:email, onChange:setEmail },
            { name:'password', label:'Password', type:'password', placeholder:'Your password', value:password, onChange:setPassword },
          ]}
          submitLabel="Log in"
          onSubmit={handleSubmit}
          error={error}
          loading={loading}
          footer={
            <span>
              Don't have an account? <Link to="/register" className="text-teal hover:underline font-medium">Sign up</Link>
              <br />
              <Link to="/reset-password" className="text-teal hover:underline">Forgot password?</Link>
            </span>
          }
          extra={
            <button
              onClick={() => navigate('/dashboard', { replace: true })}
              className="w-full mt-4 border border-border text-navy text-[14px] font-medium py-3.5 rounded-lg hover:bg-surface transition-colors cursor-pointer"
            >
              Continue as guest
            </button>
          }
        />
      </div>
    </div>
  )
}
