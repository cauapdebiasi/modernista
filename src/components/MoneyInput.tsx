"use client";

// Input de dinheiro: captura só dígitos e formata como "8.200,00" enquanto
// digita (dígito entra pela casa dos centavos, igual boleto/maquininha).

export function digitsToMoneyStr(digits: string): string {
  if (!digits) return "";
  const n = parseInt(digits, 10) / 100;
  return n.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function moneyStrToNumber(v: string): number {
  return parseFloat(v.replace(/\./g, "").replace(",", ".")) || 0;
}

export function MoneyInput({
  value,
  onChangeValue,
  onBlur,
  placeholder = "0,00",
  size = "md",
  autoFocus,
  prefix = "R$",
}: {
  value: string;
  onChangeValue: (v: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  size?: "sm" | "md" | "lg";
  autoFocus?: boolean;
  /** Símbolo antes do valor. */
  prefix?: string;
}) {
  return (
    <div className={`money-box money-box-${size}`}>
      <span className="money-prefix">{prefix}</span>
      <input
        value={value}
        onChange={(e) => {
          const digits = e.target.value.replace(/\D/g, "").slice(0, 9);
          onChangeValue(digitsToMoneyStr(digits));
        }}
        onBlur={onBlur}
        inputMode="decimal"
        placeholder={placeholder}
        autoFocus={autoFocus}
      />
    </div>
  );
}
