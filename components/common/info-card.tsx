import type { ReactNode } from "react";
import type { ThemeStyles } from "@/types/prototype";

export function InfoCard({
  children,
  themeStyles,
  className = "",
}: {
  children: ReactNode;
  themeStyles: ThemeStyles;
  className?: string;
}) {
  return (
    <div
      className={`rounded-3xl border ${className}`}
      style={{
        backgroundColor: themeStyles.card,
        borderColor: themeStyles.border,
        boxShadow: themeStyles.shadow,
      }}
    >
      {children}
    </div>
  );
}
