import type { ChangeEvent, ReactNode } from "react";
import type { ThemeStyles } from "@/types/prototype";

export function ThemeButton({
  children,
  active = false,
  onClick,
  themeStyles,
  className = "",
  type = "button",
}: {
  children: ReactNode;
  active?: boolean;
  onClick?: () => void;
  themeStyles: ThemeStyles;
  className?: string;
  type?: "button" | "submit";
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`rounded-2xl border px-4 py-2.5 text-sm font-medium transition hover:opacity-95 ${className}`}
      style={{
        backgroundColor: active ? themeStyles.primary : themeStyles.card,
        color: active ? themeStyles.primaryText : themeStyles.text,
        borderColor: active ? themeStyles.primary : themeStyles.border,
      }}
    >
      {children}
    </button>
  );
}

export function ThemeInput({
  value,
  onChange,
  placeholder,
  themeStyles,
  multiline = false,
}: {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  placeholder?: string;
  themeStyles: ThemeStyles;
  multiline?: boolean;
}) {
  const sharedProps = {
    value,
    onChange,
    placeholder,
    className:
      "w-full rounded-2xl border px-4 py-3 text-sm outline-none placeholder:text-slate-400",
    style: {
      backgroundColor: themeStyles.panel,
      color: themeStyles.text,
      borderColor: themeStyles.border,
    },
  };

  if (multiline) {
    return <textarea rows={4} {...sharedProps} />;
  }

  return <input {...sharedProps} />;
}

export function ThemeSelect({
  value,
  onChange,
  options,
  placeholder,
  themeStyles,
}: {
  value: string;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  options: string[];
  placeholder: string;
  themeStyles: ThemeStyles;
}) {
  return (
    <select
      value={value}
      onChange={onChange}
      className="w-full rounded-2xl border px-4 py-3 text-sm outline-none"
      style={{
        backgroundColor: themeStyles.panel,
        color: themeStyles.text,
        borderColor: themeStyles.border,
      }}
    >
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}
