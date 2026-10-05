import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FolderGit2,
  Cpu,
  Trophy,
  Briefcase,
  Mail,
  Award,
  Plus,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { projectService } from '../../services/projectService';
import { skillService } from '../../services/skillService';
import { achievementService } from '../../services/achievementService';
import { experienceService } from '../../services/experienceService';
import { contactService } from '../../services/contactService';
import { certificationService } from '../../services/certificationService';
import { Project, ContactMessage } from '../../types';

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    projects: 0,
    skills: 0,
    achievements: 0,
    experience: 0,
    messages: 0,
    unreadMessages: 0,
    certifications: 0,
  });

  const [recentProjects, setRecentProjects] = useState<Project[]>([]);
  const [recentMessages, setRecentMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      projectService.getAdminProjects(),
      skillService.getSkills(),
      achievementService.getAchievements(),
      experienceService.getExperience(),
      contactService.getMessages(),
      certificationService.getCertifications(),
    ]).then(([projs, sks, achs, exps, msgs, certs]) => {
      setStats({
        projects: projs.length,
        skills: sks.length,
        achievements: achs.length,
        experience: exps.length,
        messages: msgs.length,
        unreadMessages: msgs.filter((m) => m.status === 'new').length,
        certifications: certs.length,
      });

      setRecentProjects(projs.slice(0, 3));
      setRecentMessages(msgs.slice(0, 4));
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div className="text-slate-400 font-mono text-xs">Loading dashboard metrics...</div>;
  }

  const statCards = [
    { title: 'Total Projects', value: stats.projects, icon: FolderGit2, link: '/admin/projects', color: 'text-indigo-400' },
    { title: 'Active Skills', value: stats.skills, icon: Cpu, link: '/admin/skills', color: 'text-emerald-400' },
    { title: 'Achievements', value: stats.achievements, icon: Trophy, link: '/admin/achievements', color: 'text-amber-400' },
    { title: 'Experience Roles', value: stats.experience, icon: Briefcase, link: '/admin/experience', color: 'text-sky-400' },
    {
      title: 'Messages',
      value: stats.messages,
      subValue: stats.unreadMessages > 0 ? `${stats.unreadMessages} new` : undefined,
      icon: Mail,
      link: '/admin/messages',
      color: 'text-rose-400',
    },
    { title: 'Certificates', value: stats.certifications, icon: Award, link: '/admin/certifications', color: 'text-purple-400' },
  ];

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Overview Dashboard</h2>
          <p className="text-xs text-slate-400 mt-1">
            Realtime administration, database synchronization & content controls.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/projects"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Project</span>
          </Link>
          <Link
            to="/"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-medium transition-colors"
          >
            <span>Live Portfolio</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.title}
              to={card.link}
              className="bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 p-4 rounded-xl transition-all hover:scale-[1.02] flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-medium text-slate-400 truncate">{card.title}</span>
                <Icon className={`w-4 h-4 ${card.color}`} />
              </div>
              <div>
                <span className="text-2xl font-black text-white">{card.value}</span>
                {card.subValue && (
                  <span className="ml-2 text-[10px] px-1.5 py-0.5 bg-rose-900/60 text-rose-300 rounded font-semibold">
                    {card.subValue}
                  </span>
                )}
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick Action Buttons */}
      <div className="bg-slate-800/50 border border-slate-700/80 rounded-xl p-5">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
          Quick Actions
        </h3>
        <div className="flex flex-wrap gap-2.5">
          <Link
            to="/admin/projects"
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-lg text-xs font-medium text-slate-200 flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5 text-indigo-400" />
            <span>New Project</span>
          </Link>
          <Link
            to="/admin/skills"
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-lg text-xs font-medium text-slate-200 flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5 text-emerald-400" />
            <span>New Skill</span>
          </Link>
          <Link
            to="/admin/experience"
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-lg text-xs font-medium text-slate-200 flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5 text-sky-400" />
            <span>New Experience</span>
          </Link>
          <Link
            to="/admin/achievements"
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-lg text-xs font-medium text-slate-200 flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5 text-amber-400" />
            <span>New Achievement</span>
          </Link>
          <Link
            to="/admin/messages"
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-lg text-xs font-medium text-slate-200 flex items-center gap-1.5"
          >
            <Mail className="w-3.5 h-3.5 text-rose-400" />
            <span>View All Messages</span>
          </Link>
        </div>
      </div>

      {/* Split Grid: Recent Projects & Recent Inbound Messages */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Projects */}
        <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-700 pb-3 mb-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <FolderGit2 className="w-4 h-4 text-indigo-400" />
                <span>Featured Projects in Catalog</span>
              </h3>
              <Link to="/admin/projects" className="text-xs text-indigo-400 hover:underline">
                View all
              </Link>
            </div>

            <div className="space-y-3">
              {recentProjects.map((p) => (
                <div
                  key={p.id}
                  className="p-3 bg-slate-900/80 rounded-lg border border-slate-700/60 flex items-center justify-between"
                >
                  <div className="overflow-hidden mr-3">
                    <h4 className="text-xs font-bold text-white truncate">{p.title}</h4>
                    <p className="text-[11px] text-slate-400 truncate">{p.category} • {p.technologies.join(', ')}</p>
                  </div>
                  <span className="px-2 py-0.5 text-[10px] uppercase font-bold bg-slate-800 text-slate-300 rounded border border-slate-600">
                    {p.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-700 text-right">
            <Link to="/admin/projects" className="text-xs text-slate-400 hover:text-white flex items-center justify-end gap-1">
              <span>Manage all projects</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Recent Messages */}
        <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-700 pb-3 mb-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Mail className="w-4 h-4 text-rose-400" />
                <span>Recent Inbound Messages</span>
              </h3>
              <Link to="/admin/messages" className="text-xs text-rose-400 hover:underline">
                View all
              </Link>
            </div>

            <div className="space-y-3">
              {recentMessages.length === 0 ? (
                <p className="text-xs text-slate-500 py-4 text-center">No messages received yet.</p>
              ) : (
                recentMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className="p-3 bg-slate-900/80 rounded-lg border border-slate-700/60 flex items-start justify-between"
                  >
                    <div className="overflow-hidden mr-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">{msg.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono truncate">{msg.email}</span>
                      </div>
                      <p className="text-xs text-slate-300 font-medium truncate mt-0.5">{msg.subject}</p>
                      <p className="text-[11px] text-slate-400 truncate">{msg.message}</p>
                    </div>
                    <span
                      className={`px-1.5 py-0.5 text-[9px] uppercase font-bold rounded ${
                        msg.status === 'new'
                          ? 'bg-amber-900/80 text-amber-200 border border-amber-600'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {msg.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-700 text-right">
            <Link to="/admin/messages" className="text-xs text-slate-400 hover:text-white flex items-center justify-end gap-1">
              <span>Open message inbox</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
