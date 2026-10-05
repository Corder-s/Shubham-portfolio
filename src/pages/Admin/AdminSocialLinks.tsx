import React, { useState, useEffect } from 'react';
import {
  Plus,
  Edit,
  Trash2,
  X,
  ExternalLink,
  Radio,
  Sparkles,
  Code,
} from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '../../components/Decorative/Scribbles';
import { socialService } from '../../services/socialService';
import { socialFeedService, SocialFeedPost } from '../../services/socialFeedService';
import { SocialLink } from '../../types';
import { ConfirmDeleteModal } from './ConfirmDeleteModal';
import { useModalKeyboard } from '../../hooks/useModalKeyboard';
import { AppBrandIcon } from '../../components/Social/AppBrandIcon';
import { formatSocialUrl } from '../../utils/urlHelper';

export const AdminSocialLinks: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'channels' | 'feed'>('channels');

  // Channel links state
  const [list, setList] = useState<SocialLink[]>([]);
  const [editing, setEditing] = useState<SocialLink | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  // Feed posts state
  const [posts, setPosts] = useState<SocialFeedPost[]>([]);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [postDeleteTargetId, setPostDeleteTargetId] = useState<string | null>(null);
  const [isPostDeleteModalOpen, setIsPostDeleteModalOpen] = useState(false);
  const [savingPost, setSavingPost] = useState(false);
  const [showWebhookGuide, setShowWebhookGuide] = useState(false);

  useModalKeyboard(isModalOpen, () => setIsModalOpen(false));
  useModalKeyboard(isPostModalOpen, () => setIsPostModalOpen(false));

  const [formData, setFormData] = useState<Partial<SocialLink>>({
    platform: 'github',
    label: '',
    url: '',
    is_active: true,
    display_order: 1,
  });

  const [postFormData, setPostFormData] = useState<Partial<SocialFeedPost>>({
    platform: 'linkedin',
    title: '',
    content: '',
    url: '',
    image_url: '',
    author: 'Shubham Saini',
    published_at: new Date().toISOString(),
  });

  const loadChannels = () => socialService.getSocialLinks().then(setList);
  const loadPosts = () => socialFeedService.getPosts().then(setPosts);

  useEffect(() => {
    loadChannels();
    loadPosts();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setFormData({
      platform: 'github',
      label: 'GitHub',
      url: 'https://github.com/Corder-s',
      is_active: true,
      display_order: list.length + 1,
    });
    setIsModalOpen(true);
  };

  const openEdit = (item: SocialLink) => {
    setEditing(item);
    setFormData({ ...item });
    setIsModalOpen(true);
  };

  const toggleActive = async (item: SocialLink) => {
    await socialService.updateSocialLink(item.id, { is_active: !item.is_active });
    loadChannels();
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.label || !formData.url) return;

    setSaving(true);
    try {
      const sanitizedUrl = formatSocialUrl(formData.platform || 'other', formData.url);
      const payload = {
        ...formData,
        url: sanitizedUrl,
      };

      if (editing) {
        await socialService.updateSocialLink(editing.id, payload);
      } else {
        await socialService.createSocialLink(payload as Omit<SocialLink, 'id'>);
      }
      setIsModalOpen(false);
      loadChannels();
    } catch (err: any) {
      alert('Error saving social link: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTargetId) return;
    try {
      await socialService.deleteSocialLink(deleteTargetId);
      setIsDeleteModalOpen(false);
      setDeleteTargetId(null);
      loadChannels();
    } catch (err: any) {
      alert('Error deleting social link: ' + err.message);
    }
  };

  // Post handling
  const openCreatePost = () => {
    setPostFormData({
      platform: 'linkedin',
      title: '',
      content: '',
      url: 'https://www.linkedin.com/in/shubham-saini-33537a374/',
      image_url: '',
      author: 'Shubham Saini',
      published_at: new Date().toISOString(),
    });
    setIsPostModalOpen(true);
  };

  const handleSavePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postFormData.title || !postFormData.content) return;

    setSavingPost(true);
    try {
      await socialFeedService.createPost(postFormData as Omit<SocialFeedPost, 'id'>);
      setIsPostModalOpen(false);
      loadPosts();
    } catch (err: any) {
      alert('Error publishing post: ' + err.message);
    } finally {
      setSavingPost(false);
    }
  };

  const confirmDeletePost = async () => {
    if (!postDeleteTargetId) return;
    try {
      await socialFeedService.deletePost(postDeleteTargetId);
      setIsPostDeleteModalOpen(false);
      setPostDeleteTargetId(null);
      loadPosts();
    } catch (err: any) {
      alert('Error deleting post: ' + err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Real-time Auto-Sync Telemetry Active */}
      <div className="bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/30 rounded-xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-[#02F74C] shrink-0 mt-0.5">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                Live Cross-Platform Auto-Sync Active
              </h2>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-[#02F74C] font-mono font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#02F74C] animate-ping" />
                STREAMING
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Whatever you upload or push to <strong>GitHub (@Corder-s)</strong> automatically streams live to your portfolio in real time. LinkedIn posts & milestones are aggregated directly through Supabase with 1-click publishing or webhook automation.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <a
            href="https://github.com/Corder-s"
            target="_blank"
            rel="noreferrer"
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-mono flex items-center gap-1.5 border border-slate-700 transition-colors"
          >
            <GithubIcon className="w-3.5 h-3.5 text-white" />
            <span>@Corder-s</span>
          </a>
          <a
            href="https://www.linkedin.com/in/shubham-saini-33537a374/"
            target="_blank"
            rel="noreferrer"
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-[#0077b5] rounded-lg text-xs font-mono flex items-center gap-1.5 border border-slate-700 transition-colors"
          >
            <LinkedinIcon className="w-3.5 h-3.5" />
            <span>LinkedIn</span>
          </a>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 gap-6">
        <button
          onClick={() => setActiveTab('channels')}
          className={`pb-3 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 cursor-pointer ${
            activeTab === 'channels'
              ? 'border-indigo-500 text-indigo-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Contact & Profile Channels ({list.length})
        </button>
        <button
          onClick={() => setActiveTab('feed')}
          className={`pb-3 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 cursor-pointer flex items-center gap-2 ${
            activeTab === 'feed'
              ? 'border-indigo-500 text-indigo-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <span>LinkedIn & Social Feed Posts ({posts.length})</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 font-mono">
            LIVE PULSE
          </span>
        </button>
      </div>

      {/* TAB 1: Channels */}
      {activeTab === 'channels' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white">Public Profile Links</h3>
              <p className="text-xs text-slate-400">
                Links shown across the hero HUD, footer, and contact channels.
              </p>
            </div>
            <button
              type="button"
              onClick={openCreate}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold uppercase tracking-wider shadow-sm transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>New Link</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {list.map((item) => (
              <div
                key={item.id}
                className="p-4 bg-slate-800/80 border border-slate-700 rounded-xl flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <AppBrandIcon platform={item.platform} size="xs" variant="app-tile" />
                      <span className="font-bold text-white text-sm">{item.label}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleActive(item)}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        item.is_active
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : 'bg-slate-700 text-slate-400'
                      }`}
                    >
                      {item.is_active ? 'Active' : 'Disabled'}
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-400 font-mono truncate">{item.url}</p>
                  <span className="text-[10px] text-indigo-400 font-mono mt-1 block uppercase">
                    {item.platform}
                  </span>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-700 flex items-center justify-between">
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
                  >
                    <span>Test Link</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>

                  <div className="flex items-center gap-1.5">
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
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: LinkedIn & Social Feed Posts */}
      {activeTab === 'feed' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-white">LinkedIn & Career Transmissions</h3>
              <p className="text-xs text-slate-400">
                These cards appear in the public site&apos;s &ldquo;Live Social & Code Pulse&rdquo; section.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowWebhookGuide(!showWebhookGuide)}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
              >
                <Code className="w-3.5 h-3.5 text-indigo-400" />
                <span>{showWebhookGuide ? 'Hide Webhook Guide' : 'Auto-Sync Webhook Setup'}</span>
              </button>

              <button
                type="button"
                onClick={openCreatePost}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold uppercase tracking-wider shadow-sm transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Publish Post</span>
              </button>
            </div>
          </div>

          {/* Webhook Guide Accordion */}
          {showWebhookGuide && (
            <div className="p-4 bg-slate-900 border border-indigo-500/30 rounded-xl space-y-3">
              <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                <span>How to auto-stream LinkedIn posts to your portfolio with Webhooks</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                You can connect <strong>Make.com</strong>, <strong>Zapier</strong>, or an <strong>RSS bridge (e.g. RSS.app)</strong> to automatically push new LinkedIn posts into your portfolio&apos;s database table without writing any code:
              </p>
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-[11px] font-mono text-slate-300 space-y-1">
                <div className="text-slate-500">// Supabase REST Endpoint:</div>
                <div className="text-indigo-400">POST https://qeyegcddmffjoxzhyqtr.supabase.co/rest/v1/social_posts</div>
                <div className="text-slate-500 mt-2">// Headers:</div>
                <div>apikey: [YOUR_SUPABASE_ANON_KEY]</div>
                <div>Content-Type: application/json</div>
                <div className="text-slate-500 mt-2">// Payload:</div>
                <div className="text-emerald-400">
                  {JSON.stringify(
                    {
                      platform: 'linkedin',
                      title: 'New Milestone Update',
                      content: 'Excited to announce my latest project release...',
                      url: 'https://www.linkedin.com/in/shubham-saini-33537a374/',
                      author: 'Shubham Saini',
                      published_at: '2026-10-03T18:00:00Z',
                    },
                    null,
                    2
                  )}
                </div>
              </div>
              <p className="text-[11px] text-slate-400">
                Or, simply use the <strong>&ldquo;Publish Post&rdquo;</strong> button above anytime you share on LinkedIn for instant 5-second updates!
              </p>
            </div>
          )}

          {/* Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {posts.map((post) => (
              <div
                key={post.id}
                className="p-4 bg-slate-800/80 border border-slate-700 rounded-xl flex flex-col justify-between hover:border-slate-600 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
                      {post.platform}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">
                      {new Date(post.published_at).toLocaleDateString()}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-white mb-1.5 line-clamp-1">{post.title}</h4>
                  <p className="text-[11px] text-slate-400 line-clamp-3 leading-relaxed mb-3">
                    {post.content}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-700/60 flex items-center justify-between">
                  <a
                    href={post.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-mono"
                  >
                    <span>View Post</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>

                  <button
                    type="button"
                    onClick={() => {
                      setPostDeleteTargetId(post.id);
                      setIsPostDeleteModalOpen(true);
                    }}
                    className="p-1.5 text-slate-400 hover:text-red-400 bg-slate-700/50 hover:bg-slate-700 rounded transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Channel Create/Edit Modal */}
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
                {editing ? 'Edit Social Link' : 'New Social Link'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Platform *</label>
                <div className="flex items-center gap-2">
                  <select
                    value={formData.platform}
                    onChange={(e) => setFormData({ ...formData, platform: e.target.value as any })}
                    className="flex-1 px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="github">GitHub</option>
                    <option value="linkedin">LinkedIn</option>
                    <option value="whatsapp">WhatsApp</option>
                    <option value="instagram">Instagram</option>
                    <option value="email">Email</option>
                    <option value="phone">Phone</option>
                    <option value="leetcode">LeetCode</option>
                    <option value="other">Other</option>
                  </select>
                  <div className="p-2 bg-slate-900 border border-slate-700 rounded-lg shrink-0">
                    <AppBrandIcon platform={formData.platform || 'github'} size="xs" variant="app-tile" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Label *</label>
                <input
                  type="text"
                  required
                  value={formData.label || ''}
                  onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                  placeholder="e.g. WhatsApp, LinkedIn"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">URL / Link Target *</label>
                <input
                  type="text"
                  required
                  value={formData.url || ''}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  placeholder={
                    formData.platform === 'instagram'
                      ? 'https://instagram.com/your_username or @your_username'
                      : formData.platform === 'whatsapp'
                      ? 'https://wa.me/91... or phone number'
                      : formData.platform === 'phone'
                      ? '+91 9876543210 or tel:+91...'
                      : formData.platform === 'email'
                      ? 'your.email@example.com or mailto:...'
                      : 'https://...'
                  }
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs font-mono text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                {formData.url && (
                  <p className="text-[11px] text-emerald-400 font-mono mt-1 flex items-center gap-1 truncate">
                    <span className="text-slate-500">Will link to:</span>
                    <span className="font-semibold">
                      {formatSocialUrl(formData.platform || 'other', formData.url)}
                    </span>
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-xs font-medium text-slate-300">Active / Visible on public site</span>
                </label>
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
                  {saving ? 'Saving...' : 'Save Link'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Post Create Modal */}
      {isPostModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs cursor-pointer"
          onClick={() => setIsPostModalOpen(false)}
        >
          <div
            className="bg-slate-800 border border-slate-700 rounded-xl shadow-2xl max-w-lg w-full p-6 text-slate-100 cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-700 pb-3 mb-4">
              <h3 className="text-sm font-bold text-white">Publish New Social / LinkedIn Update</h3>
              <button onClick={() => setIsPostModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSavePost} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Platform</label>
                <select
                  value={postFormData.platform}
                  onChange={(e) => setPostFormData({ ...postFormData, platform: e.target.value as any })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="linkedin">LinkedIn</option>
                  <option value="github">GitHub</option>
                  <option value="twitter">X / Twitter</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Post Headline / Title *</label>
                <input
                  type="text"
                  required
                  value={postFormData.title || ''}
                  onChange={(e) => setPostFormData({ ...postFormData, title: e.target.value })}
                  placeholder="e.g. Launched new project or Received academic honor"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Post Content / Summary *</label>
                <textarea
                  rows={4}
                  required
                  value={postFormData.content || ''}
                  onChange={(e) => setPostFormData({ ...postFormData, content: e.target.value })}
                  placeholder="Paste or write the post content..."
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Post Link URL</label>
                <input
                  type="url"
                  value={postFormData.url || ''}
                  onChange={(e) => setPostFormData({ ...postFormData, url: e.target.value })}
                  placeholder="https://linkedin.com/posts/..."
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs font-mono text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-700 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsPostModalOpen(false)}
                  className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded text-xs text-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingPost}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 rounded text-xs font-bold text-white disabled:opacity-50"
                >
                  {savingPost ? 'Publishing...' : 'Publish Update'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modals */}
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        title="Delete Social Link"
        message="Are you sure you want to remove this contact channel link?"
        onConfirm={confirmDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
      />

      <ConfirmDeleteModal
        isOpen={isPostDeleteModalOpen}
        title="Delete Feed Transmission"
        message="Are you sure you want to remove this social update from your portfolio?"
        onConfirm={confirmDeletePost}
        onCancel={() => setIsPostDeleteModalOpen(false)}
      />
    </div>
  );
};
