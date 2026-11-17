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

// ---------- tela de 3D (nova na v2): o espaço modelado com as peças aplicadas ----------
// hero grande à esquerda; à direita, as outras vistas (ampliam ao clicar) e os destaques; opcional: a testeira em 3D interativo
function tela3d({ id, n, short, marca, titulo, cor, rotulo, hero, vistas, destaques, nota, iframe }) {
  const v = ([src, cap]) => `<button type="button" class="pz v3" data-zoom="${img(src)}" data-gallery="3d-${id}" data-caption="${cap}|${titulo}"><img src="${img(src)}" alt="${cap}"><span>${cap}</span></button>`;
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
      <div class="t3-body">
        <button type="button" class="pz t3-hero rv" style="--d:2" data-zoom="${img(hero[0])}" data-gallery="3d-${id}" data-caption="${hero[1]}|${titulo}"><img src="${img(hero[0])}" alt="${hero[1]}"><span class="t3-tag">3D · ${hero[1]}</span></button>
        <div class="t3-side">
          ${iframe ? `<div class="t3-live rv" style="--d:3" data-cursor><p class="lbl">${iframe.lbl}</p><iframe src="${iframe.src}" title="${iframe.lbl}" loading="lazy"></iframe></div>` : ''}
          <div class="t3-vistas rv" style="--d:3">${vistas.map(v).join('')}</div>
          <ul class="t3-dest rv" style="--d:4">${destaques.map(([t, s2]) => `<li><b>${t}</b><span>${s2}</span></li>`).join('')}</ul>
        </div>
      </div>
    </div>
    <aside class="notes" hidden><p>${nota}</p></aside>
  </section>
`;
}

// ---------- os cinco espaços ----------
const P2 = 'pv2/';
const G1 = 'nutricao';
const nutricao3d = tela3d({
  id: 'nutricao', n: '01', short: 'Nutrição esportiva', marca: 'Parmalat Fit', titulo: 'Ilha de nutrição esportiva', cor: '#1E3E94',
  rotulo: 'A ilha modelada em 3D, nas medidas da loja · concorrência em cinza',
  hero: [P2 + '3d/ilha-34', 'Lado longo e ponta'],
  vistas: [[P2 + '3d/ilha-testeira', 'Testeiras costa com costa'], [P2 + '3d/ilha-ponta', 'Ponta com a faixa do peso'], [P2 + '3d/ilha-reguas', 'Réguas por prateleira']],
  destaques: [['Duas testeiras iguais', 'Abas dobradas viram divisórias; de costas, comunicam os dois lados'], ['Faixa do peso', 'Encaixa na canaleta da ponta, sem ferramenta'], ['Réguas 41 x 3,8 cm', 'Um tamanho só: 3 no lado longo, 2 na ponta']],
  iframe: { src: 'testeira-3d/?embed=1', lbl: 'A testeira em 3D · gire e veja frente, verso e costa com costa' },
  nota: 'A ilha foi modelada nas medidas da VT, com os produtos reais da Parmalat Fit e a concorrência em cinza. As duas testeiras são a mesma peça, de costas uma para a outra: nas pontas, a aba de produtos de uma encontra a aba do logo da outra.',
});
const nutricao = espaco({
  id: 'nutricao', n: '01', short: 'Nutrição esportiva', marca: 'Parmalat Fit', titulo: 'Ilha de nutrição esportiva', cor: '#1E3E94', rotulo: 'A mesma ilha, de dois pontos · simulação com as fotos da loja', duas: true,
  kv: [['pv/nutricao/kv-1', 'Linha Parmalat Fit · iogurtes'], ['pv/nutricao/kv-2', 'Linha Parmalat Fit · Whey 15 g e Flexforce 23 g']],
  vistas: [
    { nome: 'Lado longo', antes: 'pv/nutricao/n-longo-antes', depois: 'pv/nutricao/n-longo-depois', ar: 1.7917, cap: 'Lado longo da ilha. Simulação feita com a foto da loja.' },
    { nome: 'Ponta', antes: 'pv/nutricao/n-ponta-antes', depois: 'pv/nutricao/n-ponta-depois', ar: 0.53, cap: 'Ponta da ilha, com a faixa do peso na prateleira. Simulação feita com a foto da loja.' },
  ],
  resumo: 'Tem Fit com você: duas testeiras com abas que viram divisórias, a faixa do peso na ponta e réguas que nomeiam cada prateleira.',
  mesa: [
    fileira({ gal: G1, n: 1, nome: 'Testeira com abas · frente e verso', qtd: '2 un., uma de costas para a outra', mat: 'PS 2 mm, dobra a quente nas abas e na base', w: 236, h: 36.4, itens: [[P2 + 'nutricao/p-testeira-frente', 'Frente', 117, 36], [P2 + 'nutricao/p-testeira-verso', 'Verso', 117, 36]] }),
    row(
      peca({ gal: G1, n: 2, nome: 'Faixa do peso', qtd: '1 un., na ponta', mat: 'PS recortado; as abas brancas encaixam na canaleta', src: P2 + 'nutricao/p-faixa-peso', w: 110, h: 20.6 }),
      pilha({ gal: G1, n: 3, nome: 'Réguas 41 x 3,8 cm', qtd: '46 un., 6 artes', mat: 'PS impresso, no trilho de preço', w: 112, h: 63, itens: [[P2 + 'nutricao/p-regua-logo', 'Logo', 112, 10.4], [P2 + 'nutricao/p-regua-15g', '15 g de proteína', 112, 10.4], [P2 + 'nutricao/p-regua-23g', '23 g de proteína', 112, 10.4], [P2 + 'nutricao/p-regua-whey', 'Whey protein', 112, 10.4], [P2 + 'nutricao/p-regua-creatina', 'Creatina', 112, 10.4], [P2 + 'nutricao/p-regua-barras', 'Barras proteicas', 112, 10.4]] }),
    ),
  ],
  como: [tile('empe', 'Testeiras em pé, costa com costa', 'Peça 1'), tile('presilha', 'Faixa do peso encaixada na canaleta', 'Peça 2'), tile('trilho', 'Réguas no trilho de preço', 'Peça 3'), tile('caixas', 'A base continua para os produtos', 'Sem comunicação')],
  nota: 'As peças seguem o KV Tem Fit com você. A testeira é uma peça só, com abas dobradas que viram divisórias dos pouches. A faixa do peso leva a marca para a ponta. As réguas têm um tamanho só, 41 x 3,8 cm, e na concorrência levam o nome da categoria.',
});

const G2 = 'seca';
const seca3d = tela3d({
  id: 'seca', n: '02', short: 'Gôndola seca', marca: 'Parmalat Fit', titulo: 'Gôndola seca', cor: '#1E3E94',
  rotulo: 'Três módulos de 130 cm · Parmalat Fit no centro · concorrência em cinza',
  hero: [P2 + '3d/seca-34', 'O módulo Parmalat Fit ambientado'],
  vistas: [[P2 + '3d/seca-frente', 'Vista frontal'], [P2 + '3d/seca-moldura', 'Moldura Whey 21 g'], [P2 + '3d/seca-produto', 'Produto giratório na lateral']],
  destaques: [['Laterais recortadas', 'Avançam no corredor, com neonflex nas curvas'], ['Produto giratório', 'Encaixa no recorte da lateral e gira no eixo'], ['Testeira e base inclinadas', 'Fecham o módulo entre as laterais']],
  nota: 'O módulo central vira um espaço da marca: laterais recortadas com LED na borda, testeira e base inclinadas, moldura na altura dos olhos e o produto girando na lateral.',
});
const seca = espaco({
  id: 'seca', n: '02', short: 'Gôndola seca', marca: 'Parmalat Fit', titulo: 'Gôndola seca', cor: '#1E3E94', rotulo: 'Troque a vista',
  vistas: [
    { nome: 'Frontal', antes: 'pv/seca/n-antes', depois: 'pv/seca/n-depois', ar: 0.5675, cap: 'Vista frontal. Simulação feita com a foto da loja.' },
  ],
  resumo: 'Um módulo inteiro da marca: laterais recortadas com LED, produto que gira, testeira e base inclinadas, moldura do Whey e adesivo de chão.',
  mesa: [
    row(
      fileira({ gal: G2, n: 1, nome: 'Laterais com neonflex', qtd: '2 un., frente e verso', mat: 'PS 10 mm recortado, neonflex 5 mm na borda curva', w: 46, h: 172, itens: [[P2 + 'seca/p-lateral-frente', 'Frente', 23, 172], [P2 + 'seca/p-lateral-verso', 'Verso', 23, 172]] }),
      col(
        peca({ gal: G2, n: 2, nome: 'Testeira inclinada', qtd: '1 un.', mat: 'PS impresso, entre as laterais', src: P2 + 'seca/p-testeira', w: 150, h: 59.6 }),
        row(
          peca({ gal: G2, n: 3, nome: 'Moldura Whey 21 g', qtd: '1 un.', mat: 'PS recortado com neonflex na borda', src: P2 + 'seca/p-moldura', w: 62, h: 47.3 }),
          peca({ gal: G2, n: 4, nome: 'Produto giratório', qtd: '2 un., uma por lateral', mat: 'PS dupla face no eixo', src: P2 + 'seca/p-produto-giratorio', w: 20, h: 59 }),
        ),
        peca({ gal: G2, n: 5, nome: 'Base inclinada', qtd: '1 un.', mat: 'PS impresso, entre as laterais', src: P2 + 'seca/p-base', w: 150, h: 21.5 }),
        peca({ gal: G2, n: 6, nome: 'Adesivo de chão', qtd: '1 un.', mat: 'Vinil de piso antiderrapante', src: P2 + 'seca/p-adesivo-chao', w: 110, h: 55 }),
      ),
    ),
  ],
  como: [tile('retro', 'Laterais com LED avançando no corredor', 'Peças 1 e 4'), tile('empe', 'Testeira e base entre as laterais', 'Peças 2 e 5'), tile('perfil', 'Moldura na altura dos olhos', 'Peça 3'), tile('adesivo', 'Adesivo de chão na frente', 'Peça 6')],
  nota: 'As réguas são as mesmas da ilha, 3 por prateleira. A moldura enquadra o Whey 21 g na altura dos olhos. O produto gira no recorte da lateral e chama de longe.',
});

const G3 = 'pz';
const pensezero3d = tela3d({
  id: 'pensezero', n: '03', short: 'Pense Zero', marca: 'Batavo Pense Zero', titulo: 'Ponta refrigerada', cor: '#0B7FB4',
  rotulo: 'A ponta refrigerada em 3D, com a testeira de LED acesa',
  hero: [P2 + '3d/pensezero-34', 'Perspectiva com LED'],
  vistas: [[P2 + '3d/pensezero-frente', 'Vista frontal'], [P2 + '3d/pensezero-testeira', 'Detalhe da testeira'], [P2 + '3d/pensezero-faixas', 'Faixas por ocasião']],
  destaques: [['Testeira com LED', 'Ilumina o topo da ponta'], ['Faixas por ocasião', 'Café, lanche, compartilhar, sobremesa'], ['Laterais e rodapé', 'Fecham a ponta com a marca']],
  nota: 'A ponta refrigerada do Pense Zero modelada com as peças aplicadas.',
});
const pensezero = espaco({
  id: 'pensezero', n: '03', short: 'Pense Zero', marca: 'Batavo Pense Zero', titulo: 'Ponta refrigerada', cor: '#0B7FB4', rotulo: 'Troque a vista',
  kv: [['pv/pensezero/kv-1', 'Pense Zero · Se parar pra pensar, pense zero'], ['pv/pensezero/kv-2', 'Pense Zero · versão para celular']], kvTopo: true,
  vistas: [
    { nome: 'Frontal', antes: 'pv/pensezero/n-antes', depois: 'pv/pensezero/n-depois', ar: 1.7778, cap: 'Simulação feita com a foto da loja.' },
  ],
  resumo: 'Testeira com LED, laterais, réguas por ocasião e rodapé, na linguagem Se parar pra pensar, pense zero.',
  mesa: [
    peca({ gal: G3, n: 1, nome: 'Testeira com LED', qtd: '1 un.', mat: 'PS recortado com LED', src: P2 + 'pensezero/testeira', w: 236, h: 36.9 }),
    row(
      fileira({ gal: G3, n: 2, nome: 'Laterais', qtd: '2 un.', mat: 'Adesivo em vinil, 35 x 150 cm', w: 42, h: 90, itens: [[P2 + 'pensezero/lateral1', 'Esquerda', 21, 90], [P2 + 'pensezero/lateral2', 'Direita', 21, 90]] }),
      pilha({ gal: G3, n: 3, nome: 'Réguas por ocasião', qtd: '7 un., 5 de 62 cm e 2 de 31 cm', mat: 'PS para frio, no trilho de preço', w: 140, h: 66, itens: [[P2 + 'pensezero/regua-62x4cm', '62 x 4 cm', 140, 9], [P2 + 'pensezero/regua-62x4cm2', '62 x 4 cm', 140, 9], [P2 + 'pensezero/regua-62x4cm3', '62 x 4 cm', 140, 9], [P2 + 'pensezero/regua-62x4cm4', '62 x 4 cm', 140, 9], [P2 + 'pensezero/regua-62x4cm5', '62 x 4 cm', 140, 9], [P2 + 'pensezero/regua-31x4cm', '31 x 4 cm', 70, 9], [P2 + 'pensezero/regua-31x4cm2', '31 x 4 cm', 70, 9]] }),
    ),
    peca({ gal: G3, n: 4, nome: 'Rodapé', qtd: '1 un.', mat: 'Adesivo em vinil, 250 x 22 cm', src: P2 + 'pensezero/rodape-250x22cm', w: 236, h: 20.8 }),
  ],
  como: [tile('retro', 'Testeira com luz', 'Peça 1'), tile('adesivo', 'Adesivo nas duas laterais', 'Peça 2'), tile('trilho', 'Réguas no trilho de preço', 'Peça 3'), tile('adesivo', 'Rodapé por cima do amarelo', 'Peça 4')],
  nota: 'As peças seguem o KV Se parar pra pensar, pense zero, enviado pelo cliente. Medidas se confirmam na medição.',
});

const G4 = 'president';
const president3d = tela3d({
  id: 'president', n: '04', short: 'Président', marca: 'Président', titulo: 'Ponta refrigerada de queijos', cor: '#BE0F2D',
  rotulo: 'O expositor modelado como na loja · Président no módulo da ponta',
  hero: [P2 + '3d/president-esquina', 'A esquina da ponta refrigerada'],
  vistas: [[P2 + '3d/president-34', 'Lateral externa e testeira'], [P2 + '3d/president-stopper', 'Stopper e bandeja do Stick']],
  destaques: [['Logo em aplique iluminado', 'Relevo com luz atrás, sobre a faixa da loja'], ['Lateral externa', 'Chapa por fora da lateral da ponta'], ['Bandeja do Stick', 'Moldura do Bob Esponja para o lançamento']],
  nota: 'O Président fica no módulo da ponta. A testeira tem o logo em aplique com luz atrás. A lateral externa fala com quem chega pelo corredor, e a interna, com a torre Eiffel, acompanha os produtos.',
});
const president = espaco({
  id: 'president', n: '04', short: 'Président', marca: 'Président', titulo: 'Ponta refrigerada de queijos', cor: '#BE0F2D', rotulo: 'Troque a vista',
  kv: [['pv/president/kv-1', 'Encarte Président · Mambo'], ['pv/president/kv-2', 'Encarte Président · Condor'], ['pv/president/kv-3', 'Encarte Président · Condor, fechado']], kvTopo: true, lay: 'lado',
  vistas: [
    { nome: 'Frente', ta: 'Planograma', antes: 'pv/president/p13-antes', depois: 'pv/president/p13-depois', ar: 1.3173, cap: 'Simulação feita sobre a imagem do planograma enviada pelo cliente.' },
  ],
  resumo: 'O sabor que é referência no mundo: testeira com o logo em aplique iluminado, laterais, stopper na divisa, bandeja do Stick e base.',
  mesa: [
    row(
      peca({ gal: G4, n: 2, nome: 'Lateral externa', qtd: '1 un.', mat: 'Chapa de PS, 72 x 127 cm, por fora da ponta', src: P2 + 'president/p-lateral-externa', w: 56, h: 99 }),
      peca({ gal: G4, n: 3, nome: 'Lateral interna', qtd: '1 un.', mat: 'Adesivo em vinil, 72 x 127 cm', src: P2 + 'president/p-lateral-interna', w: 56, h: 99 }),
      fileira({ gal: G4, n: 4, nome: 'Stopper vertical', qtd: '1 un., frente e verso', mat: 'PS recortado, 26 x 110 cm', w: 48, h: 99, itens: [[P2 + 'president/p-stopper-frente', 'Frente', 24, 99], [P2 + 'president/p-stopper-verso', 'Verso', 24, 99]] }),
      col(
        peca({ gal: G4, n: 1, nome: 'Testeira com aplique iluminado', qtd: '1 un.', mat: 'Caixa com logo em relevo e LED atrás, 125 x 44 cm', src: P2 + 'president/p-testeira', w: 150, h: 52.7 }),
        peca({ gal: G4, n: 5, nome: 'Bandeja do Stick com moldura', qtd: '1 un.', mat: 'Bandeja com 3 canais e moldura do Bob Esponja, 38 x 19 cm', src: P2 + 'president/p-moldura-bob', w: 76, h: 37 }),
        peca({ gal: G4, n: 6, nome: 'Réguas de gôndola', qtd: '12 un., 3 por prateleira', mat: 'PS para frio, 40 x 4 cm', src: P2 + 'president/p-regua', w: 128, h: 12.7 }),
        peca({ gal: G4, n: 7, nome: 'Base', qtd: '1 un.', mat: 'Adesivo sobre o para-choque e a frente do poço, 125 x 25 cm', src: P2 + 'president/p-base', w: 150, h: 30.2 }),
      ),
    ),
  ],
  como: [tile('retro', 'Testeira com o logo iluminado', 'Peça 1'), tile('adesivo', 'Laterais externa e interna', 'Peças 2 e 3'), tile('presilha', 'Stopper na divisa e bandeja do Stick', 'Peças 4 e 5'), tile('trilho', 'Réguas no trilho e base', 'Peças 6 e 7')],
  nota: 'É a estrela da vez. A testeira leva o logo em aplique com luz atrás. A bandeja com a moldura do Bob Esponja destaca o lançamento do Stick.',
});

const G5 = 'sob';
const sobremesas3d = tela3d({
  id: 'sobremesas', n: '05', short: 'Sobremesas', marca: 'Sobremesas Batavo', titulo: 'Ponto de sobremesas', cor: '#4E2C1B',
  rotulo: 'A geladeira ambientada · versão com LED',
  hero: [P2 + '3d/sobremesas-ia-led', 'Versão com LED'],
  vistas: [],
  destaques: [['Testeira 133 x 40 cm', 'Com LED, no clima Pudim Lovers'], ['Frame e laterais', 'Vestem a geladeira por fora'], ['Réguas com o nome', 'Brigadeirão, pudim, Creamy e Flan']],
  nota: 'A geladeira vira uma vitrine de confeitaria, na linguagem Pudim Lovers.',
});
const sobremesas = espaco({
  id: 'sobremesas', n: '05', short: 'Sobremesas', marca: 'Sobremesas Batavo', titulo: 'Ponto de sobremesas', cor: '#4E2C1B', rotulo: 'Troque a vista',
  kv: [['pv/sobremesas/kv-1', 'Pudim Lovers · cartaz'], ['pv/sobremesas/kv-2', 'Pudim Lovers · Feliz Dia do Pudim']], kvTopo: true,
  vistas: [
    { nome: 'Em ângulo', antes: 'pv/sobremesas/a-antes', depois: 'pv/sobremesas/n-depois', ar: 0.75, cap: 'Vista em ângulo' },
  ],
  resumo: 'Hora da sobremesa no clima Pudim Lovers: testeira com LED, frame, lateral, réguas com o nome e rodapé.',
  mesa: [
    row(
      peca({ gal: G5, n: 3, nome: 'Lateral', qtd: '1 un.', mat: 'Adesivo em vinil, 85 x 210 cm', src: P2 + 'sobremesas/lateral-85x210cm', w: 40, h: 99 }),
      peca({ gal: G5, n: 2, nome: 'Frame', qtd: '1 un.', mat: 'Adesivo em vinil, 62,5 x 173 cm', src: P2 + 'sobremesas/frame-62-5x173cm', w: 36, h: 99 }),
      col(
        peca({ gal: G5, n: 1, nome: 'Testeira com LED', qtd: '1 un.', mat: 'PS com LED, 133 x 40 cm', src: P2 + 'sobremesas/testeira-133x40cm', w: 150, h: 27.2 }),
        pilha({ gal: G5, n: 4, nome: 'Réguas com o nome', qtd: '5 un.', mat: 'PS para frio, no trilho de preço', w: 130, h: 50, itens: [[P2 + 'sobremesas/regua-brigadeirao-41x4cm', 'Brigadeirão · 41 x 4 cm', 86, 8.4], [P2 + 'sobremesas/regua-pudim-41x4cm', 'Pudim · 41 x 4 cm', 86, 8.4], [P2 + 'sobremesas/regua-creamy-chantilly-41x4cm', 'Creamy Chantilly · 41 x 4 cm', 86, 8.4], [P2 + 'sobremesas/regua-creamy-62x4cm', 'Creamy · 62 x 4 cm', 130, 8.4], [P2 + 'sobremesas/regua-flan-62x4cm', 'Flan · 62 x 4 cm', 130, 8.4]] }),
        peca({ gal: G5, n: 5, nome: 'Rodapé', qtd: '1 un.', mat: 'Adesivo em vinil, 133 x 24 cm', src: P2 + 'sobremesas/rodape-133x24cm', w: 150, h: 27 }),
      ),
    ),
  ],
  como: [tile('retro', 'Testeira com LED', 'Peça 1'), tile('adesivo', 'Frame e lateral por fora', 'Peças 2 e 3'), tile('nome', 'Régua com o nome de cada sobremesa', 'Peça 4'), tile('adesivo', 'Rodapé na faixa frontal', 'Peça 5')],
  nota: 'A geladeira vira uma vitrine de confeitaria, na linguagem Pudim Lovers dos KVs enviados pelo cliente.',
});

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
const html = (topo + capa + '\n' + contexto + '\n' + nutricao3d + '\n' + nutricao + '\n' + seca3d + '\n' + seca + '\n' + pensezero3d + '\n' + pensezero + '\n' + president3d + '\n' + president + '\n' + sobremesas3d + '\n' + sobremesas + '\n' + fim + base.slice(MAIN1))
  .replace(/(["(])assets\//g, '$1../assets/');
if (/R\$/.test(html)) throw new Error('apareceu valor na apresentação');
mkdirSync(new URL('projeto-visual-v2/', root), { recursive: true });
writeFileSync(new URL('projeto-visual-v2/index.html', root), html);
console.log('projeto-visual-v2/index.html', Math.round(html.length / 1024) + ' KB');
