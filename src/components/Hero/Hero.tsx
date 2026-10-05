import React from 'react';
import { motion } from 'framer-motion';
import { ArrowDownRight, Terminal, Download } from 'lucide-react';
import { Profile, SocialLink } from '../../types';
import { InteractiveOrbitRing, CodeTag, CodeClosingTag, HeroConnectionCircuitFrame } from '../Decorative/DevGraphics';
import { AppBrandIcon } from '../Social/AppBrandIcon';
import { formatSocialUrl } from '../../utils/urlHelper';

interface HeroProps {
  profile: Profile;
  socialLinks?: SocialLink[];
}

const platformHoverStyles: Record<string, string> = {
  github: 'hover:border-[#02F74C] hover:shadow-[0_0_15px_rgba(2,247,76,0.3)]',
  linkedin: 'hover:border-[#0A66C2] hover:shadow-[0_0_15px_rgba(10,102,194,0.4)]',
  whatsapp: 'hover:border-[#25D366] hover:shadow-[0_0_15px_rgba(37,211,102,0.4)]',
  instagram: 'hover:border-[#E1306C] hover:shadow-[0_0_15px_rgba(225,48,108,0.4)]',
  email: 'hover:border-[#EA4335] hover:shadow-[0_0_15px_rgba(234,67,53,0.3)]',
  phone: 'hover:border-[#02F74C] hover:shadow-[0_0_15px_rgba(2,247,76,0.4)]',
  leetcode: 'hover:border-[#FFA116] hover:shadow-[0_0_15px_rgba(255,161,22,0.4)]',
};

export const Hero: React.FC<HeroProps> = ({ profile, socialLinks = [] }) => {
  // Derive dynamic channels from active socialLinks or fallback to profile-derived defaults
  const activeLinks = socialLinks.filter((s) => s.is_active);

  const displayChannels =
    activeLinks.length > 0
      ? activeLinks
      : [
          {
            id: 'def-gh',
            platform: 'github' as const,
            label: 'GitHub',
            url: 'https://github.com/Corder-s',
            is_active: true,
            display_order: 1,
          },
          {
            id: 'def-li',
            platform: 'linkedin' as const,
            label: 'LinkedIn',
            url: 'https://www.linkedin.com/in/shubham-saini-33537a374/',
            is_active: true,
            display_order: 2,
          },
          {
            id: 'def-wa',
            platform: 'whatsapp' as const,
            label: 'WhatsApp',
            url: 'https://wa.me/918958364005',
            is_active: true,
            display_order: 3,
          },
          {
            id: 'def-ig',
            platform: 'instagram' as const,
            label: 'Instagram',
            url: 'https://instagram.com/damn.itz_shubham/',
            is_active: true,
            display_order: 4,
          },
          {
            id: 'def-em',
            platform: 'email' as const,
            label: 'Email',
            url: profile.email
              ? formatSocialUrl('email', profile.email)
              : 'mailto:damnitzshuham1406@gmail.com',
            is_active: true,
            display_order: 5,
          },
        ];
  return (
    <section
      id="home"
      className="relative min-h-screen pt-28 pb-16 lg:pt-36 lg:pb-24 flex items-center border-b border-[#02F74C]/20 overflow-hidden bg-[#020203]"
    >
      {/* Subtle Grid Line Elements */}
      <div className="absolute inset-0 pointer-events-none dev-grid-bg opacity-30" />

      {/* Top Status & Code Label Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 mb-6 border-b border-[#02F74C]/15 font-mono text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-[#02F74C] rounded-full animate-ping" />
            <span className="w-2 h-2 bg-[#02F74C] rounded-full -ml-3" />
            <span className="text-[#02F74C] font-semibold tracking-wider text-[11px] uppercase">
              {profile.availability_status || 'AVAILABLE FOR OPPORTUNITIES'}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[#A6A9AA] text-[11px]">
            <span className="text-[#02F74C]/70">v2.6.0</span>
            <span>•</span>
            <span className="text-[#76A988]">LAT 28.4744° N, LNG 77.5040° E</span>
            <span>•</span>
            <span>GREATER NOIDA, IN</span>
          </div>
        </div>

        {/* Hero Code Intro Tag */}
        <div className="font-mono text-xs text-[#76A988] mb-4 select-none">
          <CodeTag tag="main" /> <CodeTag tag="hero" />
        </div>

        {/* Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Left Column: Futuristic Massive Developer Typography (7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            {/* Developer Prompt Snippet */}
            <motion.div
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1 bg-[#0A0D0C] border border-[#02F74C]/30 text-[#02F74C] text-xs font-mono mb-4 w-fit"
            >
              <Terminal className="w-3.5 h-3.5 text-[#02F74C]" />
              <span>const developer = &quot;Shubham Saini&quot;;</span>
            </motion.div>

            {/* Giant Heading Framed by Connection Circuit Lines */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <HeroConnectionCircuitFrame>
                <div className="font-mono text-xs sm:text-sm text-[#A6A9AA] mb-1">
                  Hi, I&apos;m
                </div>
                <h1 className="font-code-header text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-[#F3F3F4] tracking-tight leading-[0.95] uppercase break-words">
                  <span className="text-[#EF4444]">S</span>HUBHAM <br />
                  <span className="text-[#EF4444]">S</span><span className="text-[#02F74C] glow-neon">AINI</span>
                </h1>
                <div className="font-mono text-[11px] sm:text-xs text-[#76A988]/80 select-none mt-1.5 pl-0.5">
                  &lt;/h1&gt;
                </div>

                {/* Sub-headline aligned with Dribbble developer reference */}
                <div className="mt-4 space-y-2">
                  <div className="font-mono text-sm sm:text-base md:text-lg flex items-center gap-1.5 flex-wrap">
                    <span className="text-[#76A988] select-none">&lt;p&gt;</span>
                    <span className="text-[#02F74C] font-semibold glow-neon">
                      B.Tech CSE Student &amp; Full-Stack Developer
                    </span>
                    <span className="text-[#76A988] select-none">&lt;/p&gt;</span>
                  </div>
                  <p className="font-mono text-xs sm:text-sm text-[#A6A9AA] max-w-lg leading-relaxed pt-1">
                    Building modern web applications and exploring AI-powered solutions.
                  </p>
                </div>
              </HeroConnectionCircuitFrame>
            </motion.div>

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center font-mono"
            >
              <a
                href="#projects"
                className="w-full sm:w-auto justify-center px-6 py-3 border border-[#02F74C] bg-[#02F74C] text-[#020203] text-xs sm:text-sm font-bold tracking-wider uppercase transition-all shadow-[0_0_15px_rgba(2,247,76,0.35)] hover:shadow-[0_0_25px_rgba(2,247,76,0.6)] hover:scale-[1.02] flex items-center gap-2 text-center"
              >
                <span>[ VIEW MY WORK ]</span>
                <ArrowDownRight className="w-4 h-4" />
              </a>

              <a
                href="#contact"
                className="w-full sm:w-auto justify-center px-6 py-3 border border-[#02F74C]/50 hover:border-[#02F74C] bg-[#0A0D0C] text-[#02F74C] text-xs sm:text-sm font-bold tracking-wider uppercase transition-all hover:bg-[#02F74C]/10 flex items-center gap-2 text-center"
              >
                <span>[ CONTACT ME ]</span>
                <ArrowDownRight className="w-4 h-4" />
              </a>

              <a
                href={profile.resume_url || '/resume.pdf'}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto justify-center px-4 py-3 border border-[#02F74C]/30 hover:border-[#02F74C] bg-[#0A0D0C] text-[#A6A9AA] hover:text-[#02F74C] text-xs sm:text-sm font-bold tracking-wider uppercase transition-all hover:bg-[#02F74C]/10 flex items-center gap-2 text-center"
              >
                <Download className="w-4 h-4" />
                <span>[ RESUME ]</span>
              </a>
            </motion.div>

            {/* Quick App Access Strip with Official App Badges */}
            <div className="mt-6 flex flex-wrap items-center gap-2 font-mono">
              <span className="text-[11px] text-[#76A988] font-bold mr-1">
                // CONNECT:
              </span>
              {displayChannels.map((link) => {
                let targetUrl = link.url;
                if (link.platform === 'phone' && profile.phone) {
                  targetUrl = formatSocialUrl('phone', profile.phone);
                } else if (link.platform === 'whatsapp') {
                  targetUrl = formatSocialUrl('whatsapp', link.url || profile.phone);
                } else if (link.platform === 'email' && profile.email) {
                  targetUrl = formatSocialUrl('email', profile.email);
                } else {
                  targetUrl = formatSocialUrl(link.platform, link.url);
                }

                const formattedUrl = targetUrl;
                const hoverStyle =
                  platformHoverStyles[link.platform.toLowerCase()] ||
                  'hover:border-[#02F74C] hover:shadow-[0_0_15px_rgba(2,247,76,0.3)]';
                const isSelf = link.platform.toLowerCase() === 'email' || link.platform.toLowerCase() === 'phone';

                return (
                  <a
                    key={link.id || link.platform}
                    href={formattedUrl}
                    target={isSelf ? '_self' : '_blank'}
                    rel={isSelf ? undefined : 'noopener noreferrer'}
                    className={`group inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#0A0D0C] border border-white/10 transition-all hover:scale-105 ${hoverStyle}`}
                    title={link.label || `Connect on ${link.platform}`}
                  >
                    <AppBrandIcon platform={link.platform} size="xs" variant="app-tile" />
                    <span className="text-[11px] font-bold text-slate-300 group-hover:text-white">
                      {link.label || link.platform}
                    </span>
                  </a>
                );
              })}
            </div>

            {/* Terminal Status Ticker */}
            <div className="mt-8 sm:mt-10 pt-4 border-t border-[#02F74C]/15 grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-3 sm:gap-6 font-mono text-[11px] text-[#A6A9AA]">
              <div className="flex items-center gap-2">
                <span className="text-[#02F74C]">&gt;</span>
                <span>SYS: <strong className="text-[#02F74C]">ONLINE (200 OK)</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#02F74C]">&gt;</span>
                <span>STACK: <strong className="text-[#F3F3F4]">REACT / NODE / JAVA</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#02F74C]">&gt;</span>
                <span>PORT: <strong className="text-[#F3F3F4]">5173</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#02F74C]">&gt;</span>
                <span>MODE: <strong className="text-[#02F74C]">ENGINEERING</strong></span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Orbit Ring with Center LinkedIn Avatar (5 cols) */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center relative w-full">
            <InteractiveOrbitRing
              profileUrl="https://www.linkedin.com/in/shubham-saini-33537a374/"
              name={profile.name || 'Shubham Saini'}
            />
          </div>
        </div>

        {/* Hero Closing Code Tag */}
        <div className="font-mono text-xs text-[#76A988] mt-6 select-none">
          <CodeClosingTag tag="hero" />
        </div>
      </div>
    </section>
  );
};
