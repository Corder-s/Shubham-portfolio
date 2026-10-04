import React from 'react';
import { Terminal, MapPin, GraduationCap, Code2, Compass } from 'lucide-react';
import { Profile } from '../../types';
import { CodeTag, CodeClosingTag } from '../Decorative/DevGraphics';

interface AboutProps {
  profile: Profile;
}

export const About: React.FC<AboutProps> = ({ profile }) => {
  return (
    <section id="about" className="py-20 lg:py-28 border-b border-[#02F74C]/20 bg-[#020203] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Code Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#02F74C]/20 pb-5 mb-10 font-mono">
          <div>
            <div className="text-xs text-[#02F74C] font-semibold mb-1 flex items-center gap-2">
              <span>/01</span>
              <span>•</span>
              <CodeTag tag="about />" />
            </div>
            <h2 className="font-code-header text-3xl sm:text-5xl text-[#F3F3F4] uppercase font-bold tracking-tight">
              WHO AM I?
            </h2>
          </div>
          <div className="text-xs text-[#76A988]">
            // DIGITAL_PROFILE_DOSSIER
          </div>
        </div>

        {/* Large Outlined Container with Green Border and Corner Markers */}
        <div className="relative border border-[#02F74C]/35 bg-[#0A0D0C]/80 p-4 sm:p-8 lg:p-10 shadow-[0_0_25px_rgba(2,247,76,0.06)]">
          {/* Decorative Corner Markers */}
          <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t-2 border-l-2 border-[#02F74C]" />
          <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t-2 border-r-2 border-[#02F74C]" />
          <div className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b-2 border-l-2 border-[#02F74C]" />
          <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b-2 border-r-2 border-[#02F74C]" />

          {/* Large Statement */}
          <div className="mb-8">
            <h3 className="font-code-header text-2xl sm:text-4xl lg:text-5xl font-extrabold text-[#F3F3F4] tracking-tight uppercase">
              I BUILD. <span className="text-[#02F74C] glow-neon">I LEARN.</span> I EXPERIMENT.
            </h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start font-mono">
            {/* Biography (7 cols) */}
            <div className="lg:col-span-7 space-y-5 text-sm sm:text-base text-[#A6A9AA] leading-relaxed">
              <p className="text-[#F3F3F4] font-semibold">
                {profile.bio ||
                  "I'm a second-year B.Tech Computer Science and Engineering student focused on web development, software development and practical problem solving."}
              </p>
              <p>
                My focus is engineering robust, modular, full-stack systems with end-to-end type safety, modern UI ergonomics, and clean relational and document database modeling.
              </p>
              <p className="text-xs text-[#76A988]">
                From constructing reactive social media backends (Snapgram) to implementing parametric memory-aligned Max Heaps in Java, I believe in rigorous fundamentals and engineering through actual execution.
              </p>

              {/* Code Snippet Box */}
              <div className="p-4 bg-[#020203] border border-[#02F74C]/25 text-xs text-[#02F74C] space-y-1">
                <div>&gt; git commit -m &quot;feat: practical engineering &amp; continuous learning&quot;</div>
                <div className="text-[#A6A9AA]">&gt; Status: 100% active, 0 broken dependencies</div>
              </div>
            </div>

            {/* Metadata Vitals Box (5 cols) */}
            <div className="lg:col-span-5 bg-[#020203] border border-[#02F74C]/30 p-5 sm:p-6 space-y-4">
              <div className="border-b border-[#02F74C]/20 pb-2 flex items-center justify-between text-xs text-[#02F74C] font-bold">
                <span>[ PROFILE_METADATA ]</span>
                <span className="text-[10px] text-[#76A988]">VERIFIED</span>
              </div>

              <div className="space-y-3.5 text-xs">
                <div>
                  <span className="text-[10px] uppercase text-[#76A988] block">LOCATION</span>
                  <div className="flex items-center gap-1.5 text-[#F3F3F4] font-bold mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-[#02F74C]" />
                    <span>{profile.location || 'Greater Noida, Uttar Pradesh, India'}</span>
                  </div>
                </div>

                <div className="border-t border-[#02F74C]/10 pt-2.5">
                  <span className="text-[10px] uppercase text-[#76A988] block">EDUCATION</span>
                  <div className="flex items-center gap-1.5 text-[#F3F3F4] font-bold mt-0.5">
                    <GraduationCap className="w-3.5 h-3.5 text-[#02F74C]" />
                    <span>B.Tech Computer Science & Engineering</span>
                  </div>
                  <span className="text-[11px] text-[#A6A9AA]">Dronacharya Group of Institutions</span>
                </div>

                <div className="border-t border-[#02F74C]/10 pt-2.5">
                  <span className="text-[10px] uppercase text-[#76A988] block">CURRENT STATUS</span>
                  <div className="text-[#02F74C] font-bold mt-0.5">
                    2nd Year CSE Student (2025–2029)
                  </div>
                </div>

                <div className="border-t border-[#02F74C]/10 pt-2.5">
                  <span className="text-[10px] uppercase text-[#76A988] block">FOCUS</span>
                  <div className="flex items-center gap-1.5 text-[#F3F3F4] font-bold mt-0.5">
                    <Code2 className="w-3.5 h-3.5 text-[#02F74C]" />
                    <span>Full-Stack Development & Practical Algorithms</span>
                  </div>
                </div>

                <div className="border-t border-[#02F74C]/10 pt-2.5">
                  <span className="text-[10px] uppercase text-[#76A988] block">INTERESTS</span>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {['Web Development', 'Software Development', 'Problem Solving'].map((interest) => (
                      <span
                        key={interest}
                        className="px-2 py-0.5 bg-[#0A0D0C] border border-[#02F74C]/35 text-[#02F74C] text-[10px]"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section Code Footer */}
        <div className="font-mono text-xs text-[#76A988] mt-4 select-none">
          <CodeClosingTag tag="about" />
        </div>
      </div>
    </section>
  );
};
