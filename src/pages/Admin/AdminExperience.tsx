import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X } from 'lucide-react';
import { experienceService } from '../../services/experienceService';
import { Experience } from '../../types';
import { ConfirmDeleteModal } from './ConfirmDeleteModal';
import { useModalKeyboard } from '../../hooks/useModalKeyboard';

export const AdminExperience: React.FC = () => {
  const [list, setList] = useState<Experience[]>([]);
  const [editing, setEditing] = useState<Experience | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  useModalKeyboard(isModalOpen, () => setIsModalOpen(false));

  const [formData, setFormData] = useState<Partial<Experience>>({
    role: '',
    company: '',
    location: '',
    period: '',
    description: '',
    technologies: [],
    display_order: 1,
  });

  const [techString, setTechString] = useState('');

  const load = () => experienceService.getExperience().then(setList);

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setFormData({
      role: '',
      company: '',
      location: 'Greater Noida / Remote',
      period: '2025 - Present',
      description: '',
      technologies: [],
      display_order: list.length + 1,
    });
    setTechString('');
    setIsModalOpen(true);
  };

  const openEdit = (item: Experience) => {
    setEditing(item);
    setFormData({ ...item });
    setTechString(item.technologies.join(', '));
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.role || !formData.company) return;

    setSaving(true);
    const techs = techString.split(',').map((t) => t.trim()).filter(Boolean);
    const payload = { ...formData, technologies: techs } as Experience;

    try {
      if (editing) {
        await experienceService.updateExperience(editing.id, payload);
      } else {
        await experienceService.createExperience(payload);
      }
      setIsModalOpen(false);
      load();
    } catch (err: any) {
      alert('Error saving experience: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTargetId) return;
    try {
      await experienceService.deleteExperience(deleteTargetId);
      setIsDeleteModalOpen(false);
      setDeleteTargetId(null);
      load();
    } catch (err: any) {
      alert('Error deleting: ' + err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Work Experience</h2>
          <p className="text-xs text-slate-400 mt-1">Manage verified internships and practical engineering roles.</p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold uppercase tracking-wider shadow-sm transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Experience</span>
        </button>
      </div>

      <div className="space-y-4">
        {list.map((item) => (
          <div
            key={item.id}
            className="p-5 bg-slate-800/80 border border-slate-700 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-bold text-white text-sm">{item.role}</span>
                <span className="text-xs text-indigo-400 font-semibold">• {item.company}</span>
              </div>
              <p className="text-xs text-slate-400">{item.period} | {item.location}</p>
              <p className="text-xs text-slate-300 mt-2 max-w-2xl leading-relaxed">{item.description}</p>
              {item.technologies.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {item.technologies.map((t, idx) => (
                    <span key={`${item.id}-tech-${t}-${idx}`} className="px-2 py-0.5 bg-slate-900 text-slate-300 rounded text-[10px] font-mono">
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => openEdit(item)}
                className="p-2 text-slate-400 hover:text-white bg-slate-700/50 hover:bg-slate-700 rounded transition-colors"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => {
                  setDeleteTargetId(item.id);
                  setIsDeleteModalOpen(true);
                }}
                className="p-2 text-slate-400 hover:text-red-400 bg-slate-700/50 hover:bg-slate-700 rounded transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs cursor-pointer"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-slate-800 border border-slate-700 rounded-xl shadow-2xl max-w-lg w-full p-6 text-slate-100 cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-700 pb-3 mb-4">
              <h3 className="text-sm font-bold text-white">
                {editing ? 'Edit Experience' : 'New Experience'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Role Title *</label>
                <input
                  type="text"
                  required
                  value={formData.role || ''}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Organization / Program *</label>
                <input
                  type="text"
                  required
                  value={formData.company || ''}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Period *</label>
                  <input
                    type="text"
                    required
                    value={formData.period || ''}
                    onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Location</label>
                  <input
                    type="text"
                    value={formData.location || ''}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Responsibilities / Work Description *</label>
                <textarea
                  rows={3}
                  required
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Technologies Used (comma separated)</label>
                <input
                  type="text"
                  value={techString}
                  onChange={(e) => setTechString(e.target.value)}
                  placeholder="React, Node.js, Express, MongoDB"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-700 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded text-xs text-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 rounded text-xs font-bold text-white"
                >
                  {saving ? 'Saving...' : 'Save Experience'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        title="Delete Experience"
        message="Are you sure you want to remove this experience entry?"
        onConfirm={confirmDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
      />
    </div>
  );
};
