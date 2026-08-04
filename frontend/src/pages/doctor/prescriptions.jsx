import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Search, Plus, Edit3, Trash2, Download, Printer, Send, X, Save, Pill } from 'lucide-react'
import Topbar from '../../components/layout/topbar'
import DoctorDashboardLayout from '../../components/layout/doctor-dashboard-layout'
import { fetchDoctorPrescriptions, createDoctorPrescription, updateDoctorPrescription, cancelPrescription } from '../../services/api'

const EMPTY_RX = {
  patient_id: '',
  medicine: '',
  strength: '',
  dosage: '',
  frequency: '',
  duration: '',
  instructions: ''
}

export default function DoctorPrescriptionsPage() {
  const [prescriptions, setPrescriptions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingRx, setEditingRx] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [form, setForm] = useState(EMPTY_RX)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadPrescriptions()
  }, [searchQuery])

  async function loadPrescriptions() {
    setLoading(true)
    try {
      const data = await fetchDoctorPrescriptions(searchQuery)
      setPrescriptions(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err.message || 'Failed to load prescriptions')
    } finally {
      setLoading(false)
    }
  }

  const openCreateModal = () => {
    setEditingRx(null)
    setForm(EMPTY_RX)
    setModalOpen(true)
  }

  const openEditModal = (rx) => {
    setEditingRx(rx)
    setForm({
      patient_id: rx.patient_id || '',
      medicine: rx.medicine || rx.medication || '',
      strength: rx.strength || '',
      dosage: rx.dosage || '',
      frequency: rx.frequency || '',
      duration: rx.duration || '',
      instructions: rx.instructions || rx.notes || ''
    })
    setModalOpen(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = {
        patient_id: form.patient_id,
        medicine: form.medicine,
        strength: form.strength,
        dosage: form.dosage,
        frequency: form.frequency,
        duration: form.duration,
        instructions: form.instructions
      }
      if (editingRx) {
        await updateDoctorPrescription(editingRx.id, payload)
      } else {
        await createDoctorPrescription(payload)
      }
      setModalOpen(false)
      setForm(EMPTY_RX)
      loadPrescriptions()
    } catch (err) {
      console.error('Failed to save prescription:', err)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteConfirm) return
    try {
      await cancelPrescription(deleteConfirm.id)
      setDeleteConfirm(null)
      loadPrescriptions()
    } catch (err) {
      console.error('Failed to delete prescription:', err)
    }
  }

  const handlePrint = (rx) => {
    const printWindow = window.open('', '_blank')
    printWindow.document.write(`
      <html>
        <head><title>Prescription #${rx.id}</title></head>
        <body>
          <h1>Prescription</h1>
          <p><strong>Prescription ID:</strong> ${rx.id}</p>
          <p><strong>Patient:</strong> ${rx.patient?.name || rx.patient_name || 'N/A'}</p>
          <p><strong>Medicine:</strong> ${rx.medicine || rx.medication || 'N/A'}</p>
          <p><strong>Strength:</strong> ${rx.strength || 'N/A'}</p>
          <p><strong>Dosage:</strong> ${rx.dosage || 'N/A'}</p>
          <p><strong>Frequency:</strong> ${rx.frequency || 'N/A'}</p>
          <p><strong>Duration:</strong> ${rx.duration || 'N/A'}</p>
          <p><strong>Instructions:</strong> ${rx.instructions || rx.notes || 'N/A'}</p>
        </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.print()
  }

  const handleSendToPharmacy = (rx) => {
    alert(`Prescription #${rx.id} sent to pharmacy.`)
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A'
    try {
      return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    } catch {
      return dateStr
    }
  }

  return (
    <DoctorDashboardLayout>
      <Topbar title="Prescriptions" subtitle="Manage and track prescriptions" />

      <div className="p-7 space-y-5">
        {/* Search and Add */}
        <div className="bg-card rounded-xl border border-border p-4">
          <form onSubmit={(e) => { e.preventDefault() }} className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-light" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search prescriptions..."
                className="w-full pl-9 pr-4 py-2 bg-surface border border-border rounded-lg text-sm text-navy placeholder:text-slate-light outline-none focus:border-teal"
              />
            </div>
            <button onClick={openCreateModal} className="px-4 py-2 bg-teal text-white rounded-lg text-sm font-medium hover:bg-teal/90 transition-colors flex items-center gap-1.5 justify-center">
              <Plus size={14} />Add Prescription
            </button>
          </form>
        </div>

        {error && (
          <div className="text-red-600 text-center py-5 bg-red-50 rounded-xl border border-red-200">{error}</div>
        )}

        {/* Prescriptions List */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <span className="inline-block w-8 h-8 border-2 border-teal border-t-transparent rounded-full animate-spin" />
          </div>
        ) : prescriptions.length === 0 ? (
          <div className="bg-card rounded-xl border border-border p-10 text-center">
            <Pill className="w-16 h-16 mx-auto mb-4 text-slate-light opacity-40" />
            <p className="text-lg font-medium text-navy mb-1">No prescriptions found</p>
            <p className="text-sm text-slate-light">Create a new prescription to get started.</p>
          </div>
        ) : (
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-surface border-b border-border">
                  <tr>
                    <th className="px-4 py-3 text-xs font-semibold text-slate uppercase tracking-wider">ID</th>
                    <th className="px-4 py-3 text-xs font-semibold text-slate uppercase tracking-wider">Patient</th>
                    <th className="px-4 py-3 text-xs font-semibold text-slate uppercase tracking-wider">Medicine</th>
                    <th className="px-4 py-3 text-xs font-semibold text-slate uppercase tracking-wider">Dosage</th>
                    <th className="px-4 py-3 text-xs font-semibold text-slate uppercase tracking-wider">Frequency</th>
                    <th className="px-4 py-3 text-xs font-semibold text-slate uppercase tracking-wider">Date</th>
                    <th className="px-4 py-3 text-xs font-semibold text-slate uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {prescriptions.map((rx) => (
                    <tr key={rx.id} className="hover:bg-surface/50 transition-colors">
                      <td className="px-4 py-3 text-sm text-slate">#{rx.id}</td>
                      <td className="px-4 py-3 text-sm text-navy font-medium">{rx.patient?.name || rx.patient_name || 'N/A'}</td>
                      <td className="px-4 py-3 text-sm text-navy">{rx.medicine || rx.medication || 'N/A'}</td>
                      <td className="px-4 py-3 text-sm text-slate">{rx.dosage || 'N/A'}</td>
                      <td className="px-4 py-3 text-sm text-slate">{rx.frequency || 'N/A'}</td>
                      <td className="px-4 py-3 text-sm text-slate">{formatDate(rx.created_at)}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => openEditModal(rx)} className="p-1.5 rounded-md text-slate hover:text-teal hover:bg-teal-light transition-colors" title="Edit">
                            <Edit3 size={14} />
                          </button>
                          <button onClick={() => handlePrint(rx)} className="p-1.5 rounded-md text-slate hover:text-blue hover:bg-blue-light transition-colors" title="Print">
                            <Printer size={14} />
                          </button>
                          <button onClick={() => handleSendToPharmacy(rx)} className="p-1.5 rounded-md text-slate hover:text-green hover:bg-green-light transition-colors" title="Send to Pharmacy">
                            <Send size={14} />
                          </button>
                          <button onClick={() => setDeleteConfirm(rx)} className="p-1.5 rounded-md text-slate hover:text-red hover:bg-red-light transition-colors" title="Delete">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-xl border border-border w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h3 className="font-display font-semibold text-lg text-navy">{editingRx ? 'Edit Prescription' : 'Add Prescription'}</h3>
              <button onClick={() => setModalOpen(false)} className="p-1.5 rounded-md text-slate hover:text-red hover:bg-red-light transition-colors">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-navy mb-1">Patient ID</label>
                  <input
                    type="text"
                    value={form.patient_id}
                    onChange={(e) => setForm({ ...form, patient_id: e.target.value })}
                    className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-sm text-navy outline-none focus:border-teal"
                    placeholder="Patient ID"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-navy mb-1">Medicine *</label>
                  <input
                    type="text"
                    value={form.medicine}
                    onChange={(e) => setForm({ ...form, medicine: e.target.value })}
                    className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-sm text-navy outline-none focus:border-teal"
                    placeholder="Medicine name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-navy mb-1">Strength</label>
                  <input
                    type="text"
                    value={form.strength}
                    onChange={(e) => setForm({ ...form, strength: e.target.value })}
                    className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-sm text-navy outline-none focus:border-teal"
                    placeholder="e.g., 500mg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-navy mb-1">Dosage</label>
                  <input
                    type="text"
                    value={form.dosage}
                    onChange={(e) => setForm({ ...form, dosage: e.target.value })}
                    className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-sm text-navy outline-none focus:border-teal"
                    placeholder="e.g., 1 tablet"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-navy mb-1">Frequency</label>
                  <input
                    type="text"
                    value={form.frequency}
                    onChange={(e) => setForm({ ...form, frequency: e.target.value })}
                    className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-sm text-navy outline-none focus:border-teal"
                    placeholder="e.g., Twice daily"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-navy mb-1">Duration</label>
                  <input
                    type="text"
                    value={form.duration}
                    onChange={(e) => setForm({ ...form, duration: e.target.value })}
                    className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-sm text-navy outline-none focus:border-teal"
                    placeholder="e.g., 7 days"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-navy mb-1">Instructions</label>
                <textarea
                  value={form.instructions}
                  onChange={(e) => setForm({ ...form, instructions: e.target.value })}
                  className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-sm text-navy outline-none focus:border-teal"
                  rows={3}
                  placeholder="Special instructions for the patient"
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-3">
                <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 border border-border rounded-lg text-sm text-slate hover:bg-surface transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="px-4 py-2 bg-teal text-white rounded-lg text-sm font-medium hover:bg-teal/90 transition-colors disabled:opacity-50 flex items-center gap-1.5">
                  <Save size={14} />{saving ? 'Saving...' : 'Save Prescription'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-xl border border-border w-full max-w-md p-6">
            <h3 className="font-display font-semibold text-lg text-navy mb-2">Delete Prescription</h3>
            <p className="text-sm text-slate mb-5">Are you sure you want to delete this prescription? This action cannot be undone.</p>
            <div className="flex items-center justify-end gap-2">
              <button onClick={() => setDeleteConfirm(null)} className="px-4 py-2 border border-border rounded-lg text-sm text-slate hover:bg-surface transition-colors">
                Cancel
              </button>
              <button onClick={handleDelete} className="px-4 py-2 bg-red text-white rounded-lg text-sm font-medium hover:bg-red/90 transition-colors">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </DoctorDashboardLayout>
  )
}
