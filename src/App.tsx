import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { HomePage } from './pages/Home/HomePage';
import { ProjectDetailsPage } from './pages/ProjectDetails/ProjectDetailsPage';
import { NotFoundPage } from './pages/NotFound/NotFoundPage';
import { AdminRouteGuard } from './components/Admin/AdminRouteGuard';
import { supabase, isSupabaseConfigured } from './services/supabaseClient';

// Route-based code splitting: Lazy load Admin components to keep the public bundle fast, light & isolated
const AdminLoginPage = lazy(() =>
  import('./pages/Admin/AdminLoginPage').then((m) => ({ default: m.AdminLoginPage }))
);
const AdminLayout = lazy(() =>
  import('./pages/Admin/AdminLayout').then((m) => ({ default: m.AdminLayout }))
);
const AdminDashboard = lazy(() =>
  import('./pages/Admin/AdminDashboard').then((m) => ({ default: m.AdminDashboard }))
);
const AdminProfile = lazy(() =>
  import('./pages/Admin/AdminProfile').then((m) => ({ default: m.AdminProfile }))
);
const AdminProjects = lazy(() =>
  import('./pages/Admin/AdminProjects').then((m) => ({ default: m.AdminProjects }))
);
const AdminSkills = lazy(() =>
  import('./pages/Admin/AdminSkills').then((m) => ({ default: m.AdminSkills }))
);
const AdminExperience = lazy(() =>
  import('./pages/Admin/AdminExperience').then((m) => ({ default: m.AdminExperience }))
);
const AdminEducation = lazy(() =>
  import('./pages/Admin/AdminEducation').then((m) => ({ default: m.AdminEducation }))
);
const AdminAchievements = lazy(() =>
  import('./pages/Admin/AdminAchievements').then((m) => ({ default: m.AdminAchievements }))
);
const AdminCertifications = lazy(() =>
  import('./pages/Admin/AdminCertifications').then((m) => ({ default: m.AdminCertifications }))
);
const AdminServices = lazy(() =>
  import('./pages/Admin/AdminServices').then((m) => ({ default: m.AdminServices }))
);
const AdminSocialLinks = lazy(() =>
  import('./pages/Admin/AdminSocialLinks').then((m) => ({ default: m.AdminSocialLinks }))
);
const AdminMessages = lazy(() =>
  import('./pages/Admin/AdminMessages').then((m) => ({ default: m.AdminMessages }))
);
const AdminSettings = lazy(() =>
  import('./pages/Admin/AdminSettings').then((m) => ({ default: m.AdminSettings }))
);

const AdminLoadingFallback = () => (
  <div className="min-h-screen bg-[#07090e] flex flex-col items-center justify-center font-mono text-xs text-slate-400">
    <div className="w-8 h-8 border-2 border-[#02F74C]/20 border-t-[#02F74C] rounded-full animate-spin mb-4" />
    <span className="text-[#02F74C] tracking-widest">[ LOADING_MODULE... ]</span>
  </div>
);

/**
 * Global listener that intercepts Supabase recovery links (e.g. from password reset emails)
 * and automatically routes the user to the admin login page in password-reset mode.
 */
function AuthRecoveryRedirector() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const hash = window.location.hash || '';
    const search = window.location.search || '';

    const hasRecoveryIntent =
      hash.includes('type=recovery') ||
      search.includes('type=recovery') ||
      ((hash.includes('error_description=') || search.includes('error_description=')) &&
        !location.pathname.startsWith('/admin'));

    if (hasRecoveryIntent && location.pathname !== '/admin/reset-password') {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('supabase_recovery_pending', 'true');
      }
      navigate(`/admin/reset-password${search}${hash}`, { replace: true });
    }

    if (isSupabaseConfigured && supabase) {
      const { data: authListener } = supabase.auth.onAuthStateChange((event) => {
        if (event === 'PASSWORD_RECOVERY') {
          if (typeof window !== 'undefined') {
            sessionStorage.setItem('supabase_recovery_pending', 'true');
          }
          if (location.pathname !== '/admin/reset-password') {
            navigate('/admin/reset-password', { replace: true });
          }
        }
      });
      return () => {
        authListener?.subscription?.unsubscribe();
      };
    }
  }, [navigate, location]);

  return null;
}

export function App() {
  return (
    <BrowserRouter>
      <AuthRecoveryRedirector />
      <Routes>
        {/* Public Creative Portfolio Routes (Public visitors only touch these) */}
        <Route path="/" element={<HomePage />} />
        <Route path="/projects/:slug" element={<ProjectDetailsPage />} />

        {/* Dedicated Admin Password Reset Route */}
        <Route
          path="/admin/reset-password"
          element={
            <Suspense fallback={<AdminLoadingFallback />}>
              <AdminLoginPage initialMode="reset" />
            </Suspense>
          }
        />

        {/* Admin Authentication Route */}
        <Route
          path="/admin/login"
          element={
            <Suspense fallback={<AdminLoadingFallback />}>
              <AdminLoginPage />
            </Suspense>
          }
        />

        {/* Protected Admin CMS Dashboard Routes (Protected by AdminRouteGuard & Supabase Auth) */}
        <Route
          path="/admin"
          element={
            <Suspense fallback={<AdminLoadingFallback />}>
              <AdminRouteGuard>
                <AdminLayout />
              </AdminRouteGuard>
            </Suspense>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="profile" element={<AdminProfile />} />
          <Route path="projects" element={<AdminProjects />} />
          <Route path="skills" element={<AdminSkills />} />
          <Route path="experience" element={<AdminExperience />} />
          <Route path="education" element={<AdminEducation />} />
          <Route path="achievements" element={<AdminAchievements />} />
          <Route path="certifications" element={<AdminCertifications />} />
          <Route path="services" element={<AdminServices />} />
          <Route path="social-links" element={<AdminSocialLinks />} />
          <Route path="messages" element={<AdminMessages />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        {/* Catch-all 404 Route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
