"use client";

import { useRef, useState } from "react";

/** Toque longo (ou clique com o botão direito, no desktop) num item de
 *  lista — abre um menu ancorado onde o dedo/cursor tava. Cada lista
 *  passa seu próprio `target` (o dado por trás do item) e monta suas
 *  próprias ações no <QuickActionsMenu>.
 *
 *  O timer roda numa ref (não precisa re-renderizar a cada tick), e
 *  qualquer movimento maior que um tremor de dedo cancela — assim não
 *  dispara sem querer no meio de um scroll. */
export function useLongPress<T>(delayMs = 300) {
  const pressRef = useRef<{ key: string; x: number; y: number; timer: number } | null>(null);
  const [pressingKey, setPressingKey] = useState<string | null>(null);
  const [menu, setMenu] = useState<{ target: T; key: string; x: number; y: number } | null>(null);

  function clear() {
    const p = pressRef.current;
    if (p) window.clearTimeout(p.timer);
    pressRef.current = null;
    setPressingKey(null);
  }

  function start(e: React.PointerEvent, key: string, target: T) {
    if (e.pointerType === "mouse" && e.button !== 0) return; // só botão esquerdo
    if (menu) return; // já tem um menu aberto — não empilha outro
    const x = e.clientX;
    const y = e.clientY;
    const timer = window.setTimeout(() => {
      pressRef.current = null;
      setPressingKey(null);
      setMenu({ target, key, x, y });
    }, delayMs);
    pressRef.current = { key, x, y, timer };
    setPressingKey(key);
  }

  function move(e: React.PointerEvent) {
    const p = pressRef.current;
    if (!p) return;
    if (Math.hypot(e.clientX - p.x, e.clientY - p.y) > 10) clear();
  }

  function contextMenu(e: React.MouseEvent, key: string, target: T) {
    e.preventDefault();
    clear();
    setMenu({ target, key, x: e.clientX, y: e.clientY });
  }

  return {
    pressingKey,
    menu,
    closeMenu: () => setMenu(null),
    /** Handlers prontos pra espalhar no elemento do item da lista. */
    itemHandlers: (key: string, target: T) => ({
      onPointerDown: (e: React.PointerEvent) => start(e, key, target),
      onPointerMove: move,
      onPointerUp: clear,
      onPointerCancel: clear,
      onPointerLeave: clear,
      onContextMenu: (e: React.MouseEvent) => contextMenu(e, key, target),
    }),
  };
}
