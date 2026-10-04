import React, { useState, useEffect } from 'react';
import { Navbar } from '../../components/Navbar/Navbar';
import { Hero } from '../../components/Hero/Hero';
import { About } from '../../components/About/About';
import { EducationSection } from '../../components/Education/Education';
import { Achievements } from '../../components/Achievements/Achievements';
import { Skills } from '../../components/Skills/Skills';
import { Projects } from '../../components/Projects/Projects';
import { ExperienceSection } from '../../components/Experience/Experience';
import { Services } from '../../components/Services/Services';
import { GithubSection } from '../../components/Github/Github';
import { Contact } from '../../components/Contact/Contact';
import { WhatsAppButton } from '../../components/SocialDock/WhatsAppButton';
import { Footer } from '../../components/Footer/Footer';
import { DevCanvasBackground } from '../../components/Decorative/DevGraphics';
import { AIAgentChat } from '../../components/AIAgent/AIAgentChat';


import { profileService } from '../../services/profileService';
import { projectService } from '../../services/projectService';
import { skillService } from '../../services/skillService';
import { educationService } from '../../services/educationService';
import { achievementService } from '../../services/achievementService';
import { experienceService } from '../../services/experienceService';
import { serviceService } from '../../services/serviceService';
import { socialService } from '../../services/socialService';
import { settingsService } from '../../services/settingsService';

import {
  Profile,
  Project,
  Skill,
  Education,
  Achievement,
  Experience,
  Service,
  SocialLink,
  SiteSettings,
} from '../../types';

import {
  initialProfile,
  initialProjects,
  initialSkills,
  initialEducation,
  initialAchievements,
  initialExperience,
  initialServices,
  initialSocialLinks,
  initialSiteSettings,
} from '../../data/initialData';

export const HomePage: React.FC = () => {
  const [profile, setProfile] = useState<Profile>(initialProfile);
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [skills, setSkills] = useState<Skill[]>(initialSkills);
  const [education, setEducation] = useState<Education[]>(initialEducation);
  const [achievements, setAchievements] = useState<Achievement[]>(initialAchievements);
  const [experience, setExperience] = useState<Experience[]>(initialExperience);
  const [services, setServices] = useState<Service[]>(initialServices);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>(initialSocialLinks);
  const [settings, setSettings] = useState<SiteSettings>(initialSiteSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Synchronously fetch all dynamic portfolio entities
    Promise.all([
      profileService.getProfile(),
      projectService.getProjects(),
      skillService.getSkills(),
      educationService.getEducation(),
      achievementService.getAchievements(),
      experienceService.getExperience(),
      serviceService.getServices(),
      socialService.getSocialLinks(),
      settingsService.getSettings(),
    ])
      .then(([prof, projs, skls, edu, achs, exp, srvs, socs, sets]) => {
        if (prof) setProfile(prof);
        if (projs && projs.length > 0) setProjects(projs);
        if (skls && skls.length > 0) setSkills(skls);
        if (edu && edu.length > 0) setEducation(edu);
        if (achs && achs.length > 0) setAchievements(achs);
        if (exp && exp.length > 0) setExperience(exp);
        if (srvs && srvs.length > 0) setServices(srvs);
        if (socs && socs.length > 0) setSocialLinks(socs);
        if (sets) setSettings(sets);
      })
      .catch((err) => {
        console.warn('Error loading dynamic database records, using defaults:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Update dynamic page title based on settings
  useEffect(() => {
    if (settings.seo_title || settings.site_title) {
      document.title = settings.seo_title || settings.site_title;
    }
  }, [settings]);

  return (
    <div className="min-h-screen bg-[#020203] text-[#F3F3F4] selection:bg-[#02F74C] selection:text-[#020203] relative">
      {/* Background Cyber Grid */}
      <DevCanvasBackground />

      {/* Sticky Code Header Navigation */}
      <Navbar resumeUrl={profile.resume_url} />

      {/* Main Content Sections */}
      <main className="relative z-10">
        <Hero profile={profile} />
        <About profile={profile} />
        <EducationSection education={education} />
        <Achievements achievements={achievements} />
        <Skills skills={skills} />
        <Projects projects={projects} />
        <ExperienceSection experience={experience} />
        <Services services={services} />
        <GithubSection />
        <Contact profile={profile} socialLinks={socialLinks} />
      </main>

      {/* Floating Multi-Channel Action Dock */}
      <WhatsAppButton
        phone={profile.phone}
        email={profile.email}
        socialLinks={socialLinks}
      />

      {/* Floating AI Assistant - Public Visitor Chatbot */}
      <AIAgentChat settings={settings} />

      {/* Code Footer */}
      <Footer socialLinks={socialLinks} />
    </div>
  );
};

