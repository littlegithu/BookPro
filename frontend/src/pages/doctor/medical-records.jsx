import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Search, Plus, Edit3, Trash2, Download, Printer, FileText, X, Save } from 'lucide-react'
import Topbar from '../../components/layout/topbar'
import DoctorDashboardLayout from '../../components/layout/doctor-dashboard-layout'
import { fetchDoctorMedicalRecords, createDoctorMedicalRecord, updateDoctorMedicalRecord, deleteDoctorMedicalRecord } from '../../services/api'

const EMPTY_RECORD = {
  patient_id: '',
  diagnosis: '',
  symptoms: '',
  treatment: '',
  prescription: '',
  doctor_notes: '',
  follow_up_date: '',
  attachments: ''
}

export default function DoctorMedicalRecordsPage() {
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingRecord, setEditingRecord] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [form, setForm] = useState(EMPTY_RECORD)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadRecords()
  }, [searchQuery])

  async function loadRecords() {
    setLoading(true)
    try {
      const data = await fetchDoctorMedicalRecords(searchQuery)
      setRecords(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err.message || 'Failed to load medical records')
    } finally {
      setLoading(false)
    }
  }

  const openCreateModal = () => {
    setEditingRecord(null)
    setForm(EMPTY_RECORD)
    setModalOpen(true)
  }

  const openEditModal = (record) => {
    setEditingRecord(record)
    setForm({
      patient_id: record.patient_id || '',
      diagnosis: record.diagnosis || '',
      symptoms: record.symptoms || '',
      treatment: record.treatment || '',
      prescription: record.prescription || '',
      doctor_notes: record.doctor_notes || '',
      follow_up_date: record.follow_up_date || '',
      attachments: record.attachments || ''
    })
    setModalOpen(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (editingRecord) {
        await updateDoctorMedicalRecord(editingRecord.id, form)
      } else {
        await createDoctorMedicalRecord(form)
      }
      setModalOpen(false)
      setForm(EMPTY_RECORD)
      loadRecords()
    } catch (err) {
      console.error('Failed to save medical record:', err)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteConfirm) return
    try {
      await deleteDoctorMedicalRecord(deleteConfirm.id)
      setDeleteConfirm(null)
      loadRecords()
    } catch (err) {
      console.error('Failed to delete medical record:', err)
    }
  }

  const handlePrint = (record) => {
    const printWindow = window.open('', '_blank')
    printWindow.document.write(`
      <html>
        <head><title>Medical Record #${record.id}</title></head>
        <body>
          <h1>Medical Record</h1>
          <p><strong>Record ID:</strong> ${record.id}</p>
          <p><strong>Patient:</strong> ${record.patient?.name || record.patient_name || 'N/A'}</p>
          <p><strong>Diagnosis:</strong> ${record.diagnosis || 'N/A'}</p>
          <p><strong>Symptoms:</strong> ${record.symptoms || 'N/A'}</p>
          <p><strong>Treatment:</strong> ${record.treatment || 'N/A'}</p>
          <p><strong>Prescription:</strong> ${record.prescription || 'N/A'}</p>
          <p><strong>Doctor Notes:</strong> ${record.doctor_notes || 'N/A'}</p>
          <p><strong>Follow-up Date:</strong> ${record.follow_up_date || 'N/A'}</p>
        </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.print()
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
      <Topbar title="Medical Records" subtitle="View and manage medical records" />

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
                placeholder="Search medical records..."
                className="w-full pl-9 pr-4 py-2 bg-surface border border-border rounded-lg text-sm text-navy placeholder:text-slate-light outline-none focus:border-teal"
              />
            </div>
            <button onClick={openCreateModal} className="px-4 py-2 bg-teal text-white rounded-lg text-sm font-medium hover:bg-teal/90 transition-colors flex items-center gap-1.5 justify-center">
              <Plus size={14} />Add Record
            </button>
          </form>
        </div>

        {error && (
          <div className="text-red-600 text-center py-5 bg-red-50 rounded-xl border border-red-200">{error}</div>
        )}

        {/* Records List */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <span className="inline-block w-8 h-8 border-2 border-teal border-t-transparent rounded-full animate-spin" />
          </div>
        ) : records.length === 0 ? (
          <div className="bg-card rounded-xl border border-border p-10 text-center">
            <FileText className="w-16 h-16 mx-auto mb-4 text-slate-light opacity-40" />
            <p className="text-lg font-medium text-navy mb-1">No medical records</p>
            <p className="text-sm text-slate-light">Create your first medical record to get started.</p>
          </div>
        ) : (
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-surface border-b border-border">
                  <tr>
                    <th className="px-4 py-3 text-xs font-semibold text-slate uppercase tracking-wider">ID</th>
                    <th className="px-4 py-3 text-xs font-semibold text-slate uppercase tracking-wider">Patient</th>
                    <th className="px-4 py-3 text-xs font-semibold text-slate uppercase tracking-wider">Diagnosis</th>
                    <th className="px-4 py-3 text-xs font-semibold text-slate uppercase tracking-wider">Date</th>
                    <th className="px-4 py-3 text-xs font-semibold text-slate uppercase tracking-wider">Follow-up</th>
                    <th className="px-4 py-3 text-xs font-semibold text-slate uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {records.map((record) => (
                    <tr key={record.id} className="hover:bg-surface/50 transition-colors">
                      <td className="px-4 py-3 text-sm text-slate">#{record.id}</td>
                      <td className="px-4 py-3 text-sm text-navy font-medium">{record.patient?.name || record.patient_name || 'N/A'}</td>
                      <td className="px-4 py-3 text-sm text-slate max-w-[200px] truncate">{record.diagnosis || 'N/A'}</td>
                      <td className="px-4 py-3 text-sm text-slate">{formatDate(record.created_at)}</td>
                      <td className="px-4 py-3 text-sm text-slate">{formatDate(record.follow_up_date)}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => openEditModal(record)} className="p-1.5 rounded-md text-slate hover:text-teal hover:bg-teal-light transition-colors" title="Edit">
                            <Edit3 size={14} />
                          </button>
                          <button onClick={() => handlePrint(record)} className="p-1.5 rounded-md text-slate hover:text-blue hover:bg-blue-light transition-colors" title="Print">
                            <Printer size={14} />
                          </button>
                          <button onClick={() => setDeleteConfirm(record)} className="p-1.5 rounded-md text-slate hover:text-red hover:bg-red-light transition-colors" title="Delete">
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
              <h3 className="font-display font-semibold text-lg text-navy">{editingRecord ? 'Edit Medical Record' : 'Add Medical Record'}</h3>
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
                  <label className="block text-xs font-medium text-navy mb-1">Follow-up Date</label>
                  <input
                    type="date"
                    value={form.follow_up_date}
                    onChange={(e) => setForm({ ...form, follow_up_date: e.target.value })}
                    className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-sm text-navy outline-none focus:border-teal"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-navy mb-1">Diagnosis *</label>
                <textarea
                  value={form.diagnosis}
                  onChange={(e) => setForm({ ...form, diagnosis: e.target.value })}
                  className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-sm text-navy outline-none focus:border-teal"
                  rows={2}
                  placeholder="Primary diagnosis"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-navy mb-1">Symptoms</label>
                <textarea
                  value={form.symptoms}
                  onChange={(e) => setForm({ ...form, symptoms: e.target.value })}
                  className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-sm text-navy outline-none focus:border-teal"
                  rows={3}
                  placeholder="Patient symptoms"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-navy mb-1">Treatment</label>
                <textarea
                  value={form.treatment}
                  onChange={(e) => setForm({ ...form, treatment: e.target.value })}
                  className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-sm text-navy outline-none focus:border-teal"
                  rows={3}
                  placeholder="Treatment plan"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-navy mb-1">Prescription</label>
                <textarea
                  value={form.prescription}
                  onChange={(e) => setForm({ ...form, prescription: e.target.value })}
                  className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-sm text-navy outline-none focus:border-teal"
                  rows={2}
                  placeholder="Prescribed medications"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-navy mb-1">Doctor Notes</label>
                <textarea
                  value={form.doctor_notes}
                  onChange={(e) => setForm({ ...form, doctor_notes: e.target.value })}
                  className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-sm text-navy outline-none focus:border-teal"
                  rows={3}
                  placeholder="Additional notes"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-navy mb-1">Attachments</label>
                <input
                  type="text"
                  value={form.attachments}
                  onChange={(e) => setForm({ ...form, attachments: e.target.value })}
                  className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-sm text-navy outline-none focus:border-teal"
                  placeholder="Attachment URLs or file names"
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-3">
                <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 border border-border rounded-lg text-sm text-slate hover:bg-surface transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="px-4 py-2 bg-teal text-white rounded-lg text-sm font-medium hover:bg-teal/90 transition-colors disabled:opacity-50 flex items-center gap-1.5">
                  <Save size={14} />{saving ? 'Saving...' : 'Save Record'}
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
            <h3 className="font-display font-semibold text-lg text-navy mb-2">Delete Medical Record</h3>
            <p className="text-sm text-slate mb-5">Are you sure you want to delete this medical record? This action cannot be undone.</p>
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
