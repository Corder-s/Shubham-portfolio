import React, { useState, useEffect, useCallback } from 'react';
import {
  Mail,
  Search,
  Archive,
  ArchiveRestore,
  Trash2,
  Send,
  ExternalLink,
  Copy,
  Check,
  Reply,
  Sparkles,
} from 'lucide-react';
import { contactService } from '../../services/contactService';
import { ContactMessage } from '../../types';
import { ConfirmDeleteModal } from './ConfirmDeleteModal';

export const AdminMessages: React.FC = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'new' | 'read' | 'replied' | 'archived'>('all');
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // In-app reply state
  const [replyText, setReplyText] = useState('');
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const loadMessages = useCallback(async () => {
    const list = await contactService.getMessages();
    setMessages(list);
    // If a message was selected, refresh its data in view
    if (selectedMessage) {
      const updated = list.find((m) => m.id === selectedMessage.id);
      if (updated) setSelectedMessage(updated);
    }
  }, [selectedMessage]);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  const updateStatus = async (id: string, status: ContactMessage['status'], toastText?: string) => {
    try {
      const updated = await contactService.updateMessageStatus(id, status);
      await loadMessages();
      if (selectedMessage && selectedMessage.id === id) {
        setSelectedMessage(updated);
      }
      showToast(toastText || `Status updated to ${status.toUpperCase()}`);
    } catch (err: any) {
      showToast(`Error updating status: ${err.message}`);
    }
  };

  const handleInAppReply = async (method: 'in_app' | 'gmail' | 'email' = 'in_app') => {
    if (!selectedMessage) return;
    if (!replyText.trim() && method === 'in_app') {
      showToast('Please type your reply message first.');
      return;
    }

    const textToSend = replyText.trim() || `Hi ${selectedMessage.name}, thank you for reaching out to me through my portfolio.`;
    setIsSubmittingReply(true);

    try {
      const updated = await contactService.addReply(selectedMessage.id, textToSend, method);
      setSelectedMessage(updated);
      await loadMessages();
      setReplyText('');

      if (method === 'gmail') {
        const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
          selectedMessage.email
        )}&su=${encodeURIComponent('Re: ' + selectedMessage.subject)}&body=${encodeURIComponent(
          textToSend
        )}`;
        window.open(gmailUrl, '_blank', 'noopener,noreferrer');
        showToast('Opened in Gmail & saved to reply thread!');
      } else if (method === 'email') {
        const mailtoUrl = `mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(
          selectedMessage.subject
        )}&body=${encodeURIComponent(textToSend)}`;
        window.location.href = mailtoUrl;
        showToast('Triggered default email client & saved to reply thread!');
      } else {
        showToast('Reply saved directly to message conversation!');
      }
    } catch (err: any) {
      showToast('Error recording reply: ' + err.message);
    } finally {
      setIsSubmittingReply(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedEmail(true);
    showToast(`Copied "${text}" to clipboard!`);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const confirmDelete = async () => {
    if (!deleteTargetId) return;
    try {
      await contactService.deleteMessage(deleteTargetId);
      setIsDeleteModalOpen(false);
      setDeleteTargetId(null);
      if (selectedMessage?.id === deleteTargetId) {
        setSelectedMessage(null);
      }
      await loadMessages();
      showToast('Message deleted successfully.');
    } catch (err: any) {
      showToast('Error deleting message: ' + err.message);
    }
  };

  const filteredMessages = messages.filter((m) => {
    const matchStatus = statusFilter === 'all' || m.status === statusFilter;
    const matchSearch =
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase()) ||
      m.subject.toLowerCase().includes(search.toLowerCase()) ||
      m.message.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const unreadCount = messages.filter((m) => m.status === 'new').length;
  const archivedCount = messages.filter((m) => m.status === 'archived').length;

  const quickTemplates = [
    `Hi ${selectedMessage?.name || 'there'}, thanks for reaching out! I would love to connect and discuss this further.`,
    `Hello ${selectedMessage?.name || 'there'}, thank you for your inquiry. Are you available for a brief call this week?`,
    `Hi ${selectedMessage?.name || 'there'}, I received your message regarding "${selectedMessage?.subject || 'portfolio'}". Let me review the details and get back to you shortly.`,
  ];

  return (
    <div className="space-y-6 relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#020203] border border-[#02F74C] text-[#02F74C] px-4 py-3 rounded-lg shadow-[0_0_20px_rgba(2,247,76,0.3)] text-xs font-mono flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <Sparkles className="w-4 h-4 text-[#02F74C] shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-white tracking-tight">Inbound Messages</h2>
            {unreadCount > 0 && (
              <span className="px-2.5 py-0.5 text-xs font-bold bg-amber-500 text-slate-950 rounded-full">
                {unreadCount} Unread
              </span>
            )}
            {archivedCount > 0 && (
              <span className="px-2 py-0.5 text-[10px] font-bold bg-slate-800 text-slate-400 rounded-md">
                {archivedCount} Archived
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Realtime records from public portfolio contact transmissions with full in-app replies.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search sender, email, query..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
          />
        </div>

        <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {(['all', 'new', 'read', 'replied', 'archived'] as const).map((filter) => {
            const count =
              filter === 'all'
                ? messages.length
                : messages.filter((m) => m.status === filter).length;

            return (
              <button
                key={filter}
                onClick={() => setStatusFilter(filter)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-1.5 ${
                  statusFilter === filter
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <span>{filter}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    statusFilter === filter
                      ? 'bg-indigo-800 text-indigo-200'
                      : 'bg-slate-900 text-slate-400'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Split View: List on Left, Detail & Reply on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Messages List (5 cols) */}
        <div className="lg:col-span-5 bg-slate-800/80 border border-slate-700 rounded-xl overflow-hidden shadow-lg divide-y divide-slate-700/60 max-h-[780px] overflow-y-auto">
          {filteredMessages.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs">
              No contact messages in this category.
            </div>
          ) : (
            filteredMessages.map((msg) => {
              const isSelected = selectedMessage?.id === msg.id;
              const isNew = msg.status === 'new';

              return (
                <div
                  key={msg.id}
                  onClick={() => {
                    setSelectedMessage(msg);
                    if (msg.status === 'new') {
                      updateStatus(msg.id, 'read');
                    }
                  }}
                  className={`p-4 transition-colors cursor-pointer flex items-start justify-between gap-3 ${
                    isSelected
                      ? 'bg-indigo-950/60 border-l-4 border-indigo-500'
                      : 'hover:bg-slate-700/40'
                  }`}
                >
                  <div className="overflow-hidden flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs ${isNew ? 'font-bold text-white' : 'font-medium text-slate-200'}`}>
                        {msg.name}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono truncate">{msg.email}</span>
                    </div>

                    <p className={`text-xs truncate ${isNew ? 'font-semibold text-indigo-300' : 'text-slate-300'}`}>
                      {msg.subject}
                    </p>
                    <p className="text-[11px] text-slate-400 truncate mt-1">{msg.message}</p>
                  </div>

                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <span
                      className={`px-1.5 py-0.5 text-[9px] uppercase font-bold rounded ${
                        msg.status === 'new'
                          ? 'bg-amber-900/80 text-amber-200 border border-amber-600'
                          : msg.status === 'replied'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : msg.status === 'archived'
                          ? 'bg-slate-900 text-slate-400 border border-slate-700'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {msg.status}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {new Date(msg.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Message Detail Viewer & Reply Studio (7 cols) */}
        <div className="lg:col-span-7 bg-slate-800/80 border border-slate-700 rounded-xl p-5 shadow-lg">
          {selectedMessage ? (
            <div className="space-y-5">
              {/* Message Header */}
              <div className="flex items-start justify-between border-b border-slate-700 pb-3 gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-white text-base">{selectedMessage.subject}</h3>
                    <span
                      className={`px-2 py-0.5 text-[10px] rounded font-bold uppercase ${
                        selectedMessage.status === 'new'
                          ? 'bg-amber-900/80 text-amber-200 border border-amber-600'
                          : selectedMessage.status === 'replied'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : selectedMessage.status === 'archived'
                          ? 'bg-slate-900 text-slate-400 border border-slate-700'
                          : 'bg-slate-900 border border-slate-700 text-slate-300'
                      }`}
                    >
                      {selectedMessage.status}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs">
                    <span className="text-indigo-400 font-medium">From: {selectedMessage.name}</span>
                    <span className="text-slate-400 font-mono flex items-center gap-1">
                      {selectedMessage.email}
                      <button
                        type="button"
                        onClick={() => copyToClipboard(selectedMessage.email)}
                        className="hover:text-indigo-300 transition-colors p-0.5"
                        title="Copy Email"
                      >
                        {copiedEmail ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[10px] text-slate-400 block font-mono">
                    {new Date(selectedMessage.created_at).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Action Buttons Toolbar */}
              <div className="flex flex-wrap items-center gap-2 pb-2 border-b border-slate-700/60">
                {/* Archive / Restore Button */}
                {selectedMessage.status !== 'archived' ? (
                  <button
                    type="button"
                    onClick={() => updateStatus(selectedMessage.id, 'archived', 'Message moved to Archive')}
                    className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Archive className="w-3.5 h-3.5 text-slate-400" />
                    <span>Archive</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => updateStatus(selectedMessage.id, 'read', 'Message restored to Inbox')}
                    className="px-3 py-1.5 bg-indigo-700 hover:bg-indigo-600 text-white rounded text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <ArchiveRestore className="w-3.5 h-3.5 text-indigo-300" />
                    <span>Restore to Inbox</span>
                  </button>
                )}

                {/* Mark Read / Unread */}
                {selectedMessage.status === 'read' ? (
                  <button
                    type="button"
                    onClick={() => updateStatus(selectedMessage.id, 'new', 'Marked as unread')}
                    className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded text-xs font-medium transition-colors cursor-pointer"
                  >
                    Mark Unread
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => updateStatus(selectedMessage.id, 'read', 'Marked as read')}
                    className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded text-xs font-medium transition-colors cursor-pointer"
                  >
                    Mark Read
                  </button>
                )}

                {/* Delete */}
                <button
                  type="button"
                  onClick={() => {
                    setDeleteTargetId(selectedMessage.id);
                    setIsDeleteModalOpen(true);
                  }}
                  className="px-3 py-1.5 bg-red-950/60 hover:bg-red-900 border border-red-800/60 text-red-300 rounded text-xs font-medium ml-auto flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>

              {/* Inbound Message Content */}
              <div>
                <label className="text-[10px] text-slate-400 uppercase font-mono tracking-wider block mb-1.5">
                  Original Transmission
                </label>
                <div className="p-4 bg-slate-900 rounded-lg border border-slate-700/80 text-xs text-slate-200 leading-relaxed whitespace-pre-wrap font-mono min-h-[90px]">
                  {selectedMessage.message}
                </div>
              </div>

              {/* Past Reply Thread (if any) */}
              {selectedMessage.replies && selectedMessage.replies.length > 0 && (
                <div className="space-y-3">
                  <label className="text-[10px] text-emerald-400 uppercase font-mono tracking-wider block">
                    Reply History ({selectedMessage.replies.length})
                  </label>
                  <div className="space-y-2">
                    {selectedMessage.replies.map((reply) => (
                      <div
                        key={reply.id}
                        className="p-3.5 bg-emerald-950/30 border border-emerald-800/50 rounded-lg space-y-1 text-xs"
                      >
                        <div className="flex items-center justify-between text-[10px] text-slate-400">
                          <span className="font-bold text-emerald-400">{reply.sender}</span>
                          <div className="flex items-center gap-2">
                            <span className="px-1.5 py-0.2 bg-emerald-950 border border-emerald-700/60 text-emerald-300 rounded text-[9px] uppercase font-mono">
                              via {reply.method === 'gmail' ? 'Gmail' : reply.method === 'email' ? 'Mail Client' : 'In-App'}
                            </span>
                            <span className="font-mono">{new Date(reply.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                        </div>
                        <p className="text-slate-200 whitespace-pre-wrap font-mono pt-1">{reply.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* IN-APP DIRECT REPLY COMPOSER */}
              <div className="p-4 bg-slate-900/90 border border-indigo-500/40 rounded-xl space-y-3 shadow-inner">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-white">
                    <Reply className="w-4 h-4 text-indigo-400" />
                    <span>Reply to {selectedMessage.name}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">{selectedMessage.email}</span>
                </div>

                {/* Quick Reply Templates */}
                <div>
                  <span className="text-[10px] text-slate-400 block mb-1.5 font-mono">Quick Template Snippets:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {quickTemplates.map((template, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setReplyText(template)}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-[10px] rounded text-left transition-colors cursor-pointer truncate max-w-full"
                      >
                        ⚡ Template {idx + 1}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Reply Textarea */}
                <textarea
                  rows={3}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder={`Write your direct reply to ${selectedMessage.name}...`}
                  className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none font-mono"
                />

                {/* Delivery Notice */}
                <div className="p-2.5 bg-indigo-950/40 border border-indigo-500/30 rounded-lg text-[11px] text-slate-300 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    <span>
                      To send directly to <strong>{selectedMessage.email}</strong>, use <strong>Reply via Gmail</strong>. It logs the reply in your database &amp; sends the actual email.
                    </span>
                  </div>
                </div>

                {/* Dispatch Options */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  {/* Primary: Open in Gmail (Sends actual email to visitor's inbox & logs to DB) */}
                  <button
                    type="button"
                    disabled={isSubmittingReply}
                    onClick={() => handleInAppReply('gmail')}
                    className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all shadow-md cursor-pointer disabled:opacity-50 shadow-red-900/20"
                    title="Dispatches email via Gmail Web directly to visitor's inbox and logs conversation to database"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Reply via Gmail (Send Email)</span>
                  </button>

                  {/* Native Email App (mailto:) */}
                  <button
                    type="button"
                    disabled={isSubmittingReply}
                    onClick={() => handleInAppReply('email')}
                    className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                    title="Opens default desktop email program (Outlook/Apple Mail) and logs to database"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Open Mail App</span>
                  </button>

                  {/* Internal DB Note Only */}
                  <button
                    type="button"
                    disabled={isSubmittingReply}
                    onClick={() => handleInAppReply('in_app')}
                    className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50 ml-auto"
                    title="Saves this reply into your database history only (does not send an external email)"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Log to Database Only</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-20 text-center text-slate-500">
              <Mail className="w-10 h-10 mx-auto mb-3 text-slate-600" />
              <p className="text-xs">Select a message from the list on the left to read and reply.</p>
            </div>
          )}
        </div>
      </div>

      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        title="Delete Message"
        message="Are you sure you want to permanently delete this contact message record?"
        onConfirm={confirmDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
      />
    </div>
  );
};
