"use client";

import { useEffect } from "react";
import { playSound } from "./sounds";

// Toque em qualquer controle clicável = som de clique. Escuta no documento
// (uma vez só) em vez de espalhar handler por botão. Rolar a tela não gera
// `click`, então listas não ficam barulhentas.
const CLICKABLE = 'button, a[href], [role="menuitem"], [role="tab"], input[type="checkbox"]';

export function SoundEffects() {
  useEffect(() => {
    function onClick(e: MouseEvent) {
      const el = (e.target as Element | null)?.closest?.(CLICKABLE);
      if (!el) return;
      if (el.matches(":disabled, [aria-disabled='true'], [data-no-sound]")) return;
      playSound("click");
    }
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return null;
}
