/* ========================================
   MOAI-Dispatcher Promotional HP
   JavaScript — Animations & Interactions
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
  // ---- Scroll-triggered fade-in animations ----
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -60px 0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Trigger gauge fill animation
        const gauges = entry.target.querySelectorAll('.gauge-fill');
        gauges.forEach(g => {
          const width = g.getAttribute('data-width');
          if (width) {
            g.style.width = width;
          }
        });
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right').forEach(el => {
    observer.observe(el);
  });

  // ---- Navbar scroll effect ----
  const navbar = document.getElementById('navbar');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    if (currentScroll > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    lastScroll = currentScroll;
  }, { passive: true });

  // ---- Count-up animation ----
  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-count'), 10);
        if (isNaN(target)) return;

        const duration = 1800;
        const startTime = performance.now();

        const updateCount = (currentTime) => {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          // Ease out cubic
          const eased = 1 - Math.pow(1 - progress, 3);
          const current = Math.round(eased * target);

          // Add suffix
          let suffix = '';
          if (el.closest('.stat-number')) {
            suffix = '+';
          }
          el.textContent = current + suffix;

          if (progress < 1) {
            requestAnimationFrame(updateCount);
          }
        };

        requestAnimationFrame(updateCount);
        countObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('[data-count]').forEach(el => {
    countObserver.observe(el);
  });

  // ---- Smooth scroll for anchor links ----
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        const offset = 80; // navbar height
        const y = targetEl.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    });
  });

  // ---- Parallax-like subtle mouse effect on hero ----
  const hero = document.querySelector('.hero');
  if (hero) {
    hero.addEventListener('mousemove', (e) => {
      const rect = hero.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      const visual = hero.querySelector('.hero-visual-card');
      if (visual) {
        visual.style.transform = `perspective(800px) rotateY(${x * 5}deg) rotateX(${-y * 5}deg)`;
      }
    });

    hero.addEventListener('mouseleave', () => {
      const visual = hero.querySelector('.hero-visual-card');
      if (visual) {
        visual.style.transform = 'perspective(800px) rotateY(0deg) rotateX(0deg)';
        visual.style.transition = 'transform 0.5s ease';
        setTimeout(() => {
          visual.style.transition = '';
        }, 500);
      }
    });
  }

  // ---- Contact Form Modal ----
  const modal = document.getElementById('contactModal');
  if (modal) {
    // Open modal from any .contact-trigger link
    document.querySelectorAll('.contact-trigger').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    });

    // Close modal
    const closeModal = () => {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    };

    modal.querySelector('.modal-close')?.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
    });

    // Form submission
    const form = modal.querySelector('#contactForm');
    const successEl = modal.querySelector('.form-success');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        // In production, send form data to server here
        form.style.display = 'none';
        if (successEl) successEl.classList.add('show');
        setTimeout(() => {
          closeModal();
          form.style.display = '';
          form.reset();
          if (successEl) successEl.classList.remove('show');
        }, 3000);
      });
    }
  }
});
