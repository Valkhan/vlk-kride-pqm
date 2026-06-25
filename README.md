# Pra que Mentir

Site oficial do manifesto cultural e legislativo **Pra que Mentir** — projeto de Kride Jr., músico independente de São Paulo.

## O Projeto

**Pra que Mentir** nasce em dezembro de 2024 a partir de uma versão transformativa da composição homônima de Noel Rosa e Vadico (1937). Gravada artesanalmente numa lavanderia, a faixa funde a melodia histórica com batidas de hip-hop e uma letra que é crônica social do Brasil contemporâneo — abordando alienação, abandono do Estado e a pergunta que atravessa tudo: *Pra que Mentir?*

O projeto tem duas bandeiras legislativas:

1. **Estatuto do Artista Trabalhador** — inspirado no modelo francês *L'intermittent du spectacle* (1936), que garante subsídio entre projetos e reconhece ensaio e pesquisa como trabalho efetivo.
2. **Redução do prazo autoral de 70 para 30 anos pós-morte** — questionamento constitucional ao monopólio corporativo que se esconde atrás dos herdeiros.

Com respaldo acadêmico da Revista Direito GV (Dr. Daniel Arbix, USP) e parcerias com InternetLab, Creative Commons Brasil e CEPI-FGV, o objetivo é protocolar um projeto de lei nas comissões do Senado Federal.

## Estrutura de Pastas

```text
vlk-kride-pqm/
├── index.html          — Landing Page
├── manifesto.html      — Manifesto completo (7 seções)
├── galeria.html        — Galeria de obras
├── css/
│   ├── tokens.less     — Variáveis CSS e LESS
│   ├── base.less       — Reset, body, botões, footer, utilidades
│   ├── animations.less — Todos os @keyframes
│   ├── nav.less        — Barra de navegação
│   ├── hero.less       — Hero da landing page + notas musicais
│   ├── sections.less   — Seções da landing (pills, quote, blog, channels)
│   ├── manifesto.less  — Layout e seções do manifesto
│   ├── galeria.less    — Galeria de obras (featured card, netflix row)
│   ├── responsive.less — Media queries mobile (max-width: 860px)
│   ├── main.less       — Importa todos os módulos (ponto de entrada LESS)
│   └── main.css        — CSS compilado (referenciado pelos HTMLs)
├── js/
│   ├── ambient.js      — Gerador de notas flutuantes (floatUp)
│   ├── hero-notes.js   — Documentação (pulse é 100% CSS)
│   ├── reveals.js      — Scroll reveal via IntersectionObserver
│   ├── manifesto-nav.js — Scroll-spy da navegação lateral do manifesto
│   └── gallery.js      — Filtros da galeria
└── README.md
```

## Como Editar o CSS

Os arquivos `.less` são o local correto para editar estilos. O `main.css` é o CSS compilado que os navegadores carregam.

### Instalando o compilador LESS

```bash
npm install -g less
```

### Compilando

Após editar qualquer arquivo `.less`, compile para atualizar o `main.css`:

```bash
lessc css/main.less css/main.css
```

Para watch automático durante o desenvolvimento:

```bash
lessc --watch css/main.less css/main.css
```

### Tokens de Design

Todas as cores e variáveis estão em `css/tokens.less`. Edite lá para mudanças globais de tema.

## Stack

- **HTML5** — semântico, sem frameworks
- **LESS/CSS3** — organizado em módulos, compilado para `main.css`
- **JavaScript vanilla** — sem dependências externas
- **Tipografia** — Georgia, serif (nativa do sistema, sem CDN)

## Créditos

- **Kride Jr.** — criação artística, letra, manifesto, voz, violão, contrabaixo
- **Fuskera** — produção musical
- **Chinela Voadora** — banda
- **Marcos Braga** — encomenda original
- **Valkhan Tech** — tecnologia e desenvolvimento
- **Noel Rosa / Vadico** — composição original "Pra que Mentir" (1937)

## Links

- Site: [praquementir.com.br](https://praquementir.com.br)
- Instagram: [@praquementiroficial](https://instagram.com/praquementiroficial)
- Referência acadêmica: Arbix, Daniel. *Direito Autoral e Acesso à Cultura*. Revista Direito GV, USP, 2008.
- Base legislativa: Lei 9.610/98 (Lei de Direitos Autorais), CF/88 art. 5º XXVII
