/* Alwin Siby portfolio: interactions, motion and live GitHub data */
(function () {
  'use strict';

  var USER = 'alwinsibym';
  /* Repositories already shown as project cards */
  var FEATURED = [
    'crisis-command', 'blueprint', 'campus-bus-tracker',
    'malayalam-meme-extension', 'minnal_murali'
  ];
  /* Repositories listed under "More repositories", in this order */
  var MORE = [
    'inspire-ai-smart-image-gallery', 'Corex_26', 'Tatz_by-maveli',
    'imagecompressor', 'QRgenerator-python', 'cl-cybersec-bashscriptportscanning'
  ];
  /* Never shown in "Latest on GitHub" */
  var HIDE = [USER.toLowerCase(), 'personal_website'];
  var LANG_COLORS = {
    HTML: '#e34c26', CSS: '#563d7c', JavaScript: '#f1e05a', TypeScript: '#3178c6',
    Python: '#3572A5', 'C++': '#f34b7d', C: '#8a8a8a', Java: '#b07219', Shell: '#89e051', SQL: '#e38c00'
  };

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var root = document.documentElement;

  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $all(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }
  function clamp(n, a, b) { return Math.min(b, Math.max(a, n)); }

  /* ---------- Split hero name into letters ---------- */
  (function splitLetters() {
    var idx = 0;
    $all('[data-split]').forEach(function (word) {
      var text = word.textContent;
      word.textContent = '';
      var inner = document.createElement('span');
      inner.setAttribute('aria-hidden', 'true');
      text.split('').forEach(function (c) {
        var s = document.createElement('span');
        s.className = 'ch';
        s.style.setProperty('--i', idx++);
        s.textContent = c;
        inner.appendChild(s);
      });
      word.appendChild(inner);
    });
  })();

  /* ---------- Section titles: wrap for the mask reveal ---------- */
  var titles = $all('.section-title');
  titles.forEach(function (h) {
    var t = h.textContent;
    h.textContent = '';
    var m = document.createElement('span');
    m.className = 'mask';
    var s = document.createElement('span');
    s.textContent = t;
    m.appendChild(s);
    h.appendChild(m);
  });

  /* ---------- Marquee: duplicate the list for a seamless loop ---------- */
  (function marquee() {
    var track = $('#marquee-track');
    var list = $('ul', track);
    var clone = list.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    track.appendChild(clone);
  })();

  /* ---------- Theme toggle with circular reveal ---------- */
  var themeBtn = $('#theme-toggle');
  function syncThemeLabel() {
    var isDark = root.getAttribute('data-theme') === 'dark';
    themeBtn.setAttribute('aria-label', isDark ? 'Switch to light theme' : 'Switch to dark theme');
    var meta = $('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', isDark ? '#090A12' : '#F1F2F7');
  }
  function applyTheme(next) {
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch (e) {}
    syncThemeLabel();
  }
  themeBtn.addEventListener('click', function () {
    var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    if (!document.startViewTransition || reduceMotion) { applyTheme(next); return; }
    var r = themeBtn.getBoundingClientRect();
    var x = r.left + r.width / 2, y = r.top + r.height / 2;
    var radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
    root.classList.add('vt');
    var t = document.startViewTransition(function () { applyTheme(next); });
    t.ready.then(function () {
      root.animate(
        { clipPath: ['circle(0px at ' + x + 'px ' + y + 'px)', 'circle(' + radius + 'px at ' + x + 'px ' + y + 'px)'] },
        { duration: 700, easing: 'cubic-bezier(.2,.7,.2,1)', pseudoElement: '::view-transition-new(root)' }
      );
    }).catch(function () {});
    t.finished.finally(function () { root.classList.remove('vt'); });
  });
  syncThemeLabel();

  /* ---------- Navigation: menu, sliding indicator, scroll state ---------- */
  var nav = $('.nav');
  var navBtn = $('#nav-toggle');
  var navInd = $('.nav-ind');
  var currentLink = null;

  function setNav(open) {
    nav.classList.toggle('nav-open', open);
    navBtn.setAttribute('aria-expanded', String(open));
    navBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }
  navBtn.addEventListener('click', function () { setNav(!nav.classList.contains('nav-open')); });
  $all('#site-nav a').forEach(function (a) { a.addEventListener('click', function () { setNav(false); }); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setNav(false); });

  function moveNavInd() {
    if (!currentLink || window.innerWidth <= 860) { navInd.style.opacity = 0; return; }
    navInd.style.opacity = 1;
    navInd.style.width = currentLink.offsetWidth + 'px';
    navInd.style.transform = 'translateX(' + currentLink.offsetLeft + 'px)';
  }
  window.addEventListener('resize', function () {
    if (window.innerWidth > 860) setNav(false);
    moveNavInd();
    moveFilterInd();
  });

  if ('IntersectionObserver' in window) {
    var links = {};
    $all('#site-nav a').forEach(function (a) { links[a.getAttribute('href').slice(1)] = a; });
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        Object.keys(links).forEach(function (k) { links[k].classList.remove('is-active'); });
        currentLink = links[en.target.id] || null;
        if (currentLink) currentLink.classList.add('is-active');
        moveNavInd();
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    $all('main section[id]').forEach(function (s) { spy.observe(s); });
  }

  /* ---------- Reveal on scroll ---------- */
  var revealEls = $all('.reveal');
  revealEls.forEach(function (el) {
    var sibs = $all('.reveal', el.parentElement).filter(function (s) { return s.parentElement === el.parentElement; });
    el.style.setProperty('--i', Math.min(sibs.indexOf(el), 4));
  });

  function finishReveal(el) {
    /* Drop the entrance classes so hover transforms are not overridden */
    setTimeout(function () {
      el.classList.remove('reveal', 'in');
      el.style.removeProperty('--i');
    }, 1100 + (parseFloat(el.style.getPropertyValue('--i')) || 0) * 80);
  }

  if ('IntersectionObserver' in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target;
        el.classList.add('in');
        if (el.classList.contains('reveal')) finishReveal(el);
        io.unobserve(el);
      });
    }, { threshold: 0.12 });
    revealEls.concat(titles).forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
    titles.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- Typed roles ---------- */
  var typedEl = $('.typed');
  var phrases = ['web apps.', 'developer tools.', 'multi-agent AI systems.', 'things that run.'];
  if (reduceMotion) {
    typedEl.textContent = phrases[0];
  } else {
    var pi = 0, ci = 0, deleting = false;
    var tick = function () {
      var full = phrases[pi];
      ci += deleting ? -1 : 1;
      typedEl.textContent = full.slice(0, ci);
      var delay = deleting ? 35 : 75;
      if (!deleting && ci === full.length) { deleting = true; delay = 1700; }
      else if (deleting && ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; delay = 350; }
      setTimeout(tick, delay);
    };
    setTimeout(tick, 1700);
  }

  /* ---------- Pointer effects: spotlight, tilt, magnet ---------- */
  if (finePointer) {
    document.addEventListener('pointermove', function (e) {
      var tile = e.target.closest ? e.target.closest('.tile') : null;
      if (!tile) return;
      var r = tile.getBoundingClientRect();
      tile.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      tile.style.setProperty('--my', (e.clientY - r.top) + 'px');
    }, { passive: true });
  }

  if (finePointer && !reduceMotion) {
    $all('.tilt').forEach(function (el) {
      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5;
        var py = (e.clientY - r.top) / r.height - 0.5;
        el.classList.add('is-tilting');
        el.style.transform = 'perspective(900px) rotateX(' + (-py * 9).toFixed(2) + 'deg) rotateY(' + (px * 11).toFixed(2) + 'deg) scale(1.015)';
      });
      el.addEventListener('pointerleave', function () {
        el.classList.remove('is-tilting');
        el.style.transform = '';
      });
    });

    $all('.btn').forEach(function (el) {
      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect();
        var dx = e.clientX - (r.left + r.width / 2);
        var dy = e.clientY - (r.top + r.height / 2);
        el.style.transform = 'translate(' + (dx * 0.2).toFixed(1) + 'px,' + (dy * 0.3).toFixed(1) + 'px)';
      });
      el.addEventListener('pointerleave', function () { el.style.transform = ''; });
    });
  }

  /* ---------- Project filter with sliding indicator ---------- */
  var grid = $('#project-grid');
  var filters = $('.filters');
  var filterInd = $('.filter-ind');
  function moveFilterInd() {
    var active = $('.chip-btn[aria-pressed="true"]', filters);
    if (!active) return;
    filterInd.style.width = active.offsetWidth + 'px';
    filterInd.style.height = active.offsetHeight + 'px';
    filterInd.style.transform = 'translate(' + active.offsetLeft + 'px,' + active.offsetTop + 'px)';
  }
  $all('.chip-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var f = btn.getAttribute('data-filter');
      $all('.chip-btn').forEach(function (b) { b.setAttribute('aria-pressed', String(b === btn)); });
      moveFilterInd();
      grid.classList.toggle('is-filtered', f !== 'all');
      $all('.tile', grid).forEach(function (card) {
        var show = f === 'all' || card.getAttribute('data-tags').split(' ').indexOf(f) !== -1;
        card.hidden = !show;
        if (show) card.classList.remove('reveal');
      });
    });
  });
  moveFilterInd();
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function () { moveFilterInd(); moveNavInd(); });
  }

  /* ---------- Scroll-linked: back to top ring, timeline fill ---------- */
  var toTop = $('#to-top');
  var ring = $('#ring-fg');
  var RING = 150.8;
  var timeline = $('#timeline');
  var timelineItems = $all('li', timeline);
  var ticking = false;

  function onScroll() {
    ticking = false;
    var max = document.documentElement.scrollHeight - window.innerHeight;
    var p = max > 0 ? clamp(window.scrollY / max, 0, 1) : 0;
    ring.style.strokeDashoffset = (RING * (1 - p)).toFixed(1);
    toTop.classList.toggle('show', window.scrollY > 700);
    nav.classList.toggle('is-scrolled', window.scrollY > 24);

    var vh = window.innerHeight;
    var r = timeline.getBoundingClientRect();
    timeline.style.setProperty('--p', clamp((vh * 0.65 - r.top) / r.height, 0, 1).toFixed(3));
    timelineItems.forEach(function (li) {
      li.classList.toggle('passed', li.getBoundingClientRect().top < vh * 0.65);
    });
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();

  toTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  });

  /* ---------- Toast and copy email ---------- */
  var toast = $('#toast');
  var toastTimer;
  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove('show'); }, 2200);
  }
  $('#copy-email').addEventListener('click', function () {
    var email = 'alwinsiby123@gmail.com';
    function done() { showToast('Email address copied'); }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(email).then(done, function () { showToast(email); });
    } else {
      showToast(email);
    }
  });

  /* ---------- GitHub data ---------- */
  function timeAgo(iso) {
    var s = (Date.now() - new Date(iso).getTime()) / 1000;
    var units = [['year', 31536000], ['month', 2592000], ['week', 604800], ['day', 86400], ['hour', 3600], ['minute', 60]];
    var rtf = typeof Intl !== 'undefined' && Intl.RelativeTimeFormat ? new Intl.RelativeTimeFormat('en', { numeric: 'auto' }) : null;
    for (var i = 0; i < units.length; i++) {
      var n = Math.floor(s / units[i][1]);
      if (n >= 1) return rtf ? rtf.format(-n, units[i][0]) : n + ' ' + units[i][0] + (n > 1 ? 's' : '') + ' ago';
    }
    return 'just now';
  }

  function repoMeta(r) {
    var meta = document.createElement('span');
    meta.className = 'repo-meta';
    if (r.language) {
      var l = document.createElement('span');
      var d = document.createElement('i');
      d.className = 'dot';
      d.style.background = LANG_COLORS[r.language] || '';
      l.appendChild(d);
      l.appendChild(document.createTextNode(r.language));
      meta.appendChild(l);
    }
    var t = document.createElement('span');
    t.textContent = 'Updated ' + timeAgo(r.pushed_at);
    meta.appendChild(t);
    return meta;
  }

  function repoLink(r, withDescription) {
    var a = document.createElement('a');
    a.href = r.html_url; a.target = '_blank'; a.rel = 'noopener';
    var name = document.createElement('span');
    name.className = 'repo-name';
    name.textContent = r.name;
    a.appendChild(name);
    if (withDescription && r.description) {
      var p = document.createElement('p');
      p.textContent = r.description;
      a.appendChild(p);
    } else {
      a.appendChild(document.createElement('br'));
    }
    a.appendChild(repoMeta(r));
    return a;
  }

  function renderLive(repos) {
    var list = $('#live-list');
    list.textContent = '';
    repos.slice(0, 3).forEach(function (r) {
      var li = document.createElement('li');
      li.appendChild(repoLink(r, false));
      list.appendChild(li);
    });
  }

  function renderMore(repos) {
    var byName = {};
    repos.forEach(function (x) { byName[x.name.toLowerCase()] = x; });
    var more = MORE.map(function (n) { return byName[n.toLowerCase()]; }).filter(Boolean);
    if (!more.length) return;
    var list = $('#repo-list');
    list.textContent = '';
    more.forEach(function (r) {
      var li = document.createElement('li');
      li.appendChild(repoLink(r, true));
      list.appendChild(li);
    });
    $('#more-title').hidden = false;
    list.hidden = false;
  }

  function renderFallback() {
    var list = $('#live-list');
    list.textContent = '';
    [['campus-bus-tracker', 'TypeScript'], ['malayalam-meme-extension', 'TypeScript'], ['minnal_murali', 'JavaScript']]
      .forEach(function (x) {
        var li = document.createElement('li');
        var a = document.createElement('a');
        a.href = 'https://github.com/' + USER + '/' + x[0]; a.target = '_blank'; a.rel = 'noopener';
        var name = document.createElement('span');
        name.className = 'repo-name';
        name.textContent = x[0];
        var meta = document.createElement('span');
        meta.className = 'repo-meta';
        meta.textContent = x[1];
        a.appendChild(name);
        a.appendChild(document.createElement('br'));
        a.appendChild(meta);
        li.appendChild(a);
        list.appendChild(li);
      });
  }

  function loadRepos() {
    var KEY = 'gh-repos-v1';
    try {
      var c = JSON.parse(localStorage.getItem(KEY));
      if (c && Date.now() - c.t < 30 * 60 * 1000) return Promise.resolve(c.d);
    } catch (e) {}
    return fetch('https://api.github.com/users/' + USER + '/repos?per_page=100&sort=pushed')
      .then(function (r) { if (!r.ok) throw new Error('GitHub ' + r.status); return r.json(); })
      .then(function (data) {
        var d = data
          .filter(function (r) { return !r.fork; })
          .map(function (r) {
            return { name: r.name, description: r.description, language: r.language, html_url: r.html_url, pushed_at: r.pushed_at };
          });
        try { localStorage.setItem(KEY, JSON.stringify({ t: Date.now(), d: d })); } catch (e) {}
        return d;
      });
  }

  loadRepos().then(function (repos) {
    if (!repos.length) { renderFallback(); return; }
    renderLive(repos.filter(function (r) { return HIDE.indexOf(r.name.toLowerCase()) === -1; }));
    renderMore(repos);
  }).catch(renderFallback);

  /* ---------- Contact form (opens the visitor's email app) ---------- */
  var form = $('#contact-form');
  var status = $('#form-status');
  function setError(input, show) {
    var msg = $('.err[data-for="' + input.id + '"]', form);
    input.setAttribute('aria-invalid', String(show));
    if (show) input.setAttribute('aria-describedby', msg.id = msg.id || input.id + '-err');
    else input.removeAttribute('aria-describedby');
    msg.hidden = !show;
  }
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var name = form.elements.name, email = form.elements.email, message = form.elements.message;
    var okName = name.value.trim().length > 0;
    var okEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim());
    var okMsg = message.value.trim().length > 0;
    setError(name, !okName); setError(email, !okEmail); setError(message, !okMsg);
    if (!(okName && okEmail && okMsg)) {
      (!okName ? name : !okEmail ? email : message).focus();
      return;
    }
    var subject = 'Portfolio message from ' + name.value.trim();
    var body = message.value.trim() + '\n\n' + name.value.trim() + '\n' + email.value.trim();
    window.location.href = 'mailto:alwinsiby123@gmail.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    status.textContent = 'Your email app should now open with the message ready to send.';
    showToast('Opening your email app');
  });

  /* ---------- Footer year ---------- */
  $('#year').textContent = new Date().getFullYear();
})();
