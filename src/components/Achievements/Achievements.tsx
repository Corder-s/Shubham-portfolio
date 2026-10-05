import React from 'react';
import { Achievement } from '../../types';
import { CodeTag, CodeClosingTag } from '../Decorative/DevGraphics';

interface AchievementsProps {
  achievements: Achievement[];
}

export const Achievements: React.FC<AchievementsProps> = ({ achievements }) => {
  return (
    <section id="achievements" className="py-20 lg:py-28 border-b border-[#02F74C]/20 bg-[#020203] font-mono">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Code Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#02F74C]/20 pb-5 mb-12">
          <div>
            <div className="text-xs text-[#02F74C] font-semibold mb-1 flex items-center gap-2">
              <span>/03</span>
              <span>•</span>
              <CodeTag tag="achievements />" />
            </div>
            <h2 className="font-code-header text-3xl sm:text-5xl text-[#F3F3F4] uppercase font-bold tracking-tight">
              HONORS &amp; RECOGNITION
            </h2>
          </div>
          <div className="text-xs text-[#76A988]">
            // AUDITED_MERIT_RECORDS
          </div>
        </div>

        {/* Terminal Status Card Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Main Terminal Highlight: ₹2,000 CASH PRIZE (7 cols) */}
          <div className="lg:col-span-7 border border-[#02F74C] bg-[#0A0D0C] p-4 sm:p-8 lg:p-10 shadow-[0_0_30px_rgba(2,247,76,0.15)] flex flex-col justify-between relative">
            {/* Top Bar */}
            <div className="flex items-center justify-between border-b border-[#02F74C]/30 pb-3 mb-4 sm:mb-6 text-xs">
              <span className="text-[#02F74C] font-bold">[ ACHIEVEMENT_001 ]</span>
              <span className="px-2 py-0.5 bg-[#02F74C]/10 border border-[#02F74C]/40 text-[#02F74C] text-[10px] font-bold">
                STATUS: VERIFIED
              </span>
            </div>

            {/* Metric Display */}
            <div className="py-2 sm:py-4">
              <span className="text-xs text-[#76A988] uppercase tracking-wider block mb-1">
                AWARD_VALUE:
              </span>
              <div className="font-code-header text-4xl sm:text-6xl lg:text-7xl font-black text-[#02F74C] glow-neon tracking-tight leading-none mb-3">
                ₹2,000
              </div>
              <div className="text-xl sm:text-2xl font-bold text-[#F3F3F4] uppercase">
                CASH PRIZE &amp; MERIT RECOGNITION
              </div>
              <p className="mt-3 text-xs sm:text-sm text-[#A6A9AA] leading-relaxed max-w-lg">
                RESULT: <strong className="text-[#02F74C]">8.09 CGPA</strong> (FIRST SEMESTER) at Dronacharya Group of Institutions. Awarded official monetary prize for top-tier academic performance.
              </p>
            </div>

            {/* Bottom Status */}
            <div className="pt-4 border-t border-[#02F74C]/20 flex items-center justify-between text-xs text-[#76A988]">
              <span>ISSUER: DRONACHARYA G.I.</span>
              <span>VERIFIED: 2025</span>
            </div>
          </div>

          {/* Additional Terminal Cards (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-5">
            {achievements
              .filter((a) => a.id !== 'ach-1')
              .map((item, idx) => (
                <div
                  key={item.id}
                  className="border border-[#02F74C]/30 bg-[#0A0D0C] p-5 shadow-[0_0_15px_rgba(2,247,76,0.05)] flex-1 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between border-b border-[#02F74C]/15 pb-2 mb-3 text-xs">
                      <span className="text-[#02F74C] font-semibold">
                        [ ACHIEVEMENT_00{idx + 2} ]
                      </span>
                      {item.highlight && (
                        <span className="text-[10px] text-[#76A988] border border-[#76A988]/30 px-1.5 py-0.5">
                          {item.highlight}
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-sm sm:text-base text-[#F3F3F4]">{item.title}</h3>
                    <p className="text-xs text-[#02F74C] mt-0.5">{item.subtitle}</p>
                    <p className="text-xs text-[#A6A9AA] mt-2 leading-relaxed">{item.description}</p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-[#02F74C]/15 flex items-center justify-between text-[10px] text-[#76A988]">
                    <span>CATEGORY: {item.category}</span>
                    <span>{item.date || '2025–2026'}</span>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Section Code Footer */}
        <div className="text-xs text-[#76A988] mt-6 select-none">
          <CodeClosingTag tag="achievements" />
        </div>
      </div>
    </section>
  );
};
