import { useState, useEffect } from 'react'
import DashboardLayout from '../components/layout/dashboard-layout'
import Topbar from '../components/layout/topbar'
import { useAuth } from '../context/auth-context'
import ErrorMessage from '../components/shared/error-message'
import { updateUser } from '../services/api'

export default function ProfilePage() {
  const { user, login } = useAuth()
  const [name, setName] = useState(user?.name ?? '')
  const [email, setEmail] = useState(user?.email ?? '')
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSave = async () => {
    if (!name || !email) { setError('Name and email are required.'); return }
    setError(''); setLoading(true)
    try {
      const [firstName, lastName] = name.split(' ')
      const updated = await updateUser(user.id, {
        first_name: firstName,
        last_name: lastName,
        email: email,
      })
      login({
        ...user,
        name: `${updated.first_name} ${updated.last_name}`,
        email: updated.email,
        first_name: updated.first_name,
        last_name: updated.last_name,
      }, localStorage.getItem('bookpro_token'))
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (err) {
      setError(err.message || 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  return (
    <DashboardLayout>
      <Topbar title="Profile" subtitle="Manage your account details" />
      <div className="p-7 max-w-xl">
        <div className="bg-card rounded-xl border border-border p-7">
          <div className="flex items-center gap-4 mb-7 pb-7 border-b border-border">
            <div className="w-16 h-16 rounded-full bg-teal flex items-center justify-center text-white text-[20px] font-semibold">
              {name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h2 className="font-display font-bold text-[20px] text-navy">{name || 'Your name'}</h2>
              <p className="text-[13px] text-slate-light">{email || 'your@email.com'}</p>
            </div>
          </div>

          <ErrorMessage message={error} />

          {[
            ['Full name',     'text',  name,  setName,  'Your full name'],
            ['Email address', 'email', email, setEmail, 'you@email.com'],
          ].map(([label, type, val, set, ph]) => (
            <div key={label} className="mb-4">
              <label className="block text-[12px] font-medium text-navy mb-1.5">{label}</label>
              <input
                type={type}
                value={val}
                onChange={e => set(e.target.value)}
                placeholder={ph}
                className="w-full border border-border rounded-lg px-4 py-3 text-[13px] text-navy bg-surface outline-none focus:border-teal focus:bg-card transition-colors"
              />
            </div>
          ))}

          <button
            onClick={handleSave}
            disabled={loading}
            className="w-full mt-2 bg-teal text-white text-[14px] font-semibold py-3.5 rounded-lg hover:bg-teal-mid transition-colors disabled:opacity-60 cursor-pointer"
          >
            {loading ? 'Saving…' : saved ? '✓ Saved!' : 'Save changes'}
          </button>
        </div>
      </div>
    </DashboardLayout>
  )
}
