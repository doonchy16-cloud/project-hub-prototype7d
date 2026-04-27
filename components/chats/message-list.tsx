"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { MessageBubble } from "@/components/chats/message-bubble";
import type { ChatMessage } from "@/types/prototype";

export function MessageList({
  messages,
  currentUserId,
  emptyState,
  showCopy = false,
  onCopy,
  onRetry,
  typingLabel,
}: {
  messages: ChatMessage[];
  currentUserId: string;
  emptyState: ReactNode;
  showCopy?: boolean;
  onCopy?: (content: string) => void;
  onRetry?: (messageId: string) => void;
  typingLabel?: string | null;
}) {
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, typingLabel]);

  if (messages.length === 0) {
    return (
      <div className="flex h-full items-center justify-center rounded-[28px] border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-500">
        {emptyState}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <MessageBubble
          key={message.id}
          message={message}
          currentUserId={currentUserId}
          showCopy={showCopy}
          onCopy={onCopy}
          onRetry={onRetry ? () => onRetry(message.id) : undefined}
        />
      ))}

      {typingLabel ? (
        <div className="flex justify-start">
          <div className="rounded-[24px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500 shadow-sm">
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.2s]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.1s]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400" />
              </div>
              <span>{typingLabel}</span>
            </div>
          </div>
        </div>
      ) : null}

      <div ref={endRef} />
    </div>
  );
}
