"use client";

import { useEffect, useMemo, useState } from "react";
import { playCountSound, type CountDirection } from "../sound/sounds";
import { EASE, TOTAL_DURATION_MS, lastAnimated } from "./countAnimation";

// Efeito "odômetro": cada dígito rola no seu próprio eixo vertical, sempre
// na mesma direção (sem voltar), desacelerando até travar no valor certo —
// com um pequeno atraso em cascata (100ms por dígito), mas a duração de
// cada um encolhe na mesma proporção do atraso, então TODOS terminam
// juntos, no mesmo instante (TOTAL_DURATION_MS após o valor aparecer na
// tela).
const DIGIT_DELAY_STEP_MS = 100;
const REEL_CYCLES = 2; // quantas voltas completas (0-9) o rolo dá antes de parar no dígito certo
function buildStrip(target: number, direction: CountDirection): number[] {
  const length = REEL_CYCLES * 10 + target + 1;
  // Subindo: 0,1,2…target (a faixa anda pra cima). Descendo: target,
  // target+1… (a faixa anda pra baixo e os dígitos vão diminuindo até
  // travar no alvo, que fica na primeira célula).
  return Array.from({ length }, (_, i) => (direction === "up" ? i % 10 : (target + i) % 10));
}

/** Mostra `value` (um texto formatado, ex: "R$ 1.234,56") com cada dígito
 *  rolando como um caça-níquel até acertar o valor final. A animação roda
 *  só se `signature` (valor + ciclo) for diferente da última que este
 *  `slot` já animou; senão o número aparece já parado. Troque a `key` no pai
 *  quando o valor mudar, pra remontar e animar de novo. */
export function JackpotNumber({
  value,
  slot,
  signature,
  direction = "up",
  sound = false,
  className,
}: {
  value: string;
  slot: string;
  signature: string;
  /** "down" faz os dígitos rolarem pra baixo e diminuírem (valor negativo). */
  direction?: CountDirection;
  /** Toca o som da contagem quando a animação roda (só um número por tela). */
  sound?: boolean;
  className?: string;
}) {
  const [animate] = useState(() => lastAnimated.get(slot) !== signature);
  useEffect(() => {
    lastAnimated.set(slot, signature);
  }, [slot, signature]);
  useEffect(() => {
    if (animate && sound) playCountSound(direction);
    // só na montagem: um novo valor remonta o componente (troca de key)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const chars = useMemo(() => value.split(""), [value]);
  let digitIndex = 0;

  return (
    <span className={`jackpot-number ${animate ? "" : "still"} ${direction === "down" ? "down" : ""} ${className ?? ""}`} aria-label={value}>
      {chars.map((ch, i) => {
        if (!/[0-9]/.test(ch)) {
          return (
            <span key={i} aria-hidden="true">
              {ch}
            </span>
          );
        }
        const target = Number(ch);
        const idx = digitIndex++;
        const delay = idx * DIGIT_DELAY_STEP_MS;
        const duration = Math.max(TOTAL_DURATION_MS - delay, 400);
        const strip = animate ? buildStrip(target, direction) : [target];
        const distance = strip.length - 1;
        return (
          <span
            key={i}
            aria-hidden="true"
            className="jackpot-digit"
            style={
              {
                "--jp-delay": `${delay}ms`,
                "--jp-duration": `${duration}ms`,
                "--jp-distance": `-${distance}em`,
                "--jp-ease": EASE,
              } as React.CSSProperties
            }
          >
            <span className="jackpot-strip">
              {strip.map((d, si) => (
                <span key={si} className="jackpot-cell">
                  {d}
                </span>
              ))}
            </span>
          </span>
        );
      })}
    </span>
  );
}
