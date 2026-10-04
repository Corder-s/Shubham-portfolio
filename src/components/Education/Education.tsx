import React from 'react';
import { Terminal, Calendar, GraduationCap } from 'lucide-react';
import { Education } from '../../types';
import { CodeTag, CodeClosingTag } from '../Decorative/DevGraphics';

interface EducationProps {
  education: Education[];
}

export const EducationSection: React.FC<EducationProps> = ({ education }) => {
  return (
    <section id="education" className="py-20 lg:py-28 border-b border-[#02F74C]/20 bg-[#020203] font-mono">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Code Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#02F74C]/20 pb-5 mb-12">
          <div>
            <div className="text-xs text-[#02F74C] font-semibold mb-1 flex items-center gap-2">
              <span>/02</span>
              <span>•</span>
              <CodeTag tag="education />" />
            </div>
            <h2 className="font-code-header text-3xl sm:text-5xl text-[#F3F3F4] uppercase font-bold tracking-tight">
              ACADEMIC_LOGS
            </h2>
          </div>
          <div className="text-xs text-[#76A988]">
            // VERIFIED_QUALIFICATIONS
          </div>
        </div>

        {/* Developer Activity Log Timeline */}
        <div className="space-y-6">
          {education.map((item, index) => {
            const isFirst = index === 0;
            return (
              <div
                key={item.id}
                className={`border p-6 transition-all duration-200 relative ${
                  isFirst
                    ? 'border-[#02F74C] bg-[#0A0D0C] shadow-[0_0_20px_rgba(2,247,76,0.12)]'
                    : 'border-[#02F74C]/25 bg-[#0A0D0C]/60 hover:border-[#02F74C]/60'
                }`}
              >
                {/* Top Terminal Tag Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#02F74C]/15 pb-3 mb-4 text-xs">
                  <div className="flex items-center gap-2 text-[#02F74C] font-bold">
                    <span>[ LOG_0{index + 1} ]</span>
                    <span className="text-[#A6A9AA]">────────────────</span>
                    <span className="text-[#F3F3F4]">{item.period}</span>
                  </div>
                  {item.status && (
                    <span className="px-2 py-0.5 bg-[#02F74C]/10 border border-[#02F74C]/40 text-[#02F74C] text-[10px] w-fit font-bold uppercase">
                      STATUS: {item.status}
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="space-y-1">
                  <h3 className="font-code-header text-lg sm:text-xl font-bold text-[#F3F3F4]">
                    {item.degree}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#02F74C]">
                    &gt; {item.institution} — <span className="text-[#A6A9AA]">{item.location}</span>
                  </p>
                  {item.details && (
                    <p className="text-xs text-[#A6A9AA] pt-2 leading-relaxed">
                      {item.details}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Section Code Footer */}
        <div className="text-xs text-[#76A988] mt-6 select-none">
          <CodeClosingTag tag="education" />
        </div>
      </div>
    </section>
  );
};
