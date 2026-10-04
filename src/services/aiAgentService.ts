import { supabase, isSupabaseConfigured } from './supabaseClient';
import { AIAgentMessage, AIAgentAction } from '../types';
import {
  initialProfile,
  initialProjects,
  initialSkills,
  initialEducation,
  initialAchievements,
  initialExperience,
  initialServices,
  initialSocialLinks,
} from '../data/initialData';

const SESSION_STORAGE_KEY = 'portfolio_ai_chat_session';
const RATE_LIMIT_COOLDOWN_MS = 1500;
let lastRequestTimestamp = 0;

export const DEFAULT_SUGGESTED_QUESTIONS = [
  'Tell me about Shubham.',
  'What projects has he built?',
  'What technologies does he know?',
  'Tell me about Snapgram.',
  'What are his achievements?',
  'How can I contact him?',
  'Can I see his GitHub?',
  'What is his educational background?',
];

// Sensitive keywords for client-side instant guardrails
const SENSITIVE_PROMPTS = [
  /system\s*prompt/i,
  /ignore\s+(all\s+)?(previous|prior)\s+instructions/i,
  /admin\s*(password|credential|token|secret|access|role)/i,
  /supabase\s*(service|key|secret|password|credential)/i,
  /api[_\s-]?key/i,
  /private\s*(message|email|inbox|contact)/i,
  /make\s+me\s+(an\s+)?admin/i,
  /delete\s+(from|database|table)/i,
  /drop\s+table/i,
];

export const aiAgentService = {
  /**
   * Load current session chat history from sessionStorage
   */
  getStoredMessages(): AIAgentMessage[] {
    try {
      const stored = sessionStorage.getItem(SESSION_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // ignore
    }
    return [];
  },

  /**
   * Persist current session chat history to sessionStorage
   */
  saveMessages(messages: AIAgentMessage[]): void {
    try {
      // Keep only recent 20 messages to conserve memory
      sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(messages.slice(-20)));
    } catch {
      // ignore
    }
  },

  /**
   * Clear session conversation
   */
  clearHistory(): void {
    try {
      sessionStorage.removeItem(SESSION_STORAGE_KEY);
    } catch {
      // ignore
    }
  },

  /**
   * Send a question to the AI Agent (via Supabase Edge Function with resilient local fallback)
   */
  async sendMessage(
    userMessage: string,
    history: AIAgentMessage[] = []
  ): Promise<{ response: string; actions?: AIAgentAction[] }> {
    const trimmed = userMessage.trim();

    if (!trimmed) {
      return { response: 'Please type a question about Shubham’s portfolio, projects, or background.' };
    }

    if (trimmed.length > 2000) {
      return {
        response: 'Your message is too long (maximum 2,000 characters). Please send a more concise question.',
      };
    }

    // Client-side rate limiting to prevent button spamming
    const now = Date.now();
    if (now - lastRequestTimestamp < RATE_LIMIT_COOLDOWN_MS) {
      return {
        response: "You're sending messages a little quickly. Please wait a moment and try again.",
      };
    }
    lastRequestTimestamp = now;

    // Strict client-side refusal check
    for (const pattern of SENSITIVE_PROMPTS) {
      if (pattern.test(trimmed)) {
        return {
          response:
            "I can help with Shubham's public portfolio information, projects, skills, education, and contact channels, but I can't provide private credentials, internal system information, or administrative access.",
          actions: [
            { label: 'View Projects', action: 'scroll', target: '#projects' },
            { label: 'Contact Shubham', action: 'scroll', target: '#contact' },
          ],
        };
      }
    }

    // 1. Attempt to invoke the Supabase Edge Function if Supabase is active
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.functions.invoke('portfolio-ai', {
          body: {
            message: trimmed,
            history: history.slice(-6).map((m) => ({
              sender: m.sender,
              content: m.content,
            })),
          },
        });

        if (!error && data && data.response) {
          return {
            response: data.response,
            actions: data.actions || [],
          };
        }
      } catch (err) {
        console.warn('Supabase Edge Function not reachable, invoking resilient local engine:', err);
      }
    }

    // 2. Resilient In-App Knowledge Matcher Fallback
    // Provides immediate, highly accurate answers from Shubham's published portfolio records
    const fallbackResponse = this.generateLocalKnowledgeAnswer(trimmed);
    const actions = this.detectActions(trimmed, fallbackResponse);

    return {
      response: fallbackResponse,
      actions,
    };
  },

  /**
   * Fast, reliable local knowledge base answering engine
   */
  generateLocalKnowledgeAnswer(query: string): string {
    const q = query.toLowerCase();

    // 1. About / Background / Overview
    if (
      q.includes('who is') ||
      q.includes('tell me about') ||
      q.includes('about shubham') ||
      q.includes('what does shubham do') ||
      q.includes('intro') ||
      q.includes('bio')
    ) {
      return (
        `**${initialProfile.name}** is a second-year **B.Tech Computer Science and Engineering** student at Dronacharya Group of Institutions (Greater Noida, India). ` +
        `He is an aspiring Full-Stack Developer focused on building clean web applications, responsive interfaces, practical algorithms, and data-driven systems with **React, Node.js, and Java**.\n\n` +
        `He is actively looking for summer software engineering internships and open-source collaborations.`
      );
    }

    // 2. Snapgram
    if (q.includes('snapgram')) {
      const snapgram = initialProjects.find((p) => p.title.toLowerCase().includes('snapgram'));
      return (
        `**Snapgram** is Shubham's flagship full-stack social media application.\n\n` +
        `• **Overview**: ${snapgram?.description || 'A social media web platform with infinite scroll feeds, photo sharing, and profile management.'}\n` +
        `• **Technologies**: ${snapgram?.technologies.join(', ') || 'React.js, Tailwind CSS, TypeScript, Supabase'}\n` +
        `• **Features**: Infinite feeds, explore search, post likes, custom profile headers, and responsive mobile design.\n\n` +
        `You can explore the source code on GitHub or see it in the Projects showcase below.`
      );
    }

    // 3. Projects
    if (q.includes('project') || q.includes('work') || q.includes('built') || q.includes('portfolio')) {
      const projectList = initialProjects
        .filter((p) => p.status === 'published')
        .map((p) => `• **${p.title}** (${p.category}): ${p.description}`)
        .join('\n');

      return (
        `Here are the featured projects Shubham has built:\n\n` +
        `${projectList}\n\n` +
        `Click **[ View Projects ]** to explore live demos and GitHub repositories!`
      );
    }

    // 4. Skills & Stacks
    if (
      q.includes('skill') ||
      q.includes('technolog') ||
      q.includes('stack') ||
      q.includes('know') ||
      q.includes('react') ||
      q.includes('java') ||
      q.includes('node') ||
      q.includes('python') ||
      q.includes('c++')
    ) {
      if (q.includes('react')) {
        return '**Yes!** Shubham is proficient in **React.js**. He builds modular, type-safe web interfaces with React hooks, Framer Motion animations, and modern Tailwind CSS design systems.';
      }
      if (q.includes('java')) {
        return '**Yes!** Shubham has a strong foundation in **Java**, having designed memory-aligned Max Heaps, graph algorithms, and object-oriented systems with laboratory-verified certification.';
      }
      if (q.includes('python')) {
        return "Python is not currently listed as one of Shubham's primary production stacks in his public portfolio. His core languages are **Java, JavaScript, C++, and C**.";
      }

      const skillsGrouped = {
        Programming: initialSkills.filter((s) => s.category === 'PROGRAMMING').map((s) => s.name).join(', '),
        'Web & Frontend': initialSkills.filter((s) => s.category === 'WEB DEVELOPMENT').map((s) => s.name).join(', '),
        Databases: initialSkills.filter((s) => s.category === 'DATABASE').map((s) => s.name).join(', '),
        Tools: initialSkills.filter((s) => s.category === 'TOOLS').map((s) => s.name).join(', '),
      };

      return (
        `Shubham's verified technical stack includes:\n\n` +
        `• **Languages**: ${skillsGrouped.Programming}\n` +
        `• **Frontend**: ${skillsGrouped['Web & Frontend']}\n` +
        `• **Databases**: ${skillsGrouped.Databases}\n` +
        `• **Developer Tools**: ${skillsGrouped.Tools}`
      );
    }

    // 5. Education
    if (q.includes('education') || q.includes('college') || q.includes('degree') || q.includes('university') || q.includes('academic')) {
      const eduList = initialEducation
        .map((e) => `• **${e.degree}** — ${e.institution}, ${e.location} (${e.period}). ${e.status || ''}`)
        .join('\n');

      return `**Shubham's Academic Background:**\n\n${eduList}`;
    }

    // 6. Achievements & Honors
    if (q.includes('achievement') || q.includes('award') || q.includes('prize') || q.includes('cgpa') || q.includes('honor')) {
      const achList = initialAchievements
        .map((a) => `• **${a.title}**: ${a.subtitle} (${a.description})`)
        .join('\n');

      return (
        `**Honors & Recognition:**\n\n` +
        `${achList}\n\n` +
        `Notably, he achieved an **8.09 CGPA** in his first semester and was awarded a **₹2,000 cash prize** for academic excellence.`
      );
    }

    // 7. Experience & Internships
    if (q.includes('experience') || q.includes('internship') || q.includes('job') || q.includes('work')) {
      return (
        `Shubham is currently an active B.Tech CSE student actively seeking **Summer 2026/2027 software engineering internships**.\n\n` +
        `He has practical experience building end-to-end full stack web applications, configuring Supabase backends, and writing algorithmic data structures.`
      );
    }

    // 8. Contact & Hiring
    if (
      q.includes('contact') ||
      q.includes('hire') ||
      q.includes('reach') ||
      q.includes('email') ||
      q.includes('phone') ||
      q.includes('whatsapp') ||
      q.includes('linkedin')
    ) {
      return (
        `You can connect with Shubham directly through any of these public channels:\n\n` +
        `• **Email**: ${initialProfile.email}\n` +
        `• **WhatsApp**: Available via the floating dock\n` +
        `• **LinkedIn**: [linkedin.com/in/shubham-saini-33537a374](https://www.linkedin.com/in/shubham-saini-33537a374/)\n` +
        `• **GitHub**: [github.com/Corder-s](https://github.com/Corder-s)\n\n` +
        `You can also use the contact form at the bottom of the page to send a direct message.`
      );
    }

    // 9. GitHub & Codebase
    if (q.includes('github') || q.includes('code') || q.includes('repo')) {
      return (
        `Shubham's open source code and repositories are hosted on GitHub at **[@Corder-s](https://github.com/Corder-s)**.\n\n` +
        `His portfolio also includes a **Live Telemetry** section showing his latest GitHub commits and public repositories in real-time!`
      );
    }

    // 10. Services
    if (q.includes('service') || q.includes('build') || q.includes('offer')) {
      const srvList = initialServices.map((s) => `• **${s.title}**: ${s.description}`).join('\n');
      return `Shubham provides full-stack capabilities including:\n\n${srvList}`;
    }

    // Default friendly response
    return (
      "I'm here to assist you with information about Shubham Saini's published projects, technical skills, education, achievements, and contact details. " +
      "You can choose one of the suggested prompts or ask a question directly!"
    );
  },

  /**
   * Extract contextual actionable buttons based on user query and response
   */
  detectActions(query: string, response: string): AIAgentAction[] {
    const text = (query + ' ' + response).toLowerCase();
    const actions: AIAgentAction[] = [];

    if (text.includes('project') || text.includes('snapgram') || text.includes('built')) {
      actions.push({ label: 'View Projects', action: 'scroll', target: '#projects' });
    }

    if (text.includes('skill') || text.includes('stack') || text.includes('technolog')) {
      actions.push({ label: 'Explore Stack', action: 'scroll', target: '#skills' });
    }

    if (text.includes('contact') || text.includes('hire') || text.includes('email') || text.includes('reach') || text.includes('whatsapp')) {
      actions.push({ label: 'Contact Shubham', action: 'scroll', target: '#contact' });
    }

    if (text.includes('github') || text.includes('repo')) {
      actions.push({ label: 'Open GitHub', action: 'external', target: 'https://github.com/Corder-s' });
    }

    if (text.includes('education') || text.includes('college')) {
      actions.push({ label: 'View Education', action: 'scroll', target: '#education' });
    }

    if (text.includes('achievement') || text.includes('cgpa')) {
      actions.push({ label: 'View Achievements', action: 'scroll', target: '#achievements' });
    }

    return actions.slice(0, 3);
  },
};
