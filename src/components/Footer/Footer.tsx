import React from 'react';
import { ArrowUp } from 'lucide-react';
import { SocialLink } from '../../types';
import { CodeTag, CodeClosingTag } from '../Decorative/DevGraphics';
import { AppBrandIcon } from '../Social/AppBrandIcon';

interface FooterProps {
  socialLinks: SocialLink[];
}

export const Footer: React.FC<FooterProps> = ({ socialLinks }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navLinks = [
    { label: '/01 ABOUT', href: '#about' },
    { label: '/02 WORK', href: '#projects' },
    { label: '/03 STACK', href: '#skills' },
    { label: '/04 EXPERIENCE', href: '#experience' },
    { label: '/05 CONTACT', href: '#contact' },
  ];

  return (
    <footer className="bg-[#020203] text-[#F3F3F4] pt-16 pb-12 border-t border-[#02F74C]/20 font-mono">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Code File Opening Tag */}
        <div className="text-xs text-[#02F74C] mb-6 select-none">
          &lt;FOOTER&gt;
        </div>

        {/* Identity & Top Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-[#02F74C]/15">
          <div>
            <h2 className="font-code-header text-3xl sm:text-5xl font-black text-[#F3F3F4] tracking-tight">
              SHUBHAM SAINI
            </h2>
            <p className="text-xs sm:text-sm text-[#02F74C] mt-1 font-semibold">
              B.Tech CSE Student &amp; Aspiring Full-Stack Developer
            </p>
          </div>

          <button
            type="button"
            onClick={scrollToTop}
            className="border border-[#02F74C]/40 hover:border-[#02F74C] bg-[#0A0D0C] text-[#02F74C] px-4 py-2 text-xs font-bold uppercase transition-all hover:bg-[#02F74C]/10 flex items-center gap-2 cursor-pointer w-fit"
          >
            <span>[ BACK TO TOP ]</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Divider Line */}
        <div className="border-t border-[#02F74C]/15 my-6" />

        {/* Links Matrix */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-xs">
          {/* Sitemaps */}
          <div>
            <span className="text-[#02F74C] block uppercase font-bold mb-3">&gt; CODE_MODULES:</span>
            <div className="space-y-2 text-[#A6A9AA]">
              {navLinks.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="block hover:text-[#02F74C] transition-colors"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>

          {/* Social Links */}
          <div>
            <span className="text-[#02F74C] block uppercase font-bold mb-3">&gt; EXTERNAL_ENDPOINTS:</span>
            <div className="space-y-2.5 text-[#A6A9AA]">
              {socialLinks
                .filter((l) => l.is_active)
                .map((link) => (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2.5 py-1 text-slate-300 hover:text-white transition-colors group"
                  >
                    <div className="shrink-0 group-hover:scale-110 transition-transform">
                      <AppBrandIcon platform={link.platform} size="xs" variant="app-tile" />
                    </div>
                    <span className="font-semibold text-xs tracking-wider group-hover:text-white transition-colors">
                      {link.label}
                    </span>
                    <span className="text-[10px] text-[#02F74C] opacity-0 group-hover:opacity-100 transition-opacity">&gt;&gt;</span>
                  </a>
                ))}
            </div>
          </div>

          {/* Status & Availability */}
          <div>
            <span className="text-[#02F74C] block uppercase font-bold mb-3">&gt; STATUS_FEED:</span>
            <p className="text-[11px] text-[#A6A9AA] mb-3 leading-relaxed">
              Available for full-stack engineering roles, high-impact product builds &amp; open source collaborations.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#02F74C]/10 border border-[#02F74C]/30 text-[#02F74C] text-xs">
              <span className="w-2 h-2 rounded-full bg-[#02F74C] animate-pulse" />
              <span>ACTIVE &amp; AVAILABLE</span>
            </div>
          </div>
        </div>

        {/* Divider Line */}
        <div className="border-t border-[#02F74C]/15 my-6" />

        {/* Colophon & Closing Tag */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#76A988]">
          <p>© 2026 SHUBHAM SAINI. ALL SYSTEMS OPERATIONAL.</p>
          <p className="text-[#02F74C]">&lt;/FOOTER&gt;</p>
        </div>
      </div>
    </footer>
  );
};
