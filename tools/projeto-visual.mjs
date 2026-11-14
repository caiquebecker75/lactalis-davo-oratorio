// Monta o link "Projeto visual" (projeto-visual/index.html): só as telas do projeto, sem valores, depois da reunião de 05/11/2026.
// O cabeçalho, o rodapé, o índice e o motor vêm do index.html; as telas são escritas aqui, a partir dos dados abaixo.
// Uso: node tools/projeto-visual.mjs   (rode antes node tools/pv-assets.mjs)
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';

const root = new URL('..', import.meta.url);
const base = readFileSync(new URL('index.html', root), 'utf8');
const IMG = '../assets/img/pv/';
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
        </div>` : kvTopo ? `<div class="kv kv-topo${kv && kv.length > 2 ? ' kv3' : ''} rv" style="--d:2">
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

// ---------- os cinco espaços ----------
const G1 = 'nutricao';
const nutricao = espaco({
  id: 'nutricao', n: '01', short: 'Nutrição esportiva', marca: 'Parmalat Fit', titulo: 'Ilha de nutrição esportiva', cor: '#1E3E94', rotulo: 'A mesma ilha, de dois pontos · simulação com as fotos da loja', duas: true,
  kv: [['nutricao/kv-1', 'Linha Parmalat Fit · iogurtes'], ['nutricao/kv-2', 'Linha Parmalat Fit · Whey 15 g e Flexforce 23 g']],
  vistas: [
    { nome: 'Lado longo', antes: 'nutricao/n-longo-antes', depois: 'nutricao/n-longo-depois', ar: 1.7917, cap: 'Lado longo da ilha. Simulação feita com a foto da loja.' },
    { nome: 'Ponta', antes: 'nutricao/n-ponta-antes', depois: 'nutricao/n-ponta-depois', ar: 0.53, cap: 'Ponta da ilha, com a barra de peso na prateleira. Simulação feita com a foto da loja.' },
  ],
  resumo: 'Na linguagem da campanha Tem Fit com você: testeiras com a linha 15 g e 23 g, réguas por categoria e a barra de peso na ponta.',
  mesa: [
    peca({ gal: G1, n: 1, nome: 'Testeira central', qtd: '1 un.', mat: 'PS com recorte em onda', src: 'nutricao/p-1-testeira-central', w: 236, h: 45.3 }),
    row(
      fileira({ gal: G1, n: 2, nome: 'Testeiras perpendiculares', qtd: '2 un., esquerda e direita', mat: 'PS em L, em pé na prateleira', w: 117, h: 42, itens: [['nutricao/p-2-perpendicular-esq', 'Esquerda', 51.4, 42], ['nutricao/p-2-perpendicular-dir', 'Direita', 62.1, 42]] }),
      peca({ gal: G1, n: 3, nome: 'Barra de peso', qtd: '1 un.', mat: 'Peça especial em PS recortado, com a régua de 23 g na base', src: 'nutricao/p-3-barra-de-peso', w: 106, h: 42.3 }),
    ),
    row(
      pilha({ gal: G1, n: 4, nome: 'Réguas por produto', qtd: '4 un.', mat: 'PS impresso, no trilho de preço', w: 112, h: 40.4, itens: [['nutricao/p-4-regua-whey-em-po', 'Whey em pó', 112, 9.1], ['nutricao/p-4-regua-15g', '15 g Whey', 112, 9.1], ['nutricao/p-4-regua-23g', '23 g Flexforce', 112, 9.1], ['nutricao/p-4-regua-pronto-para-beber', 'Pronto para beber', 112, 9.1]] }),
      pilha({ gal: G1, n: 5, nome: 'Réguas por categoria', qtd: '3 un.', mat: 'PS impresso, no trilho de preço', w: 112, h: 30, itens: [['nutricao/p-5-regua-barras-proteicas', 'Barras proteicas', 112, 9.1], ['nutricao/p-5-regua-creatina', 'Creatina', 112, 9.1], ['nutricao/p-5-regua-whey-protein', 'Whey protein', 112, 9.1]] }),
    ),
  ],
  como: [tile('empe', 'Testeiras em pé, sobre a prateleira', 'Peças 1 e 2'), tile('trilho', 'Réguas no trilho de preço', 'Peças 4 e 5'), tile('presilha', 'Barra de peso presa na prateleira', 'Peça 3'), tile('caixas', 'A base continua para as caixas', 'Sem comunicação')],
  nota: 'As peças seguem o KV da campanha Tem Fit com você, enviado pelo cliente. A testeira em onda puxa a categoria no lado longo e na ponta. As réguas nomeiam o que está em cada prateleira. A barra de peso leva a marca para a altura dos olhos, na ponta. As caixas ficam embaixo porque o cliente leva a caixa dali.',
});

const G2 = 'seca';
const seca = espaco({
  id: 'seca', n: '02', short: 'Gôndola seca', marca: 'Parmalat Fit', titulo: 'Ponta de gôndola seca', cor: '#1E3E94', rotulo: 'Troque a vista',
  vistas: [
    { nome: 'Frontal', antes: 'seca/n-antes', depois: 'seca/n-depois', ar: 0.5675, cap: 'Vista frontal. Simulação feita com a foto da loja.' },
  ],
  resumo: 'Mais que proteína para a sua rotina: testeira ondulada iluminada, moldura de luz no whey, réguas por benefício e stoppers do Flexforce.',
  mesa: [
    peca({ gal: G2, n: 1, nome: 'Testeira superior ondulada iluminada', qtd: '1 un.', mat: 'PS com recorte ondulado e iluminação', src: 'seca/p-1-testeira', w: 190, h: 40.3 }),
    row(
      peca({ gal: G2, n: 2, nome: 'Moldura luminosa para whey em pó', qtd: '1 un.', mat: 'Moldura com LED em volta das duas prateleiras do whey', src: 'seca/p-2-moldura', w: 120, h: 41.4 }),
      fileira({ gal: G2, n: 8, nome: 'Stoppers giratórios', qtd: '2 un.', mat: 'Stopper giratório preso na prateleira, com a embalagem Flexforce, sabores morango e chocolate', w: 28.5, h: 26.8, itens: [['seca/p-8-stopper-morango', 'Morango', 13, 26.8], ['seca/p-8-stopper-chocolate', 'Chocolate', 13.5, 26.8]] }),
    ),
    pilha({ gal: G2, n: '3 a 7', nome: 'Réguas de gôndola', qtd: '7 un.: 4 com frase e 3 complementares', mat: 'PS impresso, no trilho de preço', w: 150, h: 67.2, itens: [['seca/p-3-regua-energia', 'Energia para o seu dia', 150, 13.4], ['seca/p-4-regua-23g', '23 g de proteína', 150, 13.2], ['seca/p-5-regua-proteina', 'Proteína líquida', 150, 12.2], ['seca/p-6-regua-nutricao', 'Nutrição em qualquer rotina', 150, 12.6], ['seca/p-7-regua-complementar', 'Régua complementar', 150, 10.2]] }),
  ],
  como: [tile('retro', 'Testeira iluminada no topo', 'Peça 1'), tile('perfil', 'Moldura de LED em volta do whey', 'Peça 2'), tile('trilho', 'Réguas no trilho de preço', 'Peças 3 a 7'), tile('presilha', 'Stoppers presos na prateleira', 'Peça 8')],
  nota: 'A testeira, a moldura e as réguas falam de proteína para cada momento do dia. Os stoppers giratórios destacam o Flexforce 23 g, o novo da linha. As réguas complementares, só com grafismos, ficam nas prateleiras sem frase.',
});

const G3 = 'pz';
const pensezero = espaco({
  id: 'pensezero', n: '03', short: 'Pense Zero', marca: 'Batavo Pense Zero', titulo: 'Ponta refrigerada', cor: '#0B7FB4', rotulo: 'Troque a vista',
  kv: [['pensezero/kv-1', 'Pense Zero · Se parar pra pensar, pense zero'], ['pensezero/kv-2', 'Pense Zero · versão para celular']], kvTopo: true,
  vistas: [
    { nome: 'Frontal', antes: 'pensezero/n-antes', depois: 'pensezero/n-depois', ar: 1.7778, cap: 'Vista frontal' },
  ],
  resumo: 'Na linguagem da campanha Se parar pra pensar, pense zero: painel de topo com luz, as duas laterais, faixas por ocasião e rodapé.',
  mesa: [
    peca({ gal: G3, n: 1, nome: 'Painel de topo (backlight)', qtd: '1 un.', mat: 'Caixa de luz com face impressa, recorte em onda', src: 'pensezero/p-1-painel-topo', w: 230, h: 28.1 }),
    row(
      peca({ gal: G3, n: 2, nome: 'Lateral esquerda', qtd: '1 un.', mat: 'Adesivo em vinil, na coluna esquerda', src: 'pensezero/p-2-lateral-esq', w: 19.5, h: 84 }),
      peca({ gal: G3, n: 3, nome: 'Lateral direita', qtd: '1 un.', mat: 'Adesivo em vinil, na coluna direita', src: 'pensezero/p-3-lateral-dir', w: 22.5, h: 84 }),
      pilha({ gal: G3, n: 4, nome: 'Faixas de prateleira', qtd: '7 un., 5 longas e 2 curtas', mat: 'PS ou PETG para frio, no trilho de preço', w: 140, h: 92.8, itens: [['pensezero/p-4-faixa-cafe', 'Pro café da manhã', 140, 13.4], ['pensezero/p-4-faixa-compartilhar', 'Pra compartilhar', 140, 12.6], ['pensezero/p-4-faixa-tarde', 'Pro lanche da tarde', 140, 12.1], ['pensezero/p-4-faixa-levar', 'Pra levar', 140, 10.9], ['pensezero/p-4-faixa-rapido', 'No seu lanche rápido', 140, 10.9], ['pensezero/p-4-faixa-colher', 'De colher', 68, 12.3], ['pensezero/p-4-faixa-sobremesa', 'De sobremesa', 68, 12.2]] }),
    ),
    peca({ gal: G3, n: 5, nome: 'Rodapé frontal', qtd: '1 un.', mat: 'Adesivo em vinil, por cima do amarelo da base', src: 'pensezero/p-5-rodape', w: 230, h: 21.8 }),
  ],
  como: [tile('retro', 'Painel de topo com luz', 'Peça 1'), tile('adesivo', 'Adesivo nas duas laterais', 'Peças 2 e 3'), tile('trilho', 'Faixas no trilho de preço', 'Peça 4'), tile('adesivo', 'Rodapé por cima do amarelo', 'Peça 5')],
  nota: 'As peças seguem o KV Se parar pra pensar, pense zero, enviado pelo cliente. O painel de topo tem luz; as laterais, as faixas e o rodapé são aplicados sobre o móvel atual. Medidas se confirmam na medição.',
});

const G4 = 'president';
const president = espaco({
  id: 'president', n: '04', short: 'Président', marca: 'Président', titulo: 'Gôndola fria de queijos', cor: '#BE0F2D', rotulo: 'Troque a vista',
  kv: [['president/kv-1', 'Encarte Président · Mambo'], ['president/kv-2', 'Encarte Président · Condor'], ['president/kv-3', 'Encarte Président · Condor, fechado']], kvTopo: true, lay: 'lado',
  vistas: [
    { nome: 'Frente', ta: 'Planograma', antes: 'president/p13-antes', depois: 'president/p13-depois', ar: 1.3173, cap: 'Simulação feita sobre a imagem do planograma enviada pelo cliente.' },
  ],
  resumo: 'A estrela da loja: testeira iluminada, a torre Eiffel por dentro, o queijo por fora, stopper na divisa e réguas com a marca.',
  mesa: [
    row(
      peca({ gal: G4, n: 2, nome: 'Adesivo lateral externo', qtd: '1 un.', mat: 'Adesivo em vinil, na lateral de fora', src: 'president/p13-2-adesivo-externo', w: 49.9, h: 150 }),
      peca({ gal: G4, n: 3, nome: 'Adesivo lateral interno', qtd: '1 un.', mat: 'Vinil vermelho com a torre em dourado, na lateral de dentro', src: 'president/p13-3-adesivo-interno', w: 26.7, h: 142 }),
      peca({ gal: G4, n: 4, nome: 'Stopper vertical', qtd: '1 un.', mat: 'PS recortado, na divisa entre o Président e a Sadia', src: 'president/p13-4-stopper-vertical', w: 22.4, h: 124 }),
      col(
        peca({ gal: G4, n: 1, nome: 'Testeira superior', qtd: '1 un.', mat: 'Caixa de luz com face impressa e moldura dourada', src: 'president/p13-1-testeira', w: 150, h: 45.7 }),
        peca({ gal: G4, n: 5, nome: 'Réguas de gôndola', qtd: '4 un., uma por prateleira', mat: 'PS para frio, no trilho de preço', src: 'president/p13-5-regua', w: 128, h: 7.6 }),
        peca({ gal: G4, n: 6, nome: 'Faixa de base', qtd: '1 un.', mat: 'Adesivo em vinil vermelho com filete dourado', src: 'president/p13-6-faixa-base', w: 150, h: 12.3 }),
      ),
    ),
  ],
  como: [tile('retro', 'Testeira iluminada no topo', 'Peça 1'), tile('adesivo', 'Adesivo nas duas laterais', 'Peças 2 e 3'), tile('presilha', 'Stopper na divisa com a Sadia', 'Peça 4'), tile('trilho', 'Réguas no trilho e faixa na base', 'Peças 5 e 6')],
  nota: 'É a estrela da vez. A simulação foi feita sobre a imagem do planograma que o cliente enviou, por isso a comparação é com o planograma e não com a loja de hoje. Os KVs ao lado são os encartes de referência do cliente.',
});

const G5 = 'sob';
const sobremesas = espaco({
  id: 'sobremesas', n: '05', short: 'Sobremesas', marca: 'Sobremesas Batavo', titulo: 'Ponto de sobremesas', cor: '#4E2C1B', rotulo: 'Troque a vista',
  kv: [['sobremesas/kv-1', 'Pudim Lovers · cartaz'], ['sobremesas/kv-2', 'Pudim Lovers · Feliz Dia do Pudim']], kvTopo: true,
  vistas: [
    { nome: 'Em ângulo', antes: 'sobremesas/a-antes', depois: 'sobremesas/n-depois', ar: 0.75, cap: 'Vista em ângulo' },
  ],
  resumo: 'Hora da sobremesa no clima Pudim Lovers: testeira em onda com luz, toldo, réguas por produto, artes nas laterais e faixa frontal.',
  mesa: [
    row(
      peca({ gal: G5, n: 5, nome: 'Arte lateral esquerda', qtd: '1 un.', mat: 'Adesivo em vinil, inteiro, por fora do frio', src: 'sobremesas/p-5-lateral-esq', w: 22.7, h: 78 }),
      col(
        peca({ gal: G5, n: 1, nome: 'Testeira em PS com LED', qtd: '1 un.', mat: 'PS com faca especial ondulada e LED superior e inferior', src: 'sobremesas/p-1-testeira', w: 130, h: 38.3 }),
        peca({ gal: G5, n: 2, nome: 'Toldo eletrostático', qtd: '2 un., um por porta', mat: 'Vinil eletrostático plano', src: 'sobremesas/p-2-toldo', w: 130, h: 7.6 }),
        pilha({ gal: G5, n: 3, nome: 'Réguas com o nome', qtd: '5 un.', mat: 'PS para frio, com logo e espaço de preço; nomes conforme o planograma', w: 130, h: 28.5, itens: [['sobremesas/p-3-regua-superior-1', 'Superior 1 · brigadeirão, pudim e Creamy Chantilly', 130, 5.3], ['sobremesas/p-3-regua-superior-2', 'Superior 2 · brigadeirão, pudim e Creamy Chantilly', 130, 5], ['sobremesas/p-3-regua-flan', 'Inferior 1 · Flan', 130, 4.8], ['sobremesas/p-3-regua-creamy-1', 'Inferior 2 · Creamy', 130, 4.8], ['sobremesas/p-3-regua-creamy-2', 'Inferior 3 · Creamy', 130, 4.6]] }),
      ),
      peca({ gal: G5, n: 6, nome: 'Arte lateral direita', qtd: '1 un.', mat: 'Adesivo em vinil, inteiro, por fora do frio', src: 'sobremesas/p-6-lateral-dir', w: 22.9, h: 78 }),
    ),
    row(
      fileira({ gal: G5, n: 4, nome: 'Adesivo para base do vidro', qtd: '2 un., um por porta', mat: 'Vinil, na parte de baixo do vidro', w: 130, h: 7.2, itens: [['sobremesas/p-4-base-1', 'Porta 1', 63, 7.2], ['sobremesas/p-4-base-2', 'Porta 2', 63, 7.2]] }),
      peca({ gal: G5, n: 7, nome: 'Adesivo da faixa frontal inferior', qtd: '1 un.', mat: 'Vinil, complementar, na faixa preta abaixo das portas', src: 'sobremesas/p-7-faixa-frontal', w: 130, h: 7.7 }),
    ),
  ],
  como: [tile('retro', 'Testeira com LED em cima e embaixo', 'Peça 1'), tile('lambrequim', 'Toldo eletrostático, sem descer no vidro', 'Peça 2'), tile('nome', 'Régua com o nome de cada sobremesa', 'Peça 3'), tile('adesivo', 'Adesivos no vidro, na faixa frontal e nas laterais', 'Peças 4 a 7')],
  nota: 'A geladeira vira uma vitrine de confeitaria, na linguagem Pudim Lovers dos KVs enviados pelo cliente. As peças saíram da prancha de materiais. Medidas e nomes se confirmam na medição e no planograma.',
});

// ---------- capa, contexto e fechamento ----------
const janela = (id, rot, cor, src, pos, alt, d) => `<a href="#${id}" data-goto="${id}" class="rv" style="--d:${d};--bc:${cor}"><img src="${img(src)}" alt="${alt}" style="object-position:${pos}"><span>${rot}</span></a>`;
const capa = `  <!-- ================================================================ CAPA -->
  <section class="slide cover c2" id="capa" data-short="Capa" data-theme="capa" data-title="Capa">
    <div class="c2-txt">
      <div class="c2-main">
        <p class="eyebrow rv">Projeto visual · Novembro de 2026</p>
        <h1 class="rv" style="--d:1">Lactalis no <em>D'avó Oratório</em></h1>
        <p class="lead rv" style="--d:2">Cinco espaços, do antes ao depois, com os ajustes da nossa conversa.</p>
        <div class="start rv" style="--d:3">
          <button type="button" class="cta" data-goto="contexto">Começar<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13M13 6l6 6-6 6"/></svg></button>
          <span class="hint-d">ou use as setas <kbd>←</kbd> <kbd>→</kbd> do teclado</span>
          <span class="hint-m">Role a página para ver os cinco espaços</span>
        </div>
      </div>
      <p class="c2-by rv" style="--d:4"><small>Fale com</small><b>Vanessa Morelli</b><span>Diretora Comercial · 75LAB</span></p>
    </div>
    <div class="c2-art">
      ${janela('nutricao', 'Parmalat Fit', '#1E3E94', 'capa-fit', '100% 62%', 'Sabores e leite', 2)}
      ${janela('pensezero', 'Batavo Pense Zero', '#0B7FB4', 'capa-pensezero', '100% 50%', 'Frutas e iogurte', 3)}
      ${janela('president', 'Président', '#BE0F2D', 'capa-president', '100% 70%', 'Sanduíche de queijo', 4)}
      ${janela('sobremesas', 'Sobremesas Batavo', '#4E2C1B', 'capa-sobremesas', '100% 72%', 'Pudins e sobremesas', 5)}
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
        ${hoje('nutricao', '01', 'Ilha de nutrição', 'Parmalat Fit', 'nutricao/hoje', '50% 40%', 'Ilha de nutrição esportiva hoje', 4)}
        ${hoje('seca', '02', 'Gôndola seca', 'Parmalat Fit', 'seca/f-antes', '50% 50%', 'Gôndola seca hoje', 5)}
        ${hoje('pensezero', '03', 'Ponta refrigerada', 'Batavo Pense Zero', 'pensezero/f-antes', '50% 50%', 'Ponta refrigerada hoje', 6)}
        ${hoje('president', '04', 'Gôndola de queijos', 'Président', 'president/antes', '40% 62%', 'Gôndola de queijos hoje', 7)}
        ${hoje('sobremesas', '05', 'Ponto de sobremesas', 'Sobremesas Batavo', 'sobremesas/f-antes', '50% 48%', 'Ponto de sobremesas hoje', 8)}
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
const titulo = "Projeto visual · Lactalis no D'avó Oratório · 75LAB";
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
trocar('<link rel="stylesheet" href="assets/css/deck.css">', '<link rel="stylesheet" href="assets/css/deck.css">\n<link rel="stylesheet" href="projeto-visual.css">');
trocar('01 / 15', '01 / 08');
const html = (topo + capa + '\n' + contexto + '\n' + nutricao + '\n' + seca + '\n' + pensezero + '\n' + president + '\n' + sobremesas + '\n' + fim + base.slice(MAIN1))
  .replace(/(["(])assets\//g, '$1../assets/');
if (/R\$/.test(html)) throw new Error('apareceu valor na apresentação');
mkdirSync(new URL('projeto-visual/', root), { recursive: true });
writeFileSync(new URL('projeto-visual/index.html', root), html);
console.log('projeto-visual/index.html', Math.round(html.length / 1024) + ' KB');
