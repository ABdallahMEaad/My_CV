
/* =========================================================
   CORE JAVASCRIPT
   ========================================================= */
(function() {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Loader ---------- */
  window.addEventListener('load', () => {
    setTimeout(() => {
      document.getElementById('loader').classList.add('hidden');
    }, 1700);
  });

  /* ---------- Theme Toggle ---------- */
  const themeToggle = document.getElementById('themeToggle');
  const savedTheme = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  themeToggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    updateThemeIcon(next);
  });

  function updateThemeIcon(theme) {
    themeToggle.innerHTML = theme === 'dark'
      ? '<i class="fas fa-moon"></i>'
      : '<i class="fas fa-sun"></i>';
  }

  /* ---------- Mobile Menu ---------- */
  const nav = document.getElementById('nav');
  const mobileToggle = document.getElementById('mobileToggle');
  mobileToggle.addEventListener('click', () => {
    nav.classList.toggle('menu-open');
    const icon = mobileToggle.querySelector('i');
    icon.className = nav.classList.contains('menu-open') ? 'fas fa-xmark' : 'fas fa-bars';
  });
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.addEventListener('click', () => {
      nav.classList.remove('menu-open');
      mobileToggle.querySelector('i').className = 'fas fa-bars';
    });
  });

  /* ---------- Scroll Progress ---------- */
  const scrollProgress = document.getElementById('scrollProgress');
  function updateScrollProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const percent = (scrollTop / docHeight) * 100;
    scrollProgress.style.width = percent + '%';
  }

  /* ---------- Back to Top ---------- */
  const backToTop = document.getElementById('backToTop');
  function updateBackToTop() {
    if (window.scrollY > 500) backToTop.classList.add('visible');
    else backToTop.classList.remove('visible');
  }
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---------- Nav scrolled state + active link ---------- */
  const navLinks = document.querySelectorAll('.nav-links a[data-link]');
  function updateNav() {
    if (window.scrollY > 30) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');

    let current = '';
    document.querySelectorAll('section[id]').forEach(section => {
      const top = section.offsetTop - 120;
      if (window.scrollY >= top) current = section.getAttribute('id');
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
  }

  window.addEventListener('scroll', () => {
    updateScrollProgress();
    updateBackToTop();
    updateNav();
  }, { passive: true });

  /* ---------- Reveal on Scroll ---------- */
  if ('IntersectionObserver' in window && !prefersReducedMotion) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');

          // Trigger skill bars
          if (entry.target.classList.contains('skill-card')) {
            entry.target.querySelectorAll('.skill-bar-fill').forEach(bar => {
              bar.style.width = bar.dataset.width + '%';
            });
          }

          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('.reveal').forEach(el => io.observe(el));
  } else {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
    document.querySelectorAll('.skill-bar-fill').forEach(bar => {
      bar.style.width = bar.dataset.width + '%';
    });
  }

  /* ---------- Animated Counters ---------- */
  function animateCounters() {
    document.querySelectorAll('[data-count]').forEach(el => {
      const target = parseInt(el.dataset.count, 10);
      const duration = prefersReducedMotion ? 0 : 1800;
      const start = performance.now();

      function step(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = Math.floor(target * eased);
        el.textContent = value + (target >= 100 ? '+' : '');
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = target + (target >= 100 ? '+' : '');
      }
      requestAnimationFrame(step);
    });
  }

  if ('IntersectionObserver' in window && !prefersReducedMotion) {
    const counterIO = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounters();
          counterIO.disconnect();
        }
      });
    }, { threshold: 0.3 });
    const aboutStats = document.querySelector('.about-stats');
    if (aboutStats) counterIO.observe(aboutStats);
  } else if (prefersReducedMotion) {
    document.querySelectorAll('[data-count]').forEach(el => {
      el.textContent = el.dataset.count + (parseInt(el.dataset.count, 10) >= 100 ? '+' : '');
    });
  } else {
    animateCounters();
  }

  /* ---------- Typing Animation ---------- */
  const typedEl = document.getElementById('typedText');
  const phrases = [
    'Manual Testing',
    'API Testing',
    'Automation Testing',
    'Software Quality Assurance',
    'Selenium Automation'
  ];
  let phraseIdx = 0;
  let charIdx = 0;
  let isDeleting = false;

  function typeStep() {
    const current = phrases[phraseIdx];
    if (!isDeleting) {
      typedEl.textContent = current.substring(0, ++charIdx);
      if (charIdx === current.length) {
        isDeleting = true;
        return setTimeout(typeStep, 1800);
      }
    } else {
      typedEl.textContent = current.substring(0, --charIdx);
      if (charIdx === 0) {
        isDeleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
      }
    }
    setTimeout(typeStep, isDeleting ? 40 : 90);
  }
  typeStep();

  /* ---------- Custom Cursor ---------- */
  const cursorDot = document.getElementById('cursorDot');
  const cursorRing = document.getElementById('cursorRing');
  const cursorGlow = document.getElementById('cursorGlow');
  let mouseX = 0, mouseY = 0;
  let ringX = 0, ringY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.left = mouseX + 'px';
    cursorDot.style.top = mouseY + 'px';
    cursorGlow.style.left = mouseX + 'px';
    cursorGlow.style.top = mouseY + 'px';
  });

  function animateRing() {
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;
    cursorRing.style.left = ringX + 'px';
    cursorRing.style.top = ringY + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();

  document.querySelectorAll('a, button, .project-card, .skill-card, .service-card, .cert-card, .contact-item').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursorRing.style.width = '60px';
      cursorRing.style.height = '60px';
      cursorRing.style.borderColor = 'var(--accent-pink)';
      cursorDot.style.transform = 'scale(2)';
    });
    el.addEventListener('mouseleave', () => {
      cursorRing.style.width = '36px';
      cursorRing.style.height = '36px';
      cursorRing.style.borderColor = 'var(--accent-purple)';
      cursorDot.style.transform = 'scale(1)';
    });
  });

  /* ---------- Ripple Effect ---------- */
  document.querySelectorAll('[data-ripple]').forEach(btn => {
    btn.addEventListener('click', function(e) {
      const ripple = document.createElement('span');
      ripple.classList.add('ripple');
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
      ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });

  /* ---------- Testimonials Carousel ---------- */
  const track = document.getElementById('testimonialsTrack');
  const dots = document.querySelectorAll('.testimonial-dot');
  const totalSlides = dots.length;
  let currentSlide = 0;
  let autoSlide;

  function goToSlide(index) {
    currentSlide = (index + totalSlides) % totalSlides;
    track.style.transform = 'translateX(-' + (currentSlide * 100) + '%)';
    dots.forEach((d, i) => d.classList.toggle('active', i === currentSlide));
  }
  function nextSlide() { goToSlide(currentSlide + 1); }
  function prevSlide() { goToSlide(currentSlide - 1); }

  document.getElementById('nextTest').addEventListener('click', () => { nextSlide(); resetAuto(); });
  document.getElementById('prevTest').addEventListener('click', () => { prevSlide(); resetAuto(); });
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      goToSlide(parseInt(dot.dataset.index, 10));
      resetAuto();
    });
  });

  function startAuto() {
    autoSlide = setInterval(nextSlide, 5000);
  }
  function resetAuto() {
    clearInterval(autoSlide);
    startAuto();
  }
  startAuto();

  /* ---------- Parallax Orbs ---------- */
  if (!prefersReducedMotion) {
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      document.querySelectorAll('.orb').forEach((orb, i) => {
        orb.style.transform = `translateY(${y * (0.1 + i * 0.05)}px)`;
      });
    }, { passive: true });
  }

  /* ---------- Initial UI states ---------- */
  updateNav();
  updateScrollProgress();
})();



