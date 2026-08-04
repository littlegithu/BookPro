import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Calendar, CheckCircle, User, Stethoscope, AlertCircle, Microscope, CreditCard,
  FileText, Hospital, Users, Clock, QrCode, Plus, Printer,
  Pill, ClipboardList, RefreshCw, X,
  FileBarChart, Package, AlertTriangle, CheckCircle2,
  DollarSign, Upload, Activity, Shield, Heart
} from 'lucide-react'
import StaffDashboardLayout from '../components/layout/staff-dashboard-layout'
import Topbar from '../components/layout/topbar'
import { useAuth } from '../context/auth-context'
import { fetchStaffDashboard } from '../services/api'

export default function StaffDashboardPage() {
  const { user, isAuthenticated } = useAuth()
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    async function loadDashboard() {
      setLoading(true)
      try {
        const data = await fetchStaffDashboard()
        setDashboardData(data)
      } catch (err) {
        console.error('Failed to load staff dashboard:', err)
        setError(err.message || 'Failed to load dashboard data')
      } finally {
        setLoading(false)
      }
    }
    loadDashboard()
  }, [isAuthenticated])

  const staffName = (user?.staff?.first_name || user?.first_name || user?.name?.split(' ')[0] || 'Staff') + ' ' +
                    (user?.staff?.last_name || user?.last_name || '').trim()
  const staffRole = user?.staff?.role || user?.role || 'Receptionist'
  const roleData = dashboardData || {}
  const overview = roleData.overview || {}
  const hospitalName = roleData.hospital?.name || roleData.hospital_name || 'General Hospital'

  if (loading) {
    return (
      <StaffDashboardLayout>
        <Topbar title="Staff Dashboard" subtitle="Loading..." />
        <div className="p-7">
          <div className="flex items-center justify-center py-20">
            <span className="inline-block w-10 h-10 border-3 border-teal border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      </StaffDashboardLayout>
    )
  }

  if (error) {
    return (
      <StaffDashboardLayout>
        <Topbar title="Staff Dashboard" subtitle="" />
        <div className="p-7">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 flex items-center gap-3 text-red-700">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        </div>
      </StaffDashboardLayout>
    )
  }

  const getGreeting = () => {
    const hour = currentTime.getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 17) return 'Good afternoon'
    return 'Good evening'
  }

  const renderReceptionistDashboard = () => (
    <div className="space-y-5">
      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card rounded-xl border border-border p-4 hover:border-teal/30 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-lg bg-teal-light flex items-center justify-center text-teal"><Calendar size={20} /></div>
            <span className="text-[10px] px-2 py-1 rounded-full bg-green-light text-green font-medium">Live</span>
          </div>
          <p className="font-display font-bold text-[24px] text-navy">{overview.appointments_today || 0}</p>
          <p className="text-[12px] text-slate-light">Today's Appointments</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-4 hover:border-teal/30 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-lg bg-blue-light flex items-center justify-center text-blue"><Users size={20} /></div>
            <span className="text-[10px] px-2 py-1 rounded-full bg-blue-light text-blue font-medium">Active</span>
          </div>
          <p className="font-display font-bold text-[24px] text-navy">{overview.today_patients_count || 0}</p>
          <p className="text-[12px] text-slate-light">Patients Today</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-4 hover:border-teal/30 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-lg bg-green-light flex items-center justify-center text-green"><CheckCircle size={20} /></div>
            <span className="text-[10px] px-2 py-1 rounded-full bg-green-light text-green font-medium">Done</span>
          </div>
          <p className="font-display font-bold text-[24px] text-navy">{overview.check_ins_today || 0}</p>
          <p className="text-[12px] text-slate-light">Check-ins Today</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-4 hover:border-teal/30 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-lg bg-orange-light flex items-center justify-center text-orange"><Clock size={20} /></div>
            <span className="text-[10px] px-2 py-1 rounded-full bg-orange-light text-orange font-medium">Waiting</span>
          </div>
          <p className="font-display font-bold text-[24px] text-navy">{overview.patients_waiting || 0}</p>
          <p className="text-[12px] text-slate-light">Patients Waiting</p>
        </div>
      </div>

      {/* Queue Section */}
      <div className="bg-card rounded-xl border border-border p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-semibold text-[17px] text-navy flex items-center gap-2">
            <QrCode size={18} className="text-teal" /> Patient Queue
          </h2>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 rounded-lg text-[12px] font-medium bg-teal text-white hover:bg-teal-mid transition-colors flex items-center gap-1.5">
              <Plus size={13} /> Register Patient
            </button>
            <button className="px-3 py-1.5 rounded-lg text-[12px] font-medium border border-border text-navy hover:bg-surface transition-colors flex items-center gap-1.5">
              <Printer size={13} /> Print Queue Ticket
            </button>
          </div>
        </div>
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-4 p-3 bg-surface rounded-lg border border-border hover:border-teal/30 transition-colors">
              <div className="w-10 h-10 rounded-full bg-teal-light flex items-center justify-center text-teal font-semibold text-sm">P{i}</div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-medium text-navy">Patient {i}</p>
                <p className="text-[11px] text-slate-light">Dr. Smith • {10 + i * 15}:{(i * 10) % 60 || '00'} AM • General</p>
              </div>
              <span className="text-[11px] px-2.5 py-1 rounded-full bg-yellow-light text-yellow font-medium">Waiting</span>
              <div className="flex items-center gap-1.5">
                <button className="p-1.5 rounded-md text-slate hover:text-teal hover:bg-teal-light transition-colors" title="Check In"><CheckCircle size={14} /></button>
                <button className="p-1.5 rounded-md text-slate hover:text-blue hover:bg-blue-light transition-colors" title="Assign Doctor"><User size={14} /></button>
                <button className="p-1.5 rounded-md text-slate hover:text-orange hover:bg-orange-light transition-colors" title="Reschedule"><RefreshCw size={14} /></button>
                <button className="p-1.5 rounded-md text-slate hover:text-red hover:bg-red-light transition-colors" title="Cancel"><X size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Check-In', to: '/staff/check-in', icon: CheckCircle, color: 'bg-teal-light text-teal' },
          { label: 'Queue', to: '/staff/queue', icon: Users, color: 'bg-blue-light text-blue' },
          { label: 'Appointments', to: '/staff/appointments', icon: Calendar, color: 'bg-purple-light text-purple' },
          { label: 'Patients', to: '/staff/patients', icon: User, color: 'bg-green-light text-green' },
        ].map((action, idx) => (
          <Link key={idx} to={action.to} className="bg-card rounded-xl border border-border p-4 hover:border-teal/30 hover:shadow-md transition-all group flex flex-col items-center gap-2">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${action.color} group-hover:scale-110 transition-transform`}>
              <action.icon size={18} />
            </div>
            <span className="text-xs font-medium text-slate group-hover:text-navy">{action.label}</span>
          </Link>
        ))}
      </div>
    </div>
  )

  const renderNurseDashboard = () => (
    <div className="space-y-5">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="w-10 h-10 rounded-lg bg-purple-light flex items-center justify-center text-purple mb-2"><User size={20} /></div>
          <p className="font-display font-bold text-[24px] text-navy">{roleData.nurse_data?.my_patients_count || 0}</p>
          <p className="text-[12px] text-slate-light">My Patients Today</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="w-10 h-10 rounded-lg bg-green-light flex items-center justify-center text-green mb-2"><CheckCircle size={20} /></div>
          <p className="font-display font-bold text-[24px] text-navy">{roleData.nurse_data?.patients_seen_today || 0}</p>
          <p className="text-[12px] text-slate-light">Patients Seen</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="w-10 h-10 rounded-lg bg-orange-light flex items-center justify-center text-orange mb-2"><Activity size={20} /></div>
          <p className="font-display font-bold text-[24px] text-navy">{roleData.nurse_data?.vitals_pending || 0}</p>
          <p className="text-[12px] text-slate-light">Vitals Pending</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="w-10 h-10 rounded-lg bg-blue-light flex items-center justify-center text-blue mb-2"><ClipboardList size={20} /></div>
          <p className="font-display font-bold text-[24px] text-navy">{roleData.nurse_data?.tasks_pending || 0}</p>
          <p className="text-[12px] text-slate-light">Tasks Pending</p>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border p-5">
        <h2 className="font-display font-semibold text-navy text-[17px] mb-4 flex items-center gap-2"><Heart size={18} className="text-red" /> Vitals Queue</h2>
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-4 p-3 bg-surface rounded-lg border border-border">
              <div className="w-10 h-10 rounded-full bg-purple-light flex items-center justify-center text-purple font-semibold text-sm">P{i}</div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-medium text-navy">Patient {i}</p>
                <p className="text-[11px] text-slate-light">Room {100 + i} • Dr. Smith</p>
              </div>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1.5 rounded-lg text-[12px] font-medium bg-teal text-white hover:bg-teal-mid transition-colors">Record Vitals</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderLabTechnicianDashboard = () => (
    <div className="space-y-5">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="w-10 h-10 rounded-lg bg-yellow-light flex items-center justify-center text-yellow mb-2"><AlertTriangle size={20} /></div>
          <p className="font-display font-bold text-[24px] text-navy">{roleData.lab_data?.pending_tests || 0}</p>
          <p className="text-[12px] text-slate-light">Pending Tests</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="w-10 h-10 rounded-lg bg-green-light flex items-center justify-center text-green mb-2"><CheckCircle2 size={20} /></div>
          <p className="font-display font-bold text-[24px] text-navy">{roleData.lab_data?.tests_today || 0}</p>
          <p className="text-[12px] text-slate-light">Tests Today</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="w-10 h-10 rounded-lg bg-red-light flex items-center justify-center text-red mb-2"><Activity size={20} /></div>
          <p className="font-display font-bold text-[24px] text-navy">{roleData.lab_data?.urgent_tests || 0}</p>
          <p className="text-[12px] text-slate-light">Urgent Tests</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="w-10 h-10 rounded-lg bg-blue-light flex items-center justify-center text-blue mb-2"><FileBarChart size={20} /></div>
          <p className="font-display font-bold text-[24px] text-navy">{roleData.lab_data?.total_tests || 0}</p>
          <p className="text-[12px] text-slate-light">Total Tests</p>
        </div>
      </div>
    </div>
  )

  const renderPharmacistDashboard = () => (
    <div className="space-y-5">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="w-10 h-10 rounded-lg bg-yellow-light flex items-center justify-center text-yellow mb-2"><ClipboardList size={20} /></div>
          <p className="font-display font-bold text-[24px] text-navy">{roleData.pharmacy_data?.pending_prescriptions || 0}</p>
          <p className="text-[12px] text-slate-light">Pending Prescriptions</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="w-10 h-10 rounded-lg bg-green-light flex items-center justify-center text-green mb-2"><CheckCircle2 size={20} /></div>
          <p className="font-display font-bold text-[24px] text-navy">{roleData.pharmacy_data?.dispensed_today || 0}</p>
          <p className="text-[12px] text-slate-light">Dispensed Today</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="w-10 h-10 rounded-lg bg-teal-light flex items-center justify-center text-teal mb-2"><Package size={20} /></div>
          <p className="font-display font-bold text-[24px] text-navy">{roleData.pharmacy_data?.completed_today || 0}</p>
          <p className="text-[12px] text-slate-light">Completed Today</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="w-10 h-10 rounded-lg bg-orange-light flex items-center justify-center text-orange mb-2"><AlertTriangle size={20} /></div>
          <p className="font-display font-bold text-[24px] text-navy">{roleData.pharmacy_data?.low_stock_medications || 0}</p>
          <p className="text-[12px] text-slate-light">Low Stock Alerts</p>
        </div>
      </div>
    </div>
  )

  const renderCashierDashboard = () => (
    <div className="space-y-5">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="w-10 h-10 rounded-lg bg-yellow-light flex items-center justify-center text-yellow mb-2"><FileText size={20} /></div>
          <p className="font-display font-bold text-[24px] text-navy">{roleData.billing_data?.pending_payments || 0}</p>
          <p className="text-[12px] text-slate-light">Pending Payments</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="w-10 h-10 rounded-lg bg-green-light flex items-center justify-center text-green mb-2"><CheckCircle2 size={20} /></div>
          <p className="font-display font-bold text-[24px] text-navy">{roleData.billing_data?.payments_today || 0}</p>
          <p className="text-[12px] text-slate-light">Payments Today</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="w-10 h-10 rounded-lg bg-blue-light flex items-center justify-center text-blue mb-2"><Shield size={20} /></div>
          <p className="font-display font-bold text-[24px] text-navy">{roleData.billing_data?.insurance_claims || 0}</p>
          <p className="text-[12px] text-slate-light">Insurance Claims</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="w-10 h-10 rounded-lg bg-green-light flex items-center justify-center text-green mb-2"><DollarSign size={20} /></div>
          <p className="font-display font-bold text-[24px] text-navy">KSh {roleData.billing_data?.revenue_today || 0}</p>
          <p className="text-[12px] text-slate-light">Revenue Today</p>
        </div>
      </div>
    </div>
  )

  const renderRecordsOfficerDashboard = () => (
    <div className="space-y-5">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="w-10 h-10 rounded-lg bg-blue-light flex items-center justify-center text-blue mb-2"><FileText size={20} /></div>
          <p className="font-display font-bold text-[24px] text-navy">{roleData.records_data?.total_records || 0}</p>
          <p className="text-[12px] text-slate-light">Total Records</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="w-10 h-10 rounded-lg bg-yellow-light flex items-center justify-center text-yellow mb-2"><AlertTriangle size={20} /></div>
          <p className="font-display font-bold text-[24px] text-navy">{roleData.records_data?.records_needing_attention || 0}</p>
          <p className="text-[12px] text-slate-light">Needs Attention</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="w-10 h-10 rounded-lg bg-green-light flex items-center justify-center text-green mb-2"><CheckCircle2 size={20} /></div>
          <p className="font-display font-bold text-[24px] text-navy">{roleData.records_data?.records_updated_today || 0}</p>
          <p className="text-[12px] text-slate-light">Updated Today</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="w-10 h-10 rounded-lg bg-purple-light flex items-center justify-center text-purple mb-2"><Upload size={20} /></div>
          <p className="font-display font-bold text-[24px] text-navy">{roleData.records_data?.digitization_queue || 0}</p>
          <p className="text-[12px] text-slate-light">Digitization Queue</p>
        </div>
      </div>
    </div>
  )

  const renderRoleSpecificSection = () => {
    switch (staffRole) {
      case 'Nurse': return renderNurseDashboard()
      case 'Lab Technician': return renderLabTechnicianDashboard()
      case 'Pharmacist': return renderPharmacistDashboard()
      case 'Cashier': return renderCashierDashboard()
      case 'Records Officer': return renderRecordsOfficerDashboard()
      default: return renderReceptionistDashboard()
    }
  }

  const getQuickActions = () => {
    switch (staffRole) {
      case 'Nurse':
        return [
          { to: '/staff/nurses/patients', label: 'My Patients', icon: User, color: 'bg-purple-light text-purple' },
          { to: '/staff/nurses/appointments', label: 'Appointments', icon: Calendar, color: 'bg-blue-light text-blue' },
        ]
      case 'Lab Technician':
        return [
          { to: '/staff/lab/orders', label: 'Lab Orders', icon: Microscope, color: 'bg-teal-light text-teal' },
          { to: '/staff/lab/results', label: 'Test Results', icon: FileText, color: 'bg-green-light text-green' },
        ]
      case 'Pharmacist':
        return [
          { to: '/staff/pharmacy/prescriptions', label: 'Prescriptions', icon: Pill, color: 'bg-orange-light text-orange' },
          { to: '/staff/pharmacy/medications', label: 'Medications', icon: Package, color: 'bg-blue-light text-blue' },
        ]
      case 'Cashier':
        return [
          { to: '/staff/billing', label: 'Billing', icon: CreditCard, color: 'bg-green-light text-green' },
          { to: '/staff/transactions', label: 'Transactions', icon: FileText, color: 'bg-blue-light text-blue' },
        ]
      case 'Records Officer':
        return [
          { to: '/staff/records', label: 'Patient Records', icon: FileText, color: 'bg-teal-light text-teal' },
          { to: '/staff/archives', label: 'Archives', icon: Hospital, color: 'bg-purple-light text-purple' },
        ]
      default:
        return [
          { to: '/staff/check-in', label: 'Patient Check-In', icon: CheckCircle, color: 'bg-teal-light text-teal' },
          { to: '/staff/queue', label: 'View Queue', icon: Stethoscope, color: 'bg-blue-light text-blue' },
        ]
    }
  }

  return (
    <StaffDashboardLayout>
      <Topbar title={`${getGreeting()}, ${staffName}`} subtitle={staffRole} />
      <div className="p-7 grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-5 flex-1">
        {/* Left column */}
        <div className="flex flex-col gap-5">
          {/* Role-specific dashboard */}
          {renderRoleSpecificSection()}

          {/* Staff Info */}
          <div className="bg-card rounded-xl border border-border p-5">
            <h2 className="font-display font-semibold text-navy text-[17px] mb-4">Your Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-surface rounded-lg p-4">
                <p className="text-[12px] text-slate-light mb-1">Employee ID</p>
                <p className="text-navy font-medium">{roleData.employee_id || user?.staff?.employee_id || '—'}</p>
              </div>
              <div className="bg-surface rounded-lg p-4">
                <p className="text-[12px] text-slate-light mb-1">Department</p>
                <p className="text-navy font-medium">{roleData.department || user?.staff?.department || '—'}</p>
              </div>
              <div className="bg-surface rounded-lg p-4">
                <p className="text-[12px] text-slate-light mb-1">Role</p>
                <p className="text-navy font-medium">{staffRole}</p>
              </div>
              <div className="bg-surface rounded-lg p-4">
                <p className="text-[12px] text-slate-light mb-1">Hospital</p>
                <p className="text-navy font-medium">{hospitalName}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-4">
          {/* Today's Summary */}
          <div className="bg-gradient-to-br from-teal to-teal-mid rounded-xl p-5 text-white">
            <p className="text-[11px] font-medium text-white/70 mb-3.5 uppercase tracking-wider">Today's Summary</p>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="font-display font-bold text-[24px] text-white">{overview.appointments_today || 0}</p>
                <p className="text-[10px] mt-0.5 text-white/60">Appointments</p>
              </div>
              <div className="text-center">
                <p className="font-display font-bold text-[24px] text-white">{overview.today_patients_count || 0}</p>
                <p className="text-[10px] mt-0.5 text-white/60">Patients</p>
              </div>
              <div className="text-center">
                <p className="font-display font-bold text-[24px] text-white">{overview.pending_tasks_count || 0}</p>
                <p className="text-[10px] mt-0.5 text-white/60">Pending Tasks</p>
              </div>
            </div>
          </div>

          {/* Quick actions */}
          <div className="bg-card rounded-xl border border-border p-5">
            <h2 className="font-display font-semibold text-navy text-[17px] mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-3">
              {getQuickActions().map((action) => (
                <Link key={action.to} to={action.to} className="bg-teal text-white p-4 rounded-lg text-center hover:bg-teal-mid transition-colors flex flex-col items-center gap-2">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-white/15`}>
                    <action.icon size={18} />
                  </div>
                  <p className="text-sm font-medium">{action.label}</p>
                </Link>
              ))}
            </div>
          </div>

          {/* Profile card */}
          <div className="bg-card rounded-xl border border-border p-5">
            <div className="flex flex-col items-center text-center pb-3.5 border-b border-border mb-3.5">
              <div className="w-13 h-13 rounded-full bg-teal flex items-center justify-center text-white text-[17px] font-semibold mb-2.5 overflow-hidden">
                {user?.profile_image ? (
                  <img src={user.profile_image} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  staffName?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
                )}
              </div>
              <p className="font-display font-semibold text-[16px] text-navy">{staffName}</p>
              <p className="text-[12px] text-slate-light mt-0.5">{staffRole}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-surface rounded-lg p-4">
                <p className="text-[12px] text-slate-light mb-1">Employee ID</p>
                <p className="text-navy font-medium">{roleData.employee_id || '—'}</p>
              </div>
              <div className="bg-surface rounded-lg p-4">
                <p className="text-[12px] text-slate-light mb-1">Department</p>
                <p className="text-navy font-medium">{roleData.department || '—'}</p>
              </div>
              <div className="bg-surface rounded-lg p-4">
                <p className="text-[12px] text-slate-light mb-1">Role</p>
                <p className="text-navy font-medium">{staffRole}</p>
              </div>
              <div className="bg-surface rounded-lg p-4">
                <p className="text-[12px] text-slate-light mb-1">Hospital</p>
                <p className="text-navy font-medium">{hospitalName}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </StaffDashboardLayout>
  )
}
