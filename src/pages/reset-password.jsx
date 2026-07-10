import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle } from 'lucide-react'
import AuthForm from '../components/auth/AuthForm'

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const handleSubmit = () => {
    if (!email || !password) { setError('Please fill in all fields.'); return }
    setError(''); setLoading(true)
    // Replace with: POST /api/reset-password
    setTimeout(() => { setLoading(false); setDone(true) }, 800)
  }

  if (done) return (
    <div className="min-h-screen bg-surface flex items-center justify-center">
      <div className="bg-card rounded-2xl border border-border p-10 max-w-md text-center shadow-card">
        <div className="text-4xl mb-4"><CheckCircle size={40} /></div>
        <h2 className="font-display font-bold text-xl text-navy mb-2">Password updated</h2>
        <p className="text-sm text-slate-light mb-6">You can now log in with your new password.</p>
        <Link to="/login" className="bg-teal text-white text-sm font-medium px-6 py-3 rounded-lg hover:bg-teal-mid transition-colors">Go to login</Link>
      </div>
    </div>
  )

  return (
    <AuthForm
      title="Reset password"
      subtitle="Enter your email and a new password"
      fields={[
        { name:'email',    label:'Email address', type:'email',    placeholder:'you@email.com',    value:email,    onChange:setEmail },
        { name:'password', label:'New password',  type:'password', placeholder:'Your new password',value:password, onChange:setPassword },
      ]}
      submitLabel="Reset password"
      onSubmit={handleSubmit}
      error={error}
      loading={loading}
      footer={<Link to="/login" className="text-teal hover:underline">Back to login</Link>}
    />
  )
}
