import { useState, useEffect } from 'react'
import StaffDashboardLayout from '../components/layout/staff-dashboard-layout'
import Topbar from '../components/layout/topbar'
import { useAuth } from '../context/auth-context'
import { fetchStaffTasks } from '../services/api'

export default function StaffTasksPage() {
  const { isAuthenticated } = useAuth()
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadTasks() {
      setLoading(true)
      try {
        const data = await fetchStaffTasks()
        setTasks(data.tasks || [])
      } catch (err) {
        console.error('Failed to load tasks:', err)
        setError('Failed to load tasks')
      } finally {
        setLoading(false)
      }
    }
    loadTasks()
  }, [])

  if (!isAuthenticated) {
    return (
      <StaffDashboardLayout>
        <Topbar title="Staff Dashboard" subtitle="" />
        <div className="p-7">
          <div className="text-center py-20">
            <p className="text-navy mb-4">Please log in to view tasks</p>
          </div>
        </div>
      </StaffDashboardLayout>
    )
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Waiting': return 'bg-yellow/20 text-yellow'
      case 'Checked In': return 'bg-blue/20 text-blue'
      case 'Called': return 'bg-teal/20 text-teal'
      case 'With Doctor': return 'bg-purple/20 text-purple'
      case 'Completed': return 'bg-green/20 text-green'
      default: return 'bg-slate/10 text-slate'
    }
  }

  const getPriorityColor = (priority) => {
    return priority === 'high' ? 'text-red' : 'text-slate'
  }

  return (
    <StaffDashboardLayout>
      <Topbar title="Tasks" subtitle="Manage pending tasks" />
      <div className="p-7">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <span className="inline-block w-10 h-10 border-3 border-teal border-t-transparent rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="text-red-600 text-center py-10">{error}</div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-20 text-slate-light">
            <p>No tasks pending</p>
          </div>
        ) : (
          <div className="space-y-3">
            {tasks.map(task => (
              <div key={task.id} className="bg-card rounded-lg border border-border p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-teal flex items-center justify-center text-white font-semibold text-sm">
                      {task.type?.[0]?.toUpperCase() || 'T'}
                    </div>
                    <div>
                      <h3 className="font-display font-semibold text-navy">{task.title || task.description}</h3>
                      <p className="text-[12px] text-slate-light">
                        {task.description || task.title}
                      </p>
                      {task.patient_name && (
                        <p className="text-[12px] text-slate-light">
                          Patient: {task.patient_name}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 items-end">
                    {task.status && (
                      <span className={`px-3 py-1 rounded-full text-[11px] font-medium ${getStatusColor(task.status)}`}>
                        {task.status}
                      </span>
                    )}
                    {task.priority && (
                      <span className={`text-[11px] font-medium ${getPriorityColor(task.priority)}`}>
                        {task.priority === 'high' ? 'High Priority' : 'Normal'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </StaffDashboardLayout>
  )
}