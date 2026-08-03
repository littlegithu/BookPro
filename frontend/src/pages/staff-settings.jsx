import { useState } from 'react'
import { Sun, Moon, Bell, Globe, Lock, Save } from 'lucide-react'
import StaffDashboardLayout from '../components/layout/staff-dashboard-layout'
import Topbar from '../components/layout/topbar'
import { useAuth } from '../context/auth-context'
import { useTheme } from '../context/theme-context'

export default function StaffSettingsPage() {
  const { isAuthenticated } = useAuth()
  const { darkMode, setDarkMode } = useTheme()
  const [settings, setSettings] = useState({
    notifications: true,
    emailAlerts: true,
    language: 'en',
  })
  const [saving, setSaving] = useState(false)

  const handleSettingChange = (key) => (e) => {
    setSettings(prev => ({ ...prev, [key]: e.target.value || e.target.checked }))
  }

  const handleSave = async () => {
    setSaving(true)
    // Save logic would go here
    setTimeout(() => setSaving(false), 1000)
  }

  if (!isAuthenticated) {
    return (
      <StaffDashboardLayout>
        <Topbar title="Staff Dashboard" subtitle="" />
        <div className="p-7">
          <div className="text-center py-20">
            <p className="text-navy mb-4">Please log in for settings</p>
          </div>
        </div>
      </StaffDashboardLayout>
    )
  }

  return (
    <StaffDashboardLayout>
      <Topbar title="Settings" subtitle="Configure your preferences" />
      <div className="p-7 max-w-2xl">
        <div className="space-y-6">
          <div className="bg-card rounded-lg border border-border p-6">
            <h2 className="font-display font-semibold text-navy text-[18px] mb-4 flex items-center gap-2">
              <Sun size={20} className="text-teal" /> Theme
            </h2>
            <div className="flex items-center justify-between">
              <span className="text-slate-light">Dark Mode</span>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="w-12 h-6 bg-slate rounded-full p-1 transition-colors"
              >
                <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${
                  darkMode ? 'translate-x-6 bg-teal' : ''
                }`} />
              </button>
            </div>
          </div>

          <div className="bg-card rounded-lg border border-border p-6">
            <h2 className="font-display font-semibold text-navy text-[18px] mb-4 flex items-center gap-2">
              <Bell size={20} className="text-teal" /> Notifications
            </h2>
            <div className="space-y-3">
              <label className="flex items-center justify-between">
                <span className="text-slate-light">Enable notifications</span>
                <input
                  type="checkbox"
                  checked={settings.notifications}
                  onChange={handleSettingChange('notifications')}
                  className="w-5 h-5 rounded border-border"
                />
              </label>
              <label className="flex items-center justify-between">
                <span className="text-slate-light text-sm">Email alerts</span>
                <input
                  type="checkbox"
                  checked={settings.emailAlerts}
                  onChange={handleSettingChange('emailAlerts')}
                  className="w-5 h-5 rounded border-border"
                />
              </label>
            </div>
          </div>

          <div className="bg-card rounded-lg border border-border p-6">
            <h2 className="font-display font-semibold text-navy text-[18px] mb-4 flex items-center gap-2">
              <Globe size={20} className="text-teal" /> Language
            </h2>
            <select
              value={settings.language}
              onChange={handleSettingChange('language')}
              className="w-full py-2.5 bg-card border border-border rounded-lg"
            >
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
              <option value="sw">Kiswahili</option>
            </select>
          </div>

          <div className="bg-card rounded-lg border border-border p-6">
            <h2 className="font-display font-semibold text-navy text-[18px] mb-4 flex items-center gap-2">
              <Lock size={20} className="text-teal" /> Security
            </h2>
            <button className="flex items-center gap-2 px-4 py-2 bg-navy/10 text-navy rounded-lg hover:bg-navy/20 transition-colors">
              <Lock size={18} /> Change Password
            </button>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-teal text-white rounded-lg hover:bg-teal-mid transition-colors"
          >
            {saving ? 'Saving...' : <><Save size={18} /> Save Settings</>}
          </button>
        </div>
      </div>
    </StaffDashboardLayout>
  )
}