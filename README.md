# Lactalis no D'avó Oratório × 75LAB · Seis espaços, uma arquitetura de escolha

Apresentação da 75LAB para a Lactalis com a ambientação de categorias no D'avó Oratório: Parmalat Fit (três espaços), Batavo Pense Zero, Président e Sobremesas Batavo. Base: *Planejamento Estratégico Lactalis no D'avó Oratório* (23/10/2026), a VT da loja e todo o refit feito no job (`Documents/75LAB/lactalis-davo-oratorio`).

- Apresentadora: Vanessa Morelli, Diretora Comercial 75LAB

## Roteiro: 17 telas

| Tela | Takeaway |
|---|---|
| 01 · Capa | Seis espaços, uma arquitetura de escolha. As seis fotomontagens abrem os espaços. |
| 02 · O desafio | O pedido é ambientar; a necessidade é ajudar a escolher. Pedido, necessidade e oportunidade (loja-referência em execução de categoria) e as regras do jogo. |
| 03 · A loja hoje | Os seis pontos da VT, cada um com o problema principal, e o alerta de escopo (briefing com cinco espaços, VT com seis mais a ilha Titanic). |
| 04 · O shopper | Quatro momentos (chegada, comparação, decisão, retirada), com barreira e resposta, e a tensão central. |
| 05 · O que aprendemos | Quatro insights; os sete completos estão no apoio. |
| 06 · A estratégia | Território recomendado *Escolhas que acompanham seu dia*: rotina ativa (Parmalat Fit), leveza (Pense Zero), refeição (Président, o hero) e prazer (Sobremesas). De → para → através de. |
| 07 · O sistema | Três camadas iguais nos seis espaços (encontrar, escolher, sustentar) e as regras de projeto. |
| 08 · Ilha quadrada Whey | Antes × depois nas faces A, B e C; 16 peças + ≈ 6,7 m de fita. |
| 09 · Ilha de nutrição esportiva | Lado longo A e cabeceira B; testeira em T; 15 peças + ≈ 3,8 m de rodapé. |
| 10 · Ponta de gôndola seca | Moldura do whey em pó e réguas padronizadas; 9 peças. |
| 11 · Ponta refrigerada Pense Zero | Antes (VT) × arte de referência; réguas por ocasião; 9 peças + 2 opcionais. |
| 12 · Gôndola fria Président | Hero. Premium × econômica no mesmo comparador; bandejas de polionda com cartão trocável; 49 peças. |
| 13 · Gôndola de sobremesas | Frontal e em ângulo; nomes soltos que o promotor move; 34 peças. |
| 14 · O kit completo | 132 peças, nenhum móvel novo. Uma coluna por espaço e a barra por tipo de peça (43 cartões e nomes trocáveis). |
| 15 · Dois níveis | A mesma arquitetura em econômica e premium (testeira Président nos dois acabamentos). Sem valores: entram depois da medição. |
| 16 · Próximos passos | Fechar o escopo, medir, validar com as marcas, prototipar, produzir e medir o resultado. |
| 17 · Contato | Vanessa Morelli e os canais da 75LAB. |

**Material de apoio** (fora da contagem, abre pelo índice `M`): decupagem do briefing, contexto de marca, concorrência e tensões, os sete insights, territórios conceituais, design/produção/tecnologia (decisão sobre LED), o que ainda precisa ser confirmado, entregáveis e mensuração, pré-mortem e fontes.

## As telas de espaço

Cada espaço tem um comparador antes × depois: arraste a alça, ou use **Antes** / **Depois** sobre a foto. As abas embaixo trocam a vista (faces da ilha, frontal ou em ângulo, premium ou econômica no Président). O botão de ampliar abre o depois e o antes em tamanho grande. **Pranchas técnicas** abre as pranchas do job (vistas, decupagem, materiais, engenharia) e cada peça abre sua arte. No Pense Zero o depois é a arte de referência, que não tem o mesmo enquadramento da VT: lá o comparador troca as duas imagens em vez de dividir.

## Navegação

`→` `↓` `PageDown` `espaço` avançam e `←` `↑` `PageUp` voltam. A seta no canto inferior direito avança (some na última tela). Também funcionam a roda do mouse, deslizar no tablet e os marcos do trilho de preço embaixo. `Home`/`End`, `M` índice, `N` notas da apresentadora, `F` tela cheia, `Esc` fecha. Deep link: `#president`, `#kit`, `#a-premortem`. Até 820 px de largura (e em tablet em retrato) a apresentação vira rolagem vertical. Com `prefers-reduced-motion`, as animações viram transições curtas.

QA: `?desktop` força o modo apresentação, `&ar=2.2` simula outra proporção, `?static` mostra cada tela no estado final e `?solo=whey` (no celular) mostra só uma tela.

## Direção de arte

Sinalização de loja, diferente dos decks anteriores (Galbani editorial, Copafer KV, Lactalis Food Service):
- fundo "luz de loja" `#F1F2EE`, grafite `#16181B` e o lima da 75LAB `#C8F065` só como etiqueta e destaque;
- Archivo variável: largo nos títulos, condensado nos rótulos e números;
- placa de corredor pendurada no topo com o número e a área da tela;
- trilho de preço como barra de progresso, com a etiqueta lima na tela atual;
- transição em três faixas (testeira, régua e base), a mesma lógica das peças;
- cada espaço na cor da própria marca: azul Parmalat Fit, azul-céu Pense Zero, vermelho Président e chocolate Batavo Sobremesas.

## Arquitetura

HTML, CSS e JavaScript puros, sem build e sem dependências (fonte do Google Fonts). O palco tem 900 de altura e acompanha a proporção da janela (1600 a 2100 de largura).

```
index.html            telas, material de apoio, notas, índice e lightbox
assets/css/deck.css   sistema visual, telas, celular e movimento reduzido
assets/js/deck.js     palco, trilho e placa, transições, comparador, índice, lightbox, celular
assets/img/<espaço>/  antes, depois, peças e pranchas de cada espaço (WebP)
assets/img/brand/     logos 75LAB
assets/img/og.jpg     imagem de compartilhamento
tools/assets.mjs      gera assets/img a partir do job (node tools/assets.mjs)
serve.ps1             servidor local (powershell -File serve.ps1 -Port 8792)
```

`tools/assets.mjs` lê as pastas de `Documents/75LAB/lactalis-davo-oratorio`, recorta os comparativos já alinhados (Président e o lado longo da ilha de nutrição) e grava WebP. Usa o `sharp` instalado em `galbani-kit-pdv-facas`. Depois de uma nova rodada no job, rode o script de novo.

## Pendências

- **Escopo:** quais cinco dos seis pontos entram, e a ilha Titanic.
- **Medidas:** a VT mistura mm e cm; as faces D da ilha quadrada e C e D da ilha de nutrição não foram fotografadas.
- **Claims e arquivos:** "Triplo Zero" ("0% adição de açúcar") e "21 g de proteína"; SKUs e famílias Batavo; lista de cartões Président; logos em vetor (Président, Batavo, Parmalat Fit) e packshots oficiais. As fotos de alimento das peças são ilustrativas.
- **Com o D'avó:** onde fica o cartaz "Monte seu combo" e se o material de Outubro Rosa pode sair da ponta Pense Zero.
- **Investimento:** a tela 15 mostra os dois níveis sem valores. Não há preços enviados para este job.

## Fontes

- 75LAB, *Planejamento Estratégico Lactalis no D'avó Oratório* (23/10/2026), com as fontes citadas lá: briefing e VT; lactalis.com.br, parmalat.com.br e batavo.com.br (consulta em 23/10/2026); ABRAS (22/01/2026); Kantar (24/07/2025).
- VT Lactalis | D'avó Oratório (fotos da loja).
- Fotomontagens, peças e pranchas: job 75LAB `lactalis-davo-oratorio` (28/10/2026).
