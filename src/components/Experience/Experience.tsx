import React from 'react';
import { Briefcase, Calendar, MapPin, Terminal } from 'lucide-react';
import { Experience } from '../../types';
import { CodeTag, CodeClosingTag } from '../Decorative/DevGraphics';

interface ExperienceProps {
  experience: Experience[];
}

export const ExperienceSection: React.FC<ExperienceProps> = ({ experience }) => {
  return (
    <section id="experience" className="py-20 lg:py-28 border-b border-[#02F74C]/20 bg-[#020203] font-mono">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Code Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#02F74C]/20 pb-5 mb-12">
          <div>
            <div className="text-xs text-[#02F74C] font-semibold mb-1 flex items-center gap-2">
              <span>/05</span>
              <span>•</span>
              <CodeTag tag="EXPERIENCE />" />
            </div>
            <h2 className="font-code-header text-3xl sm:text-5xl text-[#F3F3F4] uppercase font-bold tracking-tight">
              DEV_TRACK_RECORD
            </h2>
          </div>
          <div className="text-xs text-[#76A988]">
            // TECHNICAL_INTERNSHIPS
          </div>
        </div>

        {/* Experience Developer Logs */}
        <div className="space-y-6">
          {experience.map((item, index) => (
            <div
              key={item.id}
              className="border border-[#02F74C]/35 bg-[#0A0D0C] p-6 sm:p-8 shadow-[0_0_20px_rgba(2,247,76,0.08)] relative"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#02F74C]/15 pb-4 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-[#02F74C] font-bold">[ ROLE_0{index + 1} ]</span>
                    <span className="text-[10px] px-2 py-0.5 bg-[#02F74C]/10 border border-[#02F74C]/30 text-[#02F74C] uppercase font-bold">
                      VERIFIED INTERNSHIP
                    </span>
                  </div>
                  <h3 className="font-code-header text-xl sm:text-2xl font-bold text-[#F3F3F4]">
                    {item.role}
                  </h3>
                  <p className="text-sm text-[#02F74C] font-semibold mt-0.5">
                    &gt; {item.company}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-[#76A988]">
                  <span>PERIOD: <strong className="text-[#F3F3F4]">{item.period}</strong></span>
                  {item.location && (
                    <>
                      <span>•</span>
                      <span>LOC: {item.location}</span>
                    </>
                  )}
                </div>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-[#A6A9AA] leading-relaxed mb-6">
                {item.description}
              </p>

              {/* Technologies Applied */}
              {item.technologies && item.technologies.length > 0 && (
                <div className="pt-3 border-t border-[#02F74C]/15 flex flex-wrap items-center gap-2">
                  <span className="text-[10px] text-[#76A988] uppercase mr-2">
                    APPLIED_STACK:
                  </span>
                  {item.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-0.5 bg-[#020203] border border-[#02F74C]/30 text-[#02F74C] text-[10px]"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Section Code Footer */}
        <div className="text-xs text-[#76A988] mt-6 select-none">
          <CodeClosingTag tag="EXPERIENCE" />
        </div>
      </div>
    </section>
  );
};
