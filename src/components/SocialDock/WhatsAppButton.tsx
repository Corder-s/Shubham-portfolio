import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  X,
  Mail,
  Phone,
  Send,
  ExternalLink,
  Copy,
  Check,
  Sparkles,
} from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '../Decorative/Scribbles';
import { SocialLink } from '../../types';
import { EmailInterfaceModal } from '../Contact/EmailInterfaceModal';
import { AppBrandIcon } from '../Social/AppBrandIcon';

interface WhatsAppButtonProps {
  phone?: string;
  email?: string;
  socialLinks?: SocialLink[];
}

export const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({
  phone = '+918958364005',
  email = 'damnitshuham1406@gmail.com',
  socialLinks = [],
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [copiedType, setCopiedType] = useState<'email' | 'phone' | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const cleanNumber = phone.replace(/[^0-9]/g, '');

  // Extract dynamic links or fallback to defaults
  const waLink =
    socialLinks.find((s) => s.platform === 'whatsapp' && s.is_active)?.url ||
    `https://wa.me/${cleanNumber}?text=${encodeURIComponent(
      'Hi Shubham, I visited your developer portfolio and would like to connect!'
    )}`;

  const liLink =
    socialLinks.find((s) => s.platform === 'linkedin' && s.is_active)?.url ||
    'https://www.linkedin.com/in/shubham-saini-33537a374/';

  const ghLink =
    socialLinks.find((s) => s.platform === 'github' && s.is_active)?.url ||
    'https://github.com/Corder-s';

  const mailLink = `mailto:${email}?subject=${encodeURIComponent(
    'Developer Inquiry / Project Collaboration'
  )}&body=${encodeURIComponent(
    'Hi Shubham,\n\nI was reviewing your developer portfolio and would like to discuss an opportunity.\n\nBest regards,'
  )}`;

  const telLink = `tel:${phone.replace(/\s+/g, '')}`;

  const copyToClipboard = (text: string, type: 'email' | 'phone') => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const channels = [
    {
      id: 'whatsapp',
      platform: 'whatsapp',
      name: 'WhatsApp Direct Chat',
      badge: 'INSTANT CHAT',
      desc: 'Send a quick text message or project inquiry directly to WhatsApp',
      href: waLink,
      actionText: 'Open Chat',
      color: '#25D366',
    },
    {
      id: 'linkedin',
      platform: 'linkedin',
      name: 'LinkedIn Message / InMail',
      badge: 'PROFESSIONAL',
      desc: 'Connect, message, and network on LinkedIn profile',
      href: liLink,
      actionText: 'View Profile',
      color: '#0A66C2',
    },
    {
      id: 'email',
      platform: 'email',
      name: 'Direct Email Dispatch',
      badge: 'GMAIL / INBOX',
      desc: email,
      href: mailLink,
      actionText: 'Send Email',
      color: '#EA4335',
      copyValue: email,
      copyType: 'email' as const,
    },
    {
      id: 'phone',
      platform: 'phone',
      name: 'Direct Call / SMS',
      badge: 'VOICE & SMS',
      desc: phone,
      href: telLink,
      actionText: 'Call / SMS',
      color: '#02F74C',
      copyValue: phone,
      copyType: 'phone' as const,
    },
    {
      id: 'github',
      platform: 'github',
      name: 'GitHub Profile & Issues',
      badge: 'CODEBASE',
      desc: 'Explore open source code, repositories, and technical contributions',
      href: ghLink,
      actionText: 'Browse Repos',
      color: '#ffffff',
    },
  ];

  return (
    <aside
      ref={menuRef}
      aria-label="Direct Communication Hub"
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end font-mono select-none"
    >
      {/* Pop-up Multi-Channel Options Modal */}
      {isOpen && (
        <div className="mb-3 w-[calc(100vw-2rem)] sm:w-[380px] max-w-[380px] bg-[#0A0D0C]/95 backdrop-blur-xl border border-[#02F74C]/40 shadow-[0_0_35px_rgba(2,247,76,0.25)] rounded-xl overflow-hidden animate-in fade-in slide-in-from-bottom-3 duration-200">
          {/* Header */}
          <div className="p-4 bg-[#020203] border-b border-[#02F74C]/20 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#02F74C] animate-ping" />
                <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <span>DISPATCH_TERMINAL</span>
                  <span className="text-[10px] px-1.5 py-0.2 bg-[#02F74C]/20 text-[#02F74C] rounded">
                    SYS: ONLINE
                  </span>
                </span>
              </div>
              <p className="text-[10px] text-[#A6A9AA] mt-1">
                Choose your preferred communication channel to send a message:
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1 rounded text-[#A6A9AA] hover:text-white hover:bg-[#02F74C]/10 transition-colors"
              title="Close terminal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Platform Channels List */}
          <div className="p-3 space-y-2 max-h-[360px] overflow-y-auto">
            {channels.map((ch) => (
              <div
                key={ch.id}
                className="group relative p-2.5 bg-[#020203]/70 hover:bg-[#02F74C]/10 border border-[#02F74C]/20 hover:border-[#02F74C] rounded-lg transition-all flex items-center justify-between gap-3"
              >
                <a
                  href={ch.href}
                  onClick={(e) => {
                    if (ch.id === 'email') {
                      e.preventDefault();
                      setIsOpen(false);
                      setIsEmailModalOpen(true);
                    } else {
                      setIsOpen(false);
                    }
                  }}
                  target={ch.id === 'phone' || ch.id === 'email' ? '_self' : '_blank'}
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 flex-1 min-w-0"
                >
                  <div className="shrink-0 group-hover:scale-110 transition-transform">
                    <AppBrandIcon platform={ch.platform} size="sm" variant="app-tile" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white truncate group-hover:text-white transition-colors">
                        {ch.name}
                      </span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#0A0D0C] border border-white/15 text-[#76A988] font-bold">
                        {ch.badge}
                      </span>
                    </div>
                    <p className="text-[10px] text-[#A6A9AA] truncate mt-0.5">{ch.desc}</p>
                  </div>
                </a>

                <div className="flex items-center gap-1 shrink-0">
                  {ch.copyValue && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        copyToClipboard(ch.copyValue!, ch.copyType!);
                      }}
                      className="p-1.5 text-[#A6A9AA] hover:text-[#02F74C] bg-[#0A0D0C] hover:bg-[#02F74C]/15 border border-[#02F74C]/30 rounded transition-colors"
                      title={`Copy ${ch.copyType}`}
                    >
                      {copiedType === ch.copyType ? (
                        <Check className="w-3.5 h-3.5 text-[#02F74C]" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  )}

                  <a
                    href={ch.href}
                    onClick={(e) => {
                      if (ch.id === 'email') {
                        e.preventDefault();
                        setIsOpen(false);
                        setIsEmailModalOpen(true);
                      } else {
                        setIsOpen(false);
                      }
                    }}
                    target={ch.id === 'phone' || ch.id === 'email' ? '_self' : '_blank'}
                    rel="noopener noreferrer"
                    className="p-1.5 text-[#02F74C] hover:text-white bg-[#0A0D0C] hover:bg-[#02F74C] border border-[#02F74C]/40 rounded transition-all"
                    title={ch.actionText}
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Fast Contact Link */}
          <div className="p-3 bg-[#020203] border-t border-[#02F74C]/20 flex items-center justify-between text-[11px]">
            <span className="text-[#A6A9AA]">Prefer a web message form?</span>
            <a
              href="#contact"
              onClick={() => setIsOpen(false)}
              className="text-[#02F74C] hover:underline font-bold flex items-center gap-1"
            >
              <span>Jump to Form</span>
              <Send className="w-3 h-3" />
            </a>
          </div>
        </div>
      )}

      {/* Floating Toggle Button */}
      <div className="flex items-center gap-3">
        {!isOpen && hovered && (
          <div
            role="tooltip"
            className="border border-[#02F74C] bg-[#0A0D0C] text-[#02F74C] px-3 py-1.5 text-[11px] font-bold tracking-wider uppercase shadow-[0_0_15px_rgba(2,247,76,0.3)] animate-in fade-in duration-150 rounded"
          >
            &lt; CONNECT / MESSAGE / CALL /&gt;
          </div>
        )}

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          aria-label={isOpen ? 'Close message options' : 'Open message options'}
          className={`w-14 h-14 rounded-full border bg-[#0A0D0C] flex items-center justify-center transition-all cursor-pointer ${
            isOpen
              ? 'border-[#02F74C] text-[#020203] bg-[#02F74C] shadow-[0_0_30px_rgba(2,247,76,0.8)] scale-105'
              : 'border-[#02F74C] text-[#02F74C] shadow-[0_0_20px_rgba(2,247,76,0.35)] hover:shadow-[0_0_35px_rgba(2,247,76,0.7)] hover:scale-110'
          }`}
        >
          {isOpen ? (
            <X className="w-6 h-6 stroke-[2.5]" />
          ) : (
            <div className="relative flex items-center justify-center">
              <AppBrandIcon platform="whatsapp" size="sm" variant="app-tile" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#02F74C] animate-ping" />
            </div>
          )}
        </button>
      </div>

      {/* Direct Email Transmission Interface Modal */}
      <EmailInterfaceModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        email={email}
      />
    </aside>
  );
};
