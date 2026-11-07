/* ==========================================================
   NGOPS YUMK — INTERAKSI UTAMA
   ========================================================== */
(() => {
  'use strict';

  const CFG = window.NGOPS_CONFIG;
  const DATA = window.NGOPS_DATA;
  const Cart = window.Cart;
  const cupSVG = window.cupSVG;

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const rupiah = Cart.format;
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const findProduct = (id) => DATA.menu.find((m) => m.id === id);
  const catLabel = (id) => DATA.categories.find((c) => c.id === id)?.label || '';
  const compact = (n) => (n >= 1000 ? (n / 1000).toFixed(1).replace(/\.0$/, '').replace('.', ',') + 'rb' : String(n));
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* abaikan */ } },
  };

  const ICON = {
    plus: '<svg class="icon" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>',
    trash: '<svg class="icon" viewBox="0 0 24 24"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4h6v3"/></svg>',
    check: '<svg class="icon" viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
    info: '<svg class="icon" viewBox="0 0 24 24"><path d="M12 8h.01M11 12h1v5h1"/></svg>',
    alert: '<svg class="icon" viewBox="0 0 24 24"><path d="M12 7v6M12 17h.01"/></svg>',
    zoom: '<svg class="icon" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5M11 8v6M8 11h6"/></svg>',
  };
  const BEAN = '<svg viewBox="0 0 20 26"><ellipse cx="10" cy="13" rx="9" ry="12" fill="currentColor"/><path d="M10 2 C5 9 15 17 10 24" stroke="rgba(0,0,0,.35)" stroke-width="1.8" fill="none" stroke-linecap="round"/></svg>';

  /* ---------------- Toast ---------------- */
  function toast(msg, { type = 'success', action, duration = 3200 } = {}) {
    const box = $('#toasts');
    const el = document.createElement('div');
    el.className = `toast toast--${type}`;
    el.setAttribute('role', type === 'error' ? 'alert' : 'status');
    const ic = type === 'error' ? ICON.alert : type === 'info' ? ICON.info : ICON.check;
    el.innerHTML = `<span class="toast__icon">${ic}</span><span class="toast__msg">${esc(msg)}</span>`;
    let timer;
    const dismiss = () => {
      clearTimeout(timer);
      el.classList.remove('show');
      setTimeout(() => el.remove(), 450);
    };
    if (action) {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'toast__action';
      b.textContent = action.label;
      b.addEventListener('click', () => { action.fn(); dismiss(); });
      el.appendChild(b);
    }
    box.appendChild(el);
    while (box.children.length > 3) box.firstElementChild.remove();
    requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('show')));
    timer = setTimeout(dismiss, duration);
    el.addEventListener('mouseenter', () => clearTimeout(timer));
    el.addEventListener('mouseleave', () => { timer = setTimeout(dismiss, 1500); });
  }

  /* ---------------- Layer (modal / drawer / lightbox) ---------------- */
  const layers = [];
  const FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]):not([type=hidden]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';
  const isVisible = (el) => !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length);
  const navOpen = () => $('#nav').classList.contains('open');
  const syncScrollLock = () => document.body.classList.toggle('no-scroll', layers.length > 0 || navOpen());

  function openLayer(el, focusEl) {
    if (layers.some((l) => l.el === el)) return;
    layers.push({ el, last: document.activeElement });
    el.classList.add('open');
    el.setAttribute('aria-hidden', 'false');
    syncScrollLock();
    setTimeout(() => {
      const target = focusEl || $$(FOCUSABLE, el).find(isVisible);
      target?.focus({ preventScroll: true });
    }, 80);
  }

  function closeLayer(el) {
    const i = layers.findIndex((l) => l.el === el);
    if (i < 0) return;
    const [{ last }] = layers.splice(i, 1);
    el.classList.remove('open');
    el.setAttribute('aria-hidden', 'true');
    syncScrollLock();
    if (last && document.contains(last)) last.focus({ preventScroll: true });
  }

  document.addEventListener('keydown', (e) => {
    const top = layers[layers.length - 1];
    if (!top) return;
    if (e.key === 'Escape') {
      e.preventDefault();
      closeLayer(top.el);
    } else if (e.key === 'Tab') {
      const f = $$(FOCUSABLE, top.el).filter(isVisible);
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  document.addEventListener('click', (e) => {
    const c = e.target.closest('[data-close]');
    if (!c) return;
    const layer = c.closest('.modal, .drawer, .lightbox');
    if (layer) closeLayer(layer);
  });

  /* ---------------- Konfigurasi brand ---------------- */
  function applyConfig() {
    $$('[data-cfg]').forEach((el) => {
      const v = CFG[el.dataset.cfg];
      if (v != null) el.textContent = v;
    });
    const waBase = `https://wa.me/${CFG.whatsapp}`;
    const ext = (a) => { a.target = '_blank'; a.rel = 'noopener'; };
    $$('[data-wa]').forEach((a) => {
      const msg = a.dataset.wa || `Halo ${CFG.brand}! Saya mau tanya-tanya dulu nih 😊`;
      a.href = `${waBase}?text=${encodeURIComponent(msg)}`;
      ext(a);
    });
    $$('[data-social]').forEach((a) => { a.href = CFG.social[a.dataset.social] || '#'; ext(a); });
    $$('[data-ojol]').forEach((a) => { a.href = CFG.ojol[a.dataset.ojol] || '#'; ext(a); });
    $$('[data-email]').forEach((a) => { a.href = `mailto:${CFG.email}`; });
    $$('[data-directions]').forEach((a) => {
      a.href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(CFG.mapsQuery)}`;
      ext(a);
    });
    $$('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });
    const map = $('#mapFrame');
    if (map) map.src = `https://maps.google.com/maps?q=${encodeURIComponent(CFG.mapsQuery)}&z=16&output=embed`;

    $('#statSold').dataset.count = CFG.stats.sold;
    $('#statRating').dataset.count = CFG.stats.rating;
    $('#statVariants').dataset.count = DATA.menu.length;

    $('#footerMenu').innerHTML = [...DATA.menu]
      .sort((a, b) => b.sold - a.sold).slice(0, 5)
      .map((m) => `<li><a href="#menu" data-open-product="${m.id}">${esc(m.name)}</a></li>`).join('');
  }

  /* ---------------- Tema ---------------- */
  function initTheme() {
    const root = document.documentElement;
    const btn = $('#themeToggle');
    const meta = $('meta[name="theme-color"]');
    const ui = (t) => {
      meta.content = t === 'dark' ? '#140c08' : '#6f4e37';
      btn.setAttribute('aria-label', t === 'dark' ? 'Ganti ke tema terang' : 'Ganti ke tema gelap');
    };
    ui(root.dataset.theme);
    btn.addEventListener('click', () => {
      const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
      root.classList.add('theme-transition');
      root.dataset.theme = next;
      try { localStorage.setItem('ny-theme', next); } catch (e) { /* abaikan */ }
      ui(next);
      setTimeout(() => root.classList.remove('theme-transition'), 500);
    });
    matchMedia('(prefers-color-scheme: dark)').addEventListener?.('change', (e) => {
      if (localStorage.getItem('ny-theme')) return;
      root.dataset.theme = e.matches ? 'dark' : 'light';
      ui(root.dataset.theme);
    });
  }

  /* ---------------- Preloader ---------------- */
  function initPreloader() {
    const pre = $('#preloader');
    const start = performance.now();
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      const wait = reduceMotion ? 0 : Math.max(0, 900 - (performance.now() - start));
      setTimeout(() => {
        pre.classList.add('hide');
        document.body.classList.add('loaded');
        setTimeout(() => pre.remove(), 700);
      }, wait);
    };
    if (document.readyState === 'complete') finish();
    else {
      window.addEventListener('load', finish, { once: true });
      setTimeout(finish, 2800);
    }
  }

  /* ---------------- Navbar, progress, back-to-top ---------------- */
  function initNavbar() {
    const navbar = $('#navbar'), nav = $('#nav'), burger = $('#menuToggle');
    const progress = $('#scrollProgress'), toTop = $('#backToTop');

    let ticking = false;
    const onScroll = () => {
      const y = window.scrollY;
      navbar.classList.toggle('scrolled', y > 20);
      const h = document.documentElement.scrollHeight - innerHeight;
      progress.style.transform = `scaleX(${h > 0 ? y / h : 0})`;
      toTop.classList.toggle('show', y > 700);
      ticking = false;
    };
    addEventListener('scroll', () => {
      if (!ticking) { requestAnimationFrame(onScroll); ticking = true; }
    }, { passive: true });
    onScroll();

    const setMenu = (open) => {
      nav.classList.toggle('open', open);
      burger.classList.toggle('active', open);
      burger.setAttribute('aria-expanded', String(open));
      burger.setAttribute('aria-label', open ? 'Tutup menu' : 'Buka menu');
      syncScrollLock();
    };
    burger.addEventListener('click', () => setMenu(!navOpen()));
    $$('a', nav).forEach((a) => a.addEventListener('click', () => setMenu(false)));
    addEventListener('keydown', (e) => { if (e.key === 'Escape' && navOpen()) { setMenu(false); burger.focus(); } });
    addEventListener('resize', () => { if (innerWidth > 960 && navOpen()) setMenu(false); });

    // scroll-spy
    const links = new Map($$('.nav__link').map((a) => [a.getAttribute('href').slice(1), a]));
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        const link = links.get(en.target.id);
        if (!link) return;
        links.forEach((l) => { l.classList.remove('active'); l.removeAttribute('aria-current'); });
        link.classList.add('active');
        link.setAttribute('aria-current', 'true');
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    links.forEach((_, id) => { const s = document.getElementById(id); if (s) io.observe(s); });

    toTop.addEventListener('click', () => scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' }));
  }

  /* ---------------- Hero ---------------- */
  function initHero() {
    const items = DATA.heroCups.map(findProduct).filter(Boolean);
    const cup = $('#heroCup'), circle = $('#heroCircle'), dots = $('#heroDots');
    let idx = 0, timer = null;

    dots.innerHTML = items.map((p, i) =>
      `<button class="hero-dot" type="button" role="tab" data-i="${i}" aria-label="Lihat ${esc(p.name)}"></button>`
    ).join('');

    const render = () => {
      const p = items[idx];
      cup.innerHTML = cupSVG(p, { label: p.name });
      circle.style.setProperty('--tint', p.tint);
      $('#heroCupName').textContent = p.name;
      $('#heroCupPrice').textContent = rupiah(p.price);
      $$('.hero-dot', dots).forEach((d, i) => {
        d.classList.toggle('active', i === idx);
        d.setAttribute('aria-selected', String(i === idx));
      });
    };

    const go = (i) => {
      idx = (i + items.length) % items.length;
      if (reduceMotion) return render();
      cup.classList.remove('swap');
      void cup.offsetWidth;
      cup.classList.add('swap');
      setTimeout(render, 230);
    };

    const auto = () => {
      clearInterval(timer);
      if (!reduceMotion) timer = setInterval(() => go(idx + 1), 4500);
    };

    cup.addEventListener('click', () => { go(idx + 1); auto(); });
    dots.addEventListener('click', (e) => {
      const d = e.target.closest('[data-i]');
      if (d) { go(+d.dataset.i); auto(); }
    });
    $('#heroOrder').addEventListener('click', () => openProduct(items[idx].id));
    const visual = $('.hero__visual');
    visual.addEventListener('mouseenter', () => clearInterval(timer));
    visual.addEventListener('mouseleave', auto);

    render();
    auto();

    // biji kopi melayang
    const beans = $('#beans');
    const count = innerWidth < 640 ? 8 : 14;
    for (let i = 0; i < count; i++) {
      const b = document.createElement('span');
      b.className = 'bean';
      const s = 14 + Math.random() * 24;
      b.style.cssText = `left:${Math.random() * 96}%;top:${8 + Math.random() * 86}%;width:${s}px;height:${s * 1.3}px;` +
        `--r:${Math.round(Math.random() * 360)}deg;--dur:${6 + Math.random() * 6}s;--delay:${-Math.random() * 6}s`;
      b.dataset.depth = (0.2 + Math.random() * 0.8).toFixed(2);
      b.innerHTML = BEAN;
      beans.appendChild(b);
    }

    // parallax mengikuti mouse
    if (finePointer && !reduceMotion) {
      const hero = $('#home');
      const beanEls = $$('.bean', beans);
      let tx = 0, ty = 0, cx = 0, cy = 0, raf = null;
      const loop = () => {
        cx += (tx - cx) * 0.08;
        cy += (ty - cy) * 0.08;
        beanEls.forEach((b) => {
          const d = b.dataset.depth * 50;
          b.style.translate = `${cx * d}px ${cy * d}px`;
        });
        visual.style.translate = `${cx * -18}px ${cy * -18}px`;
        raf = Math.abs(tx - cx) > 0.001 || Math.abs(ty - cy) > 0.001 ? requestAnimationFrame(loop) : null;
      };
      hero.addEventListener('mousemove', (e) => {
        tx = e.clientX / innerWidth - 0.5;
        ty = e.clientY / innerHeight - 0.5;
        if (!raf) raf = requestAnimationFrame(loop);
      });
      hero.addEventListener('mouseleave', () => {
        tx = 0; ty = 0;
        if (!raf) raf = requestAnimationFrame(loop);
      });
    }
  }

  /* ---------------- Tentang & Ojol (ilustrasi) ---------------- */
  function renderIllustrations() {
    $('#aboutCups').innerHTML = ['matcha-latte', 'kopi-susu-aren', 'kopi-tubruk']
      .map((id) => `<div>${cupSVG(findProduct(id))}</div>`).join('');
    $('#ojolCup').innerHTML = `<div>${cupSVG(findProduct('butterscotch'))}</div>`;
  }

  /* ---------------- Counter angka ---------------- */
  function animateCount(el) {
    const target = parseFloat(el.dataset.count);
    const dec = +(el.dataset.decimals || 0);
    const suf = el.dataset.suffix || '';
    const fmt = (v) => v.toLocaleString('id-ID', { minimumFractionDigits: dec, maximumFractionDigits: dec }) + suf;
    if (reduceMotion) { el.textContent = fmt(target); return; }
    const dur = 1800, t0 = performance.now();
    const step = (t) => {
      const p = Math.min(1, (t - t0) / dur);
      const e = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(target * e);
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  function initCounters() {
    const els = $$('[data-count]');
    const start = () => {
      const io = new IntersectionObserver((ents) => ents.forEach((en) => {
        if (!en.isIntersecting) return;
        io.unobserve(en.target);
        animateCount(en.target);
      }), { threshold: 0.6 });
      els.forEach((el) => io.observe(el));
    };
    // tunggu preloader selesai agar animasi terlihat
    if (document.body.classList.contains('loaded')) start();
    else new MutationObserver((_, obs) => {
      if (document.body.classList.contains('loaded')) { obs.disconnect(); setTimeout(start, 400); }
    }).observe(document.body, { attributes: true, attributeFilter: ['class'] });
  }

  /* ---------------- Reveal on scroll ---------------- */
  let revealIO = null;
  function initReveal() {
    if (reduceMotion || !('IntersectionObserver' in window)) {
      $$('.reveal').forEach((e) => e.classList.add('in-view'));
      return;
    }
    revealIO = new IntersectionObserver((ents) => ents.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add('in-view'); revealIO.unobserve(en.target); }
    }), { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    $$('.reveal:not(.in-view)').forEach((e) => revealIO.observe(e));
  }

  /* ---------------- Menu ---------------- */
  const menuState = { cat: 'all', q: '', sort: 'popular' };

  function cardHTML(m, i) {
    const badge = m.badge === 'best' ? '<span class="badge badge--best">Best Seller</span>'
      : m.badge === 'new' ? '<span class="badge badge--new">Baru</span>' : '';
    return `<article class="product-card" data-product="${m.id}" data-tilt style="--tint:${m.tint};--i:${i}">
      <div class="product-card__media">${badge}<div class="product-card__cup">${cupSVG(m)}</div></div>
      <div class="product-card__body">
        <div class="product-card__meta"><span class="rating">★ ${m.rating.toFixed(1)}</span><span>${compact(m.sold)} terjual</span></div>
        <h3>${esc(m.name)}</h3>
        <p>${esc(m.desc)}</p>
        <div class="product-card__footer">
          <span class="price">${rupiah(m.price)}</span>
          <button class="btn-add" type="button" aria-label="Pilih ${esc(m.name)}">${ICON.plus}</button>
        </div>
      </div>
    </article>`;
  }

  function renderMenu() {
    const q = menuState.q;
    let list = DATA.menu.filter((m) =>
      (menuState.cat === 'all' || m.category === menuState.cat) &&
      (!q || `${m.name} ${m.desc} ${catLabel(m.category)}`.toLowerCase().includes(q))
    );
    const s = menuState.sort;
    list = [...list].sort((a, b) =>
      s === 'price-asc' ? a.price - b.price :
      s === 'price-desc' ? b.price - a.price :
      s === 'rating' ? b.rating - a.rating || b.sold - a.sold :
      b.sold - a.sold
    );
    $('#menuGrid').innerHTML = list.map(cardHTML).join('');
    $('#menuEmpty').hidden = list.length > 0;
    $('#menuCount').textContent = list.length
      ? `Menampilkan ${list.length} menu${q ? ` untuk "${menuState.q}"` : ''}`
      : '';
  }

  function initMenu() {
    const tabs = $('#menuTabs');
    tabs.innerHTML = DATA.categories.map((c) => {
      const n = c.id === 'all' ? DATA.menu.length : DATA.menu.filter((m) => m.category === c.id).length;
      const active = c.id === 'all';
      return `<button class="chip${active ? ' active' : ''}" type="button" role="tab" aria-selected="${active}" data-cat="${c.id}">${esc(c.label)}<span class="chip__count">${n}</span></button>`;
    }).join('');

    const setCat = (cat) => {
      menuState.cat = cat;
      $$('.chip', tabs).forEach((x) => {
        const on = x.dataset.cat === cat;
        x.classList.toggle('active', on);
        x.setAttribute('aria-selected', String(on));
      });
      renderMenu();
    };
    tabs.addEventListener('click', (e) => {
      const b = e.target.closest('[data-cat]');
      if (b) setCat(b.dataset.cat);
    });

    let t;
    const search = $('#menuSearch');
    search.addEventListener('input', () => {
      clearTimeout(t);
      t = setTimeout(() => { menuState.q = search.value.trim().toLowerCase(); renderMenu(); }, 180);
    });
    $('#menuSort').addEventListener('change', (e) => { menuState.sort = e.target.value; renderMenu(); });
    $('#menuReset').addEventListener('click', () => {
      search.value = '';
      menuState.q = '';
      setCat('all');
      search.focus();
    });

    $('#menuGrid').addEventListener('click', (e) => {
      const card = e.target.closest('[data-product]');
      if (card) openProduct(card.dataset.product);
    });

    // link "menu favorit" di footer
    document.addEventListener('click', (e) => {
      const a = e.target.closest('[data-open-product]');
      if (!a) return;
      e.preventDefault();
      openProduct(a.dataset.openProduct);
    });

    renderMenu();
  }

  /* ---------------- Modal produk ---------------- */
  let pm = null;

  function optionGroup(name, title, items, type, current, hint = '') {
    return `<fieldset class="opt-group">
      <legend>${title}${hint ? ` <span class="opt-hint">${hint}</span>` : ''}</legend>
      <div class="opt-list">${items.map((it) => `
        <label class="opt">
          <input type="${type}" name="${name}" value="${it.id}" ${type === 'radio' && it.id === current ? 'checked' : ''} />
          <span class="opt__box">
            <span class="opt__label">${esc(it.label)}</span>
            ${it.note ? `<small>${esc(it.note)}</small>` : ''}
            ${it.price ? `<small class="opt__price">+${rupiah(it.price)}</small>` : ''}
          </span>
        </label>`).join('')}
      </div>
    </fieldset>`;
  }

  function openProduct(id) {
    const p = findProduct(id);
    if (!p) return;
    const O = DATA.options;
    pm = { product: p, size: 'regular', sugar: 'normal', ice: p.type === 'hot' ? 'no' : 'normal', toppings: new Set(), qty: 1 };

    $('#pmCat').textContent = catLabel(p.category);
    $('#pmTitle').textContent = p.name;
    $('#pmDesc').textContent = p.desc;
    $('#pmNote').value = '';
    $('#pmRating').innerHTML = `<span class="rating">★ ${p.rating.toFixed(1)}</span> · ${compact(p.sold)} terjual`;
    $('#pmVisual').style.setProperty('--tint', p.tint);
    $('#pmOptions').innerHTML =
      optionGroup('size', 'Ukuran', O.sizes, 'radio', pm.size) +
      optionGroup('sugar', 'Tingkat Manis', O.sugar, 'radio', pm.sugar) +
      (p.type === 'hot' ? '' : optionGroup('ice', 'Es', O.ice, 'radio', pm.ice)) +
      optionGroup('toppings', 'Topping Tambahan', O.toppings.filter((t) => !(t.icedOnly && p.type === 'hot')), 'checkbox', null, 'opsional');

    updatePM(false);
    const modal = $('#productModal');
    openLayer(modal, $('.modal__close', modal));
    $('.modal__panel', modal).scrollTop = 0;
  }

  function updatePM(animate = true) {
    const p = pm.product;
    const tops = [...pm.toppings];
    const unit = Cart.unitPrice(p, pm.size, tops);
    $('#pmPrice').textContent = rupiah(unit * pm.qty);
    $('#pmQty').textContent = pm.qty;
    const cupEl = $('#pmCup');
    cupEl.innerHTML = cupSVG(p, { ice: pm.ice, toppings: tops, label: p.name });
    cupEl.classList.toggle('large', pm.size === 'large');
    if (animate && !reduceMotion) {
      cupEl.classList.remove('pop');
      void cupEl.offsetWidth;
      cupEl.classList.add('pop');
    }
  }

  function initProductModal() {
    $('#pmOptions').addEventListener('change', (e) => {
      const i = e.target;
      if (!pm || !i.name) return;
      if (i.name === 'toppings') i.checked ? pm.toppings.add(i.value) : pm.toppings.delete(i.value);
      else pm[i.name] = i.value;
      updatePM();
    });

    $$('#productModal [data-qty]').forEach((b) => b.addEventListener('click', () => {
      pm.qty = Math.max(1, Math.min(20, pm.qty + +b.dataset.qty));
      updatePM(false);
    }));

    $('#pmForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const p = pm.product;
      const tops = [...pm.toppings];
      Cart.add({
        id: p.id, size: pm.size, sugar: pm.sugar, ice: pm.ice, toppings: tops,
        qty: pm.qty, note: $('#pmNote').value.trim(), unitPrice: Cart.unitPrice(p, pm.size, tops),
      });
      flyToCart($('#pmCup'));
      closeLayer($('#productModal'));
      toast(`${pm.qty}x ${p.name} masuk keranjang!`, { action: { label: 'Lihat', fn: openCart } });
    });
  }

  function bumpCart() {
    const badge = $('#cartBadge'), btn = $('#cartToggle');
    [badge, btn].forEach((el, i) => {
      const cls = i ? 'shake' : 'bump';
      el.classList.remove(cls);
      void el.offsetWidth;
      el.classList.add(cls);
    });
  }

  function flyToCart(src) {
    const target = $('#cartToggle');
    if (reduceMotion || !src.animate) { bumpCart(); return; }
    const r = src.getBoundingClientRect(), t = target.getBoundingClientRect();
    if (!r.width) { bumpCart(); return; }
    const clone = src.cloneNode(true);
    clone.removeAttribute('id');
    clone.className = 'fly-clone';
    Object.assign(clone.style, { left: `${r.left}px`, top: `${r.top}px`, width: `${r.width}px`, height: `${r.height}px` });
    document.body.appendChild(clone);
    const dx = t.left + t.width / 2 - (r.left + r.width / 2);
    const dy = t.top + t.height / 2 - (r.top + r.height / 2);
    clone.animate([
      { transform: 'translate(0,0) scale(1) rotate(0)', opacity: 1 },
      { transform: `translate(${dx * 0.4}px, ${dy * 0.4 - 120}px) scale(.55) rotate(-20deg)`, opacity: 1, offset: 0.45 },
      { transform: `translate(${dx}px, ${dy}px) scale(.08) rotate(20deg)`, opacity: 0.3 },
    ], { duration: 850, easing: 'cubic-bezier(.45,0,.55,1)' }).onfinish = () => {
      clone.remove();
      bumpCart();
    };
  }

  /* ---------------- Keranjang ---------------- */
  const openCart = () => openLayer($('#cartDrawer'));

  function renderCart() {
    const items = Cart.items();
    const count = Cart.count();
    const badge = $('#cartBadge');
    badge.textContent = count > 99 ? '99+' : count;
    badge.classList.toggle('show', count > 0);
    $('#cartToggle').setAttribute('aria-label', `Buka keranjang (${count} item)`);
    $('#cartCount').textContent = `(${count})`;
    $('#cartEmpty').hidden = items.length > 0;
    $('#cartExtra').hidden = !items.length;
    $('#cartFoot').hidden = !items.length;

    // simpan fokus agar navigasi keyboard tidak hilang saat render ulang
    const act = document.activeElement;
    const fKey = act?.closest?.('[data-key]')?.dataset.key;
    const fAct = act?.dataset?.action;

    $('#cartList').innerHTML = items.map((it) => {
      const p = Cart.product(it.id);
      return `<li class="cart-item" data-key="${esc(it.key)}">
        <div class="cart-item__cup" style="--tint:${p.tint}">${cupSVG(p, { ice: it.ice, toppings: it.toppings })}</div>
        <div class="cart-item__info">
          <h4>${esc(p.name)}</h4>
          <p>${esc(Cart.describe(it))}</p>
          ${it.note ? `<p class="cart-item__note">"${esc(it.note)}"</p>` : ''}
          <div class="cart-item__row">
            <div class="qty qty--sm">
              <button type="button" data-action="dec" aria-label="Kurangi ${esc(p.name)}">−</button>
              <span aria-label="Jumlah">${it.qty}</span>
              <button type="button" data-action="inc" aria-label="Tambah ${esc(p.name)}">+</button>
            </div>
            <strong>${rupiah(it.unitPrice * it.qty)}</strong>
          </div>
        </div>
        <button class="cart-item__remove" type="button" data-action="remove" aria-label="Hapus ${esc(p.name)}">${ICON.trash}</button>
      </li>`;
    }).join('');

    if (fKey && fAct) {
      const el = $(`[data-key="${CSS.escape(fKey)}"] [data-action="${fAct}"]`, $('#cartList'));
      el?.focus({ preventScroll: true });
    }

    $('#sumSubtotal').textContent = rupiah(Cart.subtotal());
    $('#sumTotal').textContent = rupiah(Cart.total());

    const promo = Cart.promoInfo();
    const msg = $('#promoMsg');
    const row = $('#sumDiscountRow');
    row.hidden = !(promo && promo.valid);
    msg.className = 'promo-msg';
    if (promo) {
      $('#promoInput').value = promo.code;
      if (promo.valid) {
        $('#sumDiscountLabel').textContent = `Diskon (${promo.code})`;
        $('#sumDiscount').textContent = `-${rupiah(promo.amount)}`;
        msg.classList.add('ok');
        msg.innerHTML = `✓ ${esc(promo.def.label)} terpasang. <button type="button" class="link-btn" data-remove-promo>Hapus</button>`;
      } else {
        msg.classList.add('warn');
        msg.innerHTML = `${esc(promo.reason)} <button type="button" class="link-btn" data-remove-promo>Hapus</button>`;
      }
    } else {
      msg.innerHTML = '';
    }
  }

  function initCart() {
    $('#cartToggle').addEventListener('click', openCart);
    Cart.subscribe(renderCart);
    renderCart();

    $('#cartList').addEventListener('click', (e) => {
      const b = e.target.closest('[data-action]');
      if (!b) return;
      const key = b.closest('[data-key]').dataset.key;
      const it = Cart.items().find((i) => i.key === key);
      if (!it) return;
      const action = b.dataset.action;
      if (action === 'inc') Cart.setQty(key, it.qty + 1);
      else if (action === 'dec') Cart.setQty(key, it.qty - 1);
      else if (action === 'remove') {
        const snapshot = { ...it, toppings: [...it.toppings] };
        b.closest('li').classList.add('removing');
        setTimeout(() => {
          Cart.remove(key);
          toast(`${Cart.product(it.id).name} dihapus`, { type: 'info', action: { label: 'Urungkan', fn: () => Cart.add(snapshot) } });
        }, 230);
      }
    });

    $('#promoForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const r = Cart.applyPromo($('#promoInput').value);
      if (!r.ok) {
        const msg = $('#promoMsg');
        msg.className = 'promo-msg err';
        msg.textContent = r.message;
        $('#promoInput').classList.remove('invalid');
        void $('#promoInput').offsetWidth;
        $('#promoInput').classList.add('invalid');
      } else if (r.valid) {
        toast(r.message);
      }
    });
    $('#promoInput').addEventListener('input', (e) => e.target.classList.remove('invalid'));
    $('#promoMsg').addEventListener('click', (e) => {
      if (e.target.closest('[data-remove-promo]')) {
        Cart.removePromo();
        $('#promoInput').value = '';
      }
    });

    // data pemesan
    const form = $('#checkoutForm');
    const nameEl = $('#coName'), addrEl = $('#coAddress'), addrField = $('#coAddressField');
    const saved = store.get('ny-customer', {});
    if (saved.name) nameEl.value = saved.name;
    if (saved.address) addrEl.value = saved.address;
    if (saved.method) {
      const r = $(`input[name="method"][value="${saved.method}"]`, form);
      if (r) r.checked = true;
    }
    const method = () => $('input[name="method"]:checked', form).value;
    const syncMethod = () => { addrField.hidden = method() !== 'delivery'; };
    syncMethod();
    form.addEventListener('change', (e) => { if (e.target.name === 'method') syncMethod(); });
    [nameEl, addrEl].forEach((el) => el.addEventListener('input', () => el.classList.remove('invalid')));

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!Cart.count()) return;
      const c = { name: nameEl.value.trim(), method: method(), address: addrEl.value.trim(), time: $('#coTime').value };
      const bad = (el, m) => {
        el.classList.remove('invalid');
        void el.offsetWidth;
        el.classList.add('invalid');
        el.focus();
        toast(m, { type: 'error' });
      };
      if (c.name.length < 2) return bad(nameEl, 'Isi nama kamu dulu ya.');
      if (c.method === 'delivery' && c.address.length < 8) return bad(addrEl, 'Alamat pengantaran belum lengkap.');
      store.set('ny-customer', { name: c.name, method: c.method, address: c.address });
      window.open(Cart.checkoutUrl(c), '_blank', 'noopener');
      toast('Pesanan siap dikirim lewat WhatsApp!', {
        duration: 8000,
        action: { label: 'Kosongkan keranjang', fn: () => { Cart.clear(); closeLayer($('#cartDrawer')); } },
      });
    });
  }

  /* ---------------- Promo & countdown ---------------- */
  function initPromos() {
    $('#promoGrid').innerHTML = DATA.promos.map((p, i) => `
      <article class="promo-card reveal" style="--c1:${p.c1};--c2:${p.c2};--d:${i}">
        <span class="promo-card__tag">${esc(p.tag)}</span>
        <h3>${esc(p.title)}</h3>
        <p>${esc(p.desc)}</p>
        ${p.happy ? '<p class="promo-card__status" id="happyStatus"></p>' : ''}
        <div class="promo-card__cups">${p.cups.map((id) => `<div>${cupSVG(findProduct(id))}</div>`).join('')}</div>
        <div class="promo-card__code">
          <span>Kode: <b>${esc(p.code)}</b></span>
          <button class="btn btn--light btn--sm" type="button" data-code="${esc(p.code)}">Pakai Kode</button>
        </div>
      </article>`).join('');

    $('#promoGrid').addEventListener('click', (e) => {
      const b = e.target.closest('[data-code]');
      if (!b) return;
      const code = b.dataset.code;
      navigator.clipboard?.writeText(code).catch(() => {});
      const r = Cart.applyPromo(code);
      if (!r.ok) return toast(r.message, { type: 'error' });
      toast(r.valid ? `Kode ${code} disalin & dipakai! ${r.message}` : `Kode ${code} disimpan. ${r.message}`, {
        type: r.valid ? 'success' : 'info',
        duration: 4500,
        action: Cart.count() ? { label: 'Keranjang', fn: openCart } : { label: 'Pilih Menu', fn: () => $('#menu').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' }) },
      });
    });
  }

  function initCountdown() {
    const els = { d: $('#cdDays'), h: $('#cdHours'), m: $('#cdMins'), s: $('#cdSecs') };
    const happy = CFG.promoCodes.HAPPYHOUR?.hours;
    const set = (el, v) => {
      const s = String(v).padStart(2, '0');
      if (el.textContent === s) return;
      el.textContent = s;
      if (!reduceMotion) { el.classList.remove('tick'); void el.offsetWidth; el.classList.add('tick'); }
    };
    const dur = (ms) => {
      const m = Math.ceil(ms / 60000);
      const h = Math.floor(m / 60);
      return h ? `${h} jam ${m % 60} menit` : `${m} menit`;
    };
    const tick = () => {
      const now = new Date();
      const end = new Date(now);
      end.setDate(now.getDate() + ((7 - now.getDay()) % 7)); // Minggu ini
      end.setHours(23, 59, 59, 999);
      let diff = Math.max(0, end - now);
      set(els.d, Math.floor(diff / 864e5)); diff %= 864e5;
      set(els.h, Math.floor(diff / 36e5)); diff %= 36e5;
      set(els.m, Math.floor(diff / 6e4)); diff %= 6e4;
      set(els.s, Math.floor(diff / 1e3));

      const hs = $('#happyStatus');
      if (hs && happy) {
        const start = new Date(now); start.setHours(happy[0], 0, 0, 0);
        const stop = new Date(now); stop.setHours(happy[1], 0, 0, 0);
        if (now >= start && now < stop) hs.textContent = `🟢 Sedang berlangsung · sisa ${dur(stop - now)}`;
        else {
          if (now >= stop) start.setDate(start.getDate() + 1);
          hs.textContent = `⏰ Mulai lagi dalam ${dur(start - now)}`;
        }
      }
    };
    tick();
    setInterval(tick, 1000);
  }

  /* ---------------- Testimoni slider ---------------- */
  function initTestimonials() {
    const list = DATA.testimonials;
    const track = $('#testiTrack'), dotsEl = $('#testiDots'), viewport = $('#testiViewport'), slider = $('#testiSlider');
    const initials = (n) => n.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();

    track.innerHTML = list.map((t, i) => `
      <li class="testi" role="group" aria-roledescription="slide" aria-label="${i + 1} dari ${list.length}">
        <div class="testi__card">
          <div class="testi__stars" aria-label="Rating ${t.rating} dari 5">${'★'.repeat(t.rating)}${'☆'.repeat(5 - t.rating)}</div>
          <blockquote>"${esc(t.text)}"</blockquote>
          <div class="testi__author">
            <span class="avatar" style="--c:${t.color}" aria-hidden="true">${esc(initials(t.name))}</span>
            <div><strong>${esc(t.name)}</strong><small>${esc(t.role)}</small></div>
          </div>
          <span class="testi__fav">Favorit: ${esc(t.fav)}</span>
        </div>
      </li>`).join('');

    let index = 0, perView = 1, maxI = 0, timer = null;

    const update = () => {
      track.style.transform = `translateX(${-index * (100 / perView)}%)`;
      $$('.slider__dot', dotsEl).forEach((d, i) => {
        d.classList.toggle('active', i === index);
        d.setAttribute('aria-current', String(i === index));
      });
    };
    const go = (i) => {
      index = i > maxI ? 0 : i < 0 ? maxI : i;
      update();
    };
    const calc = () => {
      perView = innerWidth >= 1024 ? 3 : innerWidth >= 700 ? 2 : 1;
      track.style.setProperty('--per', perView);
      maxI = Math.max(0, list.length - perView);
      index = Math.min(index, maxI);
      dotsEl.innerHTML = Array.from({ length: maxI + 1 }, (_, i) =>
        `<button class="slider__dot" type="button" data-i="${i}" aria-label="Ke slide ${i + 1}"></button>`).join('');
      update();
    };
    const play = () => { stop(); if (!reduceMotion) timer = setInterval(() => go(index + 1), 5000); };
    const stop = () => clearInterval(timer);

    $('#testiPrev').addEventListener('click', () => { go(index - 1); play(); });
    $('#testiNext').addEventListener('click', () => { go(index + 1); play(); });
    dotsEl.addEventListener('click', (e) => {
      const d = e.target.closest('[data-i]');
      if (d) { go(+d.dataset.i); play(); }
    });
    slider.addEventListener('mouseenter', stop);
    slider.addEventListener('mouseleave', play);
    slider.addEventListener('focusin', stop);
    slider.addEventListener('focusout', play);

    // drag / swipe
    let startX = 0, dx = 0, dragging = false;
    viewport.addEventListener('pointerdown', (e) => {
      if (e.button !== 0) return;
      dragging = true; startX = e.clientX; dx = 0;
      track.classList.add('dragging');
      viewport.classList.add('dragging');
      stop();
    });
    addEventListener('pointermove', (e) => {
      if (!dragging) return;
      dx = e.clientX - startX;
      if (Math.abs(dx) > 5) viewport.setPointerCapture?.(e.pointerId);
      track.style.transform = `translateX(calc(${-index * (100 / perView)}% + ${dx}px))`;
    });
    const end = () => {
      if (!dragging) return;
      dragging = false;
      track.classList.remove('dragging');
      viewport.classList.remove('dragging');
      if (Math.abs(dx) > 50) go(index + (dx < 0 ? 1 : -1));
      else update();
      play();
    };
    addEventListener('pointerup', end);
    addEventListener('pointercancel', end);

    let rt;
    addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(calc, 150); });
    calc();
    play();
  }

  /* ---------------- Galeri & lightbox ---------------- */
  function galleryArt(g) {
    if (g.text) return `<span class="g-item__text">${esc(g.text)}</span>`;
    return `<div class="g-item__art">${g.cups.map((id) => `<div>${cupSVG(findProduct(id))}</div>`).join('')}</div>`;
  }

  function initGallery() {
    const items = DATA.gallery;
    $('#galleryGrid').innerHTML = items.map((g, i) => `
      <button class="g-item${g.span ? ` g-item--${g.span}` : ''} reveal" type="button" data-index="${i}"
        style="--bg-g:${g.bg};--d:${i % 4}" aria-label="Perbesar: ${esc(g.title)}">
        ${galleryArt(g)}
        <span class="g-item__zoom" aria-hidden="true">${ICON.zoom}</span>
        <span class="g-item__cap"><strong>${esc(g.title)}</strong><small>${esc(g.caption)}</small></span>
      </button>`).join('');

    const lb = $('#lightbox');
    let cur = 0;
    const show = (i) => {
      cur = (i + items.length) % items.length;
      const g = items[cur];
      const media = $('#lbMedia');
      media.style.background = g.bg;
      media.innerHTML = galleryArt(g);
      $('#lbCaption').innerHTML = `<strong>${esc(g.title)}</strong><span>${esc(g.caption)}</span>`;
    };
    $('#galleryGrid').addEventListener('click', (e) => {
      const b = e.target.closest('[data-index]');
      if (!b) return;
      show(+b.dataset.index);
      openLayer(lb);
    });
    $$('[data-lb]', lb).forEach((b) => b.addEventListener('click', () => show(cur + +b.dataset.lb)));
    document.addEventListener('keydown', (e) => {
      if (!lb.classList.contains('open')) return;
      if (e.key === 'ArrowRight') show(cur + 1);
      if (e.key === 'ArrowLeft') show(cur - 1);
    });
    // swipe di lightbox
    let sx = null;
    lb.addEventListener('touchstart', (e) => { sx = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener('touchend', (e) => {
      if (sx == null) return;
      const d = e.changedTouches[0].clientX - sx;
      if (Math.abs(d) > 50) show(cur + (d < 0 ? 1 : -1));
      sx = null;
    });
  }

  /* ---------------- Jam buka ---------------- */
  const DAYS = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const toMin = (s) => { const [h, m] = s.split(':').map(Number); return h * 60 + m; };
  const dot = (s) => s.replace(':', '.');

  function openStatus(now = new Date()) {
    const d = now.getDay();
    const mins = now.getHours() * 60 + now.getMinutes();
    const today = CFG.hours[d];
    if (today && mins >= toMin(today[0]) && mins < toMin(today[1])) {
      const left = toMin(today[1]) - mins;
      return { open: true, text: left <= 60 ? `Buka · tutup ${left} menit lagi` : `Buka sekarang · tutup ${dot(today[1])}` };
    }
    for (let i = 0; i < 8; i++) {
      const dd = (d + i) % 7;
      const h = CFG.hours[dd];
      if (!h) continue;
      if (i === 0 && mins >= toMin(h[0])) continue;
      const when = i === 0 ? 'hari ini' : i === 1 ? 'besok' : DAYS[dd];
      return { open: false, text: `Tutup · buka ${when} ${dot(h[0])}` };
    }
    return { open: false, text: 'Tutup sementara' };
  }

  function initHours() {
    const today = new Date().getDay();
    $('#hoursList').innerHTML = [1, 2, 3, 4, 5, 6, 0].map((d) => {
      const h = CFG.hours[d];
      return `<li class="${d === today ? 'today' : ''} ${h ? '' : 'closed'}">
        <span>${DAYS[d]}${d === today ? ' (hari ini)' : ''}</span>
        <span>${h ? `${dot(h[0])} – ${dot(h[1])}` : 'Tutup'}</span>
      </li>`;
    }).join('');

    const update = () => {
      const s = openStatus();
      $$('[data-open-status]').forEach((el) => {
        el.classList.toggle('is-open', s.open);
        $('.status__text', el).textContent = s.text;
      });
    };
    update();
    setInterval(update, 60000);
  }

  /* ---------------- FAQ ---------------- */
  function initFAQ() {
    const list = $('#faqList');
    list.innerHTML = DATA.faq.map((f, i) => `
      <div class="faq__item reveal${i === 0 ? ' open' : ''}" style="--d:${i}">
        <h3>
          <button class="faq__q" type="button" id="faq-q-${i}" aria-expanded="${i === 0}" aria-controls="faq-a-${i}">
            <span>${esc(f.q)}</span><span class="faq__icon" aria-hidden="true"></span>
          </button>
        </h3>
        <div class="faq__a" id="faq-a-${i}" role="region" aria-labelledby="faq-q-${i}">
          <div><p>${esc(f.a)}</p></div>
        </div>
      </div>`).join('');

    list.addEventListener('click', (e) => {
      const btn = e.target.closest('.faq__q');
      if (!btn) return;
      const item = btn.closest('.faq__item');
      const willOpen = !item.classList.contains('open');
      $$('.faq__item', list).forEach((it) => {
        it.classList.remove('open');
        $('.faq__q', it).setAttribute('aria-expanded', 'false');
      });
      if (willOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  }

  /* ---------------- Newsletter ---------------- */
  function initNewsletter() {
    const form = $('#newsletterForm'), input = $('#nlEmail'), msg = $('#nlMsg');
    input.addEventListener('input', () => { input.classList.remove('invalid'); msg.textContent = ''; });
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const v = input.value.trim().toLowerCase();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) {
        input.classList.remove('invalid');
        void input.offsetWidth;
        input.classList.add('invalid');
        msg.textContent = 'Format email belum benar, cek lagi ya.';
        input.focus();
        return;
      }
      const members = store.get('ny-members', []);
      if (members.includes(v)) {
        msg.textContent = 'Email ini sudah terdaftar. Pakai kode YUMK5K ya!';
        return;
      }
      members.push(v);
      store.set('ny-members', members);
      input.value = '';
      msg.textContent = '';
      toast('Yeay, kamu resmi jadi Member Ngops! Pakai kode YUMK5K di order pertama 🎉', { duration: 5500 });
    });
  }

  /* ---------------- Efek: cursor, ripple, tilt ---------------- */
  function initCursor() {
    if (!finePointer || reduceMotion) return;
    const ring = $('#cursor'), dotEl = $('#cursorDot');
    let x = -100, y = -100, rx = x, ry = y, started = false;
    addEventListener('mousemove', (e) => {
      x = e.clientX; y = e.clientY;
      dotEl.style.transform = `translate(${x}px, ${y}px)`;
      if (!started) { started = true; rx = x; ry = y; document.body.classList.add('has-cursor'); requestAnimationFrame(loop); }
    }, { passive: true });
    const loop = () => {
      rx += (x - rx) * 0.2;
      ry += (y - ry) * 0.2;
      ring.style.transform = `translate(${rx}px, ${ry}px)`;
      requestAnimationFrame(loop);
    };
    document.addEventListener('mouseover', (e) => {
      ring.classList.toggle('hover', !!e.target.closest('a, button, [data-tilt], input, select, textarea, label'));
    });
    document.documentElement.addEventListener('mouseleave', () => ring.classList.add('hidden'));
    document.documentElement.addEventListener('mouseenter', () => ring.classList.remove('hidden'));
  }

  function initRipple() {
    if (reduceMotion) return;
    document.addEventListener('pointerdown', (e) => {
      const b = e.target.closest('.btn');
      if (!b) return;
      const r = b.getBoundingClientRect();
      const size = Math.max(r.width, r.height) * 2;
      const s = document.createElement('span');
      s.className = 'ripple';
      s.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX - r.left - size / 2}px;top:${e.clientY - r.top - size / 2}px`;
      b.appendChild(s);
      s.addEventListener('animationend', () => s.remove());
    });
  }

  function initTilt() {
    if (!finePointer || reduceMotion) return;
    document.addEventListener('pointermove', (e) => {
      const el = e.target.closest('[data-tilt]');
      if (!el) return;
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      el.style.transform = `perspective(900px) rotateX(${(-py * 9).toFixed(2)}deg) rotateY(${(px * 11).toFixed(2)}deg) translateY(-6px)`;
      el.style.setProperty('--mx', `${((px + 0.5) * 100).toFixed(1)}%`);
      el.style.setProperty('--my', `${((py + 0.5) * 100).toFixed(1)}%`);
    });
    document.addEventListener('pointerout', (e) => {
      const el = e.target.closest('[data-tilt]');
      if (el && !el.contains(e.relatedTarget)) el.style.transform = '';
    });
  }

  /* ---------------- Init ---------------- */
  function init() {
    applyConfig();
    initTheme();
    initPreloader();
    initNavbar();
    initHero();
    renderIllustrations();
    initMenu();
    initProductModal();
    initCart();
    initPromos();
    initCountdown();
    initTestimonials();
    initGallery();
    initHours();
    initFAQ();
    initNewsletter();
    initReveal();
    initCounters();
    initCursor();
    initRipple();
    initTilt();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
