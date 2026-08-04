import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Topbar from '../../components/layout/topbar'
import DoctorDashboardLayout from '../../components/layout/doctor-dashboard-layout'
import { useAuth } from '../../context/auth-context'
import { useTheme } from '../../context/theme-context'
import { fetchDoctorProfile, updateDoctorProfile } from '../../services/api'
import {
  User, Lock, Bell, Shield, Trash2, Eye, EyeOff,
  LogOut, Monitor, Smartphone, Save, AlertTriangle
} from 'lucide-react'

const TABS = [
  { id: 'account', label: 'Account Settings', icon: <User size={18} /> },
  { id: 'security', label: 'Security', icon: <Lock size={18} /> },
  { id: 'preferences', label: 'Preferences', icon: <Bell size={18} /> },
  { id: 'danger', label: 'Danger Zone', icon: <Shield size={18} /> },
]

const TIMEZONES = [
  'Africa/Nairobi',
  'Africa/Cairo',
  'Africa/Lagos',
  'Africa/Accra',
  'Africa/Addis_Ababa',
  'Africa/Casablanca',
  'Africa/Johannesburg',
  'UTC',
]

const LANGUAGES = [
  { value: 'en', label: 'English' },
  { value: 'sw', label: 'Swahili' },
  { value: 'fr', label: 'French' },
]

const DATE_FORMATS = [
  { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
  { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
  { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' },
  { value: 'DD-MMM-YYYY', label: 'DD-MMM-YYYY' },
]

export default function DoctorSettingsPage() {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const { theme, toggle: toggleTheme } = useTheme()

  const [activeTab, setActiveTab] = useState('account')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  const [account, setAccount] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    timezone: 'Africa/Nairobi',
    language: 'en',
    date_format: 'DD/MM/YYYY',
    time_format: '24h',
  })
  const [accountErrors, setAccountErrors] = useState({})

  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: '',
  })
  const [passwordErrors, setPasswordErrors] = useState({})
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  })
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)

  const [preferences, setPreferences] = useState(() => ({
    darkMode: theme === 'dark',
    emailNotifications: true,
    smsNotifications: true,
    appointmentReminders: true,
    reviewNotifications: true,
    systemAnnouncements: true,
  }))

  const [dangerActions, setDangerActions] = useState({
    deactivate: false,
    clearData: false,
  })

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchDoctorProfile()
        if (data) {
          setAccount({
            first_name: data.first_name || '',
            last_name: data.last_name || '',
            email: data.email || '',
            phone: data.phone || '',
            timezone: data.timezone || 'Africa/Nairobi',
            language: data.language || 'en',
            date_format: data.date_format || 'DD/MM/YYYY',
            time_format: data.time_format || '24h',
          })
        }
      } catch (err) {
        setMessage({ type: 'error', text: err.message || 'Failed to load profile' })
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  function validateAccount() {
    const errors = {}
    if (!account.first_name.trim()) errors.first_name = 'Full name is required'
    if (!account.email.trim()) errors.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(account.email)) errors.email = 'Invalid email format'
    if (account.phone && !/^\+?[\d\s-]{7,15}$/.test(account.phone)) errors.phone = 'Invalid phone number'
    setAccountErrors(errors)
    return Object.keys(errors).length === 0
  }

  function validatePasswords() {
    const errors = {}
    if (!passwords.current) errors.current = 'Current password is required'
    if (!passwords.new) errors.new = 'New password is required'
    else if (passwords.new.length < 8) errors.new = 'Password must be at least 8 characters'
    if (passwords.new !== passwords.confirm) errors.confirm = 'Passwords do not match'
    setPasswordErrors(errors)
    return Object.keys(errors).length === 0
  }

  async function handleAccountSave(e) {
    e.preventDefault()
    setMessage({ type: '', text: '' })
    if (!validateAccount()) return
    setSaving(true)
    try {
      await updateDoctorProfile(account)
      setMessage({ type: 'success', text: 'Account settings saved successfully!' })
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Failed to save account settings' })
    } finally {
      setSaving(false)
    }
  }

  async function handlePasswordChange(e) {
    e.preventDefault()
    setMessage({ type: '', text: '' })
    if (!validatePasswords()) return
    setSaving(true)
    try {
      await updateDoctorProfile({
        current_password: passwords.current,
        password: passwords.new,
      })
      setMessage({ type: 'success', text: 'Password changed successfully!' })
      setPasswords({ current: '', new: '', confirm: '' })
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Failed to change password' })
    } finally {
      setSaving(false)
    }
  }

  function handlePreferenceToggle(key) {
    setPreferences(prev => ({ ...prev, [key]: !prev[key] }))
    if (key === 'darkMode') {
      toggleTheme()
    }
    setMessage({ type: '', text: '' })
  }

  async function handleDangerAction(action) {
    if (action === 'deactivate') {
      setDangerActions(prev => ({ ...prev, deactivate: false }))
      setMessage({ type: 'success', text: 'Account deactivation request submitted.' })
    } else if (action === 'clearData') {
      setDangerActions(prev => ({ ...prev, clearData: false }))
      setMessage({ type: 'success', text: 'All data cleared successfully.' })
    }
  }

  function handleLogoutAllDevices() {
    logout()
    navigate('/login', { replace: true })
  }

  if (loading) {
    return (
      <DoctorDashboardLayout>
        <Topbar title="Settings" subtitle="Loading your settings..." />
        <div className="p-7">
          <div className="flex items-center justify-center py-20">
            <span className="inline-block w-8 h-8 border-2 border-teal border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      </DoctorDashboardLayout>
    )
  }

  return (
    <DoctorDashboardLayout>
      <Topbar title="Settings" subtitle="Manage your account and preferences" />

      <div className="p-7">
        <div className="max-w-4xl">
          {/* Tabs */}
          <div className="flex items-center gap-1 mb-6 bg-surface p-1 rounded-xl border border-border w-fit">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setMessage({ type: '', text: '' }) }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-teal text-white shadow-sm'
                    : 'text-slate hover:text-navy hover:bg-card'
                }`}
              >
                {tab.icon}
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Message */}
          {message.text && (
            <div className={`mb-6 p-4 rounded-xl text-sm font-medium ${
              message.type === 'success'
                ? 'bg-green-light text-green border border-green/20'
                : 'bg-red-light text-red border border-red/20'
            }`}>
              {message.text}
            </div>
          )}

          {/* Account Settings Tab */}
          {activeTab === 'account' && (
            <div className="bg-card rounded-xl border border-border p-6">
              <h2 className="font-display font-semibold text-[17px] text-navy mb-1">Account Settings</h2>
              <p className="text-xs text-slate-light mb-6">Update your personal information and preferences</p>

              <form onSubmit={handleAccountSave} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[12px] font-medium text-navy mb-1.5">Full Name</label>
                    <input
                      type="text"
                      value={account.first_name}
                      onChange={e => setAccount(prev => ({ ...prev, first_name: e.target.value }))}
                      placeholder="Dr. John Doe"
                      className={`w-full border rounded-lg px-4 py-3 text-[13px] text-navy bg-surface outline-none transition-colors ${
                        accountErrors.first_name ? 'border-red focus:border-red' : 'border-border focus:border-teal'
                      }`}
                    />
                    {accountErrors.first_name && <p className="text-red text-[11px] mt-1">{accountErrors.first_name}</p>}
                  </div>

                  <div>
                    <label className="block text-[12px] font-medium text-navy mb-1.5">Email</label>
                    <input
                      type="email"
                      value={account.email}
                      onChange={e => setAccount(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="doctor@bookpro.com"
                      className={`w-full border rounded-lg px-4 py-3 text-[13px] text-navy bg-surface outline-none transition-colors ${
                        accountErrors.email ? 'border-red focus:border-red' : 'border-border focus:border-teal'
                      }`}
                    />
                    {accountErrors.email && <p className="text-red text-[11px] mt-1">{accountErrors.email}</p>}
                  </div>

                  <div>
                    <label className="block text-[12px] font-medium text-navy mb-1.5">Phone</label>
                    <input
                      type="tel"
                      value={account.phone}
                      onChange={e => setAccount(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="+254 700 000 000"
                      className={`w-full border rounded-lg px-4 py-3 text-[13px] text-navy bg-surface outline-none transition-colors ${
                        accountErrors.phone ? 'border-red focus:border-red' : 'border-border focus:border-teal'
                      }`}
                    />
                    {accountErrors.phone && <p className="text-red text-[11px] mt-1">{accountErrors.phone}</p>}
                  </div>

                  <div>
                    <label className="block text-[12px] font-medium text-navy mb-1.5">Timezone</label>
                    <select
                      value={account.timezone}
                      onChange={e => setAccount(prev => ({ ...prev, timezone: e.target.value }))}
                      className="w-full border border-border rounded-lg px-4 py-3 text-[13px] text-navy bg-surface outline-none focus:border-teal transition-colors"
                    >
                      {TIMEZONES.map(tz => (
                        <option key={tz} value={tz}>{tz.replace('_', ' ')}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[12px] font-medium text-navy mb-1.5">Language</label>
                    <select
                      value={account.language}
                      onChange={e => setAccount(prev => ({ ...prev, language: e.target.value }))}
                      className="w-full border border-border rounded-lg px-4 py-3 text-[13px] text-navy bg-surface outline-none focus:border-teal transition-colors"
                    >
                      {LANGUAGES.map(lang => (
                        <option key={lang.value} value={lang.value}>{lang.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[12px] font-medium text-navy mb-1.5">Date Format</label>
                    <select
                      value={account.date_format}
                      onChange={e => setAccount(prev => ({ ...prev, date_format: e.target.value }))}
                      className="w-full border border-border rounded-lg px-4 py-3 text-[13px] text-navy bg-surface outline-none focus:border-teal transition-colors"
                    >
                      {DATE_FORMATS.map(fmt => (
                        <option key={fmt.value} value={fmt.value}>{fmt.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[12px] font-medium text-navy mb-1.5">Time Format</label>
                    <select
                      value={account.time_format}
                      onChange={e => setAccount(prev => ({ ...prev, time_format: e.target.value }))}
                      className="w-full border border-border rounded-lg px-4 py-3 text-[13px] text-navy bg-surface outline-none focus:border-teal transition-colors"
                    >
                      <option value="12h">12-hour (AM/PM)</option>
                      <option value="24h">24-hour</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-end pt-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-2.5 bg-teal text-white rounded-lg text-sm font-medium hover:bg-teal/90 transition-colors disabled:opacity-50"
                  >
                    <Save size={16} />
                    {saving ? 'Saving...' : 'Save Account Settings'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <div className="bg-card rounded-xl border border-border p-6">
                <h2 className="font-display font-semibold text-[17px] text-navy mb-1">Change Password</h2>
                <p className="text-xs text-slate-light mb-6">Update your password to keep your account secure</p>

                <form onSubmit={handlePasswordChange} className="space-y-5">
                  {['current', 'new', 'confirm'].map(field => (
                    <div key={field}>
                      <label className="block text-[12px] font-medium text-navy mb-1.5">
                        {field === 'current' ? 'Current Password' : field === 'new' ? 'New Password' : 'Confirm New Password'}
                      </label>
                      <div className="relative">
                        <input
                          type={showPasswords[field] ? 'text' : 'password'}
                          value={passwords[field]}
                          onChange={e => setPasswords(prev => ({ ...prev, [field]: e.target.value }))}
                          placeholder={field === 'confirm' ? 'Re-enter new password' : field === 'current' ? 'Enter current password' : 'Enter new password'}
                          className={`w-full border rounded-lg px-4 py-3 pr-12 text-[13px] text-navy bg-surface outline-none transition-colors ${
                            passwordErrors[field] ? 'border-red focus:border-red' : 'border-border focus:border-teal'
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }))}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate hover:text-navy transition-colors"
                        >
                          {showPasswords[field] ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                      {passwordErrors[field] && <p className="text-red text-[11px] mt-1">{passwordErrors[field]}</p>}
                    </div>
                  ))}

                  <div className="flex items-center justify-end pt-2">
                    <button
                      type="submit"
                      disabled={saving}
                      className="flex items-center gap-2 px-6 py-2.5 bg-teal text-white rounded-lg text-sm font-medium hover:bg-teal/90 transition-colors disabled:opacity-50"
                    >
                      <Lock size={16} />
                      {saving ? 'Updating...' : 'Change Password'}
                    </button>
                  </div>
                </form>
              </div>

              <div className="bg-card rounded-xl border border-border p-6">
                <h2 className="font-display font-semibold text-[17px] text-navy mb-1">Two-Factor Authentication</h2>
                <p className="text-xs text-slate-light mb-4">Add an extra layer of security to your account</p>
                <div className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-teal-light flex items-center justify-center text-teal">
                      <Shield size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-navy">Two-Factor Authentication</p>
                      <p className="text-[11px] text-slate-light">{twoFactorEnabled ? 'Enabled - Your account is protected' : 'Disabled - Enable for extra security'}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setTwoFactorEnabled(prev => !prev)}
                    className={`relative w-12 h-6 rounded-full transition-colors ${twoFactorEnabled ? 'bg-teal' : 'bg-gray-300'}`}
                  >
                    <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${twoFactorEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
                  </button>
                </div>
              </div>

              <div className="bg-card rounded-xl border border-border p-6">
                <h2 className="font-display font-semibold text-[17px] text-navy mb-1">Active Sessions</h2>
                <p className="text-xs text-slate-light mb-4">Manage your logged-in sessions across devices</p>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 bg-surface rounded-lg border border-border">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-teal-light flex items-center justify-center text-teal">
                        <Monitor size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-navy">Current Session</p>
                        <p className="text-[11px] text-slate-light">This device • Active now</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-medium text-green bg-green-light px-2 py-1 rounded-full">Current</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-surface rounded-lg border border-border opacity-60">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500">
                        <Smartphone size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-navy">Mobile App</p>
                        <p className="text-[11px] text-slate-light">Last active 2 hours ago</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleLogoutAllDevices}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red hover:bg-red-light rounded-lg transition-colors"
                    >
                      <LogOut size={14} />
                      Logout
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-end mt-4 pt-4 border-t border-border">
                  <button
                    type="button"
                    onClick={handleLogoutAllDevices}
                    className="flex items-center gap-2 px-4 py-2 border border-red text-red rounded-lg text-sm font-medium hover:bg-red-light transition-colors"
                  >
                    <LogOut size={16} />
                    Logout all devices
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Preferences Tab */}
          {activeTab === 'preferences' && (
            <div className="bg-card rounded-xl border border-border p-6">
              <h2 className="font-display font-semibold text-[17px] text-navy mb-1">Preferences</h2>
              <p className="text-xs text-slate-light mb-6">Customize your experience and notification settings</p>

              <div className="space-y-1">
                <div className="flex items-center justify-between py-4 border-b border-border">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-teal-light flex items-center justify-center text-teal">
                      <Monitor size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-navy">Dark Mode</p>
                      <p className="text-[11px] text-slate-light">Use dark theme across the application</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handlePreferenceToggle('darkMode')}
                    className={`relative w-12 h-6 rounded-full transition-colors ${preferences.darkMode ? 'bg-teal' : 'bg-gray-300'}`}
                  >
                    <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${preferences.darkMode ? 'translate-x-6' : 'translate-x-0'}`} />
                  </button>
                </div>

                {[
                  { key: 'emailNotifications', label: 'Email Notifications', desc: 'Receive notifications via email', icon: <Bell size={18} /> },
                  { key: 'smsNotifications', label: 'SMS Notifications', desc: 'Receive notifications via SMS', icon: <Bell size={18} /> },
                  { key: 'appointmentReminders', label: 'Appointment Reminders', desc: 'Get reminders before your appointments', icon: <Bell size={18} /> },
                  { key: 'reviewNotifications', label: 'Review Notifications', desc: 'Get notified when patients leave reviews', icon: <Bell size={18} /> },
                  { key: 'systemAnnouncements', label: 'System Announcements', desc: 'Important updates about the platform', icon: <Bell size={18} /> },
                ].map(item => (
                  <div key={item.key} className="flex items-center justify-between py-4 border-b border-border last:border-b-0">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-teal-light flex items-center justify-center text-teal">
                        {item.icon}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-navy">{item.label}</p>
                        <p className="text-[11px] text-slate-light">{item.desc}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handlePreferenceToggle(item.key)}
                      className={`relative w-12 h-6 rounded-full transition-colors ${preferences[item.key] ? 'bg-teal' : 'bg-gray-300'}`}
                    >
                      <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${preferences[item.key] ? 'translate-x-6' : 'translate-x-0'}`} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Danger Zone Tab */}
          {activeTab === 'danger' && (
            <div className="bg-card rounded-xl border border-red/20 p-6">
              <div className="flex items-center gap-3 mb-1">
                <div className="w-10 h-10 rounded-lg bg-red-light flex items-center justify-center text-red">
                  <AlertTriangle size={20} />
                </div>
                <div>
                  <h2 className="font-display font-semibold text-[17px] text-navy">Danger Zone</h2>
                  <p className="text-xs text-slate-light">Irreversible actions that affect your account</p>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg border border-red/10 bg-red/5">
                  <div>
                    <p className="text-sm font-medium text-navy">Deactivate Account</p>
                    <p className="text-[11px] text-slate-light mt-0.5">Temporarily disable your account. You can reactivate it later.</p>
                  </div>
                  {!dangerActions.deactivate ? (
                    <button
                      type="button"
                      onClick={() => setDangerActions(prev => ({ ...prev, deactivate: true }))}
                      className="px-4 py-2 border border-red text-red rounded-lg text-sm font-medium hover:bg-red-light transition-colors"
                    >
                      Deactivate
                    </button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setDangerActions(prev => ({ ...prev, deactivate: false }))}
                        className="px-4 py-2 border border-border text-slate rounded-lg text-sm hover:bg-surface transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDangerAction('deactivate')}
                        className="px-4 py-2 bg-red text-white rounded-lg text-sm font-medium hover:bg-red/90 transition-colors"
                      >
                        Confirm Deactivate
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg border border-red/10 bg-red/5">
                  <div>
                    <p className="text-sm font-medium text-navy">Clear All Data</p>
                    <p className="text-[11px] text-slate-light mt-0.5">Permanently delete all your data. This cannot be undone.</p>
                  </div>
                  {!dangerActions.clearData ? (
                    <button
                      type="button"
                      onClick={() => setDangerActions(prev => ({ ...prev, clearData: true }))}
                      className="flex items-center gap-1.5 px-4 py-2 border border-red text-red rounded-lg text-sm font-medium hover:bg-red-light transition-colors"
                    >
                      <Trash2 size={14} />
                      Clear All Data
                    </button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setDangerActions(prev => ({ ...prev, clearData: false }))}
                        className="px-4 py-2 border border-border text-slate rounded-lg text-sm hover:bg-surface transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDangerAction('clearData')}
                        className="flex items-center gap-1.5 px-4 py-2 bg-red text-white rounded-lg text-sm font-medium hover:bg-red/90 transition-colors"
                      >
                        <Trash2 size={14} />
                        Confirm Clear Data
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </DoctorDashboardLayout>
  )
}
