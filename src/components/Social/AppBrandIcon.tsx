import React from 'react';

export type AppPlatform =
  | 'linkedin'
  | 'github'
  | 'instagram'
  | 'whatsapp'
  | 'email'
  | 'gmail'
  | 'phone'
  | 'leetcode'
  | 'twitter'
  | 'x'
  | 'discord'
  | string;

interface AppBrandIconProps {
  platform: AppPlatform;
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'app-tile' | 'circle' | 'flat';
  animated?: boolean;
}

const sizeMap = {
  xs: 'w-4 h-4',
  sm: 'w-6 h-6',
  md: 'w-10 h-10',
  lg: 'w-16 h-16',
  xl: 'w-20 h-20',
};

export const AppBrandIcon: React.FC<AppBrandIconProps> = ({
  platform,
  className = '',
  size = 'md',
  variant = 'app-tile',
  animated = false,
}) => {
  const norm = platform.toLowerCase().trim();

  // 1. LINKEDIN
  if (norm === 'linkedin') {
    if (variant === 'flat') {
      return (
        <svg viewBox="0 0 24 24" fill="#0A66C2" className={`${sizeMap[size]} ${className}`}>
          <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
        </svg>
      );
    }

    return (
      <svg
        viewBox="0 0 64 64"
        className={`${sizeMap[size]} ${className} drop-shadow-md transition-transform duration-300 ${
          animated ? 'hover:scale-110' : ''
        }`}
      >
        <defs>
          <linearGradient id="li-bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0077B5" />
            <stop offset="100%" stopColor="#004182" />
          </linearGradient>
          <linearGradient id="li-spec" x1="0%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
          <filter id="li-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#0A66C2" floodOpacity="0.45" />
          </filter>
        </defs>
        {/* Squircle or Circle Container */}
        {variant === 'circle' ? (
          <circle cx="32" cy="32" r="28" fill="url(#li-bg)" filter="url(#li-glow)" />
        ) : (
          <rect
            x="4"
            y="4"
            width="56"
            height="56"
            rx="14"
            fill="url(#li-bg)"
            filter="url(#li-glow)"
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="1"
          />
        )}
        {/* Specular gloss sheen */}
        <path
          d="M 6 18 Q 32 4 58 18 L 58 6 Q 32 4 6 6 Z"
          fill="url(#li-spec)"
          opacity="0.8"
        />
        {/* LinkedIn 'in' Emblem */}
        <g fill="#FFFFFF">
          {/* 'i' dot */}
          <circle cx="21" cy="20" r="3.4" />
          {/* 'i' stem */}
          <rect x="17.8" y="26" width="6.4" height="19" rx="1.5" />
          {/* 'n' character */}
          <path
            d="M 28 26 L 34.2 26 L 34.2 29.2 C 35.8 26.8 38.6 25.4 41.8 25.4 C 47.8 25.4 50.5 29.2 50.5 35.8 L 50.5 45 L 44.1 45 L 44.1 36.8 C 44.1 33.2 43.1 31.2 40.2 31.2 C 37.1 31.2 34.4 33.4 34.4 37.8 L 34.4 45 L 28 45 Z"
          />
        </g>
      </svg>
    );
  }

  // 2. GITHUB
  if (norm === 'github') {
    if (variant === 'flat') {
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={`${sizeMap[size]} ${className}`}>
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
          />
        </svg>
      );
    }

    return (
      <svg
        viewBox="0 0 64 64"
        className={`${sizeMap[size]} ${className} drop-shadow-md transition-transform duration-300 ${
          animated ? 'hover:scale-110' : ''
        }`}
      >
        <defs>
          <linearGradient id="gh-bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#24292E" />
            <stop offset="100%" stopColor="#0D1117" />
          </linearGradient>
          <linearGradient id="gh-rim" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#586069" />
            <stop offset="100%" stopColor="#02F74C" stopOpacity="0.7" />
          </linearGradient>
          <filter id="gh-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#02F74C" floodOpacity="0.3" />
          </filter>
        </defs>
        {variant === 'circle' ? (
          <circle cx="32" cy="32" r="28" fill="url(#gh-bg)" stroke="url(#gh-rim)" strokeWidth="1.5" filter="url(#gh-glow)" />
        ) : (
          <rect
            x="4"
            y="4"
            width="56"
            height="56"
            rx="14"
            fill="url(#gh-bg)"
            stroke="url(#gh-rim)"
            strokeWidth="1.5"
            filter="url(#gh-glow)"
          />
        )}
        {/* Octocat Silhouette */}
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M32 14 C 22.06 14 14 22.06 14 32 C 14 39.95 19.16 46.69 26.31 49.07 C 27.21 49.23 27.54 48.68 27.54 48.2 C 27.54 47.78 27.52 46.65 27.52 45.15 C 22.51 46.24 21.45 42.74 21.45 42.74 C 20.63 40.66 19.45 40.11 19.45 40.11 C 17.82 39 19.57 39.02 19.57 39.02 C 21.37 39.15 22.32 40.87 22.32 40.87 C 23.92 43.62 26.53 42.82 27.56 42.36 C 27.72 41.2 28.19 40.41 28.7 39.96 C 24.7 39.51 20.5 37.96 20.5 31.06 C 20.5 29.1 21.2 27.49 22.35 26.23 C 22.16 25.77 21.55 23.94 22.52 21.46 C 22.52 21.46 24.03 20.98 27.47 23.31 C 28.91 22.91 30.45 22.71 31.99 22.7 C 33.52 22.71 35.06 22.91 36.5 23.31 C 39.93 20.98 41.44 21.46 41.44 21.46 C 42.42 23.94 41.81 25.77 41.62 26.23 C 42.77 27.49 43.47 29.1 43.47 31.06 C 43.47 37.99 39.26 39.5 35.25 39.95 C 35.9 40.51 36.47 41.61 36.47 43.29 C 36.47 45.69 36.45 47.63 36.45 48.22 C 36.45 48.7 36.77 49.26 37.69 49.08 C 44.83 46.68 50 39.94 50 32 C 50 22.06 41.94 14 32 14 Z"
          fill="#FFFFFF"
        />
      </svg>
    );
  }

  // 3. INSTAGRAM
  if (norm === 'instagram' || norm === 'insta') {
    if (variant === 'flat') {
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`${sizeMap[size]} ${className}`}>
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
        </svg>
      );
    }

    return (
      <svg
        viewBox="0 0 64 64"
        className={`${sizeMap[size]} ${className} drop-shadow-md transition-transform duration-300 ${
          animated ? 'hover:scale-110' : ''
        }`}
      >
        <defs>
          {/* Authentic Instagram Multi-Point Radiant Sunset Gradient */}
          <radialGradient id="insta-radial" cx="30%" cy="107%" r="150%">
            <stop offset="0%" stopColor="#fdf497" />
            <stop offset="5%" stopColor="#fdf497" />
            <stop offset="45%" stopColor="#fd5949" />
            <stop offset="60%" stopColor="#d6249f" />
            <stop offset="90%" stopColor="#285aeb" />
          </radialGradient>
          <filter id="insta-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="5" floodColor="#d6249f" floodOpacity="0.55" />
          </filter>
        </defs>
        {variant === 'circle' ? (
          <circle cx="32" cy="32" r="28" fill="url(#insta-radial)" filter="url(#insta-glow)" />
        ) : (
          <rect
            x="4"
            y="4"
            width="56"
            height="56"
            rx="15"
            fill="url(#insta-radial)"
            filter="url(#insta-glow)"
            stroke="rgba(255,255,255,0.25)"
            strokeWidth="1"
          />
        )}
        {/* Camera Outline */}
        <rect
          x="16"
          y="16"
          width="32"
          height="32"
          rx="9"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="3.2"
        />
        {/* Lens */}
        <circle cx="32" cy="32" r="7.5" fill="none" stroke="#FFFFFF" strokeWidth="3.2" />
        {/* Flash Dot */}
        <circle cx="41.5" cy="22.5" r="1.8" fill="#FFFFFF" />
      </svg>
    );
  }

  // 4. WHATSAPP
  if (norm === 'whatsapp' || norm === 'wa') {
    if (variant === 'flat') {
      return (
        <svg viewBox="0 0 24 24" fill="#25D366" className={`${sizeMap[size]} ${className}`}>
          <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm5.79 14.15c-.24.67-1.39 1.28-1.92 1.36-.49.08-1.12.11-3.23-.76-2.69-1.12-4.42-3.85-4.55-4.03-.13-.18-1.09-1.45-1.09-2.77 0-1.31.69-1.96.94-2.22.25-.26.54-.33.72-.33.18 0 .36 0 .52.01.17.01.39-.06.61.47.23.54.78 1.9.85 2.04.07.15.11.32.02.5-.1.17-.15.28-.29.45-.15.17-.31.37-.44.5-.15.15-.3.31-.13.6.17.3.77 1.27 1.66 2.06 1.14 1.02 2.1 1.33 2.4 1.48.3.15.47.13.65-.07.18-.21.76-.88.96-1.18.21-.3.41-.25.69-.15.28.1 1.77.83 2.07.98.3.15.5.23.57.36.08.12.08.7-.16 1.37z" />
        </svg>
      );
    }

    return (
      <svg
        viewBox="0 0 64 64"
        className={`${sizeMap[size]} ${className} drop-shadow-md transition-transform duration-300 ${
          animated ? 'hover:scale-110' : ''
        }`}
      >
        <defs>
          <linearGradient id="wa-bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2FE674" />
            <stop offset="100%" stopColor="#128C7E" />
          </linearGradient>
          <filter id="wa-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="5" floodColor="#25D366" floodOpacity="0.5" />
          </filter>
        </defs>
        {variant === 'circle' ? (
          <circle cx="32" cy="32" r="28" fill="url(#wa-bg)" filter="url(#wa-glow)" />
        ) : (
          <rect
            x="4"
            y="4"
            width="56"
            height="56"
            rx="15"
            fill="url(#wa-bg)"
            filter="url(#wa-glow)"
            stroke="rgba(255,255,255,0.25)"
            strokeWidth="1"
          />
        )}
        {/* Telephone Receiver & Speech Bubble */}
        <path
          d="M 32 14 C 22.06 14 14 22.06 14 32 C 14 35.32 14.9 38.43 16.48 41.11 L 14.5 49 L 22.66 47.1 C 25.43 48.91 28.59 50 32 50 C 41.94 50 50 41.94 50 32 C 50 22.06 41.94 14 32 14 Z"
          fill="#25D366"
          opacity="0.15"
        />
        <path
          d="M 32 16 C 23.16 16 16 23.16 16 32 C 16 35.12 16.9 38.04 18.46 40.52 L 17 47 L 23.72 45.48 C 26.12 47.08 28.96 48 32 48 C 40.84 48 48 40.84 48 32 C 48 23.16 40.84 16 32 16 Z"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="2.8"
          strokeLinejoin="round"
        />
        <path
          d="M 40.5 37.1 C 40.1 38.3 38.2 39.4 37.3 39.5 C 36.4 39.6 35.3 39.7 31.8 38.1 C 27.5 36.1 24.6 31.8 24.4 31.5 C 24.2 31.2 22.6 28.9 22.6 26.6 C 22.6 24.3 23.8 23.2 24.2 22.7 C 24.6 22.2 25.1 22.1 25.5 22.1 C 25.8 22.1 26.1 22.1 26.3 22.1 C 26.7 22.1 27 22 27.4 22.9 C 27.8 23.9 28.7 26.3 28.8 26.6 C 28.9 26.9 29 27.2 28.8 27.5 C 28.6 27.8 28.5 28 28.3 28.3 C 28 28.6 27.7 29 27.5 29.2 C 27.2 29.5 27 29.8 27.3 30.3 C 27.6 30.8 28.6 32.5 30.1 33.8 C 32 35.5 33.6 36 34.1 36.3 C 34.6 36.6 34.9 36.5 35.2 36.2 C 35.5 35.9 36.5 34.7 36.8 34.2 C 37.1 33.7 37.5 33.8 38 34 C 38.5 34.2 41 35.5 41.5 35.7 C 42 35.9 42.4 36.1 42.5 36.3 C 42.6 36.5 42.6 37.5 40.5 37.1 Z"
          fill="#FFFFFF"
        />
      </svg>
    );
  }

  // 5. GMAIL / EMAIL
  if (norm === 'email' || norm === 'gmail' || norm === 'mail') {
    if (variant === 'flat') {
      return (
        <svg viewBox="0 0 24 24" fill="#EA4335" className={`${sizeMap[size]} ${className}`}>
          <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
        </svg>
      );
    }

    return (
      <svg
        viewBox="0 0 64 64"
        className={`${sizeMap[size]} ${className} drop-shadow-md transition-transform duration-300 ${
          animated ? 'hover:scale-110' : ''
        }`}
      >
        <defs>
          <linearGradient id="gm-bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#F1F3F4" />
          </linearGradient>
          <filter id="gm-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="5" floodColor="#EA4335" floodOpacity="0.4" />
          </filter>
        </defs>
        {variant === 'circle' ? (
          <circle cx="32" cy="32" r="28" fill="url(#gm-bg)" filter="url(#gm-glow)" />
        ) : (
          <rect
            x="4"
            y="4"
            width="56"
            height="56"
            rx="14"
            fill="url(#gm-bg)"
            filter="url(#gm-glow)"
            stroke="rgba(0,0,0,0.08)"
            strokeWidth="1"
          />
        )}
        {/* Authentic Multi-Color Gmail Icon Paths */}
        <g transform="translate(13, 16) scale(0.6)">
          <path fill="#4285F4" d="M52 24v30c0 3.3-2.7 6-6 6H16c-3.3 0-6-2.7-6-6V24l26 18 26-18z" opacity="0.1" />
          {/* Left Wing (Blue) */}
          <path fill="#4285F4" d="M10 54V23.5l14 9.7V54H14c-2.2 0-4-1.8-4-4v-4z" />
          <path fill="#C5221F" d="M10 23.5L32 39 10 23.5z" />
          {/* Top Flap (Red) */}
          <path fill="#EA4335" d="M10 18c0-3.3 2.7-6 6-6h32c3.3 0 6 2.7 6 6v5.5L32 39 10 23.5V18z" />
          {/* Right Wing (Green) */}
          <path fill="#34A853" d="M54 50c0 2.2-1.8 4-4 4h-10V33.2l14-9.7V50z" />
          {/* Folds */}
          <path fill="#FBBC04" d="M10 18v5.5l14 9.7V22L10 18z" />
          <path fill="#C5221F" d="M40 22v11.2l14-9.7V18L40 22z" />
        </g>
      </svg>
    );
  }

  // 6. PHONE / CALL
  if (norm === 'phone' || norm === 'tel') {
    return (
      <svg
        viewBox="0 0 64 64"
        className={`${sizeMap[size]} ${className} drop-shadow-md transition-transform duration-300 ${
          animated ? 'hover:scale-110' : ''
        }`}
      >
        <defs>
          <linearGradient id="phone-bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#02F74C" />
            <stop offset="100%" stopColor="#00A832" />
          </linearGradient>
          <filter id="phone-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="5" floodColor="#02F74C" floodOpacity="0.45" />
          </filter>
        </defs>
        {variant === 'circle' ? (
          <circle cx="32" cy="32" r="28" fill="url(#phone-bg)" filter="url(#phone-glow)" />
        ) : (
          <rect
            x="4"
            y="4"
            width="56"
            height="56"
            rx="14"
            fill="url(#phone-bg)"
            filter="url(#phone-glow)"
            stroke="rgba(255,255,255,0.3)"
            strokeWidth="1"
          />
        )}
        <path
          d="M 23 20 C 22.4 20 22 20.4 22 21 C 22 31 33 42 43 42 C 43.6 42 44 41.6 44 41 L 40.5 35 C 40.2 34.5 39.5 34.3 39 34.6 L 36.5 36.2 C 32.5 33.8 30.2 31.5 27.8 27.5 L 29.4 25 C 29.7 24.5 29.5 23.8 29 23.5 L 23 20 Z"
          fill="#020203"
        />
      </svg>
    );
  }

  // 7. LEETCODE
  if (norm === 'leetcode') {
    return (
      <svg
        viewBox="0 0 64 64"
        className={`${sizeMap[size]} ${className} drop-shadow-md transition-transform duration-300 ${
          animated ? 'hover:scale-110' : ''
        }`}
      >
        <defs>
          <linearGradient id="lc-bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#282828" />
            <stop offset="100%" stopColor="#1A1A1A" />
          </linearGradient>
          <filter id="lc-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#FFA116" floodOpacity="0.4" />
          </filter>
        </defs>
        <rect
          x="4"
          y="4"
          width="56"
          height="56"
          rx="14"
          fill="url(#lc-bg)"
          stroke="#FFA116"
          strokeWidth="1"
          filter="url(#lc-glow)"
        />
        {/* LeetCode logo path */}
        <path
          d="M37 20 L27 30 A3 3 0 0 0 27 34 L37 44"
          fill="none"
          stroke="#FFA116"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <path d="M28 32 L44 32" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" />
        <path
          d="M37 20 C 43 14 51 22 45 28"
          fill="none"
          stroke="#8A8A8A"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  // Fallback generic app tile
  return (
    <div
      className={`${sizeMap[size]} ${className} rounded-xl bg-[#0A0D0C] border border-[#02F74C]/40 flex items-center justify-center text-[#02F74C] font-mono text-xs font-bold uppercase shadow-[0_0_12px_rgba(2,247,76,0.2)]`}
    >
      {norm.slice(0, 2)}
    </div>
  );
};
