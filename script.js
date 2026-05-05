/* ==================== EXPIA — Main Script ==================== */
document.addEventListener('DOMContentLoaded', () => {

  /* ========== DOM SELECTORS ========== */
  const navbar = document.getElementById('navbar');
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');
  const backToTop = document.getElementById('backToTop');
  const contactForm = document.getElementById('contactForm');
  const formFeedback = document.getElementById('formFeedback');
  const allNavLinks = document.querySelectorAll('.nav-link');
  const revealEls = document.querySelectorAll('.reveal');
  const serviceCards = document.querySelectorAll('.service-card');
  const counters = document.querySelectorAll('.counter');
  const sections = document.querySelectorAll('section[id]');

  /* ========== 1. NAVBAR SCROLL EFFECT ========== */
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
    backToTop.classList.toggle('visible', window.scrollY > 600);
    highlightActiveNav();
  });

  /* ========== 2. MOBILE MENU ========== */
  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    navLinks.classList.toggle('mobile-open');
    document.body.style.overflow = navLinks.classList.contains('mobile-open') ? 'hidden' : '';
  });

  // Close mobile menu on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      menuToggle.classList.remove('active');
      navLinks.classList.remove('mobile-open');
      document.body.style.overflow = '';
    });
  });

  /* ========== 3. SMOOTH SCROLL ========== */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      const offset = navbar.offsetHeight + 20;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ========== 4. ACTIVE NAV LINK (IntersectionObserver) ========== */
  function highlightActiveNav() {
    let current = '';
    sections.forEach(section => {
      const top = section.getBoundingClientRect().top;
      if (top <= 150) {
        current = section.getAttribute('id');
      }
    });
    allNavLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
  }

  /* ========== 5. SCROLL REVEAL ========== */
  const revealObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });

  revealEls.forEach(el => revealObserver.observe(el));

  /* ========== 6. SERVICE CARD DYNAMIC GRADIENT ========== */
  serviceCards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
      card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
    });
  });

  /* ========== 7. STATS COUNTER ANIMATION ========== */
  const counterObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.getAttribute('data-target'), 10);
      const duration = 2000;
      const startTime = performance.now();

      function update(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
        el.textContent = Math.floor(eased * target) + (target === 99 ? '%' : target >= 50 ? '+' : '');
        if (progress < 1) requestAnimationFrame(update);
        else el.textContent = target + (target === 99 ? '%' : target >= 50 ? '+' : '');
      }

      requestAnimationFrame(update);
      obs.unobserve(el);
    });
  }, { threshold: 0.4 });

  counters.forEach(c => counterObserver.observe(c));

  /* ========== 8. BACK TO TOP ========== */
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ========== 9. CONTACT FORM ========== */
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const btn = contactForm.querySelector('button[type="submit"]');
    const btnText = btn.querySelector('.btn-text');
    const btnLoading = btn.querySelector('.btn-loading');

    // Show loading
    btn.classList.add('loading');
    btnLoading.hidden = false;
    btnText.hidden = true;
    formFeedback.hidden = true;

    // Gather data
    const formData = {
      lastname: document.getElementById('lastname').value.trim(),
      firstname: document.getElementById('firstname').value.trim(),
      email: document.getElementById('email').value.trim(),
      phone: document.getElementById('phone').value.trim(),
      message: document.getElementById('message').value.trim(),
    };

    // Simulate sending (replace with real endpoint)
    try {
      // For demo: simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Send to a real service — uncomment and configure:
      // const res = await fetch('https://your-api.com/contact', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData),
      // });
      // if (!res.ok) throw new Error('Erreur réseau');

      // Success
      formFeedback.className = 'form-feedback success';
      formFeedback.textContent = '✅ Merci ' + formData.firstname + ' ! Votre demande a bien été envoyée. Nous vous répondrons sous 24h.';
      formFeedback.hidden = false;
      contactForm.reset();
    } catch (err) {
      formFeedback.className = 'form-feedback error';
      formFeedback.textContent = '❌ Une erreur est survenue. Veuillez réessayer ou nous contacter directement par email.';
      formFeedback.hidden = false;
    } finally {
      btn.classList.remove('loading');
      btnLoading.hidden = true;
      btnText.hidden = false;
    }
  });

  /* ========== 10. INITIAL STATE ========== */
  highlightActiveNav();
});
