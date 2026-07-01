/* CRYPTO® — product detail page */

document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const product = getProduct(params.get("id")) || PRODUCTS[0];

  document.title = `CRYPTO® — ${product.name}`;

  document.getElementById("pdp-media").innerHTML = garmentSVG(product);
  document.getElementById("pdp-name").textContent = product.name;
  document.getElementById("pdp-desc").textContent = product.desc;

  const priceEl = document.getElementById("pdp-price");
  const kickerEl = document.getElementById("pdp-kicker");
  priceEl.textContent = product.soldOut ? "SOLD OUT" : formatPrice(product.price);
  if (product.badge && !product.soldOut) {
    kickerEl.textContent = `// DROP 001 — ${product.badge}`;
  }

  // Sizes
  let selectedSize = null;
  const sizeRow = document.getElementById("size-row");
  const sizeError = document.getElementById("size-error");
  SIZES.forEach(size => {
    const btn = document.createElement("button");
    btn.className = "size-btn";
    btn.textContent = size;
    btn.disabled = product.soldOut;
    btn.addEventListener("click", () => {
      selectedSize = size;
      sizeError.hidden = true;
      sizeRow.querySelectorAll(".size-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
    });
    sizeRow.appendChild(btn);
  });

  // Add to cart
  const addBtn = document.getElementById("add-btn");
  if (product.soldOut) {
    addBtn.textContent = "SOLD OUT";
    addBtn.disabled = true;
  } else {
    addBtn.addEventListener("click", () => {
      if (!selectedSize) {
        sizeError.hidden = false;
        return;
      }
      addToCart(product.id, selectedSize);
      openDrawer();
    });
  }

  // Related products
  const related = PRODUCTS.filter(p => p.id !== product.id).slice(0, 4);
  document.getElementById("related-grid").innerHTML = related.map(productCard).join("");
});
