import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { GithubIcon } from '../../components/Decorative/Scribbles';
import { projectService } from '../../services/projectService';
import { Project } from '../../types';

export const ProjectDetailsPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!slug) return;
    setLoading(true);
    projectService
      .getProjectBySlug(slug)
      .then((data) => {
        setProject(data);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020203] text-[#F3F3F4] flex items-center justify-center font-mono text-sm">
        <div className="border border-[#02F74C] bg-[#0A0D0C] p-6 shadow-[0_0_20px_rgba(2,247,76,0.2)]">
          [ LOADING_PROJECT_DOSSIER... ]
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-[#020203] text-[#F3F3F4] flex items-center justify-center p-4 font-mono">
        <div className="border border-[#02F74C] bg-[#0A0D0C] p-8 max-w-md text-center shadow-[0_0_25px_rgba(2,247,76,0.15)]">
          <h2 className="font-code-header text-xl font-bold text-[#02F74C] mb-2">404: PROJECT_NOT_FOUND</h2>
          <p className="text-xs text-[#A6A9AA] mb-6">
            The requested project dossier could not be retrieved from the active database.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-4 py-2 border border-[#02F74C] bg-[#02F74C] text-[#020203] text-xs font-bold uppercase"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>[ RETURN_HOME ]</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020203] text-[#F3F3F4] pt-8 pb-20 font-mono">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb */}
        <div className="border-b border-[#02F74C]/25 pb-4 mb-8 flex items-center justify-between text-xs">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-[#02F74C] hover:underline uppercase font-bold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>&lt; BACK TO PORTFOLIO</span>
          </Link>
          <div className="text-[#76A988]">
            &lt;PROJECT /&gt; // {project.slug}
          </div>
        </div>

        {/* Project Header */}
        <header className="mb-10">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="px-2.5 py-0.5 bg-[#02F74C]/10 border border-[#02F74C]/40 text-[#02F74C] text-xs font-bold uppercase">
              {project.category}
            </span>
            <span className="text-xs text-[#76A988]">
              • STATUS: {project.status}
            </span>
          </div>

          <h1 className="font-code-header text-4xl sm:text-6xl lg:text-7xl uppercase text-[#F3F3F4] tracking-tight leading-[0.95] mb-4">
            {project.title}
          </h1>

          <p className="text-sm sm:text-base text-[#A6A9AA] max-w-3xl leading-relaxed">
            &gt; {project.description}
          </p>
        </header>

        {/* Primary Project Visual */}
        <div className="border border-[#02F74C] bg-[#0A0D0C] p-3 sm:p-4 shadow-[0_0_35px_rgba(2,247,76,0.15)] mb-10">
          <div className="aspect-[16/9] overflow-hidden bg-[#020203] border border-[#02F74C]/30">
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Action Links Bar */}
        <div className="flex flex-wrap gap-4 mb-12 pb-8 border-b border-[#02F74C]/20">
          {project.live_url && (
            <a
              href={project.live_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 border border-[#02F74C] bg-[#02F74C] text-[#020203] text-xs uppercase font-bold shadow-[0_0_15px_rgba(2,247,76,0.3)] hover:shadow-[0_0_25px_rgba(2,247,76,0.6)]"
            >
              <span>[ LIVE DEMO ]</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          )}

          {project.github_url && (
            <a
              href={project.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 border border-[#02F74C]/40 hover:border-[#02F74C] bg-[#0A0D0C] text-[#F3F3F4] hover:text-[#02F74C] text-xs uppercase font-bold transition-all"
            >
              <GithubIcon className="w-4 h-4" />
              <span>[ GITHUB SOURCE ]</span>
            </a>
          )}
        </div>

        {/* Deep Dive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content (8 cols) */}
          <div className="lg:col-span-8 space-y-8">
            {/* Overview & Architecture */}
            <section className="border border-[#02F74C]/30 bg-[#0A0D0C] p-6 sm:p-8">
              <h2 className="font-code-header text-xl uppercase text-[#02F74C] mb-3 border-b border-[#02F74C]/20 pb-2">
                &gt; OVERVIEW &amp; ARCHITECTURE
              </h2>
              <p className="text-xs sm:text-sm text-[#A6A9AA] leading-relaxed">
                {project.long_description || project.description}
              </p>
            </section>

            {/* Core Features */}
            {project.features && project.features.length > 0 && (
              <section className="border border-[#02F74C]/30 bg-[#0A0D0C] p-6 sm:p-8">
                <h2 className="font-code-header text-xl uppercase text-[#02F74C] mb-4 border-b border-[#02F74C]/20 pb-2">
                  &gt; VERIFIED_CAPABILITIES
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {project.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 p-3 bg-[#020203] border border-[#02F74C]/20">
                      <span className="text-[#02F74C] font-bold">+</span>
                      <span className="text-xs text-[#F3F3F4]">{feature}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Gallery Screenshots */}
            {project.gallery && project.gallery.length > 1 && (
              <section className="border border-[#02F74C]/30 bg-[#0A0D0C] p-6 sm:p-8">
                <h2 className="font-code-header text-xl uppercase text-[#02F74C] mb-4 border-b border-[#02F74C]/20 pb-2">
                  &gt; SCREENSHOT_GALLERY
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {project.gallery.map((img, i) => (
                    <div key={i} className="border border-[#02F74C]/25 aspect-[16/10] overflow-hidden bg-[#020203]">
                      <img src={img} alt={`${project.title} gallery ${i + 1}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Right Sidebar: Tech Stack & System Record (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="border border-[#02F74C]/30 bg-[#0A0D0C] p-6">
              <h3 className="text-xs font-bold uppercase text-[#02F74C] tracking-wider mb-4 border-b border-[#02F74C]/20 pb-2">
                &gt; TECH_STACK
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="text-xs font-mono px-2.5 py-1 border border-[#02F74C]/40 bg-[#020203] text-[#02F74C]"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="border border-[#02F74C]/30 bg-[#0A0D0C] p-6 text-xs text-[#A6A9AA] space-y-2">
              <h3 className="text-xs font-bold uppercase text-[#02F74C] tracking-wider mb-3">
                &gt; DATABASE_RECORD
              </h3>
              <div className="flex justify-between border-b border-[#02F74C]/10 pb-1">
                <span>CATEGORY:</span>
                <span className="text-[#F3F3F4] font-bold">{project.category}</span>
              </div>
              <div className="flex justify-between border-b border-[#02F74C]/10 pb-1">
                <span>STATUS:</span>
                <span className="text-[#02F74C] font-bold uppercase">{project.status}</span>
              </div>
              <div className="flex justify-between">
                <span>ID:</span>
                <span className="text-[#76A988] font-mono">{project.id}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
