import {
  Profile,
  Project,
  Skill,
  Education,
  Achievement,
  Experience,
  Service,
  Certification,
  SocialLink,
  SiteSettings,
  ContactMessage,
} from '../types';

export const initialProfile: Profile = {
  name: 'Shubham Saini',
  headline: 'B.Tech CSE Student & Full-Stack Developer',
  bio: 'I’m a second-year Computer Science & Engineering student in Greater Noida, India. I enjoy building practical software and learning through hands-on projects, coding challenges and continuous experimentation.',
  short_bio: 'A B.Tech Computer Science & Engineering student focused on building responsive interfaces, practical applications, APIs and data-driven projects.',
  location: 'Greater Noida, Uttar Pradesh, India',
  email: 'damnitzshuham1406@gmail.com',
  phone: '+91 9876543210',
  profile_image: '/shubham_photo.png',
  resume_url: '/resume.pdf',
  availability_status: 'OPEN TO INTERNSHIPS + COLLABORATION',
};

export const initialSiteSettings: SiteSettings = {
  site_title: 'Shubham Saini — Creative Full-Stack Portfolio & Admin CMS',
  site_description: 'B.Tech Computer Science student and aspiring Full-Stack Developer building responsive interfaces, practical applications and data-driven projects.',
  seo_title: 'Shubham Saini | Full-Stack Developer',
  seo_description: 'B.Tech Computer Science student and aspiring Full-Stack Developer building responsive interfaces, practical applications and data-driven projects.',
  location: 'Greater Noida, Uttar Pradesh, India',
  email: 'damnitzshuham1406@gmail.com',
  phone: '+91 9876543210',
  availability: 'Available for Summer 2026/2027 Internships',
  footer_text: '© 2026 Shubham Saini. Crafted with high editorial standards and modern full-stack web architecture.',
  profile_image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800',
  resume_url: '/resume.pdf',
  ai_enabled: true,
  ai_assistant_name: 'Ask Shubham',
  ai_welcome_message: "Hi! I'm Shubham's AI portfolio assistant. Ask me anything about his projects, skills, education, achievements, experience, or how to contact him.",
  ai_suggested_questions: [
    'Tell me about Shubham.',
    'What projects has he built?',
    'What technologies does he know?',
    'Tell me about Snapgram.',
    'What are his achievements?',
    'How can I contact him?',
    'Can I see his GitHub?',
    'What is his educational background?'
  ],
  ai_personality: 'professional, concise, friendly developer portfolio assistant',
};

export const initialProjects: Project[] = [
  {
    id: 'proj-1',
    title: 'SNAPGRAM',
    slug: 'snapgram',
    category: 'FULL STACK',
    description: 'An Instagram-inspired full-stack social media application with custom feeds, real-time interactions, and modern media delivery.',
    long_description: 'Snapgram is a full-featured social media platform modeled after modern visual feeds. It integrates secure user authentication, media upload handling, dynamic explore pages, personalized feeds, like/save systems, and responsive profile management. Built to solve high-throughput social networking challenges with optimal component rendering.',
    technologies: ['React', 'Node.js', 'Express', 'MongoDB', 'Tailwind CSS'],
    features: [
      'JWT User Authentication & Secure Session Store',
      'Profile customization with avatar uploads and bio management',
      'Interactive Post Creation with responsive image transformations',
      'Follow / Unfollow dynamic relationship graph',
      'Personalized chronological feed & Explore discoverability',
      'Clean RESTful APIs with MongoDB index optimization'
    ],
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1200',
    gallery: [
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200'
    ],
    github_url: 'https://github.com/Corder-s/snapgram',
    live_url: 'https://snapgram-demo.vercel.app',
    featured: true,
    status: 'published',
    display_order: 1,
    created_at: '2026-01-15T10:00:00Z',
  },
  {
    id: 'proj-2',
    title: 'STUDENT GRADE CALCULATOR',
    slug: 'student-grade-calculator',
    category: 'JAVA',
    description: 'A modular Java application that computes cumulative marks, standard percentages, and grade classifications with rigorous input validation.',
    long_description: 'Designed as a desktop command & algorithm utility for educational grading. Employs modular design patterns, loops, conditional grade matrixing, and formatted tabular outputs for academic administration.',
    technologies: ['Java', 'Object-Oriented Programming', 'Algorithms'],
    features: [
      'Robust numerical input parsing and boundary error trapping',
      'Dynamic weighted percentage and CGPA calculation engine',
      'Configurable grading scales (Letter grade, GPA, Percentage)',
      'Tabular summary reporting of subject breakdown'
    ],
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1200',
    github_url: 'https://github.com/Corder-s/student-grade-calculator',
    featured: true,
    status: 'published',
    display_order: 2,
    created_at: '2025-11-20T10:00:00Z',
  },
  {
    id: 'proj-3',
    title: 'NUMBER GUESSING GAME',
    slug: 'number-guessing-game',
    category: 'JAVA',
    description: 'Interactive pseudo-random number challenge with limited attempt constraints, adaptive hints, and high score tracking.',
    long_description: 'An algorithmic logic game written in Java that challenges player heuristics. Uses bounded pseudo-random generation, stateful round progression, and hint dynamics (Hot/Cold) to create engaging CLI gameplay.',
    technologies: ['Java', 'Algorithms', 'Logic Design'],
    features: [
      'Cryptographically safe random seed generators',
      'Round counter and configurable difficulty boundaries',
      'Score multiplier based on remaining attempt allowance',
      'Interactive hint guidance and replay loop mechanics'
    ],
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=1200',
    github_url: 'https://github.com/Corder-s/number-guessing-game',
    featured: true,
    status: 'published',
    display_order: 3,
    created_at: '2025-10-05T10:00:00Z',
  },
  {
    id: 'proj-4',
    title: 'POWER-OF-TWO MAX HEAP',
    slug: 'power-of-two-max-heap',
    category: 'DATA',
    description: 'Configurable d-ary max heap implementation in Java where child branching factors scale strictly by powers of two (2^k).',
    long_description: 'An advanced data structures laboratory project implementing a Generalized Power-of-Two Max Heap. The data structure optimizes cache locality for high-fanout priority queues, offering faster sift-down evaluations and memory alignment over standard binary heaps.',
    technologies: ['Java', 'Data Structures', 'Algorithm Analysis'],
    features: [
      'Parametric branch degree (2, 4, 8, 16 children per parent)',
      'O(log_k n) insert and extractMax priority queue primitives',
      'Benchmarking suites comparing binary vs 4-ary vs 8-ary heaps',
      'Memory-efficient 1D array flattened index arithmetic'
    ],
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=1200',
    github_url: 'https://github.com/Corder-s/power-of-two-heap',
    featured: false,
    status: 'published',
    display_order: 4,
    created_at: '2025-09-12T10:00:00Z',
  }
];

export const initialSkills: Skill[] = [
  // Programming
  { id: 'sk-1', name: 'Java', category: 'PROGRAMMING', proficiency: 'Proficient', description: 'Core OOP, Collections, Multi-threading, Data Structures', display_order: 1 },
  { id: 'sk-2', name: 'Python', category: 'PROGRAMMING', proficiency: 'Intermediate', description: 'Scripting, Automation, Data Processing, Backend prototypes', display_order: 2 },
  { id: 'sk-3', name: 'C', category: 'PROGRAMMING', proficiency: 'Academic', description: 'Systems programming, memory management, pointers', display_order: 3 },
  { id: 'sk-4', name: 'JavaScript', category: 'PROGRAMMING', proficiency: 'Proficient', description: 'ES6+, Async/Await, DOM manipulation, Functional programming', display_order: 4 },

  // Web Development
  { id: 'sk-5', name: 'HTML5', category: 'WEB DEVELOPMENT', proficiency: 'Advanced', description: 'Semantic structure, accessibility, modern standards', display_order: 5 },
  { id: 'sk-6', name: 'CSS3', category: 'WEB DEVELOPMENT', proficiency: 'Advanced', description: 'Flexbox, Grid, Custom Properties, Animations, Responsive layouts', display_order: 6 },
  { id: 'sk-7', name: 'React.js', category: 'WEB DEVELOPMENT', proficiency: 'Proficient', description: 'Hooks, Component lifecycle, State management, Custom hooks', display_order: 7 },
  { id: 'sk-8', name: 'Node.js', category: 'WEB DEVELOPMENT', proficiency: 'Intermediate', description: 'Event-driven architecture, REST APIs, asynchronous I/O', display_order: 8 },
  { id: 'sk-9', name: 'Express.js', category: 'WEB DEVELOPMENT', proficiency: 'Intermediate', description: 'Routing, middleware chains, controller architecture', display_order: 9 },

  // Database
  { id: 'sk-10', name: 'MongoDB', category: 'DATABASE', proficiency: 'Intermediate', description: 'Document schemas, Aggregations, Mongoose ORM, Indexing', display_order: 10 },
  { id: 'sk-11', name: 'MySQL', category: 'DATABASE', proficiency: 'Intermediate', description: 'Relational design, Normalization, Joins, Transactions', display_order: 11 },

  // Tools
  { id: 'sk-12', name: 'Git', category: 'TOOLS', proficiency: 'Proficient', description: 'Branching, Rebasing, Conflict resolution, Cherry-picking', display_order: 12 },
  { id: 'sk-13', name: 'GitHub', category: 'TOOLS', proficiency: 'Proficient', description: 'Pull Requests, Actions CI/CD basics, Issue tracking', display_order: 13 },
  { id: 'sk-14', name: 'VS Code', category: 'TOOLS', proficiency: 'Advanced', description: 'Debugging, Extensions, Workspace orchestration', display_order: 14 },
  { id: 'sk-15', name: 'Postman', category: 'TOOLS', proficiency: 'Proficient', description: 'API testing, Environment collections, Mock endpoints', display_order: 15 },
  { id: 'sk-16', name: 'Canva', category: 'TOOLS', proficiency: 'Intermediate', description: 'Visual presentation, asset creation, layout typography', display_order: 16 },
  { id: 'sk-17', name: 'Figma', category: 'TOOLS', proficiency: 'Intermediate', description: 'UI wireframing, component tokens, prototype inspection', display_order: 17 },
];

export const initialEducation: Education[] = [
  {
    id: 'edu-1',
    degree: 'B.Tech in Computer Science and Engineering',
    institution: 'Dronacharya Group of Institutions',
    location: 'Greater Noida, Uttar Pradesh',
    period: '2025–2029',
    status: 'Currently 2nd Year Student',
    details: 'Focusing on Core Data Structures, Algorithms, Database Systems, Object-Oriented Software Engineering, and Modern Full-Stack Web Technologies.',
    display_order: 1,
  },
  {
    id: 'edu-2',
    degree: 'Class XII (Senior Secondary - PCM)',
    institution: 'Panchsheel Balak Inter College',
    location: 'Noida / Greater Noida',
    period: '2024–2025',
    status: 'Completed',
    details: 'Physics, Chemistry, and Mathematics curriculum building analytical and problem-solving foundations.',
    display_order: 2,
  },
  {
    id: 'edu-3',
    degree: 'Class X (Secondary School)',
    institution: 'Panchsheel Balak Inter College',
    location: 'Noida / Greater Noida',
    period: '2022–2023',
    status: 'Completed',
    details: 'Foundation in Science, Mathematics, English, and Computer Basics.',
    display_order: 3,
  },
];

export const initialAchievements: Achievement[] = [
  {
    id: 'ach-1',
    title: '₹2,000 Cash Prize',
    subtitle: 'Academic Excellence (8.09 CGPA - 1st Semester)',
    description: 'Awarded formal cash honor and merit certification from the institution for securing 8.09 CGPA in the first semester examinations.',
    highlight: '8.09 CGPA',
    category: 'ACADEMICS',
    date: '2025',
    display_order: 1,
  },
  {
    id: 'ach-2',
    title: 'Coding Challenges & Problem Solving',
    subtitle: 'Algorithm Practice & Active Participation',
    description: 'Consistently solving data structure and algorithmic challenges across online competitive programming platforms.',
    highlight: 'Active Coder',
    category: 'CODING',
    date: '2025–2026',
    display_order: 2,
  },
  {
    id: 'ach-3',
    title: 'Hackathon Participation',
    subtitle: 'Collaborative Engineering Sprint',
    description: 'Participated in college and inter-college software hackathons prototyping practical web solutions in team settings.',
    highlight: 'Hackathons',
    category: 'HACKATHONS',
    date: '2025–2026',
    display_order: 3,
  },
];

export const initialExperience: Experience[] = [
  {
    id: 'exp-1',
    role: 'Full Stack Development Intern',
    company: 'Technology Internship Program',
    location: 'Greater Noida / Remote',
    period: '2025 - Present',
    description: 'Working on full-stack web modules, building modular frontend components with React, crafting RESTful endpoints, and integrating schema databases.',
    technologies: ['React', 'JavaScript', 'Node.js', 'MongoDB', 'Git'],
    display_order: 1,
  },
];

export const initialServices: Service[] = [
  {
    id: 'srv-1',
    service_number: '01',
    title: 'FULL-STACK DEVELOPMENT',
    description: 'Architecting complete web applications from database schemas to interactive client interfaces with end-to-end type safety.',
    features: ['Custom Web Applications', 'Full-stack React & Node.js', 'Authentication & Role Security', 'Production deployment'],
    display_order: 1,
  },
  {
    id: 'srv-2',
    service_number: '02',
    title: 'FRONTEND DEVELOPMENT',
    description: 'Developing high-performance, responsive, accessible web interfaces adhering to modern editorial and design system aesthetics.',
    features: ['Interactive React / TypeScript UIs', 'Framer Motion micro-animations', 'Clean Component Architecture', 'Pixel-perfect mobile responsiveness'],
    display_order: 2,
  },
  {
    id: 'srv-3',
    service_number: '03',
    title: 'BACKEND & API DEVELOPMENT',
    description: 'Crafting robust RESTful APIs, business logic controllers, middleware validation, and database operations.',
    features: ['RESTful Web Services', 'Secure JWT authentication', 'Error handling & logging', 'Scalable route orchestration'],
    display_order: 3,
  },
  {
    id: 'srv-4',
    service_number: '04',
    title: 'DATABASE INTEGRATION',
    description: 'Designing structured relational and document databases with data integrity, indexing, and performant query handling.',
    features: ['Supabase & PostgreSQL', 'MongoDB Document modeling', 'MySQL schema design', 'Data migration scripts'],
    display_order: 4,
  },
  {
    id: 'srv-5',
    service_number: '05',
    title: 'RESPONSIVE WEB INTERFACES',
    description: 'Ensuring seamless visual and functional experiences across ultra-wide desktops, laptops, tablets, and handheld devices.',
    features: ['Mobile-first design', 'Fluid typography & grids', 'Cross-browser testing', 'Zero layout shift'],
    display_order: 5,
  },
  {
    id: 'srv-6',
    service_number: '06',
    title: 'WEBSITE DEPLOYMENT',
    description: 'Setting up production build pipelines, continuous integration, domain routing, and cloud hosting configurations.',
    features: ['Vercel & Netlify deploy', 'Supabase backend hosting', 'Environment variable security', 'Performance auditing'],
    display_order: 6,
  },
];

export const initialCertifications: Certification[] = [
  {
    id: 'cert-1',
    title: 'Full Stack Web Development',
    issuer: 'Course Completion & Practical Projects',
    issue_date: '2025',
    credential_url: 'https://github.com/Corder-s',
    display_order: 1,
  },
  {
    id: 'cert-2',
    title: 'Data Structures & Algorithms in Java',
    issuer: 'Academic & Laboratory Certification',
    issue_date: '2025',
    display_order: 2,
  }
];

export const initialSocialLinks: SocialLink[] = [
  { id: 'soc-1', platform: 'github', label: 'GitHub', url: 'https://github.com/Corder-s', is_active: true, display_order: 1 },
  { id: 'soc-2', platform: 'linkedin', label: 'LinkedIn', url: 'https://www.linkedin.com/in/shubham-saini-33537a374/', is_active: true, display_order: 2 },
  { id: 'soc-3', platform: 'email', label: 'Email', url: 'mailto:damnitzshuham1406@gmail.com', is_active: true, display_order: 3 },
  { id: 'soc-4', platform: 'whatsapp', label: 'WhatsApp', url: 'https://wa.me/919876543210', is_active: true, display_order: 4 },
  { id: 'soc-5', platform: 'instagram', label: 'Instagram', url: 'https://instagram.com/shubham.saini', is_active: true, display_order: 5 },
  { id: 'soc-6', platform: 'phone', label: 'Phone', url: 'tel:+919876543210', is_active: true, display_order: 6 },
];

export const initialContactMessages: ContactMessage[] = [
  {
    id: 'msg-1',
    name: 'Aarav Sharma',
    email: 'aarav.sharma@example.com',
    subject: 'Internship Opportunity - Full Stack Engineer',
    message: 'Hi Shubham, I came across your Snapgram project and portfolio. We have an upcoming summer engineering internship at our startup. Would love to connect!',
    status: 'new',
    created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    id: 'msg-2',
    name: 'Priya Verma',
    email: 'priya.verma@techlab.org',
    subject: 'Hackathon Collaboration',
    message: 'Hello! We are assembling a team for an upcoming national hackathon in Delhi-NCR. Your frontend & Java skills would be a great asset. Let us know if you are open to teaming up.',
    status: 'read',
    created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
    read_at: new Date(Date.now() - 3600000 * 12).toISOString(),
  },
];
