import React, { useEffect, useState } from 'react';
import { ExternalLink } from 'lucide-react';

export const DevCanvasBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-30">
      {/* Dev Grid */}
      <div className="absolute inset-0 dev-grid-bg" />

      {/* Radial Gradient Glow in background */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full blur-[140px] pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(2,247,76,0.08) 0%, rgba(2,247,76,0.01) 60%, transparent 80%)',
        }}
      />
    </div>
  );
};

export interface InteractiveOrbitRingProps {
  imageUrl?: string;
  profileUrl?: string;
  name?: string;
}

export const InteractiveOrbitRing: React.FC<InteractiveOrbitRingProps> = ({
  imageUrl = '/shubham_photo.png',
  profileUrl = 'https://www.linkedin.com/in/shubham-saini-33537a374/',
  name = 'Shubham Saini',
}) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Only attach mousemove on desktop devices with pointer
    if (typeof window === 'undefined' || window.innerWidth < 768) return;

    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div
      className="relative w-52 h-52 sm:w-72 sm:h-72 lg:w-80 lg:h-80 flex items-center justify-center transition-transform duration-300 ease-out mx-auto my-2"
      style={{
        transform: `translate3d(${mousePos.x}px, ${mousePos.y}px, 0)`,
      }}
    >
      {/* Outer Rotating Technical Ring */}
      <div
        className="absolute inset-0 rounded-full border border-dashed border-[#02F74C]/30 animate-spin"
        style={{ animationDuration: '28s' }}
      />

      {/* Middle Glowing Ring */}
      <div
        className="absolute inset-4 rounded-full border border-[#02F74C]/20"
        style={{
          boxShadow: '0 0 25px rgba(2,247,76,0.08), inset 0 0 25px rgba(2,247,76,0.08)',
        }}
      />

      {/* Orbiting Satellite Dot */}
      <div
        className="absolute inset-0 rounded-full animate-spin"
        style={{ animationDuration: '10s' }}
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-[#02F74C] rounded-full shadow-[0_0_10px_#02F74C]" />
      </div>

      {/* Second Orbiting Counter Dot */}
      <div
        className="absolute inset-4 rounded-full animate-spin"
        style={{ animationDuration: '14s', animationDirection: 'reverse' }}
      >
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-2 h-2 bg-[#76A988] rounded-full" />
      </div>

      {/* Center Profile Photo Circle Linking to LinkedIn Profile */}
      <a
        href={profileUrl || 'https://www.linkedin.com/in/shubham-saini-33537a374/'}
        target="_blank"
        rel="noopener noreferrer"
        className="relative z-10 w-28 h-28 sm:w-32 sm:h-32 lg:w-36 lg:h-36 rounded-full border-2 border-[#02F74C] p-1 bg-[#020203] shadow-[0_0_25px_rgba(2,247,76,0.35)] hover:shadow-[0_0_40px_rgba(10,102,194,0.7)] hover:border-[#0A66C2] transition-all duration-300 hover:scale-105 cursor-pointer group"
        title={`Visit ${name}'s LinkedIn Profile`}
        aria-label={`Visit ${name}'s LinkedIn Profile`}
      >
        <div className="w-full h-full rounded-full overflow-hidden relative bg-[#0A0D0C]">
          <img
            src="/shubham_avatar.png"
            alt={name}
            className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-300"
          />
          {/* Subtle Hover Overlay with LinkedIn Indicator */}
          <div className="absolute inset-0 bg-[#0A66C2]/35 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[1px]">
            <span className="text-[10px] font-mono text-white font-bold px-2 py-0.5 rounded bg-[#0A66C2] shadow-md flex items-center gap-1">
              <span>in</span>
              <span>CONNECT ↗</span>
            </span>
          </div>
        </div>

        {/* Floating Mini LinkedIn Badge on Circle Rim */}
        <div className="absolute bottom-0 right-0 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#0A66C2] border-2 border-[#020203] flex items-center justify-center text-white shadow-[0_0_10px_rgba(10,102,194,0.6)] group-hover:scale-110 transition-transform">
          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
            <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.45c-.94 0-1.7.77-1.7 1.72s.76 1.72 1.7 1.72 1.7-.77 1.7-1.72c-.01-.95-.77-1.72-1.7-1.72Z"/>
          </svg>
        </div>
      </a>
    </div>
  );
};

export const CodeTag: React.FC<{ tag: string; className?: string }> = ({ tag, className = '' }) => (
  <span className={`font-mono text-xs text-[#02F74C] opacity-75 select-none ${className}`}>
    &lt;{tag}&gt;
  </span>
);

export const CodeClosingTag: React.FC<{ tag: string; className?: string }> = ({ tag, className = '' }) => (
  <span className={`font-mono text-xs text-[#02F74C] opacity-75 select-none ${className}`}>
    &lt;/{tag}&gt;
  </span>
);

/**
 * Connection lines circuit component inspired by developer portfolio reference
 * Features:
 * 1. Glowing top anchor node (halo + white center)
 * 2. 90-degree rounded circuit trace running down the side
 * 3. Smooth S-curve transition into horizontal connector
 * 4. Centered glowing </ > code icon
 * 5. Downward trailing circuit exit
 */
export const CircuitConnectionDivider: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`relative w-full overflow-visible py-2 sm:py-4 select-none ${className}`}>
      <div className="relative flex items-center justify-center max-w-5xl mx-auto px-4 h-14 sm:h-20">
        <svg
          className="absolute inset-0 w-full h-full overflow-visible"
          viewBox="0 0 1000 80"
          fill="none"
          preserveAspectRatio="none"
        >
          <defs>
            <filter id="circuit-neon-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <linearGradient id="neon-circuit-grad-left" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#02F74C" stopOpacity="0.3" />
              <stop offset="60%" stopColor="#02F74C" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#02F74C" stopOpacity="1" />
            </linearGradient>
            <linearGradient id="neon-circuit-grad-right" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#02F74C" stopOpacity="1" />
              <stop offset="40%" stopColor="#02F74C" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#02F74C" stopOpacity="0.3" />
            </linearGradient>
          </defs>

          {/* Left curve coming down from top-left, flattening into horizontal trace */}
          <path
            d="M 10,4 C 60,4 90,40 180,40 L 450,40"
            stroke="url(#neon-circuit-grad-left)"
            strokeWidth="2.5"
            strokeLinecap="round"
            filter="url(#circuit-neon-glow)"
            vectorEffect="non-scaling-stroke"
          />

          {/* Right curve continuing from </> tag and curving down-right */}
          <path
            d="M 550,40 L 820,40 C 910,40 940,76 990,76"
            stroke="url(#neon-circuit-grad-right)"
            strokeWidth="2.5"
            strokeLinecap="round"
            filter="url(#circuit-neon-glow)"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        {/* Center Code Symbol < / > */}
        <div className="relative z-10 flex items-center justify-center px-4 py-1 sm:py-1.5 bg-[#020203] text-white font-mono text-base sm:text-xl md:text-2xl font-bold tracking-widest">
          <span className="text-white hover:text-[#02F74C] transition-colors">&lt;</span>
          <span className="text-[#02F74C] mx-1.5 glow-neon">/</span>
          <span className="text-white hover:text-[#02F74C] transition-colors">&gt;</span>
        </div>
      </div>
    </div>
  );
};

/**
 * HeroConnectionCircuitFrame
 * Encloses the developer title and subtitle with the circuit connection line:
 * - Glowing anchor node (halo + white dot)
 * - Rounded top-left corner
 * - Vertical neon trace down the left
 * - S-curve transition into horizontal connection line with centered </ >
 */
export const HeroConnectionCircuitFrame: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => {
  return (
    <div className={`relative pt-3 pb-2 select-none ${className}`}>
      {/* Top Circuit Anchor Node & Horizontal Branch */}
      <div className="flex items-center mb-1">
        {/* Glowing Anchor Node (Outer Halo + White Core) */}
        <div className="relative flex items-center justify-center w-6 h-6 mr-1">
          <span className="absolute inset-0 rounded-full bg-[#02F74C]/30 animate-ping" />
          <span className="relative w-4 h-4 rounded-full border border-[#02F74C] bg-[#02F74C]/25 shadow-[0_0_12px_#02F74C] flex items-center justify-center">
            <span className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_6px_#ffffff]" />
          </span>
        </div>

        {/* Horizontal Line connecting rightward to corner or title marker */}
        <div className="w-8 sm:w-16 h-[2px] bg-[#02F74C] shadow-[0_0_8px_#02F74C]" />
      </div>

      {/* Main Content Block with Left Neon Circuit Line and Rounded Top-Left */}
      <div className="relative border-l-2 border-[#02F74C] pl-4 sm:pl-7 ml-3 shadow-[-4px_0_12px_rgba(2,247,76,0.3)]">
        {children}
      </div>

      {/* Connection Line with Centered </ > Trace (Smooth S-curve in and out) */}
      <div className="relative mt-2 -ml-2 sm:-ml-4">
        <CircuitConnectionDivider />
      </div>
    </div>
  );
};


