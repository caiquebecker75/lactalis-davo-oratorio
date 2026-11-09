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
function espaco({ id, n, short, marca, titulo, cor, rotulo, vistas, resumo, mesa, como, nota }) {
  const v0 = vistas[0];
  return `  <!-- ================================================================ ${n} ${titulo.toUpperCase()} -->
  <section class="slide sp" id="${id}" data-sp="${id}" data-short="${short}" data-theme="cream" data-title="${titulo}" style="--bc:${cor}">
    <div class="pad">
      <header class="sp-head">
        <div>
          <p class="brand rv"><b>${n}</b>${marca}</p>
          <h2 class="rv" style="--d:1">${titulo}</h2>
        </div>
        ${vistas.length > 1 ? `<div class="views rv" style="--d:2" role="group" aria-label="${rotulo}">
          <span class="vl">${rotulo}</span>
          ${vistas.map((v, i) => `<button type="button"${i ? '' : ' class="on"'} data-antes="${img(v.antes)}" data-depois="${img(v.depois)}" data-ar="${v.ar}" data-cap="${v.cap}">${v.nome}</button>`).join('\n          ')}
        </div>` : ''}
      </header>
      <div class="sp-body">
        <div class="cmp" data-ar="${v0.ar}">
          <img class="ia" src="${img(v0.antes)}" alt="${titulo} antes" draggable="false">
          <img class="id" src="${img(v0.depois)}" alt="${titulo} depois" draggable="false">
          <span class="tg ta">Antes</span><span class="tg td">Depois</span>
          <div class="handle" tabindex="0" role="slider" aria-label="Arraste para comparar o antes e o depois" aria-valuemin="0" aria-valuemax="100" aria-valuenow="50"><i></i></div>
          <span class="hint">Arraste para comparar</span>
          <button type="button" class="cz" aria-label="Ampliar as fotos"></button>
        </div>
        <div class="side">
          <div class="kit rv" style="--d:3">
            <p class="lbl">As peças</p>
            <p class="sum">${resumo}</p>
          </div>
          <div class="mesa rv" style="--d:3">
            <div class="mi">
            ${mesa.join('\n            ')}
            </div>
          </div>
          <div class="how rv" style="--d:4">
            <p class="lbl">Como aplica</p>
            <div class="hw${como.length > 3 ? ' q4' : ''}">
              ${como.join('\n              ')}
            </div>
          </div>
        </div>
      </div>
    </div>
    <aside class="notes" hidden><p>${nota}</p></aside>
  </section>
`;
}

// ---------- os cinco espaços ----------
const G1 = 'nutricao';
const nutricao = espaco({
  id: 'nutricao', n: '01', short: 'Nutrição esportiva', marca: 'Parmalat Fit', titulo: 'Ilha de nutrição esportiva', cor: '#1E3E94', rotulo: 'A mesma ilha, de dois pontos · simulação com as fotos da loja',
  vistas: [
    { nome: 'Lado A em destaque', antes: 'nutricao/v1-antes', depois: 'nutricao/v1-depois', ar: 1.4545, cap: 'Os lados A e B, com o lado A em destaque. Simulação feita com as fotos da loja.' },
    { nome: 'Lado B em destaque', antes: 'nutricao/v2-antes', depois: 'nutricao/v2-depois', ar: 1.4545, cap: 'Os lados A e B, com o lado B em destaque. Simulação feita com as fotos da loja.' },
  ],
  resumo: 'A ilha inteira ambientada, com ponta e o destaque 23 g × 15 g.',
  mesa: [
    peca({ gal: G1, n: 3, nome: 'Testeira da ilha', qtd: '1 un., em 2 módulos', mat: 'Placas de PS em L, dupla face, recorte especial', src: 'nutricao/03-testeira-ilha-face-A', w: 236, h: 62 }),
    row(
      peca({ gal: G1, n: 4, nome: 'Ponta · Whey em pó', qtd: '1 un.', mat: 'Placas de PS em L, virada para a frente; forma um T com a testeira', src: 'nutricao/04-ponta-cabeceira', w: 78, h: 62.4 }),
      col(
        pilha({ gal: G1, n: 1, nome: 'Régua · lado longo', qtd: '6 un.', mat: 'PS impresso', w: 130, h: 14, itens: [['nutricao/01-regua-a1-whey-em-po', 'Whey em pó', 130, 4], ['nutricao/01-regua-a2-whey-15g', '15 g pronto para beber', 130, 4], ['nutricao/01-regua-a3-para-levar', 'Para levar', 130, 4]] }),
        pilha({ gal: G1, n: 5, nome: 'Faixa azul por categoria', qtd: '6 un.', mat: 'PS impresso, só com a categoria', w: 130, h: 14, itens: [['nutricao/05-faixa-1-barra-proteica', 'Barra proteica', 130, 4], ['nutricao/05-faixa-2-creatina', 'Creatina', 130, 4], ['nutricao/05-faixa-3-whey-protein', 'Whey protein', 130, 4]] }),
      ),
      pilha({ gal: G1, n: 2, nome: 'Régua · ponta', qtd: '3 un.', mat: 'PS impresso', w: 90, h: 14, itens: [['nutricao/02-regua-b1-whey-em-po', 'Whey em pó', 90, 4], ['nutricao/02-regua-b2-pronto-para-beber', '23 g e 15 g', 90, 4], ['nutricao/02-regua-b3-pronto-para-beber', '23 g', 90, 4]] }),
    ),
  ],
  como: [tile('trilho', 'Encaixa no trilho de preço', 'Peças 1, 2 e 5'), tile('empe', 'Fica em pé sozinha', 'Peças 3 e 4'), tile('caixas', 'A base continua para as caixas', 'Sem comunicação')],
  nota: 'A ilha inteira puxa a categoria nas cores da marca, inclusive no trecho das outras marcas. A ponta é a peça virada para a frente. As caixas ficam embaixo porque o cliente leva a caixa dali.',
});

const G2 = 'seca';
const seca = espaco({
  id: 'seca', n: '02', short: 'Gôndola seca', marca: 'Parmalat Fit', titulo: 'Ponta de gôndola seca', cor: '#1E3E94', rotulo: 'Troque a vista',
  vistas: [
    { nome: 'Frontal', antes: 'seca/n-antes', depois: 'seca/n-depois', ar: 0.5675, cap: 'Vista frontal' },
  ],
  resumo: 'A arte aprovada, agora com luz e o display do Flexforce na prateleira.',
  mesa: [
    peca({ gal: G2, n: 1, nome: 'Testeira em caixa retroiluminada', qtd: '1 un.', mat: 'Caixa com face em acrílico e fita de LED', src: 'seca/caixa-com-testeira', w: 190, h: 96 }),
    row(
      peca({ gal: G2, n: 2, nome: 'Moldura do Whey', qtd: '1 un.', mat: 'PS recortado e fita de LED', src: 'seca/seca-2-moldura-whey', w: 96, h: 56 }),
      peca({ gal: G2, n: 4, nome: 'Display Flexforce', qtd: '2 un.', mat: 'Flag em PS presa na prateleira, com a embalagem do produto', src: 'seca/flexforce-display', w: 17, h: 35 }),
    ),
    pilha({ gal: G2, n: 3, nome: 'Réguas com selo 23 g ou 15 g', qtd: '6 un.', mat: 'PS impresso, com fita de LED na borda', w: 181, h: 36, itens: [['seca/seca-r1', 'Whey 21 g', 118, 5], ['seca/seca-r3', '23 g Flexforce', 181, 5.2], ['seca/seca-r4', '15 g Whey', 165, 5.2], ['seca/seca-r5', '15 g Whey', 165, 5.2], ['seca/seca-r6', '15 g Whey', 165, 5.2]] }),
  ],
  como: [tile('retro', 'Caixa de luz atrás da testeira', 'Peça 1'), tile('perfil', 'Fita de LED ilumina o produto', 'Peças 2 e 3'), tile('trilho', 'Réguas no trilho e o display do Flexforce', 'Peças 3 e 4')],
  nota: 'O projeto aprovado continua igual. Entram a luz e o display do Flexforce, o novo de 23 g de proteína, preso na prateleira.',
});

const G3 = 'pz';
const pensezero = espaco({
  id: 'pensezero', n: '03', short: 'Pense Zero', marca: 'Batavo Pense Zero', titulo: 'Ponta refrigerada', cor: '#0B7FB4', rotulo: 'Troque a vista',
  vistas: [
    { nome: 'Frontal', antes: 'pensezero/n-antes', depois: 'pensezero/n-depois', ar: 1.7778, cap: 'Vista frontal' },
    { nome: 'Em ângulo', antes: 'pensezero/a-antes', depois: 'pensezero/a-depois', ar: 0.75, cap: 'Vista em ângulo, com o lado de fora do vidro' },
  ],
  resumo: 'Testeira 20 cm mais alta e com luz, adesivos dos dois lados e o amarelo coberto.',
  mesa: [
    pilha({ gal: G3, n: 1, nome: 'Testeira em caixa de luz', qtd: '1 un., com a volta lateral', mat: 'Caixa com face em acrílico e fita de LED', w: 220, h: 90, itens: [['pensezero/pz-1-testeira', 'Testeira, frente', 220, 44], ['pensezero/pz-1-testeira-lateral', 'Testeira, volta lateral', 130, 44]] }),
    peca({ gal: G3, n: 3, nome: 'Adesivo no lugar do amarelo', qtd: '1 kit', mat: 'Vinil laminado, só com a marca', src: 'pensezero/pz-4-base', w: 220, h: 10.8 }),
    row(
      fileira({ gal: G3, n: 2, nome: 'Adesivos dos vidros', qtd: '4 un., por dentro e por fora', mat: 'Vinil eletrostático', w: 106, h: 84, itens: [['pensezero/pz-5-vidro-heroi', 'O produto', 51.7, 84], ['pensezero/pz-5-vidro-beneficios', 'Os benefícios', 51.7, 84]] }),
      pilha({ gal: G3, n: 4, nome: 'Réguas por ocasião', qtd: '8 un.', mat: 'PS ou PETG para frio', w: 108, h: 26, itens: [['pensezero/pz-3-r1-esq', 'Pra compartilhar', 108, 4.75], ['pensezero/pz-3-r2-esq', 'Pro café da manhã', 108, 4.75], ['pensezero/pz-3-r3-esq', 'Pro lanche da tarde', 108, 4.75], ['pensezero/pz-3-r4-esq', 'Pro lanche rápido', 108, 4.75]] }),
    ),
  ],
  como: [tile('retro', 'Caixa de luz sobre a sanefa', 'Peça 1'), tile('estatico', 'Vinil no vidro, dos dois lados', 'Peça 2'), tile('adesivo', 'Adesivo por cima do amarelo', 'Peça 3'), tile('trilho', 'Encaixa no trilho de preço', 'Peça 4')],
  nota: 'A testeira sobe uns 20 cm, com luz. Os adesivos seguem a arte aprovada: um lado com o produto e o outro com os benefícios, por dentro e por fora. O amarelo da base recebe um adesivo.',
});

const G4 = 'president';
const president = espaco({
  id: 'president', n: '04', short: 'Président', marca: 'Président', titulo: 'Gôndola fria de queijos', cor: '#BE0F2D', rotulo: 'Compare as versões',
  vistas: [
    { nome: 'Letras retroiluminadas', antes: 'president/antes', depois: 'president/n-letras', ar: 0.75, cap: 'Testeira com letras retroiluminadas e bandejas com a marca' },
    { nome: 'Caixa de luz', antes: 'president/antes', depois: 'president/n-caixa', ar: 0.75, cap: 'Testeira em caixa de luz e réguas com o selo' },
  ],
  resumo: 'A estrela da loja: testeira nova em duas versões, a torre Eiffel por fora e por dentro e madeira clara com LED na base.',
  mesa: [
    row(
      peca({ gal: G4, n: 2, nome: 'Painel de fora', qtd: '1 un.', mat: 'Adesivo impresso, com a torre e os queijos', src: 'president/n-2-painel-fora', w: 15.5, h: 60.5 }),
      peca({ gal: G4, n: 3, nome: 'Adesivo de dentro', qtd: '1 un.', mat: 'Vinil vermelho com a torre em dourado', src: 'president/n-3-adesivo-dentro', w: 6.4, h: 61.2 }),
      col(
        pilha({ gal: G4, n: 1, nome: 'Testeira nova · duas versões', qtd: '1 un.', mat: 'Letras douradas retroiluminadas ou caixa de luz com moldura dourada', w: 58, h: 31.6, itens: [['president/n-1-testeira-letras', 'Letras retroiluminadas', 51, 14.6], ['president/n-1-testeira-caixa', 'Caixa de luz', 58, 15.6]] }),
        row(
          peca({ gal: G4, n: 4, nome: 'Bandeja com a marca', qtd: '14 un., na versão de letras', mat: 'Bandeja vermelha com a frente Président', src: 'president/n-4-bandeja', w: 18.2, h: 10.6 }),
          peca({ gal: G4, n: 5, nome: 'Régua com o selo', qtd: '4 un., na versão caixa de luz', mat: 'PS para frio, no trilho de preço', src: 'president/n-5-regua', w: 46.5, h: 2 }),
        ),
        peca({ gal: G4, n: 6, nome: 'Base em madeira clara com LED', qtd: '1 un.', mat: 'Madeirado claro e fita de LED quente', src: 'president/n-6-base-madeira', w: 57, h: 4.8 }),
      ),
    ),
  ],
  como: [tile('retro', 'Testeira no lugar da atual', 'Peça 1'), tile('adesivo', 'Adesivo por fora e por dentro', 'Peças 2 e 3'), tile('trilho', 'Régua no trilho ou bandeja com a marca', 'Peças 4 e 5'), tile('ripado', 'Madeira clara com LED na base', 'Peça 6')],
  nota: 'É a estrela da vez. Os botões comparam as duas versões: letras douradas retroiluminadas com bandejas, ou caixa de luz com réguas. O painel de fora, o adesivo de dentro e a base de madeira são os mesmos nas duas. Nada avança além do espaço do Président.',
});

const G5 = 'sob';
const sobremesas = espaco({
  id: 'sobremesas', n: '05', short: 'Sobremesas', marca: 'Sobremesas Batavo', titulo: 'Ponto de sobremesas', cor: '#4E2C1B', rotulo: 'Troque a vista',
  vistas: [
    { nome: 'Em ângulo', antes: 'sobremesas/a-antes', depois: 'sobremesas/n-depois', ar: 0.75, cap: 'Vista em ângulo' },
  ],
  resumo: 'A geladeira vira uma vitrine de confeitaria: frontão em onda com luz, lambrequim e a linha toda nas réguas.',
  mesa: [
    row(
      peca({ gal: G5, n: 3, nome: 'Lateral', qtd: '1 un.', mat: 'Adesivo em vinil, no lado do corredor, por fora do frio', src: 'sobremesas/n-3-lateral', w: 26, h: 76 }),
      col(
        peca({ gal: G5, n: 1, nome: 'Frontão em caixa de luz, recorte em onda', qtd: '1 un.', mat: 'Caixa com face em acrílico e LED no contorno', src: 'sobremesas/n-1-frontao', w: 130, h: 45.5 }),
        peca({ gal: G5, n: 2, nome: 'Lambrequim', qtd: '1 un.', mat: 'PS recortado, creme e chocolate', src: 'sobremesas/n-2-lambrequim', w: 130, h: 16 }),
        row(
          peca({ gal: G5, n: 4, nome: 'Adesivo da base em onda', qtd: '2 un., uma por porta', mat: 'Vinil, na parte de baixo do vidro', src: 'sobremesas/n-4-base', w: 64, h: 20 }),
          pilha({ gal: G5, n: 5, nome: 'Réguas com o nome', qtd: '8 un.', mat: 'PS para frio; nomes conforme o planograma', w: 64, h: 22, itens: [['sobremesas/n-5-regua-brigadeirao', 'Brigadeirão', 64, 7.2], ['sobremesas/n-5-regua-flan', 'Flan', 64, 7], ['sobremesas/n-5-regua-creamy', 'Creamy', 64, 5]] }),
        ),
      ),
    ),
  ],
  como: [tile('retro', 'Frontão em caixa de luz, com LED no contorno', 'Peça 1'), tile('lambrequim', 'Lambrequim curto, sem descer no vidro', 'Peça 2'), tile('adesivo', 'Adesivo na lateral e na base do vidro', 'Peças 3 e 4'), tile('nome', 'Régua com o nome de cada sobremesa', 'Peça 5')],
  nota: 'A geladeira indicada no ponto de sobremesas vira uma vitrine de confeitaria. As peças saíram da imagem nova e foram endireitadas; o lambrequim foi redesenhado nas mesmas cores. Medidas e nomes se confirmam na medição e no planograma.',
});

// ---------- capa, contexto e fechamento ----------
const janela = (id, n, rot, src, pos, alt, d) => `<a href="#${id}" data-goto="${id}" class="rv" style="--d:${d}"><span>${rot}</span><img src="${img(src)}" alt="${alt}" style="object-position:${pos}"></a>`;
const capa = `  <!-- ================================================================ CAPA -->
  <section class="slide cover" id="capa" data-short="Capa" data-theme="red" data-title="Capa">
    <div class="wall">
      <div class="sign rv">
        <p class="eyebrow">Projeto visual · Novembro de 2026</p>
        <h1>Lactalis no D'avó Oratório</h1>
        <p class="lead">Cinco espaços, do antes ao depois, com os ajustes da nossa conversa.</p>
        <div class="start">
          <button type="button" class="cta" data-goto="contexto">Começar<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13M13 6l6 6-6 6"/></svg></button>
          <span class="hint-d">ou use as setas <kbd>←</kbd> <kbd>→</kbd> do teclado</span>
          <span class="hint-m">Role a página para ver os cinco espaços</span>
        </div>
      </div>
      <p class="by rv" style="--d:2">Fale com<b>Vanessa Morelli</b>Diretora Comercial · 75LAB</p>
    </div>
    <div class="awning" aria-hidden="true"></div>
    <div class="vitrine">
      ${janela('nutricao', 1, 'Parmalat Fit', 'capa-fit', '100% 62%', 'Sabores e leite', 3)}
      ${janela('pensezero', 3, 'Batavo Pense Zero', 'capa-pensezero', '100% 50%', 'Frutas e iogurte', 4)}
      ${janela('president', 4, 'Président', 'capa-president', '100% 58%', 'Sanduíche de queijo', 5)}
      ${janela('sobremesas', 5, 'Sobremesas Batavo', 'capa-sobremesas', '70% 60%', 'Pudins e sobremesas', 6)}
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
trocar('<link rel="stylesheet" href="assets/css/deck.css">', '<link rel="stylesheet" href="assets/css/deck.css">\n<link rel="stylesheet" href="projeto-visual.css">');
trocar('01 / 15', '01 / 08');
const html = (topo + capa + '\n' + contexto + '\n' + nutricao + '\n' + seca + '\n' + pensezero + '\n' + president + '\n' + sobremesas + '\n' + fim + base.slice(MAIN1))
  .replace(/(["(])assets\//g, '$1../assets/');
if (/R\$/.test(html)) throw new Error('apareceu valor na apresentação');
mkdirSync(new URL('projeto-visual/', root), { recursive: true });
writeFileSync(new URL('projeto-visual/index.html', root), html);
console.log('projeto-visual/index.html', Math.round(html.length / 1024) + ' KB');
