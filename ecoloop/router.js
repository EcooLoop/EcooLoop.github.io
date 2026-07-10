/* ════════════════════════════════
   EcoLoop — Router SPA (una sola página real,
   varias "vistas" mostradas/ocultadas por hash)
   ════════════════════════════════ */

const ECO_PAGES = ['home', 'nosotros', 'segunda-mano', 'moda-sostenible', 'reparaciones', 'contacto'];

function ecoShowPage(pageId, anchor) {
  if (!ECO_PAGES.includes(pageId)) pageId = 'home';

  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const target = document.getElementById('page-' + pageId);
  if (target) target.classList.add('active');

  // Resalta el link de navegación activo
  document.querySelectorAll('[data-page]').forEach(a => {
    a.classList.toggle('active-link', a.dataset.page === pageId);
  });

  // Cierra el menú móvil si estaba abierto
  const mainNav = document.getElementById('mainNav');
  if (mainNav) mainNav.classList.remove('open');

  if (anchor) {
    setTimeout(() => {
      const el = document.getElementById(anchor);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 60);
  } else {
    window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
  }
}

function ecoHandleHash() {
  const raw = decodeURIComponent(location.hash.replace(/^#/, ''));
  const [pageId, anchor] = raw.split('/');
  ecoShowPage(pageId || 'home', anchor);
}

window.addEventListener('hashchange', ecoHandleHash);
document.addEventListener('DOMContentLoaded', ecoHandleHash);
