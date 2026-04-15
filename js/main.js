/* ============================================
   AUDAZ Agency — Main JavaScript
   "We don't do quiet."
   ============================================ */

// --- Language Content ---
const LANG = {
  en: {
    nav: { about: 'About', services: 'Services', portfolio: 'Portfolio', blog: 'Blog', contact: 'Contact', book: 'Book a call' },
    footer: { copy: '© 2026 AUDAZ Agency LLC. All rights reserved.', tagline: "We don't do quiet." }
  },
  es: {
    nav: { about: 'Nosotros', services: 'Servicios', portfolio: 'Portafolio', blog: 'Blog', contact: 'Contacto', book: 'Reservar llamada' },
    footer: { copy: '© 2026 AUDAZ Agency LLC. Todos los derechos reservados.', tagline: "No hacemos lo discreto." }
  }
};

// --- State ---
let currentLang = localStorage.getItem('audaz-lang') || 'en';

// --- Init ---
document.addEventListener('DOMContentLoaded', () => {
  initLang();
  initNav();
  initWhatsApp();
  initForms();
  initFilters();
  initAnimations();
  highlightActiveNav();
});

// --- Language Toggle ---
function initLang() {
  const btnEn = document.getElementById('btn-en');
  const btnEs = document.getElementById('btn-es');
  if (btnEn) btnEn.addEventListener('click', () => setLang('en'));
  if (btnEs) btnEs.addEventListener('click', () => setLang('es'));
  applyLang(currentLang);
}

function setLang(lang) {
  currentLang = lang;
  localStorage.setItem('audaz-lang', lang);
  applyLang(lang);
  // Dispatch event for page-specific handlers
  document.dispatchEvent(new CustomEvent('langChange', { detail: { lang } }));
}

function applyLang(lang) {
  // Update toggle buttons
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });
  // Update all [data-en] / [data-es] elements
  document.querySelectorAll('[data-en]').forEach(el => {
    el.innerHTML = el.dataset[lang] || el.dataset.en;
  });
  // Update nav
  const nav = LANG[lang].nav;
  Object.keys(nav).forEach(key => {
    const el = document.getElementById(`nav-${key}`);
    if (el) el.textContent = nav[key];
  });
  // Update footer
  const footer = LANG[lang].footer;
  const footerCopy = document.getElementById('footer-copy');
  const footerTagline = document.getElementById('footer-tagline');
  if (footerCopy) footerCopy.textContent = footer.copy;
  if (footerTagline) footerTagline.textContent = footer.tagline;
}

// --- Mobile Nav ---
function initNav() {
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');
  if (!hamburger || !navLinks) return;
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    hamburger.classList.toggle('open');
  });
  // Close on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
    });
  });
}

// --- Active Nav Highlight ---
function highlightActiveNav() {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === page || (page === 'index.html' && href === '/') || (page === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

// --- WhatsApp Button ---
function initWhatsApp() {
  const btn = document.getElementById('whatsapp-btn');
  if (!btn) return;
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    const msg = currentLang === 'es'
      ? 'Hola! Me interesa una consulta gratuita con AUDAZ Agency.'
      : 'Hi! I\'m interested in a free consultation with AUDAZ Agency.';
    window.open(`https://wa.me/17725710000?text=${encodeURIComponent(msg)}`, '_blank');
  });
}

// --- Contact Form ---
function initForms() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  // Language preference selector
  document.querySelectorAll('.lang-opt').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.lang-opt').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
    });
  });

  // Form submission
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('inp-name').value.trim();
    const email = document.getElementById('inp-email').value.trim();
    if (!name || !email) {
      alert(currentLang === 'es' ? 'Por favor ingresa tu nombre y correo.' : 'Please enter your name and email.');
      return;
    }
    // Show success
    form.style.display = 'none';
    const success = document.getElementById('success-msg');
    if (success) success.style.display = 'block';
    // In production: send to backend or Formspree
    console.log('Form submitted:', { name, email });
  });
}

// --- Portfolio Filter ---
function initFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const tag = btn.dataset.filter;
      document.querySelectorAll('.port-card').forEach(card => {
        if (tag === 'all' || (card.dataset.tags || '').includes(tag)) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

// --- Scroll Animations ---
function initAnimations() {
  if (!('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.animate').forEach(el => observer.observe(el));
}

// --- Smooth Scroll for Anchor Links ---
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// --- Utility: Format Phone ---
function formatPhone(input) {
  const cleaned = input.value.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) input.value = `(${match[1]}) ${match[2]}-${match[3]}`;
}

const phoneInput = document.getElementById('inp-phone');
if (phoneInput) phoneInput.addEventListener('blur', () => formatPhone(phoneInput));
