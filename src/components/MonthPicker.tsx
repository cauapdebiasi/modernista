"use client";

import { useCallback, useEffect, useState, type CSSProperties } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const MONTHS_PT = ["JAN", "FEV", "MAR", "ABR", "MAI", "JUN", "JUL", "AGO", "SET", "OUT", "NOV", "DEZ"];
const EXIT_MS = 180;

/** Grid de meses do ano sobre um fundo com blur. Os rótulos são "AAAA-MM".
 *  Só os meses em `enabledLabels` (e o `previewLabel`, marcado com uma
 *  etiqueta) podem ser escolhidos; os outros aparecem apagados. O ano troca
 *  com as setas, deslizando pro lado certo. Monte/desmonte o componente a
 *  cada abertura, assim o estado sempre nasce zerado; ele chama `onClose`
 *  depois da animação de saída. */
export function MonthPicker({
  value,
  enabledLabels,
  previewLabel = null,
  previewTag = "prévia",
  monthNames = MONTHS_PT,
  onPick,
  onClose,
}: {
  /** Mês aberto agora ("AAAA-MM"). */
  value: string;
  enabledLabels: string[];
  /** Um mês extra que abre em modo prévia, ou null. */
  previewLabel?: string | null;
  previewTag?: string;
  monthNames?: string[];
  onPick: (label: string) => void;
  onClose: () => void;
}) {
  const [year, setYear] = useState(() => Number(value.slice(0, 4)));
  const [dir, setDir] = useState<1 | -1>(1);
  const [leaving, setLeaving] = useState(false);
  const [picked, setPicked] = useState<string | null>(null);

  const enabled = new Set(enabledLabels);

  const finish = useCallback(
    (label?: string) => {
      setLeaving(true);
      if (label) onPick(label);
      setTimeout(onClose, EXIT_MS);
    },
    [onClose, onPick],
  );

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key !== "Escape") return;
      finish();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [finish]);

  function changeYear(delta: 1 | -1) {
    setDir(delta);
    setYear((y) => y + delta);
  }

  function pick(label: string) {
    if (leaving) return;
    if (label === value) return finish();
    if (enabled.has(label)) {
      setPicked(label);
      return finish(label);
    }
    if (label === previewLabel) finish(label);
  }

  return (
    <div
      className={`mp-backdrop ${leaving ? "leaving" : ""}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) finish();
      }}
    >
      <div role="dialog" aria-modal="true" aria-label="Escolher mês" className={`mp-panel ${leaving ? "leaving" : ""}`}>
        <div className="mp-head">
          <button type="button" className="mp-arrow" onClick={() => changeYear(-1)} aria-label="Ano anterior">
            <ChevronLeft size={20} />
          </button>
          <span key={year} className="mp-year" style={{ "--dx": `${dir * 22}px` } as CSSProperties} aria-live="polite">
            {year}
          </span>
          <button type="button" className="mp-arrow" onClick={() => changeYear(1)} aria-label="Próximo ano">
            <ChevronRight size={20} />
          </button>
        </div>

        <div key={year} className="mp-grid" style={{ "--dx": `${dir * 24}px` } as CSSProperties}>
          {monthNames.map((name, i) => {
            const label = `${year}-${String(i + 1).padStart(2, "0")}`;
            const isViewing = label === value;
            const isEnabled = enabled.has(label);
            const isPreview = !isEnabled && label === previewLabel;
            return (
              <button
                key={label}
                type="button"
                disabled={!isEnabled && !isPreview && !isViewing}
                onClick={() => pick(label)}
                aria-current={isViewing ? "date" : undefined}
                style={{ "--i": i } as CSSProperties}
                className={`mp-month ${isViewing ? "viewing" : ""} ${isPreview ? "next" : ""} ${picked === label ? "picked" : ""}`}
              >
                {name}
                {isPreview && <span className="mp-month-new">{previewTag}</span>}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
