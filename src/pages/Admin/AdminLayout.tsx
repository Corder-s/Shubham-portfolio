import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  User,
  FolderGit2,
  Cpu,
  GraduationCap,
  Trophy,
  Briefcase,
  Layers,
  Award,
  Share2,
  Mail,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Shield,
} from 'lucide-react';
import { authService, AuthSession } from '../../services/authService';
import { contactService } from '../../services/contactService';

export const AdminLayout: React.FC = () => {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    authService.getSession().then((sess) => {
      if (!sess.user || sess.user.role !== 'admin') {
        navigate('/admin/login', { replace: true });
      } else {
        setSession(sess);
      }
      setCheckingAuth(false);
    });

    // Fetch unread messages count
    contactService.getMessages().then((msgs) => {
      const unread = msgs.filter((m) => m.status === 'new').length;
      setUnreadCount(unread);
    });
  }, [navigate]);

  const handleLogout = async () => {
    await authService.logout();
    navigate('/admin/login');
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-200 flex items-center justify-center font-mono text-sm">
        Verifying authorization...
      </div>
    );
  }

  const navItems = [
    { label: 'Dashboard', path: '/admin', icon: LayoutDashboard, end: true },
    { label: 'Profile', path: '/admin/profile', icon: User },
    { label: 'Projects', path: '/admin/projects', icon: FolderGit2 },
    { label: 'Skills', path: '/admin/skills', icon: Cpu },
    { label: 'Education', path: '/admin/education', icon: GraduationCap },
    { label: 'Achievements', path: '/admin/achievements', icon: Trophy },
    { label: 'Experience', path: '/admin/experience', icon: Briefcase },
    { label: 'Services', path: '/admin/services', icon: Layers },
    { label: 'Certifications', path: '/admin/certifications', icon: Award },
    { label: 'Social Links', path: '/admin/social-links', icon: Share2 },
    { label: 'Messages', path: '/admin/messages', icon: Mail, badge: unreadCount },
    { label: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col md:flex-row">
      {/* Mobile Top Header */}
      <div className="md:hidden bg-slate-950 border-b border-slate-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-indigo-400" />
          <span className="font-bold text-sm text-white tracking-wide">CMS Admin</span>
        </div>
        <button
          type="button"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-800"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-40 h-screen w-64 bg-slate-950 border-r border-slate-800 flex flex-col justify-between transition-transform duration-200 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div>
          {/* Logo / Header */}
          <div className="p-5 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-black text-sm">
                S
              </div>
              <div>
                <h1 className="font-bold text-sm text-white leading-tight">Shubham CMS</h1>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest">Admin Control</p>
              </div>
            </div>
            <Link
              to="/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800"
              title="Open Public Portfolio"
            >
              <ExternalLink className="w-4 h-4" />
            </Link>
          </div>

          {/* Nav List */}
          <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-140px)]">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.end}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                      isActive
                        ? 'bg-indigo-600 text-white font-semibold'
                        : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                    }`
                  }
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && item.badge > 0 ? (
                    <span className="px-1.5 py-0.5 text-[10px] font-bold bg-amber-500 text-slate-950 rounded-full">
                      {item.badge}
                    </span>
                  ) : null}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Bottom Profile & Logout */}
        <div className="p-3 border-t border-slate-800">
          <div className="p-2 bg-slate-900 rounded-lg flex items-center justify-between">
            <div className="overflow-hidden mr-2">
              <p className="text-xs font-semibold text-white truncate">
                {session?.user?.email || 'Shubham Saini (Admin)'}
              </p>
              <p className="text-[10px] text-emerald-400">Authenticated Admin</p>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="p-1.5 text-slate-400 hover:text-red-400 rounded hover:bg-slate-800 transition-colors"
              title="Log Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 bg-slate-900 min-h-screen overflow-x-hidden">
        <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
