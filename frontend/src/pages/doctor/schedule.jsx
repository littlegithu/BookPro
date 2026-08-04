import { useState, useEffect, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Calendar, Clock, Plus, X, ChevronLeft, ChevronRight,
  GripVertical, Save, Trash2, Repeat, Shield, AlertTriangle,
  Eye, Play, CheckCheck, Filter, Search, MoreVertical,
  Ban, Zap, Briefcase
} from 'lucide-react'
import Topbar from '../../components/layout/topbar'
import DoctorDashboardLayout from '../../components/layout/doctor-dashboard-layout'
import {
  fetchDoctorSchedule,
  fetchDoctorScheduleSlots,
  createDoctorScheduleSlot,
  updateDoctorScheduleSlot,
  deleteDoctorScheduleSlot
} from '../../services/api'
import StatusBadge from '../../components/doctor/shared/status-badge'

const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const DAY_NAMES_FULL = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

const SLOT_TYPE_CONFIG = {
  working: { label: 'Working Slot', color: 'bg-teal-light text-teal border-teal', bg: 'bg-teal/10', bar: 'bg-teal' },
  break: { label: 'Break', color: 'bg-yellow-light text-yellow border-yellow', bg: 'bg-yellow/10', bar: 'bg-yellow' },
  vacation: { label: 'Vacation', color: 'bg-red-light text-red border-red', bg: 'bg-red/10', bar: 'bg-red' },
  emergency: { label: 'Emergency Available', color: 'bg-indigo-light text-indigo border-indigo', bg: 'bg-indigo/10', bar: 'bg-indigo' }
}

const SLOT_TYPES = [
  { value: 'working', label: 'Working Slot' },
  { value: 'break', label: 'Break' },
  { value: 'vacation', label: 'Vacation' },
  { value: 'emergency', label: 'Emergency Available' }
]

export default function DoctorSchedulePage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [slots, setSlots] = useState([])
  const [appointments, setAppointments] = useState([])
  const [viewMode, setViewMode] = useState('daily')
  const [currentDate, setCurrentDate] = useState(new Date())

  const [showSlotModal, setShowSlotModal] = useState(false)
  const [showBlockModal, setShowBlockModal] = useState(false)
  const [showVacationModal, setShowVacationModal] = useState(false)
  const [showRepeatModal, setShowRepeatModal] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [editingSlot, setEditingSlot] = useState(null)
  const [deletingSlotId, setDeletingSlotId] = useState(null)

  const [slotForm, setSlotForm] = useState({ day_of_week: 1, start_time: '09:00', end_time: '17:00', slot_type: 'working', is_break: false, is_vacation: false, is_emergency_available: false })
  const [blockForm, setBlockForm] = useState({ date: '', reason: '' })
  const [vacationForm, setVacationForm] = useState({ start_date: '', end_date: '', reason: '' })
  const [repeatTargets, setRepeatTargets] = useState([])
  const [selectedDaySlots, setSelectedDaySlots] = useState([])
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  const today = new Date()
  const todayDayOfWeek = (today.getDay() + 6) % 7

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    if (viewMode === 'daily') {
      loadAppointments()
    }
  }, [viewMode, currentDate])

  async function loadData() {
    setLoading(true)
    setError('')
    try {
      const [slotsData, aptData] = await Promise.all([
        fetchDoctorScheduleSlots(),
        fetchDoctorSchedule()
      ])
      setSlots(Array.isArray(slotsData) ? slotsData : [])
      setAppointments(Array.isArray(aptData) ? aptData : [])
    } catch (err) {
      setError(err.message || 'Failed to load schedule data')
    } finally {
      setLoading(false)
    }
  }

  async function loadAppointments() {
    try {
      const data = await fetchDoctorSchedule()
      setAppointments(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Failed to load appointments:', err)
    }
  }

  const getWeekStart = (date) => {
    const d = new Date(date)
    const day = d.getDay()
    const diff = d.getDate() - day + (day === 0 ? -6 : 1)
    return new Date(d.setDate(diff))
  }

  const getMonthDays = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const days = []
    const startDay = (firstDay.getDay() + 6) % 7
    for (let i = 0; i < startDay; i++) days.push(null)
    for (let i = 1; i <= lastDay.getDate(); i++) days.push(new Date(year, month, i))
    while (days.length % 7 !== 0) days.push(null)
    return days
  }

  const formatDate = (d) => {
    if (!d) return ''
    const date = new Date(d)
    if (isNaN(date)) return String(d)
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  const formatTime = (time) => {
    if (!time) return ''
    const [h, m] = time.split(':').map(Number)
    const period = h >= 12 ? 'PM' : 'AM'
    const hour12 = h % 12 || 12
    return `${hour12}:${String(m).padStart(2, '0')} ${period}`
  }

  const formatTimeRange = (start, end) => {
    return `${formatTime(start)} - ${formatTime(end)}`
  }

  const getDayOfWeek = (date) => {
    const d = new Date(date)
    return (d.getDay() + 6) % 7
  }

  const isSameDay = (d1, d2) => {
    if (!d1 || !d2) return false
    const date1 = new Date(d1)
    const date2 = new Date(d2)
    return date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth() && date1.getDate() === date2.getDate()
  }

  const getSlotsForDay = (dayOfWeek, date) => {
    return slots.filter(s => {
      if (s.day_of_week !== dayOfWeek) return false
      if (date && s.is_vacation) {
        const slotDate = new Date(s.start_time || s.created_at)
        return isSameDay(slotDate, date)
      }
      return true
    })
  }

  const getAppointmentsForDay = (date) => {
    return appointments.filter(apt => {
      const aptDate = apt.appointment_date || apt.date
      return isSameDay(aptDate, date)
    })
  }

  const getAvailabilityStatus = (dayOfWeek, date) => {
    const daySlots = getSlotsForDay(dayOfWeek, date)
    if (daySlots.some(s => s.is_vacation)) return 'vacation'
    const hasWorking = daySlots.some(s => !s.is_break && !s.is_vacation)
    const hasEmergency = daySlots.some(s => s.is_emergency_available)
    if (hasEmergency) return 'emergency'
    if (hasWorking) return 'working'
    if (daySlots.some(s => s.is_break)) return 'break'
    return 'none'
  }

  const navigateDate = (delta) => {
    const newDate = new Date(currentDate)
    if (viewMode === 'daily' || viewMode === 'weekly') {
      newDate.setDate(newDate.getDate() + delta)
    } else {
      newDate.setMonth(newDate.getMonth() + delta)
    }
    setCurrentDate(newDate)
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  const handleSlotSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setMessage({ type: '', text: '' })
    try {
      const type = slotForm.slot_type
      const data = {
        day_of_week: slotForm.day_of_week,
        start_time: slotForm.start_time + ':00',
        end_time: slotForm.end_time + ':00',
        is_break: type === 'break',
        is_vacation: type === 'vacation',
        is_emergency_available: type === 'emergency'
      }
      if (editingSlot) {
        await updateDoctorScheduleSlot(editingSlot.id, data)
        setMessage({ type: 'success', text: 'Slot updated successfully' })
      } else {
        await createDoctorScheduleSlot(data)
        setMessage({ type: 'success', text: 'Slot created successfully' })
      }
      setShowSlotModal(false)
      setEditingSlot(null)
      setSlotForm({ day_of_week: 1, start_time: '09:00', end_time: '17:00', slot_type: 'working', is_break: false, is_vacation: false, is_emergency_available: false })
      const [slotsData] = await Promise.all([fetchDoctorScheduleSlots()])
      setSlots(Array.isArray(slotsData) ? slotsData : [])
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Failed to save slot' })
    } finally {
      setSubmitting(false)
    }
  }

  const handleBlockDate = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setMessage({ type: '', text: '' })
    try {
      const date = new Date(blockForm.date)
      const dayOfWeek = (date.getDay() + 6) % 7
      await createDoctorScheduleSlot({
        day_of_week: dayOfWeek,
        start_time: '00:00:00',
        end_time: '23:59:59',
        is_break: false,
        is_vacation: true,
        is_emergency_available: false
      })
      setShowBlockModal(false)
      setBlockForm({ date: '', reason: '' })
      setMessage({ type: 'success', text: 'Date blocked successfully' })
      const [slotsData] = await Promise.all([fetchDoctorScheduleSlots()])
      setSlots(Array.isArray(slotsData) ? slotsData : [])
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Failed to block date' })
    } finally {
      setSubmitting(false)
    }
  }

  const handleVacationMode = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setMessage({ type: '', text: '' })
    try {
      const start = new Date(vacationForm.start_date)
      const end = new Date(vacationForm.end_date)
      const newSlots = []
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        newSlots.push({
          day_of_week: (d.getDay() + 6) % 7,
          start_time: '00:00:00',
          end_time: '23:59:59',
          is_break: false,
          is_vacation: true,
          is_emergency_available: false
        })
      }
      for (const slotData of newSlots) {
        await createDoctorScheduleSlot(slotData)
      }
      setShowVacationModal(false)
      setVacationForm({ start_date: '', end_date: '', reason: '' })
      setMessage({ type: 'success', text: 'Vacation mode enabled for selected dates' })
      const [slotsData] = await Promise.all([fetchDoctorScheduleSlots()])
      setSlots(Array.isArray(slotsData) ? slotsData : [])
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Failed to set vacation mode' })
    } finally {
      setSubmitting(false)
    }
  }

  const handleRepeatSchedule = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setMessage({ type: '', text: '' })
    try {
      const selectedSlots = slots.filter(s => s.day_of_week === todayDayOfWeek)
      for (const slot of selectedSlots) {
        for (const targetDay of repeatTargets) {
          await createDoctorScheduleSlot({
            day_of_week: targetDay,
            start_time: slot.start_time,
            end_time: slot.end_time,
            is_break: slot.is_break,
            is_vacation: slot.is_vacation,
            is_emergency_available: slot.is_emergency_available
          })
        }
      }
      setShowRepeatModal(false)
      setRepeatTargets([])
      setMessage({ type: 'success', text: 'Schedule repeated successfully' })
      const [slotsData] = await Promise.all([fetchDoctorScheduleSlots()])
      setSlots(Array.isArray(slotsData) ? slotsData : [])
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Failed to repeat schedule' })
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteSlot = async () => {
    if (!deletingSlotId) return
    try {
      await deleteDoctorScheduleSlot(deletingSlotId)
      setSlots(prev => prev.filter(s => s.id !== deletingSlotId))
      setShowConfirmModal(false)
      setDeletingSlotId(null)
      setMessage({ type: 'success', text: 'Slot deleted successfully' })
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Failed to delete slot' })
    }
  }

  const openEditSlot = (slot) => {
    setEditingSlot(slot)
    setSlotForm({
      day_of_week: slot.day_of_week,
      start_time: slot.start_time?.slice(0, 5) || '09:00',
      end_time: slot.end_time?.slice(0, 5) || '17:00',
      slot_type: slot.is_break ? 'break' : slot.is_vacation ? 'vacation' : slot.is_emergency_available ? 'emergency' : 'working',
      is_break: slot.is_break,
      is_vacation: slot.is_vacation,
      is_emergency_available: slot.is_emergency_available
    })
    setShowSlotModal(true)
  }

  const openAddSlot = () => {
    setEditingSlot(null)
    const dayOfWeek = viewMode === 'daily' ? getDayOfWeek(currentDate) : 1
    setSlotForm({ day_of_week: dayOfWeek, start_time: '09:00', end_time: '17:00', slot_type: 'working', is_break: false, is_vacation: false, is_emergency_available: false })
    setShowSlotModal(true)
  }

  const handleSlotTypeChange = (type) => {
    setSlotForm(prev => ({
      ...prev,
      slot_type: type,
      is_break: type === 'break',
      is_vacation: type === 'vacation',
      is_emergency_available: type === 'emergency'
    }))
  }

  const dailySlots = useMemo(() => {
    const dow = getDayOfWeek(currentDate)
    return getSlotsForDay(dow, currentDate)
  }, [slots, currentDate])

  const dailyAppointments = useMemo(() => {
    return getAppointmentsForDay(currentDate)
  }, [appointments, currentDate])

  const weekDays = useMemo(() => {
    const start = getWeekStart(currentDate)
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start)
      d.setDate(d.getDate() + i)
      return d
    })
  }, [currentDate])

  const monthDays = useMemo(() => {
    return getMonthDays(currentDate)
  }, [currentDate])

  if (loading) {
    return (
      <DoctorDashboardLayout>
        <Topbar title="Schedule" subtitle="Loading your schedule..." />
        <div className="p-7">
          <div className="flex items-center justify-center py-20">
            <span className="inline-block w-8 h-8 border-2 border-teal border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      </DoctorDashboardLayout>
    )
  }

  const selectedDateLabel = currentDate.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <DoctorDashboardLayout>
      <Topbar title="Schedule" subtitle="Manage your schedule and availability" />

      <div className="p-7 space-y-5">
        {error && (
          <div className="text-red-600 text-center py-3 bg-red-50 rounded-xl border border-red-200 text-sm">{error}</div>
        )}

        {message.text && (
          <div className={`text-center py-3 rounded-xl border text-sm ${message.type === 'success' ? 'bg-green-light text-green border-green-200' : 'bg-red-light text-red border-red-200'}`}>
            {message.text}
          </div>
        )}

        {/* View Switcher and Toolbar */}
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 bg-surface rounded-lg p-1">
              {['daily', 'weekly', 'monthly'].map(mode => (
                <button
                  key={mode}
                  onClick={() => { setViewMode(mode); setCurrentDate(new Date()) }}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors capitalize ${
                    viewMode === mode ? 'bg-navy text-white shadow-sm' : 'text-slate hover:text-navy'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button onClick={() => navigateDate(-1)} className="p-2 rounded-lg border border-border hover:bg-surface transition-colors">
                <ChevronLeft size={18} className="text-slate" />
              </button>
              <button onClick={goToToday} className="px-3 py-2 rounded-lg border border-border text-sm font-medium text-navy hover:bg-surface transition-colors">
                Today
              </button>
              <button onClick={() => navigateDate(1)} className="p-2 rounded-lg border border-border hover:bg-surface transition-colors">
                <ChevronRight size={18} className="text-slate" />
              </button>
              <span className="text-sm font-medium text-navy ml-2">
                {viewMode === 'daily' && currentDate.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
                {viewMode === 'weekly' && `${formatDate(weekDays[0])} - ${formatDate(weekDays[6])}`}
                {viewMode === 'monthly' && `${MONTH_NAMES[currentDate.getMonth()]} ${currentDate.getFullYear()}`}
              </span>
            </div>
          </div>

          {/* Actions Toolbar */}
          <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-border">
            <button onClick={openAddSlot} className="px-4 py-2 bg-teal text-white rounded-lg text-sm font-medium hover:bg-teal/90 transition-colors flex items-center gap-1.5">
              <Plus size={14} /> Add Time Slot
            </button>
            <button onClick={() => setShowBlockModal(true)} className="px-4 py-2 border border-border rounded-lg text-sm font-medium text-slate hover:bg-surface transition-colors flex items-center gap-1.5">
              <Ban size={14} /> Block Date
            </button>
            <button onClick={() => setShowVacationModal(true)} className="px-4 py-2 border border-red-200 text-red rounded-lg text-sm font-medium hover:bg-red hover:text-white transition-colors flex items-center gap-1.5">
              <Shield size={14} /> Vacation Mode
            </button>
            <button onClick={() => { setRepeatTargets([]); setShowRepeatModal(true) }} className="px-4 py-2 border border-border rounded-lg text-sm font-medium text-slate hover:bg-surface transition-colors flex items-center gap-1.5">
              <Repeat size={14} /> Repeat Schedule
            </button>
            <button onClick={() => setShowSlotModal(true)} className="px-4 py-2 border border-indigo-200 text-indigo rounded-lg text-sm font-medium hover:bg-indigo hover:text-white transition-colors flex items-center gap-1.5">
              <Zap size={14} /> Emergency Availability
            </button>
            <button onClick={goToToday} className="px-4 py-2 border border-border rounded-lg text-sm font-medium text-slate hover:bg-surface transition-colors flex items-center gap-1.5">
              <Eye size={14} /> Preview Schedule
            </button>
          </div>
        </div>

        {/* Calendar Views */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          {viewMode === 'daily' && (
            <DailyView
              currentDate={currentDate}
              slots={dailySlots}
              appointments={dailyAppointments}
              onEditSlot={openEditSlot}
              onDeleteSlot={(id) => { setDeletingSlotId(id); setShowConfirmModal(true) }}
              formatTime={formatTime}
              formatTimeRange={formatTimeRange}
              navigate={navigate}
            />
          )}
          {viewMode === 'weekly' && (
            <WeeklyView
              weekDays={weekDays}
              slots={slots}
              appointments={appointments}
              onEditSlot={openEditSlot}
              onDeleteSlot={(id) => { setDeletingSlotId(id); setShowConfirmModal(true) }}
              formatTime={formatTime}
              formatTimeRange={formatTimeRange}
              getSlotsForDay={getSlotsForDay}
              getAppointmentsForDay={getAppointmentsForDay}
              getAvailabilityStatus={getAvailabilityStatus}
            />
          )}
          {viewMode === 'monthly' && (
            <MonthlyView
              monthDays={monthDays}
              currentDate={currentDate}
              slots={slots}
              getAvailabilityStatus={getAvailabilityStatus}
              onEditSlot={openEditSlot}
              onDeleteSlot={(id) => { setDeletingSlotId(id); setShowConfirmModal(true) }}
            />
          )}
        </div>

        {/* Slot Management Panel */}
        <div className="bg-card rounded-xl border border-border p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold text-navy">Time Slots</h3>
            <button onClick={openAddSlot} className="px-3 py-1.5 bg-teal text-white rounded-lg text-xs font-medium hover:bg-teal/90 transition-colors flex items-center gap-1">
              <Plus size={13} /> Add Slot
            </button>
          </div>

          {viewMode === 'daily' && (
            <div className="space-y-2">
              {dailySlots.length === 0 ? (
                <p className="text-sm text-slate-light text-center py-4">No slots scheduled for this day</p>
              ) : (
                dailySlots.map(slot => (
                  <SlotRow
                    key={slot.id}
                    slot={slot}
                    onEdit={() => openEditSlot(slot)}
                    onDelete={() => { setDeletingSlotId(slot.id); setShowConfirmModal(true) }}
                    formatTime={formatTime}
                    formatTimeRange={formatTimeRange}
                  />
                ))
              )}
            </div>
          )}

          {viewMode === 'weekly' && (
            <div className="space-y-4">
              {weekDays.map((day, i) => {
                const daySlots = getSlotsForDay(i, day)
                const dayApts = getAppointmentsForDay(day)
                return (
                  <div key={i} className="border-b border-border last:border-0 pb-4 last:pb-0">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium text-navy">{DAY_NAMES_FULL[i]}</h4>
                      <span className="text-xs text-slate-light">{day.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</span>
                    </div>
                    {daySlots.length === 0 && dayApts.length === 0 ? (
                      <p className="text-xs text-slate-light">No slots or appointments</p>
                    ) : (
                      <div className="space-y-1">
                        {daySlots.map(slot => (
                          <SlotRow
                            key={slot.id}
                            slot={slot}
                            onEdit={() => openEditSlot(slot)}
                            onDelete={() => { setDeletingSlotId(slot.id); setShowConfirmModal(true) }}
                            formatTime={formatTime}
                            formatTimeRange={formatTimeRange}
                          />
                        ))}
                        {dayApts.map(apt => (
                          <div key={`apt-${apt.id}`} className="flex items-center gap-2 text-xs text-blue bg-blue-light/50 rounded-md px-3 py-1.5">
                            <Clock size={12} className="text-blue" />
                            <span className="font-medium text-navy">Appointment #{apt.id}</span>
                            <span className="text-slate-light">{apt.appointment_time || apt.time}</span>
                            <StatusBadge status={apt.status} />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}

          {viewMode === 'monthly' && (
            <div className="space-y-4">
              {monthDays.filter(Boolean).map((day, i) => {
                const dow = getDayOfWeek(day)
                const daySlots = getSlotsForDay(dow, day)
                return (
                  <div key={i} className="border-b border-border last:border-0 pb-4 last:pb-0">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium text-navy">{day.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}</h4>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${SLOT_TYPE_CONFIG[getAvailabilityStatus(dow, day)]?.color || 'bg-gray-light text-gray'}`}>
                        {getAvailabilityStatus(dow, day) === 'working' ? 'Available' : getAvailabilityStatus(dow, day) === 'vacation' ? 'Vacation' : getAvailabilityStatus(dow, day) === 'emergency' ? 'Emergency' : 'No slots'}
                      </span>
                    </div>
                    {daySlots.length === 0 ? (
                      <p className="text-xs text-slate-light">No slots scheduled</p>
                    ) : (
                      <div className="space-y-1">
                        {daySlots.map(slot => (
                          <SlotRow
                            key={slot.id}
                            slot={slot}
                            onEdit={() => openEditSlot(slot)}
                            onDelete={() => { setDeletingSlotId(slot.id); setShowConfirmModal(true) }}
                            formatTime={formatTime}
                            formatTimeRange={formatTimeRange}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="bg-card rounded-xl border border-border p-4">
          <h3 className="text-sm font-medium text-navy mb-3">Legend</h3>
          <div className="flex flex-wrap gap-3">
            {Object.entries(SLOT_TYPE_CONFIG).map(([key, config]) => (
              <div key={key} className="flex items-center gap-2">
                <span className={`w-3 h-3 rounded-sm ${config.bar}`} />
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${config.color}`}>{config.label}</span>
              </div>
            ))}
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-sm bg-blue" />
              <span className="text-xs font-medium text-blue">Appointment</span>
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Slot Modal */}
      {showSlotModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-xl border border-border w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h3 className="font-display font-semibold text-navy">{editingSlot ? 'Edit Time Slot' : 'Add Time Slot'}</h3>
              <button onClick={() => { setShowSlotModal(false); setEditingSlot(null) }} className="p-1 rounded-md hover:bg-surface transition-colors">
                <X size={18} className="text-slate" />
              </button>
            </div>
            <form onSubmit={handleSlotSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate mb-1.5">Day of Week</label>
                <select
                  value={slotForm.day_of_week}
                  onChange={(e) => setSlotForm(prev => ({ ...prev, day_of_week: parseInt(e.target.value) }))}
                  className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-sm text-navy outline-none focus:border-teal"
                >
                  {DAY_NAMES_FULL.map((day, i) => (
                    <option key={i} value={i}>{day}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate mb-1.5">Slot Type</label>
                <div className="grid grid-cols-2 gap-2">
                  {SLOT_TYPES.map(type => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => handleSlotTypeChange(type.value)}
                      className={`px-3 py-2 rounded-lg border-2 text-xs font-medium transition-colors ${
                        slotForm.slot_type === type.value
                          ? `${SLOT_TYPE_CONFIG[type.value].color} border-current`
                          : 'border-border text-slate hover:border-teal/30'
                      }`}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate mb-1.5">Start Time</label>
                  <input
                    type="time"
                    value={slotForm.start_time}
                    onChange={(e) => setSlotForm(prev => ({ ...prev, start_time: e.target.value }))}
                    className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-sm text-navy outline-none focus:border-teal"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate mb-1.5">End Time</label>
                  <input
                    type="time"
                    value={slotForm.end_time}
                    onChange={(e) => setSlotForm(prev => ({ ...prev, end_time: e.target.value }))}
                    className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-sm text-navy outline-none focus:border-teal"
                    required
                  />
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 pt-2">
                <button type="button" onClick={() => { setShowSlotModal(false); setEditingSlot(null) }} className="px-4 py-2 border border-border rounded-lg text-sm text-slate hover:bg-surface transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="px-4 py-2 bg-teal text-white rounded-lg text-sm font-medium hover:bg-teal/90 transition-colors disabled:opacity-50">
                  {submitting ? 'Saving...' : editingSlot ? 'Update Slot' : 'Create Slot'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Block Date Modal */}
      {showBlockModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-xl border border-border w-full max-w-md">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h3 className="font-display font-semibold text-navy">Block Date</h3>
              <button onClick={() => setShowBlockModal(false)} className="p-1 rounded-md hover:bg-surface transition-colors">
                <X size={18} className="text-slate" />
              </button>
            </div>
            <form onSubmit={handleBlockDate} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate mb-1.5">Date to Block</label>
                <input
                  type="date"
                  value={blockForm.date}
                  onChange={(e) => setBlockForm(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-sm text-navy outline-none focus:border-teal"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate mb-1.5">Reason (optional)</label>
                <input
                  type="text"
                  value={blockForm.reason}
                  onChange={(e) => setBlockForm(prev => ({ ...prev, reason: e.target.value }))}
                  placeholder="e.g., Public holiday, Personal leave"
                  className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-sm text-navy placeholder:text-slate-light outline-none focus:border-teal"
                />
              </div>
              <div className="flex items-center justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowBlockModal(false)} className="px-4 py-2 border border-border rounded-lg text-sm text-slate hover:bg-surface transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="px-4 py-2 bg-red text-white rounded-lg text-sm font-medium hover:bg-red/90 transition-colors disabled:opacity-50">
                  {submitting ? 'Blocking...' : 'Block Date'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Vacation Mode Modal */}
      {showVacationModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-xl border border-border w-full max-w-md">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h3 className="font-display font-semibold text-navy">Vacation Mode</h3>
              <button onClick={() => setShowVacationModal(false)} className="p-1 rounded-md hover:bg-surface transition-colors">
                <X size={18} className="text-slate" />
              </button>
            </div>
            <form onSubmit={handleVacationMode} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate mb-1.5">Start Date</label>
                <input
                  type="date"
                  value={vacationForm.start_date}
                  onChange={(e) => setVacationForm(prev => ({ ...prev, start_date: e.target.value }))}
                  className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-sm text-navy outline-none focus:border-teal"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate mb-1.5">End Date</label>
                <input
                  type="date"
                  value={vacationForm.end_date}
                  onChange={(e) => setVacationForm(prev => ({ ...prev, end_date: e.target.value }))}
                  className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-sm text-navy outline-none focus:border-teal"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate mb-1.5">Reason (optional)</label>
                <input
                  type="text"
                  value={vacationForm.reason}
                  onChange={(e) => setVacationForm(prev => ({ ...prev, reason: e.target.value }))}
                  placeholder="e.g., Annual leave"
                  className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-sm text-navy placeholder:text-slate-light outline-none focus:border-teal"
                />
              </div>
              <div className="flex items-center justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowVacationModal(false)} className="px-4 py-2 border border-border rounded-lg text-sm text-slate hover:bg-surface transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="px-4 py-2 bg-red text-white rounded-lg text-sm font-medium hover:bg-red/90 transition-colors disabled:opacity-50">
                  {submitting ? 'Setting...' : 'Enable Vacation Mode'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Repeat Schedule Modal */}
      {showRepeatModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-xl border border-border w-full max-w-md">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h3 className="font-display font-semibold text-navy">Repeat Schedule</h3>
              <button onClick={() => setShowRepeatModal(false)} className="p-1 rounded-md hover:bg-surface transition-colors">
                <X size={18} className="text-slate" />
              </button>
            </div>
            <form onSubmit={handleRepeatSchedule} className="p-5 space-y-4">
              <p className="text-xs text-slate-light">Copy today's schedule (Day {todayDayOfWeek + 1}) to the following days:</p>
              <div className="grid grid-cols-2 gap-2">
                {DAY_NAMES_FULL.map((day, i) => (
                  <label key={i} className={`flex items-center gap-2 p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                    repeatTargets.includes(i) ? 'border-teal bg-teal-light/50' : 'border-border hover:border-teal/30'
                  }`}>
                    <input
                      type="checkbox"
                      checked={repeatTargets.includes(i)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setRepeatTargets(prev => [...prev, i])
                        } else {
                          setRepeatTargets(prev => prev.filter(d => d !== i))
                        }
                      }}
                      className="rounded border-border text-teal focus:ring-teal"
                    />
                    <span className="text-sm text-navy">{day}</span>
                  </label>
                ))}
              </div>
              <div className="flex items-center justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowRepeatModal(false)} className="px-4 py-2 border border-border rounded-lg text-sm text-slate hover:bg-surface transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={submitting || repeatTargets.length === 0} className="px-4 py-2 bg-teal text-white rounded-lg text-sm font-medium hover:bg-teal/90 transition-colors disabled:opacity-50">
                  {submitting ? 'Copying...' : 'Copy Schedule'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-xl border border-border w-full max-w-sm">
            <div className="p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-red-light flex items-center justify-center">
                  <AlertTriangle size={20} className="text-red" />
                </div>
                <h3 className="font-display font-semibold text-navy">Delete Time Slot</h3>
              </div>
              <p className="text-sm text-slate-light mb-5">Are you sure you want to delete this time slot? This action cannot be undone.</p>
              <div className="flex items-center justify-end gap-3">
                <button onClick={() => { setShowConfirmModal(false); setDeletingSlotId(null) }} className="px-4 py-2 border border-border rounded-lg text-sm text-slate hover:bg-surface transition-colors">
                  Cancel
                </button>
                <button onClick={handleDeleteSlot} className="px-4 py-2 bg-red text-white rounded-lg text-sm font-medium hover:bg-red/90 transition-colors">
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DoctorDashboardLayout>
  )
}

function DailyView({ currentDate, slots, appointments, onEditSlot, onDeleteSlot, formatTime, formatTimeRange, navigate }) {
  const timeSlots = Array.from({ length: 48 }, (_, i) => {
    const hour = Math.floor(i / 2)
    const minute = (i % 2) * 30
    return {
      label: `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`,
      hour,
      minute,
      isHour: minute === 0
    }
  })

  const getSlotBlocks = () => {
    const blocks = []
    const startHour = 0
    const endHour = 24
    for (let h = startHour; h < endHour; h++) {
      for (let m = 0; m < 60; m += 30) {
        const timeLabel = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`
        const slot = slots.find(s => {
          const start = s.start_time?.slice(0, 5)
          const end = s.end_time?.slice(0, 5)
          if (!start || !end) return false
          if (timeLabel < start || timeLabel >= end) return false
          return true
        })
        if (slot && !blocks.find(b => b.timeLabel === timeLabel)) {
          const start = slot.start_time?.slice(0, 5) || '00:00'
          const end = slot.end_time?.slice(0, 5) || '23:59'
          const [sh, sm] = start.split(':').map(Number)
          const [eh, em] = end.split(':').map(Number)
          const durationMinutes = (eh * 60 + em) - (sh * 60 + sm)
          const height = Math.max((durationMinutes / 30) * 28, 28)
          blocks.push({ ...slot, timeLabel: start, height, duration: durationMinutes })
        }
      }
    }
    return blocks
  }

  const slotBlocks = getSlotBlocks()

  return (
    <div className="relative">
      <div className="flex border-b border-border">
        <div className="w-16 shrink-0" />
        <div className="flex-1 text-center py-3">
          <p className="text-sm font-medium text-navy">{currentDate.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
        </div>
      </div>
      <div className="relative min-h-[600px]">
        {timeSlots.map((slot, i) => (
          <div
            key={slot.label}
            className={`flex border-b border-border/50 ${slot.isHour ? 'bg-surface/30' : 'bg-transparent'}`}
            style={{ height: 28 }}
          >
            <div className="w-16 shrink-0 flex items-start justify-end pr-2 pt-0.5">
              {slot.isHour && <span className="text-[10px] text-slate-light">{slot.hour % 12 || 12}{slot.hour >= 12 ? ' PM' : ' AM'}</span>}
            </div>
            <div className="flex-1 relative" />
          </div>
        ))}

        {slotBlocks.map((block, i) => {
          const [startH, startM] = block.timeLabel.split(':').map(Number)
          const topOffset = (startH * 60 + startM) / 30 * 28
          const config = SLOT_TYPE_CONFIG[block.is_vacation ? 'vacation' : block.is_break ? 'break' : block.is_emergency_available ? 'emergency' : 'working']
          return (
            <div
              key={block.id}
              className={`absolute left-16 right-0 ${config.bg} border-l-4 ${config.bar} rounded-r-md mx-2 flex items-center justify-between px-3 group cursor-pointer hover:brightness-95`}
              style={{ top: topOffset, height: Math.max(block.height - 4, 28) }}
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-xs font-medium text-navy truncate">{formatTimeRange(block.timeLabel, block.end_time?.slice(0, 5))}</span>
                <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${config.color}`}>{config.label}</span>
              </div>
              <div className="hidden group-hover:flex items-center gap-1">
                <button onClick={() => onEditSlot(block)} className="p-1 rounded hover:bg-white/50 transition-colors">
                  <MoreVertical size={12} className="text-navy" />
                </button>
              </div>
            </div>
          )
        })}

        {appointments?.length > 0 && (
          <div className="absolute left-16 right-0 top-0 pointer-events-none">
            {appointments.map((apt) => {
              const [h, m] = (apt.appointment_time || '00:00').split(':').map(Number)
              const topOffset = (h * 60 + m) / 30 * 28
              return (
                <div
                  key={apt.id}
                  className="absolute left-2 right-2 bg-blue-light/80 border-l-4 border-blue rounded-r-md px-3 py-1.5 pointer-events-auto cursor-pointer hover:brightness-95"
                  style={{ top: topOffset, height: 28 }}
                  onClick={() => navigate(`/doctor/consultation?appointment_id=${apt.id}`)}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-blue truncate">Appointment #{apt.id}</span>
                    <StatusBadge status={apt.status} />
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

function WeeklyView({ weekDays, slots, appointments, onEditSlot, onDeleteSlot, formatTime, formatTimeRange, getSlotsForDay, getAppointmentsForDay, getAvailabilityStatus }) {
  const timeSlots = Array.from({ length: 24 }, (_, i) => {
    const period = i >= 12 ? 'PM' : 'AM'
    const hour12 = i % 12 || 12
    return { label: `${hour12} ${period}`, hour: i }
  })

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[700px]">
        <div className="flex border-b border-border">
          <div className="w-16 shrink-0" />
          {weekDays.map((day, i) => (
            <div key={i} className="flex-1 text-center py-3 border-l border-border last:border-r">
              <p className="text-[10px] font-medium text-slate uppercase">{DAY_NAMES[i]}</p>
              <p className="text-sm font-medium text-navy mt-0.5">{day.getDate()}</p>
            </div>
          ))}
        </div>
        <div className="relative">
          {timeSlots.map((slot, i) => (
            <div key={slot.label} className="flex border-b border-border/50">
              <div className="w-16 shrink-0 flex items-start justify-end pr-2 pt-1">
                <span className="text-[10px] text-slate-light">{slot.label}</span>
              </div>
              {weekDays.map((day, j) => (
                <div key={j} className="flex-1 border-l border-border last:border-r h-8 relative hover:bg-surface/30 transition-colors">
                  {Array.from({ length: 2 }).map((_, k) => (
                    <div key={k} className="absolute left-0 right-0 border-t border-border/30" style={{ top: k === 0 ? 0 : 14 }} />
                  ))}
                </div>
              ))}
            </div>
          ))}
          {weekDays.map((day, j) => {
            const daySlots = getSlotsForDay(j, day)
            const dayApts = getAppointmentsForDay(day)
            return (
              <div key={j} className="flex">
                <div className="w-16 shrink-0" />
                <div className="flex-1 relative border-l border-border last:border-r" style={{ height: timeSlots.length * 32 }}>
                  {daySlots.map(slot => {
                    const start = slot.start_time?.slice(0, 5) || '00:00'
                    const end = slot.end_time?.slice(0, 5) || '23:59'
                    const [sh, sm] = start.split(':').map(Number)
                    const [eh, em] = end.split(':').map(Number)
                    const top = (sh * 60 + sm) / 60 * 32
                    const height = Math.max(((eh * 60 + em) - (sh * 60 + sm)) / 60 * 32, 16)
                    const config = SLOT_TYPE_CONFIG[slot.is_vacation ? 'vacation' : slot.is_break ? 'break' : slot.is_emergency_available ? 'emergency' : 'working']
                    return (
                      <div
                        key={slot.id}
                        className={`absolute left-1 right-1 ${config.bg} ${config.bar} rounded-r-sm px-2 flex items-center cursor-pointer hover:brightness-95 z-10`}
                        style={{ top, height }}
                        onClick={() => onEditSlot(slot)}
                      >
                        <span className="text-[10px] font-medium text-navy truncate">{config.label}</span>
                      </div>
                    )
                  })}
                  {dayApts.map(apt => {
                    const [h, m] = (apt.appointment_time || '00:00').split(':').map(Number)
                    const top = (h * 60 + m) / 60 * 32
                    return (
                      <div
                        key={`apt-${apt.id}`}
                        className="absolute left-1 right-1 bg-blue-light/80 border-l-4 border-blue rounded-r-sm px-2 py-1 cursor-pointer hover:brightness-95 z-20"
                        style={{ top, height: 28 }}
                        onClick={() => navigate(`/doctor/consultation?appointment_id=${apt.id}`)}
                      >
                        <span className="text-[10px] font-medium text-blue truncate block">#{apt.id}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function MonthlyView({ monthDays, currentDate, slots, getAvailabilityStatus, onEditSlot, onDeleteSlot }) {
  return (
    <div>
      <div className="grid grid-cols-7 border-b border-border">
        {DAY_NAMES.map(day => (
          <div key={day} className="text-center py-2 border-r border-border last:border-r-0">
            <span className="text-[10px] font-medium text-slate uppercase">{day}</span>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {monthDays.map((day, i) => {
          if (!day) {
            return <div key={`empty-${i}`} className="min-h-[80px] border-r border-b border-border bg-surface/30" />
          }
          const dow = getDayOfWeek(day)
          const status = getAvailabilityStatus(dow, day)
          const isToday = isSameDay(day, new Date())
          const config = SLOT_TYPE_CONFIG[status] || { color: 'bg-gray-light text-gray', bar: 'bg-gray' }
          return (
            <div
              key={i}
              className={`min-h-[80px] border-r border-b border-border p-2 hover:bg-surface/50 transition-colors cursor-pointer ${isToday ? 'bg-teal-light/30' : ''}`}
              onClick={() => {
                setCurrentDate(day)
                setViewMode('daily')
              }}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={`text-xs font-medium ${isToday ? 'text-teal' : 'text-navy'}`}>{day.getDate()}</span>
                <span className={`w-2 h-2 rounded-full ${config.bar}`} title={config.label} />
              </div>
              <div className="space-y-0.5">
                {status === 'vacation' && (
                  <span className="text-[10px] font-medium text-red px-1.5 py-0.5 bg-red-light/50 rounded-full">Vacation</span>
                )}
                {status === 'emergency' && (
                  <span className="text-[10px] font-medium text-indigo px-1.5 py-0.5 bg-indigo-light/50 rounded-full">Emergency</span>
                )}
                {status === 'working' && (
                  <span className="text-[10px] font-medium text-teal px-1.5 py-0.5 bg-teal-light/50 rounded-full">Working</span>
                )}
                {status === 'break' && (
                  <span className="text-[10px] font-medium text-yellow px-1.5 py-0.5 bg-yellow-light/50 rounded-full">Break</span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function SlotRow({ slot, onEdit, onDelete, formatTime, formatTimeRange }) {
  const config = SLOT_TYPE_CONFIG[slot.is_vacation ? 'vacation' : slot.is_break ? 'break' : slot.is_emergency_available ? 'emergency' : 'working']
  return (
    <div className={`flex items-center justify-between p-3 rounded-lg border ${config.bg} border-current/20`}>
      <div className="flex items-center gap-3 min-w-0">
        <span className={`w-1 h-8 rounded-full ${config.bar} shrink-0`} />
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${config.color}`}>{config.label}</span>
            <span className="text-sm font-medium text-navy">{formatTimeRange(slot.start_time, slot.end_time)}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <button onClick={onEdit} className="p-1.5 rounded-md text-slate hover:text-teal hover:bg-teal-light transition-colors" title="Edit">
          <MoreVertical size={14} />
        </button>
        <button onClick={onDelete} className="p-1.5 rounded-md text-slate hover:text-red hover:bg-red-light transition-colors" title="Delete">
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  )
}
