# SHUBHAM SAINI — Personal Portfolio

> A modern, interactive, full-stack developer portfolio with a secure admin CMS, Supabase backend, real-time content management, contact system, and AI-powered portfolio assistant.

[![Portfolio](https://img.shields.io/badge/Portfolio-Live-02F74C?style=for-the-badge)](https://corder-s.github.io/)
[![GitHub](https://img.shields.io/badge/GitHub-Corder--s-181717?style=for-the-badge\&logo=github)](https://github.com/Corder-s)
[![React](https://img.shields.io/badge/React-TypeScript-61DAFB?style=for-the-badge\&logo=react)](https://react.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-Backend-3ECF8E?style=for-the-badge\&logo=supabase)](https://supabase.com/)

---

## About

This is the personal portfolio website of **Shubham Saini**, a B.Tech Computer Science and Engineering student and aspiring Full Stack Developer based in Greater Noida, Uttar Pradesh, India.

The portfolio is designed not just as a static personal website, but as a complete full-stack application where portfolio content can be managed dynamically through a private administration system.

The public website allows visitors to:

* Explore Shubham's profile
* View skills and technologies
* Explore projects
* View education
* View achievements
* Explore experience
* Access social profiles
* Contact Shubham
* Ask questions to the AI Portfolio Assistant

The private administration system allows the owner to manage the portfolio without modifying the frontend source code.

---

## Live Portfolio

**Website:**
https://corder-s.github.io/

**GitHub:**
https://github.com/Corder-s

**LinkedIn:**
https://www.linkedin.com/in/shubham-saini-33537a374/

---

# Features

## Public Portfolio

The public-facing portfolio provides a responsive and interactive experience.

### Sections

* Home
* About
* Skills
* Projects
* Experience
* Education
* Achievements
* Certifications
* Services
* Contact
* Social Links

All published portfolio content can be loaded dynamically from Supabase.

---

# AI Portfolio Assistant

The portfolio includes a public-facing AI assistant designed to answer visitor questions about Shubham.

Visitors can ask questions such as:

```text
Who is Shubham?

What projects has he built?

What technologies does he know?

Tell me about Snapgram.

What are his achievements?

What is his educational background?

How can I contact him?

Where can I find his GitHub?
```

The AI assistant is designed to answer using the portfolio's public information instead of inventing information.

### AI capabilities

* Portfolio questions
* Project discovery
* Skill information
* Education information
* Achievement information
* Experience information
* Contact guidance
* GitHub and social links
* Smart portfolio navigation

### AI security

The AI assistant is strictly separated from the administration system.

It cannot:

* Access admin credentials
* Read private messages
* Read unpublished portfolio content
* Modify portfolio data
* Delete portfolio data
* Create admin users
* Change permissions
* Access secret keys
* Reveal system instructions
* Reveal API keys

The AI provider's secret credentials remain server-side through Supabase Edge Functions rather than being exposed in the browser. Supabase supports storing secrets for Edge Functions and distinguishes publishable keys from elevated secret keys.

---

# Private Admin CMS

The portfolio contains a completely private administration system.

The public website does **not** display an Admin button, dashboard link, CMS controls, editing controls, or administrator credentials.

The administration system is intended only for the portfolio owner.

### Admin capabilities

The administrator can manage:

* Profile
* Projects
* Skills
* Experience
* Education
* Achievements
* Certifications
* Services
* Social Links
* Resume
* Contact Messages
* Website Settings
* AI Assistant Configuration

### CRUD Operations

Admin users can:

```text
Create
Read
Update
Delete
Publish
Unpublish
```

portfolio content where permitted.

---

# Public vs Admin Architecture

The application maintains a strict separation between public visitors and administrators.

```text
                    PORTFOLIO
                        |
            +-----------+-----------+
            |                       |
        PUBLIC                    ADMIN
            |                       |
     Portfolio UI             Admin Login
            |                       |
     Public Supabase          Supabase Auth
       Data Access                  |
            |                 Admin Authorization
            |                       |
            |                  Admin Dashboard
            |                       |
            |                  CRUD Operations
            |                       |
            +-----------+-----------+
                        |
                     Supabase
```

### Public visitor

A visitor can:

* Browse published content
* View projects
* View skills
* View achievements
* View education
* View experience
* Contact Shubham
* Use the AI assistant
* Access public social links

A visitor cannot:

* Access the admin dashboard
* Modify portfolio content
* Read private messages
* Access draft content
* Access admin settings
* Access credentials
* Access secrets

---

# Security

Security is implemented at multiple levels.

Simply hiding an Admin button is **not** considered security.

The application uses:

* Supabase Authentication
* Row Level Security
* Admin authorization
* Protected routes
* Server-side secrets
* Input validation
* Rate limiting
* Public/private data separation
* Protected Edge Functions

Supabase recommends using Row Level Security to control what browser-accessible clients can access, while elevated secret keys must remain in trusted server-side environments.

---

# Contact System

Visitors can contact Shubham directly through the portfolio.

### Contact form

The form supports:

* Name
* Email
* Subject
* Message

Messages are stored securely in Supabase.

The application only displays a successful submission after the database operation has actually succeeded.

### Direct contact options

Visitors can also use:

* Email
* WhatsApp
* LinkedIn
* Instagram
* GitHub
* Phone

---

# Backend

The project uses **Supabase as the complete backend platform**.

No separately managed backend server is required.

Supabase is used for:

* Database
* Authentication
* Row Level Security
* Storage
* Realtime functionality
* Edge Functions
* AI integration
* Contact messages

Supabase Edge Functions provide server-side TypeScript execution and can be used for AI integrations and other backend logic.

---

# Database Structure

The application can use the following logical tables:

```text
profiles
projects
skills
experience
education
achievements
certifications
services
social_links
contact_messages
site_settings
admin_roles
```

Public content supports publication controls where appropriate.

Example:

```text
published = true
```

Only published content should appear on the public portfolio.

Draft or private content remains unavailable to public visitors.

---

# Row Level Security

Supabase Row Level Security protects database access.

Conceptually:

```text
PUBLIC

profiles          → READ published
projects          → READ published
skills            → READ published
education         → READ published
experience        → READ published
achievements      → READ published
services          → READ published
social_links      → READ public
contact_messages  → INSERT only


ADMIN

profiles          → CRUD
projects          → CRUD
skills            → CRUD
education         → CRUD
experience        → CRUD
achievements      → CRUD
certifications    → CRUD
services          → CRUD
social_links      → CRUD
contact_messages  → READ / UPDATE / DELETE
site_settings     → CRUD
```

Actual policies should be implemented and tested in Supabase rather than relying on frontend visibility.

---

# AI Architecture

The AI assistant uses a server-side architecture.

```text
Visitor
   |
   v
AI Chat Interface
   |
   v
Supabase Edge Function
   |
   v
Public Portfolio Data
   |
   v
AI Provider
   |
   v
AI Response
   |
   v
Visitor
```

The browser does not receive the AI provider's secret API key.

Supabase Edge Functions support server-side secrets and can act as the secure layer between a browser and external AI services.

---

# Technology Stack

## Frontend

* React
* TypeScript
* Vite
* Tailwind CSS
* Framer Motion
* Lucide React

## Backend

* Supabase
* Supabase Auth
* Supabase Database
* Supabase Storage
* Supabase Realtime
* Supabase Edge Functions

## AI

* AI provider through secure server-side Edge Function
* Portfolio-grounded responses
* Rate limiting
* Input validation
* Prompt injection protection

## Development Tools

* Git
* GitHub
* VS Code
* Postman
* Figma
* Canva

---

# Project Structure

A recommended structure:

```text
portfolio/
│
├── public/
│
├── src/
│   ├── components/
│   │   ├── common/
│   │   ├── portfolio/
│   │   ├── projects/
│   │   ├── contact/
│   │   └── ai/
│   │
│   ├── pages/
│   │   ├── Home/
│   │   ├── About/
│   │   ├── Projects/
│   │   ├── Contact/
│   │   └── admin/
│   │
│   ├── layouts/
│   │   ├── PublicLayout.tsx
│   │   └── AdminLayout.tsx
│   │
│   ├── services/
│   │   ├── supabaseClient.ts
│   │   ├── profileService.ts
│   │   ├── projectService.ts
│   │   ├── skillService.ts
│   │   ├── contactService.ts
│   │   ├── socialService.ts
│   │   └── aiService.ts
│   │
│   ├── hooks/
│   ├── lib/
│   ├── types/
│   ├── routes/
│   └── App.tsx
│
├── supabase/
│   ├── migrations/
│   └── functions/
│       └── portfolio-ai/
│
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

---

# Environment Variables

Create a local environment file based on `.env.example`.

Example:

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_KEY=
```

AI provider secrets must **not** be placed in frontend environment variables.

They should be stored as Supabase Edge Function secrets.

For example:

```text
AI_PROVIDER_KEY
```

Production Edge Function secrets can be configured through the Supabase Dashboard or Supabase CLI.

Never commit actual secrets to GitHub.

---

# Installation

Clone the repository:

```bash
git clone https://github.com/Corder-s/your-portfolio-repository.git
```

Move into the project:

```bash
cd your-portfolio-repository
```

Install dependencies:

```bash
npm install
```

Create your environment file:

```bash
.env
```

Configure the required public Supabase variables.

Start the development server:

```bash
npm run dev
```

The application should then be available through the local development URL shown by Vite.

---

# Supabase Setup

Create a Supabase project.

Then configure:

```text
Database
Authentication
Storage
RLS Policies
Edge Functions
Secrets
```

Apply the project's database migrations.

Deploy the AI Edge Function:

```bash
supabase functions deploy portfolio-ai
```

Supabase provides CLI workflows for creating, testing, and deploying Edge Functions.

---

# Admin Setup

The first administrator should be created through Supabase Authentication.

Then associate the authenticated user with the appropriate admin authorization record.

Example:

```text
admin_roles

id
user_id
role
created_at
```

Role:

```text
admin
```

Do not create an admin system based only on:

```text
localStorage
sessionStorage
isAdmin = true
```

Authorization must be enforced using Supabase Auth and database policies.

---

# Deployment

The frontend can be deployed using a static hosting platform such as GitHub Pages or another supported hosting provider.

The Supabase backend remains hosted separately.

Recommended architecture:

```text
Frontend
   |
   | HTTPS
   v
Hosting Platform
   |
   v
Supabase
   |
   +── Database
   +── Auth
   +── Storage
   +── Realtime
   +── Edge Functions
```

---

# Responsive Design

The portfolio is designed for:

```text
320px
375px
425px
768px
1024px
1440px
1920px+
```

The interface should adapt automatically to:

* Mobile
* Tablet
* Laptop
* Desktop
* Large displays

---

# Performance

The project follows performance-focused principles:

* Lazy loading
* Route-based code splitting
* Optimized images
* Minimal client-side data
* Cached public data where appropriate
* Separate admin bundle
* Limited AI context
* Bounded AI responses
* Efficient Supabase queries

Admin functionality should not unnecessarily increase the public visitor's initial bundle.

---

# Accessibility

The application aims to provide:

* Keyboard navigation
* Semantic HTML
* Accessible buttons
* Accessible forms
* ARIA labels where required
* Good contrast
* Focus states
* Responsive typography
* Reduced-motion support where appropriate

---

# Privacy

The portfolio should collect only information necessary for its functionality.

Contact messages are private and are accessible only to authorized administrators.

AI conversations should not be permanently stored unless explicitly implemented and disclosed.

Private administrative information must never be exposed through public APIs or AI responses.

---

# Security Checklist

Before production deployment, verify:

* [ ] Supabase RLS enabled
* [ ] Public users can only read published content
* [ ] Public users cannot read contact messages
* [ ] Public users cannot modify portfolio content
* [ ] Admin routes require authentication
* [ ] Admin authorization is enforced
* [ ] Non-admin users cannot access admin pages
* [ ] Secret keys are not in frontend code
* [ ] AI provider key is server-side
* [ ] Contact form has validation
* [ ] AI endpoint has rate limiting
* [ ] AI input has length limits
* [ ] Draft content is hidden publicly
* [ ] Admin controls are absent from public UI
* [ ] No credentials are present in GitHub
* [ ] Production environment variables are configured securely

---

# Current Portfolio Information

**Name:** Shubham Saini

**Education:**
B.Tech — Computer Science and Engineering

**Institution:**
Dronacharya Group of Institutions, Greater Noida

**Focus:**
Full Stack Development

**Languages:**
Java, Python, C, JavaScript

**Frontend:**
HTML5, CSS3, JavaScript, React.js

**Backend:**
Node.js, Express.js

**Database:**
MongoDB, MySQL

**Tools:**
Git, GitHub, VS Code, Postman, Canva, Figma

---

# Featured Projects

## Snapgram

A social media web application focused on creating an interactive social networking experience.

Technology areas include:

* React
* Node.js
* Express.js
* MongoDB
* Authentication
* REST APIs

## Student Grade Calculator

A Java-based academic utility for calculating student grades.

## Number Guessing Game

A beginner-friendly Java project demonstrating programming logic and user interaction.

---

# Achievement

Shubham received a **₹2,000 cash prize for achieving an 8.09 CGPA in the first semester**.

---

# Contact

For professional opportunities, collaborations, projects, or general inquiries, visitors can connect through the contact options available on the portfolio.

**Portfolio:**
https://corder-s.github.io/

**GitHub:**
https://github.com/Corder-s

**LinkedIn:**
https://www.linkedin.com/in/shubham-saini-33537a374/

---

# Future Improvements

Planned or possible improvements include:

* Advanced RAG-based portfolio search
* Vector embeddings
* Improved AI contextual understanding
* AI conversation analytics
* Blog/CMS system
* Project filtering
* GitHub API integration
* Automated GitHub project synchronization
* Visitor analytics
* Advanced SEO
* Open Graph metadata
* PWA support
* More interactive portfolio experiences

---

# License

This project is a personal portfolio website created for **Shubham Saini**.

Unless otherwise stated, the portfolio content, personal branding, and original assets should not be reused without permission.

---

## Built With

**React + TypeScript + Tailwind CSS + Framer Motion + Supabase + AI**

Designed and developed by **Shubham Saini**.
