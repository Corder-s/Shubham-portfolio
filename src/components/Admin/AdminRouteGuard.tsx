import React, { useState, useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { authService } from '../../services/authService';

interface AdminRouteGuardProps {
  children?: React.ReactNode;
}

export const AdminRouteGuard: React.FC<AdminRouteGuardProps> = ({ children }) => {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    let isMounted = true;

    const performAuthorizationCheck = async () => {
      try {
        const authorized = await authService.verifyAdminAccess();
        if (isMounted) {
          setIsAuthorized(authorized);
          setIsLoading(false);
        }
      } catch (err) {
        console.error('Authorization check error:', err);
        if (isMounted) {
          setIsAuthorized(false);
          setIsLoading(false);
        }
      }
    };

    performAuthorizationCheck();

    return () => {
      isMounted = false;
    };
  }, [location.pathname]);

  // Loading state: NEVER render admin content or leak sensitive information
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#07090e] flex flex-col items-center justify-center font-mono text-xs text-slate-400">
        <div className="w-8 h-8 border-2 border-[#02F74C]/20 border-t-[#02F74C] rounded-full animate-spin mb-4" />
        <span className="text-[#02F74C] tracking-widest">[ VERIFYING_ADMIN_AUTHORIZATION... ]</span>
        <span className="text-[10px] text-slate-500 mt-1">Supabase Security Definer Active</span>
      </div>
    );
  }

  // Unauthorized: Redirect directly to login with replace so back-button doesn't expose protected route
  if (!isAuthorized) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  }

  return children ? <>{children}</> : <Outlet />;
};

export default AdminRouteGuard;
