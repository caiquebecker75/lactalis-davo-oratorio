# Lactalis no D'avó Oratório × 75LAB · Seis espaços, do antes ao depois

Apresentação da 75LAB para a Lactalis com a ambientação de categorias no D'avó Oratório: Parmalat Fit (três espaços), Batavo Pense Zero, Président e Sobremesas Batavo. É uma apresentação imagética. Cada espaço tem um antes × depois grande e as peças soltas, na mesma escala, com o jeito de aplicar cada uma. Base: a VT da loja e todo o refit feito no job (`Documents/75LAB/lactalis-davo-oratorio`).

- **Apresentação:** https://projetos.75lab.com.br/lactalis-davo-oratorio/
- Apresentadora: Vanessa Morelli, Diretora Comercial 75LAB
- A versão estratégica anterior (17 telas e material de apoio) está guardada na tag `v1-estrategica` do git.

## Roteiro: 15 telas

| Tela | Conteúdo |
|---|---|
| 01 · Capa | A fachada do D'avó: parede vermelha, placa creme com o título, marquise verde e as seis fotos de depois como vitrines. |
| 02 · O contexto | Seis espaços que já existem, 132 peças, nenhum móvel novo. Embaixo, "A loja hoje" com as fotos da VT. |
| 03–04 · Ilha quadrada Whey | Antes × depois nas faces A, B e C, depois 1 testeira e 15 adesivos. |
| 05–06 · Ilha de nutrição | Lado longo e cabeceira, depois réguas no trilho, placas de base e a testeira em T que fica em pé sozinha. |
| 07–08 · Gôndola seca | Testeira nos montantes, moldura do whey em pó e 7 réguas padronizadas. |
| 09–10 · Pense Zero | Antes × arte de referência, depois testeira, adesivos eletrostáticos nos vidros e 6 réguas por ocasião. |
| 11–12 · Président | Abas premium e econômica, depois bandejas de polionda, cartões trocáveis e testeira. |
| 13–14 · Sobremesas | Vista frontal e em ângulo, depois régua-base, nomes soltos e stoppers. |
| 15 · Contato | Vanessa Morelli e os canais da 75LAB. |

## As telas de cada espaço

- **Antes × depois:** as duas fotos aparecem grandes. O layout escolhe lado a lado ou uma sobre a outra, o que der a foto maior. O depois entra com uma cortina. As abas trocam a vista, e clicar em qualquer foto amplia. No Pense Zero o depois é a arte de referência, que tem outro enquadramento da foto da VT.
- **As peças:** a "mesa" mostra as peças soltas, todas na mesma escala (a barra mostra 50 ou 10 cm). A escala é calculada para ocupar o espaço, com `--u` em px por cm. Cada peça tem número, material, medida e quantidade, e abre ampliada. A bandeja Président é o render 3D, por isso fica fora da escala.
- **Como aplica:** três cartões por espaço, cada um com um pictograma animado da peça entrando. Os pictogramas mostram:
  - encaixa no trilho;
  - fita VHB;
  - adesivo sobre a placa;
  - fita de borda;
  - fica em pé sozinha;
  - vinil eletrostático;
  - monta sem cola em 1 minuto;
  - cartão trocável;
  - stopper com presilha;
  - nome solto que desliza;
  - mesma fixação da testeira atual;
  - apoio nos montantes.

  Cada cartão indica os números das suas peças. Passar o mouse repete a animação.

## Navegação

- `→` `↓` `PageDown` `espaço` avançam; `←` `↑` `PageUp` voltam.
- A seta no canto inferior direito avança.
- Os espaços no rodapé levam direto a cada espaço.
- `Home`/`End` vão para a primeira e a última tela, `M` abre o índice, `N` as notas da apresentadora e `F` a tela cheia. `Esc` fecha.
- Deep link: `#president` e `#president-pecas`.
- Até 820 px de largura (e em tablet em retrato), a apresentação vira rolagem vertical.

Flags de QA:
- `?desktop` força o modo apresentação.
- `&ar=2.2` simula outra proporção.
- `?static` mostra cada tela no estado final, com os pictogramas já aplicados.
- `?solo=whey` (no celular) mostra só uma tela.

## Direção de arte

A base são as cores do D'avó, sem repetir os decks anteriores:
- creme `#F7F0DF` como luz de loja;
- vermelho `#E1261C` nos números e na etiqueta "Depois";
- verde `#0E8C6C` no "como aplica";
- a faixa da fachada (vermelho e verde) no topo de cada tela;
- Outfit em todos os textos;
- transição de porta automática: a próxima tela abre do centro;
- a cor da marca aparece só no nome de cada espaço.

## Arquitetura

HTML, CSS e JavaScript puros, sem build e sem dependências (fonte do Google Fonts). O palco tem 900 de altura e acompanha a proporção da janela (1600 a 2100 de largura).

```
index.html            telas, notas, índice e lightbox
assets/css/deck.css   sistema visual, telas, celular e movimento reduzido
assets/js/deck.js     palco, porta, antes × depois, escala da mesa, pictogramas, índice, lightbox, celular
assets/img/<espaço>/  antes, depois e peças de cada espaço (WebP)
assets/img/brand/     logos 75LAB
assets/img/og.jpg     imagem de compartilhamento (da capa)
tools/assets.mjs      gera assets/img a partir do job (node tools/assets.mjs)
serve.ps1             servidor local (powershell -File serve.ps1 -Port 8792)
```

`tools/assets.mjs` lê as pastas de `Documents/75LAB/lactalis-davo-oratorio`, recorta os comparativos já alinhados (Président e o lado longo da ilha de nutrição) e grava WebP. Usa o `sharp` instalado em `galbani-kit-pdv-facas`. Depois de uma nova rodada no job, rode o script de novo.

## Pendências

- **Escopo:** quais cinco dos seis pontos entram, e a ilha Titanic.
- **Medidas:** a VT mistura mm e cm. As faces D da ilha quadrada e C e D da ilha de nutrição não foram fotografadas. Quantidades e medidas se confirmam depois da medição na loja.
- **Claims e arquivos:**
  - "Triplo Zero" ("0% adição de açúcar") e "21 g de proteína";
  - SKUs e famílias Batavo;
  - lista de cartões Président;
  - logos em vetor e packshots oficiais.

  As fotos de alimento das peças são ilustrativas.
- **Com o D'avó:** onde fica o cartaz "Monte seu combo" e se o material de Outubro Rosa pode sair da ponta Pense Zero.
- **Investimento:** esta versão não tem tela de investimento. Quando chegarem os valores dos dois níveis, eles entram numa tela só.

## Fontes

- VT Lactalis | D'avó Oratório (fotos da loja).
- Fotomontagens, peças e materiais: job 75LAB `lactalis-davo-oratorio` (28/10/2026) e o README de cada espaço.
