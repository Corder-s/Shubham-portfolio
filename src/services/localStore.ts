import {
  initialProfile,
  initialProjects,
  initialSkills,
  initialEducation,
  initialAchievements,
  initialExperience,
  initialServices,
  initialCertifications,
  initialSocialLinks,
  initialContactMessages,
  initialSiteSettings,
} from '../data/initialData';

const STORAGE_KEYS = {
  PROFILE: 'portfolio_profile',
  PROJECTS: 'portfolio_projects',
  SKILLS: 'portfolio_skills',
  EDUCATION: 'portfolio_education',
  ACHIEVEMENTS: 'portfolio_achievements',
  EXPERIENCE: 'portfolio_experience',
  SERVICES: 'portfolio_services',
  CERTIFICATIONS: 'portfolio_certifications',
  SOCIAL_LINKS: 'portfolio_social_links',
  MESSAGES: 'portfolio_contact_messages',
  SETTINGS: 'portfolio_site_settings',
  SOCIAL_POSTS: 'portfolio_social_posts',
  AUTH: 'portfolio_auth_user',
};

function getStoredItem<T>(key: string, defaultVal: T): T {
  try {
    const data = localStorage.getItem(key);
    if (!data) {
      localStorage.setItem(key, JSON.stringify(defaultVal));
      return defaultVal;
    }
    return JSON.parse(data) as T;
  } catch {
    return defaultVal;
  }
}

function setStoredItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('portfolio_data_updated', { detail: { key, value } }));
    }
  } catch (e) {
    console.error(`Failed to save to localStorage (${key})`, e);
  }
}

export const localStore = {
  getProfile: () => {
    const prof = getStoredItem(STORAGE_KEYS.PROFILE, initialProfile);
    if (prof && (prof.email === 'sainishubham.dev@gmail.com' || !prof.email)) {
      prof.email = 'damnitzshuham1406@gmail.com';
      setStoredItem(STORAGE_KEYS.PROFILE, prof);
    }
    return prof;
  },
  setProfile: (data: typeof initialProfile) => setStoredItem(STORAGE_KEYS.PROFILE, data),

  getProjects: () => getStoredItem(STORAGE_KEYS.PROJECTS, initialProjects),
  setProjects: (data: typeof initialProjects) => setStoredItem(STORAGE_KEYS.PROJECTS, data),

  getSkills: () => getStoredItem(STORAGE_KEYS.SKILLS, initialSkills),
  setSkills: (data: typeof initialSkills) => setStoredItem(STORAGE_KEYS.SKILLS, data),

  getEducation: () => getStoredItem(STORAGE_KEYS.EDUCATION, initialEducation),
  setEducation: (data: typeof initialEducation) => setStoredItem(STORAGE_KEYS.EDUCATION, data),

  getAchievements: () => getStoredItem(STORAGE_KEYS.ACHIEVEMENTS, initialAchievements),
  setAchievements: (data: typeof initialAchievements) => setStoredItem(STORAGE_KEYS.ACHIEVEMENTS, data),

  getExperience: () => getStoredItem(STORAGE_KEYS.EXPERIENCE, initialExperience),
  setExperience: (data: typeof initialExperience) => setStoredItem(STORAGE_KEYS.EXPERIENCE, data),

  getServices: () => getStoredItem(STORAGE_KEYS.SERVICES, initialServices),
  setServices: (data: typeof initialServices) => setStoredItem(STORAGE_KEYS.SERVICES, data),

  getCertifications: () => getStoredItem(STORAGE_KEYS.CERTIFICATIONS, initialCertifications),
  setCertifications: (data: typeof initialCertifications) => setStoredItem(STORAGE_KEYS.CERTIFICATIONS, data),

  getSocialLinks: () => {
    const links = getStoredItem(STORAGE_KEYS.SOCIAL_LINKS, initialSocialLinks);
    let changed = false;
    links.forEach((l: any) => {
      if (l.platform === 'email' && (l.url.includes('sainishubham.dev@gmail.com') || !l.url)) {
        l.url = 'mailto:damnitzshuham1406@gmail.com';
        changed = true;
      }
      if (l.platform === 'phone' && (l.url.includes('8958364005') || !l.url)) {
        l.url = 'tel:+917983873223';
        changed = true;
      }
      if (l.platform === 'whatsapp' && (l.url.includes('8958364005') || !l.url)) {
        l.url = 'https://wa.me/917983873223';
        changed = true;
      }
      if (l.platform === 'instagram' && (l.url.includes('damn.itz_shubham') || !l.url)) {
        l.url = 'https://instagram.com/shubham.saini';
        changed = true;
      }
    });
    if (changed) {
      setStoredItem(STORAGE_KEYS.SOCIAL_LINKS, links);
    }
    return links;
  },
  setSocialLinks: (data: typeof initialSocialLinks) => setStoredItem(STORAGE_KEYS.SOCIAL_LINKS, data),

  getMessages: () => getStoredItem(STORAGE_KEYS.MESSAGES, initialContactMessages),
  setMessages: (data: typeof initialContactMessages) => setStoredItem(STORAGE_KEYS.MESSAGES, data),

  getSettings: () => {
    const st = getStoredItem(STORAGE_KEYS.SETTINGS, initialSiteSettings);
    if (st && (st.email === 'sainishubham.dev@gmail.com' || !st.email)) {
      st.email = 'damnitzshuham1406@gmail.com';
      setStoredItem(STORAGE_KEYS.SETTINGS, st);
    }
    return st;
  },
  setSettings: (data: typeof initialSiteSettings) => setStoredItem(STORAGE_KEYS.SETTINGS, data),

  getSocialPosts: () => getStoredItem<any[]>(STORAGE_KEYS.SOCIAL_POSTS, []),
  setSocialPosts: (data: any[]) => setStoredItem(STORAGE_KEYS.SOCIAL_POSTS, data),

  resetToDefaults: () => {
    Object.values(STORAGE_KEYS).forEach((k) => localStorage.removeItem(k));
  },
};
