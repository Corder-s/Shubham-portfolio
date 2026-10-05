import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowUpRight } from 'lucide-react';

interface NavbarProps {
  resumeUrl?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ resumeUrl = '/resume.pdf' }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      const sections = ['about', 'education', 'achievements', 'skills', 'projects', 'experience', 'services', 'contact'];
      const scrollPosition = window.scrollY + 250;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
      if (window.scrollY < 180) {
        setActiveSection('home');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { num: '01', label: 'HOME', href: '#home', id: 'home' },
    { num: '02', label: 'ABOUT', href: '#about', id: 'about' },
    { num: '03', label: 'SKILLS', href: '#skills', id: 'skills' },
    { num: '04', label: 'PROJECTS', href: '#projects', id: 'projects' },
    { num: '05', label: 'EXPERIENCE', href: '#experience', id: 'experience' },
  ];

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#020203]/90 backdrop-blur-md border-b border-[#02F74C]/25 shadow-[0_4px_20px_rgba(0,0,0,0.8)] py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Code-style Logo */}
        <a
          href="#"
          className="font-mono text-sm sm:text-base tracking-wider text-[#F3F3F4] flex items-center gap-1.5 group"
        >
          <span className="text-[#02F74C] font-bold">&lt;</span>
          <span className="font-bold text-[#F3F3F4] group-hover:text-[#02F74C] transition-colors tracking-wider">
            SHUBHAM SAINI
          </span>
          <span className="text-[#02F74C] font-bold">&gt;</span>
          <span className="inline-block w-1.5 h-1.5 bg-[#02F74C] rounded-full animate-pulse ml-1" />
        </a>

        {/* Desktop Code-editor Navigation */}
        <nav className="hidden md:flex items-center gap-5 lg:gap-7" aria-label="Developer Navigation">
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <a
                key={link.id}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(link.href);
                }}
                className={`font-mono text-xs tracking-wider transition-all duration-200 relative py-1 flex items-center gap-1.5 ${
                  isActive
                    ? 'text-[#02F74C] glow-neon font-bold'
                    : 'text-[#A6A9AA] hover:text-[#02F74C]'
                }`}
              >
                <span className="text-[10px] opacity-60">&lt;/{link.num}&gt;</span>
                <span>{link.label}</span>
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#02F74C] shadow-[0_0_8px_#02F74C]" />
                )}
              </a>
            );
          })}

          {/* Green Highlighted Contact Action Button */}
          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('#contact');
            }}
            className="px-3.5 py-1.5 border border-[#02F74C] bg-[#02F74C] text-[#020203] font-mono text-xs font-bold uppercase tracking-wider transition-all hover:bg-transparent hover:text-[#02F74C] shadow-[0_0_12px_rgba(2,247,76,0.3)] hover:shadow-[0_0_20px_rgba(2,247,76,0.5)] flex items-center gap-1.5 cursor-pointer"
          >
            <span>[ CONTACT ME ]</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </nav>

        {/* Mobile Terminal Hamburger Button */}
        <div className="flex md:hidden items-center gap-2">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 border border-[#02F74C]/50 bg-[#0A0D0C] text-[#02F74C] focus:outline-none"
            aria-label="Toggle Navigation"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Code Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#02F74C]/30 bg-[#0A0D0C]/95 backdrop-blur-md px-6 py-6 shadow-2xl">
          <div className="font-mono text-[11px] text-[#76A988] mb-3">
            // TERMINAL_MENU
          </div>
          <div className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(link.href);
                }}
                className="font-mono text-xs tracking-wider text-[#F3F3F4] hover:text-[#02F74C] py-1.5 border-b border-[#02F74C]/10 flex items-center justify-between"
              >
                <span>&lt;/{link.num}&gt; {link.label}</span>
                <span className="text-[#02F74C] text-[10px]">&gt;&gt;</span>
              </a>
            ))}
            <div className="pt-3 space-y-2">
              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick('#contact');
                }}
                className="block w-full py-2.5 text-center font-mono text-xs font-bold uppercase tracking-wider border border-[#02F74C] bg-[#02F74C] text-[#020203] shadow-[0_0_12px_rgba(2,247,76,0.3)]"
              >
                [ CONTACT ME ]
              </a>
              <a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full py-2.5 text-center font-mono text-xs font-bold uppercase tracking-wider border border-[#02F74C]/40 bg-[#0A0D0C] text-[#02F74C]"
              >
                [ RESUME / CV ]
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
