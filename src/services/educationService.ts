import { supabase, isSupabaseConfigured } from './supabaseClient';
import { localStore } from './localStore';
import { Education } from '../types';

export const educationService = {
  async getEducation(): Promise<Education[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('education')
          .select('*')
          .order('display_order', { ascending: true });
        if (!error && data && data.length > 0) {
          localStore.setEducation(data as Education[]);
          return data as Education[];
        }
      } catch (err) {
        console.warn('Failed to load education from Supabase:', err);
      }
    }
    return localStore.getEducation().sort((a, b) => a.display_order - b.display_order);
  },

  async createEducation(eduData: Omit<Education, 'id'>): Promise<Education> {
    const newEdu: Education = { ...eduData, id: 'edu-' + Date.now() };
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('education').insert(eduData).select().single();
        if (!error && data) {
          const list = localStore.getEducation();
          list.push(data as Education);
          localStore.setEducation(list);
          return data as Education;
        }
      } catch (err) {
        console.error('Supabase createEducation exception:', err);
      }
    }
    const list = localStore.getEducation();
    list.push(newEdu);
    localStore.setEducation(list);
    return newEdu;
  },

  async updateEducation(id: string, updates: Partial<Education>): Promise<Education> {
    let cloudUpdated: Education | null = null;
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('education').update(updates).eq('id', id).select().single();
        if (!error && data) {
          cloudUpdated = data as Education;
        } else if (error) {
          console.error('Supabase updateEducation error:', error);
        }
      } catch (err) {
        console.error('Supabase updateEducation exception:', err);
      }
    }

    const list = localStore.getEducation();
    const index = list.findIndex((e) => e.id === id || (updates.degree && e.degree === updates.degree));
    if (index !== -1) {
      const merged = cloudUpdated || { ...list[index], ...updates };
      list[index] = merged;
      localStore.setEducation(list);
      return merged;
    }
    if (cloudUpdated) {
      list.push(cloudUpdated);
      localStore.setEducation(list);
      return cloudUpdated;
    }
    throw new Error('Education entry not found');
  },

  async deleteEducation(id: string): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('education').delete().eq('id', id);
      } catch (err) {
        console.error('Supabase deleteEducation exception:', err);
      }
    }
    const list = localStore.getEducation().filter((e) => e.id !== id);
    localStore.setEducation(list);
    return true;
  },
};
