/* ════════════════════════════════
   EcoLoop — Auth + Pagos (localStorage)
   ════════════════════════════════ */

// ── Estado ──
let currentUser = JSON.parse(localStorage.getItem('ecoloop_user')) || null;
let orders = JSON.parse(localStorage.getItem('ecoloop_orders')) || [];

// ── Init ──
document.addEventListener('DOMContentLoaded', () => {
  updateAuthUI();
  setupAuthModals();
  setupPaymentModal();
});

// ════════════════════════════════
// AUTH UI
// ════════════════════════════════
function updateAuthUI() {
  const authBtn = document.getElementById('authBtn');
  if (!authBtn) return;

  if (currentUser) {
    authBtn.innerHTML = `
      <span class="user-avatar">${currentUser.nombre.charAt(0).toUpperCase()}</span>
    `;
    authBtn.title = currentUser.nombre;
    authBtn.onclick = () => openModal('profileModal');
  } else {
    authBtn.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
    `;
    authBtn.title = 'Iniciar sesión';
    authBtn.onclick = () => openModal('loginModal');
  }
}

// ════════════════════════════════
// MODALES
// ════════════════════════════════
function setupAuthModals() {
  // Insertar modales en el DOM
  const modalsHTML = `
  <!-- Login Modal -->
  <div class="eco-modal-overlay" id="loginModal">
    <div class="eco-modal">
      <button class="eco-modal-close" onclick="closeModal('loginModal')">✕</button>
      <div class="eco-modal-header">
        <span class="eco-modal-icon">🌿</span>
        <h2>Bienvenido a EcoLoop</h2>
        <p>Inicia sesión para comprar y guardar tu historial</p>
      </div>
      <form id="loginForm" class="eco-form" onsubmit="handleLogin(event)">
        <div class="eco-field">
          <label>Correo electrónico</label>
          <input type="email" id="loginEmail" placeholder="tu@correo.com" required />
        </div>
        <div class="eco-field">
          <label>Contraseña</label>
          <input type="password" id="loginPass" placeholder="••••••••" required />
        </div>
        <div id="loginError" class="eco-error"></div>
        <button type="submit" class="btn-primary btn-full">Iniciar sesión</button>
      </form>
      <div class="eco-modal-footer">
        <p>¿No tienes cuenta? <a href="#" onclick="switchModal('loginModal','registerModal')">Crear cuenta</a></p>
      </div>
    </div>
  </div>

  <!-- Register Modal -->
  <div class="eco-modal-overlay" id="registerModal">
    <div class="eco-modal">
      <button class="eco-modal-close" onclick="closeModal('registerModal')">✕</button>
      <div class="eco-modal-header">
        <span class="eco-modal-icon">♻️</span>
        <h2>Únete a EcoLoop</h2>
        <p>Crea tu cuenta y empieza a comprar moda circular</p>
      </div>
      <form id="registerForm" class="eco-form" onsubmit="handleRegister(event)">
        <div class="eco-field">
          <label>Nombre completo</label>
          <input type="text" id="regName" placeholder="Tu nombre" required />
        </div>
        <div class="eco-field">
          <label>Correo electrónico</label>
          <input type="email" id="regEmail" placeholder="tu@correo.com" required />
        </div>
        <div class="eco-field">
          <label>Teléfono</label>
          <input type="tel" id="regPhone" placeholder="987 654 321" />
        </div>
        <div class="eco-field">
          <label>Contraseña</label>
          <input type="password" id="regPass" placeholder="Mínimo 6 caracteres" required minlength="6" />
        </div>
        <div id="regError" class="eco-error"></div>
        <button type="submit" class="btn-primary btn-full">Crear cuenta</button>
      </form>
      <div class="eco-modal-footer">
        <p>¿Ya tienes cuenta? <a href="#" onclick="switchModal('registerModal','loginModal')">Iniciar sesión</a></p>
      </div>
    </div>
  </div>

  <!-- Profile Modal -->
  <div class="eco-modal-overlay" id="profileModal">
    <div class="eco-modal">
      <button class="eco-modal-close" onclick="closeModal('profileModal')">✕</button>
      <div class="eco-modal-header">
        <div class="profile-avatar-big" id="profileAvatar"></div>
        <h2 id="profileName"></h2>
        <p id="profileEmail" style="color:var(--text-soft)"></p>
      </div>
      <div class="profile-info">
        <div class="profile-stat">
          <strong id="profileOrders">0</strong>
          <span>Compras</span>
        </div>
        <div class="profile-stat">
          <strong id="profileTotal">S/. 0</strong>
          <span>Total gastado</span>
        </div>
      </div>
      <div id="profileOrderList" class="profile-orders"></div>
      <div class="eco-modal-actions">
        <button class="btn-outline btn-full" onclick="handleLogout()">Cerrar sesión</button>
      </div>
    </div>
  </div>

  <!-- Payment Modal -->
  <div class="eco-modal-overlay" id="paymentModal">
    <div class="eco-modal eco-modal-wide">
      <button class="eco-modal-close" onclick="closeModal('paymentModal')">✕</button>
      <div class="eco-modal-header">
        <span class="eco-modal-icon">💳</span>
        <h2>Finalizar compra</h2>
      </div>

      <div class="payment-summary" id="paymentSummary"></div>

      <div class="payment-methods">
        <h3>Método de pago</h3>
        <div class="pm-options">
          <label class="pm-option" id="pmYape">
            <input type="radio" name="payMethod" value="yape" checked />
            <div class="pm-card">
              <div class="pm-logo yape-logo">
                <span style="font-size:1.6rem">📱</span>
              </div>
              <div>
                <strong>Yape</strong>
                <span>Pago rápido con QR</span>
              </div>
            </div>
          </label>
          <label class="pm-option" id="pmCard">
            <input type="radio" name="payMethod" value="tarjeta" />
            <div class="pm-card">
              <div class="pm-logo card-logo">
                <span style="font-size:1.6rem">💳</span>
              </div>
              <div>
                <strong>Tarjeta</strong>
                <span>Débito o crédito</span>
              </div>
            </div>
          </label>
        </div>
      </div>

      <!-- Yape form -->
      <div id="yapeForm" class="pm-form">
        <div class="yape-qr-box">
          <div class="yape-qr-placeholder">
            <span style="font-size:3rem">📱</span>
            <p><strong>Escanea el código QR</strong></p>
            <p style="font-size:.82rem; color:var(--text-dim)">o ingresa el número: <strong>977 936 578</strong></p>
          </div>
        </div>
        <div class="eco-field">
          <label>Número de operación Yape</label>
          <input type="text" id="yapeOpNum" placeholder="Ej: 123456789" required />
        </div>
      </div>

      <!-- Card form -->
      <div id="cardForm" class="pm-form" style="display:none">
        <div class="eco-field">
          <label>Número de tarjeta</label>
          <input type="text" id="cardNumber" placeholder="4111 1111 1111 1111" maxlength="19" />
        </div>
        <div class="eco-row">
          <div class="eco-field">
            <label>Vencimiento</label>
            <input type="text" id="cardExp" placeholder="MM/AA" maxlength="5" />
          </div>
          <div class="eco-field">
            <label>CVV</label>
            <input type="text" id="cardCvv" placeholder="123" maxlength="4" />
          </div>
        </div>
        <div class="eco-field">
          <label>Nombre en la tarjeta</label>
          <input type="text" id="cardName" placeholder="Como aparece en la tarjeta" />
        </div>
      </div>

      <div class="eco-field">
        <label>Dirección de envío</label>
        <input type="text" id="shipAddress" placeholder="Av. Principal 123, Lima" required />
      </div>

      <div id="payError" class="eco-error"></div>
      <button class="btn-primary btn-full btn-lg" id="payBtn" onclick="processPayment()">
        Confirmar pago
      </button>
      <p style="text-align:center; font-size:.76rem; color:var(--text-dim); margin-top:12px">
        🔒 Simulación segura · No se realizan cobros reales
      </p>
    </div>
  </div>

  <!-- Success Modal -->
  <div class="eco-modal-overlay" id="successModal">
    <div class="eco-modal" style="text-align:center">
      <div class="eco-modal-header">
        <div class="success-check">✓</div>
        <h2>¡Compra exitosa!</h2>
        <p id="successMsg"></p>
      </div>
      <div id="successDetails" class="success-details"></div>
      <button class="btn-primary btn-full" onclick="closeModal('successModal')">Seguir comprando</button>
    </div>
  </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalsHTML);

  // Cerrar modal al click en overlay
  document.querySelectorAll('.eco-modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', e => {
      if (e.target === overlay) closeModal(overlay.id);
    });
  });
}

function setupPaymentModal() {
  // Toggle entre Yape y Tarjeta
  document.addEventListener('change', e => {
    if (e.target.name === 'payMethod') {
      document.getElementById('yapeForm').style.display = e.target.value === 'yape' ? 'block' : 'none';
      document.getElementById('cardForm').style.display = e.target.value === 'tarjeta' ? 'block' : 'none';
    }
  });

  // Formatear número de tarjeta
  document.addEventListener('input', e => {
    if (e.target.id === 'cardNumber') {
      let v = e.target.value.replace(/\D/g, '').substring(0, 16);
      e.target.value = v.replace(/(\d{4})(?=\d)/g, '$1 ');
    }
    if (e.target.id === 'cardExp') {
      let v = e.target.value.replace(/\D/g, '').substring(0, 4);
      if (v.length >= 2) v = v.substring(0, 2) + '/' + v.substring(2);
      e.target.value = v;
    }
  });
}

// ════════════════════════════════
// AUTH HANDLERS
// ════════════════════════════════
// Normaliza el correo para que "Test@Gmail.com " y "test@gmail.com" se traten igual
function normalizeEmail(email) {
  return email.trim().toLowerCase();
}

function handleLogin(e) {
  e.preventDefault();
  const email = normalizeEmail(document.getElementById('loginEmail').value);
  const pass = document.getElementById('loginPass').value;
  const errEl = document.getElementById('loginError');

  const users = JSON.parse(localStorage.getItem('ecoloop_users')) || [];
  const user = users.find(u => u.email === email && u.password === pass);

  if (!user) {
    errEl.textContent = 'Correo o contraseña incorrectos';
    return;
  }

  currentUser = user;
  localStorage.setItem('ecoloop_user', JSON.stringify(user));
  updateAuthUI();
  closeModal('loginModal');
  document.getElementById('loginForm').reset();
  errEl.textContent = '';
}

function handleRegister(e) {
  e.preventDefault();
  const nombre = document.getElementById('regName').value.trim();
  const email = normalizeEmail(document.getElementById('regEmail').value);
  const phone = document.getElementById('regPhone').value.trim();
  const pass = document.getElementById('regPass').value;
  const errEl = document.getElementById('regError');

  const users = JSON.parse(localStorage.getItem('ecoloop_users')) || [];
  const existingIdx = users.findIndex(u => u.email === email);

  const userData = { nombre, email, phone, password: pass, createdAt: new Date().toISOString() };

  if (existingIdx !== -1) {
    // Ya existe una cuenta con ese correo: actualizamos sus datos
    // en vez de bloquear (evita que quede "atascada" información vieja o mal escrita)
    userData.createdAt = users[existingIdx].createdAt;
    users[existingIdx] = userData;
  } else {
    users.push(userData);
  }
  localStorage.setItem('ecoloop_users', JSON.stringify(users));

  currentUser = userData;
  localStorage.setItem('ecoloop_user', JSON.stringify(userData));
  updateAuthUI();
  closeModal('registerModal');
  document.getElementById('registerForm').reset();
  errEl.textContent = '';
}

function handleLogout() {
  currentUser = null;
  localStorage.removeItem('ecoloop_user');
  updateAuthUI();
  closeModal('profileModal');
}

// ════════════════════════════════
// PAYMENT
// ════════════════════════════════
function openPayment() {
  if (!currentUser) {
    openModal('loginModal');
    return;
  }
  if (typeof cart === 'undefined' || cart.length === 0) return;

  // Llenar resumen
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const summaryEl = document.getElementById('paymentSummary');
  summaryEl.innerHTML = `
    <div class="ps-items">
      ${cart.map(i => `
        <div class="ps-item">
          <span>${i.name} × ${i.qty}</span>
          <strong>S/. ${(i.price * i.qty).toFixed(2)}</strong>
        </div>
      `).join('')}
    </div>
    <div class="ps-total">
      <span>Total a pagar</span>
      <strong>S/. ${total.toFixed(2)}</strong>
    </div>
  `;

  closeCart();
  openModal('paymentModal');
}

function processPayment() {
  const method = document.querySelector('input[name="payMethod"]:checked').value;
  const address = document.getElementById('shipAddress').value;
  const errEl = document.getElementById('payError');

  if (!address) { errEl.textContent = 'Ingresa tu dirección de envío'; return; }

  if (method === 'yape') {
    const opNum = document.getElementById('yapeOpNum').value;
    if (!opNum) { errEl.textContent = 'Ingresa el número de operación Yape'; return; }
  } else {
    const cardNum = document.getElementById('cardNumber').value.replace(/\s/g, '');
    const cardExp = document.getElementById('cardExp').value;
    const cardCvv = document.getElementById('cardCvv').value;
    if (cardNum.length < 16) { errEl.textContent = 'Número de tarjeta inválido'; return; }
    if (!cardExp || cardExp.length < 5) { errEl.textContent = 'Fecha de vencimiento inválida'; return; }
    if (!cardCvv || cardCvv.length < 3) { errEl.textContent = 'CVV inválido'; return; }
  }

  errEl.textContent = '';

  // Simular procesamiento
  const btn = document.getElementById('payBtn');
  btn.textContent = 'Procesando...';
  btn.disabled = true;

  setTimeout(() => {
    const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
    const order = {
      id: 'ECO-' + Date.now().toString(36).toUpperCase(),
      date: new Date().toISOString(),
      items: [...cart],
      total,
      method: method === 'yape' ? 'Yape' : 'Tarjeta',
      address,
      user: currentUser.email
    };

    orders.push(order);
    localStorage.setItem('ecoloop_orders', JSON.stringify(orders));

    // Limpiar carrito
    cart.length = 0;
    if (typeof renderCart === 'function') renderCart();

    closeModal('paymentModal');

    // Mostrar éxito
    document.getElementById('successMsg').textContent = `Pedido ${order.id} registrado correctamente`;
    document.getElementById('successDetails').innerHTML = `
      <div class="sd-row"><span>Método:</span><strong>${order.method}</strong></div>
      <div class="sd-row"><span>Total:</span><strong>S/. ${order.total.toFixed(2)}</strong></div>
      <div class="sd-row"><span>Envío a:</span><strong>${order.address}</strong></div>
      <div class="sd-row"><span>Fecha:</span><strong>${new Date().toLocaleDateString('es-PE')}</strong></div>
    `;
    openModal('successModal');

    // Reset
    btn.textContent = 'Confirmar pago';
    btn.disabled = false;
    document.getElementById('yapeOpNum').value = '';
    document.getElementById('shipAddress').value = '';
  }, 1500);
}

// ════════════════════════════════
// MODAL HELPERS
// ════════════════════════════════
function openModal(id) {
  const m = document.getElementById(id);
  if (!m) return;

  if (id === 'profileModal' && currentUser) {
    document.getElementById('profileAvatar').textContent = currentUser.nombre.charAt(0).toUpperCase();
    document.getElementById('profileName').textContent = currentUser.nombre;
    document.getElementById('profileEmail').textContent = currentUser.email;

    const userOrders = orders.filter(o => o.user === currentUser.email);
    const totalSpent = userOrders.reduce((s, o) => s + o.total, 0);
    document.getElementById('profileOrders').textContent = userOrders.length;
    document.getElementById('profileTotal').textContent = `S/. ${totalSpent.toFixed(2)}`;

    const listEl = document.getElementById('profileOrderList');
    if (userOrders.length === 0) {
      listEl.innerHTML = '<p style="text-align:center;color:var(--text-dim);padding:20px">Aún no tienes compras</p>';
    } else {
      listEl.innerHTML = '<h4 style="margin-bottom:12px">Historial</h4>' + userOrders.slice(-5).reverse().map(o => `
        <div class="po-item">
          <div>
            <strong>${o.id}</strong>
            <span>${new Date(o.date).toLocaleDateString('es-PE')}</span>
          </div>
          <div style="text-align:right">
            <strong style="color:var(--neon)">S/. ${o.total.toFixed(2)}</strong>
            <span>${o.method}</span>
          </div>
        </div>
      `).join('');
    }
  }

  m.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal(id) {
  const m = document.getElementById(id);
  if (!m) return;
  m.classList.remove('active');
  if (!document.querySelector('.eco-modal-overlay.active')) {
    document.body.style.overflow = '';
  }
}

function switchModal(from, to) {
  closeModal(from);
  setTimeout(() => openModal(to), 150);
}
