import { supabase, isSupabaseConfigured } from './supabaseClient';
import { localStore } from './localStore';
import { Achievement } from '../types';

export const achievementService = {
  async getAchievements(): Promise<Achievement[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('achievements')
          .select('*')
          .order('display_order', { ascending: true });
        if (!error && data && data.length > 0) {
          localStore.setAchievements(data as Achievement[]);
          return data as Achievement[];
        }
      } catch (err) {
        console.warn('Failed to load achievements from Supabase:', err);
      }
    }
    return localStore.getAchievements().sort((a, b) => a.display_order - b.display_order);
  },

  async createAchievement(data: Omit<Achievement, 'id'>): Promise<Achievement> {
    const newItem: Achievement = { ...data, id: 'ach-' + Date.now() };
    if (isSupabaseConfigured && supabase) {
      try {
        const { data: res, error } = await supabase.from('achievements').insert(data).select().single();
        if (!error && res) {
          const list = localStore.getAchievements();
          list.push(res as Achievement);
          localStore.setAchievements(list);
          return res as Achievement;
        }
      } catch (err) {
        console.error('Supabase createAchievement exception:', err);
      }
    }
    const list = localStore.getAchievements();
    list.push(newItem);
    localStore.setAchievements(list);
    return newItem;
  },

  async updateAchievement(id: string, updates: Partial<Achievement>): Promise<Achievement> {
    let cloudUpdated: Achievement | null = null;
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('achievements').update(updates).eq('id', id).select().single();
        if (!error && data) {
          cloudUpdated = data as Achievement;
        } else if (error) {
          console.error('Supabase updateAchievement error:', error);
        }
      } catch (err) {
        console.error('Supabase updateAchievement exception:', err);
      }
    }

    const list = localStore.getAchievements();
    const index = list.findIndex((a) => a.id === id || (updates.title && a.title === updates.title));
    if (index !== -1) {
      const merged = cloudUpdated || { ...list[index], ...updates };
      list[index] = merged;
      localStore.setAchievements(list);
      return merged;
    }
    if (cloudUpdated) {
      list.push(cloudUpdated);
      localStore.setAchievements(list);
      return cloudUpdated;
    }
    throw new Error('Achievement not found');
  },

  async deleteAchievement(id: string): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('achievements').delete().eq('id', id);
      } catch (err) {
        console.error('Supabase deleteAchievement exception:', err);
      }
    }
    const list = localStore.getAchievements().filter((a) => a.id !== id);
    localStore.setAchievements(list);
    return true;
  },
};
