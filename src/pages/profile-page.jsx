import { useState } from 'react'
import { Check } from 'lucide-react'
import DashboardLayout from '../components/layout/DashboardLayout'
import Topbar from '../components/layout/Topbar'
import { useAuth } from '../context/AuthContext'
import ErrorMessage from '../components/shared/ErrorMessage'

export default function ProfilePage() {
  const { user } = useAuth()
  const [name, setName] = useState(user?.name ?? '')
  const [email, setEmail] = useState(user?.email ?? '')
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  const handleSave = () => {
    if (!name || !email) { setError('Name and email are required.'); return }
    setError('')
    // Replace with: PUT /api/profile
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <DashboardLayout>
      <Topbar title="Profile" subtitle="Manage your account details" />
      <div className="p-7 max-w-xl">
        <div className="bg-card rounded-xl border border-border p-7">
          <div className="flex items-center gap-4 mb-7 pb-7 border-b border-border">
            <div className="w-16 h-16 rounded-full bg-teal flex items-center justify-center text-white text-[20px] font-semibold">
              {name.slice(0,2).toUpperCase()}
            </div>
            <div>
              <h2 className="font-display font-bold text-[20px] text-navy">{name || 'Your name'}</h2>
              <p className="text-[13px] text-slate-light">{email || 'your@email.com'}</p>
            </div>
          </div>

          <ErrorMessage message={error} />

          {[['Full name','text',name,setName,'Your full name'],['Email address','email',email,setEmail,'you@email.com']].map(([label,type,val,set,ph])=>(
            <div key={label} className="mb-4">
              <label className="block text-[12px] font-medium text-navy mb-1.5">{label}</label>
              <input type={type} value={val} onChange={e=>set(e.target.value)} placeholder={ph}
                className="w-full border border-border rounded-lg px-4 py-3 text-[13px] text-navy bg-surface outline-none focus:border-teal focus:bg-card transition-colors" />
            </div>
          ))}

          <button onClick={handleSave} className="w-full mt-2 bg-teal text-white text-[14px] font-semibold py-3.5 rounded-lg hover:bg-teal-mid transition-colors cursor-pointer">
            {saved ? <><Check size={16} /> Saved!</> : 'Save changes'}
          </button>
        </div>
      </div>
    </DashboardLayout>
  )
}
