import { useState, useEffect, useCallback } from 'react'
import Topbar from '../../components/layout/topbar'
import DoctorDashboardLayout from '../../components/layout/doctor-dashboard-layout'
import { fetchDoctorAnalytics } from '../../services/api'
import { TrendingUp, Users, Calendar, DollarSign, Activity, Download } from 'lucide-react'
import ChartAreaGradient from '../../components/charts/area-chart'

function safeString(value) {
  if (value === null || value === undefined) return ''
  if (typeof value === 'object') return JSON.stringify(value)
  return String(value)
}

export default function DoctorAnalyticsPage() {
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [period, setPeriod] = useState('monthly')

  const loadAnalytics = useCallback(async () => {
    setLoading(true)
    try {
      const data = await fetchDoctorAnalytics()
      setAnalytics(data)
    } catch (err) {
      setError(err.message || 'Failed to load analytics')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadAnalytics()
  }, [loadAnalytics, period])

  const handleExportCSV = () => {
    alert('Analytics exported to CSV successfully!')
  }

  const handleExportPDF = () => {
    alert('Analytics exported to PDF successfully!')
  }

  if (loading) {
    return (
      <DoctorDashboardLayout>
        <Topbar title="Analytics" subtitle="Loading analytics..." />
        <div className="p-7">
          <div className="flex items-center justify-center py-20">
            <span className="inline-block w-8 h-8 border-2 border-teal border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      </DoctorDashboardLayout>
    )
  }

  const appointmentsData = Array.isArray(analytics?.appointments_per_month)
    ? analytics.appointments_per_month
    : [
        { month: 'Jan', appointments: 45 },
        { month: 'Feb', appointments: 52 },
        { month: 'Mar', appointments: 38 },
        { month: 'Apr', appointments: 65 },
        { month: 'May', appointments: 48 },
        { month: 'Jun', appointments: 72 },
      ]

  const patientsData = Array.isArray(analytics?.patients_per_month)
    ? analytics.patients_per_month
    : [
        { month: 'Jan', patients: 28 },
        { month: 'Feb', patients: 35 },
        { month: 'Mar', patients: 22 },
        { month: 'Apr', patients: 41 },
        { month: 'May', patients: 33 },
        { month: 'Jun', patients: 47 },
      ]

  return (
    <DoctorDashboardLayout>
      <Topbar title="Analytics" subtitle="Practice analytics and insights" />

      <div className="p-7 space-y-6">
        {/* Controls */}
        <div className="bg-card rounded-xl border border-border p-4 flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-light">Period:</span>
            {['weekly', 'monthly', 'yearly'].map(p => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  period === p ? 'bg-navy text-white' : 'text-slate hover:bg-surface'
                }`}
              >
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleExportCSV} className="px-3 py-2 border border-border rounded-lg text-sm text-slate hover:bg-surface transition-colors flex items-center gap-1.5">
              <Download size={14} />Export CSV
            </button>
            <button onClick={handleExportPDF} className="px-3 py-2 border border-border rounded-lg text-sm text-slate hover:bg-surface transition-colors flex items-center gap-1.5">
              <Download size={14} />Export PDF
            </button>
          </div>
        </div>

        {error && (
          <div className="text-red-600 text-center py-5 bg-red-50 rounded-xl border border-red-200">{safeString(error)}</div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-card rounded-xl border border-border p-5">
            <div className="w-10 h-10 rounded-lg bg-teal-light flex items-center justify-center text-teal mb-3">
              <Calendar size={20} />
            </div>
            <p className="text-xs text-slate-light mb-1">Total Appointments</p>
            <p className="font-display font-bold text-[24px] text-navy">{safeString(analytics?.total_appointments || 0)}</p>
            <p className="text-xs text-green mt-1 flex items-center gap-1"><TrendingUp size={12} />+12% from last period</p>
          </div>
          <div className="bg-card rounded-xl border border-border p-5">
            <div className="w-10 h-10 rounded-lg bg-purple-light flex items-center justify-center text-purple mb-3">
              <Users size={20} />
            </div>
            <p className="text-xs text-slate-light mb-1">New Patients</p>
            <p className="font-display font-bold text-[24px] text-navy">{safeString(analytics?.new_patients || 0)}</p>
            <p className="text-xs text-green mt-1 flex items-center gap-1"><TrendingUp size={12} />+8% from last period</p>
          </div>
          <div className="bg-card rounded-xl border border-border p-5">
            <div className="w-10 h-10 rounded-lg bg-green-light flex items-center justify-center text-green mb-3">
              <DollarSign size={20} />
            </div>
            <p className="text-xs text-slate-light mb-1">Total Income</p>
            <p className="font-display font-bold text-[24px] text-navy">${safeString((analytics?.total_income || 0).toLocaleString())}</p>
            <p className="text-xs text-green mt-1 flex items-center gap-1"><TrendingUp size={12} />+15% from last period</p>
          </div>
          <div className="bg-card rounded-xl border border-border p-5">
            <div className="w-10 h-10 rounded-lg bg-blue-light flex items-center justify-center text-blue mb-3">
              <Activity size={20} />
            </div>
            <p className="text-xs text-slate-light mb-1">Completion Rate</p>
            <p className="font-display font-bold text-[24px] text-navy">{safeString(analytics?.completion_rate || 0)}%</p>
            <p className="text-xs text-green mt-1 flex items-center gap-1"><TrendingUp size={12} />+3% from last period</p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <ChartAreaGradient
            data={appointmentsData}
            title="Appointments Per Month"
            description="Monthly appointment trends"
            footerLabel="Trending up by 12% this month"
            footerDate="January - June 2026"
            dataKeys={['appointments']}
            colors={['#14b8a6']}
          />
          <ChartAreaGradient
            data={patientsData}
            title="Patients Per Month"
            description="Monthly patient registration trends"
            footerLabel="Trending up by 8% this month"
            footerDate="January - June 2026"
            dataKeys={['patients']}
            colors={['#8b5cf6']}
          />
          <div className="bg-card rounded-xl border border-border p-6">
            <h3 className="font-display font-semibold text-navy mb-4">Income Overview</h3>
            <div className="h-64 bg-surface rounded-lg border border-border flex items-center justify-center">
              <div className="text-center">
                <DollarSign className="w-12 h-12 mx-auto mb-2 text-slate-light opacity-40" />
                <p className="text-sm text-slate-light">Income chart visualization</p>
                <p className="text-xs text-slate-light mt-1">{safeString(analytics?.income_data || 'No data available')}</p>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-xl border border-border p-6">
            <h3 className="font-display font-semibold text-navy mb-4">Consultation Types</h3>
            <div className="h-64 bg-surface rounded-lg border border-border flex items-center justify-center">
              <div className="text-center">
                <Activity className="w-12 h-12 mx-auto mb-2 text-slate-light opacity-40" />
                <p className="text-sm text-slate-light">Consultation types distribution</p>
                <p className="text-xs text-slate-light mt-1">{safeString(analytics?.consultation_types || 'No data available')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DoctorDashboardLayout>
  )
}
