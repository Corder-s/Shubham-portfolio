import { supabase, isSupabaseConfigured } from './supabaseClient';
import { localStore } from './localStore';

export interface SocialFeedPost {
  id: string;
  platform: 'linkedin' | 'github' | 'twitter' | 'other';
  title: string;
  content: string;
  url: string;
  image_url?: string;
  author: string;
  published_at: string;
  created_at?: string;
}

export const initialSocialPosts: SocialFeedPost[] = [
  {
    id: 'post-1',
    platform: 'linkedin',
    title: 'Full-Stack Portfolio & Architecture Release',
    content: 'Excited to showcase my new high-performance developer portfolio built with modern full-stack web architecture, React, Supabase, and real-time telemetry! Constantly iterating on scalable systems and clean code.',
    url: 'https://www.linkedin.com/in/shubham-saini-33537a374/',
    author: 'Shubham Saini',
    published_at: '2026-09-25T10:00:00Z',
  },
  {
    id: 'post-2',
    platform: 'linkedin',
    title: 'Secured ₹2,000 Cash Prize & 8.09 CGPA First Semester Honor',
    content: 'Grateful to receive the Academic Excellence Merit Honor and Cash Award at Dronacharya Group of Institutions for securing an 8.09 CGPA in the first semester examinations. Onward and upward!',
    url: 'https://www.linkedin.com/in/shubham-saini-33537a374/',
    author: 'Shubham Saini',
    published_at: '2026-08-10T14:30:00Z',
  },
  {
    id: 'post-3',
    platform: 'linkedin',
    title: 'Exploring Generalized Power-of-Two Max Heaps in Java',
    content: 'Completed deep dive into d-ary priority queues and cache optimization in high-fanout heaps where branching factor scales strictly by 2^k. Benchmark tests demonstrated significantly improved sift-down operations.',
    url: 'https://github.com/Corder-s/power-of-two-heap',
    author: 'Shubham Saini',
    published_at: '2026-07-20T09:15:00Z',
  },
];

export const socialFeedService = {
  async getPosts(): Promise<SocialFeedPost[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('social_posts')
          .select('*')
          .order('published_at', { ascending: false });

        if (!error && data && data.length > 0) {
          localStore.setSocialPosts(data as SocialFeedPost[]);
          return data as SocialFeedPost[];
        }
      } catch (err) {
        console.warn('Failed to fetch social posts from Supabase:', err);
      }
    }
    return localStore.getSocialPosts();
  },

  async createPost(post: Omit<SocialFeedPost, 'id'>): Promise<SocialFeedPost> {
    const newPost: SocialFeedPost = {
      ...post,
      id: 'post-' + Date.now(),
      created_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('social_posts')
          .insert(newPost)
          .select()
          .single();

        if (!error && data) {
          const list = localStore.getSocialPosts();
          list.unshift(data as SocialFeedPost);
          localStore.setSocialPosts(list);
          return data as SocialFeedPost;
        }
      } catch (err) {
        console.warn('Supabase createPost error:', err);
      }
    }

    const list = localStore.getSocialPosts();
    list.unshift(newPost);
    localStore.setSocialPosts(list);
    return newPost;
  },

  async deletePost(id: string): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('social_posts').delete().eq('id', id);
      } catch (err) {
        console.warn('Supabase deletePost error:', err);
      }
    }
    const list = localStore.getSocialPosts().filter((p) => p.id !== id);
    localStore.setSocialPosts(list);
    return true;
  },
};
