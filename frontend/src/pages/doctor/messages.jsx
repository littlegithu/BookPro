import { useState, useEffect } from 'react'
import {
  Mail, Search, Plus, Send, Archive, Trash2, Forward, Reply, X,
  Paperclip, Clock, ArrowLeft
} from 'lucide-react'
import { toast } from 'react-hot-toast'
import Topbar from '../../components/layout/topbar'
import DoctorDashboardLayout from '../../components/layout/doctor-dashboard-layout'
import {
  fetchDoctorMessages,
  sendDoctorMessage,
  deleteDoctorMessage,
  archiveDoctorMessage,
  markMessageRead
} from '../../services/api'

const TABS = [
  { key: 'inbox', label: 'Inbox' },
  { key: 'sent', label: 'Sent' },
  { key: 'archived', label: 'Archived' },
]

const RECIPIENTS = [
  { name: 'Dr. Smith', role: 'Doctor' },
  { name: 'Dr. Johnson', role: 'Doctor' },
  { name: 'Nurse Sarah', role: 'Nurse' },
  { name: 'Nurse Emily', role: 'Nurse' },
  { name: 'Reception', role: 'Receptionist' },
  { name: 'Patient', role: 'Patient' },
]

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

function getInitials(name) {
  if (!name) return '??'
  return name.split(' ').filter(Boolean).map(n => n[0]).join('').slice(0, 2).toUpperCase()
}

function Avatar({ name, size = 36 }) {
  const initials = getInitials(name)
  return (
    <div
      className="rounded-full bg-teal-light text-teal flex items-center justify-center text-xs font-semibold shrink-0"
      style={{ width: size, height: size }}
    >
      {initials}
    </div>
  )
}

export default function DoctorMessagesPage() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('inbox')
  const [selectedMessage, setSelectedMessage] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [showNewMessageModal, setShowNewMessageModal] = useState(false)
  const [showForwardModal, setShowForwardModal] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null)
  const [showReply, setShowReply] = useState(false)
  const [replyBody, setReplyBody] = useState('')
  const [actionLoading, setActionLoading] = useState({})

  const [newMessage, setNewMessage] = useState({
    recipient_name: '',
    recipient_role: '',
    subject: '',
    body: '',
    attachment_url: '',
    attachment_name: '',
  })
  const [forwardData, setForwardData] = useState({
    recipient_name: '',
    recipient_role: '',
    note: '',
  })
  const [replyAttachment, setReplyAttachment] = useState(null)

  const filteredMessages = messages.filter(m => {
    if (!searchQuery.trim()) return true
    const q = searchQuery.toLowerCase()
    return (
      (m.subject && m.subject.toLowerCase().includes(q)) ||
      (m.sender_name && m.sender_name.toLowerCase().includes(q))
    )
  })

  const unreadCount = messages.filter(m => !m.is_read).length

  useEffect(() => {
    let cancelled = false
    async function loadMessages() {
      setLoading(true)
      try {
        const data = await fetchDoctorMessages(activeTab)
        if (!cancelled) {
          setMessages(Array.isArray(data) ? data : [])
        }
      } catch (err) {
        if (!cancelled) {
          toast.error(err.message || 'Failed to load messages')
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }
    loadMessages()
    return () => { cancelled = true }
  }, [activeTab])

  async function handleSelectMessage(msg) {
    setSelectedMessage(msg)
    setShowReply(false)
    setReplyBody('')
    setReplyAttachment(null)
    if (!msg.is_read && activeTab === 'inbox') {
      try {
        await markMessageRead(msg.id, 'inbox', true)
        setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, is_read: true } : m))
        setSelectedMessage(prev => ({ ...prev, is_read: true }))
      } catch {
        // silently fail read mark
      }
    }
  }

  async function handleSendMessage(e) {
    e.preventDefault()
    setActionLoading(prev => ({ ...prev, send: true }))
    try {
      const payload = {
        ...newMessage,
        sender_name: 'Dr. User',
        sender_role: 'Doctor',
      }
      const sent = await sendDoctorMessage(payload)
      toast.success('Message sent successfully')
      setShowNewMessageModal(false)
      setNewMessage({ recipient_name: '', recipient_role: '', subject: '', body: '', attachment_url: '', attachment_name: '' })
      if (activeTab === 'sent') {
        setMessages(prev => [sent, ...prev])
      }
    } catch (err) {
      toast.error(err.message || 'Failed to send message')
    } finally {
      setActionLoading(prev => ({ ...prev, send: false }))
    }
  }

  async function handleReply(e) {
    e.preventDefault()
    if (!replyBody.trim() && !replyAttachment) return
    setActionLoading(prev => ({ ...prev, reply: true }))
    try {
      const replyMsg = {
        id: Date.now(),
        parent_message_id: selectedMessage.id,
        subject: `Re: ${selectedMessage.subject}`,
        body: replyBody,
        sender_name: 'Dr. User',
        sender_role: 'Doctor',
        recipient_name: selectedMessage.sender_name,
        recipient_role: selectedMessage.sender_role,
        attachment_url: replyAttachment ? URL.createObjectURL(replyAttachment) : '',
        attachment_name: replyAttachment ? replyAttachment.name : '',
        is_read: false,
        folder: 'sent',
        created_at: new Date().toISOString(),
      }
      const sent = await sendDoctorMessage(replyMsg)
      setSelectedMessage(prev => ({
        ...prev,
        thread: [...(prev.thread || []), sent]
      }))
      setMessages(prev => prev.map(m => m.id === selectedMessage.id ? { ...m, thread: [...(m.thread || []), sent] } : m))
      setShowReply(false)
      setReplyBody('')
      setReplyAttachment(null)
      toast.success('Reply sent')
    } catch (err) {
      toast.error(err.message || 'Failed to send reply')
    } finally {
      setActionLoading(prev => ({ ...prev, reply: false }))
    }
  }

  async function handleForward(e) {
    e.preventDefault()
    setActionLoading(prev => ({ ...prev, forward: true }))
    try {
      const forwardMsg = {
        subject: `Fwd: ${selectedMessage.subject}`,
        body: forwardData.note ? `${forwardData.note}\n\n--- Forwarded Message ---\n${selectedMessage.body}` : `--- Forwarded Message ---\n${selectedMessage.body}`,
        sender_name: 'Dr. User',
        sender_role: 'Doctor',
        recipient_name: forwardData.recipient_name,
        recipient_role: forwardData.recipient_role,
        attachment_url: selectedMessage.attachment_url || '',
        attachment_name: selectedMessage.attachment_name || '',
        is_read: false,
        folder: 'sent',
        created_at: new Date().toISOString(),
      }
      await sendDoctorMessage(forwardMsg)
      toast.success('Message forwarded successfully')
      setShowForwardModal(false)
      setForwardData({ recipient_name: '', recipient_role: '', note: '' })
    } catch (err) {
      toast.error(err.message || 'Failed to forward message')
    } finally {
      setActionLoading(prev => ({ ...prev, forward: false }))
    }
  }

  async function handleArchive() {
    if (!selectedMessage) return
    setActionLoading(prev => ({ ...prev, archive: true }))
    try {
      await archiveDoctorMessage(selectedMessage.id, activeTab)
      setMessages(prev => prev.filter(m => m.id !== selectedMessage.id))
      setSelectedMessage(null)
      toast.success('Message archived')
    } catch (err) {
      toast.error(err.message || 'Failed to archive message')
    } finally {
      setActionLoading(prev => ({ ...prev, archive: false }))
    }
  }

  async function handleDelete(id) {
    setActionLoading(prev => ({ ...prev, delete: true }))
    try {
      await deleteDoctorMessage(id, activeTab)
      setMessages(prev => prev.filter(m => m.id !== id))
      if (selectedMessage && selectedMessage.id === id) {
        setSelectedMessage(null)
      }
      setShowDeleteConfirm(null)
      toast.success('Message deleted')
    } catch (err) {
      toast.error(err.message || 'Failed to delete message')
    } finally {
      setActionLoading(prev => ({ ...prev, delete: false }))
    }
  }

  function handleRecipientSelect(name) {
    const recipient = RECIPIENTS.find(r => r.name === name)
    setNewMessage(prev => ({
      ...prev,
      recipient_name: name,
      recipient_role: recipient ? recipient.role : '',
    }))
  }

  return (
    <DoctorDashboardLayout>
      <Topbar title="Messages" subtitle="Manage your communications" />

      <div className="p-4 md:p-7 h-[calc(100vh-4rem)] flex flex-col">
        <div className="bg-card rounded-xl border border-border flex-1 flex overflow-hidden">
          {/* Message List Panel */}
          <div className={`w-full md:w-[35%] border-r border-border flex flex-col ${selectedMessage ? 'hidden md:flex' : 'flex'}`}>
            {/* Tabs */}
            <div className="p-3 border-b border-border">
              <div className="flex gap-1 bg-surface rounded-lg p-1">
                {TABS.map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => { setActiveTab(tab.key); setSelectedMessage(null) }}
                    className={`flex-1 relative px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeTab === tab.key
                        ? 'bg-card text-navy shadow-sm'
                        : 'text-slate hover:text-navy'
                    }`}
                  >
                    {tab.label}
                    {tab.key === 'inbox' && unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-teal text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Search and New Message */}
            <div className="p-3 border-b border-border space-y-2">
              <button
                onClick={() => setShowNewMessageModal(true)}
                className="w-full px-4 py-2.5 bg-teal text-white rounded-lg text-sm font-medium hover:bg-teal/90 transition-colors flex items-center justify-center gap-2"
              >
                <Plus size={16} />New Message
              </button>
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-light" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search messages..."
                  className="w-full pl-9 pr-4 py-2 bg-surface border border-border rounded-lg text-sm text-navy placeholder:text-slate-light outline-none focus:border-teal"
                />
              </div>
            </div>

            {/* Message List */}
            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <span className="inline-block w-8 h-8 border-2 border-teal border-t-transparent rounded-full animate-spin" />
                </div>
              ) : filteredMessages.length === 0 ? (
                <div className="p-10 text-center">
                  <Mail className="w-12 h-12 mx-auto mb-3 text-slate-light opacity-40" />
                  <p className="text-sm font-medium text-navy">No messages</p>
                  <p className="text-xs text-slate-light mt-1">
                    {searchQuery ? 'No messages match your search.' : `Your ${activeTab} is empty.`}
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {filteredMessages.map(msg => (
                    <button
                      key={msg.id}
                      onClick={() => handleSelectMessage(msg)}
                      className={`w-full text-left p-3 transition-colors hover:bg-surface/70 ${
                        selectedMessage && selectedMessage.id === msg.id ? 'bg-surface' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <Avatar name={msg.sender_name} size={36} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 min-w-0">
                              <p className="text-sm font-medium text-navy truncate">
                                {msg.sender_name || 'Unknown'}
                              </p>
                              {!msg.is_read && (
                                <span className="w-2 h-2 rounded-full bg-teal shrink-0" />
                              )}
                            </div>
                            <span className="text-[11px] text-slate-light shrink-0">
                              {formatRelativeTime(msg.created_at)}
                            </span>
                          </div>
                          <p className="text-sm text-slate mt-0.5 truncate">{msg.subject || '(No subject)'}</p>
                          <p className="text-xs text-slate-light mt-0.5 line-clamp-1">{msg.body}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Message Detail Panel */}
          <div className={`flex-1 flex flex-col ${selectedMessage ? 'flex' : 'hidden md:flex'}`}>
            {selectedMessage ? (
              <>
                {/* Detail Header */}
                <div className="p-4 border-b border-border flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setSelectedMessage(null)}
                      className="md:hidden p-1.5 rounded-md text-slate hover:bg-surface transition-colors"
                    >
                      <ArrowLeft size={18} />
                    </button>
                    <div>
                      <h3 className="text-sm font-semibold text-navy truncate max-w-[200px] md:max-w-md">
                        {selectedMessage.subject || '(No subject)'}
                      </h3>
                      <p className="text-xs text-slate-light mt-0.5">
                        From: {selectedMessage.sender_name} ({selectedMessage.sender_role})
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setShowReply(!showReply)}
                      className="p-2 rounded-md text-slate hover:text-teal hover:bg-teal-light transition-colors"
                      title="Reply"
                    >
                      <Reply size={16} />
                    </button>
                    <button
                      onClick={() => setShowForwardModal(true)}
                      className="p-2 rounded-md text-slate hover:text-blue hover:bg-blue-light transition-colors"
                      title="Forward"
                    >
                      <Forward size={16} />
                    </button>
                    {activeTab !== 'archived' && (
                      <button
                        onClick={handleArchive}
                        disabled={actionLoading.archive}
                        className="p-2 rounded-md text-slate hover:text-yellow hover:bg-yellow-light transition-colors disabled:opacity-50"
                        title="Archive"
                      >
                        {actionLoading.archive ? (
                          <span className="inline-block w-4 h-4 border-2 border-slate border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Archive size={16} />
                        )}
                      </button>
                    )}
                    <button
                      onClick={() => setShowDeleteConfirm(selectedMessage)}
                      className="p-2 rounded-md text-slate hover:text-red hover:bg-red-light transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Thread */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {/* Original Message */}
                  <div className="bg-surface rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <Avatar name={selectedMessage.sender_name} size={40} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <div>
                            <p className="text-sm font-semibold text-navy">{selectedMessage.sender_name}</p>
                            <p className="text-xs text-slate-light">{selectedMessage.sender_role}</p>
                          </div>
                          <span className="text-xs text-slate-light flex items-center gap-1">
                            <Clock size={10} />
                            {formatRelativeTime(selectedMessage.created_at)}
                          </span>
                        </div>
                        <p className="text-sm text-slate mt-3 whitespace-pre-wrap">{selectedMessage.body}</p>
                        {selectedMessage.attachment_url && (
                          <a
                            href={selectedMessage.attachment_url}
                            download={selectedMessage.attachment_name || 'attachment'}
                            className="inline-flex items-center gap-2 mt-3 px-3 py-2 bg-card border border-border rounded-lg text-sm text-teal hover:bg-teal-light transition-colors"
                          >
                            <Paperclip size={14} />
                            {selectedMessage.attachment_name || 'Download Attachment'}
                          </a>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Replies */}
                  {selectedMessage.thread && selectedMessage.thread.length > 0 && (
                    <div className="space-y-3 pl-4 border-l-2 border-border">
                      {selectedMessage.thread.map(reply => (
                        <div key={reply.id} className="bg-surface/50 rounded-xl p-4">
                          <div className="flex items-start gap-3">
                            <Avatar name={reply.sender_name} size={32} />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2">
                                <div>
                                  <p className="text-sm font-semibold text-navy">{reply.sender_name}</p>
                                  <p className="text-xs text-slate-light">{reply.sender_role}</p>
                                </div>
                                <span className="text-xs text-slate-light flex items-center gap-1">
                                  <Clock size={10} />
                                  {formatRelativeTime(reply.created_at)}
                                </span>
                              </div>
                              <p className="text-sm text-slate mt-2 whitespace-pre-wrap">{reply.body}</p>
                              {reply.attachment_url && (
                                <a
                                  href={reply.attachment_url}
                                  download={reply.attachment_name || 'attachment'}
                                  className="inline-flex items-center gap-2 mt-2 px-3 py-2 bg-card border border-border rounded-lg text-sm text-teal hover:bg-teal-light transition-colors"
                                >
                                  <Paperclip size={14} />
                                  {reply.attachment_name || 'Download Attachment'}
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Reply Box */}
                {showReply && (
                  <form onSubmit={handleReply} className="p-4 border-t border-border bg-surface">
                    <textarea
                      value={replyBody}
                      onChange={(e) => setReplyBody(e.target.value)}
                      placeholder="Write your reply..."
                      rows={3}
                      className="w-full p-3 bg-card border border-border rounded-lg text-sm text-navy placeholder:text-slate-light outline-none focus:border-teal resize-none"
                    />
                    <div className="flex items-center justify-between mt-2">
                      <label className="flex items-center gap-2 px-3 py-2 bg-card border border-border rounded-lg text-sm text-slate hover:text-teal cursor-pointer transition-colors">
                        <Paperclip size={14} />
                        <span className="text-xs">{replyAttachment ? replyAttachment.name : 'Attach file'}</span>
                        <input
                          type="file"
                          className="hidden"
                          onChange={(e) => setReplyAttachment(e.target.files?.[0] || null)}
                        />
                      </label>
                      <button
                        type="submit"
                        disabled={actionLoading.reply || (!replyBody.trim() && !replyAttachment)}
                        className="px-4 py-2 bg-teal text-white rounded-lg text-sm font-medium hover:bg-teal/90 transition-colors disabled:opacity-50 flex items-center gap-1.5"
                      >
                        {actionLoading.reply ? (
                          <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Send size={14} />
                        )}
                        Send
                      </button>
                    </div>
                  </form>
                )}
              </>
            ) : (
              /* Empty State */
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <Mail className="w-16 h-16 mx-auto mb-4 text-slate-light opacity-40" />
                  <p className="text-lg font-medium text-navy mb-1">Select a message to view</p>
                  <p className="text-sm text-slate-light">Choose a message from the list to read its contents</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* New Message Modal */}
      {showNewMessageModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-xl border border-border w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-display font-semibold text-lg text-navy">New Message</h3>
              <button onClick={() => setShowNewMessageModal(false)} className="p-1.5 rounded-md text-slate hover:bg-surface transition-colors">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSendMessage} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-navy mb-1.5">To</label>
                <select
                  value={newMessage.recipient_name}
                  onChange={(e) => handleRecipientSelect(e.target.value)}
                  className="w-full px-4 py-2.5 bg-surface border border-border rounded-lg text-sm text-navy outline-none focus:border-teal"
                  required
                >
                  <option value="">Select recipient</option>
                  {RECIPIENTS.map(r => (
                    <option key={r.name} value={r.name}>{r.name} ({r.role})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-navy mb-1.5">Subject</label>
                <input
                  type="text"
                  value={newMessage.subject}
                  onChange={(e) => setNewMessage(prev => ({ ...prev, subject: e.target.value }))}
                  placeholder="Enter subject"
                  className="w-full px-4 py-2.5 bg-surface border border-border rounded-lg text-sm text-navy placeholder:text-slate-light outline-none focus:border-teal"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-navy mb-1.5">Body</label>
                <textarea
                  value={newMessage.body}
                  onChange={(e) => setNewMessage(prev => ({ ...prev, body: e.target.value }))}
                  placeholder="Write your message..."
                  rows={4}
                  className="w-full px-4 py-2.5 bg-surface border border-border rounded-lg text-sm text-navy placeholder:text-slate-light outline-none focus:border-teal resize-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-navy mb-1.5">Attachment</label>
                <label className="flex items-center gap-2 px-4 py-2.5 bg-surface border border-border rounded-lg text-sm text-slate cursor-pointer hover:text-teal transition-colors">
                  <Paperclip size={14} />
                  <span>{newMessage.attachment_name || 'Choose a file'}</span>
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        setNewMessage(prev => ({
                          ...prev,
                          attachment_name: file.name,
                          attachment_url: URL.createObjectURL(file)
                        }))
                      }
                    }}
                  />
                </label>
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowNewMessageModal(false)} className="px-4 py-2 border border-border rounded-lg text-sm text-slate hover:bg-surface transition-colors">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading.send}
                  className="px-6 py-2 bg-teal text-white rounded-lg text-sm font-medium hover:bg-teal/90 transition-colors disabled:opacity-50 flex items-center gap-1.5"
                >
                  {actionLoading.send ? (
                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Send size={14} />
                  )}
                  Send
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Forward Modal */}
      {showForwardModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-xl border border-border w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-display font-semibold text-lg text-navy">Forward Message</h3>
              <button onClick={() => setShowForwardModal(false)} className="p-1.5 rounded-md text-slate hover:bg-surface transition-colors">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleForward} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-navy mb-1.5">To</label>
                <select
                  value={forwardData.recipient_name}
                  onChange={(e) => setForwardData(prev => ({
                    ...prev,
                    recipient_name: e.target.value,
                    recipient_role: RECIPIENTS.find(r => r.name === e.target.value)?.role || ''
                  }))}
                  className="w-full px-4 py-2.5 bg-surface border border-border rounded-lg text-sm text-navy outline-none focus:border-teal"
                  required
                >
                  <option value="">Select recipient</option>
                  {RECIPIENTS.map(r => (
                    <option key={r.name} value={r.name}>{r.name} ({r.role})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-navy mb-1.5">Note (optional)</label>
                <textarea
                  value={forwardData.note}
                  onChange={(e) => setForwardData(prev => ({ ...prev, note: e.target.value }))}
                  placeholder="Add a note..."
                  rows={3}
                  className="w-full px-4 py-2.5 bg-surface border border-border rounded-lg text-sm text-navy placeholder:text-slate-light outline-none focus:border-teal resize-none"
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowForwardModal(false)} className="px-4 py-2 border border-border rounded-lg text-sm text-slate hover:bg-surface transition-colors">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading.forward}
                  className="px-6 py-2 bg-teal text-white rounded-lg text-sm font-medium hover:bg-teal/90 transition-colors disabled:opacity-50 flex items-center gap-1.5"
                >
                  {actionLoading.forward ? (
                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Forward size={14} />
                  )}
                  Forward
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-xl border border-border w-full max-w-md p-6">
            <h3 className="font-display font-semibold text-lg text-navy mb-2">Delete Message</h3>
            <p className="text-sm text-slate mb-5">Are you sure you want to delete this message? This action cannot be undone.</p>
            <div className="flex items-center justify-end gap-2">
              <button onClick={() => setShowDeleteConfirm(null)} className="px-4 py-2 border border-border rounded-lg text-sm text-slate hover:bg-surface transition-colors">
                Cancel
              </button>
              <button
                onClick={() => handleDelete(showDeleteConfirm.id)}
                disabled={actionLoading.delete}
                className="px-4 py-2 bg-red text-white rounded-lg text-sm font-medium hover:bg-red/90 transition-colors disabled:opacity-50 flex items-center gap-1.5"
              >
                {actionLoading.delete ? (
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : null}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </DoctorDashboardLayout>
  )
}
