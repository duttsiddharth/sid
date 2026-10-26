/*! SD Advisory — top & bottom running banners. Drop-in, no dependencies. */
(function () {
  if (window.__sdTickers) return; window.__sdTickers = true;

  var CONFIG = {
    speedPxPerSec: 55,
    top: [
      { text: "Enterprise AI Transformation for IT Operations" },
      { text: "Built for CIOs, CTOs, IT Operations, ITSM & GCC leaders" },
      { text: "Assess Your AI Readiness", href: "/assessment.html" },
      { text: "Book a Consultation", href: "https://calendly.com/dutt-siddharth/free-30-min-consultation", external: true }
    ],
    bottom: [
      { text: "AI Transformation Advisory", href: "/ai-transformation-advisory.html" },
      { text: "Intelligent IT Operations", href: "/intelligent-it-operations.html" },
      { text: "AI & ITSM Accelerators", href: "/accelerators.html" },
      { text: "Transformation & Delivery Leadership", href: "/transformation-delivery.html" },
      { text: "AI Resilience by Design", href: "/ai-resilience-by-design.html" },
      { text: "ITIL Expert · PRINCE2 Practitioner · AWS Solutions Architect" },
      { text: "20+ years of enterprise IT service delivery" }
    ]
  };

  var css = [
    ":root{--sdt-bg:#0B1220;--sdt-fg:#E6EDF7;--sdt-mute:#9FB0C8;--sdt-cyan:#22D3EE;--sdt-h:36px}",
    ".sdt{position:relative;display:flex;align-items:center;height:var(--sdt-h);overflow:hidden;background:var(--sdt-bg);color:var(--sdt-fg);font:600 12px/1 Manrope,system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;letter-spacing:.05em;text-transform:uppercase;z-index:9998}",
    ".sdt--top{border-bottom:1px solid rgba(59,130,246,.35)}",
    ".sdt--bottom{position:fixed;left:0;right:0;bottom:0;border-top:1px solid rgba(59,130,246,.35);padding-right:40px}",
    ".sdt__track{display:flex;flex:none;white-space:nowrap;will-change:transform;animation:sdt-scroll var(--sdt-dur,40s) linear infinite}",
    ".sdt--bottom .sdt__track{animation-direction:reverse}",
    ".sdt:hover .sdt__track{animation-play-state:paused}",
    ".sdt__item{display:inline-flex;align-items:center;padding:0 22px;color:var(--sdt-fg);text-decoration:none}",
    ".sdt__item::after{content:'';width:5px;height:5px;margin-left:44px;border-radius:50%;background:var(--sdt-cyan);opacity:.85}",
    ".sdt--top a.sdt__item{color:var(--sdt-cyan)}",
    ".sdt--bottom .sdt__item{color:var(--sdt-mute)}",
    "a.sdt__item:hover{color:#fff;text-decoration:underline}",
    ".sdt__close{position:absolute;right:0;top:0;height:100%;width:40px;border:0;background:linear-gradient(90deg,transparent,var(--sdt-bg) 35%);color:var(--sdt-mute);font-size:18px;cursor:pointer}",
    ".sdt__close:hover{color:#fff}",
    "@keyframes sdt-scroll{from{transform:translateX(0)}to{transform:translateX(-50%)}}",
    "@media (max-width:600px){:root{--sdt-h:32px}.sdt{font-size:11px}.sdt__item{padding:0 14px}.sdt__item::after{margin-left:28px}}",
    "@media (prefers-reduced-motion:reduce){.sdt__track{animation:none}.sdt{overflow-x:auto}}",
    "@media print{.sdt{display:none!important}}"
  ].join("");

  var style = document.createElement("style");
  style.id = "sdt-style"; style.textContent = css;
  document.head.appendChild(style);

  function build(items, cls, label) {
    var bar = document.createElement("div");
    bar.className = "sdt " + cls; bar.setAttribute("role", "region"); bar.setAttribute("aria-label", label);
    var track = document.createElement("div"); track.className = "sdt__track";
    for (var copy = 0; copy < 2; copy++) {
      items.forEach(function (it) {
        var el = document.createElement(it.href ? "a" : "span");
        el.className = "sdt__item"; el.textContent = it.text;
        if (it.href) { el.href = it.href; if (it.external) { el.target = "_blank"; el.rel = "noopener"; } }
        if (copy) { el.setAttribute("aria-hidden", "true"); el.tabIndex = -1; }
        track.appendChild(el);
      });
    }
    bar.appendChild(track);
    return { bar: bar, track: track };
  }

  function setSpeed(t) {
    var half = t.scrollWidth / 2;
    if (half > 0) t.style.setProperty("--sdt-dur", (half / CONFIG.speedPxPerSec).toFixed(1) + "s");
  }

  function init() {
    var top = build(CONFIG.top, "sdt--top", "Announcements");
    document.body.insertBefore(top.bar, document.body.firstChild);

    var bot = build(CONFIG.bottom, "sdt--bottom", "Capabilities");
    var close = document.createElement("button");
    close.className = "sdt__close"; close.type = "button"; close.setAttribute("aria-label", "Dismiss banner"); close.innerHTML = "&times;";
    bot.bar.appendChild(close);
    document.body.appendChild(bot.bar);

    var KEY = "sdt-bottom-closed", bottomOn = true;
    var basePad = parseFloat(getComputedStyle(document.body).paddingBottom) || 0;

    function barH() { return top.bar.offsetHeight || 0; }
    function botH() { return bottomOn ? bot.bar.offsetHeight : 0; }

    function hideBottom() { bottomOn = false; bot.bar.remove(); document.body.style.paddingBottom = basePad + "px"; layout(); }
    try { if (sessionStorage.getItem(KEY)) { bottomOn = false; bot.bar.remove(); } } catch (e) {}
    close.addEventListener("click", function () {
      hideBottom(); try { sessionStorage.setItem(KEY, "1"); } catch (e) {}
    });

    /* Fixed elements pinned to the top (e.g. the nav) sit just below the top banner,
       and slide up to 0 as the page scrolls. Fixed elements pinned near the bottom
       (back-to-top, floating CTAs) are lifted above the bottom banner. */
    var tracked = [];
    function scan() {
      var all = document.body.getElementsByTagName("*");
      for (var i = 0; i < all.length; i++) {
        var el = all[i];
        if (el.__sdt || top.bar.contains(el) || bot.bar.contains(el)) continue;
        var cs = getComputedStyle(el);
        if (cs.position !== "fixed") continue;
        var t = parseFloat(cs.top), b = parseFloat(cs.bottom);
        el.__sdt = true;
        if (t <= 1 && !(b <= 1)) tracked.push({ el: el, kind: "top", base: t });
        else if (b <= 60 && !(t <= 1)) tracked.push({ el: el, kind: "bottom", base: b });
      }
    }
    function layout() {
      var h = barH(), y = window.pageYOffset || 0, bh = botH();
      document.body.style.paddingBottom = (basePad + bh) + "px";
      document.documentElement.style.scrollPaddingBottom = bh + "px";
      tracked.forEach(function (o) {
        if (o.kind === "top") o.el.style.top = Math.max(o.base, h - y + o.base) + "px";
        else o.el.style.bottom = (o.base + bh) + "px";
      });
    }
    var ticking = false;
    window.addEventListener("scroll", function () {
      if (ticking) return; ticking = true;
      requestAnimationFrame(function () { ticking = false; layout(); });
    }, { passive: true });

    function fit() { setSpeed(top.track); setSpeed(bot.track); scan(); layout(); }
    fit();
    window.addEventListener("load", fit);
    window.addEventListener("resize", layout);
    setTimeout(fit, 600); setTimeout(fit, 1800);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
