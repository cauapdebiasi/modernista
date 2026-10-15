"use client";

import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { CircleCheck, Info, TriangleAlert } from "lucide-react";
import { ProgressFill, rampStage } from "./ProgressFill";

/** Cada cor tem sua forma: azul = quadrado, laranja = círculo, rosa = arco,
 *  violeta = quadrado, verde = folha. */
export type BadgeColor = "blue" | "orange" | "pink" | "violet" | "green";

export function Badge({ color, icon: Icon, size = 18 }: { color: BadgeColor; icon: LucideIcon; size?: number }) {
  return (
    <span className={`badge badge-${color}`}>
      <Icon size={size} />
    </span>
  );
}

/** Seção com contorno de tinta. `noPad` pra linhas que encostam na borda
 *  (SettingsRow). */
export function Section({
  title,
  note,
  description,
  noPad = false,
  children,
}: {
  title?: string;
  /** Nota pequena à direita do título. */
  note?: string;
  description?: string;
  noPad?: boolean;
  children: ReactNode;
}) {
  return (
    <div className={`section ${noPad ? "no-pad" : ""}`}>
      {title && note ? (
        <div className="section-head">
          <h2>{title}</h2>
          <span className="section-note">{note}</span>
        </div>
      ) : (
        title && <h2>{title}</h2>
      )}
      {description && <p className="section-desc">{description}</p>}
      {children}
    </div>
  );
}

/** Número pequeno de destaque (use em pares dentro de .two-col). */
export function StatMini({
  label,
  icon: Icon,
  iconTone,
  onInfo,
  children,
}: {
  label: string;
  icon?: LucideIcon;
  iconTone?: "info" | "danger";
  /** Mostra o botão (i) que abre uma explicação. */
  onInfo?: () => void;
  children: ReactNode;
}) {
  return (
    <div className="stat-mini">
      {Icon || onInfo ? (
        <div className="stat-mini-head">
          {Icon && <Icon size={16} className={iconTone ? `tone-${iconTone}` : undefined} />}
          <span>{label}</span>
          {onInfo && (
            <button type="button" onClick={onInfo} aria-label={`Sobre ${label}`} className="icon-btn-ghost stat-mini-info">
              <Info size={16} />
            </button>
          )}
        </div>
      ) : (
        <div className="stat-mini-label">{label}</div>
      )}
      <div className="stat-mini-value">{children}</div>
    </div>
  );
}

/** Cartão de medidor: badge + nome, barra listrada que muda de cor pela
 *  rampa (verde → amarelo → laranja → vermelho) e a linha de situação. */
export function GaugeCard({
  name,
  sub,
  badge,
  icon,
  pct,
  over = false,
  slot,
  signature,
  spent,
  limit,
  status,
  onInfo,
  children,
}: {
  name: string;
  sub?: string;
  badge: BadgeColor;
  icon: LucideIcon;
  /** 0 a 100 (a barra trava em 100). */
  pct: number;
  over?: boolean;
  /** Identificam a animação de enchimento (ver ProgressFill). */
  slot: string;
  signature: string;
  spent: ReactNode;
  limit: ReactNode;
  status: ReactNode;
  onInfo?: () => void;
  /** Conteúdo extra entre os valores e a situação (ex.: barras por cartão). */
  children?: ReactNode;
}) {
  const clamped = Math.max(0, Math.min(100, pct));
  return (
    <div className="gauge-card">
      <div className="gauge-head">
        <Badge color={badge} icon={icon} size={19} />
        <div className="gauge-head-text">
          <div className="gauge-name">{name}</div>
          {sub && <div className="gauge-sub">{sub}</div>}
        </div>
        {onInfo && (
          <button type="button" onClick={onInfo} aria-label="Como é calculado" className="icon-btn-ghost">
            <Info size={18} />
          </button>
        )}
      </div>
      <div className="gauge-track">
        <ProgressFill
          key={`${slot}-${signature}`}
          slot={slot}
          signature={signature}
          pct={clamped}
          className={`gauge-fill stage-${rampStage(clamped, over)}`}
        />
      </div>
      <div className="gauge-values">
        <span>{spent}</span>
        <span className="muted">{limit}</span>
      </div>
      {children}
      <div className={`gauge-status ${over ? "over" : ""}`}>
        {over ? <TriangleAlert size={16} /> : <CircleCheck size={16} />}
        {status}
      </div>
    </div>
  );
}

export interface RowItemData {
  label: string;
  value: ReactNode;
  icon: LucideIcon;
  color: BadgeColor;
}

/** Lista de linhas "badge · rótulo · valor". */
export function RowList({ rows }: { rows: RowItemData[] }) {
  return (
    <ul className="row-list">
      {rows.map((row) => (
        <li key={row.label} className="row-item">
          <Badge color={row.color} icon={row.icon} size={17} />
          <span className="row-label">{row.label}</span>
          <span className="row-value">{row.value}</span>
        </li>
      ))}
    </ul>
  );
}

/** Etiqueta de origem (`tone`: cartao, conta, reserva, adiantamento). */
export function SourceTag({ tone, children, withCard }: { tone: string; children: ReactNode; withCard?: ReactNode }) {
  return (
    <span className={`source-tag tone-${tone} ${withCard ? "with-card" : ""}`}>
      {withCard}
      {children}
    </span>
  );
}

/** Item de lista em cartão (lançamento). Espalhe `pressHandlers` do
 *  useLongPress pra abrir o menu de ações num toque longo. */
export function ListCard({
  badge,
  icon,
  title,
  meta,
  value,
  valueTone,
  pressing = false,
  dormant = false,
  trailing,
  pressHandlers,
}: {
  badge: BadgeColor;
  icon: LucideIcon;
  title: string;
  meta?: ReactNode;
  value: ReactNode;
  valueTone?: string;
  pressing?: boolean;
  /** Apagado (ex.: modelo que ainda não entrou no período). */
  dormant?: boolean;
  /** Algo depois do valor, como um <Switch>. */
  trailing?: ReactNode;
  pressHandlers?: Record<string, unknown>;
}) {
  return (
    <div
      className={`expense-card ${trailing ? "fixed-card" : ""} ${pressing ? "pressing" : ""} ${dormant ? "dormant" : ""}`}
      {...pressHandlers}
    >
      <Badge color={badge} icon={icon} size={19} />
      <div className="expense-card-main">
        <span className="expense-card-desc">{title}</span>
        {meta && <span className="expense-card-meta">{meta}</span>}
      </div>
      <span className={`expense-card-value ${valueTone ? `tone-${valueTone}` : ""}`}>{value}</span>
      {trailing}
    </div>
  );
}

/** Pílulas de filtro com contagem. */
export function FilterPills<K extends string>({
  options,
  value,
  onChange,
}: {
  options: { key: K; label: string; count?: number }[];
  value: K;
  onChange: (key: K) => void;
}) {
  return (
    <div className="filter-row">
      {options.map((o) => (
        <button
          key={o.key}
          type="button"
          onClick={() => onChange(o.key)}
          aria-pressed={value === o.key}
          className={`filter-pill ${value === o.key ? "active" : ""}`}
        >
          {o.label} {o.count !== undefined && <span className="filter-count">{o.count}</span>}
        </button>
      ))}
    </div>
  );
}

/** Seletor de botões grandes com ícone (`tone` pinta o ativo). */
export function Segmented<K extends string>({
  options,
  value,
  onChange,
}: {
  options: { key: K; label: string; icon: LucideIcon; tone?: string }[];
  value: K;
  onChange: (key: K) => void;
}) {
  return (
    <div className="segmented">
      {options.map((o) => {
        const active = value === o.key;
        return (
          <button
            key={o.key}
            type="button"
            onClick={() => onChange(o.key)}
            aria-pressed={active}
            className={`segmented-btn ${o.tone ? `tone-${o.tone}` : ""} ${active ? "active" : ""}`}
          >
            <o.icon size={20} />
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

/** Escolha de alcance com duas opções lado a lado e uma dica embaixo. */
export function ScopeSeg({
  label,
  options,
  value,
  onChange,
  hint,
}: {
  label: string;
  options: [string, string];
  value: 0 | 1;
  onChange: (v: 0 | 1) => void;
  hint?: ReactNode;
}) {
  return (
    <div className="scope" role="group" aria-label={label}>
      <span className="field-label">{label}</span>
      <div className="scope-seg">
        <button type="button" aria-pressed={value === 0} onClick={() => onChange(0)}>
          {options[0]}
        </button>
        <button type="button" aria-pressed={value === 1} onClick={() => onChange(1)}>
          {options[1]}
        </button>
      </div>
      {hint && <span className="field-hint">{hint}</span>}
    </div>
  );
}

/** Linha clicável inteira com um Switch no fim. */
export function ToggleRow({ label, onToggle, children }: { label: string; onToggle: () => void; children: ReactNode }) {
  return (
    <div
      className="toggle-row"
      onClick={(e) => {
        // O Switch já alterna sozinho; não repete.
        if ((e.target as HTMLElement).closest(".switch")) return;
        onToggle();
      }}
    >
      <span>{label}</span>
      {children}
    </div>
  );
}

/** Linha de ajuste (badge + texto + controle). Com `onClick` vira botão;
 *  `danger` pinta de tomate. */
export function SettingsRow({
  badge,
  icon,
  label,
  control,
  onClick,
  danger = false,
}: {
  badge: BadgeColor;
  icon: LucideIcon;
  label: string;
  control?: ReactNode;
  onClick?: () => void;
  danger?: boolean;
}) {
  const inner = (
    <>
      <Badge color={badge} icon={icon} />
      <span className="settings-row-grow">{label}</span>
      {control}
    </>
  );
  return onClick ? (
    <button type="button" onClick={onClick} className={`settings-row ${danger ? "danger" : ""}`}>
      {inner}
    </button>
  ) : (
    <div className={`settings-row ${danger ? "danger" : ""}`}>{inner}</div>
  );
}

/** Aviso informativo com ícone (i). */
export function InfoCallout({ children }: { children: ReactNode }) {
  return (
    <div className="info-callout">
      <Info size={18} />
      <p>{children}</p>
    </div>
  );
}

/** Estado vazio de lista. */
export function EmptyState({
  icon: Icon,
  title,
  body,
  action,
}: {
  icon: LucideIcon;
  title: string;
  body?: string;
  action?: ReactNode;
}) {
  return (
    <div className="empty-state">
      <span className="empty-icon">
        <Icon size={23} />
      </span>
      <span className="empty-title">{title}</span>
      {body && <p className="empty-body">{body}</p>}
      {action}
    </div>
  );
}
