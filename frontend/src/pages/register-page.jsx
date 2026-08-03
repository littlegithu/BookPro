
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { useAuth } from '../context/auth-context'
import AuthForm from '../components/auth/auth-form'
import Navbar from '../components/layout/navbar'
import { registerUser as apiRegisterUser } from '../services/api'

export default function RegisterPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!name || !email || !password) {
      setError('Please fill in all fields.')
      toast.error('Please fill in all fields.')
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match.')
      toast.error('Passwords do not match.')
      return
    }
    setError('')
    setLoading(true)
    try {
      const [firstName, lastName] = name.split(' ')
      const user = await apiRegisterUser({
        first_name: firstName || name,
        last_name: lastName || name,
        email: email,
        password,
        password_confirm: password,
      })
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
      toast.success('Account created successfully!')
      navigate('/dashboard', { replace: true })
    } catch (err) {
      const errorMsg = err.message || 'Registration failed'
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
        footer={<span>Already have an account? <Link to="/login" className="text-teal hover:underline font-medium">Log in</Link><br /><Link to="/portal" className="text-teal hover:underline">Register as a doctor, hospital, or staff</Link></span>}
      />
    </div>
  )
}