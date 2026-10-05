import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Shield,
  Lock,
  Mail,
  ArrowLeft,
  Loader2,
  KeyRound,
  CheckCircle2,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { authService } from '../../services/authService';
import { supabase, isSupabaseConfigured } from '../../services/supabaseClient';

interface AdminLoginPageProps {
  initialMode?: 'signin' | 'forgot' | 'reset';
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ initialMode }) => {
  const [mode, setMode] = useState<'signin' | 'forgot' | 'reset'>(() => {
    if (initialMode) return initialMode;
    if (typeof window !== 'undefined') {
      if (window.location.pathname.includes('reset-password')) return 'reset';
      if (sessionStorage.getItem('supabase_recovery_pending') === 'true') return 'reset';
    }
    return 'signin';
  });
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(() => {
    if (typeof window === 'undefined') return '';
    const rawHash = window.location.hash ? window.location.hash.replace(/^#/, '') : '';
    const hashParams = new URLSearchParams(rawHash);
    const searchParams = new URLSearchParams(window.location.search);
    const errorDesc = hashParams.get('error_description') || searchParams.get('error_description');
    const errorCode = hashParams.get('error_code') || searchParams.get('error_code');
    if (errorDesc) {
      return decodeURIComponent(errorDesc.replace(/\+/g, ' '));
    }
    if (errorCode) {
      return `Auth notification: ${errorCode}`;
    }
    return '';
  });
  const [successMsg, setSuccessMsg] = useState(() => {
    if (typeof window !== 'undefined' && window.location.pathname.includes('reset-password')) {
      return 'Recovery session active. Enter your new password below.';
    }
    return '';
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Listen for Supabase recovery token when user clicks the reset link in their email
  useEffect(() => {
    // 1. Check for recovery mode in hash, query or pathname
    const rawHash = window.location.hash ? window.location.hash.replace(/^#/, '') : '';
    const hashParams = new URLSearchParams(rawHash);
    const searchParams = new URLSearchParams(window.location.search);
    const type = hashParams.get('type') || searchParams.get('type');
    if (
      type === 'recovery' ||
      rawHash.includes('type=recovery') ||
      window.location.pathname.includes('reset-password') ||
      sessionStorage.getItem('supabase_recovery_pending') === 'true'
    ) {
      setMode('reset');
      sessionStorage.setItem('supabase_recovery_pending', 'true');
      if (!successMsg) {
        setSuccessMsg('Recovery session active. Enter your new password below.');
      }
    }

    if (isSupabaseConfigured && supabase) {
      const { data: authListener } = supabase.auth.onAuthStateChange(async (event) => {
        if (event === 'PASSWORD_RECOVERY') {
          setMode('reset');
          sessionStorage.setItem('supabase_recovery_pending', 'true');
          setSuccessMsg('Authenticated via recovery link. Please choose a new secure password.');
        }
      });

      return () => {
        authListener?.subscription?.unsubscribe();
      };
    }
  }, [successMsg]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      if (mode === 'signin') {
        const res = await authService.login(email, password);
        if (res.success) {
          navigate('/admin');
        } else {
          setError(res.error || 'Failed to authenticate');
        }
      } else if (mode === 'forgot') {
        const res = await authService.resetPasswordForEmail(email);
        if (res.success) {
          setSuccessMsg(
            'Password reset link has been dispatched to your email! Please check your inbox and click the recovery link.'
          );
        } else {
          setError(res.error || 'Failed to send password reset email.');
        }
      } else if (mode === 'reset') {
        if (password !== confirmPassword) {
          setError('Passwords do not match. Please verify both fields.');
          setLoading(false);
          return;
        }
        if (password.length < 6) {
          setError('Password must contain at least 6 characters.');
          setLoading(false);
          return;
        }

        const res = await authService.updatePassword(password);
        if (res.success) {
          setSuccessMsg('Your password has been successfully updated! You can now sign in.');
          setPassword('');
          setConfirmPassword('');
          setMode('signin');
          if (typeof window !== 'undefined') {
            sessionStorage.removeItem('supabase_recovery_pending');
          }
          // Clean URL hash so refreshing doesn't keep the recovery token
          if (typeof window !== 'undefined' && window.history && window.history.replaceState) {
            window.history.replaceState(null, '', window.location.pathname);
          }
        } else {
          setError(res.error || 'Failed to update password.');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Authentication error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-indigo-600 text-white shadow-lg mb-4">
          <Shield className="w-8 h-8" />
        </div>
        <h2 className="text-3xl font-extrabold tracking-tight text-white">
          Admin CMS Portal
        </h2>
        <p className="mt-2 text-sm text-slate-400">
          Shubham Saini Portfolio &amp; Content Engine
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-slate-800 py-8 px-6 shadow-xl rounded-xl sm:px-10 border border-slate-700">

          {/* Dedicated Forgot Password Interface Header */}
          {mode === 'forgot' && (
            <div className="mb-6 pb-4 border-b border-slate-700 text-center">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-2">
                <RotateCcw className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white tracking-wide">
                Forgot Password
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Enter your admin email address below to receive password reset instructions.
              </p>
            </div>
          )}

          {mode === 'reset' && (
            <div className="mb-6 pb-3 border-b border-slate-700 text-center">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center justify-center gap-1.5">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span>Set New Admin Password</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Enter your new password to restore admin credentials.
              </p>
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 bg-red-900/50 border border-red-500 rounded-lg text-red-200 text-xs">
              {error}
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 bg-emerald-950/60 border border-emerald-600 rounded-lg text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Email Field (for signin, signup, forgot) */}
            {mode !== 'reset' && (
              <div>
                <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-1">
                  Admin Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="damnitzshuham1406@gmail.com"
                  />
                </div>
              </div>
            )}

            {/* Password Field (for signin, signup, reset) */}
            {mode !== 'forgot' && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider">
                    {mode === 'reset' ? 'New Password' : 'Password'}
                  </label>
                  {mode === 'signin' && (
                    <button
                      type="button"
                      onClick={() => {
                        setMode('forgot');
                        setError('');
                        setSuccessMsg('');
                      }}
                      className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder={mode === 'reset' ? 'Enter at least 6 characters' : 'Enter your secure password'}
                  />
                </div>
              </div>
            )}

            {/* Confirm Password Field (for reset mode) */}
            {mode === 'reset' && (
              <div>
                <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-1">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Repeat new password"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-lg shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>
                    {mode === 'signin'
                      ? 'Verifying Session...'
                      : mode === 'forgot'
                      ? 'Dispatching Reset Link...'
                      : 'Updating Password...'}
                  </span>
                </>
              ) : mode === 'signin' ? (
                <>
                  <KeyRound className="w-4 h-4" />
                  <span>Sign In with Credentials</span>
                </>
              ) : mode === 'forgot' ? (
                <>
                  <RotateCcw className="w-4 h-4" />
                  <span>Send Password Reset Link</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Save New Password</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Back to Sign In Link when in forgot or reset mode */}
          {(mode === 'forgot' || mode === 'reset') && (
            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => {
                  setMode('signin');
                  setError('');
                  setSuccessMsg('');
                }}
                className="text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                &larr; Remembered your password? Back to Sign In
              </button>
            </div>
          )}
        </div>

        <div className="mt-6 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Public Creative Portfolio</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
