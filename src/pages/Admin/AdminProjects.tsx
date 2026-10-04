import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Star,
  X,
  Upload,
  RefreshCw,
  FolderGit2,
  Check,
  ExternalLink,
  Sparkles,
} from 'lucide-react';

import { projectService } from '../../services/projectService';
import { storageService } from '../../services/storageService';
import { githubService, GitHubRepo } from '../../services/githubService';
import { Project } from '../../types';
import { ConfirmDeleteModal } from './ConfirmDeleteModal';
import { useModalKeyboard } from '../../hooks/useModalKeyboard';

export const AdminProjects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Form fields
  const [formData, setFormData] = useState<Partial<Project>>({
    title: '',
    slug: '',
    category: 'FULL STACK',
    description: '',
    long_description: '',
    technologies: [],
    features: [],
    image: '',
    github_url: '',
    live_url: '',
    featured: false,
    status: 'published',
    display_order: 1,
  });

  const [techString, setTechString] = useState('');
  const [featureString, setFeatureString] = useState('');

  const loadProjects = () => {
    projectService.getAdminProjects().then((data) => {
      setProjects(data);
    });
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const [isGitHubSyncOpen, setIsGitHubSyncOpen] = useState(false);
  const [ghRepos, setGhRepos] = useState<GitHubRepo[]>([]);
  const [loadingGh, setLoadingGh] = useState(false);
  const [importedSlugs, setImportedSlugs] = useState<string[]>([]);

  useModalKeyboard(isModalOpen, () => setIsModalOpen(false));
  useModalKeyboard(isGitHubSyncOpen, () => setIsGitHubSyncOpen(false));

  const openGitHubSyncModal = async () => {
    setIsGitHubSyncOpen(true);
    setLoadingGh(true);
    try {
      const repos = await githubService.getRecentRepos('Corder-s', 20);
      setGhRepos(repos);
    } catch (err) {
      console.warn('Failed to fetch repos:', err);
    } finally {
      setLoadingGh(false);
    }
  };

  const importRepoAsProject = async (repo: GitHubRepo) => {
    const slug = repo.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const category =
      repo.language?.toUpperCase() === 'JAVA'
        ? 'JAVA'
        : repo.language?.toUpperCase() === 'TYPESCRIPT' || repo.language?.toUpperCase() === 'JAVASCRIPT'
        ? 'FULL STACK'
        : 'OTHER';

    const newProj: Omit<Project, 'id'> = {
      title: repo.name.replace(/[-_]/g, ' ').toUpperCase(),
      slug,
      category: category as any,
      description: repo.description || 'Public software engineering repository auto-synced from GitHub.',
      long_description: `${repo.name} is an active open-source project hosted under @Corder-s on GitHub. Language stack: ${repo.language || 'Software Engineering'}.`,
      technologies: repo.language ? [repo.language] : ['Code'],
      features: ['Automated version control on GitHub', 'Open-source collaboration', 'CI/CD pipeline'],
      image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1200',
      github_url: repo.html_url,
      live_url: repo.homepage || '',
      featured: false,
      status: 'published',
      display_order: projects.length + 1,
    };

    try {
      await projectService.createProject(newProj);
      setImportedSlugs((prev) => [...prev, slug]);
      loadProjects();
    } catch (err: any) {
      alert('Error importing repository: ' + err.message);
    }
  };

  const openCreateModal = () => {
    setEditingProject(null);
    setFormData({
      title: '',
      slug: '',
      category: 'FULL STACK',
      description: '',
      long_description: '',
      technologies: ['React', 'TypeScript'],
      features: ['Modern responsive UI'],
      image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800',
      github_url: '',
      live_url: '',
      featured: false,
      status: 'published',
      display_order: projects.length + 1,
    });
    setTechString('React, TypeScript');
    setFeatureString('Modern responsive UI');
    setIsModalOpen(true);
  };

  const openEditModal = (p: Project) => {
    setEditingProject(p);
    setFormData({ ...p });
    setTechString(p.technologies.join(', '));
    setFeatureString((p.features || []).join('\n'));
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title?.trim() || !formData.slug?.trim()) {
      alert('Please fill in title and unique slug.');
      return;
    }

    setSaving(true);
    const techs = techString.split(',').map((t) => t.trim()).filter(Boolean);
    const features = featureString.split('\n').map((f) => f.trim()).filter(Boolean);

    const payload = {
      ...formData,
      technologies: techs,
      features: features,
    } as Project;

    try {
      if (editingProject) {
        await projectService.updateProject(editingProject.id, payload);
      } else {
        await projectService.createProject(payload);
      }
      setIsModalOpen(false);
      loadProjects();
    } catch (err: any) {
      alert('Failed to save project: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTargetId) return;
    try {
      await projectService.deleteProject(deleteTargetId);
      setIsDeleteModalOpen(false);
      setDeleteTargetId(null);
      loadProjects();
    } catch (err: any) {
      alert('Failed to delete project: ' + err.message);
    }
  };

  const toggleFeatured = async (p: Project) => {
    await projectService.updateProject(p.id, { featured: !p.featured });
    loadProjects();
  };

  const toggleStatus = async (p: Project) => {
    const newStatus = p.status === 'published' ? 'draft' : 'published';
    await projectService.updateProject(p.id, { status: newStatus });
    loadProjects();
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const res = await storageService.uploadFile(file);
    setUploading(false);

    if (res.url) {
      setFormData((prev) => ({ ...prev, image: res.url }));
    } else {
      alert(res.error || 'Failed to upload image.');
    }
  };

  const filteredProjects = projects.filter((p) => {
    const matchCategory = categoryFilter === 'ALL' || p.category === categoryFilter;
    const matchSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Manage Projects</h2>
          <p className="text-xs text-slate-400 mt-1">
            Create, update, reorder and publish portfolio dossiers.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={openGitHubSyncModal}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded-lg text-xs font-semibold tracking-wider transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#02F74C]" />
            <span>Sync from GitHub</span>
          </button>

          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold uppercase tracking-wider shadow-sm transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Project</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {['ALL', 'FULL STACK', 'FRONTEND', 'BACKEND', 'JAVA', 'DATA', 'OTHER'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                categoryFilter === cat
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Data Table */}
      <div className="bg-slate-800/80 border border-slate-700 rounded-xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Project</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Technologies</th>
                <th className="py-3 px-4 text-center">Featured</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/60">
              {filteredProjects.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500 text-xs">
                    No matching projects found.
                  </td>
                </tr>
              ) : (
                filteredProjects.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-700/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.image}
                          alt={p.title}
                          className="w-12 h-9 object-cover rounded border border-slate-700 shrink-0"
                        />
                        <div>
                          <div className="font-bold text-white text-xs">{p.title}</div>
                          <div className="text-[10px] text-slate-400 font-mono">/{p.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px]">{p.category}</td>
                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {p.technologies.slice(0, 3).map((t, idx) => (
                          <span
                            key={`${p.id}-tech-${t}-${idx}`}
                            className="px-1.5 py-0.5 bg-slate-900 text-slate-300 rounded text-[10px] font-mono"
                          >
                            {t}
                          </span>
                        ))}
                        {p.technologies.length > 3 && (
                          <span className="text-[10px] text-slate-400">
                            +{p.technologies.length - 3}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => toggleFeatured(p)}
                        className={`p-1 rounded hover:bg-slate-700 ${
                          p.featured ? 'text-amber-400' : 'text-slate-500'
                        }`}
                        title="Toggle Featured"
                      >
                        <Star className="w-4 h-4 fill-current" />
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => toggleStatus(p)}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase transition-colors ${
                          p.status === 'published'
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                            : 'bg-slate-700 text-slate-400 border border-slate-600'
                        }`}
                      >
                        {p.status}
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => openEditModal(p)}
                          className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded transition-colors"
                          title="Edit Project"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setDeleteTargetId(p.id);
                            setIsDeleteModalOpen(true);
                          }}
                          className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-700 rounded transition-colors"
                          title="Delete Project"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit / Create Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs overflow-y-auto cursor-pointer"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-slate-800 border border-slate-700 rounded-xl shadow-2xl max-w-2xl w-full p-6 text-slate-100 my-8 cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-700 pb-4 mb-5">
              <h3 className="text-base font-bold text-white">
                {editingProject ? 'Edit Project Dossier' : 'Create New Project'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 max-h-[75vh] overflow-y-auto pr-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title || ''}
                    onChange={(e) => {
                      const title = e.target.value;
                      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                      setFormData({
                        ...formData,
                        title,
                        slug: editingProject ? formData.slug : slug,
                      });
                    }}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    URL Slug *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.slug || ''}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs font-mono text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="FULL STACK">FULL STACK</option>
                    <option value="FRONTEND">FRONTEND</option>
                    <option value="BACKEND">BACKEND</option>
                    <option value="JAVA">JAVA</option>
                    <option value="DATA">DATA</option>
                    <option value="OTHER">OTHER</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={formData.display_order || 1}
                    onChange={(e) => setFormData({ ...formData, display_order: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Short Description *
                </label>
                <textarea
                  rows={2}
                  required
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Long Architecture & Implementation Details
                </label>
                <textarea
                  rows={4}
                  value={formData.long_description || ''}
                  onChange={(e) => setFormData({ ...formData, long_description: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Technologies (comma-separated)
                </label>
                <input
                  type="text"
                  value={techString}
                  onChange={(e) => setTechString(e.target.value)}
                  placeholder="React, Node.js, Express, MongoDB"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Key Features (one per line)
                </label>
                <textarea
                  rows={3}
                  value={featureString}
                  onChange={(e) => setFeatureString(e.target.value)}
                  placeholder="JWT User Authentication&#10;Dynamic Explore Feed"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none"
                />
              </div>

              {/* Image Input & Media Upload */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Cover Image URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={formData.image || ''}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="flex-1 px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                  <label className="px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-xs font-medium cursor-pointer flex items-center gap-1.5 shrink-0 text-slate-200">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploading ? 'Uploading...' : 'Upload'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    GitHub URL (optional)
                  </label>
                  <input
                    type="url"
                    value={formData.github_url || ''}
                    onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                    placeholder="https://github.com/Corder-s/..."
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Live Demo URL (optional)
                  </label>
                  <input
                    type="url"
                    value={formData.live_url || ''}
                    onChange={(e) => setFormData({ ...formData, live_url: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-xs font-medium text-slate-300">Mark as Featured</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.status === 'published'}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        status: e.target.checked ? 'published' : 'draft',
                      })
                    }
                    className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="text-xs font-medium text-slate-300">Published Status</span>
                </label>
              </div>

              <div className="pt-4 border-t border-slate-700 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-xs font-semibold rounded-lg text-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-xs font-bold rounded-lg text-white disabled:opacity-50"
                >
                  {saving ? 'Saving Changes...' : 'Save Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* GitHub Sync Modal */}
      {isGitHubSyncOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-[#02F74C]">
                  <FolderGit2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    Sync from GitHub (@Corder-s)
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-[#02F74C] font-mono">
                      LIVE API
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Import your public GitHub repositories directly into your portfolio projects catalog.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={openGitHubSyncModal}
                  disabled={loadingGh}
                  className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
                  title="Refresh Repositories"
                >
                  <RefreshCw className={`w-4 h-4 ${loadingGh ? 'animate-spin text-indigo-400' : ''}`} />
                </button>
                <button
                  type="button"
                  onClick={() => setIsGitHubSyncOpen(false)}
                  className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-4 space-y-3">
              {loadingGh ? (
                <div className="py-12 flex flex-col items-center justify-center gap-3 text-slate-400">
                  <RefreshCw className="w-6 h-6 animate-spin text-[#02F74C]" />
                  <p className="text-xs">Fetching repositories from GitHub API...</p>
                </div>
              ) : ghRepos.length === 0 ? (
                <div className="py-10 text-center text-slate-500 text-xs">
                  No public repositories found for user @Corder-s.
                </div>
              ) : (
                <div className="space-y-2.5 max-h-[60vh] overflow-y-auto pr-1">
                  {ghRepos.map((repo) => {
                    const isAlreadyImported =
                      importedSlugs.includes(
                        repo.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
                      ) ||
                      projects.some(
                        (p) =>
                          p.github_url?.toLowerCase() === repo.html_url.toLowerCase() ||
                          p.slug.toLowerCase() ===
                            repo.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
                      );

                    return (
                      <div
                        key={repo.id}
                        className="p-3 bg-slate-800/60 border border-slate-700/60 rounded-lg flex items-center justify-between gap-4 hover:border-slate-600 transition-colors"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-white truncate">
                              {repo.name}
                            </span>
                            {repo.language && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300 font-mono">
                                {repo.language}
                              </span>
                            )}
                            <a
                              href={repo.html_url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-slate-400 hover:text-white transition-colors"
                            >
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                          {repo.description && (
                            <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                              {repo.description}
                            </p>
                          )}
                          <div className="flex items-center gap-3 text-[10px] text-slate-500 mt-1 font-mono">
                            <span>★ {repo.stargazers_count}</span>
                            <span>• Updated {new Date(repo.pushed_at).toLocaleDateString()}</span>
                          </div>
                        </div>

                        <div>
                          {isAlreadyImported ? (
                            <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded text-[11px] font-semibold">
                              <Check className="w-3 h-3" />
                              <span>Imported</span>
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => importRepoAsProject(repo)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-[11px] font-semibold transition-colors cursor-pointer"
                            >
                              <Sparkles className="w-3 h-3" />
                              <span>Import</span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="p-4 border-t border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={() => setIsGitHubSyncOpen(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded-lg text-slate-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        title="Delete Project Dossier"
        message="Are you sure you want to permanently delete this project? It will be removed from both Supabase and the live public portfolio."
        onConfirm={confirmDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
      />
    </div>
  );
};
