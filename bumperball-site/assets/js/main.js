/* Bumper Ball Chicago — site behavior (no dependencies) */
(function () {
  'use strict';

  /* Mobile nav toggle */
  var toggle = document.querySelector('.nav-toggle');
  var header = document.querySelector('.header');
  if (toggle && header) {
    toggle.addEventListener('click', function () {
      var open = header.classList.toggle('nav-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    document.querySelectorAll('.nav a').forEach(function (a) {
      a.addEventListener('click', function () {
        header.classList.remove('nav-open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* Header shadow on scroll */
  function onScroll() {
    if (header) header.classList.toggle('is-scrolled', window.scrollY > 8);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Scroll-reveal */
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });
  } else {
    document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* Print buttons (CSP-safe, no inline handlers) */
  document.querySelectorAll('[data-print]').forEach(function (b) {
    b.addEventListener('click', function () { window.print(); });
  });

  /* Footer year */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* Booking inquiry form (FormSubmit AJAX with mailto fallback) */
  var form = document.getElementById('booking-form');
  if (form) {
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var status = document.getElementById('form-status');
      var btn = form.querySelector('button[type="submit"]');
      var data = new FormData(form);

      /* honeypot */
      if (data.get('_honey')) { return; }

      btn.disabled = true;
      btn.textContent = 'Sending…';
      status.className = 'form-status';

      fetch(form.action, {
        method: 'POST',
        body: data,
        headers: { 'Accept': 'application/json' }
      }).then(function (res) {
        if (!res.ok) throw new Error('send failed');
        form.reset();
        status.className = 'form-status ok';
        status.textContent = "Request sent! We'll get back to you shortly. For same-day answers, call or text (331) 431-1134.";
      }).catch(function () {
        /* Fallback: open the visitor's email app pre-filled */
        var body =
          'Name: ' + (data.get('name') || '') +
          '\nPhone: ' + (data.get('phone') || '') +
          '\nEmail: ' + (data.get('email') || '') +
          '\nEvent date: ' + (data.get('event_date') || '') +
          '\nEvent time: ' + (data.get('event_time') || '') +
          '\nLocation / city: ' + (data.get('location') || '') +
          '\nPackage: ' + (data.get('package') || '') +
          '\nGroup size: ' + (data.get('group_size') || '') +
          '\n\nMessage:\n' + (data.get('message') || '');
        window.location.href = 'mailto:info@bumperballchicago.com'
          + '?subject=' + encodeURIComponent('Booking inquiry — Bumper Ball Chicago')
          + '&body=' + encodeURIComponent(body);
        status.className = 'form-status err';
        status.textContent = "We couldn't reach the form service, so we opened your email app instead — just press send. Or call/text (331) 431-1134.";
      }).finally(function () {
        btn.disabled = false;
        btn.textContent = 'Send Booking Request';
      });
    });
  }
})();
