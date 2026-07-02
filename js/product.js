/* ALLEGEDLY® — product detail page */

document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const product = getProduct(params.get("id")) || PRODUCTS[0];

  document.title = `ALLEGEDLY® — ${product.name}`;

  /* ---- Gallery ----
     Photo sources resolve in order: local file -> CDN -> SVG mockup. */
  const media = document.getElementById("pdp-media");
  const thumbs = document.getElementById("pdp-thumbs");
  const hasPhoto = Boolean(product.photo || product.photoRemote);
  let photoDead = false;

  function showMock() {
    media.innerHTML = garmentSVG(product);
    setActiveThumb("mock");
  }

  function showPhoto() {
    if (photoDead) return showMock();
    media.innerHTML = "";
    const img = document.createElement("img");
    img.alt = `${product.name} worn by model`;
    img.onerror = () => {
      if (product.photoRemote && !img.src.startsWith(product.photoRemote)) {
        img.src = product.photoRemote;
      } else {
        photoDead = true;
        const deadThumb = thumbs.querySelector('[data-view="photo"]');
        if (deadThumb) deadThumb.remove();
        showMock();
      }
    };
    img.src = product.photo || product.photoRemote;
    media.appendChild(img);
    setActiveThumb("photo");
  }

  function setActiveThumb(view) {
    thumbs.querySelectorAll(".thumb").forEach(t => {
      t.classList.toggle("active", t.dataset.view === view);
    });
  }

  if (hasPhoto) {
    const photoThumb = document.createElement("button");
    photoThumb.className = "thumb";
    photoThumb.dataset.view = "photo";
    photoThumb.setAttribute("aria-label", "View model photo");
    const tImg = document.createElement("img");
    tImg.alt = "";
    tImg.loading = "lazy";
    tImg.onerror = () => {
      if (product.photoRemote && !tImg.src.startsWith(product.photoRemote)) {
        tImg.src = product.photoRemote;
      } else {
        photoThumb.remove();
      }
    };
    tImg.src = product.photo || product.photoRemote;
    photoThumb.appendChild(tImg);
    photoThumb.addEventListener("click", showPhoto);
    thumbs.appendChild(photoThumb);
  }

  const mockThumb = document.createElement("button");
  mockThumb.className = "thumb thumb-mock";
  mockThumb.dataset.view = "mock";
  mockThumb.setAttribute("aria-label", "View flat mockup");
  mockThumb.innerHTML = garmentSVG(product);
  mockThumb.addEventListener("click", showMock);
  thumbs.appendChild(mockThumb);

  if (hasPhoto) showPhoto(); else showMock();

  /* ---- Info ---- */
  document.getElementById("pdp-name").textContent = product.name;
  document.getElementById("pdp-desc").textContent = product.desc;

  const priceEl = document.getElementById("pdp-price");
  const kickerEl = document.getElementById("pdp-kicker");
  priceEl.textContent = product.soldOut ? "SOLD OUT" : formatPrice(product.price);
  if (product.badge && !product.soldOut) {
    kickerEl.textContent = `// DROP 001 — ${product.badge}`;
  }

  /* ---- Sizes ---- */
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

  /* ---- Add to cart ---- */
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

  /* ---- Related ---- */
  const related = PRODUCTS.filter(p => p.id !== product.id).slice(0, 4);
  document.getElementById("related-grid").innerHTML = related.map(productCard).join("");
});
