import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { Save } from 'lucide-react'
import StaffDashboardLayout from '../components/layout/staff-dashboard-layout'
import Topbar from '../components/layout/topbar'
import { useAuth } from '../context/auth-context'
import { fetchStaffProfile, updateStaffProfile } from '../services/api'

export default function StaffProfilePage() {
  const { isAuthenticated, staffRole } = useAuth()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    department: '',
    employee_id: '',
    address: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
  })

  useEffect(() => {
    async function loadProfile() {
      setLoading(true)
      try {
        const data = await fetchStaffProfile()
        setProfile(data)
        setFormData({
          first_name: data.first_name || '',
          last_name: data.last_name || '',
          email: data.email || '',
          phone: data.phone || '',
          department: data.department || '',
          employee_id: data.employee_id || '',
          address: data.address || '',
          emergency_contact_name: data.emergency_contact_name || '',
          emergency_contact_phone: data.emergency_contact_phone || '',
        })
      } catch (err) {
        setError('Failed to load profile')
        toast.error('Failed to load profile')
      } finally {
        setLoading(false)
      }
    }
    loadProfile()
  }, [])

  const handleChange = (field) => (e) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }))
  }

  const handleSave = async () => {
    setSaving(true)
    setError('')
    setSuccess('')
    try {
      await updateStaffProfile(formData)
      setSuccess('Profile updated successfully')
      toast.success('Profile updated successfully!')
    } catch (err) {
      const errorMsg = err.message || 'Failed to update profile'
      setError(errorMsg)
      toast.error(errorMsg)
    } finally {
      setSaving(false)
    }
  }

  if (!isAuthenticated) {
    return (
      <StaffDashboardLayout>
        <Topbar title="Staff Dashboard" subtitle="" />
        <div className="p-7">
          <div className="text-center py-20">
            <p className="text-navy mb-4">Please log in to view profile</p>
          </div>
        </div>
      </StaffDashboardLayout>
    )
  }

  if (loading) {
    return (
      <StaffDashboardLayout>
        <Topbar title="Profile" subtitle="Loading..." />
        <div className="p-7">
          <div className="flex items-center justify-center py-20">
            <span className="inline-block w-10 h-10 border-3 border-teal border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      </StaffDashboardLayout>
    )
  }

  return (
    <StaffDashboardLayout>
      <Topbar title="Staff Profile" subtitle="View and update your information" />
      <div className="p-7 max-w-2xl">
        <div className="bg-card rounded-lg border border-border p-6">
          <h2 className="font-display font-semibold text-navy text-[18px] mb-6">Personal Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-[12px] font-medium text-slate-light mb-1">First Name</label>
              <input
                type="text"
                value={formData.first_name}
                onChange={handleChange('first_name')}
                className="w-full py-2.5 bg-card border border-border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-[12px] font-medium text-slate-light mb-1">Last Name</label>
              <input
                type="text"
                value={formData.last_name}
                onChange={handleChange('last_name')}
                className="w-full py-2.5 bg-card border border-border rounded-lg"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-[12px] font-medium text-slate-light mb-1">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={handleChange('email')}
                className="w-full py-2.5 bg-card border border-border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-[12px] font-medium text-slate-light mb-1">Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={handleChange('phone')}
                className="w-full py-2.5 bg-card border border-border rounded-lg"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-[12px] font-medium text-slate-light mb-1">Role</label>
              <input type="text" value={staffRole} readOnly className="w-full py-2.5 bg-navy/10 text-navy rounded-lg" />
            </div>
            <div>
              <label className="block text-[12px] font-medium text-slate-light mb-1">Department</label>
              <input
                type="text"
                value={formData.department}
                onChange={handleChange('department')}
                className="w-full py-2.5 bg-card border border-border rounded-lg"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-[12px] font-medium text-slate-light mb-1">Employee ID</label>
              <input
                type="text"
                value={formData.employee_id}
                onChange={handleChange('employee_id')}
                className="w-full py-2.5 bg-card border border-border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-[12px] font-medium text-slate-light mb-1">Hospital</label>
              <input type="text" value={profile?.hospital_name || '—'} readOnly className="w-full py-2.5 bg-navy/10 text-navy rounded-lg" />
            </div>
          </div>

          {error && <div className="text-red-600 text-sm mb-3">{error}</div>}
          {success && <div className="text-green-600 text-sm mb-3">{success}</div>}

          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-teal text-white rounded-lg hover:bg-teal-mid transition-colors"
          >
            {saving ? 'Saving...' : <><Save size={18} /> Save Changes</>}
          </button>
        </div>
      </div>
    </StaffDashboardLayout>
  )
}