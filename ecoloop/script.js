/* ── Hero Carousel ── */
(function () {
  var slides = document.querySelectorAll('.c-slide');
  var dots   = document.querySelectorAll('.cdot');
  var prev   = document.getElementById('cPrev');
  var next   = document.getElementById('cNext');
  if (!slides.length) return;

  var current = 0;
  var timer;

  function goTo(idx) {
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = (idx + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
  }

  function start() { timer = setInterval(function () { goTo(current + 1); }, 5500); }
  function reset() { clearInterval(timer); start(); }

  if (prev) prev.addEventListener('click', function () { goTo(current - 1); reset(); });
  if (next) next.addEventListener('click', function () { goTo(current + 1); reset(); });
  dots.forEach(function (dot, i) {
    dot.addEventListener('click', function () { goTo(i); reset(); });
  });

  // Swipe táctil
  var startX = 0;
  var carousel = document.querySelector('.hero-carousel');
  if (carousel) {
    carousel.addEventListener('touchstart', function (e) { startX = e.touches[0].clientX; }, { passive: true });
    carousel.addEventListener('touchend', function (e) {
      var diff = startX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) { goTo(current + (diff > 0 ? 1 : -1)); reset(); }
    }, { passive: true });
  }

  start();
})();

/* ── Header scroll effect ── */
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 10);
}, { passive: true });

/* ── Mobile menu ── */
const hamburger = document.getElementById('hamburger');
const mainNav   = document.getElementById('mainNav');

hamburger.addEventListener('click', () => {
  mainNav.classList.toggle('open');
  const spans = hamburger.querySelectorAll('span');
  if (mainNav.classList.contains('open')) {
    spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
  } else {
    spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  }
});

mainNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  mainNav.classList.remove('open');
  hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
}));

/* ── Search overlay ── */
const searchOverlay = document.getElementById('searchOverlay');
const searchInput   = document.getElementById('searchInput');

document.getElementById('searchToggle').addEventListener('click', () => {
  searchOverlay.classList.add('active');
  setTimeout(() => searchInput.focus(), 100);
});
document.getElementById('searchClose').addEventListener('click', closeSearch);
searchOverlay.addEventListener('click', e => { if (e.target === searchOverlay) closeSearch(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeSearch(); closeCart(); } });

function closeSearch() { searchOverlay.classList.remove('active'); }

/* ── Product filter ── */
const filterBtns   = document.querySelectorAll('.filter-btn');
const productCards = document.querySelectorAll('.product-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const cat = btn.dataset.cat;
    productCards.forEach(card => {
      const match = cat === 'todos' || (card.dataset.cat || '').split(' ').includes(cat);
      card.classList.toggle('hidden', !match);
    });
  });
});

// Category links trigger filter
document.querySelectorAll('.cat-card').forEach(card => {
  card.addEventListener('click', e => {
    e.preventDefault();
    const filter = card.dataset.filter;
    const target = document.querySelector(`.filter-btn[data-cat="${filter}"]`);
    if (target) target.click();
    document.getElementById('tienda').scrollIntoView({ behavior: 'smooth' });
  });
});

/* ── Cart ── */
const cartSidebar = document.getElementById('cartSidebar');
const cartOverlay = document.getElementById('cartOverlay');
const cartBadge   = document.getElementById('cartBadge');
const cartBody    = document.getElementById('cartBody');
const cartFooter  = document.getElementById('cartFooter');
const cartTotalEl = document.getElementById('cartTotal');
let cart = [];

// El carrito solo existe en algunas páginas: guardas null para no romper el resto
const cartToggle = document.getElementById('cartToggle');
const cartClose  = document.getElementById('cartClose');
if (cartToggle) cartToggle.addEventListener('click', openCart);
if (cartClose)  cartClose.addEventListener('click', closeCart);
if (cartOverlay) cartOverlay.addEventListener('click', closeCart);

function openCart() {
  if (!cartSidebar) return;
  cartSidebar.classList.add('active');
  cartOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}
function closeCart() {
  if (!cartSidebar) return;
  cartSidebar.classList.remove('active');
  cartOverlay.classList.remove('active');
  document.body.style.overflow = '';
}

function addToCart(btn, name, price) {
  const existing = cart.find(i => i.name === name);
  if (existing) {
    existing.qty++;
  } else {
    const imgEl = btn.closest('.product-card')?.querySelector('.product-img img');
    cart.push({ name, price, qty: 1, img: imgEl ? imgEl.src : '' });
  }
  renderCart();
  btn.textContent = '✓ Agregado';
  btn.classList.add('added');
  setTimeout(() => { btn.textContent = 'Agregar al carrito'; btn.classList.remove('added'); }, 1800);
  openCart();
}

function removeFromCart(name) {
  cart = cart.filter(i => i.name !== name);
  renderCart();
}

function renderCart() {
  if (!cartBody) return;
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  cartBadge.textContent = cart.reduce((s, i) => s + i.qty, 0);

  if (cart.length === 0) {
    cartBody.innerHTML = `
      <div class="cart-empty">
        <span>🛍️</span>
        <p>Tu carrito está vacío</p>
        <a href="#segunda-mano" data-page="segunda-mano" class="btn-primary" onclick="closeCart()">Ver prendas</a>
      </div>`;
    cartFooter.style.display = 'none';
    return;
  }

  cartBody.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div class="cart-item-info">
        <h4>${item.name}</h4>
        <span class="ci-price">S/. ${item.price} × ${item.qty}</span>
      </div>
      <button class="cart-item-remove" onclick="removeFromCart('${item.name.replace(/'/g, "\\'")}')">✕</button>
    </div>
  `).join('');

  cartTotalEl.textContent = `S/. ${total.toFixed(2)}`;
  cartFooter.style.display = 'block';
}

/* ── Wishlist toggle ── */
document.querySelectorAll('.wishlist-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    btn.classList.toggle('active');
    btn.textContent = btn.classList.contains('active') ? '♥' : '♡';
  });
});

/* ── Newsletter ── */
document.getElementById('nlForm').addEventListener('submit', e => {
  e.preventDefault();
  const input = e.target.querySelector('input');
  const btn   = e.target.querySelector('button');
  btn.textContent = '¡Suscrito! 🌿';
  btn.style.background = '#40916C';
  input.value = '';
  setTimeout(() => { btn.textContent = 'Suscribirme'; btn.style.background = ''; }, 3000);
});

/* ── Formulario de contacto ── */
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    const btn = contactForm.querySelector('button[type="submit"]');
    btn.textContent = '✓ Mensaje enviado';
    btn.style.background = '#40916C';
    btn.disabled = true;
    // ⚠️  CAMBIAR: conecta aquí tu lógica real de envío (Formspree, EmailJS, backend propio)
    setTimeout(() => {
      contactForm.reset();
      btn.textContent = 'Enviar mensaje';
      btn.style.background = '';
      btn.disabled = false;
    }, 3500);
  });
}

/* ── Scroll reveal (clase .reveal → .visible) ── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ── Scroll reveal (cards con stagger) ── */
const cardEls   = document.querySelectorAll('.product-card, .why-card, .stat, .flow-step, .contacto-card, .fb-tag, .ms-hl, .rep-srv, .pilar');
const cardObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      cardObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

cardEls.forEach((el, i) => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = `opacity .5s ease ${(i % 6) * 0.06}s, transform .5s ease ${(i % 6) * 0.06}s`;
  cardObserver.observe(el);
});
