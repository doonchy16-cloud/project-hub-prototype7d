"use client";

import type { ReactNode } from "react";

export function ChatLayout({
  sidebar,
  content,
  showContentOnMobile,
}: {
  sidebar: ReactNode;
  content: ReactNode;
  showContentOnMobile: boolean;
}) {
  return (
    <div className="grid gap-4 lg:grid-cols-[360px_1fr]">
      <div className={`${showContentOnMobile ? "hidden lg:block" : "block"}`}>{sidebar}</div>
      <div className={`${showContentOnMobile ? "block" : "hidden lg:block"}`}>{content}</div>
    </div>
  );
}
