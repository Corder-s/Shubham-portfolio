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

export const githubService = {
  async getProfile(username: string = DEFAULT_USERNAME): Promise<GitHubProfile | null> {
    try {
      const res = await fetch(`https://api.github.com/users/${username}`, {
        headers: { Accept: 'application/vnd.github.v3+json' },
      });
      if (!res.ok) return null;
      return (await res.json()) as GitHubProfile;
    } catch (err) {
      console.warn('Failed to fetch GitHub profile:', err);
      return null;
    }
  },

  async getRecentRepos(username: string = DEFAULT_USERNAME, limit: number = 6): Promise<GitHubRepo[]> {
    try {
      const res = await fetch(
        `https://api.github.com/users/${username}/repos?sort=updated&per_page=${limit}`,
        {
          headers: { Accept: 'application/vnd.github.v3+json' },
        }
      );
      if (!res.ok) return [];
      const data = await res.json();
      return Array.isArray(data) ? (data as GitHubRepo[]) : [];
    } catch (err) {
      console.warn('Failed to fetch GitHub repositories:', err);
      return [];
    }
  },

  async getRecentEvents(username: string = DEFAULT_USERNAME, limit: number = 6): Promise<GitHubEvent[]> {
    try {
      const res = await fetch(
        `https://api.github.com/users/${username}/events?per_page=${limit}`,
        {
          headers: { Accept: 'application/vnd.github.v3+json' },
        }
      );
      if (!res.ok) return [];
      const data = await res.json();
      return Array.isArray(data) ? (data as GitHubEvent[]) : [];
    } catch (err) {
      console.warn('Failed to fetch GitHub events:', err);
      return [];
    }
  },
};
