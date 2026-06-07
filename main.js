// ==================== MAIN JAVASCRIPT ==================== //

// ==================== PRELOADER ==================== //
window.addEventListener('load', function() {
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.classList.add('hidden');
        }, 1500);
    }
    
    // Initialize AOS
    AOS.init({
        duration: 1000,
        easing: 'ease-in-out',
        once: true,
        offset: 100
    });
});

// ==================== NAVIGATION ==================== //
const navbar = document.getElementById('navbar');
const navMenu = document.getElementById('navMenu');
const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelectorAll('.nav-link');

// Hamburger toggle
if (hamburger) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });
}

// Close menu when link is clicked
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// Navbar scroll effect
let lastScrollY = 0;
window.addEventListener('scroll', () => {
    lastScrollY = window.scrollY;
    
    if (navbar) {
        if (lastScrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
    
    // Update active nav link based on scroll position
    updateActiveNavLink();
    
    // Show/hide back to top button
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
        if (window.scrollY > 300) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    }
});

// Update active nav link
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.clientHeight;
        
        if (lastScrollY >= sectionTop && lastScrollY < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
            });
            
            const activeLink = document.querySelector(`.nav-link[href="#${section.id}"]`);
            if (activeLink) {
                activeLink.classList.add('active');
            }
        }
    });
}

// ==================== BACK TO TOP BUTTON ==================== //
const backToTopBtn = document.getElementById('backToTop');

if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ==================== TYPED.JS INTEGRATION ==================== //
const typedElement = document.querySelector('.typed-text');

if (typedElement) {
    const typed = new Typed('.typed-text', {
        strings: [
            'Full Stack Developer',
            'Data Analyst',
            'Problem Solver',
            'Tech Enthusiast',
            'Python Developer',
            'Power BI Expert'
        ],
        typeSpeed: 60,
        backSpeed: 40,
        backDelay: 1500,
        loop: true,
        showCursor: false
    });
}

// ==================== PARTICLES.JS BACKGROUND ==================== //
function initParticles() {
    const particlesContainer = document.getElementById('particles');
    
    if (particlesContainer) {
        const particleCount = window.innerWidth > 768 ? 50 : 30;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                width: ${Math.random() * 4 + 1}px;
                height: ${Math.random() * 4 + 1}px;
                background: rgba(99, 102, 241, ${Math.random() * 0.5 + 0.2});
                border-radius: 50%;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation: float ${Math.random() * 10 + 8}s ease-in-out infinite;
                animation-delay: ${Math.random() * 5}s;
            `;
            particlesContainer.appendChild(particle);
        }
    }
}

// Initialize particles on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initParticles);
} else {
    initParticles();
}

// ==================== SMOOTH SCROLL FOR ANCHOR LINKS ==================== //
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        
        if (href === '#' || href === '') return;
        
        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ==================== PROJECTS FILTER ==================== //
function initProjectFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filterValue = btn.getAttribute('data-filter');
            
            // Filter projects with animation
            projectCards.forEach(card => {
                const cardTags = card.getAttribute('data-tags');
                
                if (filterValue === 'all' || cardTags.includes(filterValue)) {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.8)';
                    
                    setTimeout(() => {
                        card.style.display = 'block';
                        card.offsetHeight; // Trigger reflow
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 100);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.8)';
                    
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

// ==================== TESTIMONIAL SLIDER ==================== //
function initTestimonialSlider() {
    const prevBtn = document.querySelector('.slider-btn.prev');
    const nextBtn = document.querySelector('.slider-btn.next');
    const testimonials = document.querySelectorAll('.testimonial-card');
    let currentSlide = 0;
    
    function showSlide(n) {
        testimonials.forEach(card => card.classList.remove('active'));
        testimonials[n].classList.add('active');
    }
    
    function nextSlide() {
        currentSlide = (currentSlide + 1) % testimonials.length;
        showSlide(currentSlide);
    }
    
    function prevSlide() {
        currentSlide = (currentSlide - 1 + testimonials.length) % testimonials.length;
        showSlide(currentSlide);
    }
    
    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', prevSlide);
        nextBtn.addEventListener('click', nextSlide);
    }
    
    // Auto-advance slides every 5 seconds
    if (testimonials.length > 1) {
        setInterval(nextSlide, 5000);
    }
}

// ==================== SKILLS PROGRESS BARS ==================== //
function initSkillProgressBars() {
    const skillBars = document.querySelectorAll('.skill-progress-bar');
    let hasAnimated = false;
    
    const observerOptions = {
        threshold: 0.5
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasAnimated) {
                hasAnimated = true;
                skillBars.forEach(bar => {
                    const percentage = bar.getAttribute('data-percentage');
                    bar.style.width = percentage + '%';
                });
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    const skillsSection = document.querySelector('.skills-preview');
    if (skillsSection) {
        observer.observe(skillsSection);
    }
}

// ==================== COUNTER ANIMATION ==================== //
function animateCounter(element, target, duration = 2000) {
    let current = 0;
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
        current += increment;
        
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

// ==================== INITIALIZE ON DOM READY ==================== //
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        initProjectFilter();
        initTestimonialSlider();
        initSkillProgressBars();
    });
} else {
    initProjectFilter();
    initTestimonialSlider();
    initSkillProgressBars();
}

// ==================== MOUSE FOLLOW EFFECT (Optional) ==================== //
function initMouseFollowEffect() {
    const heroImage = document.querySelector('.image-wrapper');
    
    if (heroImage) {
        document.addEventListener('mousemove', (e) => {
            const x = (window.innerWidth / 2 - e.clientX) / 20;
            const y = (window.innerHeight / 2 - e.clientY) / 20;
            
            heroImage.style.transform = `perspective(1000px) rotateY(${x}deg) rotateX(${y}deg)`;
        });
        
        document.addEventListener('mouseleave', () => {
            heroImage.style.transform = 'perspective(1000px) rotateY(0) rotateX(0)';
        });
    }
}

initMouseFollowEffect();

// ==================== LAZY LOADING IMAGES ==================== //
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                imageObserver.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => imageObserver.observe(img));
}

// ==================== UTILITY FUNCTIONS ==================== //

// Debounce function
function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

// Get element by ID
function el(id) {
    return document.getElementById(id);
}

// Add class to element
function addClass(element, className) {
    element.classList.add(className);
}

// Remove class from element
function removeClass(element, className) {
    element.classList.remove(className);
}

// Toggle class on element
function toggleClass(element, className) {
    element.classList.toggle(className);
}

// Check if element has class
function hasClass(element, className) {
    return element.classList.contains(className);
}

// ==================== CLIPBOARD COPY FUNCTION ==================== //
function copyToClipboard(text, element) {
    navigator.clipboard.writeText(text).then(() => {
        const originalText = element.textContent;
        element.textContent = 'Copied!';
        
        setTimeout(() => {
            element.textContent = originalText;
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy:', err);
    });
}

// ==================== DARK MODE TOGGLE (Optional) ==================== //
function initDarkModeToggle() {
    const darkModeToggle = document.querySelector('.dark-mode-toggle');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    if (darkModeToggle) {
        // Check localStorage for saved preference
        const savedMode = localStorage.getItem('darkMode');
        
        if (savedMode === 'enabled' || (!savedMode && prefersDarkScheme.matches)) {
            document.body.classList.add('dark-mode');
            darkModeToggle.classList.add('active');
        }
        
        darkModeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            darkModeToggle.classList.toggle('active');
            
            const isDarkMode = document.body.classList.contains('dark-mode');
            localStorage.setItem('darkMode', isDarkMode ? 'enabled' : 'disabled');
        });
    }
}

initDarkModeToggle();

// ==================== CONSOLE MESSAGE ==================== //
console.log('%cWelcome to my Portfolio! 🚀', 'color: #6366f1; font-size: 20px; font-weight: bold;');
console.log('%cLooking for a talented developer? Let\'s connect! 💼', 'color: #ec4899; font-size: 14px;');
console.log('%cEmail: 25cs267@kpriet.ac.in | Phone: +91 82480 59005', 'color: #10b981; font-size: 12px;');