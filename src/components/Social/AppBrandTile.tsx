import React from 'react';
import { AppBrandIcon, AppPlatform } from './AppBrandIcon';
import { ExternalLink, ArrowUpRight } from 'lucide-react';

interface AppBrandTileProps {
  platform: AppPlatform;
  label: string;
  url: string;
  description?: string;
  badge?: string;
  onClick?: (e: React.MouseEvent) => void;
  size?: 'sm' | 'md' | 'lg';
  layout?: 'card' | 'pill' | 'button' | 'circle';
  className?: string;
}

const brandThemeMap: Record<
  string,
  {
    borderHover: string;
    glowHover: string;
    accentColor: string;
    bgHover: string;
    tagText: string;
  }
> = {
  linkedin: {
    borderHover: 'hover:border-[#0A66C2]',
    glowHover: 'hover:shadow-[0_0_30px_rgba(10,102,194,0.45)]',
    accentColor: '#0A66C2',
    bgHover: 'hover:bg-[#0A66C2]/10',
    tagText: 'CONNECT / INMAIL',
  },
  github: {
    borderHover: 'hover:border-[#02F74C]',
    glowHover: 'hover:shadow-[0_0_30px_rgba(2,247,76,0.35)]',
    accentColor: '#02F74C',
    bgHover: 'hover:bg-[#02F74C]/10',
    tagText: 'CODEBASE / REPOS',
  },
  instagram: {
    borderHover: 'hover:border-[#E1306C]',
    glowHover: 'hover:shadow-[0_0_30px_rgba(225,48,108,0.45)]',
    accentColor: '#E1306C',
    bgHover: 'hover:bg-[#E1306C]/10',
    tagText: 'VISUAL / DM',
  },
  whatsapp: {
    borderHover: 'hover:border-[#25D366]',
    glowHover: 'hover:shadow-[0_0_30px_rgba(37,211,102,0.45)]',
    accentColor: '#25D366',
    bgHover: 'hover:bg-[#25D366]/10',
    tagText: 'INSTANT / CHAT',
  },
  email: {
    borderHover: 'hover:border-[#EA4335]',
    glowHover: 'hover:shadow-[0_0_30px_rgba(234,67,53,0.4)]',
    accentColor: '#EA4335',
    bgHover: 'hover:bg-[#EA4335]/10',
    tagText: 'DISPATCH / INBOX',
  },
  phone: {
    borderHover: 'hover:border-[#02F74C]',
    glowHover: 'hover:shadow-[0_0_30px_rgba(2,247,76,0.4)]',
    accentColor: '#02F74C',
    bgHover: 'hover:bg-[#02F74C]/10',
    tagText: 'VOICE / SMS',
  },
  leetcode: {
    borderHover: 'hover:border-[#FFA116]',
    glowHover: 'hover:shadow-[0_0_30px_rgba(255,161,22,0.4)]',
    accentColor: '#FFA116',
    bgHover: 'hover:bg-[#FFA116]/10',
    tagText: 'ALGORITHMS / DSA',
  },
};

export const AppBrandTile: React.FC<AppBrandTileProps> = ({
  platform,
  label,
  url,
  description,
  badge,
  onClick,
  size = 'md',
  layout = 'card',
  className = '',
}) => {
  const norm = platform.toLowerCase().trim();
  const theme = brandThemeMap[norm] || {
    borderHover: 'hover:border-[#02F74C]',
    glowHover: 'hover:shadow-[0_0_25px_rgba(2,247,76,0.35)]',
    accentColor: '#02F74C',
    bgHover: 'hover:bg-[#02F74C]/10',
    tagText: 'LINK',
  };

  const isEmail = norm === 'email' || norm === 'gmail';

  // CIRCLE LAYOUT (For prominent interactive circular hub in Contact section)
  if (layout === 'circle') {
    return (
      <a
        href={url}
        onClick={onClick}
        target={isEmail ? '_self' : '_blank'}
        rel="noopener noreferrer"
        className={`group relative flex flex-col items-center gap-2.5 transition-all duration-300 hover:-translate-y-1.5 cursor-pointer ${className}`}
      >
        {/* Glow ambient background aura on hover */}
        <div
          className="absolute -inset-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-lg"
          style={{ backgroundColor: theme.accentColor, filter: 'blur(16px)' }}
        />

        {/* 3D App Tile Disc Container */}
        <div
          className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl p-1 bg-[#0A0D0C]/90 border border-white/10 group-hover:border-white/30 backdrop-blur-md flex items-center justify-center transition-all duration-300 shadow-xl group-hover:scale-105 ${theme.glowHover}`}
        >
          <AppBrandIcon platform={platform} size={size === 'lg' ? 'lg' : 'md'} variant="app-tile" animated />
          {/* Subtle live indicator dot */}
          <span
            className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full border-2 border-[#0A0D0C]"
            style={{ backgroundColor: theme.accentColor }}
          />
        </div>

        {/* Brand label & Micro-Tag */}
        <div className="flex flex-col items-center text-center">
          <span className="text-xs sm:text-sm font-bold text-white group-hover:text-white flex items-center gap-1 font-mono transition-colors">
            <span>{label}</span>
            <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
          </span>
          <span className="text-[10px] text-[#A6A9AA] font-mono tracking-wider uppercase group-hover:text-[#02F74C] transition-colors">
            {badge || theme.tagText}
          </span>
        </div>
      </a>
    );
  }

  // CARD LAYOUT (Detailed technical card with app icon, badge, description, and link action)
  if (layout === 'card') {
    return (
      <a
        href={url}
        onClick={onClick}
        target={isEmail ? '_self' : '_blank'}
        rel="noopener noreferrer"
        className={`group relative p-4 rounded-xl bg-[#0A0D0C]/80 border border-white/10 ${theme.borderHover} ${theme.glowHover} transition-all duration-300 hover:-translate-y-1 flex items-center gap-4 cursor-pointer backdrop-blur-sm ${className}`}
      >
        <div className="shrink-0">
          <AppBrandIcon platform={platform} size="md" variant="app-tile" animated />
        </div>

        <div className="flex-1 min-w-0 font-mono">
          <div className="flex items-center gap-2">
            <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-white transition-colors truncate">
              {label}
            </h4>
            <span
              className="text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider shrink-0"
              style={{
                backgroundColor: `${theme.accentColor}20`,
                color: theme.accentColor,
                border: `1px solid ${theme.accentColor}40`,
              }}
            >
              {badge || theme.tagText}
            </span>
          </div>
          {description && (
            <p className="text-[11px] text-[#A6A9AA] group-hover:text-[#F3F3F4] transition-colors truncate mt-0.5">
              {description}
            </p>
          )}
        </div>

        <div className="shrink-0 text-white/30 group-hover:text-white transition-colors">
          <ArrowUpRight className="w-4 h-4" />
        </div>
      </a>
    );
  }

  // PILL / BADGE LAYOUT (Compact floating ribbon or hero toolbar)
  return (
    <a
      href={url}
      onClick={onClick}
      target={isEmail ? '_self' : '_blank'}
      rel="noopener noreferrer"
      className={`group inline-flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-[#0A0D0C]/90 border border-white/10 ${theme.borderHover} ${theme.glowHover} transition-all duration-200 hover:scale-105 cursor-pointer backdrop-blur-md ${className}`}
    >
      <AppBrandIcon platform={platform} size="xs" variant="app-tile" />
      <span className="text-xs font-bold text-slate-200 group-hover:text-white font-mono transition-colors">
        {label}
      </span>
      <ArrowUpRight className="w-3 h-3 text-[#A6A9AA] group-hover:text-white transition-colors" />
    </a>
  );
};
