import { supabase, isSupabaseConfigured } from './supabaseClient';
import { localStore } from './localStore';
import { Certification } from '../types';

export const certificationService = {
  async getCertifications(): Promise<Certification[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('certifications')
          .select('*')
          .order('display_order', { ascending: true });
        if (!error && data && data.length > 0) {
          localStore.setCertifications(data as Certification[]);
          return data as Certification[];
        }
      } catch (err) {
        console.warn('Failed to load certifications from Supabase:', err);
      }
    }
    return localStore.getCertifications().sort((a, b) => a.display_order - b.display_order);
  },

  async createCertification(data: Omit<Certification, 'id'>): Promise<Certification> {
    const newItem: Certification = { ...data, id: 'cert-' + Date.now() };
    if (isSupabaseConfigured && supabase) {
      try {
        const { data: res, error } = await supabase.from('certifications').insert(data).select().single();
        if (!error && res) {
          const list = localStore.getCertifications();
          list.push(res as Certification);
          localStore.setCertifications(list);
          return res as Certification;
        }
      } catch (err) {
        console.error('Supabase createCertification exception:', err);
      }
    }
    const list = localStore.getCertifications();
    list.push(newItem);
    localStore.setCertifications(list);
    return newItem;
  },

  async updateCertification(id: string, updates: Partial<Certification>): Promise<Certification> {
    let cloudUpdated: Certification | null = null;
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('certifications').update(updates).eq('id', id).select().single();
        if (!error && data) {
          cloudUpdated = data as Certification;
        } else if (error) {
          console.error('Supabase updateCertification error:', error);
        }
      } catch (err) {
        console.error('Supabase updateCertification exception:', err);
      }
    }

    const list = localStore.getCertifications();
    const index = list.findIndex((c) => c.id === id || (updates.title && c.title === updates.title));
    if (index !== -1) {
      const merged = cloudUpdated || { ...list[index], ...updates };
      list[index] = merged;
      localStore.setCertifications(list);
      return merged;
    }
    if (cloudUpdated) {
      list.push(cloudUpdated);
      localStore.setCertifications(list);
      return cloudUpdated;
    }
    throw new Error('Certification not found');
  },

  async deleteCertification(id: string): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('certifications').delete().eq('id', id);
      } catch (err) {
        console.error('Supabase deleteCertification exception:', err);
      }
    }
    const list = localStore.getCertifications().filter((c) => c.id !== id);
    localStore.setCertifications(list);
    return true;
  },
};
