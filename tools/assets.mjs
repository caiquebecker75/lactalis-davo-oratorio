// Copia as imagens do job (Documents/75LAB/lactalis-davo-oratorio) para assets/img,
// em WebP, com os recortes de antes × depois alinhados.
// Uso: node tools/assets.mjs   (o sharp vem do projeto galbani-kit-pdv-facas)
import { createRequire } from 'node:module';
import { mkdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire('C:/Users/Ana Paula Maraia/Documents/75LAB/galbani-kit-pdv-facas/package.json');
const sharp = require('sharp');

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = join(HERE, '..', 'assets', 'img');
const JOB = 'C:/Users/Ana Paula Maraia/Documents/75LAB/lactalis-davo-oratorio';

const WQ = { photo: 80, art: 86, board: 80 };
const MAXW = { photo: 1600, art: 1400, board: 2400 };

// [saída, origem, tipo, recorte opcional {left, top, width, height}]
const LIST = [
  // Ilha quadrada Whey · Parmalat Fit
  ['whey/a-antes', 'ilha-quadrada-whey-4-vistas/fotos-vt/face-A-frente.jpg', 'photo'],
  ['whey/a-depois', 'ilha-quadrada-whey-4-vistas/fotomontagens/face-A-frontal-refit.jpg', 'photo'],
  ['whey/b-antes', 'ilha-quadrada-whey-4-vistas/fotos-vt/face-B-fundo.jpg', 'photo'],
  ['whey/b-depois', 'ilha-quadrada-whey-4-vistas/fotomontagens/face-B-lateral-esquerda-refit.jpg', 'photo'],
  ['whey/c-antes', 'ilha-quadrada-whey-4-vistas/fotos-vt/face-C-lateral.jpg', 'photo'],
  ['whey/c-depois', 'ilha-quadrada-whey-4-vistas/fotomontagens/face-C-lateral-direita-refit.jpg', 'photo'],
  ['whey/prancha-4-vistas', 'ilha-quadrada-whey-4-vistas/prancha-4-vistas.png', 'board'],
  ['whey/prancha-materiais', 'ilha-quadrada-whey-4-vistas/prancha-materiais.png', 'board'],
  ['whey/p1-testeira', 'ilha-quadrada-whey-4-vistas/pecas/01-testeira-frente.png', 'art'],
  ['whey/p2-placa-central', 'ilha-quadrada-whey-4-vistas/pecas/02-placa-central-frente.png', 'art'],
  ['whey/p3-painel-janela', 'ilha-quadrada-whey-4-vistas/pecas/03-painel-janela.png', 'art'],
  ['whey/p4-painel-lateral', 'ilha-quadrada-whey-4-vistas/pecas/04-painel-lateral.png', 'art'],
  ['whey/p5-rodape', 'ilha-quadrada-whey-4-vistas/pecas/05-rodape.png', 'art'],

  // Ilha de nutrição esportiva · Parmalat Fit (lado A: recorte do trecho Fit)
  ['nutricao/a-antes', 'ilha-nutricao-esportiva-4-vistas/fotomontagens/face-A-lado-longo-antes-depois.jpg', 'photo', { left: 0, top: 0, width: 1060, height: 990 }],
  ['nutricao/a-depois', 'ilha-nutricao-esportiva-4-vistas/fotomontagens/face-A-lado-longo-antes-depois.jpg', 'photo', { left: 0, top: 1014, width: 1060, height: 990 }],
  ['nutricao/b-antes', 'ilha-nutricao-esportiva-4-vistas/fotomontagens/face-B-cabeceira-antes.jpg', 'photo'],
  ['nutricao/b-depois', 'ilha-nutricao-esportiva-4-vistas/fotomontagens/face-B-cabeceira-refit.jpg', 'photo'],
  ['nutricao/vt-lado-longo', 'ilha-nutricao-esportiva-4-vistas/fotos-vt/face-A-lado-longo.jpg', 'photo'],
  ['nutricao/prancha-4-vistas', 'ilha-nutricao-esportiva-4-vistas/prancha-4-vistas.png', 'board'],
  ['nutricao/prancha-materiais', 'ilha-nutricao-esportiva-4-vistas/prancha-materiais.png', 'board'],
  ['nutricao/prancha-testeira-central', 'ilha-nutricao-esportiva-4-vistas/prancha-testeira-central.png', 'board'],
  ['nutricao/p7-testeira-central', 'ilha-nutricao-esportiva-4-vistas/pecas/07-testeira-central-face-A.png', 'art'],
  ['nutricao/p1-regua-whey', 'ilha-nutricao-esportiva-4-vistas/pecas/01-regua-130-whey-em-po.png', 'art'],
  ['nutricao/p1-regua-pronto', 'ilha-nutricao-esportiva-4-vistas/pecas/01-regua-130-pronto-para-beber.png', 'art'],
  ['nutricao/p1-regua-levar', 'ilha-nutricao-esportiva-4-vistas/pecas/01-regua-130-para-levar.png', 'art'],
  ['nutricao/p3-placa-marca', 'ilha-nutricao-esportiva-4-vistas/pecas/03-placa-base-marca.png', 'art'],
  ['nutricao/p4-placa-shake', 'ilha-nutricao-esportiva-4-vistas/pecas/04-placa-base-ocasiao.png', 'art'],
  ['nutricao/p5-placa-momentos', 'ilha-nutricao-esportiva-4-vistas/pecas/05-placa-base-cabeceira.png', 'art'],

  // Gôndola seca · Parmalat Fit
  ['seca/antes', 'gondola-seca-vista-frontal/fotos-vt/frontal-vt-image20.jpg', 'photo'],
  ['seca/depois', 'gondola-seca-vista-frontal/fotomontagem/gondola-seca-refit.jpg', 'photo'],
  ['seca/prancha-vista-frontal', 'gondola-seca-vista-frontal/prancha-vista-frontal.png', 'board'],
  ['seca/prancha-decupagem', 'gondola-seca-vista-frontal/prancha-decupagem.png', 'board'],
  ['seca/prancha-materiais', 'gondola-seca-vista-frontal/prancha-materiais.png', 'board'],
  ['seca/reguas-padronizadas', 'gondola-seca-vista-frontal/reguas-padronizadas.png', 'board'],
  ['seca/p1-testeira', 'gondola-seca-vista-frontal/pecas/1-testeira.png', 'art'],
  ['seca/p2-moldura', 'gondola-seca-vista-frontal/pecas/2-moldura-whey.png', 'art'],
  ['seca/p3-regua-energia', 'gondola-seca-vista-frontal/pecas/3-2-regua-energia-para-o-seu-dia.png', 'art'],
  ['seca/p3-regua-proteina', 'gondola-seca-vista-frontal/pecas/3-4-regua-proteina-liquida.png', 'art'],
  ['seca/p3-regua-nutricao', 'gondola-seca-vista-frontal/pecas/3-6-regua-nutricao-em-qualquer-rotina.png', 'art'],
  ['seca/p3-regua-grafica', 'gondola-seca-vista-frontal/pecas/3-regua-grafica.png', 'art'],

  // Pense Zero · Batavo (depois = arte de referência, enquadramento próximo da VT)
  ['pensezero/antes', 'pense-zero-vista-frontal/fotos-vt/frontal-vt-image26.jpg', 'photo'],
  ['pensezero/depois', 'pense-zero-vista-frontal/ref/arte-referencia.png', 'photo'],
  ['pensezero/prancha-vista-frontal', 'pense-zero-vista-frontal/prancha-vista-frontal.png', 'board'],
  ['pensezero/prancha-decupagem', 'pense-zero-vista-frontal/prancha-decupagem.png', 'board'],
  ['pensezero/prancha-materiais', 'pense-zero-vista-frontal/prancha-materiais.png', 'board'],
  ['pensezero/p1-testeira', 'pense-zero-vista-frontal/pecas/1-testeira-superior.png', 'art'],
  ['pensezero/p2-adesivo-esq', 'pense-zero-vista-frontal/pecas/2-adesivo-lateral-esquerdo.png', 'art'],
  ['pensezero/p2-adesivo-dir', 'pense-zero-vista-frontal/pecas/2-adesivo-lateral-direito.png', 'art'],
  ['pensezero/p4-regua-cafe', 'pense-zero-vista-frontal/pecas/4-1-regua-pro-cafe-da-manha.png', 'art'],
  ['pensezero/p4-regua-compartilhar', 'pense-zero-vista-frontal/pecas/4-2-regua-pra-compartilhar.png', 'art'],
  ['pensezero/p4-regua-tarde', 'pense-zero-vista-frontal/pecas/4-3-regua-pro-lanche-da-tarde.png', 'art'],
  ['pensezero/p4-regua-levar', 'pense-zero-vista-frontal/pecas/4-4-regua-pra-levar.png', 'art'],
  ['pensezero/p4-regua-rapido', 'pense-zero-vista-frontal/pecas/4-5-regua-no-seu-lanche-rapido.png', 'art'],
  ['pensezero/p4-regua-colher', 'pense-zero-vista-frontal/pecas/4-6-regua-de-colher-de-sobremesa.png', 'art'],

  // Président (antes e depois saem dos comparativos, que já estão alinhados)
  ['president/antes', 'president-gondola-fria-vista-frontal/fotomontagens/vista-final-premium-antes-depois.jpg', 'photo', { left: 0, top: 0, width: 851, height: 1400 }],
  ['president/premium', 'president-gondola-fria-vista-frontal/fotomontagens/vista-final-premium-antes-depois.jpg', 'photo', { left: 871, top: 0, width: 851, height: 1400 }],
  ['president/economica', 'president-gondola-fria-vista-frontal/fotomontagens/vista-final-economica-antes-depois.jpg', 'photo', { left: 870, top: 0, width: 851, height: 1400 }],
  ['president/vt', 'president-gondola-fria-vista-frontal/fotos-vt/frontal-vt-image23.jpg', 'photo'],
  ['president/prancha-vista-final', 'president-gondola-fria-vista-frontal/prancha-vista-final.png', 'board'],
  ['president/prancha-materiais', 'president-gondola-fria-vista-frontal/prancha-materiais.png', 'board'],
  ['president/prancha-bandeja', 'president-gondola-fria-vista-frontal/prancha-bandeja-engenharia.png', 'board'],
  ['president/p1-testeira-premium', 'president-gondola-fria-vista-frontal/pecas/1-testeira-premium-acm.png', 'art'],
  ['president/p1-testeira-economica', 'president-gondola-fria-vista-frontal/pecas/1-testeira-economica-ps.png', 'art'],
  ['president/p2-frente-bandeja', 'president-gondola-fria-vista-frontal/pecas/2-frente-bandeja-com-bolso.png', 'art'],
  ['president/p2-bandeja-3d', 'president-gondola-fria-vista-frontal/vistas/bandeja-3d.png', 'art'],
  ['president/p5-cartao-mucarela', 'president-gondola-fria-vista-frontal/pecas/4-1-cartao-mucarela.png', 'art'],
  ['president/p5-cartao-especiais', 'president-gondola-fria-vista-frontal/pecas/4-2-cartao-especiais.png', 'art'],
  ['president/p5-cartao-prato', 'president-gondola-fria-vista-frontal/pecas/4-3-cartao-prato.png', 'art'],
  ['president/p6-wobbler-mucarela', 'president-gondola-fria-vista-frontal/pecas/5-wobbler-mucarela.png', 'art'],
  ['president/p6-wobbler-prato', 'president-gondola-fria-vista-frontal/pecas/5-wobbler-prato.png', 'art'],

  // Sobremesas · Batavo
  ['sobremesas/f-antes', 'sobremesas-batavo-vista-frontal/fotos-vt/frontal-vt-image25.jpg', 'photo'],
  ['sobremesas/f-depois', 'sobremesas-batavo-vista-frontal/fotomontagens/frontal-refit.jpg', 'photo'],
  ['sobremesas/a-antes', 'sobremesas-batavo-vista-frontal/fotos-vt/angulo-vt-image24.jpg', 'photo'],
  ['sobremesas/a-depois', 'sobremesas-batavo-vista-frontal/fotomontagens/angulo-refit.jpg', 'photo'],
  ['sobremesas/prancha-vista-frontal', 'sobremesas-batavo-vista-frontal/prancha-vista-frontal.png', 'board'],
  ['sobremesas/prancha-nomes-e-stoppers', 'sobremesas-batavo-vista-frontal/prancha-nomes-e-stoppers.png', 'board'],
  ['sobremesas/prancha-materiais', 'sobremesas-batavo-vista-frontal/prancha-materiais.png', 'board'],
  ['sobremesas/p1-testeira', 'sobremesas-batavo-vista-frontal/pecas/1-testeira-sanefa.png', 'art'],
  ['sobremesas/p2-regua-base', 'sobremesas-batavo-vista-frontal/pecas/2-regua-base.png', 'art'],
  ['sobremesas/p3-nome-pudim', 'sobremesas-batavo-vista-frontal/pecas/3-nome-pudim-e-manjar.png', 'art'],
  ['sobremesas/p3-nome-flan', 'sobremesas-batavo-vista-frontal/pecas/3-nome-flan.png', 'art'],
  ['sobremesas/p3-nome-creamy', 'sobremesas-batavo-vista-frontal/pecas/3-nome-creamy.png', 'art'],
  ['sobremesas/p4-faixa-poco', 'sobremesas-batavo-vista-frontal/pecas/4-faixa-poco.png', 'art'],
  ['sobremesas/p5-stopper-pudim', 'sobremesas-batavo-vista-frontal/pecas/5-stopper-pudim-e-manjar.png', 'art'],
  ['sobremesas/p5-stopper-flan', 'sobremesas-batavo-vista-frontal/pecas/5-stopper-flan.png', 'art'],
  ['sobremesas/p5-stopper-creamy', 'sobremesas-batavo-vista-frontal/pecas/5-stopper-creamy.png', 'art'],

  // Painel com os 6 espaços
  ['painel-geral-6-espacos', 'painel-geral-6-espacos-v2.jpg', 'board'],
];

let n = 0, bytes = 0;
for (const [out, src, kind, crop] of LIST) {
  const from = join(JOB, src), to = join(OUT, out + '.webp');
  if (!existsSync(from)) { console.warn('FALTA', src); continue; }
  mkdirSync(dirname(to), { recursive: true });
  let img = sharp(from);
  if (crop) img = img.extract(crop);
  img = img.resize({ width: MAXW[kind], withoutEnlargement: true });
  const info = await img.webp({ quality: WQ[kind], alphaQuality: 90, effort: 5 }).toFile(to);
  n++; bytes += info.size;
  console.log(out.padEnd(40), `${info.width}x${info.height}`.padEnd(10), Math.round(info.size / 1024) + ' KB');
}
console.log(`\n${n} imagens, ${(bytes / 1048576).toFixed(1)} MB`);
