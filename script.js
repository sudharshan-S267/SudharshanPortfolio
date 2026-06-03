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
  const typedEl = document.getElementById('typed-text');
  
  // Skills Tab Filtering Elements
  const skillTabButtons = document.querySelectorAll('.tab-btn');
  const skillCards = document.querySelectorAll('.skill-card');
  
  // Projects Filter Elements
  const projectFilterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  // Contact Form Elements
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');
  const formSubmitBtn = document.getElementById('form-submit-btn');

  // Google Script Form Submission URL
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
     1. Ambient Background Mouse Glow (Behind components)
     ========================================== */
  window.addEventListener('mousemove', (e) => {
    if (mouseGlow) {
      mouseGlow.style.left = `${e.clientX}px`;
      mouseGlow.style.top = `${e.clientY}px`;
    }
  });

  /* ==========================================
     2. Scroll Progress & Sticky Navigation
     ========================================== */
  window.addEventListener('scroll', () => {
    // 2.1 Calculate Scroll Progress
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    if (scrollProgress) {
      scrollProgress.style.width = `${scrolled}%`;
    }

    // 2.2 Header Scrolled State
    if (header) {
      if (window.scrollY > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }
  });

  /* ==========================================
     3. Active Section Link Highlighter
     ========================================== */
  const sectionObserverOptions = {
    rootMargin: '-30% 0px -60% 0px'
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
     4. Intersection Observer for Scroll Fade-up
     ========================================== */
  const fadeObserverOptions = {
    threshold: 0.05,
    rootMargin: '0px 0px -40px 0px'
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
     5. Mobile Menu Toggle
     ========================================== */
  if (navToggle && navMenuWrapper) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('active');
      navMenuWrapper.classList.toggle('active');
    });

    // Close mobile menu when clicking nav links
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navMenuWrapper.classList.remove('active');
      });
    });
  }

  /* ==========================================
     6. Role Typist Animation
     ========================================== */
  function typeEffect() {
    if (!typedEl) return;

    const currentRole = ROLES[roleIndex];
    
    if (isDeleting) {
      charIndex--;
    } else {
      charIndex++;
    }

    const displayText = currentRole.substring(0, charIndex);
    typedEl.textContent = displayText;

    let delay = isDeleting ? 30 : 65;

    // Word complete state
    if (!isDeleting && charIndex === currentRole.length) {
      delay = 2200; // Pause at complete word
      isDeleting = true;
    } 
    // Delete complete state
    else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % ROLES.length;
      delay = 300; // Short pause before typing next word
    }

    setTimeout(typeEffect, delay);
  }

  if (typedEl) {
    typeEffect();
  }

  /* ==========================================
     7. Interactive Skills Tabs Filter
     ========================================== */
  skillTabButtons.forEach((button) => {
    button.addEventListener('click', () => {
      skillTabButtons.forEach((btn) => btn.classList.remove('active'));
      button.classList.add('active');

      const filter = button.getAttribute('data-filter');

      skillCards.forEach((card) => {
        const category = card.getAttribute('data-category');
        
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          card.style.animation = 'fadeInUp 0.4s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  /* ==========================================
     8. Interactive Projects Filter
     ========================================== */
  projectFilterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      projectFilterButtons.forEach((btn) => btn.classList.remove('active'));
      button.classList.add('active');

      const filter = button.getAttribute('data-filter');

      projectCards.forEach((card) => {
        const category = card.getAttribute('data-category');

        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          card.style.animation = 'fadeInUp 0.5s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  /* ==========================================
     9. Google Sheets Contact Form Submission
     ========================================== */
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

      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const message = document.getElementById('message').value.trim();
      const honey = contactForm.querySelector('[name="_honey"]').value;

      if (honey) return;

      formSubmitBtn.disabled = true;
      formSubmitBtn.innerHTML = 'Sending Message <i class="fa-solid fa-spinner fa-spin"></i>';
      formStatus.className = 'form-status';
      formStatus.textContent = '';

      try {
        await sendViaGoogleScript(name, email, message);
        formStatus.className = 'form-status success';
        formStatus.innerHTML = '<i class="fa-solid fa-circle-check"></i> Sent successfully!';
        contactForm.reset();
      } catch (err) {
        console.error('Submission failed', err);
        formStatus.className = 'form-status error';
        formStatus.innerHTML = '<i class="fa-solid fa-circle-exclamation"></i> Error. Email 25cs267@kpriet.ac.in directly.';
      } finally {
        formSubmitBtn.disabled = false;
        formSubmitBtn.innerHTML = 'Send Message <i class="fa-solid fa-paper-plane"></i>';
      }
    });
  }
});
