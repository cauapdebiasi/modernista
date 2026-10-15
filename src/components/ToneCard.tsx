"use client";

import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

/** Tons do cartão de recado: cada um troca a cor da sombra dura, do círculo
 *  e do sobretítulo (regras `.insight[data-tone]`). */
export const TONES = ["dica", "elogio", "sugestao", "alerta", "curiosidade"] as const;
export type Tone = (typeof TONES)[number];

export const TONE_LABEL: Record<Tone, string> = {
  dica: "Dica",
  elogio: "Mandou bem",
  sugestao: "Sugestão",
  alerta: "Olho nisso",
  curiosidade: "Curiosidade",
};

/** Cartão de recado com ícone num círculo colorido, sobretítulo e texto.
 *  No app original ele mostra a dica da IA do mês. Sem `children`/`text`
 *  ele vira o esqueleto de carregamento. */
export function ToneCard({
  tone = "dica",
  icon: Icon,
  eyebrow,
  children,
  loading = false,
}: {
  tone?: Tone;
  icon?: LucideIcon;
  /** Sobretítulo; por padrão o rótulo do tom. */
  eyebrow?: string;
  children?: ReactNode;
  loading?: boolean;
}) {
  if (loading) {
    return (
      <div className="insight skeleton" aria-hidden="true">
        <span className="insight-badge" />
        <div className="insight-body">
          <span className="sk-line short" />
          <span className="sk-line" />
        </div>
      </div>
    );
  }

  return (
    <div className="insight" data-tone={tone}>
      <span className="insight-badge">{Icon && <Icon size={21} />}</span>
      <div className="insight-body">
        <span className="insight-eyebrow">{eyebrow ?? TONE_LABEL[tone]}</span>
        <p className="insight-text">{children}</p>
      </div>
    </div>
  );
}
