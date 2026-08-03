
import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { useAuth } from '../context/auth-context'
import AuthForm from '../components/auth/auth-form'
import Navbar from '../components/layout/navbar'
import { loginUser as apiLoginUser } from '../services/api'

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
    if (!email || !password) {
      setError('Please fill in all fields.')
      toast.error('Please fill in all fields.')
      return
    }
    setError('')
    setLoading(true)
    try {
      const result = await apiLoginUser({ email, password })
      const token = result.token
      const user = result.user
      if (!token) {
        toast.error('No token received from server')
        setError('No token received from server')
        return
      }
      const userData = {
        id: user.id,
        name: `${user.first_name} ${user.last_name}`,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role,
        patientId: user.patient?.id || null,
        profile_image: user.profile_image || null,
      }
      login(userData, token)
      toast.success('Login successful!')
      navigate(from, { replace: true })
    } catch (err) {
      const errorMsg = err.message || 'Invalid credentials'
      setError(errorMsg)
      toast.error(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-surface pt-16 flex items-center justify-center">
      <Navbar />
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
      />
    </div>
  )
}