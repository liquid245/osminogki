document.addEventListener('DOMContentLoaded', () => {
  const page = document.querySelector('.sc-page');
  const header = document.querySelector('.site-header--summer-camp');
  const navToggle = header?.querySelector('.sc-nav-toggle');
  const navLinks = header?.querySelector('.nav-links');
  const revealItems = document.querySelectorAll('.sc-page [data-reveal]');
  const parallaxItems = document.querySelectorAll('.sc-page [data-parallax-bg], .sc-page [data-parallax-content]');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (navToggle && navLinks) {
    const setMenuOpen = (isOpen) => {
      header.classList.toggle('is-nav-open', isOpen);
      navToggle.setAttribute('aria-expanded', String(isOpen));
    };

    navToggle.addEventListener('click', () => {
      setMenuOpen(navToggle.getAttribute('aria-expanded') !== 'true');
    });

    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => setMenuOpen(false));
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        setMenuOpen(false);
      }
    });
  }

  if (revealItems.length) {
    if (!('IntersectionObserver' in window)) {
      revealItems.forEach((item) => item.classList.add('is-visible'));
    } else {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.14,
        rootMargin: '0px 0px -8% 0px'
      });

      revealItems.forEach((item) => observer.observe(item));
    }
  }

  if (!page || reduceMotion) {
    return;
  }

  let pointerX = 0;
  let pointerY = 0;
  let scrollY = window.scrollY;
  let rafId = null;
  let idleTimer = null;
  const IDLE_MS = 300;

  const setCSSProperties = () => {
    const ambientA = 0;
    const ambientB = 0;
    const scrollGlow = Math.min(scrollY * 0.08, 140);

    page.style.setProperty('--sc-pointer-x', `${pointerX}px`);
    page.style.setProperty('--sc-pointer-y', `${pointerY}px`);
    page.style.setProperty('--sc-scroll-glow', `${scrollGlow}px`);
    page.style.setProperty('--sc-ambient-a', `${ambientA}px`);
    page.style.setProperty('--sc-ambient-b', `${ambientB}px`);

    parallaxItems.forEach((item) => {
      const speed = Number.parseFloat(item.dataset.parallaxSpeed || '0.08');
      item.style.setProperty('--sc-parallax-x', `${pointerX * speed}px`);
      item.style.setProperty('--sc-parallax-y', `${(scrollY * speed * -1.35) + (pointerY * speed)}px`);
    });
  };

  const startLoop = () => {
    if (rafId !== null) return;
    const frame = () => {
      setCSSProperties();
      rafId = requestAnimationFrame(frame);
    };
    rafId = requestAnimationFrame(frame);
  };

  const stopLoop = () => {
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  };

  window.addEventListener('pointermove', (event) => {
    pointerX = event.clientX - window.innerWidth / 2;
    pointerY = event.clientY - window.innerHeight / 2;
    startLoop();
    clearTimeout(idleTimer);
    idleTimer = setTimeout(stopLoop, IDLE_MS);
  }, { passive: true });

  window.addEventListener('scroll', () => {
    scrollY = window.scrollY;
    startLoop();
    clearTimeout(idleTimer);
    idleTimer = setTimeout(stopLoop, IDLE_MS);

    const progressBar = document.querySelector('.sc-scroll-progress');
    if (progressBar) {
      const scrollPercent = (scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      progressBar.style.width = `${Math.min(scrollPercent, 100)}%`;
      progressBar.setAttribute('aria-valuenow', Math.round(Math.min(scrollPercent, 100)));
    }
  }, { passive: true });

  setCSSProperties();

  const progressBar = document.querySelector('.sc-scroll-progress');
  if (progressBar) {
    const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    progressBar.style.width = `${Math.min(scrollPercent, 100)}%`;
    progressBar.setAttribute('aria-valuenow', Math.round(Math.min(scrollPercent, 100)));
  }
});
