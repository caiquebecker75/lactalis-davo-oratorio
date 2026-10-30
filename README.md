# Lactalis no D'avó Oratório × 75LAB · Seis espaços, do antes ao depois

Apresentação da 75LAB para a Lactalis com a ambientação de categorias no D'avó Oratório: Parmalat Fit (três espaços), Batavo Pense Zero, Président e Sobremesas Batavo. É uma apresentação imagética. Cada espaço cabe numa tela só: o antes × depois grande, as peças soltas e o jeito de aplicar. Base: a VT da loja e todo o refit feito no job (`Documents/75LAB/lactalis-davo-oratorio`).

- **Apresentação:** https://projetos.75lab.com.br/lactalis-davo-oratorio/
- **Versão com o planejamento (15 telas):** https://projetos.75lab.com.br/lactalis-davo-oratorio/estrategia/
- Contato: Vanessa Morelli, Diretora Comercial 75LAB (envia a apresentação ao cliente)
- A versão estratégica anterior (17 telas e material de apoio) está guardada na tag `v1-estrategica` do git.

## Roteiro: 9 telas

| Tela | Conteúdo |
|---|---|
| 01 · Capa | A fachada do D'avó: parede vermelha, placa creme com o título, marquise verde e as seis fotos de depois como vitrines. |
| 02 · O contexto | Seis espaços que já existem, 132 peças, nenhum móvel novo. Embaixo, "A loja hoje" com as fotos da VT e como ler a apresentação. |
| 03 · Ilha quadrada Whey | Faces A, B e C; 1 testeira e 15 adesivos por cima do que já existe. |
| 04 · Ilha de nutrição | Lado longo e cabeceira; réguas no trilho, placas de base e a testeira em T que fica em pé sozinha. |
| 05 · Gôndola seca | Testeira nos montantes, moldura do whey em pó e 7 réguas no trilho. |
| 06 · Pense Zero | Antes × arte de referência; testeira, adesivos eletrostáticos nos vidros e 6 réguas por ocasião. |
| 07 · Président | Premium e econômica; bandejas de polionda, cartões trocáveis e testeira. |
| 08 · Sobremesas | Frontal e em ângulo; régua-base, nomes soltos e stoppers. |
| 09 · Resumo e contato | O total de cada espaço, o que entra em cada um e a soma dos seis; ao lado, Vanessa Morelli e os canais da 75LAB. |

## Versão com o planejamento: 15 telas

Um segundo link, com o desafio, o shopper e a estratégia antes dos espaços. O conteúdo de planejamento veio da versão estratégica (tag `v1-estrategica`), redesenhado no visual do D'avó.

| Tela | Conteúdo |
|---|---|
| 01 · Capa | A mesma fachada, com "Planejamento e ambientação". |
| 02 · O desafio | "O pedido é ambientar. A necessidade é ajudar a escolher.": o que foi pedido, o que a loja precisa, a oportunidade e as regras do jogo. |
| 03 · A loja hoje | As seis fotos da visita técnica, cada uma com o problema observado. |
| 04 · O shopper | Quatro momentos de compra com barreira e resposta, e a tensão central. |
| 05 · O que aprendemos | Quatro ideias, cada uma com uma foto ou peça. |
| 06 · A estratégia | "Escolhas que acompanham seu dia": rotina ativa, leveza, refeição e prazer; de, para e através de. |
| 07 · O sistema | Encontrar, escolher e sustentar, com as peças de cada camada e as quantidades; regras de projeto. |
| 08 a 13 · Os seis espaços | As mesmas telas do link principal, com o momento do dia e a frase da arte no topo. |
| 14 · Próximos passos | Seis etapas, sem datas; o que combinar com o D'avó. |
| 15 · Resumo e contato | O mesmo resumo do investimento e o cartão da Vanessa. |

Os espaços, o investimento (escondido) e o resumo são copiados do `index.html`, então as duas versões mostram sempre as mesmas peças e os mesmos valores. As telas de planejamento ficam em `tools/estrategia.html`. Depois de mudar qualquer um dos dois, rode `node tools/estrategia.mjs` para gerar `estrategia/index.html`. Não edite o `estrategia/index.html` à mão.

## A tela de cada espaço

- **Antes × depois** à esquerda, numa foto só: o antes fica à esquerda do divisor e o depois à direita. Arrastar (mouse ou dedo), clicar na foto ou usar as setas com o divisor em foco leva o divisor para os dois lados. Ao entrar na tela, a foto começa toda no antes e o depois corre até o meio; depois aparece a dica "Arraste para comparar", que some no primeiro arrasto. As abas do topo trocam a vista, e a lupa amplia o depois e o antes. As fotos de antes e depois de cada vista têm o mesmo enquadramento; no Pense Zero o depois é a arte de referência.
- **As peças** à direita, com uma frase-resumo. A "mesa" mostra as peças soltas, na mesma proporção entre si, com número, nome e quantidade (por exemplo, "6 un.", "1 conjunto", "6,7 m" na fita de borda). As medidas saíram porque são estimativas até a medição na loja; as peças não têm preço. A escala é calculada para ocupar o espaço (`--u`). Cada peça abre ampliada. A bandeja Président é o render 3D.
- **Investimento total** ao lado do resumo das peças, com asterisco e "* Valores estimados" logo abaixo. Os valores são a coluna "Venda c/ opcional" da planilha "DAVÓ · Resumo por projeto · divisor 0,40" (outubro de 2026). No Pense Zero o total inclui os adesivos externos opcionais, e a nota diz isso.
- **Arrumação:** o layout testa até três arrumações e fica com a que deixa a foto e as peças maiores: o como aplica embaixo das peças, ao lado delas, ou (foto deitada) embaixo da foto.
- **Como aplica** embaixo ou ao lado das peças: três quadros com um pictograma animado e uma frase curta. Os pictogramas mostram:
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

  Cada quadro indica os números das suas peças. Passar o mouse ou clicar em "Ver de novo" repete a animação.

## Navegação

A apresentação é enviada ao cliente, sem apresentadora, então ela se explica sozinha:
- A capa tem o botão **Começar**, e ao abrir aparece uma dica de como avançar.
- O contexto explica como ler: cada espaço numa tela, com o antes e depois, as peças e como aplicar.
- No canto inferior direito ficam o botão de voltar e o **Próximo**, que mostra o nome da tela seguinte (por exemplo, "Próximo · Nutrição esportiva").
- A foto de antes × depois tem o divisor vermelho com setas e a dica "Arraste para comparar". As abas têm rótulo ("Troque a vista", "Compare os acabamentos"). A lupa amplia as fotos, e as peças também ampliam no clique.
- "Ver de novo" repete a animação de aplicação das peças.
- O fechamento convida a falar com a Vanessa.

Teclado e atalhos:
- `→` `↓` `PageDown` `espaço` avançam; `←` `↑` `PageUp` voltam.
- Os espaços no rodapé levam direto a cada espaço.
- `Home`/`End` vão para a primeira e a última tela, `M` abre o índice, `N` as notas da apresentadora e `F` a tela cheia. `Esc` fecha.
- Deep link: `#president`, `#investimento` (com `?draft`).
- Até 820 px de largura (e em tablet em retrato), a apresentação vira rolagem vertical.

Flags de QA:
- `?desktop` força o modo apresentação.
- `&ar=2.2` simula outra proporção.
- `?static` mostra cada tela no estado final, com os pictogramas já aplicados.
- `?solo=whey` (no celular) mostra só uma tela.
- `?lay=lado|largo|sob` força uma arrumação da tela de espaço (a escolhida e as notas de cada uma ficam em `data-lay` no `.sp-body`).
- `?draft` inclui as telas marcadas com `data-draft` (hoje, a de investimento).

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
estrategia/index.html versão com o planejamento (gerada; não editar)
estrategia/estrategia.css  telas de planejamento e o momento do dia nos espaços
tools/estrategia.html modelo das telas de planejamento
tools/estrategia.mjs  gera estrategia/index.html (node tools/estrategia.mjs)
```

No servidor local, abra `http://localhost:8792/estrategia/index.html` (o serve.ps1 não resolve pastas).

`tools/assets.mjs` lê as pastas de `Documents/75LAB/lactalis-davo-oratorio`, recorta os comparativos já alinhados (Président e o lado longo da ilha de nutrição) e grava WebP. Usa o `sharp` instalado em `galbani-kit-pdv-facas`. Depois de uma nova rodada no job, rode o script de novo.

## Pendências

- **Escopo:** quais cinco dos seis pontos entram, e a ilha Titanic.
- **Medidas:** saíram da apresentação porque são estimativas.
- **Totais:** o slide final usa R$ 11.262,57, a soma dos seis totais como aparecem nos slides; o total geral da planilha é R$ 11.262,55 (a diferença de dois centavos é o arredondamento de cada linha). A VT mistura mm e cm, e as faces D da ilha quadrada e C e D da ilha de nutrição não foram fotografadas. Medidas e quantidades se confirmam na medição da loja; as estimativas estão no README de cada espaço, no job.
- **Claims e arquivos:**
  - "Triplo Zero" ("0% adição de açúcar") e "21 g de proteína";
  - SKUs e famílias Batavo;
  - lista de cartões Président;
  - logos em vetor e packshots oficiais.

  As fotos de alimento das peças são ilustrativas.
- **Com o D'avó:** onde fica o cartaz "Monte seu combo" e se o material de Outubro Rosa pode sair da ponta Pense Zero.
- **Investimento:** a tela de investimento já está pronta (`#investimento`, antes do contato), com as fotos Président econômica e premium e o que muda em cada nível. Ela fica escondida (`data-draft`) até chegarem os valores. Depois, é só trocar os dois `R$ —` e tirar o `data-draft`; a apresentação passa a ter 10 telas.

## Fontes

- VT Lactalis | D'avó Oratório (fotos da loja).
- Fotomontagens, peças e materiais: job 75LAB `lactalis-davo-oratorio` (28/10/2026) e o README de cada espaço.
