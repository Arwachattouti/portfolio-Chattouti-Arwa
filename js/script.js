/* ============================================
   UTILITY FUNCTIONS
   ============================================ */
const $ = (s, p = document) => p.querySelector(s);
const $$ = (s, p = document) => [...p.querySelectorAll(s)];

const debounce = (fn, delay) => {
  let timer;
  return (...args) => { clearTimeout(timer); timer = setTimeout(() => fn(...args), delay); };
};

const throttle = (fn, limit) => {
  let inThrottle;
  return (...args) => {
    if (!inThrottle) { fn(...args); inThrottle = true; setTimeout(() => inThrottle = false, limit); }
  };
};

/* ============================================
   PRELOADER
   ============================================ */
window.addEventListener('load', () => {
  setTimeout(() => {
    $('#preloader').classList.add('hidden');
    document.body.style.overflow = '';
  }, 2200);
});
document.body.style.overflow = 'hidden';

/* ============================================
   CUSTOM CURSOR
   ============================================ */
const cursorDot = $('#cursorDot');
const cursorOutline = $('#cursorOutline');
let mouseX = 0, mouseY = 0;
let outlineX = 0, outlineY = 0;

if (window.matchMedia('(pointer: fine)').matches) {
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.transform = `translate(${mouseX - 4}px, ${mouseY - 4}px)`;
  });

  const animateCursor = () => {
    outlineX += (mouseX - outlineX) * 0.15;
    outlineY += (mouseY - outlineY) * 0.15;
    cursorOutline.style.transform = `translate(${outlineX - 20}px, ${outlineY - 20}px)`;
    requestAnimationFrame(animateCursor);
  };
  animateCursor();

  const hoverTargets = 'a, button, .btn, .filter-btn, .skill-category-btn, .social-link, .project-card, .service-card';
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(hoverTargets)) cursorOutline.classList.add('hover');
  });
  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(hoverTargets)) cursorOutline.classList.remove('hover');
  });
}

/* ============================================
   SCROLL PROGRESS BAR
   ============================================ */
const scrollProgress = $('#scrollProgress');
const updateScrollProgress = () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const scrollPercent = (scrollTop / docHeight) * 100;
  scrollProgress.style.width = scrollPercent + '%';
};

/* ============================================
   NAVBAR
   ============================================ */
const navbar = $('#navbar');
const navLinks = $$('.navbar__link');
const sections = $$('section[id]');

const handleNavScroll = () => {
  const scrollY = window.scrollY;

  // Navbar background
  navbar.classList.toggle('scrolled', scrollY > 50);

  // Back to top
  $('#backToTop').classList.toggle('visible', scrollY > 500);

  // Active link
  let current = '';
  sections.forEach(section => {
    const top = section.offsetTop - 150;
    if (scrollY >= top) current = section.getAttribute('id');
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + current) link.classList.add('active');
  });
};

window.addEventListener('scroll', throttle(() => {
  updateScrollProgress();
  handleNavScroll();
}, 50));

// Back to top
$('#backToTop').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ============================================
   HAMBURGER MENU
   ============================================ */
const hamburger = $('#hamburger');
const mobileMenu = $('#mobileMenu');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  mobileMenu.classList.toggle('active');
  document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
});

$$('#mobileMenu a').forEach((link, i) => {
  link.style.transitionDelay = `${0.1 + i * 0.05}s`;
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    mobileMenu.classList.remove('active');
    document.body.style.overflow = '';
  });
});

/* ============================================
   THEME TOGGLE
   ============================================ */
const themeToggle = $('#themeToggle');

function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  if (themeToggle) {
    themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
  }
}

function initThemeToggle() {
  const savedTheme = localStorage.getItem('theme') || 'dark';
  setTheme(savedTheme);

  if (!themeToggle) return;

  themeToggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    setTheme(next);
  });
}

document.addEventListener('DOMContentLoaded', initThemeToggle);

/* ============================================
   TYPED TEXT EFFECT
   ============================================ */
const typedEl = $('#typedText');
window.typedStringsData = {
  fr: ['Développeuse Full Stack', 'Freelancer Créative', 'Passionnée du Web'],
  en: ['Full Stack Developer', 'Creative Freelancer', 'Web Enthusiast'],
  es: ['Desarrolladora Full Stack', 'Freelancer Creativa', 'Entusiasta de la Web'],
  de: ['Full-Stack-Entwicklerin', 'Kreative Freelancerin', 'Web-Enthusiastin'],
  pl: ['Programistka Full Stack', 'Kreatywna Freelancerka', 'Entuzjastka Sieci'],
  ar: ['مطورة ويب شاملة', 'مستقلة مبدعة', 'شغوفة بالويب']
};

window.typedStrings = window.typedStringsData[currentLang] || window.typedStringsData.fr;
let stringIndex = 0;
let charIndex = 0;
let isDeleting = false;

const typeEffect = () => {
  const current = typedStrings[stringIndex];

  if (isDeleting) {
    typedEl.textContent = current.substring(0, charIndex - 1);
    charIndex--;
  } else {
    typedEl.textContent = current.substring(0, charIndex + 1);
    charIndex++;
  }

  let speed = isDeleting ? 40 : 80;

  if (!isDeleting && charIndex === current.length) {
    speed = 2000;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    stringIndex = (stringIndex + 1) % typedStrings.length;
    speed = 500;
  }

  setTimeout(typeEffect, speed);
};

setTimeout(typeEffect, 2500);

/* ============================================
   PARTICLES CANVAS
   ============================================ */
const canvas = $('#particlesCanvas');
const ctx = canvas.getContext('2d');
let particles = [];
let animId;

const resizeCanvas = () => {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
};

class Particle {
  constructor() {
    this.reset();
  }
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 2 + 0.5;
    this.speedX = (Math.random() - 0.5) * 0.8;
    this.speedY = (Math.random() - 0.5) * 0.8;
    this.opacity = Math.random() * 0.5 + 0.1;
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
    if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(108, 99, 255, ${this.opacity})`;
    ctx.fill();
  }
}

const initParticles = () => {
  // Désactiver les particules sur mobile pour les performances
  if (window.innerWidth <= 768) return;
  
  const count = Math.min(80, Math.floor((canvas.width * canvas.height) / 15000));
  particles = Array.from({ length: count }, () => new Particle());
};

const connectParticles = () => {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(108, 99, 255, ${0.1 * (1 - dist / 120)})`;
        ctx.lineWidth = 0.5;
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }
  }
};

const animateParticles = () => {
  // Vérifier si les particules sont activées
  if (particles.length === 0) return;
  
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  connectParticles();
  animId = requestAnimationFrame(animateParticles);
};

resizeCanvas();
initParticles();
animateParticles();

window.addEventListener('resize', debounce(() => {
  resizeCanvas();
  initParticles();
}, 300));

/* ============================================
   SCROLL REVEAL (Intersection Observer)
   ============================================ */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

$$('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(el => {
  revealObserver.observe(el);
});

/* ============================================
   COUNTER ANIMATION
   ============================================ */
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseInt(el.dataset.target);
      if (!target || isNaN(target)) return; // Vérification de sécurité
      
      let current = 0;
      const increment = target / 60;
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        el.textContent = Math.floor(current) + '+';
      }, 30);
      
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

$$('.counter-card__number').forEach(el => counterObserver.observe(el));

/* ============================================
   SKILL BARS ANIMATION
   ============================================ */
const skillBarObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const bar = entry.target;
      bar.style.width = bar.dataset.width + '%';
      bar.classList.add('animated');
      skillBarObserver.unobserve(bar);
    }
  });
}, { threshold: 0.3 });

$$('.skill-card__bar-fill').forEach(bar => skillBarObserver.observe(bar));

/* ============================================
   SKILL CATEGORY FILTER
   ============================================ */
$$('.skill-category-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    $$('.skill-category-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const category = btn.dataset.category;
    $$('.skill-card').forEach(card => {
      if (category === 'all' || card.dataset.skillCategory === category) {
        card.style.display = '';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      } else {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        setTimeout(() => { card.style.display = 'none'; }, 300);
      }
    });
  });
});

/* ============================================
   PORTFOLIO FILTER
   ============================================ */
$$('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    $$('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    $$('.project-card').forEach(card => {
      const show = filter === 'all' || card.dataset.category === filter;
      if (show) {
        card.classList.remove('hidden');
        card.style.display = '';
        setTimeout(() => {
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }, 50);
      } else {
        card.style.opacity = '0';
        card.style.transform = 'scale(0.8)';
        setTimeout(() => {
          card.classList.add('hidden');
        }, 400);
      }
    });
  });
});

/* ============================================
   PROJECT MODAL
   ============================================ */
const projectsData = [
  { title: 'E-Commerce Platform', desc: 'Plateforme e-commerce complète avec système de panier intelligent, paiement Stripe sécurisé, dashboard admin avec analytics en temps réel, gestion des stocks et notifications push. Architecture microservices avec API REST.', tags: ['React', 'Node.js', 'MongoDB', 'Stripe', 'Redux'], img: 'assets/images/project_ecommerce_1774733427452.png' },
  { title: 'Fitness Tracker App', desc: 'Application mobile de suivi fitness avec tracking GPS des activités, visualisation de données avec graphiques interactifs, système de challenges entre amis, intégration avec wearables et partage social.', tags: ['React Native', 'Firebase', 'Charts', 'GPS API'], img: 'assets/images/project_mobile_1774733753942.png' },
  { title: 'Dashboard Analytics', desc: 'Design system complet et dashboard de données avec visualisations interactives D3.js, filtres avancés, export PDF/CSV, mode sombre/clair et responsive design.', tags: ['Figma', 'D3.js', 'Vue.js', 'Tailwind'], img: 'assets/images/project_dashboard_1774733711383.png' },
  { title: 'Blog CMS', desc: 'Système de gestion de contenu moderne avec éditeur WYSIWYG, SEO automatisé, système de commentaires, analytics intégrés, gestion multi-auteurs et API headless.', tags: ['Next.js', 'PostgreSQL', 'Prisma', 'AWS'], img: 'assets/images/project_blog_1774734592112.png' },
  { title: 'API RESTful', desc: 'API REST documentée avec Swagger, authentification JWT + OAuth2, rate limiting, caching Redis, tests automatisés, CI/CD pipeline et monitoring.', tags: ['Node.js', 'Express', 'JWT', 'Redis', 'Docker'], img: 'assets/images/project_dashboard_1774733711383.png' },
  { title: 'Brand Identity', desc: 'Identité visuelle complète pour une startup tech : logo, typographie, palette de couleurs, charte graphique, supports print, templates réseaux sociaux et guidelines.', tags: ['Illustrator', 'Figma', 'Photoshop', 'Branding'], img: 'assets/images/project_brand_1774733771308.png' }
];

function openProjectModal(index) {
  const project = projectsData[index];
  const modal = $('#projectModal');

  $('#modalImage').style.background = `url(${project.img || ''})`;
  $('#modalImage').style.backgroundSize = 'cover';
  $('#modalImage').style.backgroundPosition = 'center';

  $('#modalTitle').textContent = project.title;
  $('#modalDesc').textContent = project.desc;
  $('#modalTags').innerHTML = project.tags.map(t => `<span class="project-card__tag">${t}</span>`).join('');
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeProjectModal() {
  $('#projectModal').classList.remove('active');
  document.body.style.overflow = '';
}

// Event listeners for project buttons and modal
document.addEventListener('DOMContentLoaded', () => {
  // Project detail buttons
  document.querySelectorAll('.project-detail-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const projectIndex = parseInt(btn.dataset.project);
      openProjectModal(projectIndex);
    });
  });

  // Modal close buttons
  document.querySelectorAll('.modal-close').forEach(btn => {
    btn.addEventListener('click', closeProjectModal);
  });
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeProjectModal();
});

/* ============================================
   TESTIMONIALS SLIDER
   ============================================ */
const track = $('#testimonialTrack');
const testimonialCards = $$('.testimonial-card');
const dotsContainer = $('#testimonialDots');
let currentSlide = 0;
let autoPlayTimer;

// Create dots
testimonialCards.forEach((_, i) => {
  const dot = document.createElement('button');
  dot.className = `testimonials__dot${i === 0 ? ' active' : ''}`;
  dot.setAttribute('aria-label', `Slide ${i + 1}`);
  dot.addEventListener('click', () => goToSlide(i));
  dotsContainer.appendChild(dot);
});

const goToSlide = (index) => {
  currentSlide = index;
  track.style.transform = `translateX(-${currentSlide * 100}%)`;
  $$('.testimonials__dot').forEach((d, i) => d.classList.toggle('active', i === currentSlide));
};

$('#prevTestimonial').addEventListener('click', () => {
  goToSlide(currentSlide <= 0 ? testimonialCards.length - 1 : currentSlide - 1);
  resetAutoPlay();
});

$('#nextTestimonial').addEventListener('click', () => {
  goToSlide(currentSlide >= testimonialCards.length - 1 ? 0 : currentSlide + 1);
  resetAutoPlay();
});

const startAutoPlay = () => {
  autoPlayTimer = setInterval(() => {
    goToSlide(currentSlide >= testimonialCards.length - 1 ? 0 : currentSlide + 1);
  }, 5000);
};

const resetAutoPlay = () => {
  clearInterval(autoPlayTimer);
  startAutoPlay();
};

startAutoPlay();

$('#testimonialSlider').addEventListener('mouseenter', () => clearInterval(autoPlayTimer));
$('#testimonialSlider').addEventListener('mouseleave', startAutoPlay);

/* ============================================
   CONTACT FORM VALIDATION
   ============================================ */
const contactForm = $('#contactForm');
const validateField = (input) => {
  const group = input.closest('.form-group');
  let valid = true;

  if (input.required && !input.value.trim()) {
    valid = false;
  }

  if (input.type === 'email' && input.value.trim()) {
    valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value);
  }

  group.classList.toggle('error', !valid);
  group.classList.toggle('success', valid && input.value.trim());
  return valid;
};

$$('#contactForm input, #contactForm textarea').forEach(input => {
  input.addEventListener('blur', () => validateField(input));
  input.addEventListener('input', () => {
    if (input.closest('.form-group').classList.contains('error')) validateField(input);
  });
});

contactForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const inputs = $$('#contactForm input, #contactForm textarea');
  let allValid = true;
  inputs.forEach(input => { if (!validateField(input)) allValid = false; });

  if (allValid) {
    const submitBtn = $('.btn--submit');
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;

    try {
      // Configuration EmailJS (à remplacer par vos vraies clés)
      await emailjs.send(
        'YOUR_SERVICE_ID', // Remplacez par votre Service ID EmailJS
        'YOUR_TEMPLATE_ID', // Remplacez par votre Template ID EmailJS
        {
          from_name: $('#name').value,
          from_email: $('#email').value,
          subject: $('#subject').value,
          message: $('#message').value,
          to_email: 'contact@arwa-chattouti.dev'
        },
        'YOUR_PUBLIC_KEY' // Remplacez par votre Public Key EmailJS
      );

      const toast = $('#toast');
      toast.textContent = 'Message envoyé avec succès !';
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 3000);
      
      contactForm.reset();
      $$('.form-group').forEach(g => { g.classList.remove('success', 'error'); });
      
    } catch (error) {
      console.error('Erreur lors de l\'envoi:', error);
      const toast = $('#toast');
      toast.textContent = 'Erreur lors de l\'envoi. Veuillez réessayer.';
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 3000);
    } finally {
      submitBtn.classList.remove('loading');
      submitBtn.disabled = false;
    }
  }
});

/* ============================================
   RIPPLE EFFECT ON BUTTONS
   ============================================ */
$$('.btn').forEach(btn => {
  btn.addEventListener('click', function(e) {
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    const rect = this.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
    ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });
});

/* ============================================
   3D TILT EFFECT ON CARDS
   ============================================ */
if (window.matchMedia('(hover: hover)').matches) {
  $$('.skill-card, .service-card, .counter-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -8;
      const rotateY = ((x - centerX) / centerX) * 8;
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

/* ============================================
   YEAR IN FOOTER
   ============================================ */
$('#currentYear').textContent = new Date().getFullYear();

/* ============================================
   TOUCH SWIPE FOR TESTIMONIALS
   ============================================ */
let touchStartX = 0;
let touchEndX = 0;

$('#testimonialSlider').addEventListener('touchstart', (e) => {
  touchStartX = e.changedTouches[0].screenX;
}, { passive: true });

$('#testimonialSlider').addEventListener('touchend', (e) => {
  touchEndX = e.changedTouches[0].screenX;
  const diff = touchStartX - touchEndX;
  if (Math.abs(diff) > 50) {
    if (diff > 0) {
      goToSlide(currentSlide >= testimonialCards.length - 1 ? 0 : currentSlide + 1);
    } else {
      goToSlide(currentSlide <= 0 ? testimonialCards.length - 1 : currentSlide - 1);
    }
    resetAutoPlay();
  }
}, { passive: true });