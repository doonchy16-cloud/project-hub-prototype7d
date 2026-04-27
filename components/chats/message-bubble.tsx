"use client";

import { AlertCircle, Copy, RefreshCcw } from "lucide-react";
import { MarkdownRenderer } from "@/components/chats/markdown-renderer";
import { formatTimeLabel } from "@/lib/prototype-utils";
import type { ChatMessage } from "@/types/prototype";

export function MessageBubble({
  message,
  currentUserId,
  showCopy = false,
  onCopy,
  onRetry,
}: {
  message: ChatMessage;
  currentUserId: string;
  showCopy?: boolean;
  onCopy?: (content: string) => void;
  onRetry?: () => void;
}) {
  const isCurrentUser = message.senderId === currentUserId || message.role === "user";
  const isAssistant = message.role === "assistant";

  return (
    <div className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[88%] rounded-[24px] border px-4 py-3 shadow-sm md:max-w-[76%] ${
          isCurrentUser
            ? "border-sky-500 bg-sky-600 text-white"
            : "border-slate-200 bg-white text-slate-900"
        }`}
      >
        {!isCurrentUser ? (
          <div className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            {message.senderName}
          </div>
        ) : null}

        <div className={isAssistant ? "prose prose-sm max-w-none prose-slate" : "text-sm leading-7 whitespace-pre-wrap"}>
          {isAssistant ? <MarkdownRenderer content={message.content} /> : message.content}
        </div>

        <div className={`mt-3 flex items-center justify-between gap-3 text-[11px] ${isCurrentUser ? "text-sky-100" : "text-slate-400"}`}>
          <span>{formatTimeLabel(message.createdAt)}</span>

          <div className="flex items-center gap-2">
            {message.status === "streaming" ? <span>Streaming...</span> : null}
            {message.status === "error" ? (
              <span className="inline-flex items-center gap-1 text-rose-500">
                <AlertCircle className="h-3.5 w-3.5" />
                Failed
              </span>
            ) : null}

            {showCopy && isAssistant ? (
              <button
                type="button"
                onClick={() => onCopy?.(message.content)}
                className="inline-flex items-center gap-1 rounded-full border border-slate-200 px-2 py-1 text-slate-500 transition hover:border-slate-300 hover:text-slate-700"
              >
                <Copy className="h-3.5 w-3.5" />
                Copy
              </button>
            ) : null}

            {message.status === "error" && onRetry ? (
              <button
                type="button"
                onClick={onRetry}
                className="inline-flex items-center gap-1 rounded-full border border-rose-200 px-2 py-1 text-rose-500 transition hover:border-rose-300 hover:text-rose-700"
              >
                <RefreshCcw className="h-3.5 w-3.5" />
                Retry
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
