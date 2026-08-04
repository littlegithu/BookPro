import { useState, useEffect, useRef } from 'react'
import { toast } from 'react-hot-toast'
import {
  Upload, FileText, Image, FileType, Search, X, MoreVertical,
  Eye, Download, RefreshCw, Edit3, Trash2, Share2, Printer,
  Loader2, Clock
} from 'lucide-react'
import Topbar from '../../components/layout/topbar'
import DoctorDashboardLayout from '../../components/layout/doctor-dashboard-layout'
import {
  fetchDoctorDocuments,
  uploadDoctorDocument,
  deleteDoctorDocument,
  updateDoctorDocument
} from '../../services/api'
import StatusBadge from '../../components/doctor/shared/status-badge'

const CATEGORIES = [
  'Medical License',
  'Practicing Certificate',
  'Degree Certificate',
  'Specialization Certificate',
  'National ID / Passport',
  'Curriculum Vitae',
  'Professional Insurance',
  'CPD Certificates',
  'Employment Contract',
  'Hospital Verification Letter',
  'Tax Certificate',
  'Other Documents'
]

const EMPTY_FORM = {
  name: '',
  category: '',
  doc_type: '',
  expiry_date: '',
  file: null,
  file_name: '',
  file_size: '',
  file_type: ''
}

export default function DoctorDocumentsPage() {
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingDoc, setEditingDoc] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [previewDoc, setPreviewDoc] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [activeMenu, setActiveMenu] = useState(null)
  const [renameDoc, setRenameDoc] = useState(null)
  const [renameValue, setRenameValue] = useState('')
  const fileInputRef = useRef(null)
  const dragCounter = useRef(0)

  const initialized = useRef(false)

  async function loadDocuments() {
    setLoading(true)
    try {
      const params = {}
      if (searchQuery) params.q = searchQuery
      if (categoryFilter) params.category = categoryFilter
      if (statusFilter) params.verification_status = statusFilter
      const data = await fetchDoctorDocuments(params)
      setDocuments(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err.message || 'Failed to load documents')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true
      loadDocuments()
    }
  }, [loadDocuments])

  const openCreateModal = () => {
    setEditingDoc(null)
    setForm(EMPTY_FORM)
    setUploadProgress(0)
    setModalOpen(true)
  }

  const openReplaceModal = (doc) => {
    setEditingDoc(doc)
    setForm({
      name: doc.name || '',
      category: doc.category || '',
      doc_type: doc.doc_type || '',
      expiry_date: doc.expiry_date || '',
      file: null,
      file_name: '',
      file_size: '',
      file_type: ''
    })
    setUploadProgress(0)
    setModalOpen(true)
  }

  const handleFileChange = (file) => {
    if (!file) return
    const maxSize = 10 * 1024 * 1024
    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ]
    const allowedExtensions = ['.pdf', '.jpg', '.jpeg', '.png', '.docx']

    const extension = '.' + file.name.split('.').pop().toLowerCase()
    if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(extension)) {
      toast.error('Invalid file type. Accepted: PDF, JPG, PNG, DOCX')
      return
    }
    if (file.size > maxSize) {
      toast.error('File size exceeds 10MB limit')
      return
    }

    setForm(prev => ({
      ...prev,
      file,
      file_name: file.name,
      file_size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
      file_type: extension.slice(1).toUpperCase()
    }))
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    dragCounter.current = 0
    const file = e.dataTransfer.files[0]
    handleFileChange(file)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDragEnter = (e) => {
    e.preventDefault()
    e.stopPropagation()
    dragCounter.current++
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    e.stopPropagation()
    dragCounter.current--
    if (dragCounter.current === 0) {
      setIsDragging(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name.trim()) {
      toast.error('Document name is required')
      return
    }
    if (!form.category) {
      toast.error('Category is required')
      return
    }
    if (!editingDoc && !form.file) {
      toast.error('Please select a file to upload')
      return
    }

    setSaving(true)
    setUploadProgress(0)
    try {
      const payload = {
        name: form.name,
        category: form.category,
        doc_type: form.category,
        expiry_date: form.expiry_date || null
      }

      if (form.file) {
        payload.file_name = form.file_name
        payload.file_size = form.file_size
        payload.file_type = form.file_type
      }

      if (editingDoc) {
        await updateDoctorDocument(editingDoc.id, payload)
        toast.success('Document updated successfully')
      } else {
        await uploadDoctorDocument(payload)
        toast.success('Document uploaded successfully')
      }

      setModalOpen(false)
      setForm(EMPTY_FORM)
      setUploadProgress(0)
      loadDocuments()
    } catch (err) {
      toast.error(err.message || 'Failed to save document')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteConfirm) return
    try {
      await deleteDoctorDocument(deleteConfirm.id)
      toast.success('Document deleted successfully')
      setDeleteConfirm(null)
      loadDocuments()
    } catch (err) {
      toast.error(err.message || 'Failed to delete document')
    }
  }

  const handleRename = async () => {
    if (!renameDoc || !renameValue.trim()) return
    try {
      await updateDoctorDocument(renameDoc.id, { name: renameValue.trim() })
      toast.success('Document renamed successfully')
      setRenameDoc(null)
      setRenameValue('')
      loadDocuments()
    } catch (err) {
      toast.error(err.message || 'Failed to rename document')
    }
  }

  const handleShare = async (doc) => {
    const shareUrl = doc.file_url || `${window.location.origin}/documents/${doc.id}`
    try {
      await navigator.clipboard.writeText(shareUrl)
      toast.success('Link copied to clipboard')
    } catch {
      toast.error('Failed to copy link')
    }
    setActiveMenu(null)
  }

  const handleDownload = (doc) => {
    if (!doc.file_url) {
      toast.error('Download link not available')
      return
    }
    const link = document.createElement('a')
    link.href = doc.file_url
    link.download = doc.file_name || doc.name
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handlePrint = (doc) => {
    const printWindow = window.open('', '_blank')
    printWindow.document.write(`
      <html>
        <head><title>${doc.name}</title></head>
        <body>
          <h1>Document: ${doc.name}</h1>
          <p><strong>Category:</strong> ${doc.category}</p>
          <p><strong>Uploaded:</strong> ${formatDate(doc.uploaded_at)}</p>
          <p><strong>Expiry:</strong> ${doc.expiry_date ? formatDate(doc.expiry_date) : 'N/A'}</p>
          <p><strong>Status:</strong> ${doc.verification_status}</p>
          <p><strong>File Type:</strong> ${doc.file_type || 'N/A'}</p>
          <p><strong>File Size:</strong> ${doc.file_size || 'N/A'}</p>
          ${doc.file_url ? `<p><a href="${doc.file_url}" target="_blank">View Document</a></p>` : ''}
        </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.print()
  }

  const handlePreview = (doc) => {
    setPreviewDoc(doc)
  }

  const getFileIcon = (doc) => {
    const type = (doc.file_type || '').toLowerCase()
    if (type === 'pdf') return FileText
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(type)) return Image
    return FileType
  }

  const getFileColor = (doc) => {
    const type = (doc.file_type || '').toLowerCase()
    if (type === 'pdf') return 'text-red bg-red-light'
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(type)) return 'text-blue bg-blue-light'
    return 'text-teal bg-teal-light'
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
      <Topbar title="Documents" subtitle="Upload and manage your documents" />

      <div className="p-7 space-y-5">
        {/* Search and Filters */}
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="flex flex-col lg:flex-row gap-3">
            <div className="flex-1 relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-light" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search documents by name..."
                className="w-full pl-9 pr-4 py-2 bg-surface border border-border rounded-lg text-sm text-navy placeholder:text-slate-light outline-none focus:border-teal"
              />
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 bg-surface border border-border rounded-lg text-sm text-navy outline-none focus:border-teal"
            >
              <option value="">All Categories</option>
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 bg-surface border border-border rounded-lg text-sm text-navy outline-none focus:border-teal"
            >
              <option value="">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Verified">Verified</option>
              <option value="Rejected">Rejected</option>
            </select>
            <button
              onClick={openCreateModal}
              className="px-4 py-2 bg-teal text-white rounded-lg text-sm font-medium hover:bg-teal/90 transition-colors flex items-center gap-1.5 justify-center"
            >
              <Upload size={14} />Upload Document
            </button>
          </div>
        </div>

        {error && (
          <div className="text-red-600 text-center py-5 bg-red-50 rounded-xl border border-red-200">{error}</div>
        )}

        {/* Documents Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <span className="inline-block w-8 h-8 border-2 border-teal border-t-transparent rounded-full animate-spin" />
          </div>
        ) : documents.length === 0 ? (
          <div className="bg-card rounded-xl border border-border p-10 text-center">
            <FileText className="w-16 h-16 mx-auto mb-4 text-slate-light opacity-40" />
            <p className="text-lg font-medium text-navy mb-1">No documents found</p>
            <p className="text-sm text-slate-light">Upload your first document or adjust your filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {documents.map((doc) => {
              const FileIcon = getFileIcon(doc)
              const fileColor = getFileColor(doc)
              return (
                <div
                  key={doc.id}
                  className="bg-card rounded-xl border border-border p-5 hover:border-teal/30 transition-colors relative group"
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-14 h-14 rounded-xl ${fileColor} flex items-center justify-center shrink-0`}>
                      <FileIcon size={24} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-display font-semibold text-navy truncate">{doc.name}</h3>
                      <p className="text-xs text-slate mt-0.5">{doc.category}</p>
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <StatusBadge status={doc.verification_status} />
                        <span className="text-[10px] text-slate-light">
                          {doc.file_type}{doc.file_size ? ` · ${doc.file_size}` : ''}
                        </span>
                      </div>
                      <div className="mt-2 space-y-0.5">
                        <p className="text-[11px] text-slate-light flex items-center gap-1">
                          <Clock size={10} />Uploaded: {formatDate(doc.uploaded_at)}
                        </p>
                        {doc.expiry_date && (
                          <p className="text-[11px] text-slate-light flex items-center gap-1">
                            <Clock size={10} />Expires: {formatDate(doc.expiry_date)}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="relative">
                      <button
                        onClick={() => setActiveMenu(activeMenu === doc.id ? null : doc.id)}
                        className="p-1.5 rounded-md text-slate hover:text-navy hover:bg-surface transition-colors"
                      >
                        <MoreVertical size={16} />
                      </button>
                      {activeMenu === doc.id && (
                        <div className="absolute right-0 top-full mt-1 bg-card border border-border rounded-lg shadow-lg z-20 min-w-[160px]">
                          <button
                            onClick={() => { handlePreview(doc); setActiveMenu(null) }}
                            className="w-full text-left px-4 py-2 text-sm text-navy hover:bg-surface transition-colors flex items-center gap-2"
                          >
                            <Eye size={14} />View
                          </button>
                          <button
                            onClick={() => { handleDownload(doc); setActiveMenu(null) }}
                            className="w-full text-left px-4 py-2 text-sm text-navy hover:bg-surface transition-colors flex items-center gap-2"
                          >
                            <Download size={14} />Download
                          </button>
                          <button
                            onClick={() => { openReplaceModal(doc); setActiveMenu(null) }}
                            className="w-full text-left px-4 py-2 text-sm text-navy hover:bg-surface transition-colors flex items-center gap-2"
                          >
                            <RefreshCw size={14} />Replace
                          </button>
                          <button
                            onClick={() => { setRenameDoc(doc); setRenameValue(doc.name); setActiveMenu(null) }}
                            className="w-full text-left px-4 py-2 text-sm text-navy hover:bg-surface transition-colors flex items-center gap-2"
                          >
                            <Edit3 size={14} />Rename
                          </button>
                          <button
                            onClick={() => { handleShare(doc); setActiveMenu(null) }}
                            className="w-full text-left px-4 py-2 text-sm text-navy hover:bg-surface transition-colors flex items-center gap-2"
                          >
                            <Share2 size={14} />Share
                          </button>
                          <button
                            onClick={() => { handlePrint(doc); setActiveMenu(null) }}
                            className="w-full text-left px-4 py-2 text-sm text-navy hover:bg-surface transition-colors flex items-center gap-2"
                          >
                            <Printer size={14} />Print
                          </button>
                          <div className="border-t border-border"></div>
                          <button
                            onClick={() => { setDeleteConfirm(doc); setActiveMenu(null) }}
                            className="w-full text-left px-4 py-2 text-sm text-red hover:bg-red-light transition-colors flex items-center gap-2"
                          >
                            <Trash2 size={14} />Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Upload/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-xl border border-border w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h3 className="font-display font-semibold text-lg text-navy">
                {editingDoc ? 'Replace Document' : 'Upload Document'}
              </h3>
              <button
                onClick={() => { setModalOpen(false); setForm(EMPTY_FORM); setUploadProgress(0) }}
                className="p-1.5 rounded-md text-slate hover:text-red hover:bg-red-light transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-medium text-navy mb-1">Document Name *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-sm text-navy outline-none focus:border-teal"
                  placeholder="e.g. Medical License 2024"
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-navy mb-1">Category *</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-sm text-navy outline-none focus:border-teal"
                    required
                  >
                    <option value="">Select category</option>
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-navy mb-1">Expiry Date</label>
                  <input
                    type="date"
                    value={form.expiry_date}
                    onChange={(e) => setForm({ ...form, expiry_date: e.target.value })}
                    className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-sm text-navy outline-none focus:border-teal"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-navy mb-1">
                  {editingDoc ? 'Replace File (optional)' : 'File *'}
                </label>
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onClick={() => !editingDoc && fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                    isDragging ? 'border-teal bg-teal-light/30' : 'border-border hover:border-teal/50'
                  } ${editingDoc ? 'cursor-default' : ''}`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png,.docx"
                    onChange={(e) => handleFileChange(e.target.files[0])}
                    className="hidden"
                  />
                  <Upload size={32} className="mx-auto mb-2 text-slate-light" />
                  <p className="text-sm text-navy font-medium">
                    {isDragging ? 'Drop file here' : editingDoc ? 'Click to replace file (optional)' : 'Drag & drop a file here, or click to browse'}
                  </p>
                  <p className="text-xs text-slate-light mt-1">Accepted: PDF, JPG, PNG, DOCX (max 10MB)</p>
                  {form.file_name && (
                    <div className="mt-3 inline-flex items-center gap-2 bg-surface px-3 py-2 rounded-lg text-sm text-navy">
                      <FileText size={14} />
                      <span>{form.file_name}</span>
                      <span className="text-slate-light">{form.file_size}</span>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setForm(prev => ({ ...prev, file: null, file_name: '', file_size: '', file_type: '' })) }}
                        className="text-slate hover:text-red"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
              {saving && (
                <div className="w-full bg-surface rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-teal h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              )}
              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => { setModalOpen(false); setForm(EMPTY_FORM); setUploadProgress(0) }}
                  className="px-4 py-2 border border-border rounded-lg text-sm text-slate hover:bg-surface transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 bg-teal text-white rounded-lg text-sm font-medium hover:bg-teal/90 transition-colors disabled:opacity-50 flex items-center gap-1.5"
                >
                  {saving ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      {editingDoc ? 'Updating...' : 'Uploading...'}
                    </>
                  ) : (
                    editingDoc ? 'Update Document' : 'Upload Document'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-xl border border-border w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h3 className="font-display font-semibold text-lg text-navy">{previewDoc.name}</h3>
              <button
                onClick={() => setPreviewDoc(null)}
                className="p-1.5 rounded-md text-slate hover:text-red hover:bg-red-light transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-5">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
                <div className="bg-surface rounded-lg p-3">
                  <p className="text-xs text-slate-light">Category</p>
                  <p className="text-sm font-medium text-navy">{previewDoc.category}</p>
                </div>
                <div className="bg-surface rounded-lg p-3">
                  <p className="text-xs text-slate-light">Uploaded</p>
                  <p className="text-sm font-medium text-navy">{formatDate(previewDoc.uploaded_at)}</p>
                </div>
                <div className="bg-surface rounded-lg p-3">
                  <p className="text-xs text-slate-light">Status</p>
                  <StatusBadge status={previewDoc.verification_status} />
                </div>
              </div>
              <div className="border border-border rounded-lg overflow-hidden bg-surface min-h-[300px] flex items-center justify-center">
                {(previewDoc.file_type || '').toLowerCase() === 'pdf' ? (
                  <iframe
                    src={previewDoc.file_url}
                    title={previewDoc.name}
                    className="w-full h-[500px]"
                  />
                ) : (previewDoc.file_type || '').toLowerCase().match(/^(jpg|jpeg|png|gif|webp)$/) ? (
                  <img
                    src={previewDoc.file_url}
                    alt={previewDoc.name}
                    className="max-w-full max-h-[500px] object-contain"
                  />
                ) : (
                  <div className="text-center p-10">
                    <FileType size={48} className="mx-auto mb-3 text-slate-light opacity-40" />
                    <p className="text-sm text-slate">Preview not available for this file type</p>
                    {previewDoc.file_url && (
                      <a
                        href={previewDoc.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block mt-3 px-4 py-2 bg-teal text-white rounded-lg text-sm font-medium hover:bg-teal/90 transition-colors"
                      >
                        Open in New Tab
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 p-5 border-t border-border">
              <button
                onClick={() => setPreviewDoc(null)}
                className="px-4 py-2 border border-border rounded-lg text-sm text-slate hover:bg-surface transition-colors"
              >
                Close
              </button>
              {previewDoc.file_url && (
                <a
                  href={previewDoc.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-teal text-white rounded-lg text-sm font-medium hover:bg-teal/90 transition-colors flex items-center gap-1.5"
                >
                  <Download size={14} />Download
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-xl border border-border w-full max-w-md p-6">
            <h3 className="font-display font-semibold text-lg text-navy mb-2">Delete Document</h3>
            <p className="text-sm text-slate mb-5">
              Are you sure you want to delete "{deleteConfirm.name}"? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 border border-border rounded-lg text-sm text-slate hover:bg-surface transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red text-white rounded-lg text-sm font-medium hover:bg-red/90 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rename Modal */}
      {renameDoc && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-xl border border-border w-full max-w-md p-6">
            <h3 className="font-display font-semibold text-lg text-navy mb-4">Rename Document</h3>
            <input
              type="text"
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
              className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-sm text-navy outline-none focus:border-teal mb-4"
              placeholder="Document name"
              autoFocus
            />
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => { setRenameDoc(null); setRenameValue('') }}
                className="px-4 py-2 border border-border rounded-lg text-sm text-slate hover:bg-surface transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleRename}
                disabled={!renameValue.trim()}
                className="px-4 py-2 bg-teal text-white rounded-lg text-sm font-medium hover:bg-teal/90 transition-colors disabled:opacity-50"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </DoctorDashboardLayout>
  )
}
