import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Building2, Calendar, Users, Stethoscope, AlertCircle, TrendingUp,
  DollarSign, Bed, Activity, Star, Phone, Mail, MapPin, Globe,
  Shield, Award, Plus, Edit, Eye, Download, Filter, RefreshCw,
  FileText, BarChart3, UserPlus, ArrowUpRight, ArrowDownRight,
  Bell, Settings, X, HomeIcon, UserX, FileType2, FileSpreadsheet
} from 'lucide-react'
import HospitalDashboardLayout from '../components/layout/hospital-dashboard-layout'
import Topbar from '../components/layout/topbar'
import { useAuth } from '../context/auth-context'
import { fetchHospitalDashboard } from '../services/api'

export default function HospitalDashboardPage() {
  const { isAuthenticated } = useAuth()
  const [dashboard, setDashboard] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [currentTime, setCurrentTime] = useState(new Date())
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    async function load() {
      if (!isAuthenticated) return
      setLoading(true)
      try {
        const data = await fetchHospitalDashboard()
        setDashboard(data)
      } catch (err) {
        setError(err.message || 'Failed to load hospital dashboard')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [isAuthenticated])

  const hospital = dashboard?.hospital || {}
  const overview = dashboard?.overview || {}
  const recentAppointments = dashboard?.recent_appointments || []

  if (loading) {
    return (
      <HospitalDashboardLayout>
        <Topbar title="Hospital Dashboard" subtitle="Loading..." />
        <div className="p-7">
          <div className="flex items-center justify-center py-20">
            <span className="inline-block w-10 h-10 border-3 border-teal border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      </HospitalDashboardLayout>
    )
  }

  if (error) {
    return (
      <HospitalDashboardLayout>
        <Topbar title="Hospital Dashboard" subtitle="" />
        <div className="p-7">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3 text-red-700">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        </div>
      </HospitalDashboardLayout>
    )
  }

  const getGreeting = () => {
    const hour = currentTime.getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 17) return 'Good afternoon'
    return 'Good evening'
  }

  const statsCards = [
    { label: 'Doctors', value: overview.doctors_count || 0, icon: Stethoscope, color: 'bg-teal-light text-teal', trend: '+2 this month' },
    { label: 'Staff', value: overview.staff_count || 0, icon: Users, color: 'bg-blue-light text-blue', trend: 'Active' },
    { label: 'Departments', value: overview.departments_count || 12, icon: Building2, color: 'bg-purple-light text-purple', trend: 'All operational' },
    { label: 'Patients', value: overview.patients_today || 0, icon: Users, color: 'bg-green-light text-green', trend: '+5% growth' },
    { label: 'Appointments', value: overview.appointments_today || 0, icon: Calendar, color: 'bg-orange-light text-orange', trend: 'Today' },
    { label: 'Revenue', value: overview.revenue ? `$${overview.revenue.toLocaleString()}` : '$0', icon: DollarSign, color: 'bg-green-light text-green', trend: '+12% this month' },
    { label: 'Occupancy', value: `${overview.occupancy || 78}%`, icon: Bed, color: 'bg-blue-light text-blue', trend: '12 beds available' },
    { label: 'Satisfaction', value: `${overview.satisfaction || 4.8}/5`, icon: Star, color: 'bg-yellow-light text-yellow', trend: 'Excellent' },
    { label: 'Emergency', value: overview.emergency_cases || 0, icon: Activity, color: 'bg-red-light text-red', trend: 'Critical cases' },
    { label: 'Bed Availability', value: overview.bed_availability || 12, icon: Bed, color: 'bg-teal-light text-teal', trend: 'Of 100 total' },
  ]

  return (
    <HospitalDashboardLayout>
      <Topbar
        title={`${getGreeting()}, ${hospital.name || 'Hospital Admin'}`}
        subtitle={`${currentTime.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} • Executive Dashboard`}
      />

      {/* Hospital Header */}
      <div className="px-7 pt-2 pb-0">
        <div className="bg-card rounded-xl border border-border p-5 flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="w-16 h-16 rounded-xl bg-teal flex items-center justify-center text-white text-xl font-bold shrink-0">
            {hospital.name?.charAt(0) || 'H'}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="font-display font-bold text-xl text-navy">{hospital.name || 'Hospital'}</h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-[13px] text-slate-light">
              {hospital.address && <span className="flex items-center gap-1.5"><MapPin size={14} /> {hospital.address}</span>}
              {hospital.phone && <span className="flex items-center gap-1.5"><Phone size={14} /> {hospital.phone}</span>}
              {hospital.email && <span className="flex items-center gap-1.5"><Mail size={14} /> {hospital.email}</span>}
              {hospital.website && <span className="flex items-center gap-1.5"><Globe size={14} /> {hospital.website}</span>}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Bell size={20} className="text-slate hover:text-navy cursor-pointer" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red text-white text-[9px] rounded-full flex items-center justify-center">3</span>
            </div>
            <button className="p-2 rounded-lg hover:bg-surface text-slate hover:text-navy transition-colors">
              <Settings size={20} />
            </button>
          </div>
        </div>
      </div>

      <div className="p-7 space-y-6">
        {/* Stats Row - expanded */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {statsCards.map((stat, idx) => (
            <div key={idx} className="group rounded-xl border border-border p-4 bg-card hover:shadow-md hover:border-teal/30 transition-all cursor-pointer">
              <div className="flex items-center justify-between mb-2">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.color}`}>
                  <stat.icon size={20} />
                </div>
                {stat.trend && (
                  <span className="text-[10px] text-slate-light flex items-center gap-0.5">
                    <TrendingUp size={10} /> {stat.trend}
                  </span>
                )}
              </div>
              <p className="font-display font-bold text-[22px] text-navy leading-tight">{stat.value}</p>
              <p className="text-[11px] text-slate-light mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="bg-card rounded-xl border border-border p-1.5 flex gap-1 overflow-x-auto">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'doctors', label: 'Doctors', icon: Stethoscope },
            { id: 'staff', label: 'Staff', icon: Users },
            { id: 'appointments', label: 'Appointments', icon: Calendar },
            { id: 'reports', label: 'Reports', icon: FileText },
            { id: 'analytics', label: 'Analytics', icon: TrendingUp },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-[13px] font-medium transition-colors whitespace-nowrap ${
                activeTab === tab.id ? 'bg-teal text-white' : 'text-slate hover:bg-surface'
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-card rounded-xl border border-border p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <h3 className="font-display font-semibold text-navy text-[17px]">Hospital Overview</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Building2 size={16} className="text-slate-light" />
                    <span className="text-sm text-navy font-medium">{hospital.name || '—'}</span>
                  </div>
                  <p className="text-sm text-slate-light">{hospital.address || '—'}</p>
                  <p className="text-sm text-slate-light">{hospital.phone || '—'}</p>
                  <p className="text-sm text-slate-light">{hospital.email || '—'}</p>
                  {hospital.website && <p className="text-sm text-slate-light">{hospital.website}</p>}
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Shield size={16} className="text-slate-light" />
                    <span className="text-sm text-navy">Accreditation: Level 5 Hospital</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award size={16} className="text-slate-light" />
                    <span className="text-sm text-navy">ISO 9001:2015 Certified</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone size={16} className="text-slate-light" />
                    <span className="text-sm text-navy">Emergency: +254 700 000 000</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <HomeIcon size={16} className="text-slate-light" />
                    <span className="text-sm text-navy">Branches: 3</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'doctors' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-display font-semibold text-navy text-[17px]">Doctor Management</h3>
                <div className="flex items-center gap-2">
                  <button className="px-3 py-1.5 rounded-lg text-[12px] font-medium bg-teal text-white hover:bg-teal-mid transition-colors flex items-center gap-1.5">
                    <Plus size={13} /> Add Doctor
                  </button>
                  <button className="px-3 py-1.5 rounded-lg text-[12px] font-medium border border-border text-navy hover:bg-surface transition-colors flex items-center gap-1.5">
                    <Download size={13} /> Export
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-4 p-4 bg-surface rounded-lg border border-border hover:border-teal/30 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-teal-light flex items-center justify-center text-teal font-semibold text-sm">D{i}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-medium text-navy">Dr. Doctor {i}</p>
                      <p className="text-[11px] text-slate-light">Cardiology • Available • Rating: 4.{8 - i}</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button className="p-1.5 rounded-md text-slate hover:text-teal hover:bg-teal-light transition-colors" title="View Schedule"><Eye size={14} /></button>
                      <button className="p-1.5 rounded-md text-slate hover:text-blue hover:bg-blue-light transition-colors" title="Edit"><Edit size={14} /></button>
                      <button className="p-1.5 rounded-md text-slate hover:text-red hover:bg-red-light transition-colors" title="Suspend"><X size={14} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'staff' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-display font-semibold text-navy text-[17px]">Staff Management</h3>
                <div className="flex items-center gap-2">
                  <button className="px-3 py-1.5 rounded-lg text-[12px] font-medium bg-teal text-white hover:bg-teal-mid transition-colors flex items-center gap-1.5">
                    <Plus size={13} /> Add Staff
                  </button>
                  <button className="px-3 py-1.5 rounded-lg text-[12px] font-medium border border-border text-navy hover:bg-surface transition-colors flex items-center gap-1.5">
                    <Download size={13} /> Export
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-4 p-4 bg-surface rounded-lg border border-border hover:border-teal/30 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-blue-light flex items-center justify-center text-blue font-semibold text-sm">S{i}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-medium text-navy">Staff Member {i}</p>
                      <p className="text-[11px] text-slate-light">Receptionist • Front Office • Present</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button className="p-1.5 rounded-md text-slate hover:text-teal hover:bg-teal-light transition-colors" title="Edit"><Edit size={14} /></button>
                      <button className="p-1.5 rounded-md text-slate hover:text-red hover:bg-red-light transition-colors" title="Deactivate"><UserX size={14} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'appointments' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-display font-semibold text-navy text-[17px]">Appointment Management</h3>
                <div className="flex items-center gap-2">
                  <button className="px-3 py-1.5 rounded-lg text-[12px] font-medium border border-border text-navy hover:bg-surface transition-colors flex items-center gap-1.5">
                    <Filter size={13} /> Filters
                  </button>
                  <button className="px-3 py-1.5 rounded-lg text-[12px] font-medium border border-border text-navy hover:bg-surface transition-colors flex items-center gap-1.5">
                    <Download size={13} /> Export CSV
                  </button>
                </div>
              </div>
              {recentAppointments.length === 0 ? (
                <p className="text-sm text-slate-light text-center py-6">No appointments today</p>
              ) : (
                <div className="space-y-2">
                  {recentAppointments.map((appt) => (
                    <div key={appt.id} className="flex items-center gap-4 p-3 bg-surface rounded-lg border border-border hover:border-teal/30 transition-colors">
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-medium text-navy">{appt.patient_name}</p>
                        <p className="text-[11px] text-slate-light">Dr. {appt.doctor_name} • {appt.time}</p>
                      </div>
                      <span className="text-[11px] px-2.5 py-1 rounded-full bg-teal-light text-teal font-medium">{appt.status}</span>
                      <div className="flex items-center gap-1.5">
                        <button className="p-1.5 rounded-md text-slate hover:text-teal hover:bg-teal-light transition-colors" title="Assign"><UserPlus size={14} /></button>
                        <button className="p-1.5 rounded-md text-slate hover:text-orange hover:bg-orange-light transition-colors" title="Reschedule"><RefreshCw size={14} /></button>
                        <button className="p-1.5 rounded-md text-slate hover:text-red hover:bg-red-light transition-colors" title="Cancel"><X size={14} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'reports' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-display font-semibold text-navy text-[17px]">Reports & Analytics</h3>
                <div className="flex items-center gap-2">
                  <button className="px-3 py-1.5 rounded-lg text-[12px] font-medium border border-border text-navy hover:bg-surface transition-colors flex items-center gap-1.5">
                    <FileType2 size={13} /> PDF
                  </button>
                  <button className="px-3 py-1.5 rounded-lg text-[12px] font-medium border border-border text-navy hover:bg-surface transition-colors flex items-center gap-1.5">
                    <FileSpreadsheet size={13} /> Excel
                  </button>
                  <button className="px-3 py-1.5 rounded-lg text-[12px] font-medium border border-border text-navy hover:bg-surface transition-colors flex items-center gap-1.5">
                    <Download size={13} /> CSV
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-surface rounded-lg p-4 border border-border">
                  <p className="text-[12px] text-slate-light mb-1">Total Revenue</p>
                  <p className="font-display font-bold text-[20px] text-navy">$124,500</p>
                  <p className="text-[11px] text-green flex items-center gap-1 mt-1"><ArrowUpRight size={10} /> +12% from last month</p>
                </div>
                <div className="bg-surface rounded-lg p-4 border border-border">
                  <p className="text-[12px] text-slate-light mb-1">Total Patients</p>
                  <p className="font-display font-bold text-[20px] text-navy">1,234</p>
                  <p className="text-[11px] text-green flex items-center gap-1 mt-1"><ArrowUpRight size={10} /> +5% from last month</p>
                </div>
                <div className="bg-surface rounded-lg p-4 border border-border">
                  <p className="text-[12px] text-slate-light mb-1">Total Appointments</p>
                  <p className="font-display font-bold text-[20px] text-navy">856</p>
                  <p className="text-[11px] text-red flex items-center gap-1 mt-1"><ArrowDownRight size={10} /> -2% from last month</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <h3 className="font-display font-semibold text-navy text-[17px]">Hospital Analytics</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-surface rounded-lg p-4 border border-border">
                  <p className="text-[12px] text-slate-light mb-3">Top Doctors</p>
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                      <span className="text-[13px] text-navy">Dr. Doctor {i}</span>
                      <span className="text-[12px] text-slate-light">{150 - i * 20} patients</span>
                    </div>
                  ))}
                </div>
                <div className="bg-surface rounded-lg p-4 border border-border">
                  <p className="text-[12px] text-slate-light mb-3">Most Visited Department</p>
                  {['Cardiology', 'Pediatrics', 'Orthopedics'].map((dept, i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                      <span className="text-[13px] text-navy">{dept}</span>
                      <span className="text-[12px] text-slate-light">{300 - i * 50} visits</span>
                    </div>
                  ))}
                </div>
                <div className="bg-surface rounded-lg p-4 border border-border">
                  <p className="text-[12px] text-slate-light mb-3">Performance Metrics</p>
                  {[
                    ['Average Waiting Time', '15 min', '-2 min'],
                    ['Patient Satisfaction', '4.8/5', '+0.2'],
                    ['No-show Rate', '8%', '-1%'],
                    ['Monthly Growth', '12%', '+3%'],
                  ].map(([label, value, change]) => (
                    <div key={label} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                      <span className="text-[13px] text-navy">{label}</span>
                      <div className="text-right">
                        <span className="text-[13px] font-medium text-navy">{value}</span>
                        <span className="text-[11px] text-green ml-2">{change}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="bg-surface rounded-lg p-4 border border-border">
                  <p className="text-[12px] text-slate-light mb-3">Emergency Cases</p>
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                      <span className="text-[13px] text-navy">Case {i}</span>
                      <span className="text-[11px] px-2 py-1 rounded-full bg-red-light text-red font-medium">Critical</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Recent Appointments - always visible at bottom */}
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold text-navy mb-4">Recent Appointments</h3>
            <Link to="/appointments" className="text-[12px] font-medium text-teal hover:underline">View all →</Link>
          </div>
          {recentAppointments.length === 0 ? (
            <p className="text-sm text-slate-light text-center py-6">No appointments today</p>
          ) : (
            <div className="space-y-3">
              {recentAppointments.map((appt) => (
                <div key={appt.id} className="flex items-center justify-between p-3 bg-surface rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-navy">{appt.patient_name}</p>
                    <p className="text-xs text-slate-light">Dr. {appt.doctor_name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-light">{appt.time}</p>
                    <span className="text-xs px-2 py-1 rounded bg-teal-light text-teal">{appt.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </HospitalDashboardLayout>
  )
}
