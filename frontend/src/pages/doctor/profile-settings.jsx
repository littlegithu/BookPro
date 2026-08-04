import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { Save, RotateCcw, Upload, Camera } from 'lucide-react'
import Topbar from '../../components/layout/topbar'
import DoctorDashboardLayout from '../../components/layout/doctor-dashboard-layout'
import { fetchDoctorProfile, updateDoctorProfile } from '../../services/api'

export default function DoctorProfileSettingsPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState({})
  const [profile, setProfile] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    bio: '',
    specialty: '',
    specialties: '',
    languages: '',
    education: '',
    years_practice: '',
    certifications: '',
    awards: '',
    working_days: '',
    working_hours: '',
    fee: '',
    hospital_name: '',
    hospital_location: '',
    hospital_phone: '',
    social_links: '',
    profile_image: '',
    cover_image: '',
  })

  useEffect(() => {
    loadProfile()
  }, [])

  async function loadProfile() {
    try {
      const data = await fetchDoctorProfile()
      setProfile({
        first_name: data.first_name || '',
        last_name: data.last_name || '',
        email: data.email || '',
        phone: data.phone || '',
        bio: data.bio || '',
        specialty: data.specialty || '',
        specialties: data.specialties || '',
        languages: data.languages || '',
        education: data.education || '',
        years_practice: data.years_practice ?? '',
        certifications: data.certifications || '',
        awards: data.awards || '',
        working_days: data.working_days || '',
        working_hours: data.working_hours || '',
        fee: data.fee ?? '',
        hospital_name: data.hospital_name || '',
        hospital_location: data.hospital_location || '',
        hospital_phone: data.hospital_phone || '',
        social_links: data.social_links || '',
        profile_image: data.profile_image || '',
        cover_image: data.cover_image || '',
      })
    } catch (err) {
      toast.error(err.message || 'Failed to load profile')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field) => (e) => {
    setProfile(prev => ({ ...prev, [field]: e.target.value }))
    setErrors(prev => ({ ...prev, [field]: '' }))
  }

  const handleImageChange = (field) => (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onloadend = () => {
      setProfile(prev => ({ ...prev, [field]: reader.result }))
    }
    reader.readAsDataURL(file)
  }

  const validate = () => {
    const newErrors = {}
    if (!profile.first_name.trim()) newErrors.first_name = 'First name is required'
    if (!profile.last_name.trim()) newErrors.last_name = 'Last name is required'
    if (!profile.email.trim()) newErrors.email = 'Email is required'
    if (!profile.phone.trim()) newErrors.phone = 'Phone is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) {
      toast.error('Please fill in all required fields')
      return
    }
    setSaving(true)
    try {
      const payload = {
        ...profile,
        years_practice: profile.years_practice === '' ? null : Number(profile.years_practice),
        fee: profile.fee === '' ? null : Number(profile.fee),
      }
      await updateDoctorProfile(payload)
      toast.success('Profile updated successfully!')
    } catch (err) {
      toast.error(err.message || 'Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  const handleReset = () => {
    loadProfile()
    setErrors({})
  }

  if (loading) {
    return (
      <DoctorDashboardLayout>
        <Topbar title="Profile Settings" subtitle="Loading..." />
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
      <Topbar title="Profile Settings" subtitle="Manage your professional profile" />

      <div className="p-7">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Photos */}
          <div className="bg-card rounded-xl border border-border p-6">
            <h2 className="font-display font-semibold text-[17px] text-navy mb-4">Profile Photos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[12px] font-medium text-slate-light mb-2">Profile Photo</label>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-xl bg-surface border border-border overflow-hidden flex items-center justify-center shrink-0">
                    {profile.profile_image ? (
                      <img src={profile.profile_image} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <Camera size={24} className="text-slate-light" />
                    )}
                  </div>
                  <label className="cursor-pointer px-4 py-2 border border-border rounded-lg text-sm text-slate hover:bg-surface hover:text-teal transition-colors flex items-center gap-2">
                    <Upload size={14} />
                    Upload
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageChange('profile_image')} />
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-[12px] font-medium text-slate-light mb-2">Cover Photo</label>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-xl bg-surface border border-border overflow-hidden flex items-center justify-center shrink-0">
                    {profile.cover_image ? (
                      <img src={profile.cover_image} alt="Cover" className="w-full h-full object-cover" />
                    ) : (
                      <Camera size={24} className="text-slate-light" />
                    )}
                  </div>
                  <label className="cursor-pointer px-4 py-2 border border-border rounded-lg text-sm text-slate hover:bg-surface hover:text-teal transition-colors flex items-center gap-2">
                    <Upload size={14} />
                    Upload
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageChange('cover_image')} />
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div className="bg-card rounded-xl border border-border p-6">
            <h2 className="font-display font-semibold text-[17px] text-navy mb-4">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[12px] font-medium text-slate-light mb-1">First Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={profile.first_name}
                  onChange={handleChange('first_name')}
                  className={`w-full py-2.5 bg-card border rounded-lg ${errors.first_name ? 'border-red-400' : 'border-border'} focus:outline-none focus:ring-2 focus:ring-teal/30`}
                />
                {errors.first_name && <p className="text-red-500 text-[11px] mt-1">{errors.first_name}</p>}
              </div>
              <div>
                <label className="block text-[12px] font-medium text-slate-light mb-1">Last Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={profile.last_name}
                  onChange={handleChange('last_name')}
                  className={`w-full py-2.5 bg-card border rounded-lg ${errors.last_name ? 'border-red-400' : 'border-border'} focus:outline-none focus:ring-2 focus:ring-teal/30`}
                />
                {errors.last_name && <p className="text-red-500 text-[11px] mt-1">{errors.last_name}</p>}
              </div>
              <div>
                <label className="block text-[12px] font-medium text-slate-light mb-1">Email <span className="text-red-500">*</span></label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={handleChange('email')}
                  className={`w-full py-2.5 bg-card border rounded-lg ${errors.email ? 'border-red-400' : 'border-border'} focus:outline-none focus:ring-2 focus:ring-teal/30`}
                />
                {errors.email && <p className="text-red-500 text-[11px] mt-1">{errors.email}</p>}
              </div>
              <div>
                <label className="block text-[12px] font-medium text-slate-light mb-1">Phone <span className="text-red-500">*</span></label>
                <input
                  type="tel"
                  value={profile.phone}
                  onChange={handleChange('phone')}
                  className={`w-full py-2.5 bg-card border rounded-lg ${errors.phone ? 'border-red-400' : 'border-border'} focus:outline-none focus:ring-2 focus:ring-teal/30`}
                />
                {errors.phone && <p className="text-red-500 text-[11px] mt-1">{errors.phone}</p>}
              </div>
              <div className="md:col-span-2">
                <label className="block text-[12px] font-medium text-slate-light mb-1">Bio</label>
                <textarea
                  value={profile.bio}
                  onChange={handleChange('bio')}
                  rows="3"
                  className="w-full py-2.5 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal/30 resize-none"
                />
              </div>
            </div>
          </div>

          {/* Professional Details */}
          <div className="bg-card rounded-xl border border-border p-6">
            <h2 className="font-display font-semibold text-[17px] text-navy mb-4">Professional Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[12px] font-medium text-slate-light mb-1">Specialty</label>
                <input
                  type="text"
                  value={profile.specialty}
                  onChange={handleChange('specialty')}
                  className="w-full py-2.5 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal/30"
                />
              </div>
              <div>
                <label className="block text-[12px] font-medium text-slate-light mb-1">Specialties</label>
                <input
                  type="text"
                  value={profile.specialties}
                  onChange={handleChange('specialties')}
                  placeholder="Cardiology, Radiology, ..."
                  className="w-full py-2.5 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal/30"
                />
              </div>
              <div>
                <label className="block text-[12px] font-medium text-slate-light mb-1">Languages</label>
                <input
                  type="text"
                  value={profile.languages}
                  onChange={handleChange('languages')}
                  placeholder="English, Spanish, French"
                  className="w-full py-2.5 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal/30"
                />
              </div>
              <div>
                <label className="block text-[12px] font-medium text-slate-light mb-1">Education</label>
                <input
                  type="text"
                  value={profile.education}
                  onChange={handleChange('education')}
                  className="w-full py-2.5 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal/30"
                />
              </div>
              <div>
                <label className="block text-[12px] font-medium text-slate-light mb-1">Years of Practice</label>
                <input
                  type="number"
                  value={profile.years_practice}
                  onChange={handleChange('years_practice')}
                  min="0"
                  className="w-full py-2.5 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal/30"
                />
              </div>
              <div>
                <label className="block text-[12px] font-medium text-slate-light mb-1">Consultation Fee ($)</label>
                <input
                  type="number"
                  value={profile.fee}
                  onChange={handleChange('fee')}
                  min="0"
                  className="w-full py-2.5 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal/30"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-[12px] font-medium text-slate-light mb-1">Certifications</label>
                <textarea
                  value={profile.certifications}
                  onChange={handleChange('certifications')}
                  rows="2"
                  className="w-full py-2.5 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal/30 resize-none"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-[12px] font-medium text-slate-light mb-1">Awards</label>
                <textarea
                  value={profile.awards}
                  onChange={handleChange('awards')}
                  rows="2"
                  className="w-full py-2.5 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal/30 resize-none"
                />
              </div>
              <div>
                <label className="block text-[12px] font-medium text-slate-light mb-1">Working Days</label>
                <input
                  type="text"
                  value={profile.working_days}
                  onChange={handleChange('working_days')}
                  placeholder="Mon-Fri"
                  className="w-full py-2.5 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal/30"
                />
              </div>
              <div>
                <label className="block text-[12px] font-medium text-slate-light mb-1">Working Hours</label>
                <input
                  type="text"
                  value={profile.working_hours}
                  onChange={handleChange('working_hours')}
                  placeholder="9:00 AM - 5:00 PM"
                  className="w-full py-2.5 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal/30"
                />
              </div>
            </div>
          </div>

          {/* Hospital Information */}
          <div className="bg-card rounded-xl border border-border p-6">
            <h2 className="font-display font-semibold text-[17px] text-navy mb-4">Hospital Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[12px] font-medium text-slate-light mb-1">Hospital Name</label>
                <input
                  type="text"
                  value={profile.hospital_name}
                  onChange={handleChange('hospital_name')}
                  className="w-full py-2.5 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal/30"
                />
              </div>
              <div>
                <label className="block text-[12px] font-medium text-slate-light mb-1">Hospital Location</label>
                <input
                  type="text"
                  value={profile.hospital_location}
                  onChange={handleChange('hospital_location')}
                  className="w-full py-2.5 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal/30"
                />
              </div>
              <div>
                <label className="block text-[12px] font-medium text-slate-light mb-1">Hospital Phone</label>
                <input
                  type="tel"
                  value={profile.hospital_phone}
                  onChange={handleChange('hospital_phone')}
                  className="w-full py-2.5 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal/30"
                />
              </div>
            </div>
          </div>

          {/* Social & Links */}
          <div className="bg-card rounded-xl border border-border p-6">
            <h2 className="font-display font-semibold text-[17px] text-navy mb-4">Social & Links</h2>
            <div>
              <label className="block text-[12px] font-medium text-slate-light mb-1">Social Links</label>
              <textarea
                value={profile.social_links}
                onChange={handleChange('social_links')}
                rows="3"
                placeholder="LinkedIn: https://linkedin.com/in/yourprofile&#10;Twitter: https://twitter.com/yourhandle"
                className="w-full py-2.5 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal/30 resize-none"
              />
              <p className="text-[11px] text-slate-light mt-1">Enter one link per line with platform name.</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2 border border-border rounded-lg text-sm text-slate hover:bg-surface transition-colors flex items-center gap-1.5"
            >
              <RotateCcw size={14} />
              Reset
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-teal text-white rounded-lg text-sm font-medium hover:bg-teal-mid transition-colors disabled:opacity-50 flex items-center gap-1.5"
            >
              <Save size={14} />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </DoctorDashboardLayout>
  )
}
