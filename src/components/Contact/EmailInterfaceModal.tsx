import React, { useState } from 'react';
import {
  Mail,
  X,
  ExternalLink,
  Copy,
  Check,
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { contactService } from '../../services/contactService';

interface EmailInterfaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  email?: string;
}

export const EmailInterfaceModal: React.FC<EmailInterfaceModalProps> = ({
  isOpen,
  onClose,
  email = 'damnitzshuham1406@gmail.com',
}) => {
  const [copied, setCopied] = useState(false);
  const [name, setName] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errMsg, setErrMsg] = useState('');

  if (!isOpen) return null;

  const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
    email
  )}&su=${encodeURIComponent('Developer Inquiry / Collaboration')}&body=${encodeURIComponent(
    'Hi Shubham,\n\nI visited your developer portfolio and would like to connect.\n\nBest regards,'
  )}`;

  const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(
    'Developer Inquiry / Collaboration'
  )}&body=${encodeURIComponent(
    'Hi Shubham,\n\nI visited your developer portfolio and would like to connect.\n\nBest regards,'
  )}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDirectSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !senderEmail.trim() || !message.trim()) {
      setStatus('error');
      setErrMsg('Please enter your name, email, and message.');
      return;
    }

    setStatus('loading');
    setErrMsg('');
    try {
      const res = await contactService.submitMessage({
        name,
        email: senderEmail,
        subject: subject || 'Portfolio Email Inquiry',
        message,
      });

      if (res.success) {
        setStatus('success');
        setName('');
        setSenderEmail('');
        setSubject('');
        setMessage('');
        try {
          confetti({
            particleCount: 60,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#02F74C', '#19C84A', '#76A988'],
          });
        } catch {
          // ignore
        }
      } else {
        setStatus('error');
        setErrMsg(res.error || 'Failed to dispatch message.');
      }
    } catch (err: any) {
      setStatus('error');
      setErrMsg(err.message || 'Error transmitting message.');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm font-mono cursor-pointer"
      onClick={onClose}
    >
      <div
        className="bg-[#0A0D0C] border border-[#02F74C] rounded-xl w-full max-w-xl shadow-[0_0_40px_rgba(2,247,76,0.3)] overflow-hidden cursor-default animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Terminal Title Bar */}
        <div className="p-4 bg-[#020203] border-b border-[#02F74C]/30 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#02F74C]/10 border border-[#02F74C]/30 flex items-center justify-center text-[#02F74C]">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                <span>&lt;EMAIL_TRANSMISSION_INTERFACE /&gt;</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#02F74C]/20 text-[#02F74C] font-mono">
                  ACTIVE
                </span>
              </h3>
              <p className="text-[10px] text-[#A6A9AA]">
                Direct electronic mail endpoint for Shubham Saini
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-[#A6A9AA] hover:text-white hover:bg-[#02F74C]/10 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 sm:p-5 space-y-4 sm:space-y-5 max-h-[75vh] sm:max-h-[80vh] overflow-y-auto">
          {/* Target Address Card */}
          <div className="p-3.5 bg-[#020203] border border-[#02F74C]/30 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[10px] text-[#76A988] block uppercase">
                DESTINATION_ENDPOINT:
              </span>
              <span className="text-xs sm:text-sm font-bold text-[#02F74C] tracking-wide select-all break-all">
                {email}
              </span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleCopy}
                className="px-3 py-1.5 bg-[#0A0D0C] hover:bg-[#02F74C]/15 border border-[#02F74C]/40 text-[#02F74C] text-[11px] font-bold rounded flex items-center gap-1.5 transition-all cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#02F74C]" />
                    <span>COPIED!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>COPY EMAIL</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Quick External Mailer Options */}
          <div>
            <span className="text-[10px] text-[#76A988] uppercase block mb-2 font-bold">
              &gt; LAUNCH_EXTERNAL_MAIL_CLIENT:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <a
                href={gmailUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-[#020203] border border-[#02F74C]/30 hover:border-[#02F74C] rounded-lg flex items-center justify-between text-xs font-bold text-white hover:text-[#02F74C] transition-all group shadow-[0_0_10px_rgba(2,247,76,0.05)] hover:shadow-[0_0_15px_rgba(2,247,76,0.2)]"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500" />
                  <span>Open in Web Gmail</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-[#76A988] group-hover:text-[#02F74C]" />
              </a>

              <a
                href={mailtoUrl}
                className="p-3 bg-[#020203] border border-[#02F74C]/30 hover:border-[#02F74C] rounded-lg flex items-center justify-between text-xs font-bold text-white hover:text-[#02F74C] transition-all group shadow-[0_0_10px_rgba(2,247,76,0.05)] hover:shadow-[0_0_15px_rgba(2,247,76,0.2)]"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#02F74C]" />
                  <span>Default Mail App</span>
                </div>
                <Mail className="w-3.5 h-3.5 text-[#76A988] group-hover:text-[#02F74C]" />
              </a>
            </div>
          </div>

          {/* Direct Instant Email Transmission Form */}
          <div className="border-t border-[#02F74C]/20 pt-4">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-[#02F74C]" />
              <span className="text-[11px] font-bold text-white uppercase tracking-wider">
                Or Transmit Direct Webmail Right Here:
              </span>
            </div>

            {status === 'success' && (
              <div className="mb-4 p-3 bg-[#02F74C]/10 border border-[#02F74C] rounded-lg text-[#02F74C] text-xs flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Message sent successfully.</span>
              </div>
            )}

            {status === 'error' && (
              <div className="mb-4 p-3 bg-red-950/60 border border-red-500 rounded-lg text-red-300 text-xs flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errMsg}</span>
              </div>
            )}

            <form onSubmit={handleDirectSend} className="space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-[#02F74C] block mb-1 uppercase font-bold">
                    &gt; YOUR_NAME:
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name..."
                    className="w-full px-3 py-2 bg-[#020203] border border-[#02F74C]/30 text-white rounded text-base sm:text-xs focus:outline-none focus:border-[#02F74C]"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-[#02F74C] block mb-1 uppercase font-bold">
                    &gt; YOUR_EMAIL:
                  </label>
                  <input
                    type="email"
                    required
                    value={senderEmail}
                    onChange={(e) => setSenderEmail(e.target.value)}
                    placeholder="your-email@example.com"
                    className="w-full px-3 py-2 bg-[#020203] border border-[#02F74C]/30 text-white rounded text-base sm:text-xs focus:outline-none focus:border-[#02F74C]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] text-[#02F74C] block mb-1 uppercase font-bold">
                  &gt; SUBJECT:
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Subject inquiry / project collaboration"
                  className="w-full px-3 py-2 bg-[#020203] border border-[#02F74C]/30 text-white rounded text-base sm:text-xs focus:outline-none focus:border-[#02F74C]"
                />
              </div>

              <div>
                <label className="text-[10px] text-[#02F74C] block mb-1 uppercase font-bold">
                  &gt; MESSAGE:
                </label>
                <textarea
                  rows={3}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write your message here..."
                  className="w-full px-3 py-2 bg-[#020203] border border-[#02F74C]/30 text-white rounded text-base sm:text-xs focus:outline-none focus:border-[#02F74C] resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full py-2.5 bg-[#02F74C] hover:bg-[#02F74C]/90 text-[#020203] text-xs font-bold uppercase tracking-wider rounded shadow-[0_0_15px_rgba(2,247,76,0.3)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {status === 'loading' ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Transmitting Packet...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Email Packet</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-[#020203] border-t border-[#02F74C]/20 flex items-center justify-between text-[10px] text-[#A6A9AA]">
          <span>Security: End-to-end encrypted packet transmission</span>
          <button
            type="button"
            onClick={onClose}
            className="text-[#02F74C] hover:underline cursor-pointer"
          >
            [ Close Interface ]
          </button>
        </div>
      </div>
    </div>
  );
};
