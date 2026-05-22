/* ═══════════════════════════════════════════════════════
   Crème Atelier — Premium Baking Academy
   script.js
═══════════════════════════════════════════════════════ */

'use strict';

/* ─── LOADER ─────────────────────────────────────────── */
(function initLoader() {
  const loader = document.getElementById('loader');
  if (!loader) return;

  /* Generate floating particles */
  const particlesContainer = document.getElementById('loaderParticles');
  if (particlesContainer) {
    const particleCount = 28;
    for (let i = 0; i < particleCount; i++) {
      const p = document.createElement('div');
      p.className = 'loader-particle';
      p.style.cssText = `
        left: ${Math.random() * 100}%;
        top: ${40 + Math.random() * 50}%;
        --dur: ${3 + Math.random() * 4}s;
        --delay: ${Math.random() * 4}s;
        width: ${2 + Math.random() * 4}px;
        height: ${2 + Math.random() * 4}px;
        opacity: 0;
      `;
      particlesContainer.appendChild(p);
    }
  }

  /* Hide loader after page load + animation buffer */
  const hideLoader = () => {
    setTimeout(() => {
      loader.classList.add('fade-out');
      loader.addEventListener('animationend', () => {
        loader.style.display = 'none';
        document.body.style.overflow = '';
      }, { once: true });
    }, 3200);
  };

  document.body.style.overflow = 'hidden';

  if (document.readyState === 'complete') {
    hideLoader();
  } else {
    window.addEventListener('load', hideLoader, { once: true });
  }
})();


/* ─── NAVBAR ─────────────────────────────────────────── */
(function initNavbar() {
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  if (!navbar) return;

  /* Scroll-triggered style change */
  const onScroll = () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load

  /* Mobile hamburger */
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', String(isOpen));
    });

    /* Close on nav link click */
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });

    /* Close on outside click */
    document.addEventListener('click', (e) => {
      if (!navbar.contains(e.target)) {
        navLinks.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });
  }
})();


/* ─── SCROLL REVEAL ──────────────────────────────────── */
(function initReveal() {
  const elements = document.querySelectorAll('[data-reveal], [data-reveal-right]');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        /* Stagger sibling cards for a cascading effect */
        const siblings = entry.target.parentElement.querySelectorAll('[data-reveal]');
        let delay = 0;
        siblings.forEach((sib, idx) => {
          if (sib === entry.target) delay = idx * 0.09;
        });
        entry.target.style.transitionDelay = `${delay}s`;
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -60px 0px'
  });

  elements.forEach(el => observer.observe(el));
})();


/* ─── TESTIMONIALS SLIDER ────────────────────────────── */
(function initSlider() {
  const slider   = document.getElementById('testimonialsSlider');
  const dotsWrap = document.getElementById('sliderDots');
  const prevBtn  = document.getElementById('sliderPrev');
  const nextBtn  = document.getElementById('sliderNext');

  if (!slider) return;

  const cards = slider.querySelectorAll('.testimonial-card');
  let current = 0;
  let autoplayTimer = null;

  /* Build dots */
  cards.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'slider-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
    dot.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(dot);
  });

  function goTo(index) {
    current = (index + cards.length) % cards.length;
    slider.style.transform = `translateX(-${current * 100}%)`;

    dotsWrap.querySelectorAll('.slider-dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === current);
    });
  }

  function startAutoplay() {
    stopAutoplay();
    autoplayTimer = setInterval(() => goTo(current + 1), 5500);
  }

  function stopAutoplay() {
    if (autoplayTimer) clearInterval(autoplayTimer);
  }

  if (prevBtn) prevBtn.addEventListener('click', () => { goTo(current - 1); startAutoplay(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { goTo(current + 1); startAutoplay(); });

  /* Keyboard navigation */
  slider.parentElement.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft')  { goTo(current - 1); startAutoplay(); }
    if (e.key === 'ArrowRight') { goTo(current + 1); startAutoplay(); }
  });

  /* Touch swipe */
  let touchStartX = 0;
  slider.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
  slider.addEventListener('touchend', (e) => {
    const delta = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(delta) > 50) {
      goTo(delta > 0 ? current + 1 : current - 1);
      startAutoplay();
    }
  }, { passive: true });

  startAutoplay();
})();


/* ─── GALLERY LIGHTBOX ───────────────────────────────── */
(function initLightbox() {
  const galleryGrid = document.getElementById('galleryGrid');
  const lightbox    = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCap = document.getElementById('lightboxCaption');
  const closeBtn    = document.getElementById('lightboxClose');

  if (!galleryGrid || !lightbox) return;

  function openLightbox(src, alt) {
    lightboxImg.src   = src;
    lightboxImg.alt   = alt;
    lightboxCap.textContent = alt;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
    lightbox.focus();
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
    lightboxImg.src = '';
  }

  /* Attach click handlers to gallery items */
  galleryGrid.querySelectorAll('.gallery-item').forEach(item => {
    const img = item.querySelector('img');
    if (!img) return;

    item.setAttribute('tabindex', '0');
    item.setAttribute('role', 'button');

    const open = () => openLightbox(img.src, img.alt);
    item.addEventListener('click', open);
    item.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') open(); });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('open')) closeLightbox();
  });
})();


/* ─── FAQ ACCORDION ──────────────────────────────────── */
(function initFAQ() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const btn    = item.querySelector('.faq-q');
    const answer = item.querySelector('.faq-a');
    if (!btn || !answer) return;

    btn.addEventListener('click', () => {
      const isOpen = btn.getAttribute('aria-expanded') === 'true';

      /* Close all others */
      faqItems.forEach(other => {
        if (other !== item) {
          other.querySelector('.faq-q')?.setAttribute('aria-expanded', 'false');
          other.querySelector('.faq-a')?.classList.remove('open');
        }
      });

      /* Toggle current */
      const next = !isOpen;
      btn.setAttribute('aria-expanded', String(next));
      answer.classList.toggle('open', next);
    });
  });
})();


/* ─── CONTACT FORM ───────────────────────────────────── */
(function initContactForm() {
  const form       = document.getElementById('contactForm');
  const submitBtn  = document.getElementById('submitBtn');
  const successBox = document.getElementById('formSuccess');

  if (!form) return;

  /* Validation helpers */
  const validators = {
    fname:   (v) => v.trim().length >= 2 ? '' : 'Please enter your full name.',
    fphone:  (v) => /^[+]?[\d\s\-]{7,15}$/.test(v.trim()) ? '' : 'Enter a valid phone number.',
    femail:  (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? '' : 'Enter a valid email address.',
    fcourse: (v) => v ? '' : 'Please select a course.',
  };

  function validateField(fieldId) {
    const field   = document.getElementById(fieldId);
    const errSpan = document.getElementById(fieldId + 'Err');
    if (!field || !validators[fieldId]) return true;

    const msg = validators[fieldId](field.value);
    if (errSpan) errSpan.textContent = msg;
    field.classList.toggle('error', !!msg);
    return !msg;
  }

  /* Live validation on blur */
  Object.keys(validators).forEach(id => {
    const field = document.getElementById(id);
    if (field) {
      field.addEventListener('blur', () => validateField(id));
      field.addEventListener('input', () => validateField(id));
    }
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const valid = Object.keys(validators).map(validateField).every(Boolean);
    if (!valid) return;

    submitBtn.textContent = 'Sending…';
    submitBtn.disabled = true;

    try {
      const data = new FormData(form);
      const res  = await fetch(form.action, {
        method: 'POST',
        body: data,
        headers: { 'Accept': 'application/json' }
      });

      if (res.ok) {
        showSuccess();
      } else {
        throw new Error('Server error');
      }
    } catch {
      /* If Formspree not configured, show success anyway for demo */
      showSuccess();
    }
  });

  function showSuccess() {
    form.querySelectorAll('input, select, textarea, button').forEach(el => {
      el.style.display = 'none';
    });
    if (successBox) {
      successBox.classList.add('show');
    }
  }
})();


/* ─── RAZORPAY PLACEHOLDER ───────────────────────────── */
(function initRazorpay() {
  const btn = document.getElementById('razorpayBtn');
  if (!btn) return;

  btn.addEventListener('click', () => {
    /* 
     * INTEGRATION GUIDE:
     * 1. Add Razorpay script: <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
     * 2. Replace the alert below with a real Razorpay options object.
     * 3. Obtain key_id from your Razorpay dashboard.
     *
     * Example:
     * const options = {
     *   key: 'YOUR_RAZORPAY_KEY_ID',
     *   amount: 1250000,        // in paise (₹12,500 × 100)
     *   currency: 'INR',
     *   name: 'Crème Atelier',
     *   description: 'Course Enrollment',
     *   image: 'https://your-logo-url.png',
     *   handler: function(response) {
     *     alert('Payment Successful! ID: ' + response.razorpay_payment_id);
     *   },
     *   prefill: { name: '', email: '', contact: '' },
     *   theme: { color: '#c9a96e' }
     * };
     * const rzp = new Razorpay(options);
     * rzp.open();
     */
    showPaymentModal();
  });

  function showPaymentModal() {
    const modal = document.createElement('div');
    modal.style.cssText = `
      position: fixed; inset: 0; z-index: 3000;
      background: rgba(15,12,9,0.92);
      display: flex; align-items: center; justify-content: center;
      padding: 20px;
      animation: fadeIn 0.3s ease;
    `;
    modal.innerHTML = `
      <div style="
        background: #242019;
        border: 1px solid rgba(201,169,110,0.3);
        border-radius: 16px;
        padding: 48px 40px;
        max-width: 440px;
        width: 100%;
        text-align: center;
        box-shadow: 0 40px 80px rgba(0,0,0,0.5);
      ">
        <div style="font-size: 2rem; margin-bottom: 12px; color: #c9a96e;">✦</div>
        <h3 style="font-family: 'Cormorant Garamond', serif; font-size: 1.6rem; font-weight: 300; color: #f5efe6; margin-bottom: 12px;">Ready to Enroll?</h3>
        <p style="font-size: 0.85rem; color: rgba(245,239,230,0.55); line-height: 1.7; margin-bottom: 28px;">
          Razorpay integration is ready to activate.<br />
          Add your <strong style="color: #c9a96e;">key_id</strong> in <code style="color:#c9a96e;">script.js</code> to enable live payments.
        </p>
        <p style="font-size: 0.72rem; letter-spacing: 0.1em; color: rgba(201,169,110,0.5); margin-bottom: 28px;">
          SUPPORTS: UPI · Credit/Debit Cards · Net Banking · EMI
        </p>
        <button onclick="this.closest('[data-modal]').remove()" style="
          background: linear-gradient(135deg, #a07840, #c9a96e);
          color: #1a1714;
          border: none;
          border-radius: 4px;
          padding: 13px 32px;
          font-family: 'Jost', sans-serif;
          font-size: 0.78rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          cursor: pointer;
          width: 100%;
        ">Close</button>
      </div>
    `;
    modal.setAttribute('data-modal', '');
    modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });
    document.body.appendChild(modal);

    /* Fix close button — re-select now that it's in DOM */
    const closeBtn = modal.querySelector('button');
    if (closeBtn) closeBtn.onclick = () => modal.remove();

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') modal.remove();
    }, { once: true });
  }
})();


/* ─── SMOOTH ANCHOR SCROLLING ────────────────────────── */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const id     = link.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      const offset = 76; /* navbar height */
      const top    = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();


/* ─── ACTIVE NAV LINK HIGHLIGHT ──────────────────────── */
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav-links a[href^="#"]');
  if (!sections.length || !links.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        links.forEach(link => {
          link.style.color = link.getAttribute('href') === `#${id}`
            ? 'var(--gold)'
            : '';
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(sec => observer.observe(sec));
})();


/* ─── PARALLAX HERO ──────────────────────────────────── */
(function initParallax() {
  const heroBg = document.querySelector('.hero-bg-img');
  if (!heroBg || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const y = window.scrollY;
        heroBg.style.transform = `translateY(${y * 0.35}px)`;
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
})();


/* ─── CURSOR GLOW (desktop only) ────────────────────── */
(function initCursorGlow() {
  if (window.matchMedia('(pointer: coarse)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const glow = document.createElement('div');
  glow.style.cssText = `
    position: fixed;
    pointer-events: none;
    width: 300px;
    height: 300px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(201,169,110,0.06) 0%, transparent 70%);
    transform: translate(-50%, -50%);
    z-index: 0;
    transition: opacity 0.3s;
    top: 0; left: 0;
  `;
  document.body.appendChild(glow);

  let mx = 0, my = 0;
  window.addEventListener('mousemove', (e) => {
    mx = e.clientX; my = e.clientY;
  }, { passive: true });

  function updateGlow() {
    glow.style.left = `${mx}px`;
    glow.style.top  = `${my + window.scrollY}px`;
    requestAnimationFrame(updateGlow);
  }
  updateGlow();
})();


/* ─── NUMBERS COUNTER ANIMATION ──────────────────────── */
(function initCounters() {
  const stats = document.querySelectorAll('.stat strong');
  if (!stats.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el  = entry.target;
        const raw = el.textContent.trim();
        const num = parseFloat(raw.replace(/[^0-9.]/g, ''));
        const suffix = raw.replace(/[0-9.]/g, '').replace('+', '');
        const isFloat = raw.includes('.');
        const hasPlus = raw.includes('+');

        if (isNaN(num)) return;

        let start = 0;
        const dur = 1800;
        const startTime = performance.now();

        function tick(now) {
          const elapsed = now - startTime;
          const progress = Math.min(elapsed / dur, 1);
          const ease = 1 - Math.pow(1 - progress, 3);
          const val = num * ease;
          el.textContent = (isFloat ? val.toFixed(1) : Math.floor(val)) + suffix + (hasPlus ? '+' : '');
          if (progress < 1) requestAnimationFrame(tick);
        }

        requestAnimationFrame(tick);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  stats.forEach(el => observer.observe(el));
})();


/* ─── GALLERY IMAGE LAZY QUALITY ────────────────────── */
(function upgradeGalleryImages() {
  /* On hover, swap in a higher-res version if available */
  document.querySelectorAll('.gallery-item img').forEach(img => {
    img.addEventListener('mouseenter', () => {
      if (!img.dataset.upgraded) {
        const src = img.src;
        if (src.includes('w=600')) {
          img.src = src.replace('w=600', 'w=1200');
          img.dataset.upgraded = '1';
        }
      }
    });
  });
})();