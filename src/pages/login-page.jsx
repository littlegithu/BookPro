import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import AuthForm from '../components/auth/AuthForm'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname ?? '/dashboard'

  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  const handleSubmit = async () => {
    if (!email || !password) { setError('Please fill in all fields.'); return }
    setError(''); setLoading(true)
    // Replace with: POST /api/login
    setTimeout(() => {
      login({ name: 'Iann', email }, 'mock-jwt-token')
      setLoading(false)
      navigate(from, { replace: true })
    }, 800)
  }

  return (
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
  )
}
