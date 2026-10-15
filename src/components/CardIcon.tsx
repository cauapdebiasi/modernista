/** Marcas de cartão com ícone pronto (arquivos em assets/cards/, ligados
 *  pelas regras .card-icon-<id> em components.css). Pra outra marca, crie
 *  uma regra .card-icon-<id> com o fundo e a máscara dela. */
export type CardBrand = "nubank" | "mercadopago" | (string & {});

export interface CardOption {
  id: CardBrand;
  label: string;
}

/** Ícone oficial do cartão num círculo. Nubank: wordmark branco sobre roxo
 *  (recolorido por máscara); Mercado Pago: logo original sobre branco. */
export function CardIcon({ id, label, size = 24 }: { id: CardBrand; label?: string; size?: number }) {
  return (
    <span
      role="img"
      aria-label={label ?? id}
      className={`card-icon card-icon-${id}`}
      style={{ width: size, height: size, borderRadius: "50%" }}
    >
      <i />
    </span>
  );
}

/** Um ladrilho por cartão; o escolhido fica pressionado. */
export function CardPicker({
  options,
  value,
  onChange,
  label = "Em qual cartão?",
}: {
  options: CardOption[];
  value: CardBrand | null;
  onChange: (id: CardBrand) => void;
  label?: string;
}) {
  return (
    <div className="field-group">
      <span className="field-label">{label}</span>
      <div className="card-picker" role="group" aria-label={label}>
        {options.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => onChange(c.id)}
            aria-pressed={value === c.id}
            className={`card-tile ${value === c.id ? "active" : ""}`}
          >
            <CardIcon id={c.id} label={c.label} size={40} />
            <span>{c.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
