"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { TriangleAlert } from "lucide-react";
import { playSound } from "../sound/sounds";

const EXIT_MS = 260;

/** Mantém o componente montado por um instante depois de `open` virar false,
 *  pra a animação de saída (classe .closing) poder rodar antes de sumir. */
export function usePresence(open: boolean, ms = EXIT_MS) {
  const [mounted, setMounted] = useState(open);
  if (open && !mounted) setMounted(true);
  useEffect(() => {
    if (open || !mounted) return;
    const t = setTimeout(() => setMounted(false), ms);
    return () => clearTimeout(t);
  }, [open, mounted, ms]);
  return { render: open || mounted, closing: !open };
}

/** Fundo escuro dos diálogos (cor em --overlay). Clicar nele fecha. */
export function Overlay({ onClose, closing }: { onClose: () => void; closing?: boolean }) {
  return <div className={`overlay ${closing ? "closing" : ""}`} onClick={onClose} />;
}

/** Folha que sobe de baixo, com alça e título. Use
 *  `actions` pros botões do rodapé — em geral um .btn-ghost.btn-fixed
 *  ("Cancelar") e um .btn-primary-lg. */
export function Sheet({
  open,
  title,
  onClose,
  children,
  actions,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children?: ReactNode;
  actions?: ReactNode;
}) {
  const { render, closing } = usePresence(open);
  if (!render) return null;
  return (
    <>
      <Overlay onClose={onClose} closing={closing} />
      <div role="dialog" aria-modal="true" aria-label={title} className={`sheet ${closing ? "closing" : ""}`}>
        <div className="sheet-handle" />
        <div className="sheet-content">
          <h3 className="sheet-title">{title}</h3>
          {children}
          {actions && <div className="sheet-actions">{actions}</div>}
        </div>
      </div>
    </>
  );
}

export interface QuickAction {
  label: string;
  icon: LucideIcon;
  onClick: () => void;
  danger?: boolean;
}

/** Menu de ações rápidas que abre ancorado num ponto da tela (`x`, `y`) —
 *  pensado pra nascer bem embaixo do dedo num toque longo (ver
 *  useLongPress). Mede o próprio tamanho antes de aparecer pra não vazar da
 *  viewport (inverte pra cima quando não cabe embaixo, desloca pros lados
 *  quando não cabe centralizado) e entra crescendo a partir do ponto de
 *  ancoragem (scaleY de 0 a 1).
 *
 *  Reabrir com posição nova precisa ser uma REMONTAGEM: troque a `key` do
 *  componente a cada toque longo (ex.: `${menu.key}-${menu.x}-${menu.y}`). */
export function QuickActionsMenu({
  open,
  x,
  y,
  onClose,
  actions,
}: {
  open: boolean;
  x: number;
  y: number;
  onClose: () => void;
  actions: QuickAction[];
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ left: number; top: number; flipped: boolean; ready: boolean }>({
    left: x,
    top: y,
    flipped: false,
    ready: false,
  });

  useEffect(() => {
    if (!open || pos.ready) return;
    const el = ref.current;
    if (!el) return;
    const margin = 8;
    // offsetWidth/offsetHeight, NÃO getBoundingClientRect: nesse momento o
    // menu ainda tá com scaleY(0), e getBoundingClientRect reflete o tamanho
    // já transformado (quase 0). offset* ignora transform e dá o tamanho
    // real de layout, que é o que precisamos pra saber se cabe na tela.
    const w = el.offsetWidth;
    const h = el.offsetHeight;
    let left = x - w / 2;
    let top = y;
    let flipped = false;
    if (left < margin) left = margin;
    if (left + w > window.innerWidth - margin) left = window.innerWidth - margin - w;
    if (top + h > window.innerHeight - margin) {
      top = y - h;
      flipped = true;
    }
    if (top < margin) top = margin;
    // O tamanho real só existe depois do primeiro paint; não dá pra calcular
    // durante o render.
    setPos({ left, top, flipped, ready: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, pos.ready]);

  if (!open) return null;

  return (
    <>
      <Overlay onClose={onClose} />
      <div
        ref={ref}
        role="menu"
        className={`quick-menu ${pos.ready ? "ready" : ""}`}
        style={{ left: pos.left, top: pos.top, transformOrigin: pos.flipped ? "bottom center" : "top center" }}
        onContextMenu={(e) => e.preventDefault()}
      >
        {actions.map((a, i) => (
          <button
            key={i}
            type="button"
            role="menuitem"
            onClick={() => {
              a.onClick();
              onClose();
            }}
            onContextMenu={(e) => e.preventDefault()}
            className={`quick-menu-item ${a.danger ? "danger" : ""}`}
          >
            <a.icon size={17} />
            {a.label}
          </button>
        ))}
      </div>
    </>
  );
}

/** Confirmação de ação destrutiva. Toca o som de aviso ao abrir. */
export function ConfirmDialog({
  open,
  title,
  body,
  confirmLabel,
  cancelLabel = "Manter",
  onCancel,
  onConfirm,
}: {
  open: boolean;
  title: string;
  body: string;
  confirmLabel: string;
  cancelLabel?: string;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  useEffect(() => {
    if (open) playSound("warning");
  }, [open]);

  const { render, closing } = usePresence(open);
  if (!render) return null;
  return (
    <>
      <Overlay onClose={onCancel} closing={closing} />
      <div role="alertdialog" aria-modal="true" className={`confirm-dialog ${closing ? "closing" : ""}`}>
        <span className="confirm-icon-wrap">
          <TriangleAlert size={23} />
        </span>
        <h3 className="confirm-title">{title}</h3>
        <p className="confirm-body">{body}</p>
        <div className="confirm-actions">
          <button type="button" onClick={onCancel} className="btn-ghost">
            {cancelLabel}
          </button>
          <button type="button" onClick={onConfirm} className="btn-danger">
            {confirmLabel}
          </button>
        </div>
      </div>
    </>
  );
}

export interface ExplainRow {
  label: string;
  value: ReactNode;
  /** Linha de resultado (a do "="), em destaque. */
  emphasis?: boolean;
}

/** Folha que explica uma conta linha a linha ("Receita", "− Fixos",
 *  "= Sobra"). */
export function ExplainModal({
  open,
  title,
  rows,
  onClose,
  closeLabel = "Entendi",
}: {
  open: boolean;
  title: string;
  rows: ExplainRow[];
  onClose: () => void;
  closeLabel?: string;
}) {
  const { render, closing } = usePresence(open);
  if (!render) return null;
  return (
    <>
      <Overlay onClose={onClose} closing={closing} />
      <div role="dialog" aria-modal="true" className={`explain-sheet ${closing ? "closing" : ""}`}>
        <h3 className="sheet-title">{title}</h3>
        <div className="explain-rows">
          {rows.map((r, i) => (
            <div key={i} className={`explain-row ${r.emphasis ? "emphasis" : ""}`}>
              <span>{r.label}</span>
              <span>{r.value}</span>
            </div>
          ))}
        </div>
        <button type="button" onClick={onClose} className="btn-primary-lg btn-full">
          {closeLabel}
        </button>
      </div>
    </>
  );
}
