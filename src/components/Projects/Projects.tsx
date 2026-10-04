import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, ArrowRight, ArrowLeft, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Project } from '../../types';
import { GithubIcon } from '../Decorative/Scribbles';
import { CodeTag, CodeClosingTag } from '../Decorative/DevGraphics';

interface ProjectsProps {
  projects: Project[];
}

export const Projects: React.FC<ProjectsProps> = ({ projects }) => {
  const publishedProjects = projects.filter((p) => p.status === 'published');
  const [currentIndex, setCurrentIndex] = useState(0);

  const activeProject = publishedProjects[currentIndex] || publishedProjects[0];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : publishedProjects.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < publishedProjects.length - 1 ? prev + 1 : 0));
  };

  if (!activeProject) {
    return null;
  }

  const projectNumber = String(currentIndex + 1).padStart(2, '0');
  const totalNumber = String(publishedProjects.length).padStart(2, '0');

  return (
    <section id="projects" className="py-20 lg:py-28 border-b border-[#02F74C]/20 bg-[#020203] font-mono">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Code Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#02F74C]/20 pb-5 mb-10">
          <div>
            <div className="text-xs text-[#02F74C] font-semibold mb-1 flex items-center gap-2">
              <span>/04</span>
              <span>•</span>
              <CodeTag tag="MY PORTFOLIO />" />
            </div>
            <h2 className="font-code-header text-3xl sm:text-5xl text-[#F3F3F4] uppercase font-bold tracking-tight">
              FEATURED_WORKS
            </h2>
          </div>
          <div className="text-xs text-[#76A988]">
            // HORIZONTAL_VIEWPORT_SHOWCASE
          </div>
        </div>

        {/* Project Viewport Showcase Container */}
        <div className="border border-[#02F74C] bg-[#0A0D0C] p-4 sm:p-8 lg:p-10 shadow-[0_0_35px_rgba(2,247,76,0.12)] relative">
          {/* Top Bar inside Viewport */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#02F74C]/20 pb-3 sm:pb-4 mb-6 sm:mb-8 text-xs">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <span className="text-[#02F74C] font-bold">PROJECT {projectNumber} / {totalNumber}</span>
              <span className="text-[#76A988]">// {activeProject.category}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-[#02F74C]/10 border border-[#02F74C]/30 text-[#02F74C] text-[10px] uppercase font-bold">
                {activeProject.status}
              </span>
            </div>
          </div>

          {/* Animated Project Viewport Content */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: Large Project Preview (7 cols) */}
            <div className="lg:col-span-7">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeProject.id}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.3 }}
                  className="border border-[#02F74C]/40 bg-[#020203] overflow-hidden group relative shadow-[0_0_20px_rgba(2,247,76,0.15)]"
                >
                  {/* Terminal Header Bar */}
                  <div className="flex items-center justify-between px-3 py-1.5 bg-[#020203] border-b border-[#02F74C]/20 text-[10px] text-[#76A988]">
                    <span>preview_{activeProject.slug}.tsx</span>
                    <span className="text-[#02F74C]">200 OK</span>
                  </div>

                  <div className="aspect-[16/10] overflow-hidden bg-[#020203]">
                    <img
                      src={activeProject.image}
                      alt={activeProject.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                    />
                  </div>

                  {/* Neon Overlay Tag */}
                  <div className="absolute bottom-3 left-3">
                    <span className="px-2.5 py-1 bg-[#0A0D0C]/90 border border-[#02F74C] text-[#02F74C] text-xs font-bold shadow-[0_0_10px_rgba(2,247,76,0.3)]">
                      {activeProject.title}
                    </span>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Right Column: Project Info & Actions (5 cols) */}
            <div className="lg:col-span-5 flex flex-col justify-between">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeProject.id + '-info'}
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <span className="text-xs text-[#02F74C] uppercase tracking-wider block">
                    &lt;{activeProject.category} /&gt;
                  </span>

                  <h3 className="font-code-header text-3xl sm:text-4xl font-extrabold text-[#F3F3F4] tracking-tight uppercase">
                    {activeProject.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#A6A9AA] leading-relaxed">
                    {activeProject.description}
                  </p>

                  {/* Technologies */}
                  <div className="pt-2">
                    <span className="text-[10px] text-[#76A988] uppercase block mb-2">
                      &gt; TECH_STACK:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {activeProject.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="px-2.5 py-1 bg-[#020203] border border-[#02F74C]/35 text-[#02F74C] text-xs"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-6 border-t border-[#02F74C]/20 flex flex-wrap items-center gap-3">
                    <Link
                      to={`/projects/${activeProject.slug}`}
                      className="px-4 py-2 border border-[#02F74C] bg-[#02F74C] text-[#020203] text-xs font-bold uppercase tracking-wider shadow-[0_0_10px_rgba(2,247,76,0.3)] hover:shadow-[0_0_20px_rgba(2,247,76,0.6)] transition-all flex items-center gap-1.5"
                    >
                      <span>[ VIEW DETAILS ]</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>

                    {activeProject.github_url && (
                      <a
                        href={activeProject.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-2 border border-[#02F74C]/40 hover:border-[#02F74C] bg-[#020203] text-[#F3F3F4] hover:text-[#02F74C] text-xs uppercase font-bold transition-all flex items-center gap-1.5"
                      >
                        <GithubIcon className="w-3.5 h-3.5" />
                        <span>[ GITHUB ]</span>
                      </a>
                    )}

                    {activeProject.live_url && (
                      <a
                        href={activeProject.live_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-2 border border-[#02F74C]/40 hover:border-[#02F74C] bg-[#020203] text-[#F3F3F4] hover:text-[#02F74C] text-xs uppercase font-bold transition-all flex items-center gap-1.5"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>[ LIVE DEMO ]</span>
                      </a>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Navigation Controls Bar */}
          <div className="mt-8 sm:mt-10 pt-5 sm:pt-6 border-t border-[#02F74C]/25 flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Previous Button */}
            <button
              type="button"
              onClick={handlePrev}
              className="w-full sm:w-auto justify-center px-4 py-2.5 border border-[#02F74C]/40 hover:border-[#02F74C] bg-[#020203] text-[#02F74C] text-xs font-bold uppercase flex items-center gap-2 transition-all hover:bg-[#02F74C]/10 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>&lt; PREVIOUS</span>
            </button>

            {/* Progress Segment Indicator */}
            <div className="flex items-center gap-2 text-xs text-[#76A988] py-1">
              {publishedProjects.map((p, idx) => (
                <button
                  key={p.id}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2.5 transition-all cursor-pointer rounded-none ${
                    currentIndex === idx
                      ? 'w-8 bg-[#02F74C] shadow-[0_0_8px_#02F74C]'
                      : 'w-3.5 bg-[#02F74C]/20 hover:bg-[#02F74C]/50'
                  }`}
                  aria-label={`Jump to project ${idx + 1}`}
                />
              ))}
            </div>

            {/* Next Button */}
            <button
              type="button"
              onClick={handleNext}
              className="w-full sm:w-auto justify-center px-4 py-2.5 border border-[#02F74C]/40 hover:border-[#02F74C] bg-[#020203] text-[#02F74C] text-xs font-bold uppercase flex items-center gap-2 transition-all hover:bg-[#02F74C]/10 cursor-pointer"
            >
              <span>NEXT &gt;</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Section Code Footer */}
        <div className="text-xs text-[#76A988] mt-6 select-none">
          <CodeClosingTag tag="MY PORTFOLIO" />
        </div>
      </div>
    </section>
  );
};
