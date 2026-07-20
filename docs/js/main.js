// صِلِ — landing page interactions

// Reveal-on-scroll
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        observer.unobserve(e.target);
      }
    });
  },
  { threshold: 0.15 }
);
document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

// Nav border, reading progress and back-to-top on scroll
const nav = document.getElementById('nav');
const progress = document.getElementById('scrollProgress');
const toTop = document.getElementById('toTop');
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  nav.classList.toggle('scrolled', y > 30);
  if (progress) {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
  }
  if (toTop) toTop.hidden = y < 600;
}, { passive: true });
if (toTop) toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// Mobile menu
const burger = document.getElementById('navBurger');
const mobileMenu = document.getElementById('mobileMenu');
if (burger && mobileMenu) {
  burger.addEventListener('click', () => {
    const open = mobileMenu.classList.toggle('open');
    burger.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', open);
    burger.setAttribute('aria-label', open ? 'إغلاق القائمة' : 'فتح القائمة');
  });
  mobileMenu.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') {
      mobileMenu.classList.remove('open');
      burger.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
    }
  });
}

// Spotlight that follows the cursor on cards
if (window.matchMedia('(pointer: fine)').matches) {
  document.querySelectorAll('.how-card, .times-widget, .faq-item').forEach((card) => {
    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX - r.left}px`);
      card.style.setProperty('--my', `${e.clientY - r.top}px`);
    });
  });
}

// Subtle parallax tilt on the hero phone
const heroPhone = document.getElementById('heroPhone');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (heroPhone && !reduceMotion && window.matchMedia('(pointer: fine)').matches) {
  const hero = document.querySelector('.hero');
  hero.addEventListener('mousemove', (e) => {
    const r = hero.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    heroPhone.style.transform = `rotateY(${x * -7}deg) rotateX(${y * 5}deg)`;
  });
  hero.addEventListener('mouseleave', () => { heroPhone.style.transform = ''; });
  heroPhone.style.transition = 'transform 0.3s ease';
  heroPhone.style.transformStyle = 'preserve-3d';
}

// Starfield background
const canvas = document.getElementById('stars');
if (canvas && !reduceMotion) {
  const ctx = canvas.getContext('2d');
  let stars = [];

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const count = Math.min(140, Math.floor(canvas.width / 10));
    stars = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.3 + 0.3,
      tw: Math.random() * Math.PI * 2,
      sp: 0.008 + Math.random() * 0.015,
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const s of stars) {
      s.tw += s.sp;
      const a = 0.25 + Math.abs(Math.sin(s.tw)) * 0.5;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(212, 178, 106, ${a})`;
      ctx.fill();
    }
    requestAnimationFrame(draw);
  }

  resize();
  window.addEventListener('resize', resize);
  draw();
}
