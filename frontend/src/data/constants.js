export const AGENCY_CONFIG = {
  brandName: "ORBIVISION",
  tagline: "WE BUILD DIGITAL EXPERIENCES THAT MOVE BUSINESSES FORWARD.",
  subtitle: "From powerful websites and mobile applications to intelligent AI automation, we transform ideas into digital solutions that make a difference.",
  availability: "Available for New Projects",
  responseSpeed: "< 2 Hours",
  stats: [
    { label: "Client Satisfaction", value: "99.8%", change: "+4.2% YoY" },
    { label: "Successful Deliveries", value: "40+", change: "Zero Delay" },
    { label: "Technologies Mastered", value: "25+", change: "Full-Stack & AI" },
    { label: "Direct Founder Access", value: "100%", change: "Om & Trushal" },
  ]
};

export const NAV_LINKS = [
  { name: 'Home', href: '#' },
  { name: 'Services', href: '#services' },
  { name: 'About Us', href: '#about' },
  { name: 'Our Process', href: '#process' },
  { name: 'Contact', href: '#contact' },
];

export const FOUNDERS = [
  {
    id: "om",
    name: "Om Makwana",
    role: "Co-founder | Digital Solutions & Development",
    focus: "Web Applications, Full-Stack & UI/UX Systems",
    phone: "+91 9426231338",
    email: "826458om@gmail.com",
    whatsapp: "https://wa.me/919426231338?text=Hi%20Om,%20I'd%20like%20to%20discuss%20a%20project%20with%20ORBIVISION.",
    bio: "Passionate digital architect specializing in modern high-conversion web platforms, responsive full-stack applications, and interactive creative web technologies.",
    skills: ["Website Design & Dev", "Full-Stack Web", "React & Modern JS", "UI/UX Systems", "Three.js & Motion", "API Architecture"],
    accentColor: "from-purple-500 to-indigo-600",
    glowColor: "rgba(139, 92, 246, 0.4)",
    initials: "OM"
  },
  {
    id: "trushal",
    name: "Trushal Parmar",
    role: "Co-founder | AI, Backend & Full-Stack Development",
    focus: "AI Automation, Microservices & Cloud Infrastructure",
    phone: "+91 8733070464",
    email: "trushalmparmar96@gmail.com",
    whatsapp: "https://wa.me/918733070464?text=Hi%20Trushal,%20I'd%20like%20to%20consult%20ORBIVISION%20on%20AI%20and%20backend%20solutions.",
    bio: "Systems and AI engineer with deep expertise in custom LLM automation, robust Python/FastAPI backends, enterprise database architectures, and autonomous agent workflows.",
    skills: ["AI Automation & Agents", "Python / FastAPI", "Workflow Automation (n8n)", "Database Systems", "Cloud & Docker", "High-Throughput APIs"],
    accentColor: "from-sky-400 to-blue-600",
    glowColor: "rgba(56, 189, 248, 0.4)",
    initials: "TP"
  }
];

export const DEFAULT_SERVICES = [
  {
    id: 1,
    title: "Website Design & Development",
    icon_name: "Globe",
    tagline: "Stunning, high-conversion digital flagships",
    description: "Crafting bespoke, visually arresting websites engineered for speed, SEO excellence, and flawless user journeys across every device.",
    features: ["Pixel-perfect dark/light themes", "Ultra-fast load times (<0.8s)", "SEO & Core Web Vitals optimization", "Interactive micro-animations"],
    deliverables: ["Custom responsive website", "Content management setup", "Analytics integration", "Speed audit & SSL"],
    order: 1
  },
  {
    id: 2,
    title: "Full-Stack Web Development",
    icon_name: "Layers",
    tagline: "Scalable end-to-end architectures",
    description: "Building powerful web applications with resilient backends, fluid interactive frontends, and hardened security protocols.",
    features: ["React, Vue, or Angular frontends", "FastAPI / Node.js backends", "RESTful & GraphQL APIs", "Relational & NoSQL database schemas"],
    deliverables: ["Full codebase repository", "Automated deployment pipeline", "API documentation", "Architecture blueprint"],
    order: 2
  },
  {
    id: 3,
    title: "Custom Web Applications",
    icon_name: "Monitor",
    tagline: "Tailored SaaS and enterprise platforms",
    description: "Delivering bespoke web portals, client portals, SaaS platforms, and internal tools tailored to streamline operational complexity.",
    features: ["Multi-tenant authentication", "Role-based access control (RBAC)", "Real-time updates via WebSockets", "Comprehensive telemetry dashboards"],
    deliverables: ["Complete SaaS application", "Admin management dashboard", "Payment gateway integration", "Cloud deployment"],
    order: 3
  },
  {
    id: 4,
    title: "Android & iOS App Development",
    icon_name: "Smartphone",
    tagline: "Fluid native and cross-platform apps",
    description: "Developing high-performance mobile applications that users love, featuring smooth native gestures, offline support, and biometric security.",
    features: ["React Native & Flutter", "iOS App Store & Google Play compliance", "Push notification engines", "Offline data synchronization"],
    deliverables: ["iOS & Android binaries", "App Store submission assistance", "Backend mobile API", "Maintenance plan"],
    order: 4
  },
  {
    id: 5,
    title: "AI Automation & AI Integration",
    icon_name: "Cpu",
    tagline: "Supercharge your business with autonomous intelligence",
    description: "Integrating state-of-the-art LLMs (OpenAI, Gemini, Anthropic), custom autonomous AI agents, and intelligent document processors into your workflows.",
    features: ["Fine-tuned LLM assistants", "Retrieval-Augmented Generation (RAG)", "Smart customer support bots", "Predictive data models"],
    deliverables: ["Operational AI agents", "Custom vector database setup", "API keys & privacy compliance", "Staff training workshop"],
    order: 5
  },
  {
    id: 6,
    title: "Business Process Automation",
    icon_name: "Zap",
    tagline: "Eliminate repetitive tasks and human error",
    description: "Connecting your disparate software tools with automated pipelines using n8n, Make, custom webhooks, and Python background workers.",
    features: ["n8n & Zapier workflow setups", "Automated invoice & lead routing", "CRM & ERP synchronization", "Error recovery alerting"],
    deliverables: ["Configured automation workflows", "Monitoring dashboard", "Fail-safe backup rules", "Operational playbook"],
    order: 6
  },
  {
    id: 7,
    title: "UI/UX Design",
    icon_name: "Palette",
    tagline: "Intuitive, engaging, human-centric interfaces",
    description: "Transforming complex workflows into elegant, intuitive digital interfaces through rigorous user research, wireframing, and interactive prototyping.",
    features: ["Figma component design systems", "Interactive micro-interactions", "High-fidelity clickable prototypes", "Usability testing & heatmaps"],
    deliverables: ["Comprehensive Figma design system", "UI component library", "Developer handoff specs", "User flow diagrams"],
    order: 7
  },
  {
    id: 8,
    title: "Graphic Design & Branding",
    icon_name: "Sparkles",
    tagline: "Memorable visual identities that demand attention",
    description: "Forging distinct brand personas with timeless logos, typography guidelines, cyber-modern design elements, and marketing collateral.",
    features: ["Vector logo systems", "Complete typography pairings", "Brand voice & style guide", "Social media design kits"],
    deliverables: ["Full vector brand identity kit", "Brand book PDF", "Iconography library", "Social asset templates"],
    order: 8
  },
  {
    id: 9,
    title: "E-commerce Website Development",
    icon_name: "ShoppingBag",
    tagline: "High-converting online storefronts",
    description: "Engineering secure, conversion-optimized online stores with frictionless checkout flows, inventory sync, and multi-currency support.",
    features: ["Shopify, WooCommerce & custom carts", "One-click checkout optimizations", "Automated abandoned cart recovery", "Payment gateway redundancy"],
    deliverables: ["Turnkey e-commerce storefront", "Payment processor setup", "Product catalog migration", "Tax & shipping automation"],
    order: 9
  },
  {
    id: 10,
    title: "API Development & Integration",
    icon_name: "Network",
    tagline: "Interconnected systems engineered for maximum uptime",
    description: "Designing high-throughput REST and GraphQL APIs with contract-first OpenAPI documentation, rate limiting, and bulletproof security.",
    features: ["RESTful & GraphQL architectures", "Interactive Swagger & Redoc docs", "API key & OAuth2 access control", "Zero-downtime versioning"],
    deliverables: ["Production API deployment", "Interactive API playground", "SDK client snippets", "Load test reports"],
    order: 10
  },
  {
    id: 11,
    title: "Custom Software Solutions",
    icon_name: "Terminal",
    tagline: "Purpose-built software to solve unique operational bottlenecks",
    description: "Developing bespoke desktop utilities, cloud-native backend engines, custom scrapers, and internal tooling crafted specifically for your workflow.",
    features: ["Cross-platform compatibility", "Automated background workers", "Custom ETL data pipelines", "Encrypted local & cloud storage"],
    deliverables: ["Custom compiled software", "Source code repository", "Deployment documentation", "Maintenance SLA"],
    order: 11
  },
  {
    id: 12,
    title: "Digital Consultation",
    icon_name: "Compass",
    tagline: "Actionable strategic technology advisory",
    description: "Providing direct executive technology guidance on architecture decisions, software vendor evaluation, technical debt audits, and digital transformation.",
    features: ["Tech stack feasibility review", "Security & performance audits", "Cloud cost optimization", "System architecture roadmaps"],
    deliverables: ["Comprehensive audit report", "Recommended tech stack blueprint", "Prioritized migration plan", "1-on-1 strategy calls"],
    order: 12
  }
];

export const TECHNOLOGIES = {
  frontend: [
    { name: "React", level: "Expert", desc: "Component architecture & modern hooks", icon: "⚛️" },
    { name: "JavaScript", level: "Advanced", desc: "ES6+, async architecture & Web APIs", icon: "⚡" },
    { name: "Tailwind CSS", level: "Expert", desc: "Design systems & responsive layouts", icon: "🎨" },
    { name: "HTML5 & CSS3", level: "Expert", desc: "Semantic markup & fluid layouts", icon: "🌐" },
    { name: "Angular", level: "Proficient", desc: "Enterprise frontend suites", icon: "🅰️" },
    { name: "Bootstrap", level: "Advanced", desc: "Rapid grid systems & component kits", icon: "🅱️" },
  ],
  backend: [
    { name: "Python", level: "Expert", desc: "Core language, scripting & data pipelines", icon: "🐍" },
    { name: "FastAPI", level: "Expert", desc: "High-performance async REST & OpenAPI", icon: "🚀" },
    { name: "Django", level: "Advanced", desc: "Batteries-included web platforms & ORM", icon: "🎸" },
    { name: "Flask", level: "Advanced", desc: "Lightweight microservices & APIs", icon: "🧪" },
    { name: "Node.js", level: "Advanced", desc: "Event-driven runtime & backend services", icon: "🟢" },
  ],
  database: [
    { name: "PostgreSQL", level: "Expert", desc: "ACID compliance, JSONB & indexing", icon: "🐘" },
    { name: "MySQL", level: "Advanced", desc: "High-volume relational databases", icon: "🐬" },
    { name: "MongoDB", level: "Advanced", desc: "NoSQL document collections & scaling", icon: "🍃" },
    { name: "SQLite", level: "Expert", desc: "Embedded, zero-latency serverless storage", icon: "🗄️" },
  ],
  ai_automation: [
    { name: "OpenAI APIs", level: "Expert", desc: "GPT-4o, function calling & embeddings", icon: "🧠" },
    { name: "Gemini API", level: "Expert", desc: "Multimodal reasoning & high-context AI", icon: "✨" },
    { name: "AI Agents", level: "Advanced", desc: "Autonomous self-orchestrating task agents", icon: "🤖" },
    { name: "n8n", level: "Expert", desc: "Visual self-hosted business automations", icon: "🔄" },
    { name: "Workflow Automation", level: "Expert", desc: "Event-driven triggers & webhooks", icon: "⚙️" },
  ],
  other_devops: [
    { name: "Git & GitHub", level: "Expert", desc: "CI/CD, PR reviews & version control", icon: "🐙" },
    { name: "REST APIs", level: "Expert", desc: "Standardized contract-first endpoint design", icon: "🔌" },
    { name: "Docker", level: "Advanced", desc: "Containerized reproducible deployments", icon: "🐳" },
    { name: "Cloud Deployment", level: "Advanced", desc: "AWS, Vercel, VPS & Linux sysadmin", icon: "☁️" },
  ]
};

export const PROCESS_STEPS = [
  {
    step: "01",
    title: "Discovery & Alignment",
    short: "Uncovering your core advantage",
    description: "We dive deep into your business objectives, target market, competitive landscape, and technical requirements to define clear, measurable targets.",
    points: [
      "Stakeholder interview & technical audit",
      "User persona & customer journey definition",
      "Scope prioritization & milestone mapping"
    ]
  },
  {
    step: "02",
    title: "Strategy & Architecture",
    short: "Engineering the foundation",
    description: "We formulate the complete architectural blueprint: data models, API schemas, design systems, and security protocols tailored for high scale.",
    points: [
      "System architecture & tech stack selection",
      "Database schema & API contract design",
      "Sprint roadmap & milestone calendar"
    ]
  },
  {
    step: "03",
    title: "UI/UX & Interactive Design",
    short: "Crafting the visual soul",
    description: "We create interactive Figma prototypes, bespoke design tokens, fluid micro-interactions, and 3D visual assets with a distinct luxury aesthetic.",
    points: [
      "Wireframing & interaction prototyping",
      "Design system & component libraries",
      "Motion design & 3D visual assets"
    ]
  },
  {
    step: "04",
    title: "Agile Full-Stack Development",
    short: "Writing clean, scalable code",
    description: "We bring the designs to life using modern frameworks, clean code principles, rigorous unit testing, and continuous integration pipelines.",
    points: [
      "Component-driven frontend engineering",
      "Secure backend APIs & AI integration",
      "Weekly staging deployments & demo reviews"
    ]
  },
  {
    step: "05",
    title: "Testing, Audit & Launch",
    short: "Flawless deployment to production",
    description: "We conduct stress testing, security audits, SEO checks, and mobile responsiveness validation before zero-downtime production deployment.",
    points: [
      "Core Web Vitals & speed optimization",
      "Cross-browser & cross-device validation",
      "Domain DNS, SSL & cloud server deployment"
    ]
  },
  {
    step: "06",
    title: "Support, Analytics & Scaling",
    short: "Continuous evolution & growth",
    description: "Post-launch, we monitor real-time telemetry, provide proactive maintenance, update AI workflows, and scale infrastructure alongside your growth.",
    points: [
      "Real-time uptime & error monitoring",
      "Performance optimization & security patches",
      "Ongoing feature iterations & technical advisory"
    ]
  }
];

export const WHY_CHOOSE_US = [
  {
    title: "Personalized Founder Attention",
    desc: "No middlemen or junior account managers. You collaborate directly with Om Makwana and Trushal Parmar from inception to launch.",
    tag: "Direct Communication",
    icon: "Users"
  },
  {
    title: "Modern Cutting-Edge Stack",
    desc: "We build with React 19, FastAPI, Tailwind CSS, Three.js, and autonomous AI pipelines—never outdated legacy templates.",
    tag: "Future-Proof Tech",
    icon: "Code"
  },
  {
    title: "Creative Problem-Solving",
    desc: "We don't just write code; we interrogate business logic to discover innovative digital solutions that differentiate your brand.",
    tag: "Strategic Innovation",
    icon: "Lightbulb"
  },
  {
    title: "Scalable & Resilient Systems",
    desc: "Engineered from day one with modular architectures, caching, and clean APIs ready to handle millions of requests without friction.",
    tag: "Engineered For Growth",
    icon: "TrendingUp"
  },
  {
    title: "Transparent & Honest Communication",
    desc: "Live staging environments, weekly milestone updates, and clear documentation. No tech jargon, no hidden fees.",
    tag: "Radical Transparency",
    icon: "ShieldCheck"
  },
  {
    title: "On-Time, Guaranteed Delivery",
    desc: "We set realistic timelines and adhere to them ruthlessly with sprint-based agile delivery cycles and verified milestones.",
    tag: "Predictable Execution",
    icon: "Clock"
  }
];
