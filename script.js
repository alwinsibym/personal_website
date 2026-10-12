/* Alwin Siby portfolio: interactions and live GitHub data */
(function () {
  'use strict';

  var USER = 'alwinsibym';
  /* Repositories already shown as project cards above */
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
    Python: '#3572A5', 'C++': '#f34b7d', C: '#8a8a8a', Java: '#b07219', SQL: '#e38c00'
  };
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var root = document.documentElement;

  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $all(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }

  /* ---------- Theme toggle ---------- */
  var themeBtn = $('#theme-toggle');
  function syncThemeLabel() {
    var isDark = root.getAttribute('data-theme') === 'dark';
    themeBtn.setAttribute('aria-label', isDark ? 'Switch to light theme' : 'Switch to dark theme');
    var meta = $('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', isDark ? '#0E1330' : '#F2F4FB');
  }
  themeBtn.addEventListener('click', function () {
    var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch (e) {}
    syncThemeLabel();
  });
  syncThemeLabel();

  /* ---------- Mobile menu ---------- */
  var header = $('.site-header');
  var navBtn = $('#nav-toggle');
  function setNav(open) {
    header.classList.toggle('nav-open', open);
    navBtn.setAttribute('aria-expanded', String(open));
    navBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }
  navBtn.addEventListener('click', function () { setNav(!header.classList.contains('nav-open')); });
  $all('#site-nav a').forEach(function (a) { a.addEventListener('click', function () { setNav(false); }); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setNav(false); });
  window.addEventListener('resize', function () { if (window.innerWidth > 860) setNav(false); });

  /* ---------- Scroll progress (kasavu stripe) ---------- */
  var progress = $('.progress');
  var ticking = false;
  function updateProgress() {
    var max = document.documentElement.scrollHeight - window.innerHeight;
    var p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    progress.style.setProperty('--p', p.toFixed(4));
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(updateProgress); }
  }, { passive: true });
  updateProgress();

  /* ---------- Active nav link ---------- */
  if ('IntersectionObserver' in window) {
    var links = {};
    $all('#site-nav a').forEach(function (a) { links[a.getAttribute('href').slice(1)] = a; });
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          Object.keys(links).forEach(function (k) { links[k].classList.remove('is-active'); });
          if (links[en.target.id]) links[en.target.id].classList.add('is-active');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    $all('main section[id]').forEach(function (s) { spy.observe(s); });
  }

  /* ---------- Entrance for project cards and timeline ---------- */
  var revealEls = $all('.card, .timeline li, .role');
  revealEls.forEach(function (el) { el.classList.add('reveal'); });
  if ('IntersectionObserver' in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          var el = en.target;
          var idx = revealEls.indexOf(el);
          el.style.transitionDelay = (idx % 3) * 70 + 'ms';
          el.classList.add('in');
          io.unobserve(el);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
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
    /* Start once the name and the line have finished animating in */
    setTimeout(tick, 1500);
  }

  /* ---------- Project filter ---------- */
  var grid = $('#project-grid');
  $all('.chip-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var f = btn.getAttribute('data-filter');
      $all('.chip-btn').forEach(function (b) { b.setAttribute('aria-pressed', String(b === btn)); });
      grid.classList.toggle('is-filtered', f !== 'all');
      $all('.card', grid).forEach(function (card) {
        var show = f === 'all' || card.getAttribute('data-tags').split(' ').indexOf(f) !== -1;
        card.hidden = !show;
        if (show) card.classList.add('in');
      });
    });
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

  function renderLive(repos) {
    var list = $('#live-list');
    list.textContent = '';
    repos.slice(0, 4).forEach(function (r) {
      var li = document.createElement('li');
      var a = document.createElement('a');
      a.href = r.html_url; a.target = '_blank'; a.rel = 'noopener';
      var name = document.createElement('span');
      name.className = 'repo-name';
      name.textContent = r.name;
      a.appendChild(name);
      a.appendChild(document.createElement('br'));
      a.appendChild(repoMeta(r));
      li.appendChild(a);
      list.appendChild(li);
    });
  }

  function renderMore(repos) {
    var byName = {};
    repos.forEach(function (r) { byName[r.name.toLowerCase()] = r; });
    var more = MORE.map(function (n) { return byName[n.toLowerCase()]; }).filter(Boolean);
    if (!more.length) return;
    var list = $('#repo-list');
    list.textContent = '';
    more.forEach(function (r) {
      var li = document.createElement('li');
      var a = document.createElement('a');
      a.href = r.html_url; a.target = '_blank'; a.rel = 'noopener';
      var name = document.createElement('span');
      name.className = 'repo-name';
      name.textContent = r.name;
      a.appendChild(name);
      if (r.description) {
        var p = document.createElement('p');
        p.textContent = r.description;
        a.appendChild(p);
      }
      a.appendChild(repoMeta(r));
      li.appendChild(a);
      list.appendChild(li);
    });
    $('#more-title').hidden = false;
    list.hidden = false;
  }

  function renderFallback() {
    var list = $('#live-list');
    list.textContent = '';
    [
      ['campus-bus-tracker', 'TypeScript'],
      ['malayalam-meme-extension', 'TypeScript'],
      ['minnal_murali', 'HTML']
    ].forEach(function (x) {
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
          .filter(function (r) { return !r.fork && HIDE.indexOf(r.name.toLowerCase()) === -1; })
          .map(function (r) {
            return { name: r.name, description: r.description, language: r.language, html_url: r.html_url, pushed_at: r.pushed_at };
          });
        try { localStorage.setItem(KEY, JSON.stringify({ t: Date.now(), d: d })); } catch (e) {}
        return d;
      });
  }

  loadRepos().then(function (repos) {
    if (!repos.length) { renderFallback(); return; }
    renderLive(repos);
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
  });

  /* ---------- Footer year ---------- */
  $('#year').textContent = new Date().getFullYear();
})();
