# PRA QUE MENTIR — Documentação Técnica e Estética
### Site Oficial · Página 1 (Landing) · Especificação para continuidade em VS Code
**Versão do documento:** 1.0 · Junho 2026
**Arquivo entregue:** `index.html` (single-file, autossuficiente, zero build)

---

## 0. Como ler este documento

Este `.md` descreve **o que foi construído** no `index.html` e **todas as definições** (cores, tipografia, grid, animações, estrutura) para que o projeto seja continuado dentro do VS Code. Está organizado em três camadas:

1. **Identidade** (tokens estéticos — seções 2 a 6)
2. **Arquitetura do código** (estrutura, seções, JS — seções 7 a 9)
3. **Continuidade** (pontos de extensão, páginas 2 e 3, checklist — seções 10 a 13)

> Tudo deriva do `01_guia_da_marca.md` e do `02_estilo_e_manifesto.md`. Onde o guia deixou decisões em aberto, elas foram travadas com o cliente e estão marcadas como **[DECISÃO]**.

---

## 1. Visão geral do projeto

**Conceito central:** "Retro-Futurismo de Denúncia" — tensão entre 1937 e 2026, vinil e algoritmo, favela e Senado.

**Estrutura de 3 páginas:**

| Página | Arquivo | Status | Função |
|---|---|---|---|
| 1. Apresentação | `index.html` | ✅ Entregue | Hero + projeto + bandeiras + destaques de blog + canais |
| 2. Manifesto | `manifesto.html` | ⬜ A construir | Tese jurídica, bandeiras detalhadas, assinatura/CTA |
| 3. Blog | `blog.html` | ⬜ Placeholder | Será implementado no motor cPod Blog Manager |

Os links internos (`manifesto.html`, `blog.html`) **já estão cabeados** no `index.html`.

**Stack:** HTML5 + CSS puro + JavaScript vanilla. Sem framework, sem bundler, sem dependências externas além das fontes do Google Fonts. Isso é proposital — facilita portar para qualquer motor (incluindo o cPod) e mantém performance/SEO altos.

---

## 2. Paleta de cores (tokens)

Todas as cores vivem como CSS Custom Properties em `:root`. **Nunca** hardcode um hex no meio do CSS — sempre use a variável.

### 2.1 Primária — "A Lavanderia" (base, 80% do site)
```css
--papel:  #C4B49A;  /* Background principal — papel jornal envelhecido */
--areia:  #A89880;  /* Background secundário, hover, divisores */
--tinta:  #1A1208;  /* Tipografia principal, contraste máximo */
--carvao: #2C2416;  /* Tipografia secundária, sombras, bordas */
```

### 2.2 Acento — "A Tinta" (20%, um acento por seção)
```css
--vermelho: #C41E1E;  /* CTAs primários, denúncia, MENTIRA */
--laranja:  #D4620A;  /* Datas, números, anotações Caveat */
--roxo:     #6B2FA0;  /* Tecnologia, IA, algoritmo */
--dourado:  #B8920A;  /* 1937, Noel, referências históricas */
--verde:    #1A6B3C;  /* Esperança, manifesto legislativo (bandeira 01) */
--azul:     #1A3A6B;  /* Jurídico, documentos, vértice jurídico */
```

### 2.3 Cyberpunk — "O Glitch" (ruptura, nunca base)
```css
--neon:   #FF2D6B;  /* Glitch, elementos disruptivos */
--ciano:  #00E5CC;  /* Código, dados, Espírito Circulante, aura */
--alerta: #FFE100;  /* Avisos urgentes */
```

### 2.4 Regras de combinação (do guia da marca)
- **80/20:** 80% papel + tinta / 20% acento.
- **Um acento por seção.** Nunca misture vermelho + verde + roxo na mesma faixa.
- **Glitch é flash, não fundo.** O cyberpunk entra como ruptura pontual (ex: aura do Espírito, glitch do título, hover do Instagram).
- **[DECISÃO] Exceção controlada:** a seção **Canais** (`.canais-sec`) inverte para fundo `--tinta` com texto claro. Esse é o **único** fundo escuro do site — representa "o bunker", o lado digital. Não replicar esse padrão em outras seções (o guia proíbe fundo escuro como padrão).

---

## 3. Tipografia

Cinco famílias, cada uma com um papel narrativo. Todas Google Fonts (gratuitas), carregadas em um único `<link>` no `<head>`.

| Família | Papel | Onde aparece no código | Tamanho |
|---|---|---|---|
| **Anton** | O Grito (display) | `.hero h1`, `.h2`, `.brand`, `.strip-word`, `.btn`, `.num` | 13px–200px, sempre UPPERCASE |
| **Playfair Display** | A Crônica (subtítulo narrativo) | `.h2 .ital`, `.hero-lead`, `.post h3`, `.cta-sec p` | 17px–48px, italic intercalado |
| **Lora** | O Manifesto (corpo) | `body`, `.lead-p`, `.bandeira p` | 14px–19px, line-height 1.8 |
| **Space Mono** | O Sistema (dados/código) | `.kicker`, `.eyebrow`, `.cat`, `.tagref`, `.tm`, nav links | 10px–14px, letter-spacing 0.2em–0.3em |
| **Caveat** | O Humano (manuscrito) | `.aside-note`, `.spirit-tag` | 19px–26px, sempre em acento, nunca preto puro |

### 3.1 Hierarquia aplicada
```
H1  Anton  clamp(58px,14vw,200px)   line-height .82  — o título que grita
H2  Anton  clamp(34px,6vw,72px)     line-height .92  — chapéu de seção
H3  Playfair 700  21px                                — títulos de card/post
Body Lora  clamp(16px,2vw,19px)     line-height 1.8  — o manifesto
Eyebrow Space Mono 12px  letter-spacing .3em UPPER   — eyebrow/dados
Aside Caveat clamp(19px,2.4vw,26px)                  — o humano entre os dados
```

### 3.2 Regra de tom (copy)
- Títulos **sem ponto final**, declarativos.
- CTAs imperativos: "Leia", "Assine", "Entenda".
- Anotações Caveat em primeira pessoa, informal.
- **Usar:** Manifesto, Recorte, Resgate, Lavanderia, Denúncia, Bunker, Transformativo.
- **Evitar:** Plataforma, Produto, Usuário, Conteúdo, Engajamento, Viral, Monetização.

---

## 4. Grid e responsividade

```css
--max: 1440px;   /* container máximo */
```

| Breakpoint | Comportamento |
|---|---|
| **Desktop ≥1200px** | Container 1440px, margens laterais `clamp(...,80px)`, faixas full-bleed |
| **Tablet 768–1199px** | Padding lateral reduz, grids de 3→2 colunas |
| **Mobile <768px** | Tudo empilha em coluna única, tipografia reduz via `clamp()` |

**Breakpoints reais usados no CSS:** 900px, 880px, 860px, 760px, 600px, 460px (cada grid tem o seu colapso). Espaçamento de seção é fluido: `padding: clamp(64px,9vw,120px) clamp(18px,5vw,80px)`.

> **Atenção (lição do guia de design):** as classes de seção usam nomes específicos (`.projeto`, `.bandeiras`, `.canais`) para evitar conflito de especificidade CSS em paddings/margins. Mantenha esse padrão — não crie uma `.section` genérica que sobrescreva paddings de blocos internos.

---

## 5. Elementos-assinatura (a memória visual)

Estes são os três elementos que tornam o site reconhecível. **[DECISÃO]** do cliente: gastar a ousadia aqui.

### 5.1 As Tiras (marca registrada) — três modos simultâneos
1. **Divisores full-bleed** (`.faixa-divider`): faixas horizontais entre seções, com furos de filme (`::before`/`::after` em `repeating-linear-gradient`) e palavras rolando.
2. **Fundo parallax** (`data-parallax` nas camadas do hero).
3. **Sobreposição diagonal** (`.diag-strip.diag-1` / `.diag-2`): duas tiras cruzadas no hero, inclinadas −7° e +5°, rolando em direções opostas. **Esta é a terceira opção pedida pelo cliente** e é a assinatura mais forte.

As palavras dentro das tiras (`.strip-word`) são recortes tipográficos das próprias faixas originais: `1937`, `MENTIRA`, `?`, `NOEL ROSA`, `70 → 30`, `§ FUNÇÃO SOCIAL`, etc.

### 5.2 O Espírito Circulante de Noel — SVG inline
- Figura branca incandescente sentada no banquinho com violão, recriada **inteiramente em SVG** (não depende do arquivo de imagem).
- Aura ciano com `radialGradient #halo` + animação `pulse`; corpo flutua com `float`.
- **Marca registrada de Kride Jr** — creditada no rodapé (`.tm`).
- Localização no código: `<figure class="spirit-wrap">` dentro do `.hero-grid`.

### 5.3 Glitch 1937 ↔ 2026
- Aplicado ao título via `.glitch::before` (ciano, `clip-path` superior) e `.glitch::after` (neon, `clip-path` inferior), com keyframes `gl1`/`gl2` disparando em ~92% do ciclo (flash raro, não contínuo).
- Requer atributo `data-text="..."` igual ao conteúdo do elemento.

---

## 6. Motion design (especificação de animações)

| Animação | Seletor / keyframe | Duração | Função |
|---|---|---|---|
| Grão de papel | `body::before` / `@keyframes grain` | 8s steps(6) | Textura viva contínua |
| Rolagem das tiras | `.strip-run` / `@keyframes run` | 38–52s linear | Timeline cinematográfica |
| Glitch do título | `gl1` / `gl2` | 4.2s / 3.4s | Tensão 1937↔2026 |
| Flutuação do Espírito | `.spirit-svg` / `float` | 7s ease-in-out | Presença fantasmagórica |
| Pulso da aura | `.aura` / `pulse` | 4s | Vida espiritual |
| Cue de scroll | `.scroll-cue .line` / `cue` | 1.8s | Convite a rolar |
| Parallax | JS `requestAnimationFrame` | ligado ao scroll | Profundidade de camadas |
| Reveal de seções | JS `IntersectionObserver` + `.reveal.in` | 0.8s | Entrada escalonada |
| Recortes aleatórios | JS `place()` + drift senoidal | contínuo | Aleatoriedade dos elementos |

**Regra inviolável:** tudo é desligado dentro de `@media (prefers-reduced-motion: reduce)` (no CSS) **e** no JS (o script faz `return` antes de parallax/recortes se o usuário pedir menos movimento). Mantenha isso em qualquer animação nova.

---

## 7. Estrutura do `index.html` (mapa de seções)

Ordem de cima para baixo. Cada seção tem um `id` para ancoragem e navegação.

```
<head>
  ├─ Meta SEO (description, keywords, robots, canonical)
  ├─ Open Graph + Twitter Card
  ├─ 3× JSON-LD (Organization, MusicComposition, FAQPage)   ← GEO
  ├─ Google Fonts (1 link)
  └─ <style> … tokens + todo o CSS …

<body>
  ├─ <nav class="nav">                    Navegação fixa + CTA Manifesto
  ├─ <header class="hero" id="topo">       HERÓI
  │   ├─ .hero-bg-layer (manchas, parallax)
  │   ├─ .mentira-ghost (MENTIRA gigante vermelha)
  │   ├─ .diag-strip ×2 (tiras diagonais)
  │   ├─ .hero-inner (kicker, h1 com glitch, lead, CTAs)
  │   ├─ .spirit-wrap (Espírito Circulante SVG)
  │   └─ .scroll-cue
  ├─ .faixa-divider                        Divisor de tira #1
  ├─ <section id="projeto">                O PROJETO (texto + colagem)
  ├─ .faixa-divider.alt                    Divisor de tira #2
  ├─ <section id="bandeiras">              AS BANDEIRAS (01/02 + triângulo)
  ├─ <section id="blog">                   DESTAQUES DO BLOG (3 cards)
  ├─ <section class="canais-sec" id="canais">  CANAIS OFICIAIS (fundo escuro)
  ├─ <section class="cta-sec">             CTA MANIFESTO (? gigante)
  └─ <footer>                              Rodapé + nota de marca registrada
```

### 7.1 Conteúdo de cada seção
- **Hero:** kicker "Música de 1937 · ecoa em 2026", título com glitch, lead sobre luto/recriação, dois CTAs, Espírito Circulante.
- **O Projeto:** narrativa da encomenda (dez/2024), lavanderia, direito transformativo. Colagem de cards 1937/2026/MENTIRA. Anotação Caveat: *"É muita coincidência pro meu gosto… vou seguir!"*
- **As Bandeiras:** card 01 (Estatuto do Artista, verde) + card 02 (70→30 anos, vermelho) + triângulo visual (Humano/Histórico/Jurídico).
- **Blog:** 3 posts (1 ativo + 2 "Em breve") apontando para `blog.html`.
- **Canais:** Instagram, YouTube, Substack, Site — cada um com hover colorido próprio.
- **CTA:** "Pra que mentir?" + meta de 20 milhões de assinaturas.

---

## 8. JavaScript (comportamentos)

Todo o JS está em um único `<script>` no fim do `<body>`, sem dependências. Três blocos:

1. **Reveal on scroll** — `IntersectionObserver` adiciona `.in` aos elementos `.reveal` quando entram na viewport (threshold 0.12). Aplica a todos independente de reduced-motion (só some o movimento, o conteúdo aparece).

2. **Parallax** — coleta `[data-parallax]`, calcula offset relativo ao centro da viewport e aplica `translate3d` via `requestAnimationFrame` no scroll (passivo). Velocidades atuais: hero-bg 0.15, mentira-ghost 0.06, tiras 0.10/0.14, espírito 0.08, colagem 0.05.

3. **Recortes aleatórios** — `place(text, isStamp)` cria spans `.scrap` com posição/rotação/tamanho aleatórios no hero, fade-in escalonado e drift senoidal contínuo. Arrays `bits[]` (palavras) e `stamps[]` (carimbos tipo "FAKE NEWS", "URGENTE").

> Os blocos 2 e 3 fazem `return` antecipado se `prefers-reduced-motion` estiver ativo.

---

## 9. SEO e GEO (implementado)

| Item | Onde | Observação |
|---|---|---|
| `<title>` + `meta description` | `<head>` | Descrição rica com palavras-chave do projeto |
| `meta keywords` / `author` / `robots` / `canonical` | `<head>` | Trocar URL canônica pelo domínio real |
| Open Graph + Twitter Card | `<head>` | **Falta:** criar e referenciar a OG Image 1200×630 (ver §10) |
| JSON-LD `Organization` | `<head>` | Inclui `sameAs` com redes — atualizar URLs reais |
| JSON-LD `MusicComposition` | `<head>` | Noel Rosa / Vadico, `isBasedOn` 1937 |
| JSON-LD `FAQPage` | `<head>` | 3 perguntas — alimenta respostas de IA generativa (GEO) |
| HTML semântico | todo o body | `<header> <nav> <section> <article> <footer>`, headings hierárquicos |
| `alt` / `aria-label` | SVG e elementos decorativos | Decorativos marcados `aria-hidden="true"` |

**GEO (Generative Engine Optimization):** o bloco `FAQPage` e a copy textual densa (parágrafos reais, não só visual) existem para que motores de IA citem o projeto com precisão. Ao escrever novas seções, mantenha sempre **texto factual em prosa** ao lado do visual — não deixe seção "só imagem".

---

## 10. Pontos de extensão (o que plugar no VS Code)

### 10.1 Trocar tiras CSS por imagens reais das faixas
No topo do `:root` existem três slots reservados:
```css
--faixa-1:none;
--faixa-2:none;
--faixa-3:none;
```
Para usar os PNGs originais como fundo de um divisor, defina a variável e aplique em `.faixa-divider`:
```css
:root{ --faixa-1:url("./assets/faixas/faixa-01.png"); }
.faixa-divider{ background-image:var(--faixa-1); background-size:cover; background-position:center; }
```
As tiras CSS atuais funcionam como **fallback estético** e referência de posicionamento.

### 10.2 OG Image
Criar `assets/og-image.jpg` (1200×630), fundo Papel Velho com grain, "Pra que Mentir?" em Anton, subtexto "Música de 1937. Ecoa em 2026." em Space Mono, silhueta Noel + Kride. Depois referenciar:
```html
<meta property="og:image" content="https://praquementir.com.br/assets/og-image.jpg">
```

### 10.3 Favicon
`?` em Anton Bold, `--vermelho` sobre `--papel`. Adicionar `<link rel="icon" ...>` no head.

### 10.4 URLs reais
Substituir todos os `https://praquementir.com.br/` e os handles de rede (`@praquementiroficial`, etc.) pelos definitivos.

---

## 11. Estrutura de arquivos sugerida (VS Code)

O `index.html` está hoje 100% inline (proposital, pra rodar em qualquer lugar). Ao migrar pro VS Code, sugiro **extrair** para manutenção:

```
pra-que-mentir/
├─ index.html              ← página 1 (extrair <style> e <script>)
├─ manifesto.html          ← página 2 (a construir)
├─ blog.html               ← página 3 (placeholder → cPod)
├─ css/
│  ├─ tokens.css           ← :root (cores, fontes, --max, --faixa-*)
│  ├─ base.css             ← reset, body, grão, nav, footer
│  ├─ hero.css             ← herói, tiras diagonais, glitch, espírito
│  ├─ sections.css         ← projeto, bandeiras, blog, canais, cta
│  └─ motion.css           ← keyframes + prefers-reduced-motion
├─ js/
│  └─ main.js              ← reveal + parallax + recortes
├─ assets/
│  ├─ faixas/              ← PNGs originais das tiras (marca registrada)
│  ├─ espirito-circulante.svg
│  └─ og-image.jpg
└─ DOCUMENTACAO_PROJETO.md ← este arquivo
```

> Se for direto pro cPod Blog Manager, mantenha `tokens.css` como fonte única de verdade da identidade — assim o blog herda a mesma marca sem duplicar hex.

---

## 12. Roadmap — páginas 2 e 3

### Página 2 — `manifesto.html` (a construir)
Herdar `tokens.css`, `base.css`, `motion.css`. Seções sugeridas:
1. Hero menor com `§` como símbolo dominante (em vez do `?`).
2. **A tese de Daniel Arbix** — 4 pilares: uso transformativo, anticomuns, assimetria das majoritárias, função social.
3. **As duas bandeiras** em profundidade (expandir os cards 01/02 da página 1).
4. **Referência francesa** — L'intermittent du spectacle, anexos VIII e X.
5. **Linha do tempo** da gênese (dez/2024 → manifesto).
6. **CTA de assinatura** + meta dos 20 milhões + nomes-alvo da MPB.
7. Institutos aliados (InternetLab, CC Brasil, CEPI-FGV).

### Página 3 — `blog.html` (placeholder)
Não é alvo agora — será implementado no **cPod Blog Manager**. Manter apenas o link e, se quiser, uma listagem estática provisória reaproveitando o componente `.post` da página 1.

---

## 13. Checklist de qualidade (já cumprido / a fazer)

**✅ Já cumprido**
- [x] Identidade 100% derivada do guia da marca (cores, 5 fontes, motion)
- [x] Três modos de tira (divisor + parallax + diagonal)
- [x] Glitch 1937↔2026 no título
- [x] Espírito Circulante em SVG, creditado a Kride Jr
- [x] Aleatoriedade dos recortes + parallax + animações contínuas
- [x] SEO (meta, OG, canonical) + GEO (3× JSON-LD, FAQ)
- [x] Acessibilidade: foco visível, `prefers-reduced-motion`, `aria-label`, alt
- [x] Responsivo até mobile (tiras viram empilhamento vertical via clamp)

**⬜ A fazer na continuidade**
- [ ] Gerar e referenciar OG Image 1200×630
- [ ] Favicon `?`
- [ ] Plugar PNGs reais das faixas via `--faixa-*` (opcional — CSS já cobre)
- [ ] Substituir URLs/handles definitivos
- [ ] Construir `manifesto.html`
- [ ] Definir integração do `blog.html` com o cPod

---

## 14. Nota de propriedade intelectual

As **faixas visuais** e o personagem **"Espírito Circulante de Noel"** são marca registrada e obra de **Kride Jr**, autor da recriação. A composição "Pra que Mentir" (Noel Rosa / Vadico, 1937) é utilizada sob o argumento de **uso transformativo** amparado na função social da obra (CF art. 5º, XXVII e XXVIII), conforme a tese de Daniel Arbix. Esta nota está reproduzida no rodapé do `index.html` (`.tm`).

---

*Documento gerado para continuidade do desenvolvimento · Projeto Pra que Mentir · Junho 2026*