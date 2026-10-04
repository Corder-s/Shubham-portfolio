import { supabase, isSupabaseConfigured } from './supabaseClient';

export interface AuthSession {
  user: {
    id: string;
    email: string;
    role: 'admin' | 'visitor';
  } | null;
}

const LOCAL_AUTH_KEY = 'portfolio_auth_user';

export const authService = {
  /**
   * Strictly retrieve current session and verify admin authorization against admin_roles table.
   */
  async getSession(): Promise<AuthSession> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data: sessionData, error: sessionErr } = await supabase.auth.getSession();
        if (sessionErr || !sessionData?.session?.user) {
          return { user: null };
        }

        const user = sessionData.session.user;
        const isAdmin = await this.verifyAdminRole(user.id);

        return {
          user: {
            id: user.id,
            email: user.email || 'Admin',
            role: isAdmin ? 'admin' : 'visitor',
          },
        };
      } catch (err) {
        console.warn('Supabase getSession error:', err);
      }
    }

    // Local / Offline fallback (only used when Supabase is not configured)
    try {
      const saved = localStorage.getItem(LOCAL_AUTH_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.role === 'admin') {
          return {
            user: {
              id: parsed.id,
              email: parsed.email,
              role: 'admin',
            },
          };
        }
      }
    } catch {
      // ignore
    }
    return { user: null };
  },

  /**
   * Database-level authorization check: queries public.admin_roles
   */
  async verifyAdminRole(userId: string): Promise<boolean> {
    if (!isSupabaseConfigured || !supabase || !userId) {
      return false;
    }

    try {
      const { data, error } = await supabase
        .from('admin_roles')
        .select('role')
        .eq('user_id', userId)
        .eq('role', 'admin')
        .maybeSingle();

      if (!error && data && data.role === 'admin') {
        return true;
      }

      // Check primary administrator account fallback
      const { data: userData } = await supabase.auth.getUser();
      const adminEmail = (import.meta.env.VITE_ADMIN_EMAIL || 'damnitzshuham1406@gmail.com').toLowerCase();
      if (userData?.user?.email?.toLowerCase() === adminEmail) {
        return true;
      }

      return false;
    } catch (err) {
      console.warn('Error querying admin_roles:', err);
      return false;
    }
  },

  /**
   * Explicit authorization check for route guards:
   * Returns true ONLY if user is authenticated AND authorized as an admin.
   */
  async verifyAdminAccess(): Promise<boolean> {
    const session = await this.getSession();
    return Boolean(session.user && session.user.role === 'admin');
  },

  async login(email: string, password: string): Promise<{ success: boolean; error?: string; isAdmin?: boolean }> {
    const trimmedEmail = email.trim().toLowerCase();

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: trimmedEmail,
        password,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        const isAuthorizedAdmin = await this.verifyAdminRole(data.user.id);
        if (!isAuthorizedAdmin) {
          // User is authenticated but NOT authorized as an admin
          await supabase.auth.signOut();
          return {
            success: false,
            error: 'Access Denied: This account is not authorized as an administrator.',
          };
        }
        return { success: true, isAdmin: true };
      }
    }

    // Local / Offline fallback (only used when Supabase is not reachable)
    const storedUser = localStorage.getItem(LOCAL_AUTH_KEY);
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        if (parsed.email?.toLowerCase() === trimmedEmail && parsed.password === password) {
          return { success: true, isAdmin: true };
        }
      } catch {
        // ignore
      }
    }

    return {
      success: false,
      error: isSupabaseConfigured
        ? 'Invalid email or password. Ensure your credentials are correct.'
        : 'Invalid credentials. Create an admin account or verify your password.',
    };
  },

  async signUp(): Promise<{ success: boolean; needsEmailConfirmation?: boolean; error?: string }> {
    return {
      success: false,
      error: 'Public registration is disabled. Administrator access is strictly by invitation or direct configuration.',
    };
  },

  async resetPasswordForEmail(email: string): Promise<{ success: boolean; error?: string }> {
    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail) {
      return { success: false, error: 'Please enter your registered admin email.' };
    }

    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.auth.resetPasswordForEmail(trimmedEmail, {
        redirectTo: `${window.location.origin}/admin/login`,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    }

    // Local offline fallback
    const stored = localStorage.getItem(LOCAL_AUTH_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.email?.toLowerCase() === trimmedEmail) {
          return { success: true };
        }
      } catch {
        // ignore
      }
    }
    return { success: true };
  },

  async updatePassword(newPassword: string): Promise<{ success: boolean; error?: string }> {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        return { success: false, error: error.message };
      }
      return { success: true };
    }

    // Local offline fallback
    const stored = localStorage.getItem(LOCAL_AUTH_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        parsed.password = newPassword;
        localStorage.setItem(LOCAL_AUTH_KEY, JSON.stringify(parsed));
        return { success: true };
      } catch {
        // ignore
      }
    }

    return { success: false, error: 'Failed to update password.' };
  },

  async logout(): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.auth.signOut();
      } catch {
        // ignore
      }
    }
    localStorage.removeItem(LOCAL_AUTH_KEY);
  },
};
