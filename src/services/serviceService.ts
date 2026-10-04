import { supabase, isSupabaseConfigured } from './supabaseClient';
import { localStore } from './localStore';
import { Service } from '../types';

export const serviceService = {
  async getServices(): Promise<Service[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('services')
          .select('*')
          .order('display_order', { ascending: true });
        if (!error && data && data.length > 0) {
          localStore.setServices(data as Service[]);
          return data as Service[];
        }
      } catch (err) {
        console.warn('Failed to load services from Supabase:', err);
      }
    }
    return localStore.getServices().sort((a, b) => a.display_order - b.display_order);
  },

  async createService(data: Omit<Service, 'id'>): Promise<Service> {
    const newItem: Service = { ...data, id: 'srv-' + Date.now() };
    if (isSupabaseConfigured && supabase) {
      try {
        const { data: res, error } = await supabase.from('services').insert(data).select().single();
        if (!error && res) {
          const list = localStore.getServices();
          list.push(res as Service);
          localStore.setServices(list);
          return res as Service;
        }
      } catch (err) {
        console.error('Supabase createService exception:', err);
      }
    }
    const list = localStore.getServices();
    list.push(newItem);
    localStore.setServices(list);
    return newItem;
  },

  async updateService(id: string, updates: Partial<Service>): Promise<Service> {
    let cloudUpdated: Service | null = null;
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('services').update(updates).eq('id', id).select().single();
        if (!error && data) {
          cloudUpdated = data as Service;
        } else if (error) {
          console.error('Supabase updateService error:', error);
        }
      } catch (err) {
        console.error('Supabase updateService exception:', err);
      }
    }

    const list = localStore.getServices();
    const index = list.findIndex((s) => s.id === id || (updates.title && s.title === updates.title));
    if (index !== -1) {
      const merged = cloudUpdated || { ...list[index], ...updates };
      list[index] = merged;
      localStore.setServices(list);
      return merged;
    }
    if (cloudUpdated) {
      list.push(cloudUpdated);
      localStore.setServices(list);
      return cloudUpdated;
    }
    throw new Error('Service not found');
  },

  async deleteService(id: string): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('services').delete().eq('id', id);
      } catch (err) {
        console.error('Supabase deleteService exception:', err);
      }
    }
    const list = localStore.getServices().filter((s) => s.id !== id);
    localStore.setServices(list);
    return true;
  },
};
