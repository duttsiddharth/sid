/* SD Advisory — shared behaviour. No dependencies. Loaded with defer on every page. */
(function () {
  'use strict';

  /* ---- Mobile navigation ---- */
  var toggle = document.querySelector('nav .nav-toggle');
  var menu = document.getElementById('nav-menu');
  if (toggle && menu) {
    var setOpen = function (open) {
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      menu.classList.toggle('open', open);
    };
    toggle.addEventListener('click', function () {
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') { setOpen(false); toggle.focus(); }
    });
    menu.addEventListener('click', function (e) {
      if (e.target.closest('a')) setOpen(false);
    });
    window.addEventListener('resize', function () { if (window.innerWidth > 1200) setOpen(false); });
  }

  /* ---- Reveal on scroll (content stays visible if JS or IntersectionObserver is unavailable) ---- */
  var items = document.querySelectorAll('.reveal');
  if (items.length) {
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { en.target.classList.add('visible'); io.unobserve(en.target); }
        });
      }, { threshold: 0.08, rootMargin: '0px 0px -5% 0px' });
      items.forEach(function (el) { io.observe(el); });
    } else {
      items.forEach(function (el) { el.classList.add('visible'); });
    }
  }

  /* ---- AJAX email forms (Formspree). Falls back to a normal POST if JS fails. ---- */
  document.querySelectorAll('form[data-ajax-form]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = form.querySelector('button[type="submit"]');
      var label = btn ? btn.textContent : '';
      var ok = form.parentNode.querySelector('.ok');
      var err = form.parentNode.querySelector('.err');
      if (btn) { btn.disabled = true; btn.textContent = 'Sending…'; }
      if (err) err.style.display = 'none';
      fetch(form.action, { method: 'POST', body: new FormData(form), headers: { 'Accept': 'application/json' } })
        .then(function (r) {
          if (!r.ok) throw new Error('bad status');
          form.style.display = 'none';
          if (ok) ok.style.display = 'block';
        })
        .catch(function () {
          if (btn) { btn.disabled = false; btn.textContent = label; }
          if (err) err.style.display = 'block';
        });
    });
  });
})();
