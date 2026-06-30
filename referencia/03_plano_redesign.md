# PLANO DE AÇÃO — REDESIGN VISUAL COMPLETO
## Pra que Mentir · Da Identidade das Faixas ao Site
### Priorizado por Impacto Visual / Esforço de Implementação

---

## VISÃO GERAL DA MUDANÇA

| Aspecto | Antes (Atual) | Depois (Novo) |
|---|---|---|
| **Background** | Preto `#08080C` | Papel Velho `#C4B49A` |
| **Texto** | Branco `#F2EDEA` | Tinta `#1A1208` |
| **Acento** | Rosa `#E8505B` | Vermelho Manifesto `#C41E1E` |
| **Tipografia base** | Georgia (serif limpa) | Lora + Anton (mista, colagem) |
| **Mood** | Dark / editorial minimalista | Retro-Futurista / Collage / Denúncia |
| **Layout** | Seções verticais com grid limpo | Faixas horizontais + seções verticais |
| **Imagens** | Nenhuma no atual | Collage de arquivo + IA + real |

---

## FASE 1 — FUNDAÇÃO (tokens + tipografia)
**Estimativa: 1-2 dias · Impacto: desbloqueador de tudo**

### 1.1 Atualizar `css/tokens.less`
Substituir toda a paleta de tokens:

```less
// NOVA PALETA — "A Lavanderia"
:root {
  // Backgrounds
  --bg:          #C4B49A;   // Papel Velho (era #08080C)
  --bg2:         #B8A88E;   // Areia Sombria (era #0F0F18)
  --bg3:         #D4C8B0;   // Papel Claro (era #1A0A12)
  --bg-dark:     #1A1208;   // Tinta de Carimbo (novo — para inversões)
  --bg-dark2:    #2C2416;   // Carvão Urbano (novo)

  // Acentos primários
  --red:         #C41E1E;   // Vermelho Manifesto (era #C0392B)
  --rose:        #C41E1E;   // Mantém a var para compatibilidade
  --rose-bright: #E02020;   // Vermelho em hover
  --amber:       #D4620A;   // Laranja Samba (era #F4A261)
  --gold:        #B8920A;   // Dourado Noel (novo)

  // Acentos secundários
  --violet:      #6B2FA0;   // Roxo Cyberpunk (era #7D3C98)
  --teal:        #1A6B3C;   // Verde Resistência (era #1ABC9C)
  --blue:        #1A3A6B;   // Azul Arquivo (novo)

  // Glitch / Cyberpunk (uso esparso, elementos de denúncia)
  --neon-pink:   #FF2D6B;
  --neon-cyan:   #00E5CC;
  --neon-yellow: #FFE100;

  // Tipografia
  --text:        #1A1208;   // Tinta de Carimbo (era #F2EDEA)
  --text-inv:    #F5F0E8;   // Texto invertido (era o padrão)
  --muted:       #6B5E4E;   // Marrom médio (era #988D8A)

  // Bordas e glows
  --border:      rgba(26,18,8,0.18);   // Tinta transparente
  --border-red:  rgba(196,30,30,0.3);
  --glow:        rgba(196,30,30,0.4);
  --paper-shadow: 3px 3px 0 rgba(0,0,0,0.12);
  --paper-noise:  url("data:image/svg+xml,..."); // grain SVG
}
```

### 1.2 Adicionar Google Fonts no `index.html`, `manifesto.html`, `galeria.html`
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Anton&family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Lora:ital,wght@0,400;0,600;1,400&family=Space+Mono:wght@400;700&family=Caveat:wght@400;600&display=swap" rel="stylesheet">
```

### 1.3 Atualizar `css/base.less` — body e seletores globais
```less
body {
  background: var(--bg);
  color: var(--text);
  font-family: 'Lora', Georgia, serif;  // Lora como base
  font-size: 16px;
  line-height: 1.8;
  overflow-x: hidden;
  // Grain de papel
  &::before {
    content: '';
    position: fixed; inset: 0; z-index: 0;
    pointer-events: none;
    background-image: url("noise.svg"); // grain sutil
    opacity: 0.04;
  }
}

// Títulos — Anton
h1, h2, .title-impact { font-family: 'Anton', sans-serif; text-transform: uppercase; }

// Subtítulos — Playfair
h3, h4, .title-narrative { font-family: 'Playfair Display', Georgia, serif; }

// Dados/datas — Space Mono
.mono, .date, .article-ref { font-family: 'Space Mono', monospace; font-size: 0.85em; letter-spacing: 0.15em; }

// Anotações pessoais — Caveat
.handwritten, .aside-kride { font-family: 'Caveat', cursive; }

// Elemento recortado (mixin)
.cutout {
  box-shadow: var(--paper-shadow);
  position: relative;
}
.cutout-rotate { transform: rotate(-1.5deg); }
.cutout-rotate-r { transform: rotate(1deg); }
```

---

## FASE 2 — HERO REDESIGN
**Estimativa: 1 dia · Impacto: primeira impressão**

### 2.1 Nova estrutura visual do Hero
O hero atual é fundo escuro com título gigante. O novo é uma **composição de faixa** com elementos colados.

```less
// css/hero.less — reescrita completa
.hero {
  position: relative; min-height: 100vh;
  background: var(--bg);
  overflow: hidden;
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  padding: 120px 80px 80px;
}

// Lado esquerdo: typografia
.hero-left { position: relative; z-index: 2; }

// Lado direito: collage
.hero-right {
  position: relative; height: 70vh;
  // Aqui entram as imagens coladas
}

// Título: Anton, tamanho extremo
.hero-title {
  font-family: 'Anton', sans-serif;
  font-size: clamp(64px, 10vw, 156px);
  text-transform: uppercase;
  line-height: 0.88;
  color: var(--text);
  letter-spacing: -0.02em;

  .word-pra { display: block; }
  .word-que { display: block; color: var(--red); }
  .word-mentir {
    display: block;
    // Efeito: palavra meio borrada/glitch
    text-shadow: 2px 0 0 var(--red), -2px 0 0 var(--neon-cyan);
    animation: glitchTitle 8s ease-in-out infinite;
    animation-delay: 3s;
  }
}

// Interrogação gigante flutuante
.hero-question {
  position: absolute; right: -40px; top: 50%;
  transform: translateY(-50%);
  font-family: 'Anton', sans-serif;
  font-size: 400px; line-height: 1;
  color: var(--text); opacity: 0.06;
  user-select: none; z-index: 0;
}

// Eyebrow: Space Mono
.hero-eyebrow {
  font-family: 'Space Mono', monospace;
  font-size: 11px; letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--red);
  margin-bottom: 32px;
}

// Sub: Lora italic
.hero-sub {
  font-family: 'Lora', serif;
  font-style: italic;
  font-size: 18px; line-height: 1.7;
  color: var(--muted);
  max-width: 480px;
  margin-top: 28px;
}

// Stripe no fundo: linha do tempo
.hero-stripe {
  position: absolute; bottom: 0; left: 0; width: 100%; height: 4px;
  background: repeating-linear-gradient(
    90deg,
    var(--red) 0, var(--red) 20px,
    transparent 20px, transparent 24px
  );
}
```

### 2.2 HTML do hero — adicionar collage container
```html
<section class="hero">
  <!-- Interrogação gigante de fundo -->
  <div class="hero-question" aria-hidden="true">?</div>

  <div class="hero-left">
    <div class="hero-eyebrow">
      <span class="mono">São Paulo · 1937 → 2026</span>
    </div>
    <h1 class="hero-title">
      <span class="word-pra">Pra</span>
      <span class="word-que">que</span>
      <span class="word-mentir">Mentir?</span>
    </h1>
    <p class="hero-sub">Uma faixa nascida do luto. Um manifesto que questiona quem lucra com os mortos, quem financia a alienação e o que o Brasil deve ao artista independente.</p>
    <div class="hero-actions">
      <a href="manifesto.html" class="btn-primary">Leia o Manifesto <span>§</span></a>
      <a href="#" class="btn-ghost">Ouça a Faixa ↗</a>
    </div>
  </div>

  <div class="hero-right" aria-hidden="true">
    <!-- Collage de imagens: Noel + Kride + gramofone -->
    <!-- Gerado por JS ou estático com classes .cutout -->
  </div>

  <div class="hero-stripe"></div>
</section>
```

---

## FASE 3 — SISTEMA DE FAIXAS (STRIPS)
**Estimativa: 2-3 dias · Impacto: maior diferencial visual**

Esta é a adição mais impactante: um componente de **faixa horizontal** que replica a linguagem das imagens do Instagram.

### 3.1 Novo componente `.story-strip`
```less
// css/strips.less — arquivo novo
.story-strip {
  width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  scroll-behavior: smooth;
  scroll-snap-type: x proximity;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  &::-webkit-scrollbar { display: none; }
  background: var(--bg);
  border-top: 2px solid var(--border);
  border-bottom: 2px solid var(--border);
}

.strip-track {
  display: flex;
  align-items: stretch;
  height: 200px; // altura da faixa
  width: max-content;
}

.strip-block {
  flex: 0 0 auto;
  width: 200px; // varia conforme conteúdo
  padding: 20px 24px;
  border-right: 1px solid var(--border);
  display: flex; flex-direction: column;
  justify-content: center;
  position: relative;
  scroll-snap-align: start;
  cursor: default;
  transition: background 0.2s;

  &:hover { background: rgba(196,30,30,0.04); }

  // Seta no canto
  &::after {
    content: '→';
    position: absolute; right: 12px; bottom: 12px;
    font-family: 'Space Mono', monospace;
    font-size: 16px; color: var(--red);
    opacity: 0.5;
  }
}

// Bloco com imagem de fundo (foto ou IA)
.strip-block.has-image {
  background-size: cover; background-position: center;
  filter: saturate(0.7) contrast(1.1);
  &::before { // overlay de papel
    content: '';
    position: absolute; inset: 0;
    background: rgba(196,180,154,0.55);
  }
}

// Texto flutuante sobre imagem
.strip-text {
  position: relative; z-index: 1;
  font-family: 'Anton', sans-serif;
  text-transform: uppercase;
  line-height: 1.1;
  color: var(--text);
  
  &.size-xl { font-size: 32px; }
  &.size-lg { font-size: 22px; }
  &.size-md { font-size: 16px; }
  &.size-sm { font-family: 'Lora', serif; font-size: 13px; font-style: italic; }
  &.size-xs { font-family: 'Space Mono', monospace; font-size: 11px; letter-spacing: 0.15em; }
  
  &.color-red { color: var(--red); }
  &.color-gold { color: var(--gold); }
  &.color-violet { color: var(--violet); }
}
```

### 3.2 Implementar 3 faixas na landing page

**Faixa 1 — "A Gênese"** (replicar faixa 1 das imagens)
Blocos: Noel Rosa | ? | 1937→2026 | Recriação | Novo estilo | MENTIRA | Lavanderia | Blue Note | Chinela Voadora | Videoclipe | E muitas histórias

**Faixa 2 — "O Processo"**
Blocos: Espirito Noel | Lapa SP | Na época | Fus-k Beats | Kride | Marcos Braga | Encomenda | Crítica ao sistema | De cabeça na pesquisa | Pra que Mentir | Papai Noel

**Faixa 3 — "O Manifesto"**
Blocos: 1937 amor | 2026 Constituição | Função Social | Sabor Justiça | Sabor Igualdade | Enganados | Pra que Mentir? | Qual a mentira de hoje? | A Entrega

---

## FASE 4 — SEÇÕES REDESIGN
**Estimativa: 2 dias · Impacto: coerência com nova identidade**

### 4.1 Pills Section → "Três Frentes" com visual de recorte
```less
.pill {
  background: var(--bg3);
  border: none;
  border-top: 4px solid var(--red);
  box-shadow: var(--paper-shadow);
  transform: rotate(-0.5deg);
  transition: transform 0.25s, box-shadow 0.25s;
  
  &:nth-child(2) { transform: rotate(0.3deg); border-top-color: var(--amber); }
  &:nth-child(3) { transform: rotate(-0.8deg); border-top-color: var(--violet); }
  
  &:hover {
    transform: rotate(0deg) translateY(-4px);
    box-shadow: 6px 6px 0 rgba(0,0,0,0.15);
  }
}

.pill-icon { font-size: 40px; font-family: 'Anton', sans-serif; color: var(--red); }
.pill-title { font-family: 'Anton', sans-serif; font-size: 24px; text-transform: uppercase; }
.pill-text { font-family: 'Lora', serif; color: var(--muted); }
```

### 4.2 Quote Strip → Fundo escuro com inversão
A única seção com fundo escuro — para criar respiro visual e contraste dramático.
```less
.quote-strip {
  background: var(--bg-dark);
  color: var(--text-inv);
  padding: 100px 80px;
  
  .quote-text {
    font-family: 'Playfair Display', serif;
    font-style: italic;
    font-size: clamp(24px, 3.5vw, 48px);
    color: var(--text-inv);
    span { color: var(--red); }
  }
  
  .quote-attr {
    font-family: 'Space Mono', monospace;
    font-size: 11px; letter-spacing: 0.25em;
    color: rgba(245,240,232,0.5);
  }
}
```

### 4.3 Blog Preview → Cards como "recortes de jornal"
```less
.post-card {
  background: var(--bg);
  border: 1px solid var(--border);
  border-bottom: 3px solid var(--red);
  box-shadow: var(--paper-shadow);
  transform: rotate(0.2deg);
  
  // Cabeçalho de jornal
  .post-cat {
    font-family: 'Space Mono', monospace;
    font-size: 10px; text-transform: uppercase; letter-spacing: 0.3em;
    color: var(--red); border-bottom: 1px solid var(--border);
    padding-bottom: 8px; margin-bottom: 16px;
  }
  
  .post-title { font-family: 'Playfair Display', serif; font-size: 18px; }
  .post-date { font-family: 'Space Mono', monospace; font-size: 11px; color: var(--muted); }
}
```

### 4.4 Channels Section → Cards com borda esquerda espessa
```less
.channel-card {
  background: var(--bg);
  border-left: 6px solid var(--red);
  padding: 32px 28px;
  box-shadow: var(--paper-shadow);
  
  .channel-name {
    font-family: 'Anton', sans-serif;
    font-size: 20px; text-transform: uppercase;
    color: var(--text);
    margin-bottom: 12px;
  }
}
```

---

## FASE 5 — NAV E FOOTER
**Estimativa: 0.5 dia · Impacto: consistência**

### 5.1 Nav — fundo papel com bordas
```less
nav {
  background: var(--bg);
  border-bottom: 2px solid var(--border);
  // Linha vermelha no topo (identidade)
  border-top: 3px solid var(--red);
  
  .nav-logo {
    font-family: 'Anton', sans-serif;
    font-size: 20px; text-transform: uppercase;
    color: var(--text);
    letter-spacing: 0.1em;
  }
  
  .nav-links a {
    font-family: 'Space Mono', monospace;
    font-size: 12px; letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--muted);
    &:hover { color: var(--red); }
  }
}
```

### 5.2 Footer — fundo escuro com créditos
```less
footer {
  background: var(--bg-dark);
  color: var(--text-inv);
  border-top: 3px solid var(--red);
  padding: 48px 80px;
  
  .footer-logo {
    font-family: 'Anton', sans-serif;
    font-size: 24px; color: var(--text-inv);
  }
  
  .footer-copy {
    font-family: 'Space Mono', monospace;
    font-size: 11px; color: rgba(245,240,232,0.4);
  }
}
```

---

## FASE 6 — MANIFESTO.HTML E GALERIA.HTML
**Estimativa: 1 dia · Impacto: profundidade editorial**

### 6.1 Manifesto — tipografia editorial expandida
- H2 em Playfair Display italic — como subtítulo de artigo acadêmico
- Citações em bloco com borda esquerda vermelha + fundo `bg3`
- Referências de artigo em Space Mono
- Números de artigos de lei como elementos gráficos grandes

### 6.2 Galeria — layout de mesa de montagem
- Grid irregular (masonry) simulando imagens espalhadas sobre mesa
- Cada foto com `.cutout` e rotação aleatória (-3° a +3°)
- Hover: a foto "se levanta" (translate -8px + shadow maior)

---

## FASE 7 — ASSETS VISUAIS
**Estimativa: 2-3 dias · Impacto: autenticidade da identidade**

### 7.1 SVG de grain de papel
Criar `assets/noise.svg` para texture overlay:
```svg
<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200">
  <filter id="noise">
    <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" stitchTiles="stitch"/>
    <feColorMatrix type="saturate" values="0"/>
  </filter>
  <rect width="200" height="200" filter="url(#noise)" opacity="0.08"/>
</svg>
```

### 7.2 SVG de linhas de dobra
Elemento decorativo para transições entre seções — linha horizontal com sombra de papel dobrado.

### 7.3 Cursor personalizado
```css
body { cursor: url('assets/cursor-pena.svg'), auto; }
a, button { cursor: url('assets/cursor-tesoura.svg'), pointer; }
```

---

## CRONOGRAMA RESUMIDO

| Fase | Descrição | Dias |
|---|---|---|
| 1 | Tokens + Tipografia | 1-2 |
| 2 | Hero Redesign | 1 |
| 3 | Sistema de Faixas | 2-3 |
| 4 | Seções | 2 |
| 5 | Nav + Footer | 0.5 |
| 6 | Manifesto + Galeria | 1 |
| 7 | Assets visuais | 2-3 |
| **Total** | | **9-12 dias** |

---

## DEPENDÊNCIAS E RISCOS

### Imagens
O maior gap entre o design atual e o novo é a **ausência de imagens**. O site atual não usa fotos. O novo design depende de:
- Fotos reais do Kride, Fus-k, banda, lavanderia
- Imagens históricas de Noel Rosa (domínio público)
- Ilustrações/personagens gerados por IA (Midjourney/DALL-E)
- Fotos de palco da Chinela Voadora

**Recomendação**: iniciar coleta de assets antes da Fase 2.

### Compilação LESS
O projeto usa LESS. Todas as alterações em `.less` requerem compilação para `css/main.css`. Manter o pipeline atual.

### Performance
O novo design é mais rico em imagens. Implementar:
- Lazy loading em todas as imagens das faixas
- WebP com fallback JPG
- Tamanhos responsivos com `srcset`

---

*Plano elaborado com base na análise das faixas visuais e no código-fonte atual do projeto · Junho 2026*
