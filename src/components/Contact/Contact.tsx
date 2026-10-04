import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle, Loader2, MessageSquare, ExternalLink } from 'lucide-react';
import confetti from 'canvas-confetti';
import { contactService } from '../../services/contactService';
import { SocialLink, Profile } from '../../types';
import { GithubIcon, LinkedinIcon, InstagramIcon } from '../Decorative/Scribbles';
import { CodeTag, CodeClosingTag } from '../Decorative/DevGraphics';
import { EmailInterfaceModal } from './EmailInterfaceModal';
import { AppBrandIcon } from '../Social/AppBrandIcon';
import { AppBrandTile } from '../Social/AppBrandTile';

interface ContactProps {
  profile: Profile;
  socialLinks: SocialLink[];
}

export const Contact: React.FC<ContactProps> = ({ profile, socialLinks }) => {
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    honeypot: '',
  });

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const activeLinks = socialLinks.filter((link) => link.is_active);

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'github':
        return <GithubIcon className="w-5 h-5 text-[#02F74C]" />;
      case 'linkedin':
        return <LinkedinIcon className="w-5 h-5 text-[#02F74C]" />;
      case 'instagram':
        return <InstagramIcon className="w-5 h-5 text-[#02F74C]" />;

      case 'whatsapp':
        return <MessageSquare className="w-5 h-5 text-[#02F74C]" />;
      case 'phone':
        return <Phone className="w-5 h-5 text-[#02F74C]" />;
      default:
        return <Mail className="w-5 h-5 text-[#02F74C]" />;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setStatus('error');
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    setStatus('loading');

    try {
      const response = await contactService.submitMessage({
        name: formData.name,
        email: formData.email,
        subject: formData.subject || 'Portfolio Inquiry',
        message: formData.message,
        honeypot: formData.honeypot,
      });

      if (response.success) {
        setStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '', honeypot: '' });
        try {
          confetti({
            particleCount: 70,
            spread: 80,
            origin: { y: 0.7 },
            colors: ['#02F74C', '#19C84A', '#76A988', '#F3F3F4'],
          });
        } catch {
          // ignore
        }
      } else {
        setStatus('error');
        setErrorMessage(
          response.error || 'Unable to send your message. Please try again or contact me directly.'
        );
      }
    } catch (err: any) {
      setStatus('error');
      setErrorMessage(
        err.message || 'Unable to send your message. Please try again or contact me directly.'
      );
    }
  };

  return (
    <section id="contact" className="py-20 lg:py-28 border-b border-[#02F74C]/20 bg-[#020203] font-mono">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Code Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#02F74C]/20 pb-5 mb-12">
          <div>
            <div className="text-xs text-[#02F74C] font-semibold mb-1 flex items-center gap-2">
              <span>/07</span>
              <span>•</span>
              <CodeTag tag="CONNECT WITH ME />" />
            </div>
            <h2 className="font-code-header text-3xl sm:text-5xl text-[#F3F3F4] uppercase font-bold tracking-tight">
              TRANSMISSION_STATION
            </h2>
          </div>
          <div className="text-xs text-[#76A988]">
            // DIRECT_LINK_COMMUNICATION
          </div>
        </div>

        {/* Large Centered Text Header */}
        <div className="text-center my-10 max-w-3xl mx-auto">
          <h3 className="font-code-header text-4xl sm:text-6xl font-black text-[#F3F3F4] tracking-tight uppercase">
            LET&apos;S <span className="text-[#02F74C] glow-neon">BUILD</span> SOMETHING.
          </h3>
          <p className="text-xs sm:text-sm text-[#A6A9AA] mt-3">
            Open for summer software engineering internships, collaborative software development, and technical discourse.
          </p>
        </div>

        {/* Circular 3D App Ecosystem Badges */}
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 md:gap-10 my-8 sm:my-10">
          {activeLinks.map((link) => (
            <AppBrandTile
              key={link.id}
              platform={link.platform}
              label={link.label}
              url={link.url}
              layout="circle"
              size="lg"
              onClick={(e) => {
                if (link.platform === 'email') {
                  e.preventDefault();
                  setIsEmailModalOpen(true);
                }
              }}
            />
          ))}
        </div>

        {/* Direct Email Address Display & 1-Click Interface Trigger */}
        <div className="flex justify-center -mt-2 mb-8 sm:mb-10 px-2 text-center">
          <button
            type="button"
            onClick={() => setIsEmailModalOpen(true)}
            className="inline-flex flex-wrap items-center justify-center gap-3 px-5 py-2.5 bg-[#0A0D0C] hover:bg-[#EA4335]/10 border border-[#EA4335]/40 hover:border-[#EA4335] rounded-full text-xs text-white transition-all shadow-[0_0_20px_rgba(234,67,53,0.15)] cursor-pointer group"
          >
            <AppBrandIcon platform="email" size="xs" variant="app-tile" />
            <span className="font-bold tracking-wider text-slate-200 group-hover:text-white break-all">
              {profile.email || 'damnitzshuham1406@gmail.com'}
            </span>
            <span className="text-[10px] px-2 py-0.5 bg-[#EA4335]/20 text-[#EA4335] border border-[#EA4335]/30 rounded uppercase font-bold shrink-0">
              Open Direct Interface
            </span>
          </button>
        </div>

        {/* Real Terminal Contact Form Container */}
        <div className="max-w-3xl mx-auto border border-[#02F74C] bg-[#0A0D0C] p-4 sm:p-8 lg:p-10 shadow-[0_0_35px_rgba(2,247,76,0.12)] relative">
          {/* Terminal Title Bar */}
          <div className="flex items-center justify-between border-b border-[#02F74C]/25 pb-3 mb-6 text-xs text-[#76A988]">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#02F74C]/80 inline-block" />
              <span>terminal_contact_daemon.sh</span>
            </div>
            <span className="text-[#02F74C]">PORT: 5173</span>
          </div>

          {status === 'success' && (
            <div className="mb-6 border border-[#02F74C] bg-[#02F74C]/10 p-4 text-[#02F74C] flex items-start gap-3 shadow-[0_0_15px_rgba(2,247,76,0.2)]">
              <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5 text-[#02F74C]" />
              <div>
                <p className="text-xs font-bold uppercase tracking-wider">Message sent successfully.</p>
                <p className="text-[11px] text-[#A6A9AA] mt-0.5">
                  Your transmission was confirmed and recorded in Supabase. I will review and reply to your email shortly.
                </p>
              </div>
            </div>
          )}

          {status === 'error' && (
            <div className="mb-6 border border-red-500 bg-red-950/40 p-4 text-red-300 flex items-start gap-3 shadow-[0_0_15px_rgba(220,38,38,0.2)]">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-400" />
              <div>
                <p className="text-xs font-bold uppercase tracking-wider">TRANSMISSION ERROR</p>
                <p className="text-[11px] text-red-200 mt-0.5">{errorMessage}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* Anti-spam honeypot field (hidden from legitimate visitors) */}
            <div className="hidden" aria-hidden="true">
              <label htmlFor="company_hp">Organization verification</label>
              <input
                id="company_hp"
                type="text"
                name="company_hp"
                tabIndex={-1}
                autoComplete="off"
                value={formData.honeypot}
                onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
              />
            </div>

            <div>
              <label htmlFor="name" className="text-[#02F74C] block mb-1 font-bold">
                &gt; name:
              </label>
              <input
                id="name"
                type="text"
                required
                maxLength={100}
                placeholder="Enter your name..."
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#020203] border border-[#02F74C]/40 text-[#F3F3F4] text-base sm:text-xs placeholder:text-[#A6A9AA]/50 focus:outline-none focus:border-[#02F74C] focus:shadow-[0_0_10px_rgba(2,247,76,0.25)]"
              />
            </div>

            <div>
              <label htmlFor="email" className="text-[#02F74C] block mb-1 font-bold">
                &gt; email:
              </label>
              <input
                id="email"
                type="email"
                required
                maxLength={100}
                placeholder="Enter your contact email..."
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#020203] border border-[#02F74C]/40 text-[#F3F3F4] text-base sm:text-xs placeholder:text-[#A6A9AA]/50 focus:outline-none focus:border-[#02F74C] focus:shadow-[0_0_10px_rgba(2,247,76,0.25)]"
              />
            </div>

            <div>
              <label htmlFor="subject" className="text-[#02F74C] block mb-1 font-bold">
                &gt; subject:
              </label>
              <input
                id="subject"
                type="text"
                maxLength={150}
                placeholder="Subject inquiry..."
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#020203] border border-[#02F74C]/40 text-[#F3F3F4] text-base sm:text-xs placeholder:text-[#A6A9AA]/50 focus:outline-none focus:border-[#02F74C] focus:shadow-[0_0_10px_rgba(2,247,76,0.25)]"
              />
            </div>

            <div>
              <label htmlFor="message" className="text-[#02F74C] block mb-1 font-bold">
                &gt; message:
              </label>
              <textarea
                id="message"
                required
                rows={4}
                maxLength={3000}
                placeholder="Write your message here..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#020203] border border-[#02F74C]/40 text-[#F3F3F4] text-base sm:text-xs placeholder:text-[#A6A9AA]/50 focus:outline-none focus:border-[#02F74C] focus:shadow-[0_0_10px_rgba(2,247,76,0.25)] resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full py-3.5 px-6 border border-[#02F74C] bg-[#02F74C] text-[#020203] text-xs sm:text-sm font-bold tracking-wider uppercase transition-all shadow-[0_0_15px_rgba(2,247,76,0.35)] hover:shadow-[0_0_25px_rgba(2,247,76,0.6)] cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 mt-4"
            >
              {status === 'loading' ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>[ TRANSMITTING_PACKET... ]</span>
                </>
              ) : (
                <span>[ SEND_MESSAGE /&gt;</span>
              )}
            </button>
          </form>
        </div>

        {/* Full Interactive App Channels Matrix with Official Badges */}
        <div className="mt-12 max-w-4xl mx-auto">
          <div className="flex items-center justify-between border-b border-[#02F74C]/20 pb-3 mb-6">
            <span className="text-xs font-bold text-[#02F74C] uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#02F74C] animate-ping" />
              <span>// ACTIVE_CHANNELS_HUB</span>
            </span>
            <span className="text-[11px] text-[#76A988]">OFFICIAL_SERVICES</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {activeLinks.map((link) => (
              <AppBrandTile
                key={link.id}
                platform={link.platform}
                label={link.label}
                url={link.url}
                layout="card"
                description={
                  link.platform === 'linkedin'
                    ? 'Professional profile, recommendations & InMail'
                    : link.platform === 'github'
                    ? 'Source code, repositories & technical activity'
                    : link.platform === 'whatsapp'
                    ? 'Instant direct messaging & project discussions'
                    : link.platform === 'instagram'
                    ? 'Visual dev work, creative projects & stories'
                    : link.platform === 'email'
                    ? 'Formal inquiries, resume reviews & hiring'
                    : link.platform === 'phone'
                    ? 'Direct voice call & cellular text line'
                    : 'External communication channel'
                }
                onClick={(e) => {
                  if (link.platform === 'email') {
                    e.preventDefault();
                    setIsEmailModalOpen(true);
                  }
                }}
              />
            ))}
          </div>
        </div>

        {/* Section Code Footer */}
        <div className="text-xs text-[#76A988] mt-6 select-none">
          <CodeClosingTag tag="CONNECT WITH ME" />
        </div>
      </div>

      {/* Direct Email Transmission Interface Modal */}
      <EmailInterfaceModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        email={profile.email || 'damnitzshuham1406@gmail.com'}
      />
    </section>
  );
};
