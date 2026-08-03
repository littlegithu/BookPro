import { useState, useEffect } from 'react'
import { Bell, Check, X, Calendar, User, Stethoscope } from 'lucide-react'
import StaffDashboardLayout from '../components/layout/staff-dashboard-layout'
import Topbar from '../components/layout/topbar'
import { useAuth } from '../context/auth-context'

const getNotificationIcon = (type) => {
  switch (type) {
    case 'appointment_booked': return <Calendar size={18} />
    case 'appointment_cancelled': return <X size={18} />
    case 'patient_checked_in': return <User size={18} />
    case 'doctor_unavailable': return <Stethoscope size={18} />
    default: return <Bell size={18} />
  }
}

export default function StaffNotificationsPage() {
  const { isAuthenticated } = useAuth()
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadNotifications() {
      setLoading(true)
      try {
        const mockNotifications = [
          { id: 1, type: 'patient_checked_in', title: 'John Mwangi checked in', message: 'Patient arrived for appointment', is_read: false },
          { id: 2, type: 'appointment_booked', title: 'New appointment', message: 'Mary Wanjiku booked appointment', is_read: false },
          { id: 3, type: 'doctor_unavailable', title: 'Dr. Sarah unavailable', message: 'Doctor on leave tomorrow', is_read: true },
        ]
        setNotifications(mockNotifications)
      } catch (err) {
        console.error('Failed to load notifications:', err)
      } finally {
        setLoading(false)
      }
    }
    loadNotifications()
  }, [])

  const markAsRead = (id) => {
    setNotifications(prev => prev.map(n =>
      n.id === id ? { ...n, is_read: true } : n
    ))
  }

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))
  }

  if (!isAuthenticated) {
    return (
      <StaffDashboardLayout>
        <Topbar title="Staff Dashboard" subtitle="" />
        <div className="p-7">
          <div className="text-center py-20">
            <p className="text-navy mb-4">Please log in to view notifications</p>
          </div>
        </div>
      </StaffDashboardLayout>
    )
  }

  return (
    <StaffDashboardLayout>
      <Topbar title="Notifications" subtitle="Stay updated with hospital notifications" />
      <div className="p-7">
        <div className="flex justify-between items-center mb-5">
          <h2 className="font-display font-semibold text-navy">Recent Notifications</h2>
          <button
            onClick={markAllAsRead}
            className="px-3 py-2 bg-teal text-white rounded-lg text-sm hover:bg-teal-mid transition-colors"
          >
            Mark All Read
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <span className="inline-block w-10 h-10 border-3 border-teal border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map(notification => (
              <div
                key={notification.id}
                className={`p-4 rounded-lg border ${
                  notification.is_read
                    ? 'bg-card border-border'
                    : 'bg-teal/5 border-teal'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-teal flex items-center justify-center text-white">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-navy">{notification.title}</h4>
                      {!notification.is_read && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="text-teal hover:text-teal-mid"
                        >
                          <Check size={16} />
                        </button>
                      )}
                    </div>
                    <p className="text-[13px] text-slate-light mt-1">{notification.message}</p>
                    <span className="text-[11px] text-slate-light mt-2">
                      {new Date().toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            {notifications.length === 0 && (
              <div className="text-center py-20 text-slate-light">
                <Bell size={40} className="mx-auto mb-2" />
                <p>No notifications</p>
              </div>
            )}
          </div>
        )}
      </div>
    </StaffDashboardLayout>
  )
}