(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var live = document.getElementById('live');

  function announce(msg) {
    live.textContent = '';
    setTimeout(function () { live.textContent = msg; }, 30);
  }

  function goTo(hash) {
    var el = document.querySelector(hash);
    if (!el) return;
    el.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
    history.replaceState(null, '', hash);
  }

  /* ── Hero panorama ────────────────────────────────────────────── */

  // Pitch/yaw picked from assets/pano/cafeteria.jpg.
  var STOPS = [
    { label: 'Hotspot', icon: 'fa-route', pitch: -3, yaw: -4,
      title: 'Hotspot', text: 'Hotspots link one room to the next, with a label. This one opens the feature list.',
      href: '#features', action: 'See features' },
    { label: 'Info point', icon: 'fa-circle-info', pitch: -18, yaw: -97,
      title: 'Info point', text: 'Pin a title and text anywhere in a 360° or still image.' },
    { label: 'Privacy editor', icon: 'fa-shield-halved', pitch: -7, yaw: 88,
      title: 'Privacy editor', text: 'Blur or mosaic sensitive details, like locker numbers, before upload.' },
    { label: 'Exit: install', icon: 'fa-door-open', pitch: 53, yaw: 76,
      title: 'Way out', text: 'Follow the exit sign to install Tourbine in one command.',
      href: '#install', action: 'Install now' }
  ];

  var viewer = null;
  var hotspotEls = [];
  var chips = [];
  var rotating = !reduceMotion;

  function openStop(i) {
    hotspotEls.forEach(function (el, j) { el.classList.toggle('open', j === i); });
    chips.forEach(function (c, j) { c.setAttribute('aria-pressed', j === i ? 'true' : 'false'); });
  }

  function setRotating(on) {
    rotating = on;
    var btn = document.getElementById('pano-rotate');
    btn.setAttribute('aria-pressed', on ? 'true' : 'false');
    btn.setAttribute('aria-label', on ? 'Pause rotation' : 'Resume rotation');
    btn.innerHTML = '<i class="fa-solid ' + (on ? 'fa-pause' : 'fa-play') + '" aria-hidden="true"></i>';
    if (!viewer) return;
    if (on) viewer.startAutoRotate(-2.5);
    else viewer.stopAutoRotate();
  }

  function buildHotspot(div, i) {
    var s = STOPS[i];
    div.classList.add('hs');
    div.setAttribute('tabindex', '0');
    div.setAttribute('role', 'button');
    div.setAttribute('aria-label', s.title + ': ' + s.text);
    div.innerHTML =
      '<span class="hs-dot"><i class="fa-solid ' + s.icon + '" aria-hidden="true"></i></span>' +
      '<span class="hs-label">' + s.label + '</span>' +
      '<span class="hs-tip"><strong>' + s.title + '</strong><span>' + s.text + '</span>' +
      (s.href ? '<a href="' + s.href + '" class="hs-go">' + s.action + ' <i class="fa-solid fa-arrow-right" aria-hidden="true"></i></a>' : '') +
      '</span>';
    hotspotEls[i] = div;

    function activate(e) {
      var link = e.target.closest && e.target.closest('.hs-go');
      if (link) {
        e.preventDefault();
        goTo(link.getAttribute('href'));
        return;
      }
      setRotating(false);
      openStop(div.classList.contains('open') ? -1 : i);
    }
    div.addEventListener('click', activate);
    div.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (s.href && div.classList.contains('open')) goTo(s.href);
        else activate(e);
      }
    });
  }

  // On wide screens the hero card covers the left of the viewer, so aim stops at the open area to its right.
  function yawOffset(hfov, pitch) {
    var el = document.getElementById('pano');
    var card = document.querySelector('.hero-card').getBoundingClientRect();
    var w = el.clientWidth;
    if (window.matchMedia('(max-width: 820px)').matches || card.right >= w) return 0;
    var rad = Math.PI / 180;
    var x = (card.right + w) / 2 - w / 2;
    // Yaw differences look smaller on screen the further the view tilts up or down.
    return Math.atan((x / (w / 2)) * Math.tan((hfov / 2) * rad) / Math.cos(pitch * rad)) / rad;
  }

  function initPano() {
    var el = document.getElementById('pano');
    if (!el || !window.pannellum) return;

    try {
      viewer = window.pannellum.viewer(el, {
        type: 'equirectangular',
        panorama: './assets/pano/cafeteria.jpg',
        autoLoad: true,
        showControls: false,
        mouseZoom: false,
        keyboardZoom: false,
        compass: false,
        pitch: -6,
        yaw: -40,
        hfov: 105,
        autoRotate: reduceMotion ? false : -2.5,
        hotSpots: STOPS.map(function (s, i) {
          return { pitch: s.pitch, yaw: s.yaw, cssClass: 'hs-base', createTooltipFunc: buildHotspot, createTooltipArgs: i };
        })
      });
    } catch (err) {
      return;
    }

    viewer.on('load', function () {
      el.classList.add('loaded');
      document.querySelector('.tour-stops').hidden = false;
      document.querySelector('.hero-controls').hidden = false;
    });
    viewer.on('mousedown', function () { if (rotating) setRotating(false); });
    viewer.on('touchstart', function () { if (rotating) setRotating(false); });

    var wrap = document.querySelector('.stops');
    STOPS.forEach(function (s, i) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'stop';
      b.setAttribute('aria-pressed', 'false');
      b.innerHTML = '<i class="fa-solid ' + s.icon + '" aria-hidden="true"></i> ' + s.label;
      b.addEventListener('click', function () {
        setRotating(false);
        viewer.lookAt(s.pitch, s.yaw - yawOffset(95, s.pitch), 95, reduceMotion ? false : 1100);
        openStop(i);
        announce(s.title + '. ' + s.text);
      });
      wrap.appendChild(b);
      chips.push(b);
    });

    document.getElementById('pano-rotate').addEventListener('click', function () { setRotating(!rotating); });
    document.getElementById('pano-full').addEventListener('click', function () { viewer.toggleFullscreen(); });
    if (reduceMotion) setRotating(false);

    // Stop rendering work when the hero is off screen.
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        if (!rotating) return;
        if (entries[0].isIntersecting) viewer.startAutoRotate(-2.5);
        else viewer.stopAutoRotate();
      }).observe(el);
    }
  }

  /* ── Install tabs ─────────────────────────────────────────────── */

  var tabs = Array.prototype.slice.call(document.querySelectorAll('.install-tab'));

  function switchTab(os, focus) {
    tabs.forEach(function (btn) {
      var active = btn.dataset.os === os;
      btn.classList.toggle('active', active);
      btn.setAttribute('aria-selected', active ? 'true' : 'false');
      btn.tabIndex = active ? 0 : -1;
      if (active && focus) btn.focus();
    });
    document.querySelectorAll('.install-panel').forEach(function (panel) {
      panel.classList.toggle('hidden', panel.id !== 'tab-' + os);
    });
  }

  tabs.forEach(function (btn, i) {
    btn.addEventListener('click', function () { switchTab(btn.dataset.os); });
    btn.addEventListener('keydown', function (e) {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      var next = tabs[(i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length];
      switchTab(next.dataset.os, true);
    });
  });

  var platform = (navigator.userAgentData && navigator.userAgentData.platform) || navigator.platform || navigator.userAgent || '';
  var osName = /win/i.test(platform) ? 'Windows' : /mac|iphone|ipad/i.test(platform) ? 'macOS' : /linux|x11|cros/i.test(platform) ? 'Linux' : '';
  if (osName) {
    switchTab(osName === 'Windows' ? 'windows' : 'unix');
    var badge = document.getElementById('os-detected');
    badge.innerHTML = '<i class="fa-solid fa-circle-check" aria-hidden="true"></i> Detected ' + osName;
    badge.hidden = false;
  }

  /* ── Copy buttons ─────────────────────────────────────────────── */

  function fallbackCopy(text) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    var ok = document.execCommand('copy');
    document.body.removeChild(ta);
    return ok ? Promise.resolve() : Promise.reject();
  }

  document.querySelectorAll('.copy-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var code = btn.nextElementSibling.cloneNode(true);
      code.querySelectorAll('.prompt').forEach(function (p) { p.remove(); });
      var text = code.textContent;
      var p = navigator.clipboard && window.isSecureContext ? navigator.clipboard.writeText(text) : fallbackCopy(text);
      p.then(function () {
        btn.classList.add('copied');
        btn.innerHTML = '<i class="fa-solid fa-check" aria-hidden="true"></i> <span>Copied</span>';
        announce('Copied to clipboard');
        setTimeout(function () {
          btn.classList.remove('copied');
          btn.innerHTML = '<i class="fa-regular fa-copy" aria-hidden="true"></i> <span>Copy</span>';
        }, 1600);
      }, function () { announce('Copy failed. Select the text and copy it manually.'); });
    });
  });

  /* ── Nav: active section + scroll state ───────────────────────── */

  var header = document.querySelector('.site-header');
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('nav a[href^="#"]'));

  function onScroll() {
    header.classList.toggle('scrolled', window.scrollY > 8);
    var line = window.innerHeight * 0.35;
    var current = null;
    navLinks.forEach(function (a) {
      var sec = document.querySelector(a.getAttribute('href'));
      if (sec && sec.getBoundingClientRect().top <= line) current = a;
    });
    navLinks.forEach(function (a) {
      if (a === current) a.setAttribute('aria-current', 'true');
      else a.removeAttribute('aria-current');
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ── Reveal on scroll ─────────────────────────────────────────── */

  var reveals = document.querySelectorAll('.reveal');
  if (!reduceMotion && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  initPano();
})();
