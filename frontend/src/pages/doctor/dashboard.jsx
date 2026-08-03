import { useState, useEffect } from 'react'
import { Calendar, CheckCircle, ClipboardList, Clock, Stethoscope, User, TrendingUp, ArrowUpRight, ArrowDownRight, Users, Star, DollarSign } from 'lucide-react'
import Topbar from '../components/layout/topbar'
import { fetchDoctorDashboard, fetchDoctorAppointments, fetchDoctorPatients } from '../../services/api'

export default function DoctorDashboardPage() {
  const { user, isAuthenticated } = useAuth()
  const [dashboard, setDashboard] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchDoctorDashboard()
        setDashboard(data)
      } catch (err) {
        setError(err.message || 'Failed to load dashboard')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [isAuthenticated])

  const stats = dashboard?.stats || {}
  const todayAppointments = dashboard?.today_appointments || []
  const upcomingAppointments = dashboard?.upcoming_appointments || []

  if (loading) {
    return (
      <DoctorDashboardLayout>
        <Topbar title="Doctor Dashboard" subtitle="Loading your practice overview..." />
        <div className="p-7">
          <div className="flex items-center justify-center py-20">
            <span className="inline-block w-8 h-8 border-2 border-teal border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      </DoctorDashboardLayout>
    )
  }

  const statCards = [
    { label: "Today's Appointments", value: stats.today_appointments || 0, icon: <Calendar size={20} />, color: 'bg-teal-light text-teal', trend: '+12%', trendIcon: <ArrowUpRight size={14} /> },
    { label: 'Upcoming This Week', value: stats.upcoming_appointments || 0, icon: <ClipboardList size={20} />, color: 'bg-blue-light text-blue', trend: '+5%', trendIcon: <ArrowUpRight size={14} /> },
    { label: 'Completed', value: stats.completed_appointments || 0, icon: <CheckCircle size={20} />, color: 'bg-green-light text-green', trend: '+8%', trendIcon: <ArrowUpRight size={14} /> },
    { label: 'Total Patients', value: stats.total_patients || 0, icon: <Users size={20} />, color: 'bg-purple-light text-purple', trend: '+3%', trendIcon: <ArrowUpRight size={14} /> },
    { label: 'Average Rating', value: stats.average_rating || 0, icon: <Star size={20} />, color: 'bg-yellow-light text-yellow', trend: stats.rating_trend || '0%', trendIcon: stats.rating_trend?.startsWith('-') ? <ArrowDownRight size={14} /> : <ArrowUpRight size={14} /> },
    { label: 'Monthly Revenue', value: stats.monthly_revenue ? `$${stats.monthly_revenue.toLocaleString()}` : '$0', icon: <DollarSign size={20} />, color: 'bg-orange-light text-orange', trend: stats.revenue_trend || '+15%', trendIcon: <ArrowUpRight size={14} /> },
  ]

  return (
    <DoctorDashboardLayout>
      <Topbar 
        title={`Good ${new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 17 ? 'Afternoon' : 'Evening'}, Dr. ${user?.name?.split(' ')[0] || 'User'}`}
        subtitle="Manage your appointments, patients, and practice"
      />
      <div className="p-7 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5">
        {statCards.map((stat, idx) => (
          <div key={idx} className={`rounded-xl border border-border p-5 ${idx >= 4 ? 'col-span-2 xl:col-span-1' : ''}`}>
            <div className="flex items-start justify-between">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.color}`}>{stat.icon}</div>
              <div className="flex items-center gap-1 text-[12px] font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                {stat.trendIcon} {stat.trend}
              </div>
            </div>
            <p className="font-display font-bold text-[24px] text-navy mt-3">{stat.value}</p>
            <p className="text-[12px] text-slate-light mt-1">{stat.label}</p>
          </div>
        ))}

        {/* Today's Schedule */}
        <div className="xl:col-span-2 col-span-1 lg:col-span-2 rounded-xl border border-border p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-semibold text-[17px] text-navy">Today's Schedule</h2>
            <a href="/doctor/schedule" className="text-[12px] font-medium text-teal hover:underline">View all →</a>
          </div>
          {todayAppointments.length === 0 ? (
            <div className="text-center py-8 text-slate-light">
              <Calendar className="w-10 h-10 mx-auto mb-2 opacity-50" />
              <p>No appointments scheduled for today</p>
            </div>
          ) : (
            <div className="space-y-3">
              {todayAppointments.slice(0, 5).map((apt) => (
                <div key={apt.id} className="flex items-center gap-3 p-3 bg-surface rounded-lg border border-border">
                  <div className="w-10 h-10 rounded-full bg-teal-light flex items-center justify-center text-teal font-semibold text-sm shrink-0">
                    {apt.patient_name?.charAt(0) || 'P'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-navy truncate">{apt.patient_name}</p>
                    <p className="text-[12px] text-slate-light flex items-center gap-1.5">
                      <Clock size={12} /> {apt.appointment_time} • {apt.specialty || 'General'}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-[10px] font-medium shrink-0 ${
                    apt.status === 'Scheduled' ? 'bg-blue-light text-blue' :
                    apt.status === 'Completed' ? 'bg-green-light text-green' :
                    apt.status === 'Cancelled' ? 'bg-red-light text-red' :
                    'bg-yellow-light text-yellow'
                  }`}>{apt.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upcoming Appointments */}
        <div className="xl:col-span-2 col-span-1 lg:col-span-2 rounded-xl border border-border p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-semibold text-[17px] text-navy">Upcoming Appointments</h2>
            <a href="/doctor/appointments" className="text-[12px] font-medium text-teal hover:underline">View all →</a>
          </div>
          {upcomingAppointments.length === 0 ? (
            <div className="text-center py-8 text-slate-light">
              <ClipboardList className="w-10 h-10 mx-auto mb-2 opacity-50" />
              <p>No upcoming appointments</p>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingAppointments.slice(0, 5).map((apt) => (
                <div key={apt.id} className="flex items-center gap-3 p-3 bg-surface rounded-lg border border-border">
                  <div className="w-10 h-10 rounded-full bg-blue-light flex items-center justify-center text-blue font-semibold text-sm shrink-0">
                    {apt.patient_name?.charAt(0) || 'P'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-navy truncate">{apt.patient_name}</p>
                    <p className="text-[12px] text-slate-light flex items-center gap-1.5">
                      <Calendar size={12} /> {apt.appointment_date} at {apt.appointment_time} • {apt.specialty || 'General'}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-[10px] font-medium shrink-0 ${
                    apt.status === 'Scheduled' ? 'bg-blue-light text-blue' :
                    apt.status === 'Pending' ? 'bg-yellow-light text-yellow' :
                    'bg-gray-light text-gray'
                  }`}>{apt.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DoctorDashboardLayout>
  )
}