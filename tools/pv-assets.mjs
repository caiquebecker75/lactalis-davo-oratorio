// Imagens do link "Projeto visual" (retorno da reunião de 05/11/2026): copia do job para assets/img/pv, em WebP.
// O antes e o depois de cada vista têm o mesmo quadro, para o divisor comparar ponto a ponto.
// Uso: node tools/pv-assets.mjs   (o sharp vem do projeto president-expositor-festval)
import { createRequire } from 'node:module';
import { mkdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire('C:/Users/Ana Paula Maraia/Documents/75LAB/PRESIDENT/president-expositor-festval/package.json');
const sharp = require('sharp');
sharp.cache(false);

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = join(HERE, '..', 'assets', 'img', 'pv');
const JOB = join(HERE, '..', '..', 'lactalis-davo-oratorio');
const ILHA = 'ilha-nutricao-esportiva-4-vistas', PRES = 'president-gondola-fria-gancheiras', REU = 'reuniao-05-11', ARTE = 'versao-premium/arte-chatgpt';
const Q = { photo: 82, art: 90 }, W = { photo: 1600, art: 1500, capa: 1347 };

async function salva(img, saida, tipo) {
  const f = join(OUT, saida + '.webp');
  mkdirSync(dirname(f), { recursive: true });
  const m = await sharp(await img.clone().png().toBuffer()).metadata();
  const larg = W[tipo] || W.art;
  await img.resize(m.width > larg ? larg : null).webp({ quality: Q[tipo] || Q.art, effort: 5 }).toFile(f);
  console.log(saida);
}
const de = p => { const f = join(JOB, p); if (!existsSync(f)) throw new Error('faltou ' + p); return f; };

const LISTA = [
  // Capa: o produto, não as soluções
  ['capa-fit', `${ARTE}/fit-onda-sabores.png`, 'capa'], ['capa-pensezero', `${ARTE}/pensezero-frutas.png`, 'capa'],
  ['capa-president', `${ARTE}/president-sanduiche.png`, 'capa'], ['capa-sobremesas', `${ARTE}/sobremesas-linha.png`, 'capa'],
  // Enviadas em 09/11: ilha nova (ilha-nutricao-esportiva-4-vistas/imagens-09-11), já alinhada com as fotos da VT
  ['nutricao/n-longo-antes', `${ILHA}/imagens-09-11/lado-longo-antes.jpg`, 'photo'], ['nutricao/n-longo-depois', `${ILHA}/imagens-09-11/lado-longo-depois.jpg`, 'photo'],
  ['nutricao/n-ponta-antes', `${ILHA}/imagens-09-11/ponta-antes.jpg`, 'photo'], ['nutricao/n-ponta-depois', `${ILHA}/imagens-09-11/ponta-depois.jpg`, 'photo'],
  ...['1-testeira-central', '2-perpendicular-esq', '2-perpendicular-dir', '3-barra-de-peso', '4-regua-whey-em-po', '4-regua-15g', '4-regua-23g', '4-regua-pronto-para-beber', '5-regua-barras-proteicas', '5-regua-creatina', '5-regua-whey-protein'].map(n => [`nutricao/p-${n}`, `${REU}/pranchas-09-11/pecas/ilha/${n}.png`, 'art']),
  // Réguas e testeira da seca iguais à prancha
  ['seca/n-1-testeira', 'gondola-seca-vista-frontal/pecas/1-testeira.png', 'art'],
  ...['2-moldura', '4-stopper-morango', '4-stopper-chocolate', '3-regua-1', '3-regua-2', '3-regua-3', '3-regua-4', '3-regua-5', '3-regua-6', '3-regua-7'].map(n => [`seca/p-${n}`, `${REU}/pranchas-09-11/pecas/seca/${n}.png`, 'art']),
  // Pense Zero igual à referência
  ...['1-testeira', '1-led', '3-base', '4-regua-cafe', '4-regua-compartilhar', '4-regua-tarde', '4-regua-levar', '4-regua-rapido', '4-regua-colher'].map(n => [`pensezero/n-${n}`, `${REU}/imagens-06-11/pecas-pensezero/${n}.png`, 'art']),
  ['pensezero/n-2-esq', 'pense-zero-vista-frontal/pecas/2-adesivo-lateral-esquerdo.png', 'art'], ['pensezero/n-2-dir', 'pense-zero-vista-frontal/pecas/2-adesivo-lateral-direito.png', 'art'],
  // Président: peças da prancha de materiais enviada em 09/11
  ...['1-testeira-retroiluminada', '2-testeira-painel-led', '3-adesivo-externo', '4-adesivo-interno', '5-regua-1', '5-regua-2', '5-regua-3', '5-regua-4', '6-acabamento-led'].map(n => [`president/p-${n}`, `${PRES}/imagens-09-11/pecas-prancha/${n}.png`, 'art']),
  // Gancheira com placa, a partir da foto da loja
  ['president/n-4-gancheira', `${PRES}/imagens-09-11/pecas/4-gancheira.png`, 'art'], ['president/n-4-placa', `${PRES}/pecas/placa-frontal.png`, 'art'],
  // Ilha de nutrição: o antes do lado A tem o mesmo quadro estendido do depois
  ['nutricao/v1-antes', `${ILHA}/fotomontagens/ilha-vista-1-lado-A-antes.jpg`, 'photo'], ['nutricao/v1-depois', `${ILHA}/fotomontagens/ilha-vista-1-lado-A-depois.jpg`, 'photo'],
  ['nutricao/v2-antes', `${ILHA}/fotomontagens/ilha-vista-2-lado-B-antes.jpg`, 'photo'], ['nutricao/v2-depois', `${ILHA}/fotomontagens/ilha-vista-2-lado-B-depois.jpg`, 'photo'],
  ['nutricao/hoje', `${ILHA}/fotos-vt/face-B-cabeceira.jpg`, 'photo'],
  ...['03-testeira-ilha-face-A', '04-ponta-cabeceira', '01-regua-a1-whey-em-po', '01-regua-a2-whey-15g', '01-regua-a3-para-levar', '02-regua-b1-whey-em-po', '02-regua-b2-pronto-para-beber', '02-regua-b3-pronto-para-beber', '05-faixa-1-barra-proteica', '05-faixa-2-creatina', '05-faixa-3-whey-protein'].map(n => [`nutricao/${n}`, `${ILHA}/pecas/${n}.png`, 'art']),
  // Gôndola seca
  ['seca/f-antes', `${REU}/bases/seca-frontal.png`, 'photo'], ['seca/f-depois', `${REU}/montagens/seca-frontal.jpg`, 'photo'],
  ['seca/a-antes', `${REU}/bases/seca-angulo.png`, 'photo'], ['seca/a-depois', `${REU}/montagens/seca-angulo.jpg`, 'photo'],
  ...['seca-2-moldura-whey', 'seca-r1', 'seca-r3', 'seca-r4', 'seca-r5', 'seca-r6', 'seca-destaque-23', 'seca-destaque-15'].map(n => [`seca/${n}`, `${REU}/pecas/${n}.png`, 'art']),
  // Enviadas em 06/11: já alinhadas com o antes em reuniao-05-11/imagens-06-11
  ['seca/n-antes', `${REU}/imagens-06-11/seca-frontal-antes.jpg`, 'photo'], ['seca/n-depois', `${REU}/imagens-06-11/seca-frontal-depois.jpg`, 'photo'],
  ['seca/flexforce-display', `${REU}/imagens-06-11/flexforce-display-peca.png`, 'art'],
  ['pensezero/n-antes', `${REU}/imagens-06-11/pensezero-frontal-antes.jpg`, 'photo'], ['pensezero/n-depois', `${REU}/imagens-06-11/pensezero-frontal-depois.jpg`, 'photo'],
  ['sobremesas/n-depois', `${REU}/pranchas-09-11/sobremesas-depois.jpg`, 'photo'],
  ...['1-testeira', '2-toldo', '3-regua-superior-1', '3-regua-superior-2', '3-regua-flan', '3-regua-creamy-1', '3-regua-creamy-2', '4-base-1', '4-base-2', '5-lateral-esq', '6-lateral-dir'].map(n => [`sobremesas/p-${n}`, `${REU}/pranchas-09-11/pecas/sobremesas/${n}.png`, 'art']),
  // Président, enviadas em 09/11: as duas versões e as peças
  ['president/n-letras', `${PRES}/imagens-09-11/president-retroiluminada-reguas.jpg`, 'photo'], ['president/n-caixa', `${PRES}/imagens-09-11/president-caixa-de-luz.jpg`, 'photo'],
  ...['1-testeira-letras', '1-testeira-caixa', '2-painel-fora', '3-adesivo-dentro', '4-bandeja', '5-regua', '6-base-madeira'].map(n => [`president/n-${n}`, `${PRES}/imagens-09-11/pecas/${n}.png`, 'art']),
  // Pense Zero
  ['pensezero/f-antes', `${REU}/bases/pensezero-frontal.png`, 'photo'], ['pensezero/f-depois', `${REU}/montagens/pensezero-frontal.jpg`, 'photo'],
  ['pensezero/a-antes', `${REU}/bases/pensezero-angulo.png`, 'photo'], ['pensezero/a-depois', `${REU}/montagens/pensezero-angulo.jpg`, 'photo'],
  ...['pz-1-testeira', 'pz-1-testeira-lateral', 'pz-4-base', 'pz-5-vidro-heroi', 'pz-5-vidro-beneficios', 'pz-3-r1-esq', 'pz-3-r2-esq', 'pz-3-r3-esq', 'pz-3-r4-esq'].map(n => [`pensezero/${n}`, `${REU}/pecas/${n}.png`, 'art']),
  // Président: o antes é o mesmo para as duas versões de testeira
  ['president/antes', `${PRES}/fotos-vt/president-frontal.png`, 'photo'],
  ['president/retroiluminada', `${PRES}/fotomontagens/president-gancheiras-retroiluminada.jpg`, 'photo'], ['president/painel-led', `${PRES}/fotomontagens/president-gancheiras-painel-led.jpg`, 'photo'],
  ...['pr-testeira-luz', 'pr-testeira-tela', 'pr-ripado-cima', 'pr-ripado-baixo'].map(n => [`president/${n}`, `${PRES}/pecas/${n}.png`, 'art']),
  // Sobremesas
  ['sobremesas/f-antes', `${REU}/bases/sobremesas-frontal.png`, 'photo'], ['sobremesas/f-depois', `${REU}/montagens/sobremesas-frontal.jpg`, 'photo'],
  ['sobremesas/a-antes', `${REU}/bases/sobremesas-angulo.png`, 'photo'], ['sobremesas/a-depois', `${REU}/montagens/sobremesas-angulo.jpg`, 'photo'],
  ...['sob-1-frontao', 'sob-2-faixa-esq', 'sob-2-faixa-dir', 'sob-3-regua-esq', 'sob-4-nome-pudim-e-manjar', 'sob-4-nome-flan', 'sob-4-nome-creamy', 'sob-4-nome-chantilly'].map(n => [`sobremesas/${n}`, `${REU}/pecas/${n}.png`, 'art']),
];
for (const [saida, origem, tipo] of LISTA) await salva(sharp(de(origem)), saida, tipo);

// Peças montadas só para a mesa
// testeira da gôndola seca: a arte aprovada na frente da caixa retroiluminada
{
  const caixa = await sharp(de(`${REU}/pecas/seca-caixa.png`)).resize(1900, 697, { fit: 'fill' }).toBuffer();
  const onda = await sharp(de(`${REU}/pecas/seca-1-testeira.png`)).resize(1900).toBuffer();
  const junta = await sharp({ create: { width: 1900, height: 966, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } }).composite([{ input: caixa, left: 0, top: 269 }, { input: onda, left: 0, top: 0 }]).png().toBuffer();
  await salva(sharp(junta), 'seca/caixa-com-testeira', 'art');
}
// painel de fora do Président, sem a sobra que sai da foto
await salva(sharp(de(`${PRES}/pecas/pr-torre.png`)).extract({ left: 130, top: 0, width: 590, height: 2115 }), 'president/painel-torre', 'art');
// gancheiras: três colunas da fileira
await salva(sharp(de(`${PRES}/pecas/fileira-1.png`)).extract({ left: 16, top: 0, width: 590, height: 380 }), 'president/gancheiras', 'art');
// adesivo de dentro: vermelho, só com o claim
{
  const fundo = Buffer.from(`<svg width="200" height="1400"><defs><linearGradient id="g" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stop-color="#C4161C"/><stop offset="1" stop-color="#7D0B0F"/></linearGradient></defs><rect width="200" height="1400" fill="url(#g)"/></svg>`);
  await salva(sharp(fundo).composite([{ input: de(`${PRES}/pecas/pr-claim-dentro.png`), left: 0, top: 0 }]), 'president/adesivo-dentro', 'art');
}
// fita de LED, para as peças que não têm arte
{
  const fita = Buffer.from(`<svg width="1400" height="44"><defs><filter id="b" x="-5%" y="-200%" width="110%" height="500%"><feGaussianBlur stdDeviation="7"/></filter></defs><rect width="1400" height="44" rx="7" fill="#2A1D14"/><rect x="14" y="16" width="1372" height="12" rx="6" fill="#FFB968" filter="url(#b)"/><rect x="14" y="19" width="1372" height="6" rx="3" fill="#FFF6E2"/></svg>`);
  await salva(sharp(fita), 'fita-led', 'art');
}
