/* ==========================================================
   GENERATOR ILUSTRASI CUP KOPI (SVG)
   cupSVG(product, { ice, toppings }) -> string <svg>
   ========================================================== */
(function () {
  'use strict';

  let uid = 0;
  const CUP = 'M30 76 L170 76 L156 244 Q155 252 146 252 L54 252 Q45 252 44 244 Z';
  const ICE_POS = [[58, 100, -14], [104, 94, 12], [80, 132, 24], [122, 130, -8], [64, 164, 6]];
  const BOBA_POS = [
    [56, 240], [70, 243], [84, 241], [98, 244], [112, 241], [126, 243], [140, 240],
    [63, 230], [77, 232], [91, 229], [105, 232], [119, 230], [133, 231], [84, 220], [112, 221],
  ];
  const CRUMBS = [[56, 101, 3], [70, 97, 4], [86, 102, 2.5], [100, 96, 3.5], [114, 101, 3], [128, 97, 4], [142, 102, 2.5], [78, 108, 2.5], [120, 108, 3]];

  const svgOpen = (cls, label) =>
    `<svg class="cup ${cls}" viewBox="0 -24 200 290" xmlns="http://www.w3.org/2000/svg" ${label ? `role="img" aria-label="${label}"` : 'aria-hidden="true"'} focusable="false">`;

  const depthGradient = (id) =>
    `<linearGradient id="${id}-d" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#000" stop-opacity=".2"/>
      <stop offset=".28" stop-color="#000" stop-opacity="0"/>
      <stop offset=".72" stop-color="#fff" stop-opacity=".06"/>
      <stop offset="1" stop-color="#000" stop-opacity=".24"/>
    </linearGradient>`;

  const shadow = '<ellipse class="cup-shadow" cx="100" cy="259" rx="58" ry="7"/>';

  function iced(p, o, id, label) {
    const top = 96, bottom = 252;
    const tops = o.toppings || [];
    const ice = o.ice || 'normal';
    const layers = (p.layers || [['#c69c72', 1]]).slice();

    if (tops.includes('cheese')) layers.push(['#fffaf0', .22]);
    else if (p.deco === 'foam') layers.push(['#f4e6d4', .14]);

    // gradient vertikal: atas -> bawah dengan transisi lembut antar lapisan
    const total = layers.reduce((s, l) => s + l[1], 0);
    const rev = layers.slice().reverse();
    let acc = 0, stops = '';
    rev.forEach((l, i) => {
      const a = acc / total, b = (acc + l[1]) / total;
      acc += l[1];
      const s1 = i === 0 ? 0 : Math.min(a + .035, b);
      const s2 = i === rev.length - 1 ? 1 : Math.max(b - .035, s1);
      stops += `<stop offset="${s1.toFixed(3)}" stop-color="${l[0]}"/><stop offset="${s2.toFixed(3)}" stop-color="${l[0]}"/>`;
    });
    const topColor = rev[0][0];

    const iceCount = ice === 'no' ? 0 : ice === 'less' ? 2 : 4;
    let iceSvg = '';
    for (let i = 0; i < iceCount; i++) {
      const [x, y, r] = ICE_POS[i];
      iceSvg += `<g transform="rotate(${r} ${x + 14} ${y + 14})">
        <rect x="${x}" y="${y}" width="28" height="28" rx="6" fill="#fff" fill-opacity=".32" stroke="#fff" stroke-opacity=".7" stroke-width="1.5"/>
        <path d="M${x + 6} ${y + 9} L${x + 6} ${y + 6} L${x + 10} ${y + 6}" stroke="#fff" stroke-width="2" stroke-linecap="round" fill="none" opacity=".9"/>
      </g>`;
    }

    let bobaSvg = '';
    if (tops.includes('boba') || p.deco === 'boba') {
      bobaSvg = BOBA_POS.map(([x, y]) =>
        `<circle cx="${x}" cy="${y}" r="6.5" fill="#2a1608"/><circle cx="${x - 2}" cy="${y - 2}" r="1.8" fill="#fff" opacity=".35"/>`
      ).join('');
    }

    let decoSvg = '';
    if (p.deco === 'drizzle') {
      decoSvg += `<path d="M34 ${top + 12} q8 12 16 0 t16 0 t16 0 t16 0 t16 0 t16 0 t16 0 t16 0 t16 0" stroke="#c9762b" stroke-width="4" fill="none" stroke-linecap="round" opacity=".85"/>
        <path d="M52 ${top + 16} v34 M96 ${top + 18} v22 M140 ${top + 16} v40" stroke="#c9762b" stroke-width="3.5" stroke-linecap="round" opacity=".6"/>`;
    }
    if (p.deco === 'crumble') {
      decoSvg += CRUMBS.map(([x, y, r], i) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${i % 2 ? '#c79a60' : '#8a5a33'}"/>`).join('');
    }
    if (tops.includes('shot')) {
      decoSvg += `<path d="M48 ${top + 10} C 78 ${top - 2}, 118 ${top + 22}, 152 ${top + 6}" stroke="#2e170a" stroke-width="7" opacity=".5" fill="none" stroke-linecap="round"/>`;
    }

    const straw = p.straw || '#ff6b35';

    return `${svgOpen('cup--iced', label)}
      <defs>
        <clipPath id="${id}-c"><path d="${CUP}"/></clipPath>
        <clipPath id="${id}-above"><rect x="0" y="-30" width="200" height="${top + 30}"/></clipPath>
        <linearGradient id="${id}-l" gradientUnits="userSpaceOnUse" x1="0" y1="${top}" x2="0" y2="${bottom}">${stops}</linearGradient>
        ${depthGradient(id)}
        <g id="${id}-s" transform="rotate(8 112 60)">
          <rect x="106" y="-16" width="13" height="224" rx="6.5" fill="${straw}"/>
          <rect x="108.5" y="-16" width="3" height="224" fill="#fff" opacity=".35"/>
        </g>
      </defs>
      ${shadow}
      <g clip-path="url(#${id}-c)">
        <rect x="20" y="${top}" width="160" height="${bottom - top + 4}" fill="url(#${id}-l)"/>
        <path d="M24 ${top} Q 62 ${top - 7} 100 ${top} T 176 ${top} V ${top + 12} H 24 Z" fill="${topColor}"/>
        ${bobaSvg}
        ${decoSvg}
        <use href="#${id}-s" opacity=".42"/>
        ${iceSvg}
        <rect x="20" y="70" width="160" height="190" fill="url(#${id}-d)"/>
      </g>
      <path class="cup-glass" d="${CUP}"/>
      <path d="M45 92 L56 236" stroke="#fff" stroke-opacity=".55" stroke-width="7" stroke-linecap="round"/>
      <path d="M60 94 L66 196" stroke="#fff" stroke-opacity=".3" stroke-width="2.5" stroke-linecap="round"/>
      <circle cx="100" cy="196" r="22" fill="#fff7ec" stroke="#e8963c" stroke-width="2.5"/>
      <text x="100" y="202.5" text-anchor="middle" font-family="Fredoka, system-ui, sans-serif" font-weight="700" font-size="17" fill="#6f4e37">NY</text>
      <rect class="cup-lid-rim" x="24" y="66" width="152" height="14" rx="7"/>
      <path class="cup-lid-dome" d="M34 68 Q34 28 100 26 Q166 28 166 68 Z"/>
      <path d="M50 60 Q54 40 84 34" stroke="#fff" stroke-opacity=".8" stroke-width="4" fill="none" stroke-linecap="round"/>
      <use href="#${id}-s" clip-path="url(#${id}-above)"/>
    </svg>`;
  }

  function hot(p, o, id, label) {
    const sleeve = p.sleeve || '#6f4e37';
    return `${svgOpen('cup--hot', label)}
      <defs>
        <clipPath id="${id}-c"><path d="${CUP}"/></clipPath>
        ${depthGradient(id)}
      </defs>
      ${shadow}
      <g class="cup-steam" fill="none" stroke-linecap="round">
        <path d="M78 34 q-9 -12 0 -24 t0 -24"/>
        <path d="M100 30 q-9 -12 0 -24 t0 -24"/>
        <path d="M122 34 q-9 -12 0 -24 t0 -24"/>
      </g>
      <path d="${CUP}" fill="#fffaf3"/>
      <g clip-path="url(#${id}-c)">
        <rect x="20" y="126" width="160" height="80" fill="${sleeve}"/>
        <rect x="20" y="126" width="160" height="4" fill="#000" opacity=".15"/>
        <text x="100" y="164" text-anchor="middle" font-family="Fredoka, system-ui, sans-serif" font-weight="700" font-size="18" letter-spacing="3" fill="#fff4e6">NGOPS</text>
        <text x="100" y="186" text-anchor="middle" font-family="Fredoka, system-ui, sans-serif" font-weight="600" font-size="11" letter-spacing="5" fill="#e8963c">YUMK</text>
        <rect x="20" y="70" width="160" height="190" fill="url(#${id}-d)"/>
      </g>
      <path class="cup-paper" d="${CUP}"/>
      <path d="M45 92 L56 236" stroke="#fff" stroke-opacity=".6" stroke-width="6" stroke-linecap="round"/>
      <rect x="22" y="62" width="156" height="16" rx="8" fill="#3b2a20"/>
      <path d="M36 64 Q38 44 60 42 L140 42 Q162 44 164 64 Z" fill="#4d382b"/>
      <rect x="84" y="47" width="32" height="5" rx="2.5" fill="#24170f"/>
      <path d="M48 58 Q52 48 64 46" stroke="#fff" stroke-opacity=".25" stroke-width="3" fill="none" stroke-linecap="round"/>
    </svg>`;
  }

  /**
   * @param {object} product item dari NGOPS_DATA.menu
   * @param {object} [opts] { ice: 'normal'|'less'|'no', toppings: string[], label: string }
   */
  window.cupSVG = function cupSVG(product, opts = {}) {
    const id = 'cup' + (++uid);
    const label = opts.label ? String(opts.label).replace(/"/g, '&quot;') : '';
    return product.type === 'hot' ? hot(product, opts, id, label) : iced(product, opts, id, label);
  };
})();
