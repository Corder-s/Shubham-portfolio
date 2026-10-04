import React, { useState, useEffect } from 'react';
import {
  Settings,
  Save,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Shield,
  KeyRound,
  Lock,
  UserCheck,
  Edit3,
  X,
  Globe,
  Sparkles,
  FileCode,
  Bot,
  MessageSquare,
} from 'lucide-react';
import { settingsService } from '../../services/settingsService';
import { localStore } from '../../services/localStore';
import { isSupabaseConfigured } from '../../services/supabaseClient';
import { authService } from '../../services/authService';
import { SiteSettings } from '../../types';

export const AdminSettings: React.FC = () => {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [isEditingSettings, setIsEditingSettings] = useState(false);
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Security & Password states
  const [currentEmail, setCurrentEmail] = useState('Shubham Saini (Admin)');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [updatingPassword, setUpdatingPassword] = useState(false);

  useEffect(() => {
    settingsService.getSettings().then(setSettings);
    authService.getSession().then((session) => {
      if (session?.user?.email) {
        setCurrentEmail(session.user.email);
      }
    });
  }, []);

  if (!settings) {
    return <div className="text-slate-400 font-mono text-xs">Loading system settings...</div>;
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatusMsg(null);

    try {
      const updated = await settingsService.updateSettings(settings);
      setSettings(updated);
      setStatusMsg({ type: 'success', text: 'System settings saved and synchronized.' });
      // Collapse into summarized form
      setIsEditingSettings(false);
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: err.message || 'Failed to save settings.' });
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMsg(null);

    if (newPassword.length < 6) {
      setPasswordMsg({ type: 'error', text: 'Password must be at least 6 characters.' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: 'error', text: 'Passwords do not match.' });
      return;
    }

    setUpdatingPassword(true);
    try {
      const res = await authService.updatePassword(newPassword);
      if (res.success) {
        setPasswordMsg({ type: 'success', text: 'Password successfully updated!' });
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setPasswordMsg({ type: 'error', text: res.error || 'Failed to update password.' });
      }
    } catch (err: any) {
      setPasswordMsg({ type: 'error', text: err.message || 'Error updating password.' });
    } finally {
      setUpdatingPassword(false);
    }
  };

  const handleResetToDefaults = () => {
    if (window.confirm('Reset all local data back to the default seed? Any local changes will be restored to original values.')) {
      localStore.resetToDefaults();
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>System &amp; Account Security</span>
            {!isEditingSettings && (
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800/80">
                ACTIVE
              </span>
            )}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Configure SEO meta tags, manage your admin credentials, and monitor backend database status.
          </p>
        </div>
      </div>

      {statusMsg && (
        <div
          className={`p-4 rounded-xl border flex items-center gap-3 text-xs ${
            statusMsg.type === 'success'
              ? 'bg-emerald-950/60 border-emerald-800 text-emerald-300'
              : 'bg-red-950/60 border-red-800 text-red-300'
          }`}
        >
          {statusMsg.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          )}
          <span>{statusMsg.text}</span>
        </div>
      )}

      {/* Supabase Connection Status Card */}
      <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-5 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
            Supabase Backend Mode
          </h3>
          <p className="text-xs text-slate-400">
            {isSupabaseConfigured
              ? 'Connected to live Supabase cloud database instance (enlbwhvpsifhckxsddhq).'
              : 'Operating in Local Storage fallback mode.'}
          </p>
        </div>
        <span
          className={`px-3 py-1 text-xs font-bold uppercase rounded-full shrink-0 ${
            isSupabaseConfigured
              ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
              : 'bg-amber-950 text-amber-300 border border-amber-700'
          }`}
        >
          {isSupabaseConfigured ? 'Live Supabase Active' : 'Local Fallback Mode'}
        </span>
      </div>

      {/* Admin Security & Password Management Card */}
      <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-6 shadow-lg space-y-5">
        <div className="flex items-center justify-between border-b border-slate-700 pb-3">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Admin Authentication &amp; Credentials
            </h3>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
            <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>{currentEmail}</span>
          </div>
        </div>

        {passwordMsg && (
          <div
            className={`p-3 rounded-lg border text-xs flex items-center gap-2 ${
              passwordMsg.type === 'success'
                ? 'bg-emerald-950/60 border-emerald-800 text-emerald-300'
                : 'bg-red-950/60 border-red-800 text-red-300'
            }`}
          >
            {passwordMsg.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            )}
            <span>{passwordMsg.text}</span>
          </div>
        )}

        <form onSubmit={handlePasswordUpdate} className="space-y-4 max-w-lg">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              New Admin Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                minLength={6}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password (min. 6 characters)"
                className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Confirm New Password
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                minLength={6}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={updatingPassword}
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer disabled:opacity-50"
          >
            <Lock className="w-3.5 h-3.5 text-indigo-400" />
            <span>{updatingPassword ? 'Updating Password...' : 'Change Admin Password'}</span>
          </button>
        </form>

        <p className="text-[11px] text-slate-400 pt-2 border-t border-slate-700/60 leading-relaxed">
          <strong>Tip:</strong> You can also create and manage admin users directly in your{' '}
          <a
            href="https://supabase.com/dashboard/project/enlbwhvpsifhckxsddhq/auth/users"
            target="_blank"
            rel="noreferrer"
            className="text-indigo-400 hover:underline"
          >
            Supabase Authentication Dashboard &rarr;
          </a>
        </p>
      </div>

      {/* ========================================================================= */}
      {/* SEO & WEBSITE CONFIGURATION                                                */}
      {/* ========================================================================= */}
      {!isEditingSettings ? (
        /* 1. SUMMARIZED SEO SETTINGS VIEW */
        <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-6 shadow-xl space-y-5">
          <div className="flex items-center justify-between border-b border-slate-700 pb-4">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Globe className="w-4 h-4 text-indigo-400" />
                <span>Search Engine Optimization &amp; Site Meta</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Current active metadata configuration. Click &quot;Edit Settings&quot; to modify.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsEditingSettings(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold uppercase tracking-wider shadow-md transition-all cursor-pointer hover:shadow-indigo-500/20"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Settings</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div className="p-3.5 bg-slate-900/70 border border-slate-700/60 rounded-lg">
              <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
                Website Browser Title
              </span>
              <p className="text-xs font-semibold text-white">{settings.site_title}</p>
            </div>

            <div className="p-3.5 bg-slate-900/70 border border-slate-700/60 rounded-lg">
              <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
                SEO Meta Title
              </span>
              <p className="text-xs font-semibold text-white">{settings.seo_title || settings.site_title}</p>
            </div>
          </div>

          <div className="p-3.5 bg-slate-900/70 border border-slate-700/60 rounded-lg">
            <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
              SEO Meta Description
            </span>
            <p className="text-xs text-slate-300 leading-relaxed">
              {settings.seo_description || <span className="text-slate-500 italic">No description provided</span>}
            </p>
          </div>

          <div className="p-3.5 bg-slate-900/70 border border-slate-700/60 rounded-lg">
            <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
              Footer Colophon Text
            </span>
            <p className="text-xs text-slate-300 font-mono">
              {settings.footer_text || '© 2026 SHUBHAM SAINI. ALL RIGHTS RESERVED.'}
            </p>
          </div>

          {/* AI Portfolio Assistant Status & Config Summary */}
          <div className="pt-4 border-t border-slate-700/70 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bot className="w-4 h-4 text-emerald-400" />
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  AI Visitor Assistant ({settings.ai_assistant_name || 'Ask Shubham'})
                </h4>
              </div>
              <span
                className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full border ${
                  settings.ai_enabled !== false
                    ? 'bg-emerald-950/80 text-emerald-300 border-emerald-700'
                    : 'bg-red-950/80 text-red-400 border-red-800'
                }`}
              >
                {settings.ai_enabled !== false ? '● ACTIVE & READY' : '○ DISABLED'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3 bg-slate-900/70 border border-slate-700/60 rounded-lg">
                <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
                  Public Assistant Name
                </span>
                <p className="text-xs font-mono font-semibold text-white">
                  {settings.ai_assistant_name || 'Ask Shubham'}
                </p>
              </div>

              <div className="p-3 bg-slate-900/70 border border-slate-700/60 rounded-lg">
                <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
                  Security & Access Boundary
                </span>
                <p className="text-xs text-emerald-400 flex items-center gap-1.5 font-mono">
                  <Shield className="w-3.5 h-3.5 shrink-0" />
                  <span>Public Read-Only • Zero Admin Privileges</span>
                </p>
              </div>
            </div>

            <div className="p-3 bg-slate-900/70 border border-slate-700/60 rounded-lg">
              <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
                Visitor Greeting Message
              </span>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                {settings.ai_welcome_message || "Hi! I'm Shubham's AI portfolio assistant. Ask me anything about his projects, skills, education, achievements, experience, or how to contact him."}
              </p>
            </div>

            {settings.ai_suggested_questions && settings.ai_suggested_questions.length > 0 && (
              <div className="p-3 bg-slate-900/70 border border-slate-700/60 rounded-lg">
                <span className="text-[10px] text-slate-400 uppercase font-bold block mb-2">
                  Pre-Configured Suggested Questions ({settings.ai_suggested_questions.length})
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {settings.ai_suggested_questions.map((q, idx) => (
                    <span
                      key={idx}
                      className="text-[11px] px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 font-mono"
                    >
                      {q}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-700/70 flex items-center justify-between">
            <button
              type="button"
              onClick={handleResetToDefaults}
              className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 border border-slate-700 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Local Database Defaults</span>
            </button>

            <button
              type="button"
              onClick={() => setIsEditingSettings(true)}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold uppercase tracking-wider shadow-md transition-all flex items-center gap-2 cursor-pointer hover:shadow-indigo-500/20"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Settings</span>
            </button>
          </div>
        </div>
      ) : (
        /* 2. FULL EDITABLE SETTINGS FORM */
        <form onSubmit={handleSave} className="space-y-6">
          <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-6 shadow-lg space-y-4">
            <div className="flex items-center justify-between border-b border-slate-700 pb-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span>Search Engine Optimization (SEO) &amp; Metadata</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsEditingSettings(false)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white rounded-lg text-xs font-medium transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                <span>Cancel</span>
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Website Browser Title *
              </label>
              <input
                type="text"
                required
                value={settings.site_title}
                onChange={(e) => setSettings({ ...settings, site_title: e.target.value })}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                SEO Meta Title
              </label>
              <input
                type="text"
                value={settings.seo_title}
                onChange={(e) => setSettings({ ...settings, seo_title: e.target.value })}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                SEO Meta Description
              </label>
              <textarea
                rows={3}
                value={settings.seo_description}
                onChange={(e) => setSettings({ ...settings, seo_description: e.target.value })}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Footer Colophon Text
              </label>
              <input
                type="text"
                value={settings.footer_text}
                onChange={(e) => setSettings({ ...settings, footer_text: e.target.value })}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* AI Assistant Configuration Card in Edit Mode */}
          <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-6 shadow-lg space-y-4">
            <div className="flex items-center justify-between border-b border-slate-700 pb-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Bot className="w-4 h-4 text-emerald-400" />
                <span>AI Visitor Assistant Configuration</span>
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                EDGE FUNCTION ISOLATED
              </span>
            </div>

            <div className="flex items-center gap-3 p-3 bg-slate-900/80 border border-slate-700 rounded-lg">
              <input
                type="checkbox"
                id="ai_enabled"
                checked={settings.ai_enabled !== false}
                onChange={(e) => setSettings({ ...settings, ai_enabled: e.target.checked })}
                className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
              />
              <label htmlFor="ai_enabled" className="text-xs text-slate-200 font-medium cursor-pointer">
                Enable Public AI Portfolio Assistant on Website
              </label>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Assistant Identity / Name
              </label>
              <input
                type="text"
                value={settings.ai_assistant_name || 'Ask Shubham'}
                onChange={(e) => setSettings({ ...settings, ai_assistant_name: e.target.value })}
                placeholder="Ask Shubham"
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Visitor Greeting Message
              </label>
              <textarea
                rows={3}
                value={settings.ai_welcome_message || ''}
                onChange={(e) => setSettings({ ...settings, ai_welcome_message: e.target.value })}
                placeholder="Hi! I'm Shubham's AI portfolio assistant. Ask me anything..."
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none font-sans"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Suggested Prompt Chips (One per line)
              </label>
              <textarea
                rows={6}
                value={(settings.ai_suggested_questions || []).join('\n')}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    ai_suggested_questions: e.target.value
                      .split('\n')
                      .map((s) => s.trim())
                      .filter(Boolean),
                  })
                }
                placeholder={"Tell me about Shubham.\nWhat projects has he built?\nWhat technologies does he know?\nTell me about Snapgram.\nWhat are his achievements?\nHow can I contact him?"}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono resize-none leading-relaxed"
              />
              <p className="text-[10px] text-slate-500 mt-1">
                Enter each quick question on a new line. These appear as clickable chips when visitors open the assistant.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                AI Personality / System Tone
              </label>
              <input
                type="text"
                value={settings.ai_personality || ''}
                onChange={(e) => setSettings({ ...settings, ai_personality: e.target.value })}
                placeholder="professional, concise, friendly developer portfolio assistant"
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
              />
            </div>

            <div className="p-3 bg-slate-900/90 border border-slate-700 rounded-lg text-[11px] text-slate-400 leading-relaxed space-y-1">
              <p className="text-emerald-400 font-semibold flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5" />
                <span>Security &amp; API Key Isolation</span>
              </p>
              <p>
                The AI provider API secret key is stored exclusively as an environment secret in the Supabase Edge Function (<code className="text-slate-300 bg-slate-800 px-1 py-0.5 rounded">supabase secrets set AI_PROVIDER_API_KEY</code>). It is never bundled into client browsers. The assistant executes in strictly read-only mode over public portfolio records.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={() => setIsEditingSettings(false)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 border border-slate-700 rounded-lg text-xs font-medium transition-colors cursor-pointer"
            >
              Cancel &amp; Discard
            </button>

            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold uppercase tracking-wider shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 hover:shadow-indigo-500/20"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Save Settings'}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
