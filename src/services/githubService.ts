export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  updated_at: string;
  pushed_at: string;
  topics?: string[];
}

export interface GitHubEvent {
  id: string;
  type: string;
  actor: {
    login: string;
    avatar_url: string;
  };
  repo: {
    id: number;
    name: string;
    url: string;
  };
  payload: {
    commits?: Array<{
      message: string;
      sha: string;
    }>;
    ref?: string;
    ref_type?: string;
  };
  created_at: string;
}

export interface GitHubProfile {
  login: string;
  name: string;
  avatar_url: string;
  html_url: string;
  public_repos: number;
  followers: number;
  following: number;
  bio: string | null;
}

const DEFAULT_USERNAME = 'Corder-s';
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes cache

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const memoryCache = new Map<string, CacheEntry<any>>();

function getCached<T>(key: string): T | null {
  const entry = memoryCache.get(key);
  if (entry && Date.now() - entry.timestamp < CACHE_TTL_MS) {
    return entry.data as T;
  }
  return null;
}

function setCached<T>(key: string, data: T): void {
  memoryCache.set(key, { data, timestamp: Date.now() });
}

export const githubService = {
  async getProfile(username: string = DEFAULT_USERNAME): Promise<GitHubProfile | null> {
    const cacheKey = `gh_profile_${username}`;
    const cached = getCached<GitHubProfile>(cacheKey);
    if (cached) return cached;

    try {
      const res = await fetch(`https://api.github.com/users/${username}`, {
        headers: { Accept: 'application/vnd.github.v3+json' },
      });
      if (!res.ok) return cached || null;
      const data = (await res.json()) as GitHubProfile;
      setCached(cacheKey, data);
      return data;
    } catch (err) {
      console.warn('Failed to fetch GitHub profile:', err);
      return cached || null;
    }
  },

  async getRecentRepos(username: string = DEFAULT_USERNAME, limit: number = 6): Promise<GitHubRepo[]> {
    const cacheKey = `gh_repos_${username}_${limit}`;
    const cached = getCached<GitHubRepo[]>(cacheKey);
    if (cached) return cached;

    try {
      const res = await fetch(
        `https://api.github.com/users/${username}/repos?sort=updated&per_page=${limit}`,
        {
          headers: { Accept: 'application/vnd.github.v3+json' },
        }
      );
      if (!res.ok) return cached || [];
      const data = await res.json();
      const list = Array.isArray(data) ? (data as GitHubRepo[]) : [];
      if (list.length > 0) setCached(cacheKey, list);
      return list.length > 0 ? list : cached || [];
    } catch (err) {
      console.warn('Failed to fetch GitHub repositories:', err);
      return cached || [];
    }
  },

  async getRecentEvents(username: string = DEFAULT_USERNAME, limit: number = 6): Promise<GitHubEvent[]> {
    const cacheKey = `gh_events_${username}_${limit}`;
    const cached = getCached<GitHubEvent[]>(cacheKey);
    if (cached) return cached;

    try {
      const res = await fetch(
        `https://api.github.com/users/${username}/events?per_page=${limit}`,
        {
          headers: { Accept: 'application/vnd.github.v3+json' },
        }
      );
      if (!res.ok) return cached || [];
      const data = await res.json();
      const list = Array.isArray(data) ? (data as GitHubEvent[]) : [];
      if (list.length > 0) setCached(cacheKey, list);
      return list.length > 0 ? list : cached || [];
    } catch (err) {
      console.warn('Failed to fetch GitHub events:', err);
      return cached || [];
    }
  },
};
