import { supabase, isSupabaseConfigured } from './supabaseClient';
import { localStore } from './localStore';
import { Skill } from '../types';

export const skillService = {
  async getSkills(): Promise<Skill[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('skills')
          .select('*')
          .order('display_order', { ascending: true });
        if (!error && data && data.length > 0) {
          localStore.setSkills(data as Skill[]);
          return data as Skill[];
        }
      } catch (err) {
        console.warn('Failed to load skills from Supabase:', err);
      }
    }
    return localStore.getSkills().sort((a, b) => a.display_order - b.display_order);
  },

  async createSkill(skillData: Omit<Skill, 'id'>): Promise<Skill> {
    const newSkill: Skill = { ...skillData, id: 'sk-' + Date.now() };
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('skills').insert(skillData).select().single();
        if (!error && data) {
          const skills = localStore.getSkills();
          skills.push(data as Skill);
          localStore.setSkills(skills);
          return data as Skill;
        }
      } catch (err) {
        console.error('Supabase createSkill exception:', err);
      }
    }
    const skills = localStore.getSkills();
    skills.push(newSkill);
    localStore.setSkills(skills);
    return newSkill;
  },

  async updateSkill(id: string, updates: Partial<Skill>): Promise<Skill> {
    let cloudUpdated: Skill | null = null;
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('skills').update(updates).eq('id', id).select().single();
        if (!error && data) {
          cloudUpdated = data as Skill;
        } else if (error) {
          console.error('Supabase updateSkill error:', error);
        }
      } catch (err) {
        console.error('Supabase updateSkill exception:', err);
      }
    }

    const skills = localStore.getSkills();
    const index = skills.findIndex((s) => s.id === id || (updates.name && s.name.toLowerCase() === updates.name.toLowerCase()));
    if (index !== -1) {
      const merged = cloudUpdated || { ...skills[index], ...updates };
      skills[index] = merged;
      localStore.setSkills(skills);
      return merged;
    }
    if (cloudUpdated) {
      skills.push(cloudUpdated);
      localStore.setSkills(skills);
      return cloudUpdated;
    }
    throw new Error('Skill not found');
  },

  async deleteSkill(id: string): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('skills').delete().eq('id', id);
      } catch (err) {
        console.error('Supabase deleteSkill exception:', err);
      }
    }
    const skills = localStore.getSkills().filter((s) => s.id !== id);
    localStore.setSkills(skills);
    return true;
  },
};
