import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, Layers } from 'lucide-react';
import { serviceService } from '../../services/serviceService';
import { Service } from '../../types';
import { ConfirmDeleteModal } from './ConfirmDeleteModal';
import { useModalKeyboard } from '../../hooks/useModalKeyboard';

export const AdminServices: React.FC = () => {
  const [list, setList] = useState<Service[]>([]);
  const [editing, setEditing] = useState<Service | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  useModalKeyboard(isModalOpen, () => setIsModalOpen(false));

  const [formData, setFormData] = useState<Partial<Service>>({
    service_number: '01',
    title: '',
    description: '',
    features: [],
    display_order: 1,
  });

  const [featureString, setFeatureString] = useState('');

  const load = () => serviceService.getServices().then(setList);

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setFormData({
      service_number: String(list.length + 1).padStart(2, '0'),
      title: '',
      description: '',
      features: [],
      display_order: list.length + 1,
    });
    setFeatureString('');
    setIsModalOpen(true);
  };

  const openEdit = (item: Service) => {
    setEditing(item);
    setFormData({ ...item });
    setFeatureString(item.features.join('\n'));
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) return;

    setSaving(true);
    const feats = featureString.split('\n').map((f) => f.trim()).filter(Boolean);
    const payload = { ...formData, features: feats } as Service;

    try {
      if (editing) {
        await serviceService.updateService(editing.id, payload);
      } else {
        await serviceService.createService(payload);
      }
      setIsModalOpen(false);
      load();
    } catch (err: any) {
      alert('Error saving service: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTargetId) return;
    try {
      await serviceService.deleteService(deleteTargetId);
      setIsDeleteModalOpen(false);
      setDeleteTargetId(null);
      load();
    } catch (err: any) {
      alert('Error deleting service: ' + err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Services & Capabilities</h2>
          <p className="text-xs text-slate-400 mt-1">Manage architectural offerings, descriptions and skill deliverables.</p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold uppercase tracking-wider shadow-sm transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Service</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {list.map((item) => (
          <div
            key={item.id}
            className="p-5 bg-slate-800/80 border border-slate-700 rounded-xl flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between border-b border-slate-700 pb-2.5 mb-3 font-mono text-xs text-indigo-400 font-bold">
                <span>SERVICE // {item.service_number}</span>
              </div>
              <h3 className="font-bold text-white text-base mb-2">{item.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">{item.description}</p>
              {item.features.length > 0 && (
                <ul className="space-y-1 text-xs text-slate-300 font-mono">
                  {item.features.map((f, i) => (
                    <li key={`${item.id}-feat-${i}`}>• {f}</li>
                  ))}
                </ul>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-700 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => openEdit(item)}
                className="p-1.5 text-slate-400 hover:text-white bg-slate-700/50 hover:bg-slate-700 rounded transition-colors"
              >
                <Edit className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => {
                  setDeleteTargetId(item.id);
                  setIsDeleteModalOpen(true);
                }}
                className="p-1.5 text-slate-400 hover:text-red-400 bg-slate-700/50 hover:bg-slate-700 rounded transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
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
            className="bg-slate-800 border border-slate-700 rounded-xl shadow-2xl max-w-md w-full p-6 text-slate-100 cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-700 pb-3 mb-4">
              <h3 className="text-sm font-bold text-white">
                {editing ? 'Edit Service' : 'New Service'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Number (e.g. 01)</label>
                  <input
                    type="text"
                    required
                    value={formData.service_number || ''}
                    onChange={(e) => setFormData({ ...formData, service_number: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs font-mono text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title || ''}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Deliverables / Features (one per line)</label>
                <textarea
                  rows={3}
                  value={featureString}
                  onChange={(e) => setFeatureString(e.target.value)}
                  placeholder="Custom Web Applications&#10;Full-stack React & Node.js"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none"
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
                  {saving ? 'Saving...' : 'Save Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        title="Delete Service"
        message="Are you sure you want to delete this service offering?"
        onConfirm={confirmDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
      />
    </div>
  );
};
