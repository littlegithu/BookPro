import { useState, useEffect } from 'react'
import {
  Bell, Calendar, Star, FileText, Clock, CheckCircle, X, Trash2,
  RefreshCw, ChevronDown, XCircle
} from 'lucide-react'
import { toast } from 'react-hot-toast'
import Topbar from '../../components/layout/topbar'
import DoctorDashboardLayout from '../../components/layout/doctor-dashboard-layout'
import {
  fetchDoctorNotifications,
  markNotificationRead,
  deleteNotification
} from '../../services/api'

const FILTER_OPTIONS = [
  { key: 'all', label: 'All' },
  { key: 'unread', label: 'Unread' },
  { key: 'read', label: 'Read' },
]

const NOTIFICATION_TYPES = [
  { key: 'appointment', label: 'Appointment Updates', icon: Calendar, color: 'text-blue', bg: 'bg-blue-light' },
  { key: 'review', label: 'Review Alerts', icon: Star, color: 'text-yellow', bg: 'bg-yellow-light' },
  { key: 'record', label: 'Medical Record Updates', icon: FileText, color: 'text-green', bg: 'bg-green-light' },
  { key: 'reminder', label: 'Follow-up Reminders', icon: Clock, color: 'text-orange', bg: 'bg-orange-light' },
  { key: 'announcement', label: 'Admin Announcements', icon: Bell, color: 'text-purple', bg: 'bg-purple-light' },
]

const SETTINGS_STORAGE_KEY = 'doctor_notification_settings'

function getTypeConfig(type) {
  const map = {
    appointment: { Icon: Calendar, color: 'text-blue', bg: 'bg-blue-light', border: 'border-blue' },
    review: { Icon: Star, color: 'text-yellow', bg: 'bg-yellow-light', border: 'border-yellow' },
    record: { Icon: FileText, color: 'text-green', bg: 'bg-green-light', border: 'border-green' },
    announcement: { Icon: Bell, color: 'text-purple', bg: 'bg-purple-light', border: 'border-purple' },
    reminder: { Icon: Clock, color: 'text-orange', bg: 'bg-orange-light', border: 'border-orange' },
  }
  return map[type] || { Icon: Bell, color: 'text-gray', bg: 'bg-gray-light', border: 'border-gray' }
}

function formatRelativeTime(dateStr) {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now - date
  const diffSec = Math.floor(diffMs / 1000)
  if (diffSec < 60) return 'Just now'
  const diffMin = Math.floor(diffSec / 60)
  if (diffMin < 60) return `${diffMin} minute${diffMin > 1 ? 's' : ''} ago`
  const diffHr = Math.floor(diffMin / 60)
  if (diffHr < 24) return `${diffHr} hour${diffHr > 1 ? 's' : ''} ago`
  const diffDay = Math.floor(diffHr / 24)
  if (diffDay < 7) return `${diffDay} day${diffDay > 1 ? 's' : ''} ago`
  const diffWeek = Math.floor(diffDay / 7)
  if (diffWeek < 4) return `${diffWeek} week${diffWeek > 1 ? 's' : ''} ago`
  const diffMonth = Math.floor(diffDay / 30)
  if (diffMonth < 12) return `${diffMonth} month${diffMonth > 1 ? 's' : ''} ago`
  return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function DoctorNotificationsPage() {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('all')
  const [actionLoading, setActionLoading] = useState({})
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [clearConfirm, setClearConfirm] = useState(false)
  const [settings, setSettings] = useState(() => {
    try {
      const stored = localStorage.getItem(SETTINGS_STORAGE_KEY)
      return stored ? JSON.parse(stored) : {
        appointment: true,
        review: true,
        record: true,
        reminder: true,
        announcement: true,
      }
    } catch {
      return {
        appointment: true,
        review: true,
        record: true,
        reminder: true,
        announcement: true,
      }
    }
  })

  useEffect(() => {
    loadNotifications()
  }, [filter])

  useEffect(() => {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings))
  }, [settings])

  async function loadNotifications() {
    setLoading(true)
    try {
      const unreadOnly = filter === 'unread'
      const readOnly = filter === 'read'
      const data = await fetchDoctorNotifications(unreadOnly)
      let result = Array.isArray(data) ? data : []
      if (readOnly) {
        result = result.filter(n => n.is_read)
      }
      setNotifications(result)
    } catch (err) {
      setError(err.message || 'Failed to load notifications')
    } finally {
      setLoading(false)
    }
  }

  const handleToggleRead = async (notif) => {
    setActionLoading(prev => ({ ...prev, [notif.id]: 'toggle' }))
    try {
      const newReadState = !notif.is_read
      await markNotificationRead(notif.id, newReadState)
      setNotifications(prev =>
        prev.map(n => n.id === notif.id ? { ...n, is_read: newReadState } : n)
      )
    } catch (err) {
      toast.error(err.message || 'Failed to update notification')
      console.error('Failed to toggle read status:', err)
    } finally {
      setActionLoading(prev => ({ ...prev, [notif.id]: null }))
    }
  }

  const handleDelete = async (id) => {
    setActionLoading(prev => ({ ...prev, [id]: 'delete' }))
    try {
      await deleteNotification(id)
      setNotifications(prev => prev.filter(n => n.id !== id))
      setDeleteConfirm(null)
    } catch (err) {
      toast.error(err.message || 'Failed to delete notification')
      console.error('Failed to delete notification:', err)
    } finally {
      setActionLoading(prev => ({ ...prev, [id]: null }))
    }
  }

  const handleMarkAllRead = async () => {
    const unread = notifications.filter(n => !n.is_read)
    if (unread.length === 0) {
      toast.success('All notifications are already read')
      return
    }
    setActionLoading(prev => ({ ...prev, markAll: true }))
    try {
      await Promise.all(unread.map(n => markNotificationRead(n.id, true)))
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))
      toast.success(`${unread.length} notification${unread.length > 1 ? 's' : ''} marked as read`)
    } catch (err) {
      toast.error(err.message || 'Failed to mark all as read')
      console.error('Failed to mark all as read:', err)
    } finally {
      setActionLoading(prev => ({ ...prev, markAll: false }))
    }
  }

  const handleClearAll = async () => {
    if (notifications.length === 0) return
    try {
      await Promise.all(notifications.map(n => deleteNotification(n.id)))
      setNotifications([])
      setClearConfirm(false)
      toast.success('All notifications cleared')
    } catch (err) {
      toast.error(err.message || 'Failed to clear notifications')
      console.error('Failed to clear all:', err)
    }
  }

  const handleToggleSetting = (key) => {
    setSettings(prev => {
      const next = { ...prev, [key]: !prev[key] }
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(next))
      return next
    })
    toast.success('Settings saved')
  }

  const unreadCount = notifications.filter(n => !n.is_read).length

  return (
    <DoctorDashboardLayout>
      <Topbar title="Notifications" subtitle="Stay updated with your practice" />

      <div className="p-7 space-y-6">
        {/* Action Bar */}
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <span className="px-2.5 py-1 bg-teal-light text-teal text-[11px] font-semibold rounded-full">
                  {unreadCount} unread
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={handleMarkAllRead}
                disabled={actionLoading.markAll || unreadCount === 0}
                className="px-4 py-2 bg-teal text-white rounded-lg text-sm font-medium hover:bg-teal/90 transition-colors disabled:opacity-50 flex items-center gap-1.5"
              >
                {actionLoading.markAll ? (
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <CheckCircle size={14} />
                )}
                Mark All Read
              </button>
              <button
                onClick={() => setClearConfirm(true)}
                disabled={notifications.length === 0}
                className="px-4 py-2 border border-border rounded-lg text-sm font-medium text-slate hover:bg-surface transition-colors disabled:opacity-50 flex items-center gap-1.5"
              >
                <Trash2 size={14} />
                Clear All
              </button>
              <div className="relative">
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="appearance-none px-4 py-2 pr-8 bg-surface border border-border rounded-lg text-sm text-navy outline-none focus:border-teal"
                >
                  {FILTER_OPTIONS.map(opt => (
                    <option key={opt.key} value={opt.key}>{opt.label}</option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-light pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="text-red-600 text-center py-5 bg-red-50 rounded-xl border border-red-200">{error}</div>
        )}

        {/* Notifications List */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <span className="inline-block w-8 h-8 border-2 border-teal border-t-transparent rounded-full animate-spin" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="bg-card rounded-xl border border-border p-10 text-center">
            <Bell className="w-16 h-16 mx-auto mb-4 text-slate-light opacity-40" />
            <p className="text-lg font-medium text-navy mb-1">No notifications</p>
            <p className="text-sm text-slate-light">
              {filter === 'unread' ? 'You have no unread notifications.' :
               filter === 'read' ? 'You have no read notifications.' :
               'You are all caught up! New notifications will appear here.'}
            </p>
          </div>
        ) : (
          <div className="bg-card rounded-xl border border-border overflow-hidden divide-y divide-border">
            {notifications.map((notif) => {
              const { Icon, color, bg, border } = getTypeConfig(notif.type)
              const isRead = !!notif.is_read
              return (
                <div
                  key={notif.id}
                  className={`flex items-start gap-4 p-4 transition-colors hover:bg-surface/70 ${
                    !isRead ? 'bg-teal-pale/40 border-l-4 ' + border : ''
                  }`}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${bg} ${color}`}>
                    <Icon size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-navy">{notif.title || 'Notification'}</p>
                         <p className="text-sm text-slate mt-0.5 line-clamp-2">
                           {typeof notif.message === 'string' ? notif.message : ''}
                         </p>
                        <p className="text-[11px] text-slate-light mt-1.5 flex items-center gap-1">
                          <Clock size={10} />
                          {formatRelativeTime(notif.created_at)}
                        </p>
                      </div>
                      {!isRead && (
                        <span className="w-2.5 h-2.5 rounded-full bg-teal shrink-0 mt-1.5" title="Unread" />
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => handleToggleRead(notif)}
                      disabled={actionLoading[notif.id] === 'toggle'}
                      title={isRead ? 'Mark as unread' : 'Mark as read'}
                      className="p-1.5 rounded-md text-slate hover:text-teal hover:bg-teal-light transition-colors disabled:opacity-50"
                    >
                      {actionLoading[notif.id] === 'toggle' ? (
                        <span className="inline-block w-3.5 h-3.5 border-2 border-slate border-t-transparent rounded-full animate-spin" />
                      ) : isRead ? (
                        <XCircle size={16} />
                      ) : (
                        <CheckCircle size={16} />
                      )}
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(notif)}
                      disabled={actionLoading[notif.id] === 'delete'}
                      title="Delete"
                      className="p-1.5 rounded-md text-slate hover:text-red hover:bg-red-light transition-colors disabled:opacity-50"
                    >
                      {actionLoading[notif.id] === 'delete' ? (
                        <span className="inline-block w-3.5 h-3.5 border-2 border-slate border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Trash2 size={16} />
                      )}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Notification Settings */}
        <div className="bg-card rounded-xl border border-border p-5">
          <h3 className="font-display font-semibold text-[17px] text-navy mb-4">Notification Settings</h3>
          <p className="text-sm text-slate-light mb-5">Choose which notifications you want to receive.</p>
          <div className="space-y-4">
            {NOTIFICATION_TYPES.map(({ key, label, icon: Icon }) => (
              <div key={key} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-surface flex items-center justify-center text-slate">
                    <Icon size={16} />
                  </div>
                  <span className="text-sm font-medium text-navy">{label}</span>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={settings[key]}
                  onClick={() => handleToggleSetting(key)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 ease-in-out ${
                    settings[key] ? 'bg-teal' : 'bg-border'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200 ease-in-out ${
                      settings[key] ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-xl border border-border w-full max-w-md p-6">
            <h3 className="font-display font-semibold text-lg text-navy mb-2">Delete Notification</h3>
            <p className="text-sm text-slate mb-5">Are you sure you want to delete this notification? This action cannot be undone.</p>
            <div className="flex items-center justify-end gap-2">
              <button onClick={() => setDeleteConfirm(null)} className="px-4 py-2 border border-border rounded-lg text-sm text-slate hover:bg-surface transition-colors">
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm.id)}
                disabled={actionLoading[deleteConfirm.id] === 'delete'}
                className="px-4 py-2 bg-red text-white rounded-lg text-sm font-medium hover:bg-red/90 transition-colors disabled:opacity-50 flex items-center gap-1.5"
              >
                {actionLoading[deleteConfirm.id] === 'delete' ? (
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : null}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Clear All Confirmation Modal */}
      {clearConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-xl border border-border w-full max-w-md p-6">
            <h3 className="font-display font-semibold text-lg text-navy mb-2">Clear All Notifications</h3>
            <p className="text-sm text-slate mb-5">Are you sure you want to delete all notifications? This action cannot be undone.</p>
            <div className="flex items-center justify-end gap-2">
              <button onClick={() => setClearConfirm(false)} className="px-4 py-2 border border-border rounded-lg text-sm text-slate hover:bg-surface transition-colors">
                Cancel
              </button>
              <button
                onClick={handleClearAll}
                className="px-4 py-2 bg-red text-white rounded-lg text-sm font-medium hover:bg-red/90 transition-colors flex items-center gap-1.5"
              >
                <Trash2 size={14} />
                Clear All
              </button>
            </div>
          </div>
        </div>
      )}
    </DoctorDashboardLayout>
  )
}
