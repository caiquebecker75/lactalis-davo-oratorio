// Monta a versão com o planejamento (estrategia/index.html):
// as telas de planejamento vêm de tools/estrategia.html, e os seis espaços,
// o investimento e o resumo com o contato são copiados do index.html,
// para as duas apresentações mostrarem sempre as mesmas peças e os mesmos valores.
// Uso: node tools/estrategia.mjs
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';

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
out = troca(out, '<!-- @contato -->\n', tela('contato').replace('data-short="Contato"', 'data-short="Resumo e contato"').replace('data-title="Contato"', 'data-title="Resumo e contato"'), 'modelo');
if (/<!-- @/.test(out)) throw new Error('marcador sem uso no modelo');

mkdirSync(new URL('estrategia/', root), { recursive: true });
writeFileSync(new URL('estrategia/index.html', root), out);
const n = (out.match(/<section class="slide[^>]*>/g) || []).filter(t => !t.includes('data-draft')).length;
console.log(`estrategia/index.html: ${n} telas`);
