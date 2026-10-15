// Scripts que precisam rodar ANTES da primeira pintura, de forma bloqueante,
// como <script> inline no começo do <body>. Sem eles a tela piscaria na
// paleta padrão e os valores apareceriam por um instante antes do blur.
//
// Next.js (App Router), no layout raiz:
//   <body>
//     <script dangerouslySetInnerHTML={{ __html: HIDE_MONEY_INIT_SCRIPT }} />
//     <script dangerouslySetInnerHTML={{ __html: paletteInitScript() }} />
//     ...
// e `suppressHydrationWarning` no <html>, já que os atributos mudam antes
// do React hidratar.

export const PALETTES = ["esmeralda", "oceano", "turquesa"] as const;
export type Palette = (typeof PALETTES)[number];

/** Cor principal de cada paleta, pra meta theme-color (barra do sistema). */
export const PALETTE_THEME_COLOR: Record<Palette, string> = {
  esmeralda: "#08a06a",
  oceano: "#1f6bff",
  turquesa: "#0aa6a0",
};

export const PALETTE_STORAGE_KEY = "modernista:palette";
export const HIDE_MONEY_STORAGE_KEY = "modernista:hide-money";

/** Sorteia a paleta a cada carregamento, nunca repetindo a anterior (senão
 *  parece que o sorteio não funciona), marca <html data-palette> e ajusta
 *  a meta theme-color. Passe `fixed` pra sempre usar a mesma paleta. */
export function paletteInitScript(fixed?: Palette): string {
  if (fixed) {
    return `try{document.documentElement.setAttribute('data-palette',${JSON.stringify(fixed)});var m=document.querySelector('meta[name=theme-color]');if(m)m.setAttribute('content',${JSON.stringify(PALETTE_THEME_COLOR[fixed])})}catch(e){}`;
  }
  const list = JSON.stringify(PALETTES);
  const colors = JSON.stringify(PALETTE_THEME_COLOR);
  const key = JSON.stringify(PALETTE_STORAGE_KEY);
  return `try{var L=${list},C=${colors},last=null;try{last=localStorage.getItem(${key})}catch(e){}var o=L.filter(function(x){return x!==last}),p=o[Math.floor(Math.random()*o.length)];try{localStorage.setItem(${key},p)}catch(e){}document.documentElement.setAttribute('data-palette',p);var m=document.querySelector('meta[name=theme-color]');if(m)m.setAttribute('content',C[p])}catch(e){}`;
}

/** Lê a preferência "ocultar valores" e marca <html data-hide-money="1">,
 *  que liga o blur de todo <MoneyMask>. */
export const HIDE_MONEY_INIT_SCRIPT = `try{if(localStorage.getItem(${JSON.stringify(HIDE_MONEY_STORAGE_KEY)})==='1'){document.documentElement.setAttribute('data-hide-money','1')}}catch(e){}`;

/** Liga/desliga o modo "ocultar valores" já com a página aberta. */
export function setHideMoney(on: boolean) {
  try {
    localStorage.setItem(HIDE_MONEY_STORAGE_KEY, on ? "1" : "0");
  } catch {
    // sem localStorage: vale só até recarregar
  }
  if (on) document.documentElement.setAttribute("data-hide-money", "1");
  else document.documentElement.removeAttribute("data-hide-money");
}

/** Troca a paleta na hora (ex.: um seletor de tema). */
export function setPalette(p: Palette) {
  document.documentElement.setAttribute("data-palette", p);
  try {
    localStorage.setItem(PALETTE_STORAGE_KEY, p);
  } catch {
    // ignora
  }
  document.querySelector("meta[name=theme-color]")?.setAttribute("content", PALETTE_THEME_COLOR[p]);
}
