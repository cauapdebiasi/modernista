"use client";

export function Switch({
  checked,
  onChange,
  title,
  disabled,
}: {
  checked: boolean;
  onChange: () => void;
  title: string;
  disabled?: boolean;
}) {
  return (
    <label className="switch" title={title}>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        aria-label={title}
        disabled={disabled}
      />
      <span className="switch-track" aria-hidden="true">
        <span className="switch-thumb" />
      </span>
    </label>
  );
}
