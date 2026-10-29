/* =========================================================================
   Lactalis no D'avó Oratório × 75LAB · motor da apresentação
   HTML, CSS e JS puros. Sem dependências.
   ========================================================================= */
(() => {
'use strict';

const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const html = document.documentElement;
const body = document.body;
const stage = $('#stage');
const STATIC = /[?&]static(=|&|$)/.test(location.search); // QA: telas no estado final, sem movimento
if (STATIC) html.classList.add('static');
const RM = STATIC || matchMedia('(prefers-reduced-motion: reduce)').matches;
const MQ = matchMedia('(max-width: 820px), (orientation: portrait) and (max-width: 1100px)');
const forceDesk = /[?&]desktop(=|&|$)/.test(location.search);
const mobile = !forceDesk && MQ.matches;
if (mobile) html.classList.add('m');
if (!forceDesk) MQ.addEventListener?.('change', () => location.reload());

// data-draft: tela pronta que só entra quando tiver conteúdo (QA: ?draft mostra)
const DRAFT = /[?&]draft(=|&|$)/.test(location.search);
if (DRAFT) $$('.slide[data-draft]', stage).forEach(s => s.removeAttribute('data-draft'));
const slides = $$('.slide:not([data-draft])', stage);
const pad = n => String(n).padStart(2, '0');
let cur = null, busy = false, busyT = 0;

/* ---------------------------------------------------------------------
   Pictogramas do jeito de aplicar (viewBox 160 × 100)
   O desenho sem animação é a peça já aplicada; .a entra de --f, .fl pisca.
   --------------------------------------------------------------------- */
const C = { ink: '#2B2420', red: '#E1261C', redd: '#B8170F', grn: '#0E8C6C', crm: '#FFF8EA', gry: '#CDC1AC', tag: '#F7C531', brn: '#5A3322' };
const tagSvg = (x, y) => `<rect x="${x}" y="${y}" width="30" height="22" rx="3" fill="${C.tag}" stroke="${C.ink}" stroke-width="1.5"/><rect x="${x + 6}" y="${y + 8}" width="18" height="6" rx="2" fill="${C.ink}"/>`;
const PG = {
  trilho: `
    <rect x="8" y="38" width="144" height="34" rx="4" fill="${C.gry}"/>
    <g class="a" style="--f:translateY(-40px) rotate(-4deg);--fo:0;--du:.8s">
      <rect x="12" y="44" width="136" height="22" rx="2" fill="${C.red}"/>
      <rect x="20" y="51" width="46" height="7" rx="3.5" fill="#fff"/>
    </g>
    <rect x="8" y="38" width="144" height="5" rx="2" fill="${C.ink}" opacity=".55"/>
    <rect x="8" y="67" width="144" height="5" rx="2" fill="${C.ink}" opacity=".55"/>
    <g class="a" style="--f:translateY(-22px) scale(.6);--fo:0;--dl:.8s;--du:.5s">${tagSvg(104, 44)}</g>
    <g class="fl" style="--dl:.55s" stroke="${C.grn}" stroke-width="3" stroke-linecap="round"><path d="M10 31l-5-6M150 31l5-6M80 29v-8"/></g>`,
  vhb: `
    <rect x="8" y="20" width="144" height="60" rx="6" fill="${C.gry}"/>
    <g fill="${C.grn}"><rect x="28" y="36" width="12" height="9" rx="1.5"/><rect x="120" y="36" width="12" height="9" rx="1.5"/><rect x="28" y="56" width="12" height="9" rx="1.5"/><rect x="120" y="56" width="12" height="9" rx="1.5"/></g>
    <g class="a" style="--f:translate(16px,-34px) rotate(-7deg);--fo:0;--dl:.3s;--du:.85s;--e:cubic-bezier(.25,1.2,.5,1)">
      <rect x="20" y="32" width="120" height="36" rx="3" fill="${C.red}"/>
      <rect x="32" y="43" width="56" height="8" rx="4" fill="#fff"/>
      <rect x="32" y="56" width="34" height="5" rx="2.5" fill="#fff" opacity=".7"/>
    </g>
    <path class="a" d="M124 30h18v18z" fill="#fff" stroke="${C.ink}" stroke-width="1.2" style="opacity:0;transform:translate(26px,-30px) rotate(40deg);--f:none;--fo:1;--du:.6s;--e:ease-in"/>
    <g class="fl" style="--dl:1s" stroke="${C.grn}" stroke-width="3" stroke-linecap="round"><path d="M52 9v7M80 7v7M108 9v7"/></g>`,
  adesivo: `
    <rect x="22" y="12" width="116" height="76" rx="6" fill="${C.gry}"/>
    <g class="a" style="--f:scaleX(0);--o:0% 50%;--du:1.1s;--e:cubic-bezier(.6,0,.3,1)">
      <rect x="22" y="12" width="116" height="76" rx="6" fill="${C.red}"/>
      <circle cx="108" cy="50" r="19" fill="${C.crm}"/>
      <rect x="34" y="30" width="44" height="9" rx="4.5" fill="#fff"/>
      <rect x="34" y="45" width="30" height="5" rx="2.5" fill="#fff" opacity=".7"/>
      <rect x="34" y="70" width="48" height="6" rx="3" fill="#fff" opacity=".45"/>
    </g>
    <g class="a" style="--f:translateX(-118px);--du:1.1s;--e:cubic-bezier(.6,0,.3,1)">
      <rect x="135" y="6" width="9" height="88" rx="4.5" fill="${C.grn}"/>
      <rect x="141" y="38" width="13" height="24" rx="4" fill="${C.ink}"/>
    </g>`,
  fita: `
    <rect x="6" y="36" width="148" height="8" rx="2" fill="#E6DAC2"/>
    <rect x="6" y="44" width="148" height="18" rx="3" fill="${C.gry}"/>
    <g class="a" style="--f:scaleX(0);--o:0% 50%;--du:1s;--e:cubic-bezier(.6,0,.3,1)">
      <rect x="6" y="48" width="148" height="10" fill="${C.red}"/>
      <rect x="14" y="51.5" width="28" height="3" rx="1.5" fill="#fff"/>
      <rect x="118" y="51.5" width="28" height="3" rx="1.5" fill="#fff"/>
    </g>
    <g class="a" style="--f:translateX(-136px) rotate(-300deg);--du:1s;--e:cubic-bezier(.6,0,.3,1)">
      <circle cx="146" cy="53" r="11" fill="#fff" stroke="${C.ink}" stroke-width="2"/>
      <circle cx="146" cy="53" r="4.5" fill="${C.red}"/>
      <rect x="145" y="42" width="2" height="5" fill="${C.ink}"/>
    </g>
    <g class="a" style="--f:translateY(-26px);--fo:0;--dl:1s;--du:.5s">${tagSvg(62, 42)}</g>`,
  rodape: `
    <rect x="6" y="30" width="148" height="40" rx="4" fill="${C.gry}"/>
    <g class="a" style="--f:scaleX(0);--o:0% 50%;--du:1s;--e:cubic-bezier(.6,0,.3,1)">
      <rect x="6" y="56" width="148" height="10" fill="${C.red}"/>
      <rect x="14" y="59.5" width="28" height="3" rx="1.5" fill="#fff"/>
      <rect x="118" y="59.5" width="28" height="3" rx="1.5" fill="#fff"/>
    </g>
    <g class="a" style="--f:translateX(-136px) rotate(-300deg);--du:1s;--e:cubic-bezier(.6,0,.3,1)">
      <circle cx="146" cy="61" r="11" fill="#fff" stroke="${C.ink}" stroke-width="2"/>
      <circle cx="146" cy="61" r="4.5" fill="${C.red}"/>
      <rect x="145" y="50" width="2" height="5" fill="${C.ink}"/>
    </g>
    <line x1="6" y1="88" x2="154" y2="88" stroke="${C.ink}" stroke-width="3" stroke-linecap="round" opacity=".35"/>`,
  empe: `
    <line x1="8" y1="87" x2="152" y2="87" stroke="${C.ink}" stroke-width="3" stroke-linecap="round" opacity=".5"/>
    <g class="a" style="--f:translateY(-28px);--fo:0;--du:.75s;--e:cubic-bezier(.3,1.25,.5,1)">
      <rect x="76" y="10" width="8" height="74" rx="2" fill="${C.red}"/>
      <rect x="42" y="80" width="76" height="6" rx="2" fill="${C.red}"/>
    </g>
    <g class="a" style="--f:translateY(-36px);--fo:0;--dl:.65s;--du:.55s"><rect x="47" y="54" width="24" height="26" rx="5" fill="#fff" stroke="${C.ink}" stroke-width="2"/><rect x="52" y="62" width="14" height="5" rx="2.5" fill="${C.grn}"/></g>
    <g class="a" style="--f:translateY(-36px);--fo:0;--dl:.85s;--du:.55s"><rect x="89" y="54" width="24" height="26" rx="5" fill="#fff" stroke="${C.ink}" stroke-width="2"/><rect x="94" y="62" width="14" height="5" rx="2.5" fill="${C.grn}"/></g>
    <g class="fl" style="--dl:1.3s" stroke="${C.grn}" stroke-width="3" stroke-linecap="round"><path d="M34 76l-7-4M126 76l7-4"/></g>`,
  estatico: `
    <rect x="26" y="8" width="108" height="84" rx="4" fill="#D6ECF0" stroke="${C.ink}" stroke-width="2"/>
    <path d="M40 84L64 16M54 84L68 44" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".85"/>
    <g class="a" style="--f:translate(36px,-12px) rotate(11deg);--fo:0;--du:.95s;--e:cubic-bezier(.2,.9,.3,1)">
      <rect x="44" y="20" width="72" height="60" rx="3" fill="#fff" stroke="${C.ink}" stroke-width="1.5"/>
      <circle cx="80" cy="43" r="13" fill="${C.red}"/>
      <rect x="58" y="63" width="44" height="7" rx="3.5" fill="${C.grn}"/>
    </g>
    <g class="fl" style="--dl:.85s" stroke="${C.grn}" stroke-width="2.5" fill="none" stroke-linecap="round"><path d="M38 30q-5 3 0 6t0 6"/><path d="M122 54q5 3 0 6t0 6"/></g>`,
  bandeja: `
    <line x1="10" y1="86" x2="150" y2="86" stroke="${C.ink}" stroke-width="3" stroke-linecap="round" opacity=".35"/>
    <rect x="44" y="77" width="72" height="7" rx="1.5" fill="${C.red}"/>
    <rect class="a" x="37" y="51" width="7" height="33" rx="1.5" fill="${C.red}" style="--f:rotate(-90deg);--o:100% 100%;--dl:.25s;--du:.6s;--e:cubic-bezier(.4,1.3,.6,1)"/>
    <g class="a" style="--f:rotate(90deg);--o:0% 100%;--dl:.6s;--du:.6s;--e:cubic-bezier(.4,1.3,.6,1)">
      <rect x="116" y="40" width="7" height="44" rx="1.5" fill="${C.redd}"/>
      <rect x="123" y="44" width="3" height="30" rx="1" fill="#fff" opacity=".85"/>
    </g>
    <g transform="translate(30 27)">
      <circle r="14" fill="#fff" stroke="${C.ink}" stroke-width="2.5"/>
      <rect x="-3" y="-20" width="6" height="4" rx="1" fill="${C.ink}"/>
      <rect class="a" x="-1.5" y="-10" width="3" height="10" rx="1.5" fill="${C.red}" style="--f:rotate(-360deg);--o:50% 100%;--du:1.4s;--e:linear"/>
    </g>
    <text x="52" y="32" font-family="Outfit, sans-serif" font-size="15" font-weight="700" fill="${C.ink}">1 min</text>`,
  cartao: `
    <rect x="14" y="40" width="132" height="42" rx="3" fill="${C.red}"/>
    <g class="a" style="--f:translateY(-48px);--fo:0;--dl:.2s;--du:.8s;--e:cubic-bezier(.3,1.15,.5,1)">
      <rect x="24" y="49" width="112" height="22" rx="3" fill="${C.crm}"/>
      <rect x="56" y="56" width="48" height="8" rx="4" fill="${C.red}"/>
    </g>
    <rect x="19" y="46" width="122" height="29" rx="2" fill="#fff" fill-opacity=".2" stroke="#fff" stroke-width="2"/>
    <path d="M71 46a9 9 0 0 0 18 0" fill="${C.red}" stroke="#fff" stroke-width="2"/>
    <g class="fl" style="--dl:1s" stroke="${C.grn}" stroke-width="2.6" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M80 32V12M73 19l7-7 7 7"/></g>`,
  presilha: `
    <rect x="6" y="58" width="96" height="8" rx="2" fill="${C.gry}"/>
    <path d="M101 47h9v30h-9" fill="none" stroke="${C.ink}" stroke-width="3" stroke-linejoin="round"/>
    <g class="a" style="--f:translateX(30px);--fo:0;--du:.7s;--e:cubic-bezier(.3,1.3,.5,1)">
      <rect x="103" y="53" width="11" height="18" rx="2" fill="#fff" fill-opacity=".7" stroke="${C.ink}" stroke-width="1.5"/>
      <rect x="113" y="14" width="40" height="58" rx="10" fill="${C.red}"/>
      <circle cx="133" cy="35" r="12" fill="#F3D9A4"/>
      <rect x="121" y="55" width="24" height="6" rx="3" fill="#fff"/>
    </g>
    <g class="fl" style="--dl:.65s" stroke="${C.grn}" stroke-width="3" stroke-linecap="round"><path d="M96 41l-5-6M96 83l-5 6"/></g>`,
  nome: `
    <rect x="6" y="36" width="148" height="34" rx="4" fill="${C.gry}"/>
    <rect x="9" y="42" width="142" height="22" fill="${C.brn}"/>
    <path d="M9 42h142v9q-35 6-71 0t-71 0z" fill="#F1DDBA"/>
    <rect x="6" y="36" width="148" height="6" rx="2" fill="${C.ink}" opacity=".5"/>
    <rect x="6" y="64" width="148" height="6" rx="2" fill="${C.ink}" opacity=".5"/>
    ${tagSvg(16, 42)}
    <g class="a" style="--f:translateX(-38px);--dl:.85s;--du:.75s;--e:cubic-bezier(.5,0,.3,1)">
      <g class="a" style="--f:translateY(-30px) scaleY(.7);--fo:0;--du:.6s">
        <rect x="88" y="44" width="48" height="18" rx="5" fill="${C.crm}" stroke="#C68838" stroke-width="1.5"/>
        <circle cx="98" cy="53" r="5" fill="#C68838"/>
        <rect x="107" y="50.5" width="23" height="5" rx="2.5" fill="${C.brn}"/>
      </g>
    </g>
    <g class="fl" style="--dl:1.15s" stroke="${C.grn}" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M88 84h46M94 79l-6 5 6 5M128 79l6 5-6 5"/></g>`,
  mastro: `
    <rect x="76" y="44" width="8" height="56" fill="${C.gry}"/>
    <rect x="44" y="24" width="72" height="28" rx="3" fill="${C.gry}"/>
    <g class="a" style="--f:translateY(-32px);--fo:0;--dl:.2s;--du:.8s;--e:cubic-bezier(.3,1.25,.5,1)">
      <rect x="34" y="20" width="92" height="38" rx="4" fill="${C.red}"/>
      <rect x="38" y="9" width="28" height="22" rx="8" fill="#fff" stroke="${C.red}" stroke-width="3"/>
      <circle cx="114" cy="16" r="12" fill="${C.crm}" stroke="${C.red}" stroke-width="3"/>
      <rect x="70" y="36" width="40" height="7" rx="3.5" fill="#fff"/>
    </g>
    <g class="fl" style="--dl:.9s" stroke="${C.grn}" stroke-width="3" stroke-linecap="round"><path d="M28 64l-6 5M132 64l6 5"/></g>`,
  montantes: `
    <rect x="22" y="40" width="10" height="60" fill="${C.gry}"/>
    <rect x="128" y="40" width="10" height="60" fill="${C.gry}"/>
    <g class="a" style="--f:translateY(-32px);--fo:0;--dl:.2s;--du:.8s;--e:cubic-bezier(.3,1.25,.5,1)">
      <path d="M12 42V22q22-16 46-6t46-6q24-3 44 10v22z" fill="${C.red}"/>
      <rect x="28" y="27" width="48" height="8" rx="4" fill="#fff"/>
      <circle cx="122" cy="25" r="8" fill="#fff"/>
    </g>
    <path d="M20 42h16M140 42h-16" stroke="${C.ink}" stroke-width="3.5" stroke-linecap="round"/>
    <g class="fl" style="--dl:.9s" stroke="${C.grn}" stroke-width="3" stroke-linecap="round"><path d="M16 50l-6 4M144 50l6 4"/></g>`,
};
$$('.pg[data-pg]').forEach(el => {
  el.innerHTML = `<svg viewBox="0 0 160 100" aria-hidden="true">${PG[el.dataset.pg] || ''}</svg>`;
});
function pgPlay(s, d0 = .8) {
  if (RM) return;
  $$('.mc', s).forEach((c, i) => {
    c.style.setProperty('--pd', (d0 + i * .45) + 's');
    c.classList.remove('play'); void c.offsetWidth; c.classList.add('play');
  });
}
$$('.mc').forEach(c => c.addEventListener('mouseenter', () => {
  if (RM) return;
  c.style.setProperty('--pd', '0s');
  c.classList.remove('play'); void c.offsetWidth; c.classList.add('play');
}));
// quem recebe a apresentação pode rever a aplicação das peças
$$('.how > .lbl').forEach(l => {
  const b = document.createElement('button');
  b.type = 'button'; b.className = 'replay';
  b.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12a8 8 0 1 0 2.4-5.7M4 4v4.5h4.5"/></svg>Ver de novo';
  b.addEventListener('click', () => pgPlay(l.closest('.slide'), .1));
  l.append(b);
});

/* ---------------------------------------------------------------------
   Palco: 900 de altura, largura que acompanha a janela (1600 a 2100)
   --------------------------------------------------------------------- */
const qa = parseFloat((location.search.match(/[?&]ar=([\d.]+)/) || [])[1]) || 0; // QA: ?desktop&ar=2.2
function fit() {
  if (!mobile) {
    const vw = innerWidth, vh = innerHeight; if (!vw || !vh) return;
    const a = qa || vw / vh;
    let W = 1600, H = 900;
    if (a > 16 / 9) W = Math.min(2100, Math.round(900 * a));
    else H = Math.min(1100, Math.round(1600 / a));
    stage.style.width = W + 'px'; stage.style.height = H + 'px';
    stage.style.setProperty('--scale', Math.min(vw / W, vh / H).toFixed(4));
  }
  layout();
}
function layout() { $$('.pair').forEach(layoutPair); $$('.mesa').forEach(fitMesa); }

/* antes e depois lado a lado ou um sobre o outro, o que der a foto maior */
function layoutPair(p) {
  const ar = +p.dataset.ar;
  $$('.ph', p).forEach(f => f.style.setProperty('--ar', ar));
  if (mobile) { p.classList.toggle('land', ar > 1); return; }
  const W = p.clientWidth, H = p.clientHeight, g = 40;
  if (!W || !H) return;
  const hs = Math.min(H, (W - g) / (2 * ar));
  const hv = Math.min((H - g) / 2, W / ar);
  const st = hv > hs * 1.02;
  const h = Math.floor(st ? hv : hs), w = Math.floor(h * ar);
  p.classList.toggle('st', st);
  $$('.ph', p).forEach(f => { f.style.width = w + 'px'; f.style.height = h + 'px'; });
}

/* peças na mesma escala: o maior --u (px por cm) que cabe na mesa */
function fitMesa(m) {
  const mi = $('.mi', m), cs = getComputedStyle(m);
  const W = m.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
  const H = m.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
  if (W <= 0) return;
  // celular: as fileiras quebram linha; a escala sai da peça mais larga
  if (mobile) {
    const cm = Math.max(...$$('.pc', m).map(f => parseFloat(f.style.getPropertyValue('--w')) || 0));
    m.style.setProperty('--u', Math.min(6, W / cm).toFixed(3));
    return;
  }
  let lo = .4, hi = 16;
  for (let i = 0; i < 16; i++) {
    const u = (lo + hi) / 2;
    m.style.setProperty('--u', u);
    const ok = mi.offsetWidth <= W + .5 && mi.offsetHeight <= H + .5;
    if (ok) lo = u; else hi = u;
  }
  m.style.setProperty('--u', lo.toFixed(3));
}

/* ---------------------------------------------------------------------
   Antes × depois: vistas, entrada do depois e ampliar
   --------------------------------------------------------------------- */
function pairGo(p) { if (RM || !p) return; p.classList.remove('go'); void p.offsetWidth; p.classList.add('go'); }
$$('.ab').forEach(s => {
  const p = $('.pair', s), ant = $('.ant img', p), dep = $('.dep img', p);
  $$('.views button', s).forEach(b => b.addEventListener('click', () => {
    if (b.classList.contains('on')) return;
    $$('.views button', s).forEach(x => x.classList.toggle('on', x === b));
    ant.src = b.dataset.antes; dep.src = b.dataset.depois;
    p.dataset.ar = b.dataset.ar; layoutPair(p); pairGo(p);
  }));
  $$('.ph', p).forEach(f => f.addEventListener('click', () => {
    const cap = $('.views button.on', s)?.dataset.cap || '';
    const t = $('h2', s).textContent;
    openLb([{ src: dep.src, t: 'Depois · ' + t, d: cap }, { src: ant.src, t: 'Antes · ' + t, d: cap }], f.classList.contains('dep') ? 0 : 1);
  }));
});

const onEnter = s => {
  if (s.classList.contains('ab')) pairGo($('.pair', s));
  if (s.classList.contains('pcs')) pgPlay(s);
};

/* ---------------------------------------------------------------------
   Rodapé: espaços e contador
   --------------------------------------------------------------------- */
const SP = { whey: 'Whey', nutricao: 'Nutrição', seca: 'Gôndola seca', pensezero: 'Pense Zero', president: 'Président', sobremesas: 'Sobremesas' };
const spNav = $('#spaces');
Object.keys(SP).forEach((k, i) => {
  const first = slides.find(s => s.dataset.sp === k); if (!first) return;
  const b = document.createElement('button');
  b.type = 'button'; b.dataset.goto = first.id; b.dataset.sp = k;
  b.innerHTML = `<b>${pad(i + 1)}</b>${SP[k]}`;
  spNav.append(b);
});
function chrome(s) {
  const i = slides.indexOf(s);
  $('#count').textContent = `${pad(i + 1)} / ${pad(slides.length)}`;
  $$('button', spNav).forEach(b => b.classList.toggle('cur', b.dataset.sp === s.dataset.sp));
  const nx = slides[i + 1];
  $('#cnext').hidden = !nx;
  if (nx) { $('#nextT').textContent = nx.dataset.short || nx.dataset.title; $('#cnext').setAttribute('aria-label', 'Próximo: ' + (nx.dataset.short || nx.dataset.title)); }
  $('#cprev').hidden = i === 0;
  $$('#menuA button').forEach(b => b.classList.toggle('cur', b.dataset.id === s.id));
  if (np.classList.contains('open')) fillNotes(s);
  try { history.replaceState(null, '', '#' + s.id); } catch (e) {}
}

/* ---------------------------------------------------------------------
   Transição: a nova tela abre do centro, como a porta automática da loja
   --------------------------------------------------------------------- */
function activate(s) {
  s.classList.add('is-active');
  void s.offsetWidth;
  const enter = () => {
    if (s.classList.contains('is-in') || !s.classList.contains('is-active')) return;
    s.classList.add('is-in'); onEnter(s);
  };
  requestAnimationFrame(enter); setTimeout(enter, 120);
}
function deactivate(s) {
  s.getAnimations?.().forEach(a => a.cancel());
  s.classList.remove('is-active', 'is-in');
  s.style.zIndex = '';
}
function after(anim, ms, fn) {
  let ok = false; const run = () => { if (ok) return; ok = true; fn(); };
  if (anim) anim.onfinish = run;
  setTimeout(run, ms);
}
function settle() {
  slides.forEach(s => { if (s !== cur && s.classList.contains('is-active')) deactivate(s); });
  if (cur && !cur.classList.contains('is-active')) activate(cur);
  if (cur) { cur.style.zIndex = ''; cur.getAnimations?.().forEach(a => { if (a.effect?.getKeyframes?.().some(k => k.clipPath)) a.cancel(); }); }
  busy = false;
}
function show(next, dir) {
  if (!next || next === cur) return;
  if (busy && performance.now() - busyT < 1300) return;
  if (busy) settle();
  const prev = cur; cur = next;
  slides.forEach(s => { if (s !== prev && s !== next && s.classList.contains('is-active')) deactivate(s); });
  chrome(next);
  body.dataset.theme = next.dataset.theme;
  if (!prev || RM) {
    if (prev) deactivate(prev);
    activate(next);
    return;
  }
  busy = true; busyT = performance.now();
  next.style.zIndex = 5;
  activate(next);
  if (dir === 0) {
    const a = next.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 550, easing: 'ease-out' });
    after(a, 750, settle);
    return;
  }
  const a = next.animate([{ clipPath: 'inset(0 50% 0 50%)' }, { clipPath: 'inset(0 0% 0 0%)' }], { duration: 950, easing: 'cubic-bezier(.75,0,.2,1)' });
  prev.animate([{ transform: 'scale(1)', filter: 'brightness(1)' }, { transform: 'scale(.965)', filter: 'brightness(.9)' }], { duration: 950, easing: 'cubic-bezier(.6,0,.3,1)', fill: 'forwards' });
  after(a, 1200, settle);
}
function go(target, dir) {
  if (typeof target === 'string') target = document.getElementById(target);
  if (!target) return;
  if (mobile) { target.scrollIntoView({ behavior: RM ? 'auto' : 'smooth', block: 'start' }); return; }
  if (dir === undefined) { const d = slides.indexOf(target) - slides.indexOf(cur); dir = Math.abs(d) > 1 ? 0 : Math.sign(d); }
  show(target, dir);
}
function step(d) {
  if (!cur) return;
  const i = slides.indexOf(cur) + d;
  if (i >= 0 && i < slides.length) go(slides[i], d);
}
$('#cnext').addEventListener('click', () => step(1));
$('#cprev').addEventListener('click', () => step(-1));
document.addEventListener('click', e => {
  const g = e.target.closest('[data-goto]'); if (!g) return;
  e.preventDefault(); closeMenu(); go(g.dataset.goto);
});

/* ---------------------------------------------------------------------
   Índice
   --------------------------------------------------------------------- */
const menu = $('#menu');
let menuFocus = null;
slides.forEach((s, i) => {
  const li = document.createElement('li'), b = document.createElement('button');
  b.type = 'button'; b.dataset.goto = s.id; b.dataset.id = s.id;
  b.innerHTML = `<b>${pad(i + 1)}</b><span>${s.dataset.title}</span>`;
  li.append(b); $('#menuA').append(li);
});
function openMenu() { menuFocus = document.activeElement; menu.classList.add('open'); setTimeout(() => ($('#menuA button.cur') || $('#menuA button'))?.focus(), 60); }
function closeMenu() { if (!menu.classList.contains('open')) return; menu.classList.remove('open'); menuFocus?.focus?.(); }
$('#menuBtn').addEventListener('click', openMenu);
$('#menuClose').addEventListener('click', closeMenu);
menu.addEventListener('click', e => { if (e.target === menu) closeMenu(); });

/* ---------------------------------------------------------------------
   Imagem ampliada
   --------------------------------------------------------------------- */
const lb = $('#lb'), lbImg = $('#lbImg'), lbCap = $('#lbCap');
let lbList = [], lbI = 0, lbFocus = null;
function lbRender() {
  const it = lbList[lbI];
  lbImg.classList.remove('ld');
  lbImg.onload = () => requestAnimationFrame(() => lbImg.classList.add('ld'));
  lbImg.src = it.src; lbImg.alt = it.t || '';
  lbCap.innerHTML = (it.t ? `<small>${it.t}</small>` : '') + (it.d || '');
  $('#lbCount').textContent = lbList.length > 1 ? `${lbI + 1} / ${lbList.length}` : '';
  $('#lbPrev').style.display = $('#lbNext').style.display = lbList.length > 1 ? '' : 'none';
}
function openLb(items, i) {
  lbList = items; lbI = i || 0; lbFocus = document.activeElement;
  lbRender(); lb.classList.add('open');
  setTimeout(() => $('#lbClose').focus(), 50);
}
const item = el => { const [t, d] = (el.dataset.caption || '').split('|'); return { src: el.dataset.zoom, t, d }; };
function closeLb() { lb.classList.remove('open'); lbFocus?.focus?.(); }
function lbStep(d) { lbI = (lbI + d + lbList.length) % lbList.length; lbRender(); }
$('#lbClose').addEventListener('click', closeLb);
$('#lbPrev').addEventListener('click', () => lbStep(-1));
$('#lbNext').addEventListener('click', () => lbStep(1));
lb.addEventListener('click', e => { if (e.target === lb || e.target.tagName === 'FIGURE') closeLb(); });
document.addEventListener('click', e => {
  const z = e.target.closest('[data-zoom]'); if (!z) return;
  e.preventDefault(); e.stopPropagation();
  const g = z.dataset.gallery, els = g ? $$(`[data-zoom][data-gallery="${g}"]`) : [z];
  openLb(els.map(item), els.indexOf(z));
}, true);
$$('[data-zoom]').forEach(z => { if (!z.getAttribute('aria-label')) z.setAttribute('aria-label', 'Ampliar: ' + ((z.dataset.caption || '').split('|')[0] || '')); });

/* ---------------------------------------------------------------------
   Notas da apresentadora (N) e copiar e-mail
   --------------------------------------------------------------------- */
const np = $('#np');
function fillNotes(s) {
  const n = $('.notes', s);
  np.innerHTML = `<h5>Notas · ${s.dataset.title}</h5>` + (n ? n.innerHTML : '<p>Sem notas para esta tela.</p>');
}
function toggleNotes() { if (!cur) return; fillNotes(cur); np.classList.toggle('open'); }
const toast = $('#toast');
let toastT = 0;
function say(msg, ms = 1800) { toast.textContent = msg; toast.classList.add('on'); clearTimeout(toastT); toastT = setTimeout(() => toast.classList.remove('on'), ms); }
document.addEventListener('click', e => {
  const c = e.target.closest('[data-copy]'); if (!c) return;
  const done = () => say('Copiado: ' + c.dataset.copy);
  if (navigator.clipboard) navigator.clipboard.writeText(c.dataset.copy).then(done, done); else done();
});

/* ---------------------------------------------------------------------
   Teclado, roda e toque
   --------------------------------------------------------------------- */
function trap(e, root) {
  const f = $$('button,a[href],[tabindex]:not([tabindex="-1"])', root).filter(x => x.offsetParent !== null);
  if (!f.length) return;
  const first = f[0], last = f[f.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
}
document.addEventListener('keydown', e => {
  if (lb.classList.contains('open')) {
    if (e.key === 'Escape') closeLb();
    else if (e.key === 'ArrowRight') lbStep(1);
    else if (e.key === 'ArrowLeft') lbStep(-1);
    else if (e.key === 'Tab') trap(e, lb);
    return;
  }
  if (menu.classList.contains('open')) {
    if (e.key === 'Escape' || e.key === 'm' || e.key === 'M') { e.preventDefault(); closeMenu(); }
    else if (e.key === 'Tab') trap(e, menu);
    return;
  }
  if (e.ctrlKey || e.metaKey || e.altKey) return;
  const t = e.target;
  switch (e.key) {
    case 'ArrowRight': case 'PageDown': case 'ArrowDown': e.preventDefault(); step(1); break;
    case ' ': if (t.matches?.('button,a')) return; e.preventDefault(); step(1); break;
    case 'ArrowLeft': case 'PageUp': case 'ArrowUp': e.preventDefault(); step(-1); break;
    case 'Home': e.preventDefault(); go(slides[0], 0); break;
    case 'End': e.preventDefault(); go(slides[slides.length - 1], 0); break;
    case 'Escape': np.classList.remove('open'); break;
    case 'm': case 'M': e.preventDefault(); openMenu(); break;
    case 'n': case 'N': toggleNotes(); break;
    case 'f': case 'F': if (!document.fullscreenElement) html.requestFullscreen?.().catch(() => {}); else document.exitFullscreen?.(); break;
  }
});
if (!mobile) {
  let wAcc = 0, wLast = 0;
  addEventListener('wheel', e => {
    if (lb.classList.contains('open') || menu.classList.contains('open')) return;
    const now = performance.now();
    if (now - wLast > 260) wAcc = 0;
    wAcc += Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
    if (Math.abs(wAcc) > 70 && now - wLast > 950) { step(wAcc > 0 ? 1 : -1); wAcc = 0; wLast = now; }
    else if (now - wLast <= 950) wLast = Math.max(wLast, now - 900);
  }, { passive: true });
  let tx = 0, ty = 0, tt = 0;
  stage.addEventListener('touchstart', e => { const p = e.changedTouches[0]; tx = p.clientX; ty = p.clientY; tt = Date.now(); }, { passive: true });
  stage.addEventListener('touchend', e => {
    const p = e.changedTouches[0], dx = p.clientX - tx, dy = p.clientY - ty;
    if (Date.now() - tt < 800 && Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.3) step(dx < 0 ? 1 : -1);
  }, { passive: true });
}
addEventListener('resize', fit);

/* ---------------------------------------------------------------------
   Celular: rolagem vertical com entrada por interseção
   --------------------------------------------------------------------- */
if (mobile) {
  const enter = s => {
    if (!s.classList.contains('is-in')) { s.classList.add('is-active', 'is-in'); onEnter(s); }
    cur = s;
  };
  const io = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) enter(en.target); }), { threshold: .15 });
  slides.forEach(s => io.observe(s));
  let raf = 0;
  const check = () => { raf = 0; const vh = innerHeight; slides.forEach(s => { const r = s.getBoundingClientRect(); if (r.height && r.top < vh * .85 && r.bottom > vh * .15) enter(s); }); };
  addEventListener('scroll', () => { if (!raf) raf = setTimeout(check, 60); }, { passive: true });
  fit();
  (document.fonts?.ready || Promise.resolve()).then(layout);
  setTimeout(check, 300);
  const solo = (location.search.match(/[?&]solo=([\w-]+)/) || [])[1]; // QA: ?solo=whey mostra só uma tela
  if (solo) slides.forEach(s => { if (s.id !== solo) s.style.display = 'none'; else { enter(s); } });
  const h = location.hash.slice(1), t = h && document.getElementById(h);
  if (t && !solo) setTimeout(() => { t.scrollIntoView(); check(); }, 60);
  return;
}

/* ---------------------------------------------------------------------
   Início
   --------------------------------------------------------------------- */
fit();
const start = document.getElementById(location.hash.slice(1));
show(start && start.classList.contains('slide') ? start : slides[0], 1);
// quem abre o link sozinho precisa saber como avançar
if (!STATIC) setTimeout(() => say('Dica: use as setas ← → do teclado ou o botão Próximo, no canto inferior direito.', 5200), 1500);
(document.fonts?.ready || Promise.resolve()).then(layout);
addEventListener('load', layout);
addEventListener('hashchange', () => { const t = document.getElementById(location.hash.slice(1)); if (t && t !== cur && t.classList.contains('slide')) go(t); });
})();
