/* CRYPTO® — cart + shared UI (used by index.html and product.html) */

const CART_KEY = "crypto_cart_v1";
const SIZES = ["XS", "S", "M", "L", "XL"];

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
  body.innerHTML = cart.map(item => {
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
  body.innerHTML = `
    <div class="checkout-locked">
      <p class="lock-title">CHECKOUT OPENS WITH<br/>DROP 001 RELEASE</p>
      <p class="lock-sub">FIRST ACCESS GOES TO THE LIST.<br/>DROP LINK LANDS ON INSTAGRAM.</p>
      <form class="news-form" id="lock-form">
        <input type="email" placeholder="EMAIL" required aria-label="Email address" />
        <button type="submit">NOTIFY ME</button>
      </form>
      <p class="news-success" id="lock-success" hidden>YOU'RE ON THE LIST.</p>
      <a class="btn btn-ghost btn-block" href="https://instagram.com" target="_blank" rel="noopener">FOLLOW @WEARCRYPTO</a>
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
  const items = PRODUCTS.filter(p => filter === "all" || p.type === filter);
  grid.innerHTML = items.map(productCard).join("");
}

/* ---- Init ---- */

document.addEventListener("DOMContentLoaded", () => {
  renderCartCount();
  renderGrid("all");

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
      newsForm.hidden = true;
      document.getElementById("news-success").hidden = false;
    });
  }
});
