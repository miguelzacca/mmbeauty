/* ==============================
   JAVASCRIPT — Micaela Marques Beauty
   Lenis + GSAP ScrollTrigger — versão corrigida
   (sem FOUC — nada invisível no carregamento inicial)
   ============================== */

/* ── 1. GSAP Plugin Registration ──────────────────── */
gsap.registerPlugin(ScrollTrigger);

/* ── 2. Lenis Smooth Scroll ───────────────────────── */
const lenis = new Lenis({
  duration: 1.3,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  orientation: 'vertical',
  smoothWheel: true,
  wheelMultiplier: 1,
  touchMultiplier: 1.8,
});
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);
lenis.on('scroll', ScrollTrigger.update);

/* ── 3. Navbar ─────────────────────────────────────── */
const nav = document.getElementById('nav');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

lenis.on('scroll', ({ scroll }) => {
  nav.classList.toggle('scrolled', scroll > 40);
});

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  const bars = hamburger.querySelectorAll('span');
  const isOpen = navLinks.classList.contains('open');
  gsap.to(bars[0], { rotate: isOpen ? 45 : 0, y: isOpen ? 6.5 : 0, duration: 0.3, ease: 'power2.out' });
  gsap.to(bars[1], { opacity: isOpen ? 0 : 1, scaleX: isOpen ? 0 : 1, duration: 0.2 });
  gsap.to(bars[2], { rotate: isOpen ? -45 : 0, y: isOpen ? -6.5 : 0, duration: 0.3, ease: 'power2.out' });
});

/* ── 4. Anchor Smooth Scroll via Lenis ─────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    navLinks.classList.remove('open');
    const bars = hamburger.querySelectorAll('span');
    gsap.to(bars[0], { rotate: 0, y: 0, duration: 0.3, ease: 'power2.out' });
    gsap.to(bars[1], { opacity: 1, scaleX: 1, duration: 0.2 });
    gsap.to(bars[2], { rotate: 0, y: 0, duration: 0.3, ease: 'power2.out' });
    lenis.scrollTo(target, {
      offset: -80,
      duration: 1.6,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
  });
});

/* ── 5. Hero Entrance ───────────────────────────────
   IMPORTANTE: usar gsap.set() EXPLICITAMENTE nos
   elementos que entrarão animados, ANTES do timeline.
   Tudo mais fica visível por padrão.
   ────────────────────────────────────────────────── */

// Esconder SOMENTE os elementos de entrada do hero
gsap.set([
  '.hero__eyebrow',
  '.hero__title',
  '.hero__sub',
  '.hero__content .btn',
  '.hero__scroll',
  '.hero__orb--1',
  '.hero__orb--2',
], { opacity: 0 });

gsap.set(['.hero__title', '.hero__eyebrow', '.hero__sub', '.hero__content .btn'], { y: 30 });
gsap.set('.hero__scroll', { y: 10 });
gsap.set(['.hero__orb--1'], { scale: 0.6 });
gsap.set(['.hero__orb--2'], { scale: 0.5 });

// Animar entrada em cascata após carregamento
const heroTL = gsap.timeline({ delay: 0.2, defaults: { ease: 'power3.out' } });
heroTL
  .to('.hero__eyebrow', { opacity: 0.85, y: 0, duration: 0.9 })
  .to('.hero__title', { opacity: 1, y: 0, duration: 1.1 }, '-=0.55')
  .to('.hero__sub', { opacity: 0.78, y: 0, duration: 0.85 }, '-=0.6')
  .to('.hero__content .btn', { opacity: 1, y: 0, duration: 0.7 }, '-=0.5')
  .to('.hero__scroll', { opacity: 1, y: 0, duration: 0.6 }, '-=0.3')
  .to('.hero__orb--1', { opacity: 1, scale: 1, duration: 1.4, ease: 'power2.out' }, 0.1)
  .to('.hero__orb--2', { opacity: 1, scale: 1, duration: 1.2, ease: 'power2.out' }, 0.3);

/* ── 6. Hero Parallax (scroll-bound scrub) ─────────── */
const parallaxTL = gsap.timeline({
  scrollTrigger: {
    trigger: '.hero',
    start: 'top top',
    end: 'bottom top',
    scrub: 1.4,
    invalidateOnRefresh: true,
  }
});
parallaxTL
  .to('.hero__img', { yPercent: -20, ease: 'none' }, 0)
  .to('.hero__orb--1', { yPercent: -55, xPercent: 6, ease: 'none' }, 0)
  .to('.hero__orb--2', { yPercent: -38, xPercent: -10, rotation: 22, ease: 'none' }, 0)
  .to('.hero__content', { yPercent: -12, ease: 'none' }, 0)
  .to('.hero__scroll', { opacity: 0, yPercent: -30, ease: 'none' }, 0);

/* ── 7. Section Reveal Helper ───────────────────────
   Usa immediateRender: false para que os elementos
   NÃO fiquem invisíveis antes do scroll trigger.
   ────────────────────────────────────────────────── */
function reveal(targets, vars, triggerEl) {
  gsap.from(targets, {
    ...vars,
    immediateRender: false,
    scrollTrigger: {
      trigger: triggerEl || (typeof targets === 'string' ? targets : targets[0]),
      start: 'top 96%',          // dispara cedo, quando o elemento entra na tela
      toggleActions: 'play none none none',
      ...(vars.scrollTrigger || {}),
    },
  });
  delete vars.scrollTrigger;
}

/* ── 8. Labels & Section Titles ─────────────────── */
gsap.utils.toArray('.label').forEach(el => {
  reveal(el, { opacity: 0, y: 20, duration: 0.7, ease: 'power3.out' });
});
gsap.utils.toArray('.section-title').forEach(el => {
  reveal(el, { opacity: 0, y: 35, duration: 0.9, ease: 'power3.out' });
});

/* ── 9. Sobre ────────────────────────────────────── */
reveal('.sobre__img-wrap', { opacity: 0, x: -60, duration: 1.1, ease: 'power3.out' }, '.sobre__grid');
reveal('.sobre__text > *', { opacity: 0, x: 40, duration: 0.85, stagger: 0.12, ease: 'power3.out' }, '.sobre__grid');
reveal('.sobre__badge', { opacity: 0, scale: 0.7, rotate: -8, duration: 0.7, ease: 'back.out(1.8)' });

/* Stats counter */
document.querySelectorAll('.stat__num').forEach(numEl => {
  const text = numEl.textContent.trim();
  const hasPlus = text.startsWith('+');
  const hasPct = text.endsWith('%');
  const raw = parseFloat(text.replace(/[^0-9.]/g, ''));
  if (isNaN(raw)) return;
  const obj = { val: 0 };
  gsap.to(obj, {
    val: raw,
    duration: 1.6,
    ease: 'power2.out',
    immediateRender: false,
    scrollTrigger: {
      trigger: numEl,
      start: 'top 95%',
      toggleActions: 'play none none none',
    },
    onUpdate() {
      numEl.textContent = (hasPlus ? '+' : '') + Math.round(obj.val) + (hasPct ? '%' : '');
    },
  });
});

/* ── 10. Serviços ────────────────────────────────── */
reveal('.servicos__sub', { opacity: 0, y: 24, duration: 0.8, ease: 'power3.out' });

/* Pré-setar estado inicial para evitar flash */
gsap.set('.servico-card', { opacity: 0, y: 40 });

ScrollTrigger.batch('.servico-card', {
  start: 'top 98%',
  onEnter: batch =>
    gsap.to(batch, {
      opacity: 1, y: 0,
      duration: 0.85, stagger: 0.1, ease: 'power2.out',
    }),
});

/* ── 11. Portfólio ───────────────────────────────── */
/* Portfólio sub */
reveal('.portfolio__sub', { opacity: 0, y: 20, duration: 0.7, ease: 'power2.out' }, '.portfolio .container');

/* Pré-setar estado inicial para evitar flash */
gsap.set('.portfolio__item', { opacity: 0, y: 28 });

ScrollTrigger.batch('.portfolio__item', {
  start: 'top 96%',
  onEnter: batch =>
    gsap.to(batch, {
      opacity: 1, y: 0,
      duration: 0.95, stagger: 0.14, ease: 'power2.out',
    }),
});

/* ── 11b. 3D Coverflow Carousel (Bastidores) ─────────
   Each slide is positioned centrally in the stage.
   Offset from active index determines 3D transform:
     rotateY  — cards fan out left/right
     translateX — spread apart horizontally
     translateZ  — push bg cards further back
     scale + opacity — depth perception
   ─────────────────────────────────────────────────── */
(function initCarousel3D() {
  const slides   = Array.from(document.querySelectorAll('.c3d__slide'));
  const dotsWrap = document.getElementById('c3dDots');
  const btnPrev  = document.getElementById('c3dPrev');
  const btnNext  = document.getElementById('c3dNext');
  if (!slides.length) return;

  let active    = 0;
  let isAnimating = false;
  let autoTimer;

  // Hide stage/controls until images load — skeleton shows instead
  gsap.set('.carousel3d__stage, .carousel3d__btn, .carousel3d__dots', { opacity: 0, y: 15 });

  const TOTAL   = slides.length;
  // 3D config per offset slot
  const CONFIG  = [
    // offset: { rotateY, x (px), z (px), scale, opacity }
    { rotateY:   0, x:    0, z:   0,   scale: 1,    opacity: 1     }, // active
    { rotateY: -50, x:  310, z: -160,  scale: 0.82, opacity: 0.72  }, // +1 right
    { rotateY:  50, x: -310, z: -160,  scale: 0.82, opacity: 0.72  }, // -1 left
    { rotateY: -70, x:  530, z: -320,  scale: 0.65, opacity: 0.4   }, // +2
    { rotateY:  70, x: -530, z: -320,  scale: 0.65, opacity: 0.4   }, // -2
  ];

  /* Build dot indicators */
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'c3d__dot';
    dot.setAttribute('aria-label', `Slide ${i + 1}`);
    dot.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(dot);
  });
  const dots = Array.from(dotsWrap.querySelectorAll('.c3d__dot'));

  /* Compute 3D transform for a given offset */
  function getConfig(offset) {
    const abs = Math.abs(offset);
    if (abs === 0) return CONFIG[0];
    const side = offset > 0 ? 1 : -1; // right = 1, left = -1
    const slot = Math.min(abs, 2);     // clamp to 2 visible neighbours
    return {
      rotateY: CONFIG[slot * 2 - (side > 0 ? 1 : 0)].rotateY * (offset > 0 ? -1 : 1),
      x:       CONFIG[slot * 2 - (side > 0 ? 1 : 0)].x       * (offset > 0 ?  1 : -1),
      z:       CONFIG[slot * 2 - (side > 0 ? 1 : 0)].z,
      scale:   CONFIG[slot * 2 - (side > 0 ? 1 : 0)].scale,
      opacity: CONFIG[slot * 2 - (side > 0 ? 1 : 0)].opacity,
    };
  }

  /* Apply GSAP transforms to all slides */
  function render(instant) {
    const dur = instant ? 0 : 0.65;

    slides.forEach((slide, i) => {
      let offset = i - active;
      // wrap-around for circular feel
      if (offset >  TOTAL / 2) offset -= TOTAL;
      if (offset < -TOTAL / 2) offset += TOTAL;

      const absOff = Math.abs(offset);
      const visible = absOff <= 2;

      /* Simplified config lookup */
      let ry, tx, tz, sc, op;
      if (absOff === 0) {
        ry = 0; tx = 0; tz = 0; sc = 1; op = 1;
      } else if (absOff === 1) {
        ry  = offset > 0 ? -50 : 50;
        tx  = offset > 0 ?  310 : -310;
        tz  = -160; sc = 0.82; op = 0.72;
      } else {
        ry  = offset > 0 ? -70 : 70;
        tx  = offset > 0 ?  530 : -530;
        tz  = -320; sc = 0.65; op = 0.4;
      }

      gsap.to(slide, {
        rotateY:    ry,
        x: tx,
        z: tz,
        scale:      sc,
        opacity:    visible ? op : 0,
        filter:     absOff === 0 ? 'brightness(1)' : 'brightness(0.88)',
        zIndex:     10 - absOff,
        duration:   dur,
        ease:       'power3.out',
        overwrite:  'auto',
      });

      slide.classList.toggle('is-active', absOff === 0);
    });

    /* Update dots */
    dots.forEach((d, i) => d.classList.toggle('is-active', i === active));
  }

  /* Navigate */
  function goTo(index, skipAuto) {
    if (isAnimating) return;
    isAnimating = true;
    active = ((index % TOTAL) + TOTAL) % TOTAL;
    render(false);
    setTimeout(() => { isAnimating = false; }, 700);
    if (!skipAuto) resetAuto();
  }

  function next() { goTo(active + 1); }
  function prev() { goTo(active - 1); }

  /* Auto-advance */
  function resetAuto() {
    clearInterval(autoTimer);
    autoTimer = setInterval(next, 3800);
  }

  /* Click on side cards to navigate */
  slides.forEach((slide, i) => {
    slide.addEventListener('click', () => {
      const offset = i - active;
      if (offset === 0) return;
      goTo(i);
    });
  });

  btnPrev.addEventListener('click', prev);
  btnNext.addEventListener('click', next);

  /* Keyboard */
  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') next();
    if (e.key === 'ArrowLeft')  prev();
  });

  /* Touch / swipe */
  let touchStartX = 0;
  const stage = document.querySelector('.carousel3d__stage');
  stage.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  stage.addEventListener('touchend',   e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) diff > 0 ? next() : prev();
  });

  /* ── Skeleton → hide when images ready ───────────── */
  const skeleton  = document.getElementById('c3dSkeleton');
  const imgEls    = slides.map(s => s.querySelector('img')).filter(Boolean);
  let   revealed  = false;

  // Hide skeleton, show carousel, kick off animation
  function revealCarousel() {
    if (revealed) return;
    revealed = true;

    // Fade out skeleton
    if (skeleton) skeleton.classList.add('is-hidden');

    // Render the carousel immediately (positions all slides)
    render(true);

    // Already set to opacity:0 via gsap.set — now animate TO visible
    gsap.to('.carousel3d__stage', {
      opacity: 1, y: 0, duration: 0.85, ease: 'power3.out',
    });
    gsap.to('.carousel3d__btn', {
      opacity: 1, y: 0, duration: 0.7, delay: 0.15, ease: 'power3.out',
    });
    gsap.to('.carousel3d__dots', {
      opacity: 1, y: 0, duration: 0.6, delay: 0.25, ease: 'power3.out',
    });

    resetAuto();
  }

  // Track how many images have loaded
  let loaded = 0;
  function onImgLoad() {
    loaded++;
    if (loaded >= imgEls.length) revealCarousel();
  }

  imgEls.forEach(img => {
    if (img.complete) {
      onImgLoad();
    } else {
      img.addEventListener('load',  onImgLoad, { once: true });
      img.addEventListener('error', onImgLoad, { once: true }); // also reveal on error
    }
  });

  // Safety valve: reveal after 2 s no matter what
  setTimeout(revealCarousel, 2000);

  /* ScrollTrigger: start carousel when section enters view */
  ScrollTrigger.create({
    trigger: '#carousel3d',
    start: 'top 80%',
    once: true,
    onEnter: () => {
      gsap.from('.carousel3d', {
        opacity: 0,
        y: 40,
        duration: 0.9,
        ease: 'power3.out',
      });
    }
  });
})();

/* Parallax nas imagens do portfólio */
document.querySelectorAll('.portfolio__item img').forEach(img => {
  gsap.fromTo(img,
    { yPercent: -8 },
    {
      yPercent: 8, ease: 'none',
      scrollTrigger: {
        trigger: img.closest('.portfolio__item'),
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      }
    }
  );
});

/* ── 12. CTA Strip ───────────────────────────────── */
reveal('.cta-strip__text', { opacity: 0, x: -50, duration: 0.95, ease: 'power3.out' }, '.cta-strip');
reveal('.cta-strip .btn', { opacity: 0, x: 40, duration: 0.9, delay: 0.15, ease: 'power3.out' }, '.cta-strip');

gsap.to('.cta-strip', {
  backgroundPosition: '200% center',
  ease: 'none',
  scrollTrigger: {
    trigger: '.cta-strip',
    start: 'top bottom',
    end: 'bottom top',
    scrub: 2,
  }
});

/* ── 13. Contato ─────────────────────────────────── */
reveal('.contato__info > *', { opacity: 0, x: -40, duration: 0.85, stagger: 0.1, ease: 'power3.out' }, '.contato__grid');
reveal('.contato__form', { opacity: 0, x: 40, y: 20, duration: 1, delay: 0.1, ease: 'power3.out' }, '.contato__grid');
reveal('.contato__item', { opacity: 0, x: -30, duration: 0.65, stagger: 0.12, ease: 'power2.out' }, '.contato__items');
reveal('.form-group', { opacity: 0, y: 18, duration: 0.6, stagger: 0.08, ease: 'power2.out' }, '.contato__form');

/* ── 14. Footer ──────────────────────────────────── */
reveal('.footer__inner > *', { opacity: 0, y: 20, duration: 0.7, stagger: 0.12, ease: 'power2.out' }, '.footer');

/* ── 15. Form submit ─────────────────────────────── */
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    gsap.to(btn, {
      scale: 0.96, duration: 0.1, yoyo: true, repeat: 1,
      onComplete: () => {
        btn.textContent = '✓ Mensagem enviada!';
        btn.style.background = '#2d8a6b';
        btn.disabled = true;
      }
    });
    setTimeout(() => {
      btn.textContent = 'Enviar mensagem';
      btn.style.background = '';
      btn.disabled = false;
      form.reset();
      gsap.to(btn, { scale: 1, duration: 0.3 });
    }, 4000);
  });
}
