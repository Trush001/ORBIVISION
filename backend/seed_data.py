import db_manager
from auth import hash_password, verify_password
import config

FOUNDERS = [
    {
        "name": "Om Makwana",
        "role": "Co-founder | Digital Solutions & Development",
        "short_role": "Digital Solutions & Frontend Architecture",
        "phone": "+91 9426231338",
        "raw_phone": "919426231338",
        "email": "826458om@gmail.com",
        "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
        "bio": "Specializing in intuitive high-conversion web architectures, modern interactive frontend engineering, and bespoke digital solutions designed to elevate brand authority.",
        "skills": ["Web Design & Dev", "Full-Stack Web", "React & Modern JS", "UI/UX Systems", "Three.js / GSAP", "Responsive Tech"],
        "linkedin": "https://linkedin.com",
        "github": "https://github.com",
        "whatsapp": "https://wa.me/919426231338?text=Hello%20Om,%20I'm%20interested%20in%20working%20with%20ORBIVISION%20on%20a%20digital%20project."
    },
    {
        "name": "Trushal Parmar",
        "role": "Co-founder | AI, Backend & Full-Stack Development",
        "short_role": "AI Automation, Backend & Systems",
        "phone": "+91 8733070464",
        "raw_phone": "918733070464",
        "email": "trushalmparmar96@gmail.com",
        "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
        "bio": "Pioneering intelligent AI automation pipelines, robust backend microservices, resilient enterprise APIs, and custom software systems built for scale and reliability.",
        "skills": ["AI Integration", "Python / FastAPI", "Workflow Automation", "API Engineering", "Cloud & Docker", "Database Design"],
        "linkedin": "https://linkedin.com",
        "github": "https://github.com",
        "whatsapp": "https://wa.me/918733070464?text=Hello%20Trushal,%20I'd%20like%20to%20consult%20ORBIVISION%20regarding%20AI%20automation%20and%20backend%20solutions."
    }
]

SERVICES = [
    {
        "title": "Website Design & Development",
        "icon_name": "Globe",
        "tagline": "Stunning, high-conversion digital flagships",
        "description": "Crafting bespoke, visually arresting websites engineered for speed, SEO excellence, and flawless user journeys across every device.",
        "features": ["Pixel-perfect dark/light themes", "Ultra-fast load times (<0.8s)", "SEO & Core Web Vitals optimization", "Interactive micro-animations"],
        "deliverables": ["Custom responsive website", "Content management setup", "Analytics integration", "Speed audit & SSL"],
        "order": 1
    },
    {
        "title": "Full-Stack Web Development",
        "icon_name": "Layers",
        "tagline": "Scalable end-to-end architectures",
        "description": "Building powerful web applications with resilient backends, fluid interactive frontends, and hardened security protocols.",
        "features": ["React, Vue, or Angular frontends", "FastAPI / Node.js backends", "RESTful & GraphQL APIs", "Relational & NoSQL database schemas"],
        "deliverables": ["Full codebase repository", "Automated deployment pipeline", "API documentation", "Architecture blueprint"],
        "order": 2
    },
    {
        "title": "Custom Web Applications",
        "icon_name": "Monitor",
        "tagline": "Tailored SaaS and enterprise platforms",
        "description": "Delivering bespoke web portals, client portals, SaaS platforms, and internal tools tailored to streamline operational complexity.",
        "features": ["Multi-tenant authentication", "Role-based access control (RBAC)", "Real-time updates via WebSockets", "Comprehensive telemetry dashboards"],
        "deliverables": ["Complete SaaS application", "Admin management dashboard", "Payment gateway integration", "Cloud deployment"],
        "order": 3
    },
    {
        "title": "Android & iOS App Development",
        "icon_name": "Smartphone",
        "tagline": "Fluid native and cross-platform apps",
        "description": "Developing high-performance mobile applications that users love, featuring smooth native gestures, offline support, and biometric security.",
        "features": ["React Native & Flutter", "iOS App Store & Google Play compliance", "Push notification engines", "Offline data synchronization"],
        "deliverables": ["iOS & Android binaries", "App Store submission assistance", "Backend mobile API", "Maintenance plan"],
        "order": 4
    },
    {
        "title": "AI Automation & AI Integration",
        "icon_name": "Cpu",
        "tagline": "Supercharge your business with autonomous intelligence",
        "description": "Integrating state-of-the-art LLMs (OpenAI, Gemini, Anthropic), custom autonomous AI agents, and intelligent document processors into your workflows.",
        "features": ["Fine-tuned LLM assistants", "Retrieval-Augmented Generation (RAG)", "Smart customer support bots", "Predictive data models"],
        "deliverables": ["Operational AI agents", "Custom vector database setup", "API keys & privacy compliance", "Staff training workshop"],
        "order": 5
    },
    {
        "title": "Business Process Automation",
        "icon_name": "Zap",
        "tagline": "Eliminate repetitive tasks and human error",
        "description": "Connecting your disparate software tools with automated pipelines using n8n, Make, custom webhooks, and Python background workers.",
        "features": ["n8n & Zapier workflow setups", "Automated invoice & lead routing", "CRM & ERP synchronization", "Error recovery alerting"],
        "deliverables": ["Configured automation workflows", "Monitoring dashboard", "Fail-safe backup rules", "Operational playbook"],
        "order": 6
    },
    {
        "title": "UI/UX Design",
        "icon_name": "Palette",
        "tagline": "Intuitive, engaging, human-centric interfaces",
        "description": "Transforming complex workflows into elegant, intuitive digital interfaces through rigorous user research, wireframing, and interactive prototyping.",
        "features": ["Figma component design systems", "Interactive micro-interactions", "High-fidelity clickable prototypes", "Usability testing & heatmaps"],
        "deliverables": ["Comprehensive Figma design system", "UI component library", "Developer handoff specs", "User flow diagrams"],
        "order": 7
    },
    {
        "title": "Graphic Design & Branding",
        "icon_name": "Sparkles",
        "tagline": "Memorable visual identities that demand attention",
        "description": "Forging distinct brand personas with timeless logos, typography guidelines, cyber-modern design elements, and marketing collateral.",
        "features": ["Vector logo systems", "Complete typography pairings", "Brand voice & style guide", "Social media design kits"],
        "deliverables": ["Full vector brand identity kit", "Brand book PDF", "Iconography library", "Social asset templates"],
        "order": 8
    },
    {
        "title": "E-commerce Website Development",
        "icon_name": "ShoppingBag",
        "tagline": "High-converting online storefronts",
        "description": "Engineering secure, conversion-optimized online stores with frictionless checkout flows, inventory sync, and multi-currency support.",
        "features": ["Shopify, WooCommerce & custom carts", "One-click checkout optimizations", "Automated abandoned cart recovery", "Payment gateway redundancy"],
        "deliverables": ["Turnkey e-commerce storefront", "Payment processor setup", "Product catalog migration", "Tax & shipping automation"],
        "order": 9
    },
    {
        "title": "API Development & Integration",
        "icon_name": "Network",
        "tagline": "Interconnected systems engineered for maximum uptime",
        "description": "Designing high-throughput REST and GraphQL APIs with contract-first OpenAPI documentation, rate limiting, and bulletproof security.",
        "features": ["RESTful & GraphQL architectures", "Interactive Swagger & Redoc docs", "API key & OAuth2 access control", "Zero-downtime versioning"],
        "deliverables": ["Production API deployment", "Interactive API playground", "SDK client snippets", "Load test reports"],
        "order": 10
    },
    {
        "title": "Custom Software Solutions",
        "icon_name": "Terminal",
        "tagline": "Purpose-built software to solve unique operational bottlenecks",
        "description": "Developing bespoke desktop utilities, cloud-native backend engines, custom scrapers, and internal tooling crafted specifically for your workflow.",
        "features": ["Cross-platform compatibility", "Automated background workers", "Custom ETL data pipelines", "Encrypted local & cloud storage"],
        "deliverables": ["Custom compiled software", "Source code repository", "Deployment documentation", "Maintenance SLA"],
        "order": 11
    },
    {
        "title": "Digital Consultation",
        "icon_name": "Compass",
        "tagline": "Actionable strategic technology advisory",
        "description": "Providing direct executive technology guidance on architecture decisions, software vendor evaluation, technical debt audits, and digital transformation.",
        "features": ["Tech stack feasibility review", "Security & performance audits", "Cloud cost optimization", "System architecture roadmaps"],
        "deliverables": ["Comprehensive audit report", "Recommended tech stack blueprint", "Prioritized migration plan", "1-on-1 strategy calls"],
        "order": 12
    }
]

def seed_database():
    """Seed initial admin and service catalog if not already populated."""
    db_manager.init_db()

    # Check or seed admin
    admin = db_manager.get_admin_by_username_or_email(config.INITIAL_ADMIN_USERNAME)
    if not admin:
        db_manager.insert_admin({
            "username": config.INITIAL_ADMIN_USERNAME,
            "email": config.INITIAL_ADMIN_EMAIL,
            "password_hash": hash_password(config.INITIAL_ADMIN_PASSWORD),
            "role": "superadmin"
        })
    else:
        # Check if existing admin needs password migration from legacy SHA256 to bcrypt
        is_valid, needs_rehash = verify_password(config.INITIAL_ADMIN_PASSWORD, admin["password_hash"])
        if needs_rehash:
            new_hash = hash_password(config.INITIAL_ADMIN_PASSWORD)
            db_manager.update_admin_password_hash(admin["id"], new_hash)

    # Check or seed services
    services = db_manager.get_services()
    if len(services) == 0:
        for s in SERVICES:
            db_manager.insert_service(s)
