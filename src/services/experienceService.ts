import { supabase, isSupabaseConfigured } from './supabaseClient';
import { localStore } from './localStore';
import { Experience } from '../types';

export const experienceService = {
  async getExperience(): Promise<Experience[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('experience')
          .select('*')
          .order('display_order', { ascending: true });
        if (!error && data && data.length > 0) {
          localStore.setExperience(data as Experience[]);
          return data as Experience[];
        }
      } catch (err) {
        console.warn('Failed to load experience from Supabase:', err);
      }
    }
    return localStore.getExperience().sort((a, b) => a.display_order - b.display_order);
  },

  async createExperience(data: Omit<Experience, 'id'>): Promise<Experience> {
    const newItem: Experience = { ...data, id: 'exp-' + Date.now() };
    if (isSupabaseConfigured && supabase) {
      try {
        const { data: res, error } = await supabase.from('experience').insert(data).select().single();
        if (!error && res) {
          const list = localStore.getExperience();
          list.push(res as Experience);
          localStore.setExperience(list);
          return res as Experience;
        }
      } catch (err) {
        console.error('Supabase createExperience exception:', err);
      }
    }
    const list = localStore.getExperience();
    list.push(newItem);
    localStore.setExperience(list);
    return newItem;
  },

  async updateExperience(id: string, updates: Partial<Experience>): Promise<Experience> {
    let cloudUpdated: Experience | null = null;
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('experience').update(updates).eq('id', id).select().single();
        if (!error && data) {
          cloudUpdated = data as Experience;
        } else if (error) {
          console.error('Supabase updateExperience error:', error);
        }
      } catch (err) {
        console.error('Supabase updateExperience exception:', err);
      }
    }

    const list = localStore.getExperience();
    const index = list.findIndex((e) => e.id === id || (updates.role && e.role === updates.role));
    if (index !== -1) {
      const merged = cloudUpdated || { ...list[index], ...updates };
      list[index] = merged;
      localStore.setExperience(list);
      return merged;
    }
    if (cloudUpdated) {
      list.push(cloudUpdated);
      localStore.setExperience(list);
      return cloudUpdated;
    }
    throw new Error('Experience entry not found');
  },

  async deleteExperience(id: string): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('experience').delete().eq('id', id);
      } catch (err) {
        console.error('Supabase deleteExperience exception:', err);
      }
    }
    const list = localStore.getExperience().filter((e) => e.id !== id);
    localStore.setExperience(list);
    return true;
  },
};
