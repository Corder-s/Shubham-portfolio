export interface Profile {
  id?: string;
  name: string;
  headline: string;
  bio: string;
  short_bio: string;
  location: string;
  email: string;
  phone: string;
  profile_image: string;
  resume_url: string;
  availability_status: string;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  category: 'FULL STACK' | 'FRONTEND' | 'BACKEND' | 'JAVA' | 'DATA' | 'OTHER';
  description: string;
  long_description?: string;
  technologies: string[];
  features?: string[];
  image: string;
  gallery?: string[];
  github_url?: string;
  live_url?: string;
  featured: boolean;
  status: 'published' | 'draft';
  display_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface Skill {
  id: string;
  name: string;
  category: 'PROGRAMMING' | 'WEB DEVELOPMENT' | 'DATABASE' | 'TOOLS';
  icon?: string;
  proficiency?: string;
  description?: string;
  display_order: number;
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  location: string;
  period: string;
  status?: string;
  details?: string;
  display_order: number;
}

export interface Achievement {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  highlight?: string;
  category: string;
  date?: string;
  display_order: number;
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  location: string;
  period: string;
  description: string;
  technologies: string[];
  display_order: number;
}

export interface Service {
  id: string;
  service_number: string;
  title: string;
  description: string;
  features: string[];
  icon?: string;
  display_order: number;
}

export interface Certification {
  id: string;
  title: string;
  issuer: string;
  issue_date: string;
  credential_url?: string;
  image_url?: string;
  display_order: number;
}

export interface SocialLink {
  id: string;
  platform: 'github' | 'linkedin' | 'instagram' | 'whatsapp' | 'email' | 'phone' | 'other';
  label: string;
  url: string;
  is_active: boolean;
  display_order: number;
}

export interface MessageReply {
  id: string;
  sender: string;
  text: string;
  created_at: string;
  method?: 'in_app' | 'gmail' | 'email';
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'replied' | 'archived';
  created_at: string;
  read_at?: string;
  replied_at?: string;
  replies?: MessageReply[];
}

export interface SiteSettings {
  id?: string;
  site_title: string;
  site_description: string;
  seo_title: string;
  seo_description: string;
  location: string;
  email: string;
  phone: string;
  availability: string;
  footer_text: string;
  profile_image: string;
  resume_url: string;
  og_image?: string;
  // Public AI Portfolio Assistant configuration
  ai_enabled?: boolean;
  ai_assistant_name?: string;
  ai_welcome_message?: string;
  ai_suggested_questions?: string[];
  ai_personality?: string;
}

export interface AIAgentAction {
  label: string;
  action: 'scroll' | 'navigate' | 'external';
  target: string;
}

export interface AIAgentMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: string;
  actions?: AIAgentAction[];
}

export interface AdminUser {
  id: string;
  email: string;
  role: 'admin';
}
