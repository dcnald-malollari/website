/* ALLEGEDLY® — The Plug Program (referral signup page)
   Front-end only: generates + persists the code locally. Wire the payout
   ledger to the commerce backend when payments go live. */

const REF_ACCOUNT_KEY = "allegedly_ref_account_v1";

function makeRefCode(handle) {
  const base = handle.replace(/^@/, "").replace(/[^a-zA-Z0-9]/g, "").toUpperCase().slice(0, 6) || "PLUG";
  const salt = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `${base}-${salt}`;
}

function showRefResult(account) {
  const result = document.getElementById("ref-result");
  const form = document.getElementById("ref-form");
  document.getElementById("ref-code").textContent = account.code;
  const link = `${window.location.origin}${window.location.pathname.replace("referral.html", "")}index.html?ref=${account.code}`;
  document.getElementById("ref-link").value = link;
  form.hidden = true;
  result.hidden = false;
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("ref-form");
  if (!form) return;

  // Returning plug: show their existing code
  try {
    const saved = JSON.parse(localStorage.getItem(REF_ACCOUNT_KEY) || "null");
    if (saved && saved.code) showRefResult(saved);
  } catch { /* fresh visitor */ }

  form.addEventListener("submit", e => {
    e.preventDefault();
    const handle = document.getElementById("ref-handle").value.trim();
    const email = document.getElementById("ref-email").value.trim();
    if (!handle || !email) return;
    const account = { handle, email, code: makeRefCode(handle), createdAt: Date.now() };
    localStorage.setItem(REF_ACCOUNT_KEY, JSON.stringify(account));
    showRefResult(account);
    showToast("CODE GENERATED. YOU'RE THE PLUG NOW.");
  });

  const copyBtn = document.getElementById("ref-copy");
  copyBtn.addEventListener("click", () => {
    const input = document.getElementById("ref-link");
    input.select();
    const done = () => showToast("LINK COPIED");
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(input.value).then(done, () => {
        document.execCommand("copy");
        done();
      });
    } else {
      document.execCommand("copy");
      done();
    }
  });
});
