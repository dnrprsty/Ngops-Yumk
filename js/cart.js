/* ==========================================================
   KERANJANG BELANJA + CHECKOUT WHATSAPP
   ========================================================== */
(function () {
  'use strict';

  const CFG = window.NGOPS_CONFIG;
  const DATA = window.NGOPS_DATA;
  const KEY = 'ny-cart-v1';
  const PROMO_KEY = 'ny-promo-v1';
  const listeners = [];
  const state = { items: [], promo: null };

  const money = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 });
  const format = (n) => money.format(Math.round(n)).replace(/\s/g, '');

  const product = (id) => DATA.menu.find((m) => m.id === id);
  const opt = (group, id) => DATA.options[group].find((o) => o.id === id);

  function keyOf(i) {
    return [i.id, i.size, i.sugar, i.ice, [...i.toppings].sort().join('+'), (i.note || '').trim().toLowerCase()].join('|');
  }

  function load() {
    try {
      const raw = JSON.parse(localStorage.getItem(KEY) || '[]');
      state.items = Array.isArray(raw) ? raw.filter((i) => product(i.id) && i.qty > 0) : [];
      state.promo = localStorage.getItem(PROMO_KEY) || null;
      if (state.promo && !CFG.promoCodes[state.promo]) state.promo = null;
    } catch (e) {
      state.items = [];
    }
  }

  function save() {
    try {
      localStorage.setItem(KEY, JSON.stringify(state.items));
      if (state.promo) localStorage.setItem(PROMO_KEY, state.promo);
      else localStorage.removeItem(PROMO_KEY);
    } catch (e) { /* storage penuh / mode privat */ }
    listeners.forEach((fn) => fn());
  }

  function unitPrice(p, size, toppings) {
    const s = opt('sizes', size);
    const t = (toppings || []).reduce((sum, id) => sum + (opt('toppings', id)?.price || 0), 0);
    return p.price + (s ? s.price : 0) + t;
  }

  function add(item) {
    const it = { ...item, toppings: [...(item.toppings || [])] };
    it.key = keyOf(it);
    const existing = state.items.find((x) => x.key === it.key);
    if (existing) existing.qty = Math.min(99, existing.qty + it.qty);
    else state.items.push(it);
    save();
  }

  function setQty(key, qty) {
    const it = state.items.find((x) => x.key === key);
    if (!it) return;
    if (qty <= 0) return remove(key);
    it.qty = Math.min(99, qty);
    save();
  }

  function remove(key) {
    state.items = state.items.filter((x) => x.key !== key);
    save();
  }

  function clear() {
    state.items = [];
    state.promo = null;
    save();
  }

  const count = () => state.items.reduce((s, i) => s + i.qty, 0);
  const subtotal = () => state.items.reduce((s, i) => s + i.unitPrice * i.qty, 0);

  function promoInfo(now = new Date()) {
    const code = state.promo;
    if (!code) return null;
    const def = CFG.promoCodes[code];
    if (!def) return null;
    const sub = subtotal();
    const qty = count();
    let reason = '';
    if (def.min && sub < def.min) reason = `Belanja ${format(def.min - sub)} lagi untuk memakai kode ${code}.`;
    else if (def.minQty && qty < def.minQty) reason = `Tambah ${def.minQty - qty} cup lagi untuk memakai kode ${code}.`;
    else if (def.hours) {
      const h = now.getHours();
      if (h < def.hours[0] || h >= def.hours[1]) reason = `Kode ${code} hanya berlaku pukul ${def.hours[0]}.00–${def.hours[1]}.00.`;
    }
    const valid = !reason && sub > 0;
    let amount = 0;
    if (valid) amount = def.type === 'percent' ? Math.round((sub * def.value) / 100) : Math.min(def.value, sub);
    return { code, def, valid, reason, amount };
  }

  function applyPromo(raw) {
    const code = String(raw || '').trim().toUpperCase();
    if (!code) return { ok: false, message: 'Masukkan kode promo dulu ya.' };
    if (!CFG.promoCodes[code]) return { ok: false, message: `Kode "${code}" tidak ditemukan.` };
    state.promo = code;
    save();
    const info = promoInfo();
    return { ok: true, valid: info.valid, message: info.valid ? `${info.def.label} berhasil dipakai!` : info.reason };
  }

  function removePromo() {
    state.promo = null;
    save();
  }

  const discount = () => promoInfo()?.amount || 0;
  const total = () => Math.max(0, subtotal() - discount());

  function describe(item) {
    const p = product(item.id);
    const parts = [opt('sizes', item.size)?.label, opt('sugar', item.sugar)?.label];
    if (p && p.type !== 'hot') parts.push(opt('ice', item.ice)?.label);
    (item.toppings || []).forEach((t) => parts.push('+' + (opt('toppings', t)?.label || t)));
    return parts.filter(Boolean).join(' • ');
  }

  function buildMessage(c) {
    const lines = [`Halo *${CFG.brand}*! 👋 Saya mau pesan:`, ''];
    state.items.forEach((it, i) => {
      const p = product(it.id);
      lines.push(`${i + 1}. *${p.name}* x${it.qty}`);
      lines.push(`   ${describe(it)}`);
      if (it.note) lines.push(`   Catatan: ${it.note}`);
      lines.push(`   ${format(it.unitPrice * it.qty)}`);
    });
    lines.push('', `Subtotal: ${format(subtotal())}`);
    const promo = promoInfo();
    if (promo && promo.valid) lines.push(`Diskon (${promo.code}): -${format(promo.amount)}`);
    lines.push(`*Total: ${format(total())}*`, '');
    lines.push(`Nama: ${c.name}`);
    lines.push(`Metode: ${c.method === 'delivery' ? 'Diantar' : 'Ambil di kedai'}`);
    if (c.method === 'delivery') lines.push(`Alamat: ${c.address}`);
    if (c.time) lines.push(`Waktu: ${c.time}`);
    if (c.method === 'delivery') lines.push('', '_Mohon info ongkirnya ya._');
    lines.push('', 'Terima kasih! ☕');
    return lines.join('\n');
  }

  const checkoutUrl = (c) => `https://wa.me/${CFG.whatsapp}?text=${encodeURIComponent(buildMessage(c))}`;

  load();

  // sinkron antar tab
  window.addEventListener('storage', (e) => {
    if (e.key === KEY || e.key === PROMO_KEY) {
      load();
      listeners.forEach((fn) => fn());
    }
  });

  window.Cart = {
    items: () => state.items,
    promoCode: () => state.promo,
    subscribe: (fn) => listeners.push(fn),
    add, setQty, remove, clear, count, subtotal, discount, total,
    promoInfo, applyPromo, removePromo, unitPrice, describe, product,
    buildMessage, checkoutUrl, format,
  };
})();
