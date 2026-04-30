document.addEventListener('DOMContentLoaded', () => {
  const page = document.querySelector('.sc-page');
  const revealItems = document.querySelectorAll('.sc-page [data-reveal]');
  const parallaxItems = document.querySelectorAll('.sc-page [data-parallax-bg], .sc-page [data-parallax-content]');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
  let frameRequested = false;

  const renderMotion = () => {
    frameRequested = false;
    page.style.setProperty('--sc-pointer-x', `${pointerX}px`);
    page.style.setProperty('--sc-pointer-y', `${pointerY}px`);

    parallaxItems.forEach((item) => {
      const speed = Number.parseFloat(item.dataset.parallaxSpeed || '0.08');
      item.style.setProperty('--sc-parallax-x', `${pointerX * speed}px`);
      item.style.setProperty('--sc-parallax-y', `${(scrollY * speed * -1) + (pointerY * speed)}px`);
    });
  };

  const requestMotionFrame = () => {
    if (!frameRequested) {
      frameRequested = true;
      window.requestAnimationFrame(renderMotion);
    }
  };

  window.addEventListener('pointermove', (event) => {
    pointerX = event.clientX - window.innerWidth / 2;
    pointerY = event.clientY - window.innerHeight / 2;
    requestMotionFrame();
  }, { passive: true });

  window.addEventListener('scroll', () => {
    scrollY = window.scrollY;
    requestMotionFrame();
  }, { passive: true });

  renderMotion();
});
