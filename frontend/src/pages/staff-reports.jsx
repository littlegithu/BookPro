import { useState, useEffect } from 'react'
import { BarChart2, Calendar, User, CheckCircle, X } from 'lucide-react'
import StaffDashboardLayout from '../components/layout/staff-dashboard-layout'
import Topbar from '../components/layout/topbar'
import { useAuth } from '../context/auth-context'

export default function StaffReportsPage() {
  const { isAuthenticated } = useAuth()
  const [reportData, setReportData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState('today')

  useEffect(() => {
    async function loadReports() {
      setLoading(true)
      try {
        const mockData = {
          patients_served_today: 45,
          appointments_booked_today: 38,
          check_ins_today: 42,
          no_show_patients: 3,
          completed_appointments: 35,
          cancelled_appointments: 5,
          pending_appointments: 8,
        }
        setReportData(mockData)
      } catch (err) {
        console.error('Failed to load reports:', err)
      } finally {
        setLoading(false)
      }
    }
    loadReports()
  }, [dateRange])

  if (!isAuthenticated) {
    return (
      <StaffDashboardLayout>
        <Topbar title="Staff Dashboard" subtitle="" />
        <div className="p-7">
          <div className="text-center py-20">
            <p className="text-navy mb-4">Please log in to view reports</p>
          </div>
        </div>
      </StaffDashboardLayout>
    )
  }

  if (loading) {
    return (
      <StaffDashboardLayout>
        <Topbar title="Reports" subtitle="Loading..." />
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
      <Topbar title="Reports" subtitle="Hospital performance reports" />
      <div className="p-7">
        <div className="mb-5 flex items-center gap-4">
          <label className="text-navy font-medium">Date Range:</label>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="py-2 px-3 bg-card border border-border rounded-lg"
          >
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-card rounded-lg border border-border p-4 text-center">
            <User size={24} className="mx-auto mb-2 text-teal" />
            <p className="font-bold text-navy text-[24px]">{reportData.patients_served_today}</p>
            <p className="text-[12px] text-slate-light">Patients Served</p>
          </div>
          <div className="bg-card rounded-lg border border-border p-4 text-center">
            <Calendar size={24} className="mx-auto mb-2 text-blue" />
            <p className="font-bold text-navy text-[24px]">{reportData.appointments_booked_today}</p>
            <p className="text-[12px] text-slate-light">Appointments Booked</p>
          </div>
          <div className="bg-card rounded-lg border border-border p-4 text-center">
            <CheckCircle size={24} className="mx-auto mb-2 text-green" />
            <p className="font-bold text-navy text-[24px]">{reportData.check_ins_today}</p>
            <p className="text-[12px] text-slate-light">Check-ins</p>
          </div>
          <div className="bg-card rounded-lg border border-border p-4 text-center">
            <X size={24} className="mx-auto mb-2 text-red" />
            <p className="font-bold text-navy text-[24px]">{reportData.no_show_patients}</p>
            <p className="text-[12px] text-slate-light">No-shows</p>
          </div>
        </div>

        <div className="bg-card rounded-lg border border-border p-4">
          <h2 className="font-display font-semibold text-navy text-[18px] mb-4 flex items-center gap-2">
            <BarChart2 size={20} className="text-teal" />
            Summary
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-[14px] font-medium text-navy mb-3">Appointment Status</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-light">Completed</span>
                  <span className="font-medium">{reportData.completed_appointments}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-light">Cancelled</span>
                  <span className="font-medium">{reportData.cancelled_appointments}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-light">Pending</span>
                  <span className="font-medium">{reportData.pending_appointments}</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-[14px] font-medium text-navy mb-3">Performance</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-light">On-time Rate</span>
                  <span className="font-medium">92%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-light">Avg Check-in</span>
                  <span className="font-medium">8 min</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-light">Queue Length</span>
                  <span className="font-medium">3-5 min</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-[14px] font-medium text-navy mb-3">Department Stats</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-light">Front Office</span>
                  <span className="font-medium">85%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-light">Nursing</span>
                  <span className="font-medium">92%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-light">Laboratory</span>
                  <span className="font-medium">88%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </StaffDashboardLayout>
  )
}