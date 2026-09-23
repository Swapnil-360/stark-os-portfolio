import { HeroConfig, Project, Experience, Education, Service, SkillCategory, SocialLink, SiteSettings, ThemeConfig } from '@/types/portfolio';

export const INITIAL_HERO: HeroConfig = {
  label: "CREATIVE PROFESSIONAL",
  name: "SWAPNIL",
  subtitle: "PRODUCT DESIGNER & BUILDER",
  description: "Turning Real-World Problems into Digital Products | AI, Frontend & Automation | Creator of Edu51Portal | Final year CSE at BUBT",
  ctaPrimaryText: "VIEW WORK",
  ctaPrimaryLink: "#projects",
  ctaSecondaryText: "CONTACT ME",
  ctaSecondaryLink: "#contact",
  portraitUrl: "/images/pfp.png",
  videoUrl: "/videos/bg_video.mp4",
  posterUrl: "/images/bg_static_desktop.jpg",
  mobileFallbackUrl: "/images/bg_static_mobile.jpg",
  staticDesktopBg: "/images/bg_static_desktop.jpg",
  staticMobileBg: "/images/bg_static_mobile.jpg",
  videoEnabled: false,
  videoSpeed: 1.0,
  overlayOpacity: 0.35,
  blurAmount: 0,
  locationLabel: "DHAKA, BANGLADESH",
  statusBadge: "SYS.ONLINE // AVAILABLE FOR HIRE",
  backgroundVideos: [
    {
      id: "vid-default",
      name: "Obsidian Cyber Horizon (Default)",
      url: "/videos/bg_video.mp4",
      poster: "/images/bg_static_desktop.jpg",
    },
  ],
  selectedVideoId: "vid-default",
  resumeUrl: "/resume.pdf",
  mobileVideoUrl: "/videos/bg_video.mp4",
  mobileBackgroundVideos: [
    {
      id: "vid-mobile-default",
      name: "Cyber Horizon Vertical (Default Mobile)",
      url: "/videos/bg_video.mp4",
      poster: "/images/bg_static_mobile.jpg",
      deviceType: "mobile",
    },
  ],
  selectedMobileVideoId: "vid-mobile-default",
};

export const INITIAL_SETTINGS: SiteSettings = {
  title: "Md. Miftahur Rahman Swapnil | Cinematic Command Portfolio",
  description: "Portfolio of Md. Miftahur Rahman Swapnil — Product Designer & Builder | Turning Real-World Problems into Digital Products | AI, Frontend & Automation | Creator of Edu51Portal | Final year CSE at BUBT",
  author: "Md. Miftahur Rahman Swapnil",
  availability: "AVAILABLE FOR HIRE & FREELANCE",
  email: "miftahurr503@gmail.com",
  adminEmail: "miftahurr503@gmail.com",
  whatsapp: "+8801318090383",
  location: "Dhaka, Bangladesh",
  systemVersion: "v4.2.0-STARK",
  buildYear: "2026",
  coordinates: "23.8103° N, 90.4125° E",
  resumeUrl: "/resume.pdf",
};

export const INITIAL_PROJECTS: Project[] = [
  {
    id: "proj-curricurag",
    slug: "curricurag",
    title: "CurricuRAG",
    subtitle: "Relation-Aware Curriculum Knowledge Graph Retrieval & QA (IEEE OMLET 2026)",
    category: "ai",
    categoryLabel: "AI & Knowledge Graphs",
    shortDescription: "Curriculum Knowledge Graph-enhanced RAG system using 2-layer Relational Graph Convolutional Networks (R-GCN) and local LLMs for prerequisite reasoning with zero query-time LLM overhead.",
    fullDescription: "CurricuRAG bridges graph neural network retrieval with locally deployed instruction-tuned LLMs (Qwen2.5-7B-Instruct 4-bit NF4) over a Neo4j-verified curriculum knowledge graph of 418 nodes and 558 typed edges. Accepted with Minor Revision at 2026 IEEE International Conference on Optics, Machine Learning and Emerging Technology (OMLET, Nairobi, Kenya).",
    problem: "Standard dense text RAG and closed-book LLMs struggle with multi-hop prerequisite paths and hallucinate false prerequisites when navigating complex academic curriculum dependencies.",
    solution: "Engineered a 2-layer R-GCN encoder with 384-d Sentence-BERT node embeddings and DistMult decoder to rank prerequisite triples, followed by constrained grounded fact-list generation.",
    role: "Undergraduate Researcher & Core Author",
    status: "Completed",
    heroImage: "/images/projects/opusgen.jpg",
    gallery: [
      "/images/projects/opusgen.jpg",
      "/images/projects/opusgen_real.png"
    ],
    technologies: [
      "PyTorch",
      "Relational GCN",
      "Neo4j",
      "Qwen2.5-7B",
      "Sentence-BERT",
      "Python",
      "IEEE Xplore"
    ],
    githubUrl: "https://github.com/Swapnil-360",
    featured: true,
    displayOrder: 2,
    year: "2026",
    keyFeatures: [
      "418-node, 558-edge curriculum knowledge graph verified in Neo4j",
      "2-layer Relational GCN (R-GCN) with DistMult decoder for relation-aware scoring",
      "Zero query-time LLM retriever calls (high throughput, no LLM fine-tuning needed)",
      "45.5% exact-set match vs 22.7% text-RAG and 12.7% closed-book LLM",
      "100% correct abstention rate (24/24) on unanswerable questions",
      "Accepted at 2026 IEEE OMLET (Nairobi, Kenya; Paper ID: 1017)"
    ],
    challenges: "Preventing knowledge leakage across cross-validation splits and ensuring deterministic grounding to eliminate hallucination.",
    outcome: "Achieved 37.7% structural generalization on unseen triples (vs 3%-5% baselines) and secured IEEE international conference acceptance.",
  },
  {
    id: "proj-1",
    slug: "opusgen-ai",
    title: "OpusGen AI",
    subtitle: "Next-Gen AI Visual Generation Platform for Product Marketing",
    category: "ai",
    categoryLabel: "AI & Creative Suite",
    shortDescription: "High-performance AI creative suite empowering e-commerce brands with automated studio photography, background replacement, upscaling, and marketing asset generation.",
    fullDescription: "OpusGen AI provides end-to-end generative media workflows for modern e-commerce stores, creative agencies, and digital creators. It replaces expensive studio photoshoots with algorithmic lighting, intelligent composition, and one-click marketing exports.",
    problem: "Professional product photography costs thousands of dollars per shoot, requires elaborate lighting hardware, and takes weeks to retouch for multi-channel ad campaigns.",
    solution: "Built a generative design workflow featuring automated background replacement, 4x neural upscaling, smart uncrop, batch asset exports, and automated caption generation.",
    role: "Frontend Engineer & UI/UX Contributor",
    status: "Live",
    heroImage: "/images/projects/opusgen.jpg",
    gallery: [
      "/images/projects/opusgen.jpg",
      "/images/projects/opusgen_real.png"
    ],
    technologies: ["Next.js", "TypeScript", "Tailwind CSS", "AI Diffusion Models", "REST APIs", "Vercel"],
    liveUrl: "https://www.opusgenai.com/",
    githubUrl: "https://github.com/Swapnil-360/OpusGenAi.git",
    featured: true,
    displayOrder: 1,
    year: "2024 — Present",
    keyFeatures: [
      "AI product photography with studio-grade shadow generation",
      "4x neural super-resolution and background cleanup",
      "Smart uncrop & canvas expansion for multi-ratio social ads",
      "Automated social captions and targeted e-commerce hashtag generator",
      "Batch processing pipeline for high-volume merchant catalogs (Branch: master)"
    ],
    challenges: "Creating a seamless web interface for asynchronous AI model inferencing with fluid real-time progress indicators.",
    outcome: "Allowed merchants to generate ad-ready visual assets in under 30 seconds."
  },
  {
    id: "proj-2",
    slug: "edu51five",
    title: "Edu51Five",
    subtitle: "Academic Management & Routine Hub for BUBT Intake 51 (Main Branch)",
    category: "web",
    categoryLabel: "Academic Web Platform",
    shortDescription: "Specialized academic portal built specifically for BUBT Intake 51 students, delivering instant access to class routines, exam schedules, course materials, and announcements.",
    fullDescription: "Edu51Five is the intake-focused flagship edition of the academic portal platform engineered specifically for Bangladesh University of Business and Technology (BUBT) Intake 51 cohorts (main branch). It provides a high-performance, mobile-responsive hub where students can track daily class schedules, download lecture handouts, find faculty contact references, and access exam routines without searching through scattered social messaging groups.",
    problem: "BUBT Intake 51 students had no centralized, fast system for accessing daily routines, classroom updates, and semester materials across different sections, leading to confusion and missed deadlines.",
    solution: "Engineered a lightweight, blazing fast web app with section-specific routine views, instant fuzzy search for course notes, and mobile-first responsiveness.",
    role: "Lead Frontend Developer & Project Architect",
    status: "Live",
    heroImage: "/images/projects/edu51_real.jpeg",
    gallery: [
      "/images/projects/edu51_real.jpeg",
      "/images/projects/edu51_real.png",
      "/images/projects/edu51.jpg"
    ],
    technologies: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Vercel", "Git (main branch)"],
    liveUrl: "https://edu51portal.live/",
    githubUrl: "https://github.com/Swapnil-360/Edu51Portal.git",
    featured: true,
    displayOrder: 2,
    year: "2024 — Present",
    keyFeatures: [
      "Main Branch: Intake 51 dedicated academic community & routine portal",
      "Dynamic class routine & exam schedule viewer with real-time section updates",
      "Instant fuzzy search across Intake 51 lecture notes and faculty PDF references",
      "Mobile-optimized responsive view for fast on-campus access"
    ],
    challenges: "Handling real-time routine revisions and ensuring zero-downtime during high-traffic final exam weeks.",
    outcome: "Adopted by hundreds of BUBT Intake 51 students daily, reducing routine query times and eliminating missed exam notices."
  },
  {
    id: "proj-2-dept",
    slug: "edu51portal-bubt",
    title: "Edu51Portal (BUBT Full Dept Version)",
    subtitle: "Comprehensive University-Wide CSE Department Platform for BUBT (Full-Version Branch)",
    category: "web",
    categoryLabel: "Department Web System",
    shortDescription: "Expanded university department portal supporting the entire BUBT CSE department across all intakes, semesters, syllabus archives, and academic faculty resources.",
    fullDescription: "Edu51Portal (Full Department Version) is the university-scale evolution of the platform developed in the full-version branch for Bangladesh University of Business and Technology (BUBT). It scales beyond a single intake to encompass the entire Computer Science and Engineering department, supporting multi-intake curriculum navigation, department-wide syllabus archives, semester course roadmaps, faculty directory, and centralized notice boards.",
    problem: "Scaling from a single intake to an entire university department requires organizing multi-semester curriculums, multi-intake course codes, prerequisite trees, and faculty directories across thousands of students.",
    solution: "Architected an expansive multi-intake departmental system with hierarchical course navigation, department notice broadcasts, syllabi repositories, and fast search.",
    role: "Lead System Architect & Frontend Engineer",
    status: "Live",
    heroImage: "/images/projects/edu51_bubt_real.png",
    gallery: [
      "/images/projects/edu51_bubt_real.png",
      "/images/projects/edu51.jpg"
    ],
    technologies: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Vercel", "Git (full-version branch)"],
    liveUrl: "https://bubt.edu51portal.live/",
    secondaryLiveUrl: "https://edu51portal.live/",
    secondaryLiveLabel: "Intake 51 Portal",
    githubUrl: "https://github.com/Swapnil-360/Edu51Portal/tree/full-version",
    featured: true,
    displayOrder: 3,
    year: "2024 — Present",
    keyFeatures: [
      "Full-Version Branch: Department-wide BUBT portal with multi-batch syllabi",
      "Live deployment at bubt.edu51portal.live for department-wide academic access",
      "Multi-intake BUBT CSE syllabus archives and course curriculum maps",
      "Faculty reference directory and university academic calendar integration",
      "Comprehensive semester routine distributions across all BUBT intakes"
    ],
    challenges: "Structuring intuitive information architecture that handles dozens of course codes and intake-specific syllabi without clutter.",
    outcome: "Successfully provided a unified department portal for BUBT CSE students and faculty."
  },
  {
    id: "proj-3",
    slug: "portfolio-for-prince",
    title: "Prince - Digital Marketing & Web Expert Portfolio",
    subtitle: "High-Conversion Client Portfolio & Personal Branding Platform",
    category: "web",
    categoryLabel: "Client Web Experience",
    shortDescription: "Prince Varman - Expert in crypto project support, digital marketing, web development, and creative design. Professional bespoke client portfolio engineered with high-conversion visual design.",
    fullDescription: "Prince Varman - Expert in crypto project support, digital marketing, web development, and creative design. Professional portfolio showcasing premium services, marketing funnels, and successful client projects. Engineered with precision micro-interactions, responsive typography, and blazing fast performance to drive client conversions.",
    role: "Full-Stack Frontend Developer & Designer",
    status: "Live",
    heroImage: "/images/projects/prince.jpg",
    gallery: [
      "/images/projects/prince.jpg",
      "/images/projects/prince_real.png"
    ],
    technologies: ["React", "JavaScript", "Tailwind CSS", "Web Development", "Crypto Marketing"],
    liveUrl: "https://www.sbprince.com/",
    githubUrl: "https://github.com/Swapnil-360/Myself_Prince.git",
    featured: true,
    displayOrder: 4,
    year: "2026",
    keyFeatures: [
      "Custom client commission tailored for personal branding (Myself Prince)",
      "Dedicated showcase of crypto project support, marketing & creative design",
      "Fluid page transitions with custom spring physics",
      "Interactive case study galleries with modal overlays",
      "Mobile-first responsive architecture with 98+ Lighthouse scores"
    ],
    outcome: "Significantly amplified client personal branding and client lead generation."
  },
  {
    id: "proj-4",
    slug: "pawfect-match",
    title: "PawfectMatch",
    subtitle: "Pet Adoption & Animal Welfare Community Platform (Varsity Project)",
    category: "mobile",
    categoryLabel: "Mobile Application",
    shortDescription: "Cross-platform mobile application facilitating compassionate pet adoptions, shelter connections, and pet rescue networks built as a university project.",
    fullDescription: "Pawfect Match bridges the gap between animal rescue centers and prospective adopters. Built as a university project in React Native, it features pet profiles, medical history tracking, adoption application management, and community rescue broadcasts.",
    role: "Frontend & Mobile App Developer",
    status: "Completed",
    heroImage: "/images/projects/pawfect.jpg",
    gallery: [
      "/images/projects/pawfect.jpg",
      "/images/projects/pawfect_gh_real.png"
    ],
    technologies: ["React Native", "Firebase", "Figma", "Redux", "REST APIs"],
    githubUrl: "https://github.com/PawfectMatch2-0/PawMatch.git",
    featured: false,
    displayOrder: 5,
    year: "2024",
    keyFeatures: [
      "University semester engineering project built in React Native (Branch: main)",
      "Swipeable pet discovery cards with temperament and health filters",
      "Real-time adoption request tracking and rescue center messaging",
      "Shelter verification and emergency animal rescue broadcast alerts"
    ],
    outcome: "Streamlined the adoption process and eliminated paper-based verification delays."
  },
  {
    id: "proj-5",
    slug: "mutebd",
    title: "MuteBD",
    subtitle: "Accessibility Platform for the Hearing-Impaired (Practicing Kotlin Project)",
    category: "mobile",
    categoryLabel: "Android Kotlin App",
    shortDescription: "Native Android accessibility application built while practicing Kotlin, designed to empower hearing-impaired citizens across Bangladesh.",
    fullDescription: "An accessibility-centric initiative engineered in Kotlin to eliminate daily communication barriers for the hearing-impaired community in Bangladesh through visual cues, sign references, and accessible interaction paradigms.",
    role: "Android Developer (Kotlin)",
    status: "Completed",
    heroImage: "/images/projects/mutebd.jpg",
    gallery: [
      "/images/projects/mutebd.jpg",
      "/images/projects/mutebd_gh_real.png"
    ],
    technologies: ["Kotlin", "Android SDK", "Accessibility APIs", "XML/Layouts", "Mobile UI"],
    githubUrl: "https://github.com/Swapnil-360/MuteBD.git",
    featured: false,
    displayOrder: 6,
    year: "2023",
    keyFeatures: [
      "Native Android implementation built while practicing Kotlin (Branch: main)",
      "Visual emergency dispatch cues",
      "Bangla sign language quick phrase references",
      "High-contrast tactile interface designed for quick one-hand usage"
    ],
    outcome: "Deepened native Android development proficiency and presented as an accessibility initiative."
  },
  {
    id: "proj-6",
    slug: "3d-escape-room-game",
    title: "3D Escape Room Game",
    subtitle: "Computer Graphics Varsity Project Game in C & OpenGL",
    category: "game",
    categoryLabel: "Computer Graphics in C",
    shortDescription: "Interactive 3D puzzle and room escape game engineered from foundational graphics principles in pure C using OpenGL libraries.",
    fullDescription: "A 3D escape room game engineered as a Computer Graphics varsity course project at BUBT. Built in pure C with OpenGL, it demonstrates real-time 3D coordinate transformations, first-person camera mathematics, lighting models, and room escape interaction logic.",
    problem: "Developing 3D interactive environments without commercial game engines requires manual coordinate calculations, projection transformations, and real-time graphics pipelines directly in C.",
    solution: "Architected a custom OpenGL graphics loop featuring first-person camera navigation, Phong reflection illumination, spatial geometry, and puzzle trigger mechanisms.",
    role: "Graphics Programmer & Core Developer",
    status: "Completed",
    heroImage: "/images/projects/escaperoom.jpg",
    gallery: [
      "/images/projects/escaperoom.jpg",
      "/images/projects/escaperoom_gh_real.png"
    ],
    technologies: ["C", "OpenGL", "FreeGLUT", "Computer Graphics", "3D Mathematics", "Linear Algebra"],
    githubUrl: "https://github.com/3D-Escape-Room-Game/3D-Escape-Room-Game-v1-.git",
    featured: false,
    displayOrder: 7,
    year: "2024",
    keyFeatures: [
      "Varsity computer graphics project engineered in C and OpenGL (Branch: master)",
      "Custom first-person 3D camera controller with smooth pitch/yaw navigation",
      "Phong illumination pipeline (ambient, diffuse, specular lighting)",
      "Interactive room puzzle triggers, collectible clues, and exit lock logic",
      "Real-time polygon rendering loop optimized for 60 FPS performance"
    ],
    challenges: "Implementing first-person 3D camera navigation and mathematical perspective projections without third-party game frameworks.",
    outcome: "Achieved top academic marks in BUBT Computer Graphics for technical implementation, playable puzzles, and fluid 3D mechanics."
  }
];

export const INITIAL_SERVICES: Service[] = [
  {
    id: "srv-1",
    number: "01",
    title: "Web Development",
    description: "Architecting high-speed, dynamic web applications with Next.js, React, TypeScript, and modern component systems.",
    icon: "Globe",
    tags: ["Next.js", "React", "TypeScript", "Tailwind CSS"]
  },
  {
    id: "srv-2",
    number: "02",
    title: "App Development",
    description: "Cross-platform mobile interfaces built with React Native, focusing on fluid touch mechanics and native responsiveness.",
    icon: "Smartphone",
    tags: ["React Native", "Mobile UI", "Cross-Platform"]
  },
  {
    id: "srv-3",
    number: "03",
    title: "UI / UX Design",
    description: "Human-centered user experience design, wireframing, interactive prototyping, and design systems crafted in Figma.",
    icon: "Layout",
    tags: ["Figma", "Design Systems", "Prototyping", "Wireframing"]
  },
  {
    id: "srv-4",
    number: "04",
    title: "Creative Design",
    description: "Distinctive brand identities, promotional banners, event visuals, and digital creative assets in Photoshop & Figma.",
    icon: "Palette",
    tags: ["Photoshop", "Branding", "Visual Identity", "Canva"]
  },
  {
    id: "srv-5",
    number: "05",
    title: "Video & Motion",
    description: "Cinematic promotional edits, motion graphics, and social teasers produced with CapCut Pro and Premiere Pro.",
    icon: "Film",
    tags: ["CapCut Pro", "Premiere Pro", "Color Grading", "Motion"]
  },
  {
    id: "srv-6",
    number: "06",
    title: "Digital Product Development",
    description: "End-to-end product engineering from concept and database design to cloud deployment and user iteration.",
    icon: "Layers",
    tags: ["Full-Cycle", "Vercel", "APIs", "Cloud Deployment"]
  },
  {
    id: "srv-7",
    number: "07",
    title: "Community & Social Management",
    description: "Engaging technical audiences, coordinating university tech clubs, and managing social media strategy.",
    icon: "Users",
    tags: ["BUBT Tech Club", "Campaigns", "Engagement"]
  },
  {
    id: "srv-8",
    number: "08",
    title: "Crypto Project Support",
    description: "Web3 landing interfaces, token dashboard frontends, and crypto community technical moderation.",
    icon: "Coins",
    tags: ["Web3 UI", "Community Support", "Fintech"]
  }
];

export const INITIAL_SKILL_CATEGORIES: SkillCategory[] = [
  {
    category: "Frontend & Core",
    skills: [
      { name: "React.js", highlight: true },
      { name: "Next.js", highlight: true },
      { name: "TypeScript", highlight: true },
      { name: "Tailwind CSS", highlight: true },
      { name: "Framer Motion", highlight: true },
      { name: "HTML5 / Modern CSS", highlight: false },
      { name: "JavaScript (ES6+)", highlight: false }
    ]
  },
  {
    category: "Backend & Platform",
    skills: [
      { name: "Supabase", highlight: true },
      { name: "Firebase", highlight: false },
      { name: "REST APIs", highlight: true },
      { name: "Authentication (OAuth)", highlight: false },
      { name: "PostgreSQL / MySQL", highlight: false },
      { name: "Vercel / Netlify", highlight: true }
    ]
  },
  {
    category: "AI & Developer Tools",
    skills: [
      { name: "Cursor IDE", highlight: true },
      { name: "Claude AI", highlight: true },
      { name: "VS Code", highlight: false },
      { name: "Git & GitHub", highlight: true },
      { name: "npm / Postman", highlight: false }
    ]
  },
  {
    category: "Design & Motion",
    skills: [
      { name: "Figma", highlight: true },
      { name: "Adobe Photoshop", highlight: false },
      { name: "CapCut Pro", highlight: true },
      { name: "Adobe Premiere Pro", highlight: false },
      { name: "Canva Pro", highlight: false },
      { name: "UI/UX Prototyping", highlight: true }
    ]
  }
];

export const INITIAL_EXPERIENCES: Experience[] = [
  {
    id: "exp-1",
    role: "AI-Powered Development & Creative Technologist",
    organization: "Independent Consultant / Freelance",
    period: "2023 — Present",
    startDate: "2023",
    endDate: "Present",
    description: "Building modern high-performance web applications using Claude and Cursor for rapid smart engineering. Deploying scalable apps to Vercel and Netlify while upholding rigorous UI/UX standards.",
    responsibilities: [
      "Developing bespoke responsive websites and interactive web applications",
      "Employing AI-accelerated workflows to decrease prototype-to-production turnaround by 60%",
      "Integrating Supabase and modern serverless backends with secure authentication"
    ],
    technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Figma", "Claude", "Cursor"],
    isCurrent: true,
    badge: "Active Command"
  },
  {
    id: "exp-2",
    role: "Lead Frontend Developer",
    organization: "Edu51Portal / Edu51Five Project",
    period: "2024 — Present",
    startDate: "2024",
    endDate: "Present",
    description: "Directing the frontend architecture and deployment pipeline for the premier BUBT academic resource portal serving undergraduate engineering cohorts.",
    responsibilities: [
      "Spearheading Next.js frontend engineering and modular UI component development",
      "Orchestrating Git workflows, code reviews, and automated Vercel deployments",
      "Managing routine databases and student feedback iterations"
    ],
    technologies: ["React", "Next.js", "TypeScript", "Vercel", "Tailwind"],
    isCurrent: true,
    badge: "Core Project"
  },
  {
    id: "exp-3",
    role: "Frontend & UI/UX Developer",
    organization: "Pawfect Match Initiative",
    period: "2024 — Present",
    startDate: "2024",
    endDate: "Present",
    description: "Designed and implemented mobile interfaces for a nationwide pet rescue and adoption platform connecting animal lovers with rescue shelters.",
    responsibilities: [
      "Crafted mobile wireframes and interactive prototypes in Figma",
      "Developed cross-platform client components with React Native",
      "Integrated real-time Firebase datastores for instantaneous listing updates"
    ],
    technologies: ["React Native", "Figma", "Firebase", "Mobile UI"],
    isCurrent: true
  },
  {
    id: "exp-4",
    role: "Creative Designer & Motion Creator",
    organization: "BUBT Tech & CSE Clubs",
    period: "2022 — Present",
    startDate: "2022",
    endDate: "Present",
    description: "Spearheaded digital promotional visuals, event branding, hackathon promo reels, and social media campaigns for university tech organizations.",
    responsibilities: [
      "Designed event banners, social media collaterals, and digital posters in Figma and Photoshop",
      "Produced fast-paced promotional teasers and event highlight reels in CapCut Pro and Premiere Pro",
      "Elevated club visual identity and attendee engagement across campus tech summits"
    ],
    technologies: ["Figma", "Photoshop", "CapCut Pro", "Premiere Pro"],
    isCurrent: true
  }
];

export const INITIAL_EDUCATION: Education = {
  id: "edu-1",
  degree: "BSc in Computer Science & Engineering",
  institution: "Bangladesh University of Business and Technology (BUBT)",
  period: "2022 — 2026 (Expected)",
  location: "Dhaka, Bangladesh",
  description: "Pursuing rigorous computer science foundations with specialized focus on Human-Computer Interaction, Web Technologies, Database Systems, and Intelligent Architectures.",
  coursework: [
    "Data Structures & Algorithms",
    "Web Technologies",
    "Database Management Systems (DBMS)",
    "Software Engineering",
    "Artificial Intelligence",
    "Human-Computer Interaction (HCI)",
    "Computer Networks"
  ],
  researchInterests: [
    {
      title: "CurricuRAG: Curriculum Knowledge-Graph Enhanced RAG",
      description: "Relation-aware graph retrieval with 2-layer R-GCN and local LLM grounding for university curriculum prerequisite question answering (Accepted at IEEE OMLET 2026).",
      icon: "Network",
    },
    {
      title: "Design Systems & Component Architecture",
      description: "Engineering scalable, resilient, and accessible UI component libraries for modern distributed web applications.",
      icon: "Layers"
    },
    {
      title: "ESP32-Based Automation for Smart Classrooms",
      description: "Developing responsive IoT hardware-software systems to automate classroom utilities and academic attendance tracking.",
      icon: "Cpu"
    },
    {
      title: "EEG-Based Motor Imagery Classification",
      description: "Investigating deep learning architectures for assistive neuro-rehabilitation and paralysis motor control interfaces.",
      icon: "Brain"
    }
  ]
};

export const INITIAL_SOCIAL_LINKS: SocialLink[] = [
  {
    id: "soc-email",
    platform: "Email",
    url: "https://mail.google.com/mail/?view=cm&fs=1&to=miftahurr503@gmail.com",
    icon: "Mail",
    label: "Open Gmail Inbox",
    highlight: true
  },
  {
    id: "soc-linkedin",
    platform: "LinkedIn",
    url: "https://www.linkedin.com/in/mr-swapnil/",
    icon: "Linkedin",
    label: "linkedin.com/in/mr-swapnil",
    highlight: true
  },
  {
    id: "soc-github",
    platform: "GitHub",
    url: "https://github.com/Swapnil-360",
    icon: "Github",
    label: "github.com/Swapnil-360",
    highlight: true
  },
  {
    id: "soc-whatsapp",
    platform: "WhatsApp",
    url: "https://wa.me/8801318090383",
    icon: "MessageSquare",
    label: "Open WhatsApp Inbox",
    highlight: true
  },
  {
    id: "soc-x",
    platform: "X (Twitter)",
    url: "https://x.com/thomascryptoxx",
    icon: "Twitter",
    label: "@thomascryptoxx"
  },
  {
    id: "soc-telegram",
    platform: "Telegram",
    url: "https://t.me/swapnil360",
    icon: "Send",
    label: "@swapnil360"
  },
  {
    id: "soc-facebook",
    platform: "Facebook",
    url: "https://www.facebook.com/mr.swapnil360/",
    icon: "Facebook",
    label: "fb.com/mr.swapnil360"
  },
  {
    id: "soc-instagram",
    platform: "Instagram",
    url: "https://www.instagram.com/callmeswap/",
    icon: "Instagram",
    label: "@callmeswap"
  }
];

export const THEME_PRESETS: ThemeConfig[] = [
  {
    id: "obsidian-red",
    name: "Obsidian Red",
    subtitle: "Deep Graphite / Crimson Glow",
    accent: "#ff1e38",
    accentHover: "#ff3a50",
    accentGlow: "rgba(255, 30, 56, 0.55)",
    accentSecondary: "#ff6b7e",
    accentSubtle: "rgba(255, 30, 56, 0.12)",
    background: "#070709",
    surface: "#0e0f14",
    surfaceElevated: "#151720",
    surfaceGlass: "rgba(14, 15, 20, 0.85)",
    foreground: "#f8fafc",
    muted: "#94a3b8",
    borderHud: "rgba(255, 30, 56, 0.22)",
    borderHudBright: "rgba(255, 30, 56, 0.65)",
    gridHud: "rgba(255, 30, 56, 0.05)"
  },
  {
    id: "arctic",
    name: "Arctic Command",
    subtitle: "Deep Navy / Icy Cyan-Blue",
    accent: "#00d2ff",
    accentHover: "#38bdf8",
    accentGlow: "rgba(0, 210, 255, 0.55)",
    accentSecondary: "#7dd3fc",
    accentSubtle: "rgba(0, 210, 255, 0.12)",
    background: "#050a12",
    surface: "#091322",
    surfaceElevated: "#0f1f38",
    surfaceGlass: "rgba(9, 19, 34, 0.85)",
    foreground: "#f0f9ff",
    muted: "#94a3b8",
    borderHud: "rgba(0, 210, 255, 0.22)",
    borderHudBright: "rgba(0, 210, 255, 0.65)",
    gridHud: "rgba(0, 210, 255, 0.05)"
  },
  {
    id: "stealth",
    name: "Stealth Protocol",
    subtitle: "Titanium Silver / Precision Red",
    accent: "#e2e8f0",
    accentHover: "#ffffff",
    accentGlow: "rgba(226, 232, 240, 0.4)",
    accentSecondary: "#ff2a44",
    accentSubtle: "rgba(226, 232, 240, 0.1)",
    background: "#08080a",
    surface: "#101014",
    surfaceElevated: "#18181f",
    surfaceGlass: "rgba(16, 16, 20, 0.85)",
    foreground: "#f8fafc",
    muted: "#64748b",
    borderHud: "rgba(255, 255, 255, 0.14)",
    borderHudBright: "rgba(255, 42, 68, 0.7)",
    gridHud: "rgba(255, 255, 255, 0.03)"
  },
  {
    id: "void",
    name: "Void Spectrum",
    subtitle: "Cosmic Dark / Electric Magenta",
    accent: "#c026d3",
    accentHover: "#d946ef",
    accentGlow: "rgba(192, 38, 211, 0.55)",
    accentSecondary: "#f472b6",
    accentSubtle: "rgba(192, 38, 211, 0.12)",
    background: "#0a0612",
    surface: "#140c24",
    surfaceElevated: "#1f1338",
    surfaceGlass: "rgba(20, 12, 36, 0.85)",
    foreground: "#faf5ff",
    muted: "#a8a29e",
    borderHud: "rgba(192, 38, 211, 0.25)",
    borderHudBright: "rgba(192, 38, 211, 0.7)",
    gridHud: "rgba(192, 38, 211, 0.05)"
  },
  {
    id: "monochrome",
    name: "Monochrome Ops",
    subtitle: "Carbon Dark / Pure White",
    accent: "#f8fafc",
    accentHover: "#e2e8f0",
    accentGlow: "rgba(248, 250, 252, 0.45)",
    accentSecondary: "#94a3b8",
    accentSubtle: "rgba(248, 250, 252, 0.1)",
    background: "#090909",
    surface: "#141414",
    surfaceElevated: "#1e1e1e",
    surfaceGlass: "rgba(20, 20, 20, 0.85)",
    foreground: "#ffffff",
    muted: "#71717a",
    borderHud: "rgba(255, 255, 255, 0.15)",
    borderHudBright: "rgba(255, 255, 255, 0.6)",
    gridHud: "rgba(255, 255, 255, 0.04)"
  }
];
