// Opção upgrade: os materiais de cada espaço, com a quantidade.
// cols: colunas da grade; s: quantas colunas o quadro ocupa; w e h: a proporção do recorte;
// c: o recorte da imagem, [centro x, centro y, largura em px].
// As quantidades são estimadas pela visita técnica, pelo kit atual e pelas imagens; fecham na medição.
export const UP = [
  {
    id: 'whey', cols: 4, img: '1-whey', antes: 'whey/a-antes', ar: 0.5625, n: '01', marca: 'Parmalat Fit', espaco: 'Ilha quadrada Whey', nome: 'Letras de luz', bc: '#1E3E94',
    sum: '1 letreiro retroiluminado, 4 faces em ACM e LED nos cantos, nas prateleiras e na base.',
    valida: 'Ponto de energia, que a ilha não tem hoje, e a altura do letreiro.',
    nota: 'O logo vira letras de luz e o móvel ganha revestimento em ACM. LED em frente e fundo, nas quatro prateleiras de cada face. A ilha não tem ponto de energia na visita técnica, e o letreiro é mais alto que a testeira atual: as duas coisas precisam ser validadas.',
    linhas: [
      [
        { n: 1, nome: 'Letreiro retroiluminado', qtd: '1 un.', mat: 'Letras-caixa de metal com LED, dupla face', w: 19, h: 10, c: [472, 180, 480] },
        { n: 2, nome: 'Barra com a frase', qtd: '1 un.', mat: 'Alumínio escovado', w: 39, h: 10, c: [465, 335, 700], s: 2 },
        { n: 3, nome: 'Revestimento das faces', qtd: '4 faces', mat: 'ACM azul-marinho escovado', w: 19, h: 10, c: [270, 830, 340] },
      ],
      [
        { n: 4, nome: 'Linha de LED nos cantos', qtd: '4 un.', mat: 'Perfil embutido, LED branco', w: 19, h: 10, c: [165, 1300, 260] },
        { n: 5, nome: 'LED nas prateleiras', qtd: '8 un.', mat: 'Perfil de alumínio, LED branco', w: 19, h: 10, c: [420, 1130, 520] },
        { n: 6, nome: 'Rodapé com logo', qtd: '4 un.', mat: 'ACM azul-marinho', w: 19, h: 10, c: [470, 1455, 460] },
        { n: 7, nome: 'Luz rente ao chão', qtd: '1 contorno', mat: 'Fita de LED sob a base', w: 19, h: 10, c: [260, 1560, 420] },
      ],
    ],
    como: [
      { pg: 'retro', t: 'Retroiluminado: a luz fica atrás da letra', pn: 'Peça 1' },
      { pg: 'perfil', t: 'Perfil de LED: linha fina e embutida', pn: 'Peças 4, 5 e 7' },
      { pg: 'acm', t: 'ACM: reveste sem trocar o móvel', pn: 'Peças 3 e 6' },
    ],
  },
  {
    id: 'nutricao', cols: 4, img: '2-nutricao', antes: 'nutricao/a-antes', ar: 1.0707, n: '02', marca: 'Parmalat Fit', espaco: 'Ilha de nutrição esportiva', nome: 'Caixa de luz em tecido', bc: '#1E3E94',
    sum: '1 caixa de luz em tecido, 9 trilhos com LED e 6 nichos iluminados na base.',
    valida: 'Ponto de energia, que a ilha não tem hoje, e a base, que é uma estrutura nova.',
    nota: 'A imagem mostra o lado longo. As quantidades contam os dois lados longos e a cabeceira, como no kit atual: 9 trilhos, sendo 6 dos lados e 3 da cabeceira. Os nichos são uma estrutura nova na base, o que precisa ser validado com o D\'avó.',
    linhas: [
      [
        { n: 1, nome: 'Caixa de luz em tecido', qtd: '1 un.', mat: 'Tecido tensionado impresso, moldura de alumínio e LED, dupla face', w: 34, h: 10, c: [664, 175, 1120], s: 2 },
        { n: 2, nome: 'Trilho com linha de LED', qtd: '9 un.', mat: 'Perfil azul-marinho, LED branco', w: 34, h: 10, c: [540, 490, 620], s: 2 },
      ],
      [
        { n: 3, nome: 'LED sob as prateleiras', qtd: '9 un.', mat: 'Fita escondida, LED branco neutro', w: 16, h: 10, c: [300, 600, 420] },
        { n: 4, nome: 'Base em ACM', qtd: '2 lados', mat: 'ACM azul-marinho sobre estrutura nova', w: 16, h: 10, c: [640, 980, 900] },
        { n: 5, nome: 'Nicho iluminado', qtd: '6 un.', mat: '3 por lado, com LED interno', w: 16, h: 10, c: [646, 1005, 330] },
        { n: 6, nome: 'Logo da base', qtd: '4 un.', mat: 'Recorte branco', w: 16, h: 10, c: [430, 1005, 190] },
      ],
    ],
    como: [
      { pg: 'tecido', t: 'Tecido tensionado: a luz sai por igual, sem emenda', pn: 'Peça 1' },
      { pg: 'perfil', t: 'LED no trilho e embaixo da prateleira', pn: 'Peças 2 e 3' },
      { pg: 'nicho', t: 'Nicho: o produto em vitrine iluminada', pn: 'Peças 4, 5 e 6' },
    ],
  },
  {
    id: 'seca', cols: 6, img: '3-seca', antes: 'seca/antes', ar: 0.5625, n: '03', marca: 'Parmalat Fit', espaco: 'Ponta de gôndola seca', nome: 'Fundo de luz', bc: '#1E3E94',
    sum: '1 cabeceira com letras acesas, 2 painéis retroiluminados e 7 trilhos com LED.',
    valida: 'Ponto de energia na gôndola, que ainda precisa ser confirmado.',
    nota: 'O painel de luz fica só atrás dos pacotes Parmalat Fit. Os 7 trilhos são os mesmos da contagem do kit atual. Na imagem, eles passam também pelo trecho de outras marcas: isso precisa da autorização do D\'avó.',
    linhas: [
      [
        { n: 1, nome: 'Cabeceira', qtd: '1 un.', mat: 'ACM azul-marinho escovado', w: 39, h: 10, c: [470, 290, 900], s: 3 },
        { n: 2, nome: 'Letras-caixa acesas', qtd: '1 conjunto', mat: 'Logo e “Whey 21 g de proteína”, com LED', w: 39, h: 10, c: [620, 290, 560], s: 3 },
      ],
      [
        { n: 3, nome: 'Painel retroiluminado', qtd: '2 un.', mat: 'Um por prateleira de whey em pó, com LED', w: 26, h: 10, c: [360, 450, 660], s: 2 },
        { n: 4, nome: 'Trilho com linha de LED', qtd: '7 un.', mat: 'Perfil azul-marinho, LED branco', w: 26, h: 10, c: [330, 760, 600], s: 2 },
        { n: 5, nome: 'Perfil vertical de LED', qtd: '2 un.', mat: 'Um em cada ponta', w: 26, h: 10, c: [130, 700, 260], s: 2 },
      ],
    ],
    como: [
      { pg: 'painel', t: 'Painel de luz: destaca o contorno dos pacotes', pn: 'Peça 3' },
      { pg: 'letras', t: 'Letras-caixa: letras em volume, acesas', pn: 'Peça 2' },
      { pg: 'perfil', t: 'LED no trilho e nas pontas da gôndola', pn: 'Peças 4 e 5' },
    ],
  },
  {
    id: 'pensezero', cols: 2, img: '4-pensezero', antes: 'pensezero/antes', ar: 1.7778, n: '04', marca: 'Batavo Pense Zero', espaco: 'Ponta refrigerada', nome: 'Letreiro de neon', bc: '#0B7FB4',
    sum: '1 letreiro de neon na sanefa, 2 colunas de LED e 7 trilhos novos.',
    valida: 'Aval técnico do D\'avó e do equipamento. A luz fica por fora da área refrigerada.',
    nota: 'Nenhuma luz nova entra no refrigerador: o neon fica na sanefa e as colunas, do lado de fora. Dos 7 trilhos, 6 são os das prateleiras, como no kit atual, e 1 é o do poço.',
    linhas: [
      [
        { n: 1, nome: 'Logo em neon', qtd: '1 un.', mat: 'Neon flexível branco e magenta', w: 24, h: 10, c: [745, 68, 480] },
        { n: 2, nome: '“Triplo Zero”', qtd: '1 un.', mat: 'Letras brancas', w: 24, h: 10, c: [1190, 90, 360] },
        { n: 3, nome: 'Sanefa revestida', qtd: '1 un.', mat: 'ACM azul-céu', w: 24, h: 10, c: [280, 94, 420] },
      ],
      [
        { n: 4, nome: 'Coluna de LED', qtd: '2 un.', mat: 'Perfil branco, por fora do refrigerador', w: 24, h: 10, c: [1465, 420, 300] },
        { n: 5, nome: 'Trilho “Para beber”', qtd: '6 un.', mat: 'Branco com filete azul-céu', w: 24, h: 10, c: [530, 380, 420] },
        { n: 6, nome: 'Trilho “De colher”', qtd: '1 un.', mat: 'Branco com filete azul-céu', w: 24, h: 10, c: [950, 668, 420] },
      ],
    ],
    como: [
      { pg: 'neon', t: 'Neon flexível: um traço contínuo de luz', pn: 'Peça 1' },
      { pg: 'coluna', t: 'Coluna de LED, por fora do refrigerador', pn: 'Peça 4' },
      { pg: 'trilho', t: 'Trilho com o nome da escolha', pn: 'Peças 5 e 6' },
    ],
  },
  {
    id: 'president', cols: 3, img: '5-president', antes: 'president/antes', ar: 0.6077, n: '05', marca: 'Président', espaco: 'Gôndola fria de queijos', nome: 'Queijaria', bc: '#BE0F2D',
    sum: '1 frontão amadeirado com brasão de latão, 1 moldura com LED e 12 bandejas.',
    valida: 'Aval técnico e a resistência dos materiais ao frio e à umidade.',
    nota: 'O letreiro vermelho do D\'avó fica igual e nada entra acima dele. A moldura corre por fora da área refrigerada. São 4 prateleiras com 3 famílias cada: 12 bandejas e 12 frentes.',
    linhas: [
      [
        { n: 1, nome: 'Frontão', qtd: '1 un.', mat: 'ACM amadeirado escuro', w: 23, h: 10, c: [560, 345, 760] },
        { n: 2, nome: 'Brasão e logo', qtd: '1 un.', mat: 'Latão, com halo de LED quente', w: 23, h: 10, c: [262, 338, 420] },
        { n: 3, nome: 'Frase', qtd: '1 conjunto', mat: 'Letras finas de latão', w: 23, h: 10, c: [645, 340, 520] },
      ],
      [
        { n: 4, nome: 'Moldura com LED', qtd: '1 conjunto', mat: 'Perfil amadeirado, LED quente', w: 23, h: 10, c: [120, 300, 240] },
        { n: 5, nome: 'Bandeja amadeirada', qtd: '12 un.', mat: 'Baixa, com acabamento amadeirado', w: 23, h: 10, c: [475, 505, 520] },
        { n: 6, nome: 'Frente com o nome', qtd: '12 un.', mat: 'Preta fosca com latão: 4 Muçarela, 4 Especiais e 4 Prato', w: 23, h: 10, c: [230, 558, 320] },
      ],
    ],
    como: [
      { pg: 'halo', t: 'Halo: luz quente atrás do brasão de latão', pn: 'Peça 2' },
      { pg: 'moldura', t: 'Moldura com LED, por fora da área refrigerada', pn: 'Peça 4' },
      { pg: 'bandejam', t: 'Bandeja amadeirada, com o nome em latão', pn: 'Peças 5 e 6' },
    ],
  },
  {
    id: 'sobremesas', cols: 4, img: '6-sobremesas', antes: 'sobremesas/f-antes', ar: 0.5625, n: '06', marca: 'Batavo Sobremesas', espaco: 'Gôndola de sobremesas', nome: 'Confeitaria', bc: '#4E2C1B',
    sum: '1 frontão com neon e lâmpadas, 1 lambrequim, 1 moldura com LED e 5 trilhos.',
    valida: 'Aval técnico e o lambrequim junto da cortina de ar do refrigerador.',
    nota: 'A referência é a vitrine de confeitaria. Luz original, saída de ar e grade de retorno continuam livres, e nenhuma luz nova entra no refrigerador. O lambrequim precisa de um teste com a cortina de ar.',
    linhas: [
      [
        { n: 1, nome: 'Frontão', qtd: '1 un.', mat: 'ACM marrom-chocolate', w: 39, h: 10, c: [470, 240, 940], s: 2 },
        { n: 2, nome: 'Frase em neon', qtd: '1 un.', mat: 'Neon flexível creme', w: 19, h: 10, c: [668, 245, 500] },
      ],
      [
        { n: 3, nome: 'Logo Batavo', qtd: '1 un.', mat: 'Aplicado no frontão', w: 19, h: 10, c: [225, 242, 360] },
        { n: 4, nome: 'Contorno de lâmpadas', qtd: '1 conjunto', mat: 'Lâmpadas de LED, branco quente', w: 19, h: 10, c: [120, 240, 240] },
        { n: 5, nome: 'Lambrequim', qtd: '1 un.', mat: 'Creme e caramelo, abaixo do frontão', w: 19, h: 10, c: [470, 350, 500] },
      ],
      [
        { n: 6, nome: 'Moldura com LED', qtd: '1 conjunto', mat: 'Perfil marrom, LED âmbar', w: 19, h: 10, c: [150, 640, 300] },
        { n: 7, nome: 'Trilho creme', qtd: '5 un.', mat: 'Contínuo, sem texto', w: 19, h: 10, c: [330, 540, 460] },
      ],
    ],
    como: [
      { pg: 'neon', t: 'Neon flexível: a frase em letra cursiva', pn: 'Peça 2' },
      { pg: 'lampadas', t: 'Lâmpadas de LED em volta do frontão', pn: 'Peça 4' },
      { pg: 'lambrequim', t: 'Lambrequim: um toldo curto de confeitaria', pn: 'Peça 5' },
    ],
  },
];
