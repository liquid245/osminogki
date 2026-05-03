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
  const ambientStart = window.performance.now();

  const renderMotion = (timestamp = window.performance.now()) => {
    const elapsed = (timestamp - ambientStart) / 1000;
    const ambientA = Math.sin(elapsed * 0.42) * 18;
    const ambientB = Math.cos(elapsed * 0.31) * 22;
    const scrollGlow = Math.min(scrollY * 0.08, 140);

    page.style.setProperty('--sc-pointer-x', `${pointerX}px`);
    page.style.setProperty('--sc-pointer-y', `${pointerY}px`);
    page.style.setProperty('--sc-scroll-glow', `${scrollGlow}px`);
    page.style.setProperty('--sc-ambient-a', `${ambientA}px`);
    page.style.setProperty('--sc-ambient-b', `${ambientB}px`);

    parallaxItems.forEach((item) => {
      const speed = Number.parseFloat(item.dataset.parallaxSpeed || '0.08');
      item.style.setProperty('--sc-parallax-x', `${(pointerX * speed) + (ambientA * speed * 1.8)}px`);
      item.style.setProperty('--sc-parallax-y', `${(scrollY * speed * -1.35) + (pointerY * speed) + (ambientB * speed * 1.8)}px`);
    });

    window.requestAnimationFrame(renderMotion);
  };

  window.addEventListener('pointermove', (event) => {
    pointerX = event.clientX - window.innerWidth / 2;
    pointerY = event.clientY - window.innerHeight / 2;
  }, { passive: true });

  window.addEventListener('scroll', () => {
    scrollY = window.scrollY;
  }, { passive: true });

  window.requestAnimationFrame(renderMotion);
});
