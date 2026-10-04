import { supabase, isSupabaseConfigured } from './supabaseClient';
import { localStore } from './localStore';
import { Project } from '../types';

/**
 * PUBLIC DATA SERVICE:
 * Visitors can ONLY retrieve projects with status = 'published'.
 * Draft projects are completely invisible to public queries.
 */
export const publicProjectService = {
  async getProjects(): Promise<Project[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('status', 'published')
          .order('display_order', { ascending: true });

        if (!error && data) {
          return data as Project[];
        }
      } catch (err) {
        console.warn('Error fetching public projects from Supabase:', err);
      }
    }
    const projects = localStore.getProjects();
    return projects
      .filter((p) => p.status === 'published')
      .sort((a, b) => a.display_order - b.display_order);
  },

  async getProjectBySlug(slug: string): Promise<Project | null> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('slug', slug)
          .eq('status', 'published')
          .maybeSingle();

        if (!error && data) {
          return data as Project;
        }
      } catch (err) {
        console.warn('Error fetching project by slug from Supabase:', err);
      }
    }
    const projects = localStore.getProjects();
    return projects.find((p) => p.slug === slug && p.status === 'published') || null;
  },
};

/**
 * ADMIN DATA SERVICE:
 * Authorized administrators can view all projects (drafts + published) and perform CRUD.
 */
export const adminProjectService = {
  async getAllProjects(): Promise<Project[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .order('display_order', { ascending: true });

        if (!error && data) {
          return data as Project[];
        }
      } catch (err) {
        console.warn('Error fetching admin projects from Supabase:', err);
      }
    }
    const projects = localStore.getProjects();
    return projects.sort((a, b) => a.display_order - b.display_order);
  },

  async createProject(projectData: Omit<Project, 'id'>): Promise<Project> {
    const newProject: Project = {
      ...projectData,
      id: 'proj-' + Date.now(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('projects')
          .insert(projectData)
          .select()
          .single();

        if (!error && data) {
          return data as Project;
        }
      } catch (err) {
        console.warn('Error inserting project into Supabase:', err);
      }
    }

    const projects = localStore.getProjects();
    projects.push(newProject);
    localStore.setProjects(projects);
    return newProject;
  },

  async updateProject(id: string, updates: Partial<Project>): Promise<Project> {
    const payload = {
      ...updates,
      updated_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('projects')
          .update(payload)
          .eq('id', id)
          .select()
          .single();

        if (!error && data) {
          return data as Project;
        }
      } catch (err) {
        console.warn('Error updating project in Supabase:', err);
      }
    }

    const projects = localStore.getProjects();
    const index = projects.findIndex((p) => p.id === id);
    if (index !== -1) {
      projects[index] = { ...projects[index], ...payload };
      localStore.setProjects(projects);
      return projects[index];
    }
    throw new Error('Project not found');
  },

  async deleteProject(id: string): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from('projects').delete().eq('id', id);
        if (!error) {
          const projects = localStore.getProjects().filter((p) => p.id !== id);
          localStore.setProjects(projects);
          return true;
        }
      } catch (err) {
        console.warn('Error deleting project from Supabase:', err);
      }
    }

    const projects = localStore.getProjects().filter((p) => p.id !== id);
    localStore.setProjects(projects);
    return true;
  },
};

// Backwards-compatible consolidated export
export const projectService = {
  // Public defaults: only published projects
  getProjects: publicProjectService.getProjects,
  getProjectBySlug: publicProjectService.getProjectBySlug,

  // Admin access
  getAdminProjects: adminProjectService.getAllProjects,
  createProject: adminProjectService.createProject,
  updateProject: adminProjectService.updateProject,
  deleteProject: adminProjectService.deleteProject,
};
