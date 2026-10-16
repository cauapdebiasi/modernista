# Modernista

Design system de meados do século, extraído do Planejador Financeiro: blocos de cor chapada, contorno de tinta de 3px, sombra dura deslocada, canto reto e formas geométricas. Tem três paletas sorteadas a cada abertura, números que rolam como odômetro, barras que enchem e sons sintetizados.

Abra `docs/index.html` no navegador pra ver tudo funcionando: as paletas, os tokens, os botões, os números e barras, as listas, os campos, os diálogos e os sons.

## Princípios

- **Tinta e chapado.** Toda superfície tem borda `3px solid var(--ink)`. Nada de degradê nem desfoque: as sombras são deslocadas e duras (`--sh-1` a `--sh-4`).
- **Canto reto.** `--r-*` vale 0. O círculo aparece só onde a forma tem significado: badges, ícones de cartão e a faixa de confete do cabeçalho.
- **Cor carrega forma.** Cada cor de badge tem uma forma: azul é quadrado, laranja é círculo, rosa é arco, violeta é quadrado e verde é folha.
- **Apertar afunda.** Os botões primários descem 3px e perdem a sombra ao toque, como uma tecla.
- **Movimento com propósito.** A entrada usa `pl-rise`/`pl-in` e a saída usa `.closing`. Números e barras levam os mesmos 3s na mesma curva e terminam juntos. Tudo respeita `prefers-reduced-motion`.
- **Som discreto.** Um som por ação (sucesso, erro, aviso, clique) e uma escadinha pentatônica na contagem, tudo em Web Audio, sem arquivos.

## Estrutura

```
css/
  modernista.css   ponto de entrada: fontes, reset, tokens e componentes
  reset.css        reset mínimo (faz o papel do preflight do Tailwind)
  tokens.css       três paletas + tokens derivados
  components.css   todas as regras, na ordem original da cascata
tokens/tokens.json os mesmos tokens em JSON
src/               componentes React (TypeScript)
  components/      Switch, MoneyInput, JackpotNumber, Dialogs, ...
  sound/           sounds.ts, SoundEffects, pushToast
  scripts/init.ts  scripts de início (paleta e ocultar valores)
assets/
  cards/           logos Nubank e Mercado Pago (usados pelo CSS)
  icons/           ícone do app (192, 512, apple-touch)
docs/index.html    documentação com exemplos ao vivo
```

> `components.css` mantém a ordem do app original: primeiro a base, depois os componentes, depois a camada "Meados do século", que sobrescreve parte deles, e por fim os acréscimos (saída dos modais, prévia, recados, rampa). **Não reordene**, senão a camada do tema deixa de vencer.

## Instalação

O repositório é público. Instale direto do GitHub:

```bash
npm install github:cauapdebiasi/modernista
```

Dependências de par: `react@19`, `lucide-react@1` e `sonner@2` (a última só se usar `pushToast`).

### CSS

Num projeto sem Tailwind, importe o pacote completo:

```css
@import "modernista/css/modernista.css";
```

Com Tailwind v4 (`@import "tailwindcss"`), carregue as fontes por `<link>` e importe só os tokens e os componentes; o preflight do Tailwind já faz o reset:

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Serif+Display&display=swap" />
```

```css
@import "tailwindcss";
@import "modernista/css/tokens.css";
@import "modernista/css/components.css";
```

Os ícones de cartão referenciam `../assets/cards/*.svg` a partir do CSS. Se o seu bundler não resolver esse caminho, copie `assets/cards/` pra `public/cards/` e troque o `url()`.

### Scripts de início (Next.js App Router)

```tsx
import { Toaster } from "sonner";
import { HIDE_MONEY_INIT_SCRIPT, paletteInitScript } from "modernista/init";
import { SoundEffects } from "modernista";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body>
        <script dangerouslySetInnerHTML={{ __html: HIDE_MONEY_INIT_SCRIPT }} />
        <script dangerouslySetInnerHTML={{ __html: paletteInitScript() }} />
        {children}
        <SoundEffects />
        <Toaster position="top-center" theme="light" duration={3000} richColors expand offset={16} mobileOffset={16} />
      </body>
    </html>
  );
}
```

`paletteInitScript()` sorteia uma paleta sem repetir a anterior. Use `paletteInitScript("oceano")` pra fixar uma.

Importe os scripts de `modernista/init`, que não é client, e não do índice. O pacote publica TypeScript sem build, então no Next.js liste-o em `next.config.ts`: `transpilePackages: ["modernista"]`.

Se o app já guardava preferências com outros nomes de chave, `migrateStorageKeysScript({ "pf-sound": "modernista:sound", "pf-hide-money": "modernista:hide-money", "pf-palette": "modernista:palette" })` devolve um script que copia cada valor antigo pra chave nova, só quando a nova ainda não existe. Coloque-o antes dos outros scripts de início.

## Tokens

As paletas definem só as cores-base. O resto deriva delas.

| Token | Esmeralda | Oceano | Turquesa | Papel |
| --- | --- | --- | --- | --- |
| `--ink` | `#0b2b26` | `#0a1f44` | `#062b33` | texto, bordas, sombras |
| `--teal` | `#08a06a` | `#1f6bff` | `#0aa6a0` | cor principal (`--primary`) |
| `--teal-deep` | `#067a50` | `#1048c4` | `#07766f` | hover, sucesso |
| `--mustard` | `#ffc93c` | `#ffc53d` | `#ff9f1c` | destaque quente, foco |
| `--tomato` | `#ff5a4e` | `#ff4d73` | `#ee3f8a` | alerta |
| `--tomato-deep` | `#d63a2e` | `#d12a52` | `#c42670` | perigo (`--danger`) |
| `--plum` | `#3a2fd6` | `#0ba89b` | `#2b59ff` | terceiro destaque |
| `--bg` | `#e6f6ee` | `#e7efff` | `#e3f6f4` | fundo da página |
| `--surface` | `#fbfffd` | `#fbfcff` | `#fafffe` | cartões |
| `--ramp-1..4` | verde → amarelo → laranja → vermelho | | | estágios das barras |

Também derivados: `--sh-1..4` (sombras de 3, 4, 5 e 8px), `--dur-1/2/3` (120, 200 e 300ms), `--ease-out` `cubic-bezier(0.16, 1, 0.3, 1)`, `--ease-io`, `--ease-spring` e `--font-display` (DM Serif Display). A lista completa está em `css/tokens.css` e `tokens/tokens.json`.

## Componentes React

```tsx
import { GaugeCard, JackpotNumber, MoneyMask, ToneCard, pushToast } from "modernista";
import { CreditCard, Lightbulb } from "lucide-react";
```

| Componente | Para quê |
| --- | --- |
| `JackpotNumber` | Valor formatado em que cada dígito rola como odômetro. `direction="down"` pra negativo e `sound` toca a escadinha. Só anima quando a `signature` muda pro mesmo `slot`. |
| `ProgressFill`, `rampStage` | Barra que enche em 3s; `rampStage(pct, over)` devolve o estágio 1–4 da cor. |
| `GaugeCard` | Medidor completo: badge, nome, barra com rampa, valores e linha "Sobram / Estourou". |
| `StatMini` | Número pequeno de destaque, com botão (i) opcional. Use em pares dentro de `.two-col`. |
| `ToneCard` | Recado com tom (`dica`, `elogio`, `sugestao`, `alerta`, `curiosidade`) e esqueleto (`loading`). |
| `Badge` | Ícone na forma da cor. |
| `Section`, `RowList` | Seção com contorno e lista "badge · rótulo · valor". |
| `ListCard`, `SourceTag` | Item de lista em cartão, com etiqueta de origem e `Switch` opcional. |
| `FilterPills`, `Segmented`, `ScopeSeg` | Seletores: pílulas com contagem, botões grandes com ícone, duas opções lado a lado. |
| `Switch`, `ToggleRow`, `SettingsRow` | Interruptor, linha clicável com interruptor e linha de ajuste. |
| `MoneyInput`, `AutoSaveMoneyField` | Dinheiro entrando pela casa dos centavos (`sm`/`md`/`lg`); o segundo salva ao sair do campo e mostra um check. |
| `MoneyMask` | Envolve valores. Com `<html data-hide-money="1">` borra todos; um toque revela só aquele. |
| `CardIcon`, `CardPicker` | Ícone de cartão no círculo e escolha entre cartões. |
| `Sheet`, `ConfirmDialog`, `ExplainModal` | Folha que sobe de baixo, confirmação destrutiva (com som de aviso) e explicação linha a linha. |
| `QuickActionsMenu`, `useLongPress` | Menu que cresce do ponto do toque longo e nunca vaza da tela. |
| `MonthPicker` | Grade de meses com troca de ano deslizando e mês de prévia. |
| `usePresence`, `Overlay` | Base das animações de saída (`.closing` por 260ms). |
| `EmptyState`, `InfoCallout` | Estado vazio e aviso informativo. |

### Exemplo

```tsx
<GaugeCard
  name="Teto da fatura"
  sub="Custos no cartão + lazer"
  badge="blue"
  icon={CreditCard}
  pct={pct}
  over={gasto > teto}
  slot="fatura"
  signature={`${ciclo}-${pct.toFixed(1)}`}
  spent={<MoneyMask>{brl(gasto)}</MoneyMask>}
  limit={<MoneyMask>{brl(teto)}</MoneyMask>}
  status={<>Sobram <MoneyMask>{brl(teto - gasto)}</MoneyMask> na fatura</>}
/>

<ToneCard tone="dica" icon={Lightbulb}>
  Mercado caiu 18% em relação ao mês passado.
</ToneCard>
```

Pra reanimar um `JackpotNumber` ou uma barra quando o valor muda, troque a `key` no pai (ex.: `key={valor}`). O componente remonta e roda de novo.

## Sons

```ts
import { playSound, playCountSound, setSoundEnabled, useSoundEnabled, pushToast } from "modernista";

playSound("success"); // "error" | "warning" | "click"
playCountSound("up"); // "down" pra contagem descendo
pushToast("Gasto lançado", "Mercado do mês · R$ 486,20", "ok"); // toca o som certo junto
```

`<SoundEffects />` faz o clique em qualquer botão, link, item de menu ou checkbox. Marque um elemento com `data-no-sound` pra silenciá-lo. A preferência fica em `localStorage` (`modernista:sound`) e vem ligada por padrão.

## Classes do shell do app

O CSS também traz o esqueleto do app original, sem componente React próprio porque depende da navegação de cada projeto: `.app-shell`, `.sidebar*` (desktop a partir de 900px), `.bottom-nav*` (celular), `.app-header` (com a faixa de confete), `.header-figure*`, `.tab-content`, `.tab-panel`, `.login-*`, `.nav-progress` e `.swipe-*`. O markup de referência está em `docs/index.html` (cabeçalho) e no Planejador Financeiro (`src/components/Dashboard.tsx`).

## Verificação

```bash
npm install
npm run typecheck
```
