-- ==============================================================================
-- SHUBHAM SAINI PORTFOLIO & ADMIN CMS — INITIAL SEED DATA
-- ==============================================================================

-- 1. PROFILES SEED
INSERT INTO public.profiles (
  id, name, headline, bio, short_bio, location, email, phone, profile_image, resume_url, availability_status
) VALUES (
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'Shubham Saini',
  'B.Tech CSE Student & Full-Stack Developer',
  'I’m a second-year Computer Science & Engineering student in Greater Noida, India. I enjoy building practical software and learning through hands-on projects, coding challenges and continuous experimentation.',
  'A B.Tech Computer Science & Engineering student focused on building responsive interfaces, practical applications, APIs and data-driven projects.',
  'Greater Noida, Uttar Pradesh, India',
  'damnitzshuham1406@gmail.com',
  '+91 9876543210',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800',
  '/resume.pdf',
  'OPEN TO INTERNSHIPS + COLLABORATION'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  headline = EXCLUDED.headline,
  bio = EXCLUDED.bio,
  short_bio = EXCLUDED.short_bio,
  location = EXCLUDED.location,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  profile_image = EXCLUDED.profile_image,
  resume_url = EXCLUDED.resume_url,
  availability_status = EXCLUDED.availability_status;

-- 2. SITE SETTINGS SEED
INSERT INTO public.site_settings (
  id, site_title, site_description, seo_title, seo_description, location, email, phone, availability, footer_text, profile_image, resume_url
) VALUES (
  'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
  'Shubham Saini — Creative Full-Stack Portfolio & Admin CMS',
  'B.Tech Computer Science student and aspiring Full-Stack Developer building responsive interfaces, practical applications and data-driven projects.',
  'Shubham Saini | Full-Stack Developer',
  'B.Tech Computer Science student and aspiring Full-Stack Developer building responsive interfaces, practical applications and data-driven projects.',
  'Greater Noida, Uttar Pradesh, India',
  'damnitzshuham1406@gmail.com',
  '+91 9876543210',
  'Available for Summer 2026/2027 Internships',
  '© 2026 Shubham Saini. Crafted with high editorial standards and modern full-stack web architecture.',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800',
  '/resume.pdf'
) ON CONFLICT (id) DO UPDATE SET
  site_title = EXCLUDED.site_title,
  site_description = EXCLUDED.site_description;

-- 3. PROJECTS SEED
INSERT INTO public.projects (id, title, slug, category, description, long_description, technologies, features, image, gallery, github_url, live_url, featured, status, display_order)
VALUES
(
  'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a31',
  'SNAPGRAM',
  'snapgram',
  'FULL STACK',
  'An Instagram-inspired full-stack social media application with custom feeds, real-time interactions, and modern media delivery.',
  'Snapgram is a full-featured social media platform modeled after modern visual feeds. It integrates secure user authentication, media upload handling, dynamic explore pages, personalized feeds, like/save systems, and responsive profile management. Built to solve high-throughput social networking challenges with optimal component rendering.',
  ARRAY['React', 'Node.js', 'Express', 'MongoDB', 'Tailwind CSS'],
  ARRAY['JWT User Authentication & Secure Session Store', 'Profile customization with avatar uploads and bio management', 'Interactive Post Creation with responsive image transformations', 'Follow / Unfollow dynamic relationship graph', 'Personalized chronological feed & Explore discoverability', 'Clean RESTful APIs with MongoDB index optimization'],
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1200',
  ARRAY['https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1200', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200'],
  'https://github.com/Corder-s/snapgram',
  'https://snapgram-demo.vercel.app',
  true,
  'published',
  1
),
(
  'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a32',
  'STUDENT GRADE CALCULATOR',
  'student-grade-calculator',
  'JAVA',
  'A modular Java application that computes cumulative marks, standard percentages, and grade classifications with rigorous input validation.',
  'Designed as a desktop command & algorithm utility for educational grading. Employs modular design patterns, loops, conditional grade matrixing, and formatted tabular outputs for academic administration.',
  ARRAY['Java', 'Object-Oriented Programming', 'Algorithms'],
  ARRAY['Robust numerical input parsing and boundary error trapping', 'Dynamic weighted percentage and CGPA calculation engine', 'Configurable grading scales (Letter grade, GPA, Percentage)', 'Tabular summary reporting of subject breakdown'],
  'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1200',
  ARRAY[]::TEXT[],
  'https://github.com/Corder-s/student-grade-calculator',
  NULL,
  true,
  'published',
  2
),
(
  'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33',
  'NUMBER GUESSING GAME',
  'number-guessing-game',
  'JAVA',
  'Interactive pseudo-random number challenge with limited attempt constraints, adaptive hints, and high score tracking.',
  'An algorithmic logic game written in Java that challenges player heuristics. Uses bounded pseudo-random generation, stateful round progression, and hint dynamics (Hot/Cold) to create engaging CLI gameplay.',
  ARRAY['Java', 'Algorithms', 'Logic Design'],
  ARRAY['Cryptographically safe random seed generators', 'Round counter and configurable difficulty boundaries', 'Score multiplier based on remaining attempt allowance', 'Interactive hint guidance and replay loop mechanics'],
  'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=1200',
  ARRAY[]::TEXT[],
  'https://github.com/Corder-s/number-guessing-game',
  NULL,
  true,
  'published',
  3
),
(
  'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a34',
  'POWER-OF-TWO MAX HEAP',
  'power-of-two-max-heap',
  'DATA',
  'Configurable d-ary max heap implementation in Java where child branching factors scale strictly by powers of two (2^k).',
  'An advanced data structures laboratory project implementing a Generalized Power-of-Two Max Heap. The data structure optimizes cache locality for high-fanout priority queues, offering faster sift-down evaluations and memory alignment over standard binary heaps.',
  ARRAY['Java', 'Data Structures', 'Algorithm Analysis'],
  ARRAY['Parametric branch degree (2, 4, 8, 16 children per parent)', 'O(log_k n) insert and extractMax priority queue primitives', 'Benchmarking suites comparing binary vs 4-ary vs 8-ary heaps', 'Memory-efficient 1D array flattened index arithmetic'],
  'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=1200',
  ARRAY[]::TEXT[],
  'https://github.com/Corder-s/power-of-two-heap',
  NULL,
  false,
  'published',
  4
)
ON CONFLICT (slug) DO NOTHING;

-- 4. SKILLS SEED
INSERT INTO public.skills (name, category, proficiency, description, display_order)
VALUES
('Java', 'PROGRAMMING', 'Proficient', 'Core OOP, Collections, Multi-threading, Data Structures', 1),
('Python', 'PROGRAMMING', 'Intermediate', 'Scripting, Automation, Data Processing, Backend prototypes', 2),
('C', 'PROGRAMMING', 'Academic', 'Systems programming, memory management, pointers', 3),
('JavaScript', 'PROGRAMMING', 'Proficient', 'ES6+, Async/Await, DOM manipulation, Functional programming', 4),
('HTML5', 'WEB DEVELOPMENT', 'Advanced', 'Semantic structure, accessibility, modern standards', 5),
('CSS3', 'WEB DEVELOPMENT', 'Advanced', 'Flexbox, Grid, Custom Properties, Animations, Responsive layouts', 6),
('React.js', 'WEB DEVELOPMENT', 'Proficient', 'Hooks, Component lifecycle, State management, Custom hooks', 7),
('Node.js', 'WEB DEVELOPMENT', 'Intermediate', 'Event-driven architecture, REST APIs, asynchronous I/O', 8),
('Express.js', 'WEB DEVELOPMENT', 'Intermediate', 'Routing, middleware chains, controller architecture', 9),
('MongoDB', 'DATABASE', 'Intermediate', 'Document schemas, Aggregations, Mongoose ORM, Indexing', 10),
('MySQL', 'DATABASE', 'Intermediate', 'Relational design, Normalization, Joins, Transactions', 11),
('Git', 'TOOLS', 'Proficient', 'Branching, Rebasing, Conflict resolution, Cherry-picking', 12),
('GitHub', 'TOOLS', 'Proficient', 'Pull Requests, Actions CI/CD basics, Issue tracking', 13),
('VS Code', 'TOOLS', 'Advanced', 'Debugging, Extensions, Workspace orchestration', 14),
('Postman', 'TOOLS', 'Proficient', 'API testing, Environment collections, Mock endpoints', 15),
('Canva', 'TOOLS', 'Intermediate', 'Visual presentation, asset creation, layout typography', 16),
('Figma', 'TOOLS', 'Intermediate', 'UI wireframing, component tokens, prototype inspection', 17)
ON CONFLICT DO NOTHING;

-- 5. EDUCATION SEED
INSERT INTO public.education (degree, institution, location, period, status, details, display_order)
VALUES
('B.Tech in Computer Science and Engineering', 'Dronacharya Group of Institutions', 'Greater Noida, Uttar Pradesh', '2025–2029', 'Currently 2nd Year Student', 'Focusing on Core Data Structures, Algorithms, Database Systems, Object-Oriented Software Engineering, and Modern Full-Stack Web Technologies.', 1),
('Class XII (Senior Secondary - PCM)', 'Panchsheel Balak Inter College', 'Noida / Greater Noida', '2024–2025', 'Completed', 'Physics, Chemistry, and Mathematics curriculum building analytical and problem-solving foundations.', 2),
('Class X (Secondary School)', 'Panchsheel Balak Inter College', 'Noida / Greater Noida', '2022–2023', 'Completed', 'Foundation in Science, Mathematics, English, and Computer Basics.', 3)
ON CONFLICT DO NOTHING;

-- 6. ACHIEVEMENTS SEED
INSERT INTO public.achievements (title, subtitle, description, highlight, category, date, display_order)
VALUES
('₹2,000 Cash Prize', 'Academic Excellence (8.09 CGPA - 1st Semester)', 'Awarded formal cash honor and merit certification from the institution for securing 8.09 CGPA in the first semester examinations.', '8.09 CGPA', 'ACADEMICS', '2025', 1),
('Coding Challenges & Problem Solving', 'Algorithm Practice & Active Participation', 'Consistently solving data structure and algorithmic challenges across online competitive programming platforms.', 'Active Coder', 'CODING', '2025–2026', 2),
('Hackathon Participation', 'Collaborative Engineering Sprint', 'Participated in college and inter-college software hackathons prototyping practical web solutions in team settings.', 'Hackathons', 'HACKATHONS', '2025–2026', 3)
ON CONFLICT DO NOTHING;

-- 7. EXPERIENCE SEED
INSERT INTO public.experience (role, company, location, period, description, technologies, display_order)
VALUES
('Full Stack Development Intern', 'Technology Internship Program', 'Greater Noida / Remote', '2025 - Present', 'Working on full-stack web modules, building modular frontend components with React, crafting RESTful endpoints, and integrating schema databases.', ARRAY['React', 'JavaScript', 'Node.js', 'MongoDB', 'Git'], 1)
ON CONFLICT DO NOTHING;

-- 8. SERVICES SEED
INSERT INTO public.services (service_number, title, description, features, display_order)
VALUES
('01', 'FULL-STACK DEVELOPMENT', 'Architecting complete web applications from database schemas to interactive client interfaces with end-to-end type safety.', ARRAY['Custom Web Applications', 'Full-stack React & Node.js', 'Authentication & Role Security', 'Production deployment'], 1),
('02', 'FRONTEND DEVELOPMENT', 'Developing high-performance, responsive, accessible web interfaces adhering to modern editorial and design system aesthetics.', ARRAY['Interactive React / TypeScript UIs', 'Framer Motion micro-animations', 'Clean Component Architecture', 'Pixel-perfect mobile responsiveness'], 2),
('03', 'BACKEND & API DEVELOPMENT', 'Crafting robust RESTful APIs, business logic controllers, middleware validation, and database operations.', ARRAY['RESTful Web Services', 'Secure JWT authentication', 'Error handling & logging', 'Scalable route orchestration'], 3),
('04', 'DATABASE INTEGRATION', 'Designing structured relational and document databases with data integrity, indexing, and performant query handling.', ARRAY['Supabase & PostgreSQL', 'MongoDB Document modeling', 'MySQL schema design', 'Data migration scripts'], 4),
('05', 'RESPONSIVE WEB INTERFACES', 'Ensuring seamless visual and functional experiences across ultra-wide desktops, laptops, tablets, and handheld devices.', ARRAY['Mobile-first design', 'Fluid typography & grids', 'Cross-browser testing', 'Zero layout shift'], 5),
('06', 'WEBSITE DEPLOYMENT', 'Setting up production build pipelines, continuous integration, domain routing, and cloud hosting configurations.', ARRAY['Vercel & Netlify deploy', 'Supabase backend hosting', 'Environment variable security', 'Performance auditing'], 6)
ON CONFLICT DO NOTHING;

-- 9. CERTIFICATIONS SEED
INSERT INTO public.certifications (title, issuer, issue_date, credential_url, display_order)
VALUES
('Full Stack Web Development', 'Course Completion & Practical Projects', '2025', 'https://github.com/Corder-s', 1),
('Data Structures & Algorithms in Java', 'Academic & Laboratory Certification', '2025', 'https://github.com/Corder-s', 2)
ON CONFLICT DO NOTHING;

-- 10. SOCIAL LINKS SEED
INSERT INTO public.social_links (platform, label, url, is_active, display_order)
VALUES
('github', 'GitHub', 'https://github.com/Corder-s', true, 1),
('linkedin', 'LinkedIn', 'https://linkedin.com/in/shubhamsaini-dev', true, 2),
('email', 'Email', 'mailto:damnitzshuham1406@gmail.com', true, 3),
('whatsapp', 'WhatsApp', 'https://wa.me/919876543210', true, 4),
('instagram', 'Instagram', 'https://instagram.com/shubham.saini', true, 5),
('phone', 'Phone', 'tel:+919876543210', true, 6)
ON CONFLICT DO NOTHING;
