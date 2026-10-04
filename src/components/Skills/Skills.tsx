import React, { useState } from 'react';
import { Terminal, Layers, Database, Wrench, Code2, Server, Cpu } from 'lucide-react';
import { Skill } from '../../types';
import { CodeTag, CodeClosingTag } from '../Decorative/DevGraphics';

interface SkillsProps {
  skills: Skill[];
}

export const Skills: React.FC<SkillsProps> = ({ skills }) => {
  const [activeCategory, setActiveCategory] = useState<string>('ALL');

  const categories = ['ALL', 'PROGRAMMING', 'FRONTEND', 'BACKEND', 'DATABASE', 'TOOLS'];

  // Map categories cleanly
  const normalizeCategory = (cat: string) => {
    if (cat === 'WEB DEVELOPMENT') return 'FRONTEND';
    return cat;
  };

  const filteredSkills = skills.filter((s) => {
    if (activeCategory === 'ALL') return true;
    const normalized = normalizeCategory(s.category);
    if (activeCategory === 'FRONTEND') {
      return ['HTML5', 'CSS3', 'React.js', 'JavaScript'].includes(s.name) || normalized === 'FRONTEND';
    }
    if (activeCategory === 'BACKEND') {
      return ['Node.js', 'Express.js'].includes(s.name) || normalized === 'BACKEND';
    }
    return normalized === activeCategory;
  });

  return (
    <section id="skills" className="py-20 lg:py-28 border-b border-[#02F74C]/20 bg-[#020203] font-mono">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Code Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#02F74C]/20 pb-5 mb-10">
          <div>
            <div className="text-xs text-[#02F74C] font-semibold mb-1 flex items-center gap-2">
              <span>/03</span>
              <span>•</span>
              <CodeTag tag="MY TOOLKIT />" />
            </div>
            <h2 className="font-code-header text-3xl sm:text-5xl text-[#F3F3F4] uppercase font-bold tracking-tight">
              DEV_STACK
            </h2>
          </div>
          <div className="text-xs text-[#76A988]">
            // LANGUAGES, LIBS &amp; PROTOCOLS
          </div>
        </div>

        {/* Category Filter Buttons */}
        <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-8 sm:mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`px-2.5 sm:px-3.5 py-1.5 text-[11px] sm:text-xs font-bold uppercase tracking-wider border transition-all cursor-pointer min-h-[36px] flex items-center justify-center ${
                activeCategory === cat
                  ? 'border-[#02F74C] bg-[#02F74C] text-[#020203] shadow-[0_0_12px_rgba(2,247,76,0.4)]'
                  : 'border-[#02F74C]/30 bg-[#0A0D0C] text-[#A6A9AA] hover:text-[#02F74C] hover:border-[#02F74C]/60'
              }`}
            >
              [ {cat} ]
            </button>
          ))}
        </div>

        {/* Outlined Skill Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredSkills.map((skill) => (
            <div
              key={skill.id}
              className="group border border-[#02F74C]/25 bg-[#0A0D0C]/80 p-4 transition-all duration-300 hover:border-[#02F74C] hover:shadow-[0_0_20px_rgba(2,247,76,0.18)] hover:-translate-y-1 relative"
            >
              {/* Top Code Badge */}
              <div className="flex items-center justify-between border-b border-[#02F74C]/15 pb-2 mb-3 text-[10px]">
                <span className="text-[#76A988]">&lt;tech&gt;</span>
                <span className="text-[#02F74C] group-hover:glow-neon font-bold uppercase">
                  {skill.category}
                </span>
              </div>

              {/* Skill Name */}
              <h3 className="font-code-header text-lg font-bold text-[#F3F3F4] group-hover:text-[#02F74C] transition-colors">
                {skill.name}
              </h3>

              {/* Description */}
              <p className="mt-2 text-xs text-[#A6A9AA] group-hover:text-[#F3F3F4] leading-relaxed transition-colors min-h-[38px]">
                &gt; {skill.description || 'Verified practical competency'}
              </p>

              {/* Bottom Details */}
              <div className="mt-3 pt-2 border-t border-[#02F74C]/15 flex items-center justify-between text-[10px] text-[#76A988]">
                <span>STATUS: ACTIVE</span>
                <span className="group-hover:translate-x-1 transition-transform text-[#02F74C]">
                  &gt;&gt;
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Foundations Tag Line */}
        <div className="mt-8 p-4 bg-[#0A0D0C] border border-[#02F74C]/20 flex flex-wrap items-center justify-between gap-3 text-xs text-[#A6A9AA]">
          <span className="text-[#02F74C] font-bold">&gt; CORE_FOUNDATIONS:</span>
          <span>REST APIs</span>
          <span>•</span>
          <span>Problem Solving</span>
          <span>•</span>
          <span>Data Structures</span>
          <span>•</span>
          <span>Algorithm Analysis</span>
          <span>•</span>
          <span>Git / GitHub Workflows</span>
        </div>

        {/* Section Code Footer */}
        <div className="text-xs text-[#76A988] mt-6 select-none">
          <CodeClosingTag tag="MY TOOLKIT" />
        </div>
      </div>
    </section>
  );
};
