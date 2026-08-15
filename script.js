document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const header = document.getElementById('header');
  const scrollProgress = document.getElementById('scroll-progress');
  const mouseGlow = document.getElementById('mouse-glow');
  const navToggle = document.getElementById('nav-toggle');
  const navMenuWrapper = document.getElementById('nav-menu-wrapper');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  const fadeElements = document.querySelectorAll('.fade-up');

  // Helper: re-observe newly injected .fade-up elements after dynamic rendering
  function observeNewFadeElements(container) {
    if (!container) return;
    container.querySelectorAll('.fade-up:not(.visible)').forEach((el) => {
      fadeObserver.observe(el);
    });
  }
  const typedEl = document.getElementById('typed-text');

  // Contact Form Elements
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');
  const formSubmitBtn = document.getElementById('form-submit-btn');

  // Google Apps Script Form Submission URL
  const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwwRkfQhpY4Hsrc4bFmBk4rkjgayKGIHJlATYYJhShF0nqrLinjm9mGCmzgzcGdt2R3/exec';

  // Role Typist Configuration
  const ROLES = [
    'Software Developer',
    'Full Stack Developer',
    'Data Analyst',
    'Python Specialist',
    'BI Dashboard Designer'
  ];
  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  /* ==========================================
     2. Ambient Background Mouse Glow
     ========================================== */
  window.addEventListener('mousemove', (e) => {
    if (mouseGlow) {
      mouseGlow.style.left = `${e.clientX}px`;
      mouseGlow.style.top = `${e.clientY}px`;
    }
  });

  /* ==========================================
     3. Scroll Progress & Sticky Navigation Header
     ========================================== */
  window.addEventListener('scroll', () => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    if (scrollProgress) {
      scrollProgress.style.width = `${scrolled}%`;
    }

    if (header) {
      if (window.scrollY > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }
  });

  /* ==========================================
     4. Active Section Link Highlighter
     ========================================== */
  const sectionObserverOptions = {
    rootMargin: '-25% 0px -50% 0px'
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach((link) => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, sectionObserverOptions);

  sections.forEach((section) => sectionObserver.observe(section));

  /* ==========================================
     5. Scroll Fade-up Observer
     ========================================== */
  const fadeObserverOptions = {
    threshold: 0.05,
    rootMargin: '0px 0px -30px 0px'
  };

  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        fadeObserver.unobserve(entry.target);
      }
    });
  }, fadeObserverOptions);

  fadeElements.forEach((el) => fadeObserver.observe(el));

  /* ==========================================
     6. Mobile Menu Toggle
     ========================================== */
  if (navToggle && navMenuWrapper) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('active');
      navMenuWrapper.classList.toggle('active');
    });

    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navMenuWrapper.classList.remove('active');
      });
    });
  }

  /* ==========================================
     7. Role Typist Animation
     ========================================== */
  function typeEffect() {
    if (!typedEl) return;
    const currentRole = ROLES[roleIndex];
    
    if (isDeleting) {
      charIndex--;
    } else {
      charIndex++;
    }

    typedEl.textContent = currentRole.substring(0, charIndex);
    let delay = isDeleting ? 30 : 65;

    if (!isDeleting && charIndex === currentRole.length) {
      delay = 2200;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % ROLES.length;
      delay = 300;
    }

    setTimeout(typeEffect, delay);
  }

  if (typedEl) {
    typeEffect();
  }

  /* ==========================================
     8. Data Architecture & Rendering Logic
     ========================================== */

  // Helper for placeholder safety in public display
  function getSafeValue(val, fallback) {
    if (!val || typeof val !== 'string' || val.startsWith('YOUR_')) {
      return fallback;
    }
    return val;
  }

  // 8.1 Experience / Internships Data (3 Confirmed Internships)
  const EXPERIENCES_DATA = [
    {
      id: "inamigos",
      organization: "InAmigos Foundation",
      role: "Web Development Intern",
      duration: "YOUR_INAMIGOS_DATES",
      description: "Contributed to web development projects, building responsive interface components and supporting digital platform features.",
      responsibilities: [
        "Developed and maintained responsive web interfaces using HTML5, CSS3, and JavaScript.",
        "Collaborated with team members to deliver clean, user-friendly frontend code."
      ],
      technologies: ["HTML5", "CSS3", "JavaScript", "Web Development"],
      certificate: "YOUR_INAMIGOS_CERTIFICATE_URL"
    },
    {
      id: "thirenx",
      organization: "ThirenX",
      role: "Web Development Intern",
      duration: "YOUR_THIRENX_DATES",
      description: "Web development internship focusing on designing and building modern web interfaces.",
      responsibilities: [],
      technologies: ["Web Development", "HTML", "CSS", "JavaScript"],
      certificate: "YOUR_THIRENX_CERTIFICATE_URL"
    },
    {
      id: "nxtlogic",
      organization: "Nxt Logic",
      role: "Full Stack Developer Intern",
      duration: "YOUR_NXT_LOGIC_DATES",
      description: "Full stack developer internship working across frontend applications and backend workflows.",
      responsibilities: [],
      technologies: ["Full Stack Development", "Web Technologies"],
      certificate: "YOUR_NXT_LOGIC_CERTIFICATE_URL"
    }
  ];

  function renderExperiences() {
    const container = document.getElementById('experience-timeline');
    if (!container) return;

    container.innerHTML = EXPERIENCES_DATA.map((exp) => {
      const safeRole = exp.role;
      const durationVal = getSafeValue(exp.duration, "");
      const safeDesc = getSafeValue(exp.description, "Internship in software development and web technologies.");
      const hasCert = exp.certificate && !exp.certificate.startsWith("YOUR_");

      const durationHTML = durationVal 
        ? `<span class="exp-duration"><i class="fa-regular fa-calendar"></i> ${durationVal}</span>` 
        : `<span class="exp-duration"><i class="fa-solid fa-briefcase"></i> Internship</span>`;

      const responsibilitiesHTML = (exp.responsibilities && exp.responsibilities.length > 0)
        ? `<ul class="exp-responsibilities">
            ${exp.responsibilities.map(r => `<li>${r}</li>`).join('')}
           </ul>`
        : '';

      const techHTML = (exp.technologies && exp.technologies.length > 0)
        ? `<div class="exp-tech-tags">
            ${exp.technologies.map(t => `<span class="exp-tech-tag">${t}</span>`).join('')}
           </div>`
        : '';

      const certHTML = hasCert
        ? `<div class="exp-footer">
            <a href="${exp.certificate}" target="_blank" class="cert-btn"><i class="fa-solid fa-certificate"></i> View Certificate</a>
           </div>`
        : '';

      return `
        <div class="experience-card">
          <div class="exp-dot"></div>
          <div class="exp-content">
            <div class="exp-header">
              <div>
                <h3 class="exp-org"><i class="fa-solid fa-briefcase"></i> ${exp.organization}</h3>
                <div class="exp-role">${safeRole}</div>
              </div>
              ${durationHTML}
            </div>
            <p class="exp-desc">${safeDesc}</p>
            ${responsibilitiesHTML}
            ${techHTML}
            ${certHTML}
          </div>
        </div>
      `;
    }).join('');
  }

  // 8.2 Skills Data (20 Skills)
  const SKILLS_DATA = [
    { name: "Python", category: "languages", icon: "fa-brands fa-python", level: "88%", tag: "OOP & Scripting" },
    { name: "Java", category: "languages", icon: "fa-brands fa-java", level: "80%", tag: "OOP & Core" },
    { name: "C", category: "languages", icon: "fa-solid fa-c", level: "82%", tag: "Core Concepts" },
    { name: "C++", category: "languages", icon: "fa-solid fa-code", level: "85%", tag: "Algorithms & DSA" },
    
    { name: "HTML", category: "web", icon: "fa-brands fa-html5", level: "92%", tag: "Semantic Markup" },
    { name: "CSS", category: "web", icon: "fa-brands fa-css3-alt", level: "90%", tag: "Responsive UI" },
    { name: "JavaScript", category: "web", icon: "fa-brands fa-js", level: "88%", tag: "ES6+ Logic" },
    { name: "Bootstrap", category: "web", icon: "fa-brands fa-bootstrap", level: "85%", tag: "Layout Grid" },
    
    { name: "Data Structures & Algorithms", category: "cs", icon: "fa-solid fa-diagram-project", level: "84%", tag: "Problem Solving" },
    { name: "Object-Oriented Programming", category: "cs", icon: "fa-solid fa-cubes", level: "88%", tag: "Design Paradigms" },
    
    { name: "Artificial Intelligence", category: "aiml", icon: "fa-solid fa-brain", level: "78%", tag: "Core Models" },
    { name: "Machine Learning", category: "aiml", icon: "fa-solid fa-robot", level: "75%", tag: "Predictive Analytics" },
    { name: "Generative AI", category: "aiml", icon: "fa-solid fa-wand-magic-sparkles", level: "80%", tag: "Prompt Engineering" },
    
    { name: "NumPy", category: "data", icon: "fa-solid fa-calculator", level: "82%", tag: "Array Math" },
    { name: "Pandas", category: "data", icon: "fa-solid fa-table-cells", level: "85%", tag: "Data Wrangling" },
    { name: "Power BI", category: "data", icon: "fa-solid fa-chart-pie", level: "88%", tag: "DAX & Dashboards" },
    { name: "Tableau", category: "data", icon: "fa-solid fa-chart-line", level: "82%", tag: "Data Visualisation" },
    
    { name: "Git", category: "tools", icon: "fa-brands fa-git-alt", level: "86%", tag: "Version Control" },
    { name: "GitHub", category: "tools", icon: "fa-brands fa-github", level: "88%", tag: "Repositories & CI" },
    { name: "VS Code", category: "tools", icon: "fa-solid fa-code-commit", level: "92%", tag: "Primary Editor" },
    { name: "Firebase", category: "tools", icon: "fa-solid fa-fire", level: "78%", tag: "Backend Services" },
    { name: "Vercel", category: "tools", icon: "fa-solid fa-cloud-arrow-up", level: "80%", tag: "Deployment" }
  ];

  function renderSkills() {
    const grid = document.getElementById('skills-grid');
    if (!grid) return;

    grid.innerHTML = SKILLS_DATA.map((skill) => `
      <div class="glass-card skill-card" data-category="${skill.category}">
        <div class="skill-card-icon"><i class="${skill.icon}"></i></div>
        <div class="skill-card-info">
          <h3>${skill.name}</h3>
          <span class="skill-tag">${skill.tag}</span>
        </div>
        <div class="skill-progress-bar">
          <div class="skill-progress-fill" style="width: ${skill.level};"></div>
        </div>
      </div>
    `).join('');

    // Re-bind skill tabs filtering logic
    const skillTabButtons = document.querySelectorAll('.skills-tabs .tab-btn');
    const skillCards = document.querySelectorAll('.skill-card');

    skillTabButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        skillTabButtons.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');

        skillCards.forEach((card) => {
          const category = card.getAttribute('data-category');
          if (filter === 'all' || category === filter) {
            card.style.display = 'flex';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // 8.3 Projects Data
  const PROJECTS_DATA = [
    {
      id: "wayfinder",
      title: "KPRIET WayFinder",
      category: "dev",
      type: "Campus Navigation",
      visualClass: "visual-wayfinder",
      icon: "fa-solid fa-map-location-dot",
      tags: ["HTML5", "CSS3", "JavaScript", "Campus Navigation"],
      shortDesc: "A campus navigation application designed to help students and visitors easily find classrooms, laboratories, departments, blocks, facilities and other important locations inside the KPRIET campus.",
      problemSolved: "Finding specific departments, laboratories, and admin blocks across a large university campus can be challenging for new students and campus visitors. KPRIET WayFinder solves this by providing a unified digital navigation system.",
      features: [
        "Interactive campus navigation interface",
        "Quick location and department search",
        "Detailed building, laboratory, and facility info",
        "Step-by-step route guidance across campus blocks",
        "Campus location discovery with clean responsive UI"
      ],
      github: "https://github.com/sudharshan-s267/KPRIET-WayFinder",
      demo: "YOUR_WAYFINDER_LIVE_DEMO_URL",
      featured: true
    },
    {
      id: "fire-detection",
      title: "AI Forest Fire Detection System",
      category: "dev",
      type: "Web Platform",
      visualClass: "visual-fire",
      icon: "fa-solid fa-fire-flame-curved",
      tags: ["Bootstrap", "JavaScript", "AI Awareness", "Responsive"],
      shortDesc: "An educational and awareness-focused web platform centering on AI-powered forest fire detection models. Designed with Bootstrap for polished, high-fidelity responsive layouts.",
      problemSolved: "Wildfires pose severe ecological threats. This platform demonstrates AI detection methodologies and alert conceptualizations for academic environmental initiatives.",
      features: [
        "Interactive ML detection visual model breakdown",
        "Real-time sensor data dashboard concepts",
        "Bootstrap responsive mobile-optimized UI"
      ],
      github: "https://github.com/sudharshan-s267/AI-Forest-Fire-Detection",
      demo: "YOUR_FIRE_DETECTION_DEMO_URL",
      featured: true
    },
    {
      id: "power-bi",
      title: "Power BI Analytics Dashboards",
      category: "data",
      type: "Data Dashboard",
      visualClass: "visual-bi",
      icon: "fa-solid fa-chart-line",
      tags: ["Power BI", "DAX", "Excel Data", "KPI Metrics"],
      shortDesc: "Interactive executive dashboards analyzing complex dataset architectures. Incorporates advanced DAX measures, dynamic slicers, data-modeling schemas, and detailed drill-through navigation.",
      problemSolved: "Raw dataset spreadsheets lack actionable visual clarity. These dashboards convert complex figures into executive visual KPIs, regional analysis, and trends.",
      features: [
        "Advanced DAX calculated measures & columns",
        "Interactive cross-filtering and drill-through pages",
        "KPI scorecard tracking and trend projection"
      ],
      github: "https://github.com/sudharshan-s267/PowerBI-Dashboards",
      demo: "YOUR_POWERBI_DEMO_URL",
      featured: true
    },
    {
      id: "banking",
      title: "Banking Management System",
      category: "other",
      type: "Console App",
      visualClass: "visual-bank",
      icon: "fa-solid fa-building-columns",
      tags: ["Python", "OOP", "Data Validation", "Security"],
      shortDesc: "A robust terminal console application developed in Python. Leverages Object-Oriented Programming (OOP) paradigms to handle account configurations, transactions, and parameter validations.",
      problemSolved: "Demonstrates core OOP principles including encapsulation, transactional data integrity, and authentication logic in a Python terminal CLI environment.",
      features: [
        "Account creation, deposit, and secure withdrawal logic",
        "Transaction history logging and balance inquiry",
        "Robust OOP class hierarchy and input validation"
      ],
      github: "https://github.com/sudharshan-s267/Banking-Management-System",
      demo: "YOUR_BANKING_SYSTEM_DEMO_URL",
      featured: false
    },
    {
      id: "optics",
      title: "Optical Physics Educational Suite",
      category: "dev",
      type: "Education UI",
      visualClass: "visual-physics",
      icon: "fa-solid fa-lightbulb",
      tags: ["HTML5", "CSS3", "JavaScript", "Bootstrap"],
      shortDesc: "An interactive educational site detailing fundamental principles of optical physics. Developed using semantic HTML, native CSS layouts, Bootstrap grids, and JavaScript elements.",
      problemSolved: "Abstract physics equations are often difficult to visualize. This web suite provides visual guides and interactive optic module demonstrations.",
      features: [
        "Interactive optical module demonstrations",
        "Formula breakdowns & ray optics diagrams",
        "Responsive multi-page design for tablets and mobile"
      ],
      github: "https://github.com/sudharshan-s267/Optical-Physics-Suite",
      demo: "optics-suite.html",
      featured: false
    }
  ];

  function renderProjects() {
    const grid = document.getElementById('projects-grid');
    if (!grid) return;

    // Build cards with per-project error isolation
    const cardHTMLParts = [];
    PROJECTS_DATA.forEach((proj) => {
      try {
        const githubUrl = (proj.github && !proj.github.startsWith('YOUR_')) ? proj.github : null;
        const demoUrl   = (proj.demo   && !proj.demo.startsWith('YOUR_')   && proj.demo !== '#') ? proj.demo : null;

        const tagsHTML = Array.isArray(proj.tags) && proj.tags.length
          ? proj.tags.map(t => `<span>${t}</span>`).join('')
          : '';

        const githubBtnHTML = githubUrl
          ? `<a href="${githubUrl}" target="_blank" rel="noopener noreferrer" class="btn-icon-link" aria-label="View GitHub code for ${proj.title}"><i class="fa-brands fa-github"></i> Code</a>`
          : '';

        const demoBtnHTML = demoUrl
          ? `<a href="${demoUrl}" target="_blank" rel="noopener noreferrer" class="btn-icon-link" aria-label="Open live demo for ${proj.title}"><i class="fa-solid fa-arrow-up-right-from-square"></i> Demo</a>`
          : '';

        // NOTE: No 'fade-up' class here — dynamic cards injected after the
        // IntersectionObserver is set up are never observed, causing opacity:0.
        // Cards are visible immediately; the parent section wrapper handles the
        // scroll-reveal for the overall grid container.
        cardHTMLParts.push(`
          <article class="glass-card project-card" data-category="${proj.category || 'other'}" data-project-id="${proj.id || ''}">
            <div class="project-visual ${proj.visualClass || 'visual-default'}">
              <span class="project-type-tag">${proj.type || 'Project'}</span>
              <div class="project-illustration-decor"><i class="${proj.icon || 'fa-solid fa-code'}"></i></div>
            </div>
            <div class="project-info">
              ${tagsHTML ? `<div class="project-tags">${tagsHTML}</div>` : ''}
              <h3 class="project-title">${proj.title || 'Untitled Project'}</h3>
              <p class="project-desc">${proj.shortDesc || proj.description || ''}</p>
              <div class="project-actions">
                <button class="btn-details-trigger" data-project-id="${proj.id || ''}" aria-label="View details for ${proj.title}">
                  <i class="fa-solid fa-circle-info"></i> View Details
                </button>
                ${githubBtnHTML}
                ${demoBtnHTML}
              </div>
            </div>
          </article>
        `);
      } catch (err) {
        console.warn('[renderProjects] Skipped a project due to error:', err, proj);
      }
    });

    grid.innerHTML = cardHTMLParts.join('');

    // Bind filter buttons
    const projectFilterButtons = document.querySelectorAll('.projects-filter .filter-btn');
    const projectCards         = document.querySelectorAll('#projects-grid .project-card');

    projectFilterButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        projectFilterButtons.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');

        projectCards.forEach((card) => {
          const category = card.getAttribute('data-category');
          if (filter === 'all' || category === filter) {
            card.style.display = '';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });

    // Bind "View Details" Modal Triggers
    document.querySelectorAll('#projects-grid .btn-details-trigger').forEach((btn) => {
      btn.addEventListener('click', () => {
        const projId = btn.getAttribute('data-project-id');
        openProjectModal(projId);
      });
    });
  }

  // 8.4 Certifications Data (5 Confirmed Certifications)
  const CERTIFICATIONS_DATA = [
    {
      id: "matlab-onramp",
      title: "MATLAB Onramp",
      issuer: "MathWorks",
      date: "YOUR_MATLAB_DATE",
      description: "Hands-on learning course covering data analysis, visualization, and core MATLAB programming concepts.",
      image: "",
      link: "assets/Certificates/matlab-onramp.pdf"
    },
    {
      id: "stats-onramp",
      title: "Statistics Onramp",
      issuer: "MathWorks",
      date: "YOUR_STATS_DATE",
      description: "Foundational statistics, exploratory data analysis, and probability distributions using MATLAB.",
      image: "",
      link: "assets/Certificates/statistics-onramp.pdf"
    },
    {
      id: "fortinet-nse1",
      title: "NSE 1 — Cybersecurity and Cloud Fundamentals 1.0",
      issuer: "Fortinet",
      date: "YOUR_NSE1_DATE",
      description: "Essential cybersecurity principles, threat awareness, network safety, and cloud security fundamentals.",
      image: "",
      link: "assets/Certificates/nse1.pdf"
    },
    {
      id: "fortinet-nse2",
      title: "NSE 2 — Introduction to Next Generation Firewall 1.0",
      issuer: "Fortinet",
      date: "YOUR_NSE2_DATE",
      description: "Next Generation Firewall (NGFW) concepts, network security architecture, and threat mitigation.",
      image: "",
      link: "assets/Certificates/nse2.pdf"
    },
    {
      id: "deloitte-analytics",
      title: "Deloitte Data Analytics Job Simulation",
      issuer: "Deloitte",
      date: "YOUR_DELOITTE_DATE",
      description: "Practical data analytics job simulation involving dataset exploration, forensic analysis, and business dashboard insights.",
      image: "",
      link: "assets/Certificates/deloitte-data-analytics.pdf"
    }
  ];


  function renderCertifications() {
    const grid = document.getElementById('certifications-grid');
    if (!grid) return;

    grid.innerHTML = CERTIFICATIONS_DATA.map((cert) => {
      const certDate = getSafeValue(cert.date, 'Verified Credential');
      // A valid link is any non-empty string that doesn't start with YOUR_
      const hasValidUrl = cert.link && cert.link.trim() !== '' && !cert.link.startsWith('YOUR_');

      const actionBtn = hasValidUrl
        ? `<a
             href="${cert.link}"
             target="_blank"
             rel="noopener noreferrer"
             class="cert-btn"
             aria-label="Open ${cert.title} certificate PDF"
           >
             <i class="fa-solid fa-file-pdf"></i> View Certificate
           </a>`
        : `<button class="cert-btn cert-btn-disabled" disabled aria-disabled="true" aria-label="Certificate not yet available">
             <i class="fa-solid fa-clock"></i> Coming Soon
           </button>`;

      return `
        <div class="glass-card cert-card">
          <div>
            <div class="cert-icon"><i class="fa-solid fa-award"></i></div>
            <h3 class="cert-title">${cert.title}</h3>
            <div class="cert-issuer"><i class="fa-solid fa-building"></i> ${cert.issuer}</div>
            <div class="cert-date">${certDate}</div>
            <p class="cert-desc" style="margin-top:0.75rem;">${cert.description}</p>
          </div>
          ${actionBtn}
        </div>
      `;
    }).join('');
  }


  // 8.5 Achievements Data (3 Confirmed Achievements)
  const ACHIEVEMENTS_DATA = [
    {
      id: "fast-curious",
      title: "Fast and Curious Quiz Event",
      organization: "Technical Competition",
      rank: "🏆 Winner",
      date: "YOUR_QUIZ_DATE",
      description: "Secured 1st Place / Winner in the Fast and Curious Quiz Event."
    },
    {
      id: "algoauction",
      title: "AlgoAuction & Digital Escape Room",
      organization: "KPRIET Hackathon Events",
      rank: "🏆 1st Place",
      date: "YOUR_ALGO_DATE",
      description: "Secured first place in algorithmic strategy auctions, speed problem-solving, and digital technical escape room competitions."
    },
    {
      id: "scienceday",
      title: "National Science Day Paper Presentation",
      organization: "KPRIET National Science Day",
      rank: "🏆 3rd Place",
      date: "YOUR_SCIENCE_DAY_DATE",
      description: "Earned third place honors for presenting a technical paper on emerging software & AI concepts."
    }
  ];

  function renderAchievements() {
    const grid = document.getElementById('achievements-grid');
    if (!grid) return;

    grid.innerHTML = ACHIEVEMENTS_DATA.map((ach) => {
      const dateVal = getSafeValue(ach.date, "");
      const orgLine = dateVal ? `${ach.organization} (${dateVal})` : ach.organization;

      return `
        <div class="glass-card achievement-card">
          <div class="achievement-badge"><i class="fa-solid fa-trophy"></i> ${ach.rank}</div>
          <h3 class="achievement-title">${ach.title}</h3>
          ${orgLine ? `<div class="achievement-org"><i class="fa-solid fa-building-columns"></i> ${orgLine}</div>` : ''}
          <p class="achievement-desc">${ach.description}</p>
        </div>
      `;
    }).join('');
  }

  /* ==========================================
     9. Modal Dialog Handlers
     ========================================== */
  const projectModal = document.getElementById('project-modal');
  const projectModalBody = document.getElementById('project-modal-body');
  const projectModalClose = document.getElementById('project-modal-close');

  const certModal = document.getElementById('certificate-modal');
  const certModalBody = document.getElementById('cert-modal-body');
  const certModalClose = document.getElementById('cert-modal-close');

  function openProjectModal(id) {
    const proj = PROJECTS_DATA.find((p) => p.id === id);
    if (!proj || !projectModalBody) return;

    const githubUrl = getSafeValue(proj.github, "https://github.com/sudharshan-s267");
    const demoUrl = getSafeValue(proj.demo, "#");
    const isDemoAvailable = demoUrl !== "#";

    projectModalBody.innerHTML = `
      <h2 style="font-size:1.6rem; color:var(--text-primary); margin-bottom:0.5rem;">${proj.title}</h2>
      <div style="font-size:0.9rem; color:var(--color-cyan-light); margin-bottom:1rem;">${proj.type}</div>
      
      <div class="modal-tech-tags">
        ${proj.tags.map(t => `<span class="modal-tech-badge">${t}</span>`).join('')}
      </div>

      <div style="margin-top:1.25rem;">
        <h4 style="color:var(--color-purple-light); font-size:1.05rem; margin-bottom:0.4rem;">Overview</h4>
        <p style="color:var(--text-secondary); font-size:0.95rem; line-height:1.6;">${proj.shortDesc}</p>
      </div>

      <div style="margin-top:1.25rem;">
        <h4 style="color:var(--color-purple-light); font-size:1.05rem; margin-bottom:0.4rem;">Problem Solved</h4>
        <p style="color:var(--text-secondary); font-size:0.95rem; line-height:1.6;">${proj.problemSolved}</p>
      </div>

      <div style="margin-top:1.25rem;">
        <h4 style="color:var(--color-purple-light); font-size:1.05rem; margin-bottom:0.4rem;">Key Highlights</h4>
        <ul style="list-style:none; padding-left:0;">
          ${proj.features.map(f => `<li style="position:relative; padding-left:1.25rem; margin-bottom:0.35rem; color:var(--text-secondary); font-size:0.9rem;"><span style="position:absolute; left:0; color:var(--color-purple-light);">✓</span> ${f}</li>`).join('')}
        </ul>
      </div>

      <div style="display:flex; gap:1rem; margin-top:2rem; flex-wrap:wrap;">
        <a href="${githubUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary" style="padding:0.6rem 1.25rem; font-size:0.9rem;">
          <i class="fa-brands fa-github"></i> View GitHub Code
        </a>
        ${isDemoAvailable ? `<a href="${demoUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary" style="padding:0.6rem 1.25rem; font-size:0.9rem;"><i class="fa-solid fa-arrow-up-right-from-square"></i> Open Live Demo</a>` : ''}
      </div>
    `;

    projectModal.classList.add('active');
    projectModal.setAttribute('aria-hidden', 'false');
  }

  function closeProjectModal() {
    if (projectModal) {
      projectModal.classList.remove('active');
      projectModal.setAttribute('aria-hidden', 'true');
    }
  }

  if (projectModalClose) projectModalClose.addEventListener('click', closeProjectModal);
  if (projectModal) {
    projectModal.addEventListener('click', (e) => {
      if (e.target === projectModal) closeProjectModal();
    });
  }

  function openCertificateModal(id) {
    const cert = CERTIFICATIONS_DATA.find((c) => c.id === id);
    if (!cert || !certModalBody) return;

    const certUrl = getSafeValue(cert.link, "#");
    const certImg = getSafeValue(cert.image, "");
    const certDate = getSafeValue(cert.date, "Verified Credential");
    const hasValidUrl = certUrl !== "#";
    const hasValidImg = certImg !== "";

    certModalBody.innerHTML = `
      <div style="font-size:2.5rem; color:var(--color-purple-light); margin-bottom:0.75rem;"><i class="fa-solid fa-certificate"></i></div>
      <h3 style="font-size:1.3rem; color:var(--text-primary); margin-bottom:0.25rem;">${cert.title}</h3>
      <p style="color:var(--color-cyan-light); font-weight:600; font-size:0.95rem;"><i class="fa-solid fa-building"></i> ${cert.issuer}</p>
      <p style="color:var(--text-muted); font-size:0.85rem; margin-bottom:1rem;">${certDate}</p>
      ${hasValidImg ? `<div style="margin:1rem 0;"><img src="${certImg}" alt="${cert.title}" style="max-width:100%; border-radius:8px; border:1px solid var(--border-light);" /></div>` : ''}
      <p style="color:var(--text-secondary); font-size:0.9rem; margin-bottom:1.5rem;">${cert.description}</p>
      ${hasValidUrl 
        ? `<a href="${certUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary" style="width:100%; justify-content:center;"><i class="fa-solid fa-arrow-up-right-from-square"></i> Open Official Certificate</a>` 
        : `<p style="font-size:0.85rem; color:var(--color-purple-light); background:rgba(139,92,246,0.08); border:1px solid rgba(139,92,246,0.2); padding:0.75rem; border-radius:8px;"><i class="fa-solid fa-clock"></i> Certificate coming soon</p>`}
    `;

    certModal.classList.add('active');
    certModal.setAttribute('aria-hidden', 'false');
  }

  function closeCertModal() {
    if (certModal) {
      certModal.classList.remove('active');
      certModal.setAttribute('aria-hidden', 'true');
    }
  }

  if (certModalClose) certModalClose.addEventListener('click', closeCertModal);
  if (certModal) {
    certModal.addEventListener('click', (e) => {
      if (e.target === certModal) closeCertModal();
    });
  }

  /* ==========================================
     10. Interactive Developer Terminal CLI
     ========================================== */
  const terminalInput = document.getElementById('terminal-input');
  const terminalBody = document.getElementById('terminal-body');

  if (terminalInput && terminalBody) {
    terminalInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const cmd = terminalInput.value.trim().toLowerCase();
        terminalInput.value = '';
        executeTerminalCommand(cmd);
      }
    });
  }

  function executeTerminalCommand(cmd) {
    if (!terminalBody) return;

    // Append Command Prompt line
    const cmdLine = document.createElement('div');
    cmdLine.className = 'term-line';
    cmdLine.innerHTML = `<span class="term-prompt-user">sudharshan@portfolio:~$</span> <span>${escapeHtml(cmd)}</span>`;
    terminalBody.appendChild(cmdLine);

    let responseHTML = '';

    switch (cmd) {
      case 'help':
        responseHTML = `
          <div class="term-output">
            <p><strong>Available Commands:</strong></p>
            <p><span class="cmd-highlight">about</span>        - Brief summary about Sudharshan S</p>
            <p><span class="cmd-highlight">experience</span>   - View internships & work history</p>
            <p><span class="cmd-highlight">skills</span>       - List top technical skills</p>
            <p><span class="cmd-highlight">projects</span>     - Display featured engineering projects</p>
            <p><span class="cmd-highlight">certifications</span> - Show industry certifications</p>
            <p><span class="cmd-highlight">achievements</span> - Display competition achievements</p>
            <p><span class="cmd-highlight">contact</span>      - Get contact channels & links</p>
            <p><span class="cmd-highlight">resume</span>       - View resume access links</p>
            <p><span class="cmd-highlight">clear</span>        - Clear terminal history</p>
          </div>
        `;
        break;

      case 'about':
        responseHTML = `<div class="term-output"><p>Sudharshan S — Computer Science Engineering Student at KPRIET (CGPA: 9.39). Specialized in Web Apps, Data Analytics (Power BI/Tableau), and Python Development.</p></div>`;
        break;

      case 'experience':
        responseHTML = `<div class="term-output"><p>1. InAmigos Foundation (Web Development Intern)</p><p>2. ThirenX (Web Development Intern)</p><p>3. Nxt Logic (Full Stack Developer Intern)</p></div>`;
        break;

      case 'skills':
        responseHTML = `<div class="term-output"><p>Languages: Python, Java, C, C++</p><p>Web: HTML, CSS, JavaScript, Bootstrap</p><p>CS & AI: DSA, OOP, AI, ML, GenAI</p><p>Data & Tools: Power BI, Tableau, Pandas, Git, GitHub, VS Code, Firebase, Vercel</p></div>`;
        break;

      case 'projects':
        responseHTML = `<div class="term-output"><p>• KPRIET WayFinder (Campus Navigation)</p><p>• AI Forest Fire Detection System</p><p>• Power BI Analytics Dashboards</p><p>• Banking Management System (Python OOP)</p><p>• Optical Physics Educational Suite</p></div>`;
        break;

      case 'certifications':
        responseHTML = `<div class="term-output"><p>• MATLAB Onramp (MathWorks)</p><p>• Statistics Onramp (MathWorks)</p><p>• NSE 1 — Cybersecurity and Cloud Fundamentals 1.0 (Fortinet)</p><p>• NSE 2 — Introduction to Next Generation Firewall 1.0 (Fortinet)</p><p>• Deloitte Data Analytics Job Simulation (Deloitte)</p></div>`;
        break;

      case 'achievements':
        responseHTML = `<div class="term-output"><p>🏆 Winner — Fast and Curious Quiz Event</p><p>🏆 1st Place — AlgoAuction & Digital Escape Room (KPRIET Hackathon)</p><p>🏆 3rd Place — Science Day Paper Presentation (KPRIET)</p></div>`;
        break;

      case 'contact':
        responseHTML = `<div class="term-output"><p>Email: 25cs267@kpriet.ac.in</p><p>Phone: +91 82480 59005</p><p>LinkedIn: linkedin.com/in/sudharshan-s-3197b03a7</p><p>GitHub: github.com/sudharshan-s267</p></div>`;
        break;

      case 'resume':
        responseHTML = `<div class="term-output term-success"><p>Resume not yet configured. Contact via <strong>25cs267@kpriet.ac.in</strong> to request a copy.</p></div>`;
        break;

      case 'clear':
        terminalBody.innerHTML = `
          <div class="terminal-welcome">
            <p>Welcome to Sudharshan's Interactive Developer Terminal v2.0</p>
            <p>Type <span class="cmd-highlight">help</span> to view available commands.</p>
          </div>
        `;
        return;

      case '':
        return;

      default:
        responseHTML = `<div class="term-output term-error"><p>Command not recognized: '${escapeHtml(cmd)}'. Type <span class="cmd-highlight">help</span> for commands.</p></div>`;
        break;
    }

    const outLine = document.createElement('div');
    outLine.innerHTML = responseHTML;
    terminalBody.appendChild(outLine);

    // Auto-scroll to bottom of terminal
    terminalBody.scrollTop = terminalBody.scrollHeight;
  }

  function escapeHtml(str) {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  /* ==========================================
     11. Robust Contact Form & Firebase Integration
     ========================================== */
  
  // Google Script Fallback submit helper
  function sendViaGoogleScript(name, email, message) {
    return new Promise((resolve, reject) => {
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = GOOGLE_SCRIPT_URL;
      form.target = 'hidden-form-frame';
      form.style.display = 'none';

      const fields = [
        ['name', name],
        ['email', email],
        ['message', message]
      ];

      fields.forEach(([key, value]) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = value;
        form.appendChild(input);
      });

      document.body.appendChild(form);
      
      try {
        form.submit();
        document.body.removeChild(form);
        setTimeout(resolve, 2000);
      } catch (error) {
        document.body.removeChild(form);
        reject(error);
      }
    });
  }

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('name');
      const emailInput = document.getElementById('email');
      const messageInput = document.getElementById('message');

      const name = nameInput.value.trim();
      const email = emailInput.value.trim();
      const message = messageInput.value.trim();
      const honey = contactForm.querySelector('[name="_honey"]').value;

      if (honey) return; // Honeypot trap check

      // Validate inputs
      let isValid = true;

      if (!name || name.length < 2) {
        nameInput.parentElement.classList.add('is-invalid');
        isValid = false;
      } else {
        nameInput.parentElement.classList.remove('is-invalid');
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email || !emailRegex.test(email)) {
        emailInput.parentElement.classList.add('is-invalid');
        isValid = false;
      } else {
        emailInput.parentElement.classList.remove('is-invalid');
      }

      if (!message || message.length < 5) {
        messageInput.parentElement.classList.add('is-invalid');
        isValid = false;
      } else {
        messageInput.parentElement.classList.remove('is-invalid');
      }

      if (!isValid) return;

      // Set Loading State
      formSubmitBtn.disabled = true;
      formSubmitBtn.innerHTML = '<span>Sending</span> <i class="fa-solid fa-circle-notch fa-spin"></i>';
      formStatus.className = 'form-status';
      formStatus.textContent = '';

      try {
        await sendViaGoogleScript(name, email, message);
        formStatus.className = 'form-status success';
        formStatus.innerHTML = '<i class="fa-solid fa-circle-check"></i> Thank you! Your message has been sent.';
        contactForm.reset();
      } catch (err) {
        console.error('Submission failed:', err);
        formStatus.className = 'form-status error';
        formStatus.innerHTML = '<i class="fa-solid fa-circle-exclamation"></i> Submission error. Please email 25cs267@kpriet.ac.in directly.';
      }

      formSubmitBtn.disabled = false;
      formSubmitBtn.innerHTML = '<span>Send Message</span> <i class="fa-solid fa-paper-plane"></i>';
    });
  }

  /* ==========================================
     12. Initial Run & Render Trigger
     ========================================== */
  renderExperiences();
  renderSkills();
  renderProjects();
  renderCertifications();
  renderAchievements();

  // Re-observe any .fade-up elements inside dynamically rendered grids
  // (static .fade-up wrappers are already observed above at line 104)
  [
    document.getElementById('experience-timeline'),
    document.getElementById('skills-grid'),
    document.getElementById('projects-grid'),
    document.getElementById('certifications-grid'),
    document.getElementById('achievements-grid')
  ].forEach(observeNewFadeElements);
});
