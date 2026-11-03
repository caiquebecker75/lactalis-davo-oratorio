// Gera assets/img/upgrade a partir das imagens do job (upgrade-premium/novos-materiais):
// a foto de cada espaço e o recorte de cada material. Usa o sharp de galbani-kit-pdv-facas.
// Uso: node tools/upgrade.mjs
import { createRequire } from 'node:module';
import { mkdirSync } from 'node:fs';
import { UP } from './upgrade-dados.mjs';
const require = createRequire('C:/Users/Ana Paula Maraia/Documents/75LAB/galbani-kit-pdv-facas/package.json');
const sharp = require('sharp');
const JOB = 'C:/Users/Ana Paula Maraia/Documents/75LAB/lactalis-davo-oratorio/upgrade-premium/novos-materiais/';
const OUT = new URL('../assets/img/upgrade/', import.meta.url);
mkdirSync(OUT, { recursive: true });
const dest = n => new URL(n + '.webp', OUT).pathname.replace(/^\/([A-Za-z]:)/, '$1').replace(/%20/g, ' ');

for (const e of UP) {
  const f = JOB + e.img + '-novo.jpg';
  const { width: W, height: H } = await sharp(f).metadata();
  await sharp(f).webp({ quality: 84 }).toFile(dest(e.id + '-depois'));
  for (const p of e.linhas.flat()) {
    const [cx, cy, sw] = p.c, sh = Math.round(sw * p.h / p.w);
    const width = Math.min(sw, W), height = Math.min(sh, H);
    const left = Math.max(0, Math.min(W - width, Math.round(cx - width / 2)));
    const top = Math.max(0, Math.min(H - height, Math.round(cy - height / 2)));
    await sharp(f).extract({ left, top, width, height })
      .resize({ width: Math.max(width, 640), kernel: 'lanczos3' }).webp({ quality: 84 }).toFile(dest(`${e.id}-p${p.n}`));
  }
  console.log(e.id, W + 'x' + H, e.linhas.flat().length, 'recortes');
}
