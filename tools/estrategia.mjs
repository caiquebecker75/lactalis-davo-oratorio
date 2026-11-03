// Monta a versão com o planejamento (estrategia/index.html):
// as telas de planejamento vêm de tools/estrategia.html, e os seis espaços,
// o investimento e o resumo com o contato são copiados do index.html,
// para as duas apresentações mostrarem sempre as mesmas peças e os mesmos valores.
// Uso: node tools/estrategia.mjs
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { UP } from './upgrade-dados.mjs';

const root = new URL('..', import.meta.url);
const base = readFileSync(new URL('index.html', root), 'utf8');
let out = readFileSync(new URL('tools/estrategia.html', root), 'utf8');

// a tela com o comentário que vem antes dela
const tela = id => {
  const m = base.match(new RegExp(`  <!-- =+ [^\\n]*-->\\n  <section class="slide[^"]*" id="${id}"[\\s\\S]*?\\n  </section>\\n`));
  if (!m) throw new Error('não achei a tela ' + id);
  return m[0].replace(/(["(])assets\//g, '$1../assets/');
};
const troca = (s, a, b, id) => { const r = s.replace(a, b); if (r === s) throw new Error(`não achei ${a} em ${id}`); return r; };

// o momento do dia de cada espaço e a frase da arte
const DIA = {
  whey: ['Rotina ativa', 'Qual é o seu momento Fit?'],
  nutricao: ['Rotina ativa', 'Mais que proteína para a sua rotina'],
  seca: ['Rotina ativa', 'Whey 21 g de proteína'],
  pensezero: ['Leveza', 'Seu dia com mais sabor'],
  president: ['Refeição', 'O queijo certo para cada momento'],
  sobremesas: ['Prazer', 'Hora da sobremesa'],
};
const espacos = Object.entries(DIA).map(([id, [mo, frase]]) => {
  let s = tela(id).replace(/<!-- (=+) \d+ /, '<!-- $1 ESPAÇO · ');
  s = troca(s, /(<p class="brand rv"><b>\d+<\/b>[^<]*)<\/p>/, `$1<span class="mo">${mo}</span></p>`, id);
  s = troca(s, /(<h2 class="rv" style="--d:1">[^<]*<\/h2>)/, `$1\n          <p class="msg rv" style="--d:2">“${frase}”</p>`, id);
  return s;
}).join('\n');

out = troca(out, '<!-- @espacos -->\n', espacos, 'modelo');
out = troca(out, '<!-- @investimento -->\n', tela('investimento'), 'modelo');

// opção upgrade: uma tela por espaço, no formato das telas de espaço
const peca = (e, p) => `<figure class="pc" style="--w:${p.w};--h:${p.h};--s:${p.s || 1}"><button type="button" class="pz" data-zoom="../assets/img/upgrade/${e.id}-p${p.n}.webp" data-gallery="up-${e.id}" data-caption="${p.n} · ${p.nome} · ${p.qtd}|${p.mat}"><img src="../assets/img/upgrade/${e.id}-p${p.n}.webp" alt="${p.nome}"></button><figcaption><b>${p.n}</b><span>${p.nome}</span><em>${p.qtd}</em><small>${p.mat}</small></figcaption></figure>`;
const upgrade = UP.map(e => `  <!-- ================================================================ UPGRADE · ${e.nome.toUpperCase()} -->
  <section class="slide sp up" id="up-${e.id}" data-short="Upgrade · ${e.nome}" data-theme="cream" data-title="Upgrade · ${e.nome}" style="--bc:${e.bc}">
    <div class="pad">
      <header class="sp-head">
        <div>
          <p class="brand rv"><b>${e.n}</b>${e.marca}<span class="mo">${e.espaco}</span></p>
          <h2 class="rv" style="--d:1">${e.nome}</h2>
          <p class="msg rv" style="--d:2">Opção upgrade</p>
        </div>
        <div class="val rv" style="--d:2"><small>A validar</small><b>${e.valida}</b><span>Mais 1 conjunto de fonte e cabos. Quantidades estimadas; fecham na medição da loja.</span></div>
      </header>
      <div class="sp-body">
        <div class="cmp" data-ar="${e.ar}"${e.ar > 1.5 ? ' data-lay="sob"' : ''}>
          <img class="ia" src="../assets/img/${e.antes}.webp" alt="${e.espaco} hoje" draggable="false">
          <img class="id" src="../assets/img/upgrade/${e.id}-depois.webp" alt="${e.espaco} na opção upgrade" draggable="false">
          <span class="tg ta">Hoje</span><span class="tg td">Upgrade</span>
          <div class="handle" tabindex="0" role="slider" aria-label="Arraste para comparar hoje e o upgrade" aria-valuemin="0" aria-valuemax="100" aria-valuenow="50"><i></i></div>
          <span class="hint">Arraste para comparar</span>
          <button type="button" class="cz" aria-label="Ampliar as fotos"></button>
        </div>
        <div class="side">
          <div class="kit rv" style="--d:3">
            <p class="lbl">Os materiais</p>
            <p class="sum">${e.sum}</p>
          </div>
          <div class="mesa rv" style="--d:3">
            <div class="mi" style="--cols:${e.cols}">
${e.linhas.flat().map(p => '              ' + peca(e, p)).join('\n')}
            </div>
          </div>
          <div class="how rv" style="--d:4">
            <p class="lbl">Como funciona</p>
            <div class="hw">
${e.como.map(c => `              <div class="mc"><i class="pg" data-pg="${c.pg}"></i><h3>${c.t}</h3><span class="pn">${c.pn}</span></div>`).join('\n')}
            </div>
          </div>
        </div>
      </div>
    </div>
    <aside class="notes" hidden><p>${e.nota}</p></aside>
  </section>
`).join('\n');
out = troca(out, '<!-- @upgrade -->\n', upgrade, 'modelo');
out = troca(out, '<!-- @contato -->\n', tela('contato').replace('data-short="Contato"', 'data-short="Resumo e contato"').replace('data-title="Contato"', 'data-title="Resumo e contato"').replace('inclui os adesivos externos opcionais.</p>', 'inclui os adesivos externos opcionais. A opção upgrade ainda não está orçada.</p>'), 'modelo');
// desenho de gôndola em traço fino: fundo discreto de algumas telas
const gondola = () => {
  const larg = [[30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30], [58, 58, 58, 58, 58, 58], [38, 38, 38, 38, 38, 38, 38, 38, 38], [76, 76, 76, 76, 76], [44, 44, 44, 44, 44, 44, 44, 44]];
  const alt = [64, 54, 70, 46, 60];
  let s = '<rect x="6" y="6" width="408" height="588"/><rect x="6" y="6" width="408" height="58"/>';
  larg.forEach((linha, i) => {
    const base = 150 + i * 104;
    let x = 22;
    linha.forEach(w => { s += `<rect x="${x}" y="${base - alt[i]}" width="${w - 6}" height="${alt[i]}" rx="3"/>`; x += w; });
    s += `<path d="M6 ${base}h408M6 ${base + 14}h408"/><rect x="${60 + i * 62}" y="${base + 2}" width="26" height="10"/>`;
  });
  return `<symbol id="gd" viewBox="0 0 420 600" preserveAspectRatio="xMidYMax slice">${s}</symbol>`;
};
out = troca(out, '<!-- @gondola -->', gondola(), 'modelo');
if (/<!-- @|\{\{/.test(out)) throw new Error('marcador sem uso no modelo');

mkdirSync(new URL('estrategia/', root), { recursive: true });
writeFileSync(new URL('estrategia/index.html', root), out);
const n = (out.match(/<section class="slide[^>]*>/g) || []).filter(t => !t.includes('data-draft')).length;
console.log(`estrategia/index.html: ${n} telas`);
