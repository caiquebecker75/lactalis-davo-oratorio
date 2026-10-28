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

const slides = $$('.slide', stage);
const mainS = slides.filter(s => !s.classList.contains('apx'));
const apxS = slides.filter(s => s.classList.contains('apx'));
const CH = ['Abertura', 'Diagnóstico', 'Estratégia', 'Os seis espaços', 'Implantação', 'Contato', 'Material de apoio'];
const chOf = s => +s.dataset.ch || 0;
const pad = n => String(n).padStart(2, '0');
let cur = null, busy = false, busyT = 0, returnTo = null;

/* ---------------------------------------------------------------------
   Palco: 900 de altura, largura que acompanha a janela (1600 a 2100)
   --------------------------------------------------------------------- */
const qa = parseFloat((location.search.match(/[?&]ar=([\d.]+)/) || [])[1]) || 0; // QA: ?desktop&ar=2.2
function fit() {
  if (mobile) return;
  const vw = innerWidth, vh = innerHeight; if (!vw || !vh) return;
  const a = qa || vw / vh;
  let W = 1600, H = 900;
  if (a > 16 / 9) W = Math.min(2100, Math.round(900 * a));
  else H = Math.min(1100, Math.round(1600 / a));
  stage.style.width = W + 'px'; stage.style.height = H + 'px';
  stage.style.setProperty('--scale', Math.min(vw / W, vh / H).toFixed(4));
  layoutMedia();
}

/* comparador: o quadro ocupa a altura útil; a coluna fica na largura da maior vista */
function layoutMedia() {
  $$('.space').forEach(s => {
    const sp = $('.sp', s), media = $('.media', s), cmp = $('.cmp', media), ctl = $('.ctl', media);
    const H = media.clientHeight - (ctl.offsetHeight || 34) - 12;
    const maxW = sp.clientWidth * (+s.dataset.maxw || .5);
    const size = ar => { let h = H, w = h * ar; if (w > maxW) { w = maxW; h = w / ar; } return [Math.round(w), Math.round(h)]; };
    const ars = $$('.views button', media).map(b => +b.dataset.ar).filter(Boolean);
    media.style.width = Math.max(...ars.map(a => size(a)[0])) + 'px';
    const [w, h] = size(+cmp.dataset.ar);
    cmp.style.width = w + 'px'; cmp.style.height = h + 'px';
  });
}

/* ---------------------------------------------------------------------
   Contadores
   --------------------------------------------------------------------- */
function runCounts(s) {
  $$('[data-count]', s).forEach(el => {
    const to = +el.dataset.count;
    if (RM) { el.textContent = to; return; }
    const t0 = performance.now(), D = 1100;
    const tick = now => {
      const k = Math.min(1, (now - t0) / D), e = 1 - Math.pow(1 - k, 3);
      el.textContent = Math.round(to * e);
      if (k < 1) requestAnimationFrame(tick);
    };
    el.textContent = '0'; requestAnimationFrame(tick);
    setTimeout(() => { el.textContent = to; }, D + 400); // valor final garantido se a animação pausar
  });
}

/* ---------------------------------------------------------------------
   Comparador antes × depois
   --------------------------------------------------------------------- */
function cmpSet(c, p, anim) {
  c.classList.toggle('anim', !!anim && !RM);
  c.style.setProperty('--p', p + '%');
  c.classList.toggle('no-b', p < 10);
  c.classList.toggle('no-a', p > 90);
  const h = $('.handle', c); if (h) h.setAttribute('aria-valuenow', Math.round(100 - p));
  const ab = c.parentElement.querySelector('.ab');
  if (ab) $$('button', ab).forEach(b => b.classList.toggle('on', (b.dataset.ab === 'b' && p >= 99) || (b.dataset.ab === 'a' && p <= 1)));
}
function cmpFade(c, showB) {
  c.classList.toggle('show-b', showB);
  c.classList.toggle('no-b', !showB); c.classList.toggle('no-a', showB);
  const ab = c.parentElement.querySelector('.ab');
  if (ab) $$('button', ab).forEach(b => b.classList.toggle('on', (b.dataset.ab === 'b') === showB));
}
const cmpTimers = new WeakMap();
function cmpReveal(c) {
  clearTimeout(cmpTimers.get(c));
  if (c.dataset.mode === 'fade') {
    if (RM) { cmpFade(c, false); return; }
    cmpFade(c, true);
    cmpTimers.set(c, setTimeout(() => cmpFade(c, false), 900));
    return;
  }
  if (RM) { cmpSet(c, 50); return; }
  cmpSet(c, 100);
  cmpTimers.set(c, setTimeout(() => cmpSet(c, 50, true), 650));
}
$$('.cmp').forEach(c => {
  const media = c.parentElement;
  const abBox = $('.ab', media); if (abBox) c.append(abBox); // antes / depois por cima da foto
  c.style.setProperty('--ar', c.dataset.ar);
  if (c.dataset.mode === 'fade') cmpFade(c, false); else cmpSet(c, 50);
  // arrastar
  if (c.dataset.mode === 'slide') {
    let drag = false;
    const at = e => { const r = c.getBoundingClientRect(); return Math.max(0, Math.min(100, (e.clientX - r.left) / r.width * 100)); };
    c.addEventListener('pointerdown', e => {
      if (e.target.closest('button')) return;
      drag = true; clearTimeout(cmpTimers.get(c)); c.setPointerCapture(e.pointerId); cmpSet(c, at(e), false);
    });
    c.addEventListener('pointermove', e => { if (drag) cmpSet(c, at(e), false); });
    const end = () => { drag = false; };
    c.addEventListener('pointerup', end); c.addEventListener('pointercancel', end);
    const h = $('.handle', c);
    h.addEventListener('keydown', e => {
      const p = parseFloat(c.style.getPropertyValue('--p')) || 50;
      if (e.key === 'ArrowLeft') { e.preventDefault(); e.stopPropagation(); cmpSet(c, Math.max(0, p - 5)); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); e.stopPropagation(); cmpSet(c, Math.min(100, p + 5)); }
    });
  }
  // antes / depois
  $$('.ab button', media).forEach(b => b.addEventListener('click', () => {
    clearTimeout(cmpTimers.get(c));
    if (c.dataset.mode === 'fade') cmpFade(c, b.dataset.ab === 'b');
    else cmpSet(c, b.dataset.ab === 'b' ? 100 : 0, true);
  }));
  // vistas
  $$('.views button', media).forEach(b => b.addEventListener('click', () => {
    if (b.classList.contains('on')) return;
    $$('.views button', media).forEach(x => x.classList.toggle('on', x === b));
    $('.ib', c).src = b.dataset.b; $('.ia', c).src = b.dataset.a;
    c.dataset.ar = b.dataset.ar; c.style.setProperty('--ar', b.dataset.ar); layoutMedia();
    cmpReveal(c);
  }));
  // ampliar: depois e antes da vista atual
  $('.cz', c).addEventListener('click', e => {
    e.stopPropagation();
    const v = $('.views button.on', media), cap = v?.dataset.cap || '';
    const t = c.closest('.slide').dataset.title;
    openLb([{ src: $('.ia', c).src, t: 'Depois · ' + t, d: cap }, { src: $('.ib', c).src, t: 'Antes · ' + t, d: cap }], 0);
  });
});

/* ---------------------------------------------------------------------
   Diagrama de camadas (tela 07)
   --------------------------------------------------------------------- */
const sys = $('.sys');
let sysTimers = [];
function sysRun() {
  sysTimers.forEach(clearTimeout); sysTimers = [];
  if (RM) { sys.dataset.l = 'all'; return; }
  sys.dataset.l = '';
  ['1', '2', '3', 'all'].forEach((l, i) => sysTimers.push(setTimeout(() => { sys.dataset.l = l; }, 700 + i * 900)));
}
$$('.layers li', sys).forEach(li => {
  li.addEventListener('mouseenter', () => { sysTimers.forEach(clearTimeout); sys.dataset.l = li.dataset.l; });
  li.addEventListener('mouseleave', () => { sys.dataset.l = 'all'; });
});

const onEnter = {
  sistema: sysRun,
};
$$('.space').forEach(s => { onEnter[s.id] = () => cmpReveal($('.cmp', s)); });

/* ---------------------------------------------------------------------
   Trilho de preço e placa de corredor
   --------------------------------------------------------------------- */
const ticks = $('#rail .ticks');
const pos = i => (i / (mainS.length - 1) * 100) + '%';
mainS.forEach((s, i) => {
  const b = document.createElement('button');
  b.type = 'button'; b.className = 'tick'; b.dataset.goto = s.id; b.style.left = pos(i);
  b.textContent = pad(i + 1); b.title = `${pad(i + 1)} · ${s.dataset.title}`;
  b.setAttribute('aria-label', `Tela ${i + 1}: ${s.dataset.title}`);
  ticks.append(b);
});
[1, 2, 3, 4].forEach(c => {
  const i = mainS.findIndex(s => chOf(s) === c); if (i < 0) return;
  const l = document.createElement('span'); l.className = 'chl'; l.dataset.ch = c; l.style.left = pos(i); l.textContent = CH[c];
  ticks.append(l);
});
const sign = $('#sign'), signNum = $('#signNum'), signTxt = $('#signTxt');
function setSign(num, txt, swing) {
  if (signNum.textContent === num && signTxt.textContent === txt) return;
  signNum.textContent = num; signTxt.textContent = txt;
  if (swing && !RM) sign.animate([{ transform: 'rotate(2.6deg)' }, { transform: 'rotate(-1.6deg)' }, { transform: 'rotate(.7deg)' }, { transform: 'rotate(0)' }], { duration: 1100, easing: 'ease-out' });
}

function chrome(s, swing) {
  const isApx = s.classList.contains('apx');
  stage.classList.toggle('in-apx', isApx);
  stage.classList.toggle('on-cover', s.id === 'capa');
  $('#backBtn').hidden = !isApx;
  if (isApx) {
    const i = apxS.indexOf(s);
    setSign('A' + (i + 1), 'Material de apoio', swing);
    $$('.tick', ticks).forEach(b => b.classList.remove('cur'));
  } else {
    const i = mainS.indexOf(s), c = chOf(s);
    setSign(pad(i + 1), s.dataset.sign || CH[c], swing);
    $$('.tick', ticks).forEach((b, k) => { b.classList.toggle('cur', k === i); b.classList.toggle('done', k < i); });
    $$('.chl', ticks).forEach(l => l.classList.toggle('cur', +l.dataset.ch === c));
  }
  const list = isApx ? apxS : mainS;
  $('#cnext').hidden = list.indexOf(s) === list.length - 1;
  $$('#menu ol button').forEach(b => b.classList.toggle('cur', b.dataset.id === s.id));
  if (np.classList.contains('open')) fillNotes(s);
  try { history.replaceState(null, '', '#' + s.id); } catch (e) {}
}

/* ---------------------------------------------------------------------
   Transições: a nova tela entra em três faixas (testeira, régua, base)
   --------------------------------------------------------------------- */
function activate(s) {
  s.classList.add('is-active');
  void s.offsetWidth;
  const enter = () => {
    if (s.classList.contains('is-in') || !s.classList.contains('is-active')) return;
    s.classList.add('is-in'); runCounts(s); onEnter[s.id]?.();
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
const easeIO = t => t < .5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2;
function stairFrames(dir) {
  const N = 18, out = [];
  for (let k = 0; k <= N; k++) {
    const t = k / N;
    const x = [0, 1, 2].map(i => easeIO(Math.max(0, Math.min(1, (t - i * .11) / .78))) * 100);
    const X = v => (dir > 0 ? 100 - v : v).toFixed(2) + '%';
    const E = dir > 0 ? '100%' : '0%';
    out.push({ clipPath: `polygon(${E} 0%, ${X(x[0])} 0%, ${X(x[0])} 33.34%, ${X(x[1])} 33.34%, ${X(x[1])} 66.67%, ${X(x[2])} 66.67%, ${X(x[2])} 100%, ${E} 100%)` });
  }
  return out;
}
function show(next, dir) {
  if (!next || next === cur) return;
  if (busy && performance.now() - busyT < 1300) return;
  if (busy) settle();
  const prev = cur; cur = next;
  slides.forEach(s => { if (s !== prev && s !== next && s.classList.contains('is-active')) deactivate(s); });
  chrome(next, !!prev);
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
  const a = next.animate(stairFrames(dir), { duration: 1050, easing: 'linear' });
  prev.animate([{ transform: 'translateX(0)', filter: 'brightness(1)' }, { transform: `translateX(${-dir * 4}%)`, filter: 'brightness(.94)' }], { duration: 1050, easing: 'cubic-bezier(.65,0,.35,1)', fill: 'forwards' });
  after(a, 1300, settle);
}
function go(target, dir) {
  if (typeof target === 'string') target = document.getElementById(target);
  if (!target) return;
  if (mobile) {
    if (target.classList.contains('apx')) html.classList.add('show-apx');
    target.scrollIntoView({ behavior: RM ? 'auto' : 'smooth', block: 'start' });
    return;
  }
  const fromApx = cur && cur.classList.contains('apx'), toApx = target.classList.contains('apx');
  if (toApx && cur && !fromApx) returnTo = cur;
  if (dir === undefined) {
    if (fromApx !== toApx) dir = 0;
    else { const list = toApx ? apxS : mainS; const d = list.indexOf(target) - list.indexOf(cur); dir = Math.abs(d) > 1 ? 0 : Math.sign(d); }
  }
  show(target, dir);
}
function step(d) {
  if (!cur) return;
  const list = cur.classList.contains('apx') ? apxS : mainS;
  const i = list.indexOf(cur) + d;
  if (i >= 0 && i < list.length) go(list[i], d);
}
const back = () => go(returnTo || mainS[0], 0);
$('#cnext').addEventListener('click', () => step(1));
$('#backBtn').addEventListener('click', back);
document.addEventListener('click', e => {
  const g = e.target.closest('[data-goto]'); if (!g) return;
  e.preventDefault(); closeMenu(); go(g.dataset.goto);
});

/* ---------------------------------------------------------------------
   Índice
   --------------------------------------------------------------------- */
const menu = $('#menu');
let menuFocus = null;
[[mainS, $('#menuA'), (s, i) => pad(i + 1)], [apxS, $('#menuB'), (s, i) => 'A' + (i + 1)]].forEach(([list, ol, n]) => {
  list.forEach((s, i) => {
    const li = document.createElement('li'), b = document.createElement('button');
    b.type = 'button'; b.dataset.goto = s.id; b.dataset.id = s.id;
    b.innerHTML = `<b>${n(s, i)}</b><span>${s.dataset.title}</span>`;
    li.append(b); ol.append(li);
  });
});
function openMenu() { menuFocus = document.activeElement; menu.classList.add('open'); setTimeout(() => ($('#menu ol button.cur') || $('#menu ol button'))?.focus(), 60); }
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
// coluna estreita: as peças abrem por um botão ao lado das pranchas
$$('.space').forEach(s => {
  const tiles = $$('.arts [data-zoom]', s); if (!tiles.length) return;
  const b = document.createElement('button');
  b.type = 'button'; b.className = 'pr pc'; b.innerHTML = `As peças <span>${tiles.length}</span>`;
  b.addEventListener('click', () => openLb(tiles.map(item), 0));
  $('.btns', s).prepend(b);
});
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
document.addEventListener('click', e => {
  const c = e.target.closest('[data-copy]'); if (!c) return;
  const done = () => { toast.textContent = 'Copiado: ' + c.dataset.copy; toast.classList.add('on'); setTimeout(() => toast.classList.remove('on'), 1800); };
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
  if (t.closest?.('.handle')) return;
  switch (e.key) {
    case 'ArrowRight': case 'PageDown': case 'ArrowDown': e.preventDefault(); step(1); break;
    case ' ': if (t.matches?.('button,a')) return; e.preventDefault(); step(1); break;
    case 'ArrowLeft': case 'PageUp': case 'ArrowUp': e.preventDefault(); step(-1); break;
    case 'Home': e.preventDefault(); go(cur?.classList.contains('apx') ? apxS[0] : mainS[0], 0); break;
    case 'End': e.preventDefault(); go(cur?.classList.contains('apx') ? apxS[apxS.length - 1] : mainS[mainS.length - 1], 0); break;
    case 'Escape': if (np.classList.contains('open')) np.classList.remove('open'); else if (cur?.classList.contains('apx')) back(); break;
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
    if (e.target.closest('.cmp')) return;
    const p = e.changedTouches[0], dx = p.clientX - tx, dy = p.clientY - ty;
    if (Date.now() - tt < 800 && Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.3) step(dx < 0 ? 1 : -1);
  }, { passive: true });
}
addEventListener('resize', fit);

/* ---------------------------------------------------------------------
   Celular: rolagem vertical com entrada por interseção
   --------------------------------------------------------------------- */
if (mobile) {
  body.dataset.theme = 'light';
  const enter = s => {
    if (!s.classList.contains('is-in')) { s.classList.add('is-active', 'is-in'); runCounts(s); onEnter[s.id]?.(); }
    cur = s;
  };
  const io = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) enter(en.target); }), { threshold: .15 });
  slides.forEach(s => io.observe(s));
  let raf = 0;
  const check = () => { raf = 0; const vh = innerHeight; slides.forEach(s => { const r = s.getBoundingClientRect(); if (r.height && r.top < vh * .85 && r.bottom > vh * .15) enter(s); }); };
  addEventListener('scroll', () => { if (!raf) raf = setTimeout(check, 60); }, { passive: true });
  setTimeout(check, 300);
  $('#apxOpen').addEventListener('click', () => { html.classList.add('show-apx'); apxS[0].scrollIntoView({ behavior: 'smooth' }); });
  const solo = (location.search.match(/[?&]solo=([\w-]+)/) || [])[1]; // QA: ?solo=whey mostra só uma tela
  if (solo) slides.forEach(s => { if (s.id !== solo) s.style.display = 'none'; else { s.style.display = 'block'; enter(s); } });
  const h = location.hash.slice(1), t = h && document.getElementById(h);
  if (t && !solo) { if (t.classList.contains('apx')) html.classList.add('show-apx'); setTimeout(() => { t.scrollIntoView(); check(); }, 60); }
  return;
}

/* ---------------------------------------------------------------------
   Início
   --------------------------------------------------------------------- */
fit();
const start = document.getElementById(location.hash.slice(1));
show(start && start.classList.contains('slide') ? start : mainS[0], 1);
(document.fonts?.ready || Promise.resolve()).then(layoutMedia);
addEventListener('load', layoutMedia);
addEventListener('hashchange', () => { const t = document.getElementById(location.hash.slice(1)); if (t && t !== cur && t.classList.contains('slide')) go(t); });
})();
