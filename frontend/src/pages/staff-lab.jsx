import { useState, useEffect } from 'react'
import { Microscope, Search, Check, X, FileText } from 'lucide-react'
import StaffDashboardLayout from '../components/layout/staff-dashboard-layout'
import Topbar from '../components/layout/topbar'
import { useAuth } from '../context/auth-context'

export default function StaffLabPage() {
  const { isAuthenticated } = useAuth()
  const [labOrders, setLabOrders] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadLabOrders() {
      setLoading(true)
      try {
        const mockOrders = [
          { id: 1, patient: 'John Mwangi', test: 'Blood Sugar', status: 'Pending', date: '2024-01-15' },
          { id: 2, patient: 'Mary Wanjiku', test: 'X-Ray', status: 'Completed', result: 'Normal', date: '2024-01-14' },
          { id: 3, patient: 'David Otieno', test: 'Urine Analysis', status: 'Pending', date: '2024-01-15' },
        ]
        setLabOrders(mockOrders)
      } catch (err) {
        console.error('Failed to load lab orders:', err)
      } finally {
        setLoading(false)
      }
    }
    loadLabOrders()
  }, [])

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'bg-yellow/20 text-yellow'
      case 'In Progress': return 'bg-blue/20 text-blue'
      case 'Completed': return 'bg-green/20 text-green'
      case 'Cancelled': return 'bg-red/20 text-red'
      default: return 'bg-slate/10 text-slate'
    }
  }

  if (!isAuthenticated) {
    return (
      <StaffDashboardLayout>
        <Topbar title="Staff Dashboard" subtitle="" />
        <div className="p-7">
          <div className="text-center py-20">
            <p className="text-navy mb-4">Please log in to access lab system</p>
          </div>
        </div>
      </StaffDashboardLayout>
    )
  }

  return (
    <StaffDashboardLayout>
      <Topbar title="Laboratory" subtitle="Manage lab orders and results" />
      <div className="p-7">
        <div className="mb-5">
          <div className="relative max-w-md">
            <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-light" />
            <input
              type="text"
              placeholder="Search by patient or test name..."
              className="w-full pl-12 pr-4 py-3 bg-card border border-border rounded-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <span className="inline-block w-10 h-10 border-3 border-teal border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="space-y-3">
            {labOrders.map(order => (
              <div key={order.id} className="bg-card rounded-lg border border-border p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-teal flex items-center justify-center text-white font-semibold">
                      <Microscope size={18} />
                    </div>
                    <div>
                      <h3 className="font-medium text-navy">{order.patient}</h3>
                      <p className="text-[13px] text-slate-light">{order.test}</p>
                      {order.result && <p className="text-[12px] text-slate-light">Result: {order.result}</p>}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-[11px] font-medium ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                    {order.status === 'Pending' && (
                      <div className="flex gap-1">
                        <button className="p-1 bg-blue/20 text-blue rounded">
                          <Check size={16} />
                        </button>
                        <button className="p-1 bg-red/20 text-red rounded">
                          <X size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {labOrders.length === 0 && (
              <div className="text-center py-20 text-slate-light">
                <Microscope size={40} className="mx-auto mb-2" />
                <p>No lab orders found</p>
              </div>
            )}
          </div>
        )}
      </div>
    </StaffDashboardLayout>
  )
}