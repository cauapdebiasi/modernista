"use client";

import { useState, type ReactNode } from "react";

/** Envolve um valor monetário exibido na tela. O blur em si é 100% via CSS,
 *  ligado por um atributo em <html data-hide-money="1"> (ver scripts/init.ts e
 *  a regra `html[data-hide-money="1"] .money-mask` em components.css) — assim
 *  o valor já nasce borrado no primeiro paint, sem esperar o React montar
 *  (evita o "flash" do número em texto puro antes de esconder).
 *
 *  Clicar num valor borrado revela só aquele valor, e só enquanto o
 *  componente estiver montado na tela — não fica salvo em lugar nenhum. Se
 *  o modo global estiver "mostrar", o clique não faz nada (não tem o que
 *  revelar). */
export function MoneyMask({ children, className }: { children: ReactNode; className?: string }) {
  const [revealed, setRevealed] = useState(false);

  return (
    <span
      className={`money-mask ${revealed ? "revealed" : ""} ${className ?? ""}`}
      onClick={(e) => {
        if (revealed) return;
        e.stopPropagation();
        setRevealed(true);
      }}
    >
      {children}
    </span>
  );
}
