// Monta o link "Projeto visual" (projeto-visual/index.html): só as telas do projeto, sem valores, depois da reunião de 05/11/2026.
// O cabeçalho, o rodapé, o índice e o motor vêm do index.html; as telas são escritas aqui, a partir dos dados abaixo.
// Uso: node tools/projeto-visual.mjs   (rode antes node tools/pv-assets.mjs)
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';

const root = new URL('..', import.meta.url);
const base = readFileSync(new URL('index.html', root), 'utf8');
const IMG = '../assets/img/';
const img = n => `${IMG}${n}.webp`;

// ---------- peças da mesa ----------
// botão que amplia a peça; uma lista de imagens vira uma fileira (duo) ou uma pilha (stk)
const pz = (src, gal, cap, mat, w, h) => `<button type="button" class="pz" data-zoom="${img(src)}" data-gallery="${gal}" data-caption="${cap}|${mat}"><img src="${img(src)}" alt="${cap.replace(/^\d+ · /, '')}"${w ? ` style="--w:${w};--h:${h}"` : ''}></button>`;
const legenda = (n, nome, qtd) => `<figcaption><b>${n}</b><span>${nome}</span><em>${qtd}</em></figcaption>`;
const peca = ({ gal, n, nome, qtd, mat, src, w, h }) => `<figure class="pc" style="--w:${w};--h:${h}">${pz(src, gal, `${n} · ${nome}`, mat)}${legenda(n, nome, qtd)}</figure>`;
const grupo = (tipo, { gal, n, nome, qtd, mat, itens, w, h }) => `<figure class="pc" style="--w:${w};--h:${h}"><div class="${tipo}">${itens.map(([src, sub, iw, ih]) => pz(src, gal, `${n} · ${sub}`, mat, iw, ih)).join('')}</div>${legenda(n, nome, qtd)}</figure>`;
const pilha = o => grupo('stk', o), fileira = o => grupo('duo', o);
const row = (...p) => `<div class="row">${p.join('')}</div>`;
const col = (...p) => `<div class="col">${p.join('')}</div>`;
const tile = (pg, t, pn) => `<div class="mc"><i class="pg" data-pg="${pg}"></i><h3>${t}</h3><span class="pn">${pn}</span></div>`;

// ---------- tela de um espaço ----------
function espaco({ id, n, short, marca, titulo, cor, rotulo, vistas, resumo, mesa, como, nota, duas, kv, kvTopo, lay }) {
  const ta = vistas[0].ta || 'Antes';
  const v0 = vistas[0];
  const foto = v => `<div class="cmp" data-ar="${v.ar}"${lay ? ` data-lay="${lay}"` : ""}${duas ? ` data-cap="${v.cap}"` : ''}>
          <img class="ia" src="${img(v.antes)}" alt="${titulo}${duas ? `, ${v.nome.toLowerCase()},` : ''} antes" draggable="false">
          <img class="id" src="${img(v.depois)}" alt="${titulo}${duas ? `, ${v.nome.toLowerCase()},` : ''} depois" draggable="false">
          <span class="tg ta">${ta}</span><span class="tg td">Depois</span>
          <div class="handle" tabindex="0" role="slider" aria-label="Arraste para comparar o antes e o depois" aria-valuemin="0" aria-valuemax="100" aria-valuenow="50"><i></i></div>
          <span class="hint">Arraste para comparar</span>
          <button type="button" class="cz" aria-label="Ampliar as fotos"></button>
        </div>`;
  const kit = `<div class="kit rv" style="--d:3">
            <p class="lbl">As peças</p>
            <p class="sum">${resumo}</p>
          </div>
          <div class="mesa rv" style="--d:3">
            <div class="mi">
            ${mesa.join('\n            ')}
            </div>
          </div>${kv && !kvTopo ? `
          <div class="kv rv" style="--d:4">
            <p class="lbl">KV referência<br>enviado pelo cliente</p>
            ${kv.map(([src, t]) => `<button type="button" class="kvz" data-zoom="${img(src)}" data-gallery="kv-${id}" data-caption="KV referência enviado pelo cliente|${t}"><img src="${img(src)}" alt="KV referência enviado pelo cliente: ${t}"></button>`).join('')}
          </div>` : ''}`;
  const how = `<div class="how rv" style="--d:4">
            <p class="lbl">Como aplica</p>
            <div class="hw${como.length > 3 ? ' q4' : ''}">
              ${como.join('\n              ')}
            </div>
          </div>`;
  // duas vistas ao mesmo tempo: as fotos e o como aplica à esquerda, as peças à direita
  const corpo = duas ? `<div class="sp-body duas">
        <div class="esq">
          <div class="fotos" style="grid-template-columns:${vistas.map(v => v.ar + 'fr').join(' ')}">
            ${vistas.map(v => `<div class="vista"><p class="lbl">${v.nome}</p>${foto(v)}</div>`).join('\n            ')}
          </div>
          ${how}
        </div>
        <div class="side">
          ${kit}
        </div>
      </div>` : `<div class="sp-body">
        ${foto(v0)}
        <div class="side">
          ${kit}
          ${how}
        </div>
      </div>`;
  return `  <!-- ================================================================ ${n} ${titulo.toUpperCase()} -->
  <section class="slide sp" id="${id}" data-sp="${id}" data-short="${short}" data-theme="cream" data-title="${titulo}" style="--bc:${cor}">
    <div class="pad">
      <header class="sp-head">
        <div>
          <p class="brand rv"><b>${n}</b>${marca}</p>
          <h2 class="rv" style="--d:1">${titulo}</h2>
        </div>
        ${duas ? `<div class="views rv" style="--d:2"><span class="vl">${rotulo}</span></div>` : vistas.length > 1 ? `<div class="views rv" style="--d:2" role="group" aria-label="${rotulo}">
          <span class="vl">${rotulo}</span>
          ${vistas.map((v, i) => `<button type="button"${i ? '' : ' class="on"'} data-antes="${img(v.antes)}" data-depois="${img(v.depois)}" data-ar="${v.ar}" data-cap="${v.cap}">${v.nome}</button>`).join('\n          ')}
        </div>` : ''}${kvTopo && !duas ? `<div class="kv kv-topo${kv && kv.length > 2 ? ' kv3' : ''}${vistas.length > 1 ? ' kv-c' : ''} rv" style="--d:2">
          <p class="lbl">KV referência<br>enviado pelo cliente</p>
          ${kv.map(([src, t]) => `<button type="button" class="kvz" data-zoom="${img(src)}" data-gallery="kv-${id}" data-caption="KV referência enviado pelo cliente|${t}"><img src="${img(src)}" alt="KV referência enviado pelo cliente: ${t}"></button>`).join('')}
        </div>` : ''}
      </header>
      ${corpo}
    </div>
    <aside class="notes" hidden><p>${nota}</p></aside>
  </section>
`;
}

// ================== v2: telas novas (estrutura própria; sem "como aplica" e sem textos de apoio) ==================
const BODY_W = 1456, BODY_H = 610;
// tela de 3D: hero à esquerda; à direita o 3D interativo (quando houver) e as outras vistas
function tela3d({ id, n, short, marca, titulo, cor, rotulo, hero, vistas, iframe, nota }) {
  const th = ([src, cap]) => src.startsWith('iframe:') ? `<div class="v3 v3-live" data-cursor><iframe src="${src.slice(7)}" title="${cap}" loading="lazy"></iframe><span>${cap}</span></div>` : `<button type="button" class="pz v3" data-zoom="${img(src)}" data-gallery="3d-${id}" data-caption="${cap}|${titulo}"><img src="${img(src)}" alt="${cap}" loading="lazy"><span>${cap}</span></button>`;
  return `  <!-- ================================================================ ${n} ${titulo.toUpperCase()} · 3D -->
  <section class="slide sp t3d" id="${id}-3d" data-sp="${id}-3d" data-short="${short} · 3D" data-theme="cream" data-title="${titulo} · 3D" style="--bc:${cor}">
    <div class="pad">
      <header class="sp-head">
        <div>
          <p class="brand rv"><b>${n}</b>${marca}</p>
          <h2 class="rv" style="--d:1">${titulo}</h2>
        </div>
        <div class="views rv" style="--d:2"><span class="vl">${rotulo}</span></div>
      </header>
      <div class="t3-body${iframe ? ' com-live' : ''}${vistas.length ? '' : ' so-hero'}">
        <button type="button" class="pz t3-hero" data-zoom="${img(hero[0])}" data-gallery="3d-${id}" data-caption="${hero[1]}|${titulo}"><img src="${img(hero[0])}" alt="${hero[1]}"><span class="t3-tag">${hero[1]}</span></button>
        ${iframe || vistas.length ? `<div class="t3-side">
          ${iframe ? `<div class="t3-live" data-cursor><iframe src="${iframe}" title="Testeira em 3D" loading="lazy"></iframe><button type="button" class="amp" data-live="${iframe}" aria-label="Ampliar"></button></div>` : ''}
          ${vistas.length ? `<div class="t3-vistas n${vistas.length}">${vistas.map(th).join('')}</div>` : ''}
        </div>` : ''}
      </div>
    </div>
    <aside class="notes" hidden><p>${nota}</p></aside>
  </section>
`;
}
// tela do espaço: antes e depois à esquerda (tamanho calculado), peças em cartões legíveis à direita
function espaco2({ id, n, short, marca, titulo, cor, vistas, cards, cols, kv, nota, fotoW }) {
  const sumAr = vistas.reduce((a, v) => a + v.ar, 0);
  const gap = 14 * (vistas.length - 1);
  let h = BODY_H - (vistas.length > 1 ? 28 : 0); let w = h * sumAr + gap;
  const wMax = fotoW || 860; if (w > wMax) { h = (wMax - gap) / sumAr; w = wMax; }
  const ta = v => v.ta || 'Antes';
  const foto = v => `<div class="vista">${vistas.length > 1 ? `<p class="lbl">${v.nome}</p>` : ''}<div class="cmp" data-ar="${v.ar}" data-cap="${v.cap}" style="width:${Math.round(h * v.ar)}px;height:${Math.round(h)}px">
          <img class="ia" src="${img(v.antes)}" alt="${titulo}, ${v.nome.toLowerCase()}, antes" draggable="false">
          <img class="id" src="${img(v.depois)}" alt="${titulo}, ${v.nome.toLowerCase()}, depois" draggable="false">
          <span class="tg ta">${ta(v)}</span><span class="tg td">Depois</span>
          <div class="handle" tabindex="0" role="slider" aria-label="Arraste para comparar o antes e o depois" aria-valuemin="0" aria-valuemax="100" aria-valuenow="50"><i></i></div>
          <span class="hint">Arraste para comparar</span>
          <button type="button" class="cz" aria-label="Ampliar as fotos"></button>
        </div></div>`;
  const card = c => `<figure class="cd" style="--sp:${Math.min(c.span || 1, cols)}"><div class="cd-imgs">${c.imgs.map(([src, sub]) => `<button type="button" class="pz" data-zoom="${img(src)}" data-gallery="${id}" data-caption="${c.n} · ${c.nome}${sub ? ' · ' + sub : ''}|${c.qtd}"><img src="${img(src)}" alt="${c.nome}${sub ? ' · ' + sub : ''}" loading="lazy"></button>`).join('')}</div><figcaption><b>${c.n}</b><span>${c.nome}</span><em>${c.qtd}</em></figcaption></figure>`;
  return `  <!-- ================================================================ ${n} ${titulo.toUpperCase()} -->
  <section class="slide sp e2" id="${id}" data-sp="${id}" data-short="${short}" data-theme="cream" data-title="${titulo}" style="--bc:${cor}">
    <div class="pad">
      <header class="sp-head">
        <div>
          <p class="brand rv"><b>${n}</b>${marca}</p>
          <h2 class="rv" style="--d:1">${titulo}</h2>
        </div>${kv ? `
        <div class="kv kv-topo rv" style="--d:2">
          <p class="lbl">KV referência<br>enviado pelo cliente</p>
          ${kv.map(([src, t]) => `<button type="button" class="kvz" data-zoom="${img(src)}" data-gallery="kv-${id}" data-caption="KV referência enviado pelo cliente|${t}"><img src="${img(src)}" alt="KV: ${t}"></button>`).join('')}
        </div>` : ''}
      </header>
      <div class="e2-body duas">
        <div class="e2-fotos" style="width:${Math.round(w)}px">${vistas.map(foto).join('')}</div>
        <div class="e2-pecas">
          <p class="lbl">As peças</p>
          <div class="cards" style="--cols:${cols}">${cards.map(card).join('')}</div>
        </div>
      </div>
    </div>
    <aside class="notes" hidden><p>${nota}</p></aside>
  </section>
`;
}

const P2 = 'pv2/';
// ---------------- 01 ilha
const nutricao3d = tela3d({ id: 'nutricao', n: '01', short: 'Nutrição esportiva', marca: 'Parmalat Fit', titulo: 'Ilha de nutrição esportiva', cor: '#1E3E94',
  rotulo: 'Modelada nas medidas da loja · concorrência em cinza', hero: [P2 + '3d/ilha-34', 'Lado longo e ponta'],
  vistas: [[P2 + '3d/ilha-testeira', 'Testeiras costa com costa'], [P2 + '3d/ilha-ponta', 'Ponta com a faixa do peso'], [P2 + '3d/ilha-reguas', 'Réguas por prateleira']],
  iframe: 'testeira-3d/?embed=1&v=5', nota: 'As duas testeiras são a mesma peça, de costas uma para a outra.' });
const nutricao = espaco2({ id: 'nutricao', n: '01', short: 'Nutrição esportiva', marca: 'Parmalat Fit', titulo: 'Ilha de nutrição esportiva', cor: '#1E3E94', cols: 1, fotoW: 1030,
  vistas: [{ nome: 'Lado longo', antes: P2 + 'ad/ilha-longo-antes', depois: P2 + 'ad/ilha-longo-depois', ar: 1.5052, cap: 'Lado longo. Simulação com a foto da loja.' },
           { nome: 'Ponta', antes: P2 + 'ad/ilha-ponta-antes', depois: P2 + 'ad/ilha-ponta-depois', ar: 0.53, cap: 'Ponta. Simulação com a foto da loja.' }],
  cards: [
    { n: 1, nome: 'Testeira com abas', qtd: '2 un. · 195 x 60 cm planificada', imgs: [[P2 + 'nutricao/p-testeira-frente', 'Frente'], [P2 + 'nutricao/p-testeira-verso', 'Verso']], span: 2 },
    { n: 2, nome: 'Faixa do peso', qtd: '1 un. · 80 x 15 cm', imgs: [[P2 + 'nutricao/p-faixa-peso', '']] },
    { n: 3, nome: 'Réguas de gôndola', qtd: '46 un. · 41 x 3,8 cm', imgs: [[P2 + 'nutricao/p-regua-logo', 'Logo'], [P2 + 'nutricao/p-regua-15g', '15 g'], [P2 + 'nutricao/p-regua-23g', '23 g'], [P2 + 'nutricao/p-regua-whey', 'Whey'], [P2 + 'nutricao/p-regua-creatina', 'Creatina'], [P2 + 'nutricao/p-regua-barras', 'Barras']] },
  ], nota: '' });
// ---------------- 02 gôndola seca
const seca3d = tela3d({ id: 'seca', n: '02', short: 'Gôndola seca', marca: 'Parmalat Fit', titulo: 'Gôndola seca', cor: '#1E3E94',
  rotulo: 'Três módulos · Parmalat Fit no centro · concorrência em cinza', hero: [P2 + '3d/seca-34', 'O módulo ambientado'],
  vistas: [[P2 + '3d/seca-frente', 'Vista frontal'], ['iframe:produto-3d/?v=8', 'Produto girando na lateral'], [P2 + '3d/seca-moldura', 'Moldura Whey 21 g'], [P2 + '3d/seca-produto', 'Produto encaixado no recorte']],
  nota: '' });
const seca = espaco2({ id: 'seca', n: '02', short: 'Gôndola seca', marca: 'Parmalat Fit', titulo: 'Gôndola seca', cor: '#1E3E94', cols: 3, fotoW: 420,
  vistas: [{ nome: 'Frontal', antes: P2 + 'ad/seca-antes', depois: P2 + 'ad/seca-depois', ar: 0.5573, cap: 'Simulação com a foto da loja.' }],
  cards: [
    { n: 1, nome: 'Laterais com neonflex', qtd: '2 un. · 30 x 232 cm', imgs: [[P2 + 'seca/p-lateral-frente', 'Frente'], [P2 + 'seca/p-lateral-verso', 'Verso']] },
    { n: 2, nome: 'Testeira', qtd: '1 un. · 136 x 54 cm', imgs: [[P2 + 'seca/p-testeira', '']], span: 2 },
    { n: 3, nome: 'Produto giratório', qtd: '2 un. · 18 x 66 cm', imgs: [[P2 + 'seca/p-produto-giratorio', '']] },
    { n: 4, nome: 'Moldura Whey 21 g', qtd: '1 un. · 62 x 47 cm', imgs: [[P2 + 'seca/p-moldura', '']] },
    { n: 5, nome: 'Adesivo de chão', qtd: '1 un. · 136 x 68 cm', imgs: [[P2 + 'seca/p-adesivo-chao', '']] },
    { n: 6, nome: 'Base', qtd: '1 un. · 136 x 19,5 cm', imgs: [[P2 + 'seca/p-base', '']], span: 3 },
  ], nota: 'As réguas são as mesmas da ilha, 3 por prateleira.' });
// ---------------- 03 Pense Zero
const pensezero3d = tela3d({ id: 'pensezero', n: '03', short: 'Pense Zero', marca: 'Batavo Pense Zero', titulo: 'Ponta refrigerada', cor: '#0B7FB4',
  rotulo: 'A ponta refrigerada em 3D, com LED', hero: [P2 + '3d/pensezero-34', 'Perspectiva com LED'],
  vistas: [[P2 + '3d/pensezero-frente', 'Vista frontal'], [P2 + '3d/pensezero-testeira', 'Testeira com LED'], [P2 + '3d/pensezero-faixas', 'Réguas por ocasião'], [P2 + '3d/pensezero-semled', 'Sem LED']], nota: '' });
const pensezero = espaco2({ id: 'pensezero', n: '03', short: 'Pense Zero', marca: 'Batavo Pense Zero', titulo: 'Ponta refrigerada', cor: '#0B7FB4', cols: 3, fotoW: 760,
  vistas: [{ nome: 'Frontal', antes: P2 + 'ad/pensezero-antes', depois: P2 + 'ad/pensezero-depois', ar: 1.3913, cap: 'Simulação com a foto da loja.' }],
  cards: [
    { n: 1, nome: 'Testeira com LED', qtd: '1 un. · 256 x 40 cm', imgs: [[P2 + 'pensezero/testeira', '']], span: 3 },
    { n: 2, nome: 'Laterais', qtd: '2 un. · 35 x 150 cm', imgs: [[P2 + 'pensezero/lateral1', 'Esquerda'], [P2 + 'pensezero/lateral2', 'Direita']] },
    { n: 3, nome: 'Réguas por ocasião', qtd: '7 un. · 62 x 4 e 31 x 4 cm', imgs: [[P2 + 'pensezero/regua-62x4cm', ''], [P2 + 'pensezero/regua-62x4cm2', ''], [P2 + 'pensezero/regua-62x4cm3', ''], [P2 + 'pensezero/regua-62x4cm4', ''], [P2 + 'pensezero/regua-62x4cm5', ''], [P2 + 'pensezero/regua-31x4cm', ''], [P2 + 'pensezero/regua-31x4cm2', '']], span: 2 },
    { n: 4, nome: 'Rodapé', qtd: '1 un. · 250 x 22 cm', imgs: [[P2 + 'pensezero/rodape-250x22cm', '']], span: 3 },
  ], nota: '' });
// ---------------- 04 Président
const president3d = tela3d({ id: 'president', n: '04', short: 'Président', marca: 'Président', titulo: 'Ponta refrigerada de queijos', cor: '#BE0F2D',
  rotulo: 'O expositor como na loja · Président no módulo da ponta', hero: [P2 + '3d/president-esquina', 'A esquina da ponta refrigerada'],
  vistas: [[P2 + '3d/president-testeira', 'Logo em aplique iluminado'], [P2 + '3d/president-34', 'Lateral externa'], [P2 + '3d/president-bob', 'Bandeja do Stick'], [P2 + '3d/president-modulo', 'O módulo Président']], nota: '' });
const president = espaco2({ id: 'president', n: '04', short: 'Président', marca: 'Président', titulo: 'Ponta refrigerada de queijos', cor: '#BE0F2D', cols: 3, fotoW: 700,
  vistas: [{ nome: 'Ponta', antes: 'pv/president/p13-antes', depois: 'pv/president/p13-depois', ar: 1.3173, ta: 'Planograma', cap: 'Simulação sobre o planograma enviado pelo cliente.' }],
  cards: [
    { n: 1, nome: 'Testeira com aplique iluminado', qtd: '1 un. · 125 x 44 cm', imgs: [[P2 + 'president/p-testeira', '']], span: 2 },
    { n: 2, nome: 'Base', qtd: '1 un. · 125 x 25 cm', imgs: [[P2 + 'president/p-base', '']] },
    { n: 3, nome: 'Lateral externa', qtd: '1 un. · 72 x 127 cm', imgs: [[P2 + 'president/p-lateral-externa', '']] },
    { n: 4, nome: 'Lateral interna', qtd: '1 un. · 72 x 127 cm', imgs: [[P2 + 'president/p-lateral-interna', '']] },
    { n: 5, nome: 'Stopper vertical', qtd: '1 un. · 26 x 110 cm', imgs: [[P2 + 'president/p-stopper-frente', 'Frente'], [P2 + 'president/p-stopper-verso', 'Verso']] },
    { n: 6, nome: 'Moldura Bob Esponja', qtd: '1 un. · 38 x 19 cm', imgs: [[P2 + 'president/p-moldura-bob', '']], span: 2 },
    { n: 7, nome: 'Réguas', qtd: '12 un. · 40 x 4 cm', imgs: [[P2 + 'president/p-regua', '']] },
  ], nota: '' });
// ---------------- 05 Sobremesas
const sobremesas3d = tela3d({ id: 'sobremesas', n: '05', short: 'Sobremesas', marca: 'Sobremesas Batavo', titulo: 'Ponto de sobremesas', cor: '#4E2C1B',
  rotulo: 'A geladeira ambientada em 3D', hero: [P2 + '3d/sobremesas-34', 'Perspectiva'],
  vistas: [[P2 + '3d/sobremesas-frente', 'Vista frontal'], [P2 + '3d/sobremesas-testeira', 'Testeira'], [P2 + '3d/sobremesas-lateral', 'Lateral'], [P2 + '3d/sobremesas-reguas', 'Réguas com o nome']], nota: '' });
const sobremesas = espaco2({ id: 'sobremesas', n: '05', short: 'Sobremesas', marca: 'Sobremesas Batavo', titulo: 'Ponto de sobremesas', cor: '#4E2C1B', cols: 3, fotoW: 560,
  vistas: [{ nome: 'Em ângulo', antes: P2 + 'ad/sobremesas-antes', depois: P2 + 'ad/sobremesas-depois', ar: 0.75, cap: 'Simulação com a foto da loja.' }],
  cards: [
    { n: 1, nome: 'Testeira com LED', qtd: '1 un. · 133 x 40 cm', imgs: [[P2 + 'sobremesas/testeira-133x40cm', '']], span: 3 },
    { n: 2, nome: 'Frame', qtd: '1 un. · 62,5 x 173 cm', imgs: [[P2 + 'sobremesas/frame-62-5x173cm', '']] },
    { n: 3, nome: 'Lateral', qtd: '1 un. · 85 x 210 cm', imgs: [[P2 + 'sobremesas/lateral-85x210cm', '']] },
    { n: 4, nome: 'Réguas com o nome', qtd: '5 un. · 41 x 4 e 62 x 4 cm', imgs: [[P2 + 'sobremesas/regua-brigadeirao-41x4cm', ''], [P2 + 'sobremesas/regua-pudim-41x4cm', ''], [P2 + 'sobremesas/regua-creamy-chantilly-41x4cm', ''], [P2 + 'sobremesas/regua-creamy-62x4cm', ''], [P2 + 'sobremesas/regua-flan-62x4cm', '']] },
    { n: 5, nome: 'Rodapé', qtd: '1 un. · 133 x 24 cm', imgs: [[P2 + 'sobremesas/rodape-133x24cm', '']], span: 3 },
  ], nota: '' });

// ---------- capa, contexto e fechamento ----------
const janela = (id, rot, cor, src, pos, alt, d) => `<a href="#${id}" data-goto="${id}" class="rv" style="--d:${d};--bc:${cor}"><img src="${img(src)}" alt="${alt}" style="object-position:${pos}"><span>${rot}</span></a>`;
const capa = `  <!-- ================================================================ CAPA -->
  <section class="slide cover c2" id="capa" data-short="Capa" data-theme="capa" data-title="Capa">
    <div class="c2-txt">
      <div class="c2-main">
        <p class="eyebrow rv">Projeto visual · v2 · Novembro de 2026</p>
        <h1 class="rv" style="--d:1">Lactalis no <em>D'avó Oratório</em></h1>
        <p class="lead rv" style="--d:2">Cinco espaços em 3D e do antes ao depois, com as peças finais de cada marca.</p>
        <div class="start rv" style="--d:3">
          <button type="button" class="cta" data-goto="contexto">Começar<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13M13 6l6 6-6 6"/></svg></button>
          <span class="hint-d">ou use as setas <kbd>←</kbd> <kbd>→</kbd> do teclado</span>
          <span class="hint-m">Role a página para ver os cinco espaços</span>
        </div>
      </div>
      <p class="c2-by rv" style="--d:4"><small>Fale com</small><b>Vanessa Morelli</b><span>Diretora Comercial · 75LAB</span></p>
    </div>
    <div class="c2-art">
      ${janela('nutricao', 'Parmalat Fit', '#1E3E94', 'pv/capa-fit', '100% 62%', 'Sabores e leite', 2)}
      ${janela('pensezero', 'Batavo Pense Zero', '#0B7FB4', 'pv/capa-pensezero', '100% 50%', 'Frutas e iogurte', 3)}
      ${janela('president', 'Président', '#BE0F2D', 'pv/capa-president', '100% 70%', 'Sanduíche de queijo', 4)}
      ${janela('sobremesas', 'Sobremesas Batavo', '#4E2C1B', 'pv/capa-sobremesas', '100% 72%', 'Pudins e sobremesas', 5)}
    </div>
    <aside class="notes" hidden><p>Só o projeto visual, para aprovação. Os valores vêm depois.</p></aside>
  </section>
`;

const hoje = (id, n, a, b, src, pos, alt, d) => `<a href="#${id}" data-goto="${id}" class="rv" style="--d:${d}"><img src="${img(src)}" alt="${alt}" style="object-position:${pos}"><span><b>${n}</b>${a}<small>${b}</small></span></a>`;
const contexto = `  <!-- ================================================================ CONTEXTO -->
  <section class="slide ctx" id="contexto" data-short="O projeto" data-theme="cream" data-title="O projeto">
    <div class="pad">
      <div class="ctx-top">
        <div>
          <p class="eyebrow rv">O projeto</p>
          <h2 class="rv" style="--d:1">Cinco espaços Lactalis na loja, com o Président como estrela.</h2>
          <p class="sub rv" style="--d:2">Mais marca, mais luz e mais facilidade para o cliente escolher. Esta é a etapa do visual: os valores vêm depois da aprovação.</p>
        </div>
        <ul class="stats rv" style="--d:3">
          <li><b>5</b>espaços</li>
          <li><b>3</b>marcas</li>
          <li><b>4</b>com luz de LED</li>
        </ul>
      </div>
      <div class="ctx-mid rv" style="--d:4">
        <p class="lbl">A loja hoje</p>
        <p class="guide">Como ler: cada espaço numa tela, com o <b>1</b>antes e depois, as <b>2</b>peças e <b>3</b>como aplicar.</p>
      </div>
      <div class="today">
        ${hoje('nutricao', '01', 'Ilha de nutrição', 'Parmalat Fit', 'pv/nutricao/hoje', '50% 40%', 'Ilha de nutrição esportiva hoje', 4)}
        ${hoje('seca', '02', 'Gôndola seca', 'Parmalat Fit', 'pv/seca/f-antes', '50% 50%', 'Gôndola seca hoje', 5)}
        ${hoje('pensezero', '03', 'Ponta refrigerada', 'Batavo Pense Zero', 'pv/pensezero/f-antes', '50% 50%', 'Ponta refrigerada hoje', 6)}
        ${hoje('president', '04', 'Gôndola de queijos', 'Président', 'pv/president/antes', '40% 62%', 'Gôndola de queijos hoje', 7)}
        ${hoje('sobremesas', '05', 'Ponto de sobremesas', 'Sobremesas Batavo', 'pv/sobremesas/f-antes', '50% 48%', 'Ponto de sobremesas hoje', 8)}
      </div>
    </div>
    <aside class="notes" hidden><p>Um minuto de contexto: cinco pontos e três marcas. A partir daqui, cada espaço tem uma tela.</p></aside>
  </section>
`;
const passo = (n, t, s) => `<li><span class="pvn"><b>${n}</b><span><strong>${t}</strong><small>${s}</small></span></span></li>`;
const contato = base.match(/<div class="card rv" style="--d:3">[\s\S]*?<\/div>\n    <\/div>\n    <aside/)[0].replace(/<\/div>\n    <\/div>\n    <aside$/, '</div>')
  .replace('Para tirar dúvidas, fechar o escopo e agendar a medição na loja.', 'Para tirar dúvidas, ajustar o projeto e agendar a medição na loja.');
const fim = `  <!-- ================================================================ PRÓXIMOS PASSOS E CONTATO -->
  <section class="slide close" id="contato" data-short="Próximos passos" data-theme="green" data-title="Próximos passos">
    <div class="pad">
      <div class="cl">
        <p class="eyebrow rv">Próximos passos</p>
        <h2 class="rv" style="--d:1">Aprovado o visual, seguimos para os valores.</h2>
        <ol class="tot rv" style="--d:2">
          ${passo('01', 'Aprovação do projeto visual', 'Ajustes nesta etapa não geram retrabalho de orçamento.')}
          ${passo('02', 'Medição na loja', 'Fecha as medidas de cada peça, com atenção ao espaço exato do Président.')}
          ${passo('03', 'Valores', 'Orçamento sobre o projeto aprovado.')}
        </ol>
        <div class="pv-conf rv" style="--d:3">
          <p class="lbl">A confirmar com a loja</p>
          <ul>
            <li>Ponto de energia para a luz na gôndola seca, no Pense Zero, no Président e nas Sobremesas.</li>
            <li>Autorização do D'avó para a testeira do Président, as faixas da ilha e a base do Pense Zero.</li>
            <li>Se o expositor de embutidos sai da frente do painel do Président.</li>
          </ul>
        </div>
      </div>
      ${contato}
    </div>
    <aside class="notes" hidden><p>Aprovando o visual, a 75LAB mede a loja e envia os valores.</p></aside>
  </section>

`;

// ---------- monta a página ----------
const CAPA0 = base.indexOf('  <!-- ================================================================ 01 CAPA -->');
const MAIN1 = base.indexOf('</main>');
if (CAPA0 < 0 || MAIN1 < 0) throw new Error('não achei as marcas do index.html');
const titulo = "Projeto visual v2 · Lactalis no D'avó Oratório · 75LAB";
const desc = "O projeto visual dos cinco espaços Lactalis no D'avó Oratório: Parmalat Fit, Batavo Pense Zero, Président e Sobremesas Batavo.";
let topo = base.slice(0, CAPA0);
const trocar = (a, b) => { const r = topo.replace(a, b); if (r === topo) throw new Error('não achei ' + a); topo = r; };
trocar(/<title>[^<]*<\/title>/, `<title>${titulo}</title>`);
trocar(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${desc}">`);
trocar(/<meta property="og:title" content="[^"]*">/, `<meta property="og:title" content="${titulo}">`);
trocar(/<meta property="og:description" content="[^"]*">/, `<meta property="og:description" content="${desc}">`);
trocar(/<meta property="og:image" content="[^"]*">/, '<meta property="og:image" content="https://projetos.75lab.com.br/lactalis-davo-oratorio/assets/img/pv/og.jpg">');
trocar('<body data-theme="red">', '<body data-theme="capa">');
trocar(/<meta name="theme-color" content="[^"]*">/, '<meta name="theme-color" content="#F7F0DF">');
trocar('<link rel="stylesheet" href="assets/css/deck.css">', '<link rel="stylesheet" href="assets/css/deck.css">\n<link rel="stylesheet" href="projeto-visual.css">\n<link rel="stylesheet" href="projeto-visual-v2.css">');
trocar('01 / 15', '01 / 13');
let html = (topo + capa + '\n' + contexto + '\n' + nutricao3d + '\n' + nutricao + '\n' + seca3d + '\n' + seca + '\n' + pensezero3d + '\n' + pensezero + '\n' + president3d + '\n' + president + '\n' + sobremesas3d + '\n' + sobremesas + '\n' + fim + base.slice(MAIN1))
  .replace(/(["(])assets\//g, '$1../assets/');
if (/R\$/.test(html)) throw new Error('apareceu valor na apresentação');
const V = Date.now().toString(36);
html = html.replace(/(\.(?:webp|css|js|jpg|png))(["')])/g, `$1?v=${V}$2`)
  .replace('</body>', `<div id="live3d" hidden><iframe title="3D ampliado"></iframe><button type="button" aria-label="Fechar">×</button></div>
<script>(function(){const o=document.getElementById('live3d'),f=o.querySelector('iframe');document.addEventListener('click',e=>{const b=e.target.closest('.amp');if(b){e.preventDefault();e.stopPropagation();f.src=b.dataset.live.replace('embed=1','x=1');o.hidden=false;}if(e.target.closest('#live3d button')){o.hidden=true;f.src='about:blank';}},true);document.addEventListener('keydown',e=>{if(!o.hidden&&e.key==='Escape'){o.hidden=true;f.src='about:blank';e.stopPropagation();}},true);})();</script>
</body>`);
mkdirSync(new URL('projeto-visual-v2/', root), { recursive: true });
writeFileSync(new URL('projeto-visual-v2/index.html', root), html);
console.log('projeto-visual-v2/index.html', Math.round(html.length / 1024) + ' KB');
