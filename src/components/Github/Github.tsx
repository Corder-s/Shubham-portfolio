import React, { useState, useEffect } from 'react';
import {
  ExternalLink,
  FolderGit2,
  Users,
  GitBranch,
  Star,
  GitCommit,
  RefreshCw,
  Clock,
  Sparkles,
} from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '../Decorative/Scribbles';
import { CodeTag, CodeClosingTag } from '../Decorative/DevGraphics';
import { githubService, GitHubRepo, GitHubEvent, GitHubProfile } from '../../services/githubService';
import { socialFeedService, SocialFeedPost, initialSocialPosts } from '../../services/socialFeedService';
import { AppBrandIcon } from '../Social/AppBrandIcon';

export const GithubSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'repos' | 'events' | 'linkedin'>('repos');
  const [profile, setProfile] = useState<GitHubProfile | null>(null);
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [events, setEvents] = useState<GitHubEvent[]>([]);
  const [socialPosts, setSocialPosts] = useState<SocialFeedPost[]>(initialSocialPosts);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchLiveTelemetry = async () => {
    setRefreshing(true);
    try {
      const [prof, repoList, eventList, posts] = await Promise.all([
        githubService.getProfile('Corder-s'),
        githubService.getRecentRepos('Corder-s', 6),
        githubService.getRecentEvents('Corder-s', 6),
        socialFeedService.getPosts(),
      ]);

      if (prof) setProfile(prof);
      if (repoList.length > 0) setRepos(repoList);
      if (eventList.length > 0) setEvents(eventList);
      if (posts.length > 0) setSocialPosts(posts);
    } catch (err) {
      console.warn('Error fetching live social telemetry:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLiveTelemetry();
  }, []);

  const getRelativeTime = (dateStr: string) => {
    try {
      const diffMs = Date.now() - new Date(dateStr).getTime();
      const diffSecs = Math.floor(diffMs / 1000);
      const diffMins = Math.floor(diffSecs / 60);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffDays > 0) return `${diffDays}d ago`;
      if (diffHours > 0) return `${diffHours}h ago`;
      if (diffMins > 0) return `${diffMins}m ago`;
      return 'just now';
    } catch {
      return 'recently';
    }
  };

  return (
    <section id="code" className="py-20 lg:py-28 border-b border-[#02F74C]/20 bg-[#020203] font-mono">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Code Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#02F74C]/20 pb-5 mb-10">
          <div>
            <div className="text-xs text-[#02F74C] font-semibold mb-1 flex items-center gap-2">
              <span>/06</span>
              <span>•</span>
              <CodeTag tag="LIVE_TELEMETRY />" />
            </div>
            <h2 className="font-code-header text-3xl sm:text-5xl text-[#F3F3F4] uppercase font-bold tracking-tight">
              LIVE_SOCIAL_&_CODE_PULSE
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 text-xs text-[#02F74C] font-bold">
              <span className="w-2 h-2 rounded-full bg-[#02F74C] animate-ping" />
              <span>LIVE_AUTO_SYNC</span>
            </span>
            <button
              type="button"
              onClick={fetchLiveTelemetry}
              disabled={refreshing}
              className="p-2 border border-[#02F74C]/40 bg-[#020203] hover:border-[#02F74C] text-[#02F74C] rounded transition-all cursor-pointer disabled:opacity-50"
              title="Refresh Live Telemetry Feed"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Profile Metrics Overview Banner */}
        <div className="border border-[#02F74C] bg-[#0A0D0C] p-4 sm:p-8 shadow-[0_0_30px_rgba(2,247,76,0.12)] mb-6 sm:mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#020203] border border-[#02F74C]/40 text-[#02F74C] text-xs">
                  <GithubIcon className="w-3.5 h-3.5" />
                  <span>@Corder-s</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#020203] border border-[#02F74C]/40 text-[#02F74C] text-xs">
                  <LinkedinIcon className="w-3.5 h-3.5" />
                  <span>in/shubham-saini-33537a374</span>
                </span>
              </div>
              <h3 className="font-code-header text-xl sm:text-2xl text-[#F3F3F4] uppercase font-bold tracking-tight">
                REALTIME PUBLIC TRANSMISSIONS &amp; ECOSYSTEM
              </h3>
              <p className="text-xs text-[#A6A9AA] max-w-2xl leading-relaxed">
                Any code, commits, repositories pushed to GitHub or career milestones on LinkedIn stream automatically into this portfolio in real-time.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
              {profile && (
                <>
                  <div className="flex items-center gap-2 px-3 py-2 bg-[#020203] border border-[#02F74C]/30 text-[#F3F3F4] text-xs">
                    <FolderGit2 className="w-4 h-4 text-[#02F74C]" />
                    <span>{profile.public_repos} Public Repos</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-2 bg-[#020203] border border-[#02F74C]/30 text-[#F3F3F4] text-xs">
                    <Users className="w-4 h-4 text-[#02F74C]" />
                    <span>{profile.followers} Followers</span>
                  </div>
                </>
              )}
              <a
                href="https://github.com/Corder-s"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 border border-[#02F74C] bg-[#02F74C] text-[#020203] text-xs font-bold uppercase tracking-wider shadow-[0_0_15px_rgba(2,247,76,0.3)] hover:scale-105 transition-all flex items-center gap-1.5"
              >
                <span>[ GITHUB_PROFILE ]</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-1.5 sm:gap-2 border-b border-[#02F74C]/20 pb-3 mb-6">
          <button
            type="button"
            onClick={() => setActiveTab('repos')}
            className={`px-3 sm:px-4 py-2 text-[11px] sm:text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 sm:gap-2 ${
              activeTab === 'repos'
                ? 'border border-[#02F74C] bg-[#02F74C] text-[#020203] shadow-[0_0_15px_rgba(2,247,76,0.25)]'
                : 'border border-[#02F74C]/30 bg-[#020203] text-[#A6A9AA] hover:text-[#F3F3F4]'
            }`}
          >
            <FolderGit2 className="w-3.5 h-3.5" />
            <span>01 // REPOS ({repos.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('events')}
            className={`px-3 sm:px-4 py-2 text-[11px] sm:text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 sm:gap-2 ${
              activeTab === 'events'
                ? 'border border-[#02F74C] bg-[#02F74C] text-[#020203] shadow-[0_0_15px_rgba(2,247,76,0.25)]'
                : 'border border-[#02F74C]/30 bg-[#020203] text-[#A6A9AA] hover:text-[#F3F3F4]'
            }`}
          >
            <GitCommit className="w-3.5 h-3.5" />
            <span>02 // COMMITS ({events.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('linkedin')}
            className={`px-3 sm:px-4 py-2 text-[11px] sm:text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 sm:gap-2 ${
              activeTab === 'linkedin'
                ? 'border border-[#02F74C] bg-[#02F74C] text-[#020203] shadow-[0_0_15px_rgba(2,247,76,0.25)]'
                : 'border border-[#02F74C]/30 bg-[#020203] text-[#A6A9AA] hover:text-[#F3F3F4]'
            }`}
          >
            <AppBrandIcon platform="linkedin" size="xs" variant="app-tile" />
            <span>03 // UPDATES ({socialPosts.length})</span>
          </button>
        </div>

        {/* Tab 1: Live Repositories */}
        {activeTab === 'repos' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {repos.length === 0 ? (
              <div className="col-span-3 p-10 text-center text-xs text-[#A6A9AA] border border-[#02F74C]/20 bg-[#0A0D0C]">
                Loading live repositories from GitHub...
              </div>
            ) : (
              repos.map((repo) => (
                <a
                  key={repo.id}
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block p-5 border border-[#02F74C]/30 bg-[#0A0D0C] hover:border-[#02F74C] transition-all hover:shadow-[0_0_20px_rgba(2,247,76,0.2)] flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 border-b border-[#02F74C]/20 pb-2 mb-3">
                      <div className="flex items-center gap-1.5 text-xs text-[#02F74C] font-bold truncate">
                        <FolderGit2 className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{repo.name}</span>
                      </div>
                      <ExternalLink className="w-3 h-3 text-[#A6A9AA] group-hover:text-[#02F74C] shrink-0" />
                    </div>

                    <p className="text-xs text-[#A6A9AA] line-clamp-2 leading-relaxed mb-4">
                      {repo.description || 'Public software engineering repository hosted on GitHub.'}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#02F74C]/10 flex items-center justify-between text-[10px] text-[#A6A9AA]">
                    <div className="flex items-center gap-2">
                      {repo.language && (
                        <span className="px-2 py-0.5 bg-[#020203] border border-[#02F74C]/30 text-[#02F74C] font-bold">
                          {repo.language}
                        </span>
                      )}
                      {repo.stargazers_count > 0 && (
                        <span className="flex items-center gap-0.5 text-amber-400">
                          <Star className="w-3 h-3 fill-current" />
                          <span>{repo.stargazers_count}</span>
                        </span>
                      )}
                    </div>
                    <span className="text-[#76A988] flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5" />
                      <span>{getRelativeTime(repo.pushed_at || repo.updated_at)}</span>
                    </span>
                  </div>
                </a>
              ))
            )}
          </div>
        )}

        {/* Tab 2: Live Commit & Event Stream */}
        {activeTab === 'events' && (
          <div className="space-y-3">
            {events.length === 0 ? (
              <div className="p-10 text-center text-xs text-[#A6A9AA] border border-[#02F74C]/20 bg-[#0A0D0C]">
                Loading recent commit telemetry from GitHub...
              </div>
            ) : (
              events.map((ev) => {
                const commitMsg = ev.payload.commits?.[0]?.message || 'Repository update dispatched';
                const isPush = ev.type === 'PushEvent';

                return (
                  <div
                    key={ev.id}
                    className="p-4 border border-[#02F74C]/30 bg-[#0A0D0C] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-[#020203] border border-[#02F74C]/40 text-[#02F74C] shrink-0 mt-0.5">
                        <GitCommit className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className="text-[#02F74C] font-bold uppercase">{ev.type.replace('Event', '')}</span>
                          <span className="text-[#76A988]">•</span>
                          <span className="text-[#F3F3F4] font-semibold">{ev.repo.name}</span>
                        </div>
                        <p className="text-[11px] text-[#A6A9AA] font-mono leading-relaxed line-clamp-1">
                          &gt; {commitMsg}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 text-[10px] text-[#76A988]">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{getRelativeTime(ev.created_at)}</span>
                      </span>
                      <a
                        href={`https://github.com/${ev.repo.name}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1 border border-[#02F74C]/30 bg-[#020203] hover:border-[#02F74C] text-[#02F74C] flex items-center gap-1 transition-colors"
                      >
                        <span>[ REPO ]</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Tab 3: LinkedIn & Career Transmissions */}
        {activeTab === 'linkedin' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {socialPosts.map((post) => (
              <div
                key={post.id}
                className="p-5 border border-[#02F74C]/30 bg-[#0A0D0C] flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between border-b border-[#02F74C]/20 pb-2 mb-3">
                    <span className="inline-flex items-center gap-2 text-xs text-[#02F74C] font-bold">
                      <AppBrandIcon platform={post.platform} size="xs" variant="app-tile" />
                      <span className="uppercase">{post.platform} UPDATE</span>
                    </span>
                    <span className="text-[10px] text-[#76A988]">
                      {new Date(post.published_at).toLocaleDateString()}
                    </span>
                  </div>

                  <h4 className="font-bold text-sm text-[#F3F3F4] mb-2 leading-snug">
                    {post.title}
                  </h4>
                  <p className="text-xs text-[#A6A9AA] leading-relaxed line-clamp-4">
                    {post.content}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#02F74C]/20 flex items-center justify-between">
                  <span className="text-[10px] text-[#76A988]">By {post.author}</span>
                  <a
                    href={post.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1 bg-[#020203] border border-[#02F74C]/40 text-[#02F74C] text-[10px] font-bold uppercase hover:bg-[#02F74C] hover:text-[#020203] transition-all flex items-center gap-1"
                  >
                    <span>[ VIEW POST ]</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Section Code Footer */}
        <div className="text-xs text-[#76A988] mt-8 select-none">
          <CodeClosingTag tag="LIVE_TELEMETRY" />
        </div>
      </div>
    </section>
  );
};
