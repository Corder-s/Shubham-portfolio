import { supabase, isSupabaseConfigured } from './supabaseClient';
import { localStore } from './localStore';
import { Profile } from '../types';
import { formatSocialUrl } from '../utils/urlHelper';

export const profileService = {
  async getProfile(): Promise<Profile> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('profiles').select('*').limit(1).single();
        if (!error && data) {
          if (data.email === 'sainishubham.dev@gmail.com' || !data.email) {
            data.email = 'damnitzshuham1406@gmail.com';
            supabase.from('profiles').update({ email: 'damnitzshuham1406@gmail.com' }).eq('id', data.id).then();
          }
          localStore.setProfile(data as Profile);
          return data as Profile;
        }
      } catch (err) {
        console.warn('Failed to load profile from Supabase:', err);
      }
    }
    return localStore.getProfile();
  },

  async updateProfile(profile: Partial<Profile>): Promise<Profile> {
    let cloudUpdated: Profile | null = null;
    if (isSupabaseConfigured && supabase) {
      try {
        const { data: existing } = await supabase.from('profiles').select('id').limit(1).single();
        if (existing?.id) {
          const { data, error } = await supabase
            .from('profiles')
            .update(profile)
            .eq('id', existing.id)
            .select()
            .single();
          if (!error && data) cloudUpdated = data as Profile;
          else if (error) console.error('Supabase updateProfile error:', error);
        } else {
          const { data, error } = await supabase.from('profiles').insert(profile).select().single();
          if (!error && data) cloudUpdated = data as Profile;
          else if (error) console.error('Supabase insertProfile error:', error);
        }
      } catch (err) {
        console.error('Supabase updateProfile exception:', err);
      }
    }
    const current = localStore.getProfile();
    const updated = cloudUpdated || { ...current, ...profile };
    localStore.setProfile(updated);

    // Sync phone channel if phone was updated and phone link is empty
    if (profile.phone && profile.phone.trim()) {
      try {
        const links = localStore.getSocialLinks();
        let changed = false;

        links.forEach((l) => {
          if (l.platform === 'phone' && !l.url) {
            l.url = formatSocialUrl('phone', profile.phone!);
            changed = true;
          }
        });

        if (changed) {
          localStore.setSocialLinks(links);
        }
      } catch (e) {
        console.warn('Failed to sync phone in localStore:', e);
      }
    }

    return updated;
  },
};

