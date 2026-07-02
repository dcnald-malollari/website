/* ALLEGEDLY® — cart + shared UI (used by all pages) */

const CART_KEY = "allegedly_cart_v1";
const REF_KEY = "allegedly_ref_v1";
const POPUP_KEY = "allegedly_popup_v1";
const SUBSCRIBED_KEY = "allegedly_subscribed_v1";
const REF_TTL_MS = 30 * 24 * 60 * 60 * 1000; /* 30-day attribution window */
const SIZES = ["XS", "S", "M", "L", "XL"];

/* ---- Referral attribution ---- */

function captureReferral() {
  const code = new URLSearchParams(window.location.search).get("ref");
  if (code && /^[A-Z0-9-]{3,16}$/i.test(code)) {
    localStorage.setItem(REF_KEY, JSON.stringify({ code: code.toUpperCase(), ts: Date.now() }));
    showToast(`PLUG CODE ${code.toUpperCase()} APPLIED`);
  }
}

function activeReferral() {
  try {
    const ref = JSON.parse(localStorage.getItem(REF_KEY) || "null");
    if (ref && Date.now() - ref.ts < REF_TTL_MS) return ref.code;
  } catch { /* no referral */ }
  return null;
}

/* ---- Cart state ---- */

function loadCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  renderCartCount(cart);
}

function cartCount(cart) {
  return cart.reduce((n, item) => n + item.qty, 0);
}

function cartSubtotal(cart) {
  return cart.reduce((sum, item) => {
    const p = getProduct(item.id);
    return sum + (p ? p.price * item.qty : 0);
  }, 0);
}

function addToCart(id, size) {
  const cart = loadCart();
  const existing = cart.find(i => i.id === id && i.size === size);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ id, size, qty: 1 });
  }
  saveCart(cart);
  showToast("ADDED TO CART");
  renderDrawer();
}

function updateQty(id, size, delta) {
  let cart = loadCart();
  const item = cart.find(i => i.id === id && i.size === size);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    cart = cart.filter(i => !(i.id === id && i.size === size));
  }
  saveCart(cart);
  renderDrawer();
}

/* ---- Toast ---- */

let toastTimer = null;
function showToast(msg) {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = msg;
  toast.hidden = false;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => { toast.hidden = true; }, 300);
  }, 1800);
}

/* ---- Cart drawer ---- */

function renderCartCount(cart) {
  const el = document.getElementById("cart-count");
  if (el) el.textContent = cartCount(cart || loadCart());
}

function renderDrawer() {
  const body = document.getElementById("drawer-body");
  const foot = document.getElementById("drawer-foot");
  const countEl = document.getElementById("drawer-count");
  const subEl = document.getElementById("drawer-subtotal");
  if (!body) return;

  const cart = loadCart();
  if (countEl) countEl.textContent = `(${cartCount(cart)})`;
  if (subEl) subEl.textContent = formatPrice(cartSubtotal(cart));

  if (cart.length === 0) {
    body.innerHTML = `
      <div class="drawer-empty">
        <p>YOUR CART IS EMPTY.</p>
        <a href="index.html#shop" class="btn btn-ghost">SHOP DROP 001</a>
      </div>`;
    if (foot) foot.style.display = "none";
    return;
  }

  if (foot) foot.style.display = "";
  const ref = activeReferral();
  const refLine = ref
    ? `<p class="drawer-ref">PLUG CODE ACTIVE: <strong>${ref}</strong> — THEY GET 20% WHEN YOU ORDER.</p>`
    : "";
  body.innerHTML = refLine + cart.map(item => {
    const p = getProduct(item.id);
    if (!p) return "";
    return `
      <div class="cart-item">
        <a class="cart-item-media" href="product.html?id=${p.id}">${garmentSVG(p)}</a>
        <div class="cart-item-info">
          <a class="cart-item-name" href="product.html?id=${p.id}">${p.name}</a>
          <span class="cart-item-meta">SIZE ${item.size} — ${formatPrice(p.price)}</span>
          <div class="qty-controls">
            <button data-act="dec" data-id="${p.id}" data-size="${item.size}" aria-label="Decrease quantity">−</button>
            <span>${item.qty}</span>
            <button data-act="inc" data-id="${p.id}" data-size="${item.size}" aria-label="Increase quantity">+</button>
          </div>
        </div>
      </div>`;
  }).join("");

  body.querySelectorAll("button[data-act]").forEach(btn => {
    btn.addEventListener("click", () => {
      updateQty(btn.dataset.id, btn.dataset.size, btn.dataset.act === "inc" ? 1 : -1);
    });
  });
}

function openDrawer() {
  const drawer = document.getElementById("cart-drawer");
  const overlay = document.getElementById("drawer-overlay");
  if (!drawer) return;
  renderDrawer();
  drawer.hidden = false;
  overlay.hidden = false;
  void drawer.offsetWidth; /* flush layout so the slide-in transition fires */
  drawer.classList.add("open");
  overlay.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeDrawer() {
  const drawer = document.getElementById("cart-drawer");
  const overlay = document.getElementById("drawer-overlay");
  if (!drawer) return;
  drawer.classList.remove("open");
  overlay.classList.remove("open");
  setTimeout(() => {
    drawer.hidden = true;
    overlay.hidden = true;
  }, 300);
  document.body.style.overflow = "";
}

function renderCheckoutLocked() {
  const body = document.getElementById("drawer-body");
  const foot = document.getElementById("drawer-foot");
  if (!body) return;
  if (foot) foot.style.display = "none";
  const ref = activeReferral();
  const refLine = ref ? `<p class="lock-sub">PLUG CODE <strong>${ref}</strong> IS LOCKED TO YOUR ORDER.</p>` : "";
  body.innerHTML = `
    <div class="checkout-locked">
      <p class="lock-title">CHECKOUT OPENS WITH<br/>DROP 001 RELEASE</p>
      ${refLine}
      <p class="lock-sub">FIRST ACCESS GOES TO THE LIST.<br/>DROP LINK LANDS ON INSTAGRAM.</p>
      <p class="lock-sub" style="margin-top:-8px">ALLEGEDLY.</p>
      <form class="news-form" id="lock-form">
        <input type="email" placeholder="EMAIL" required aria-label="Email address" />
        <button type="submit">NOTIFY ME</button>
      </form>
      <p class="news-success" id="lock-success" hidden>YOU'RE ON THE LIST.</p>
      <a class="btn btn-ghost btn-block" href="https://instagram.com/dcnald" target="_blank" rel="noopener">FOLLOW @DCNALD</a>
    </div>`;
  const form = document.getElementById("lock-form");
  form.addEventListener("submit", e => {
    e.preventDefault();
    form.hidden = true;
    document.getElementById("lock-success").hidden = false;
  });
}

/* ---- Product grid (index page only) ---- */

function productCard(p) {
  const badge = p.soldOut
    ? `<span class="badge badge-soldout">SOLD OUT</span>`
    : p.badge
      ? `<span class="badge">${p.badge}</span>`
      : "";
  return `
    <a class="card ${p.soldOut ? "is-soldout" : ""}" href="product.html?id=${p.id}">
      <div class="card-media">${garmentSVG(p)}${badge}</div>
      <div class="card-info">
        <span class="card-name">${p.name}</span>
        <span class="card-price">${p.soldOut ? "SOLD OUT" : formatPrice(p.price)}</span>
      </div>
    </a>`;
}

function renderGrid(filter) {
  const grid = document.getElementById("product-grid");
  if (!grid) return;
  const items = PRODUCTS.filter(p => filter === "all" || p.category === filter);
  grid.innerHTML = items.map(productCard).join("");
}

/* ---- Email capture popup ---- */

function initPopup() {
  if (localStorage.getItem(POPUP_KEY) || localStorage.getItem(SUBSCRIBED_KEY)) return;

  const wrap = document.createElement("div");
  wrap.className = "popup-overlay";
  wrap.id = "popup-overlay";
  wrap.innerHTML = `
    <div class="popup" role="dialog" aria-modal="true" aria-label="Mailing list signup">
      <button class="popup-close" id="popup-close" aria-label="Close">✕</button>
      <p class="popup-kicker">// BEFORE YOU SCROLL</p>
      <h3 class="popup-title">GET 10% OFF<br/>DROP 001</h3>
      <p class="popup-sub">FIRST ACCESS TO DROPS. A CODE FOR 10% OFF YOUR FIRST ORDER. ZERO SPAM — WE DON'T EVEN CONFIRM THIS BRAND EXISTS.</p>
      <form class="news-form popup-form" id="popup-form">
        <input type="email" placeholder="EMAIL" required aria-label="Email address" />
        <button type="submit">CLAIM IT</button>
      </form>
      <div class="popup-success" id="popup-success" hidden>
        <p class="popup-sub">YOU'RE IN. YOUR CODE:</p>
        <p class="popup-code">ALLEGED10</p>
        <p class="popup-sub">SCREENSHOT IT. IT WORKS AT CHECKOUT WHEN DROP 001 GOES LIVE.</p>
      </div>
      <button class="popup-dismiss" id="popup-dismiss">NO THANKS, I PAY FULL PRICE</button>
    </div>`;
  document.body.appendChild(wrap);

  const close = () => {
    localStorage.setItem(POPUP_KEY, "1");
    wrap.classList.remove("show");
    setTimeout(() => wrap.remove(), 300);
  };

  document.getElementById("popup-close").addEventListener("click", close);
  document.getElementById("popup-dismiss").addEventListener("click", close);
  wrap.addEventListener("click", e => { if (e.target === wrap) close(); });

  document.getElementById("popup-form").addEventListener("submit", e => {
    e.preventDefault();
    localStorage.setItem(SUBSCRIBED_KEY, "1");
    localStorage.setItem(POPUP_KEY, "1");
    document.getElementById("popup-form").hidden = true;
    document.getElementById("popup-dismiss").hidden = true;
    document.getElementById("popup-success").hidden = false;
  });

  setTimeout(() => wrap.classList.add("show"), 1800);
}

/* ---- Campaign image (index page) ----
   Resolves local file -> CDN -> hides the section. */
function initCampaign() {
  const img = document.getElementById("campaign-img");
  if (!img || typeof CAMPAIGN_IMG === "undefined") return;
  img.onerror = () => {
    if (CAMPAIGN_IMG.remote && !img.src.startsWith(CAMPAIGN_IMG.remote)) {
      img.src = CAMPAIGN_IMG.remote;
    } else {
      const section = document.getElementById("campaign");
      if (section) section.remove();
    }
  };
  img.src = CAMPAIGN_IMG.local;
}

/* ---- Init ---- */

document.addEventListener("DOMContentLoaded", () => {
  captureReferral();
  renderCartCount();
  renderGrid("all");
  initCampaign();
  initPopup();

  const filters = document.getElementById("filters");
  if (filters) {
    filters.querySelectorAll(".filter").forEach(btn => {
      btn.addEventListener("click", () => {
        filters.querySelectorAll(".filter").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        renderGrid(btn.dataset.filter);
      });
    });
  }

  const openBtn = document.getElementById("cart-open");
  const closeBtn = document.getElementById("cart-close");
  const overlay = document.getElementById("drawer-overlay");
  if (openBtn) openBtn.addEventListener("click", openDrawer);
  if (closeBtn) closeBtn.addEventListener("click", closeDrawer);
  if (overlay) overlay.addEventListener("click", closeDrawer);
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") closeDrawer();
  });

  const checkoutBtn = document.getElementById("checkout-btn");
  if (checkoutBtn) checkoutBtn.addEventListener("click", renderCheckoutLocked);

  const newsForm = document.getElementById("news-form");
  if (newsForm) {
    newsForm.addEventListener("submit", e => {
      e.preventDefault();
      localStorage.setItem(SUBSCRIBED_KEY, "1");
      newsForm.hidden = true;
      document.getElementById("news-success").hidden = false;
    });
  }
});
