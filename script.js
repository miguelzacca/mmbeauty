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
    immediateRender: false,       // ← chave: não aplica estado inicial antes do trigger
    scrollTrigger: {
      trigger: triggerEl || (typeof targets === 'string' ? targets : targets[0]),
      start: 'top 88%',
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
    duration: 1.8,
    ease: 'power2.out',
    immediateRender: false,
    scrollTrigger: {
      trigger: numEl,
      start: 'top 88%',
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
  start: 'top 92%',
  onEnter: batch =>
    gsap.to(batch, {
      opacity: 1, y: 0,
      duration: 0.85, stagger: 0.1, ease: 'power2.out',
    }),
});

/* ── 11. Portfólio ───────────────────────────────── */
/* Pré-setar estado inicial para evitar flash */
gsap.set('.portfolio__item', { opacity: 0, y: 28 });

ScrollTrigger.batch('.portfolio__item', {
  start: 'top 88%',
  onEnter: batch =>
    gsap.to(batch, {
      opacity: 1, y: 0,
      duration: 0.95, stagger: 0.14, ease: 'power2.out',
    }),
});

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
