/* SD Advisory — shared behaviour. No dependencies. Loaded with defer on every page.
   Everything here is progressive enhancement: with JavaScript off, all content is visible and forms still submit. */
(function () {
  'use strict';

  var NAV_OFFSET = 72; // compact nav height + breathing room, used when scrolling to anchors

  /* ---------------- Mobile navigation ---------------- */
  var toggle = document.querySelector('nav .nav-toggle');
  var menu = document.getElementById('nav-menu');
  if (toggle && menu) {
    var setOpen = function (open) {
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      menu.classList.toggle('open', open);
    };
    toggle.addEventListener('click', function () { setOpen(toggle.getAttribute('aria-expanded') !== 'true'); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') { setOpen(false); toggle.focus(); }
    });
    menu.addEventListener('click', function (e) { if (e.target.closest('a')) setOpen(false); });
    window.addEventListener('resize', function () { if (window.innerWidth > 1080) setOpen(false); });
  }

  /* ---------------- Header: compact, solid state once the page scrolls ---------------- */
  var navEl = document.querySelector('nav');
  if (navEl) {
    var onScroll = function () { navEl.classList.toggle('is-scrolled', (window.pageYOffset || document.documentElement.scrollTop) > 12); };
    onScroll(); window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------------- Motion preferences: stop the hero's travelling signal for reduced-motion users ---------------- */
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) document.querySelectorAll('svg.net').forEach(function (svg) { if (svg.pauseAnimations) svg.pauseAnimations(); });

  /* ---------------- Metric count-up (final values are already in the HTML; this only animates once, on view) ---------------- */
  var counters = document.querySelectorAll('[data-count]');
  if (counters.length && !reduce && 'IntersectionObserver' in window) {
    var run = function (el) {
      var target = parseFloat(el.getAttribute('data-count'));
      var node = el.firstChild;
      if (!node || node.nodeType !== 3 || isNaN(target)) return;
      var dec = (String(target).split('.')[1] || '').length, t0 = null, dur = 1100;
      var step = function (ts) {
        if (!t0) t0 = ts;
        var k = Math.min(1, (ts - t0) / dur), e = 1 - Math.pow(1 - k, 3);
        node.nodeValue = (target * e).toFixed(dec);
        if (k < 1) requestAnimationFrame(step); else node.nodeValue = target.toFixed(dec);
      };
      requestAnimationFrame(step);
    };
    var cio = new IntersectionObserver(function (es) {
      es.forEach(function (en) { if (en.isIntersecting) { run(en.target); cio.unobserve(en.target); } });
    }, { threshold: 0.6 });
    counters.forEach(function (el) {
      cio.observe(el);
    });
  }

  /* ---------------- Reveal on scroll ---------------- */
  var items = document.querySelectorAll('.reveal');
  if (items.length) {
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('visible'); io.unobserve(en.target); } });
      }, { threshold: 0.08, rootMargin: '0px 0px -5% 0px' });
      items.forEach(function (el) { io.observe(el); });
    } else {
      items.forEach(function (el) { el.classList.add('visible'); });
    }
  }

  /* ---------------- Tabs (WAI-ARIA tabs pattern) ----------------
     Markup: <div data-tabs [data-label="..."] [class="inline"]>
               <div class="tab-panel" id="x" data-tab-title="Title">…</div> … </div>
     - Deep links (#panel-id or any id inside a panel) open the right tab.
     - Left/Right/Home/End move between tabs; the tab bar is sticky under the nav on long pages. */
  var tabGroups = [];
  document.querySelectorAll('[data-tabs]').forEach(function (root, gi) {
    var panels = Array.prototype.filter.call(root.children, function (el) { return el.classList.contains('tab-panel'); });
    if (panels.length < 2) return;
    var inline = root.classList.contains('inline');
    var wrap = document.createElement('div'); wrap.className = 'tablist-wrap';
    var list = document.createElement('div'); list.className = 'tablist'; list.setAttribute('role', 'tablist');
    list.setAttribute('aria-label', root.getAttribute('data-label') || 'Page sections');
    wrap.appendChild(list); root.insertBefore(wrap, panels[0]);

    var tabs = panels.map(function (p, i) {
      if (!p.id) p.id = 'tabpanel-' + gi + '-' + i;
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'tab'; b.id = 'tab-' + p.id; b.setAttribute('role', 'tab');
      b.setAttribute('aria-controls', p.id); b.textContent = p.getAttribute('data-tab-title') || ('Section ' + (i + 1));
      list.appendChild(b);
      p.setAttribute('role', 'tabpanel'); p.setAttribute('aria-labelledby', b.id); p.setAttribute('tabindex', '0');
      if (!inline && i < panels.length - 1) {
        var nx = document.createElement('div'); nx.className = 'tab-next';
        var nb = document.createElement('button'); nb.type = 'button'; nb.className = 'link-arrow';
        nb.appendChild(document.createTextNode('Next: ' + (panels[i + 1].getAttribute('data-tab-title') || 'next section') + ' '));
        var ar = document.createElement('span'); ar.className = 'arr'; ar.setAttribute('aria-hidden', 'true'); ar.textContent = '\u2192'; nb.appendChild(ar);
        nb.addEventListener('click', function () { select(i + 1, true, true); });
        nx.appendChild(nb); p.appendChild(nx);
      }
      return b;
    });

    function select(i, focusTab, scroll, quiet) {
      panels.forEach(function (p, k) {
        var on = k === i; p.hidden = !on;
        tabs[k].setAttribute('aria-selected', on ? 'true' : 'false'); tabs[k].tabIndex = on ? 0 : -1;
        tabs[k].classList.toggle('is-active', on);
      });
      if (focusTab) tabs[i].focus({ preventScroll: true });
      if (!inline && !quiet) { try { history.replaceState(null, '', '#' + panels[i].id); } catch (e) { /* file:// */ } }
      if (scroll && !inline) { // keep the new panel's first line just below the sticky tab bar
        var barBottom = wrap.getBoundingClientRect().bottom;
        var pt = panels[i].getBoundingClientRect().top;
        if (pt < barBottom + 4) window.scrollTo({ top: window.pageYOffset + pt - barBottom - 4, behavior: 'auto' });
      }
      if (list.scrollWidth > list.clientWidth) list.scrollLeft = Math.max(0, tabs[i].offsetLeft - 24); // keep active tab in view on small screens
    }
    tabs.forEach(function (b, i) {
      b.addEventListener('click', function () { select(i, false, true); });
      b.addEventListener('keydown', function (e) {
        var n = null;
        if (e.key === 'ArrowRight') n = (i + 1) % tabs.length;
        else if (e.key === 'ArrowLeft') n = (i - 1 + tabs.length) % tabs.length;
        else if (e.key === 'Home') n = 0; else if (e.key === 'End') n = tabs.length - 1;
        if (n !== null) { e.preventDefault(); select(n, true, false); }
      });
    });
    root.classList.add('tabs-ready');
    select(0, false, false, true);
    tabGroups.push({ root: root, panels: panels, select: select, inline: inline });
  });

  function openFromHash(scrollToTarget) {
    var id = decodeURIComponent((location.hash || '').slice(1));
    if (!id) return;
    var target = document.getElementById(id);
    if (!target) return;
    var hit = false;
    tabGroups.forEach(function (g) {
      g.panels.forEach(function (p, i) { if (p === target || p.contains(target)) { g.select(i, false, false, true); hit = true; } });
    });
    if (hit && scrollToTarget) setTimeout(function () {
      var r = target.getBoundingClientRect();
      window.scrollTo({ top: window.pageYOffset + r.top - NAV_OFFSET - 56, behavior: 'auto' });
    }, 30);
  }
  if (tabGroups.length) {
    openFromHash(true);
    window.addEventListener('hashchange', function () { openFromHash(true); });
    document.addEventListener('click', function (e) { // clicking a link to the hash you are already on
      var a = e.target.closest && e.target.closest('a[href*="#"]');
      if (!a) return;
      var u; try { u = new URL(a.href, location.href); } catch (err) { return; }
      if (u.pathname === location.pathname && u.hash && u.hash === location.hash) setTimeout(function () { openFromHash(true); }, 0);
    });
  }

  /* ---------------- Article contents box: collapsed by default on small screens ---------------- */
  var toc = document.querySelector('details.toc-box');
  if (toc && window.innerWidth < 960) toc.removeAttribute('open');

  /* ---------------- Contact page: focus the first field when arriving via #send ---------------- */
  if (location.hash === '#send') {
    var first = document.querySelector('#send input[type="text"], #send input[type="email"]');
    if (first) setTimeout(function () { first.focus({ preventScroll: true }); }, 60);
  }

  /* ---------------- AJAX forms (Formspree) ----------------
     Success on any OK response without an explicit error. Server validation messages are shown inline.
     Any other failure shows an inline error and keeps the visitor on the page with their text intact. */
  document.querySelectorAll('form[data-ajax-form]').forEach(function (form) {
    var holder = form.parentNode;
    var ok = holder.querySelector('.ok'), err = holder.querySelector('.err');
    var errDefault = err ? err.innerHTML : '';
    var busy = false;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (busy) return;
      if (!form.checkValidity()) { form.reportValidity(); return; }
      var btn = form.querySelector('button[type="submit"]'); var label = btn ? btn.textContent : '';
      busy = true; if (btn) { btn.disabled = true; btn.textContent = 'Sending\u2026'; }
      if (err) { err.style.display = 'none'; err.innerHTML = errDefault; }
      var ctrl = ('AbortController' in window) ? new AbortController() : null;
      var timer = ctrl ? setTimeout(function () { ctrl.abort(); }, 20000) : null;
      var fail = function (msg) {
        busy = false; if (timer) clearTimeout(timer);
        if (btn) { btn.disabled = false; btn.textContent = label; }
        if (err) { if (msg) err.textContent = msg; err.style.display = 'block'; err.setAttribute('tabindex', '-1'); try { err.focus(); } catch (x) { /* noop */ } }
      };
      fetch(form.action, { method: 'POST', body: new FormData(form), headers: { 'Accept': 'application/json' }, signal: ctrl ? ctrl.signal : undefined })
        .then(function (r) { return r.json().catch(function () { return null; }).then(function (d) { return { r: r, d: d }; }); })
        .then(function (x) {
          var good = x.r.ok && !(x.d && (x.d.errors || x.d.error || x.d.ok === false)); // same success rule as the version already confirmed working live
          if (good) {
            busy = false; if (timer) clearTimeout(timer);
            form.style.display = 'none';
            if (ok) { ok.style.display = 'block'; ok.setAttribute('tabindex', '-1'); try { ok.focus(); } catch (y) { /* noop */ } ok.scrollIntoView({ block: 'nearest' }); }
            return;
          }
          var msg = null;
          if (x.d && x.d.errors && x.d.errors.length) msg = x.d.errors.map(function (er) { return er.message; }).join(' ');
          else if (x.d && x.d.error) msg = String(x.d.error);
          fail(msg ? 'Please check the form: ' + msg : null);
        })
        .catch(function () { fail(null); });
    });
  });
})();
