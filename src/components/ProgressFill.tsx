"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { EASE, TOTAL_DURATION_MS, lastAnimated } from "./countAnimation";

/** Preenchimento de uma barra de progresso que enche da esquerda até `pct`
 *  na mesma duração/curva do rolo dos números. Só anima se `signature`
 *  (valor + ciclo) for diferente da última que este `slot` já animou; senão
 *  já nasce cheia. Troque a `key` no pai quando o valor mudar, pra remontar
 *  e animar de novo. */
export function ProgressFill({
  slot,
  signature,
  pct,
  className,
}: {
  slot: string;
  signature: string;
  pct: number;
  className: string;
}) {
  const [animate] = useState(() => lastAnimated.get(slot) !== signature);
  useEffect(() => {
    lastAnimated.set(slot, signature);
  }, [slot, signature]);

  return (
    <div
      className={`${className} ${animate ? "fill-anim" : ""}`}
      style={{ width: `${pct}%`, "--fill-dur": `${TOTAL_DURATION_MS}ms`, "--fill-ease": EASE } as CSSProperties}
    />
  );
}

/** Estágio de cor da rampa (classes .stage-1 a .stage-4 do .gauge-fill):
 *  verde até 40%, amarelo até 65%, laranja até 85%, vermelho daí pra cima
 *  ou quando estourou. Cada paleta define as suas cores em --ramp-1..4. */
export function rampStage(pct: number, over = false): 1 | 2 | 3 | 4 {
  if (over || pct >= 85) return 4;
  if (pct >= 65) return 3;
  if (pct >= 40) return 2;
  return 1;
}
