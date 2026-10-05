import { supabase, isSupabaseConfigured } from './supabaseClient';
import { localStore } from './localStore';
import { SocialLink } from '../types';

export const socialService = {
  async getSocialLinks(): Promise<SocialLink[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('social_links')
          .select('*')
          .order('display_order', { ascending: true });

        if (!error && data && data.length > 0) {
          const client = supabase;
          data.forEach((l: any) => {
            if (l.platform === 'email' && (l.url.includes('sainishubham.dev@gmail.com') || !l.url)) {
              l.url = 'mailto:damnitzshuham1406@gmail.com';
              client?.from('social_links').update({ url: 'mailto:damnitzshuham1406@gmail.com' }).eq('id', l.id).then();
            }
          });
          // Sync with localStore so IDs match and local cache stays fresh
          localStore.setSocialLinks(data as SocialLink[]);
          return data as SocialLink[];
        }
      } catch (err) {
        console.warn('Failed to load social links from Supabase:', err);
      }
    }
    return localStore.getSocialLinks().sort((a, b) => a.display_order - b.display_order);
  },

  async createSocialLink(data: Omit<SocialLink, 'id'>): Promise<SocialLink> {
    const newItem: SocialLink = { ...data, id: 'soc-' + Date.now() };

    if (isSupabaseConfigured && supabase) {
      try {
        const { data: res, error } = await supabase.from('social_links').insert(data).select().single();
        if (!error && res) {
          const list = localStore.getSocialLinks();
          list.push(res as SocialLink);
          localStore.setSocialLinks(list);
          return res as SocialLink;
        }
        if (error) {
          console.error('Supabase createSocialLink error:', error);
        }
      } catch (err) {
        console.error('Supabase createSocialLink exception:', err);
      }
    }

    const list = localStore.getSocialLinks();
    list.push(newItem);
    localStore.setSocialLinks(list);
    return newItem;
  },

  async updateSocialLink(id: string, updates: Partial<SocialLink>): Promise<SocialLink> {
    let cloudUpdated: SocialLink | null = null;

    if (isSupabaseConfigured && supabase) {
      try {
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
        const targetPlatform = updates.platform;

        if (isUuid) {
          const { data, error } = await supabase
            .from('social_links')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

          if (!error && data) {
            cloudUpdated = data as SocialLink;
          }
        } else if (targetPlatform) {
          // Check if row already exists for this platform in Supabase
          const { data: existingRows } = await supabase
            .from('social_links')
            .select('*')
            .eq('platform', targetPlatform)
            .limit(1);

          if (existingRows && existingRows.length > 0) {
            const { data, error } = await supabase
              .from('social_links')
              .update(updates)
              .eq('id', existingRows[0].id)
              .select()
              .single();

            if (!error && data) {
              cloudUpdated = data as SocialLink;
            }
          } else if (updates.url) {
            const { data, error } = await supabase
              .from('social_links')
              .insert({
                platform: targetPlatform,
                label: updates.label || targetPlatform.charAt(0).toUpperCase() + targetPlatform.slice(1),
                url: updates.url,
                is_active: updates.is_active !== undefined ? updates.is_active : true,
                display_order: updates.display_order || 1,
              })
              .select()
              .single();

            if (!error && data) {
              cloudUpdated = data as SocialLink;
            }
          }
        }
      } catch (err) {
        console.error('Supabase updateSocialLink exception:', err);
      }
    }

    // Always update localStore so UI & memory are updated
    const list = localStore.getSocialLinks();
    const index = list.findIndex(
      (s) => s.id === id || (updates.platform && s.platform === updates.platform)
    );

    if (index !== -1) {
      const merged = cloudUpdated || { ...list[index], ...updates };
      list[index] = merged;
      localStore.setSocialLinks(list);
      return merged;
    }

    const fallback: SocialLink = cloudUpdated || ({ id, platform: 'other', label: '', url: '', is_active: true, display_order: 1, ...updates } as SocialLink);
    list.push(fallback);
    localStore.setSocialLinks(list);
    return fallback;
  },

  async deleteSocialLink(id: string): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from('social_links').delete().eq('id', id);
        if (error) {
          console.error('Supabase deleteSocialLink error:', error);
        }
      } catch (err) {
        console.error('Supabase deleteSocialLink exception:', err);
      }
    }
    const list = localStore.getSocialLinks().filter((s) => s.id !== id);
    localStore.setSocialLinks(list);
    return true;
  },
};
