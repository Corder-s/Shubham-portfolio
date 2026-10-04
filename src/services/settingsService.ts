import { supabase, isSupabaseConfigured } from './supabaseClient';
import { localStore } from './localStore';
import { SiteSettings } from '../types';

export const settingsService = {
  async getSettings(): Promise<SiteSettings> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('site_settings').select('*').limit(1).single();
        if (!error && data) {
          localStore.setSettings(data as SiteSettings);
          return data as SiteSettings;
        }
      } catch (err) {
        console.warn('Failed to load settings from Supabase:', err);
      }
    }
    return localStore.getSettings();
  },

  async updateSettings(settings: Partial<SiteSettings>): Promise<SiteSettings> {
    let cloudUpdated: SiteSettings | null = null;
    if (isSupabaseConfigured && supabase) {
      try {
        const { data: existing } = await supabase.from('site_settings').select('id').limit(1).single();
        if (existing?.id) {
          const { data, error } = await supabase
            .from('site_settings')
            .update(settings)
            .eq('id', existing.id)
            .select()
            .single();
          if (!error && data) cloudUpdated = data as SiteSettings;
          else if (error) console.error('Supabase updateSettings error:', error);
        } else {
          const { data, error } = await supabase.from('site_settings').insert(settings).select().single();
          if (!error && data) cloudUpdated = data as SiteSettings;
          else if (error) console.error('Supabase insertSettings error:', error);
        }
      } catch (err) {
        console.error('Supabase updateSettings exception:', err);
      }
    }
    const current = localStore.getSettings();
    const updated = cloudUpdated || { ...current, ...settings };
    localStore.setSettings(updated);
    return updated;
  },
};
