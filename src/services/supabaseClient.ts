import { createClient, SupabaseClient } from '@supabase/supabase-js';

const envUrl = import.meta.env.VITE_SUPABASE_URL;
const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabaseUrl =
  (typeof envUrl === 'string' && envUrl.trim() !== '' ? envUrl.trim() : '') ||
  'https://enlbwhvpsifhckxsddhq.supabase.co';

const supabaseAnonKey =
  (typeof envKey === 'string' && envKey.trim() !== '' ? envKey.trim() : '') ||
  'sb_publishable_IlJ_vSJ7-HwAvAXl7SYNbw_jlkpmaBp';

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl !== 'https://your-project-id.supabase.co' &&
  !supabaseUrl.includes('your-project')
);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

if (!isSupabaseConfigured) {
  console.info(
    '%c[Supabase]%c Using local database storage mode. To connect live Supabase, configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.',
    'background: #15152B; color: #F7F6F0; padding: 2px 5px; font-weight: bold;',
    'color: inherit;'
  );
}
