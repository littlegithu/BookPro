import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import AuthForm from '../components/auth/AuthForm'

export default function RegisterPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = () => {
    if (!name || !email || !password) { setError('Please fill in all fields.'); return }
    if (password !== confirm) { setError('Passwords do not match.'); return }
    setError(''); setLoading(true)
    // Replace with: POST /api/register
    setTimeout(() => {
      login({ name, email }, 'mock-jwt-token')
      setLoading(false)
      navigate('/dashboard', { replace: true })
    }, 800)
  }

  return (
    <AuthForm
      title="Create your account"
      subtitle="Start booking appointments in minutes"
      fields={[
        { name:'name', label:'Full name', type:'text', placeholder:'Your full name', value:name, onChange:setName },
        { name:'email', label:'Email address', type:'email', placeholder:'you@email.com', value:email, onChange:setEmail },
        { name:'password', label:'Password', type:'password', placeholder:'Create a password', value:password, onChange:setPassword },
        { name:'confirm', label:'Confirm password', type:'password', placeholder:'Repeat password', value:confirm, onChange:setConfirm },
      ]}
      submitLabel="Create account"
      onSubmit={handleSubmit}
      error={error}
      loading={loading}
      footer={<span>Already have an account? <Link to="/login" className="text-teal hover:underline font-medium">Log in</Link></span>}
    />
  )
}
