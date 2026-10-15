"use client";

import { useRef, useState, type ReactNode } from "react";
import { CircleCheck } from "lucide-react";
import { digitsToMoneyStr, moneyStrToNumber } from "./MoneyInput";

/** Campo de dinheiro que salva sozinho ao sair do campo (blur) e mostra um
 *  check por 1,8s quando o `onSave` termina. */
export function AutoSaveMoneyField({
  label,
  hint,
  defaultValue,
  onSave,
  disabled = false,
  prefix = "R$",
}: {
  label: string;
  hint?: ReactNode;
  defaultValue: string;
  /** Recebe o número já convertido (não a string formatada em BRL) —
   *  evita ambiguidade entre separador de milhar e separador decimal. */
  onSave: (value: number) => Promise<void>;
  /** Somente leitura: nada pode ser salvo. */
  disabled?: boolean;
  prefix?: string;
}) {
  const [value, setValue] = useState(defaultValue);
  const [saved, setSaved] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  async function handleBlur() {
    if (disabled) return;
    await onSave(moneyStrToNumber(value));
    setSaved(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setSaved(false), 1800);
  }

  return (
    <div className="field-group">
      <label className="field-label">{label}</label>
      <div className={`money-box money-box-md ${saved ? "field-saved" : ""} ${disabled ? "readonly" : ""}`}>
        <span className="money-prefix">{prefix}</span>
        <input
          value={value}
          onChange={(e) => {
            const digits = e.target.value.replace(/\D/g, "").slice(0, 9);
            setValue(digitsToMoneyStr(digits));
            setSaved(false);
          }}
          onBlur={handleBlur}
          inputMode="decimal"
          disabled={disabled}
        />
        {saved && <CircleCheck size={18} className="field-check" />}
      </div>
      {hint && <span className="field-hint">{hint}</span>}
    </div>
  );
}
