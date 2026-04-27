"use client";

import { Bot, Sparkles } from "lucide-react";
import type { ChatMessage } from "@/types/prototype";
import { MessageInput } from "@/components/chats/message-input";
import { MessageList } from "@/components/chats/message-list";

export function AiChatPanel({
  messages,
  draft,
  onDraftChange,
  onSend,
  onRetry,
  onCopy,
  loading,
  typingLabel,
}: {
  messages: ChatMessage[];
  draft: string;
  onDraftChange: (value: string) => void;
  onSend: () => void;
  onRetry: (messageId: string) => void;
  onCopy: (content: string) => void;
  loading?: boolean;
  typingLabel?: string | null;
}) {
  return (
    <div className="flex h-[78vh] flex-col overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-[0_24px_60px_rgba(15,23,42,0.12)]">
      <div className="border-b border-slate-200 bg-gradient-to-r from-slate-950 via-slate-900 to-sky-950 px-5 py-5 text-white">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-sky-100">
              <Sparkles className="h-3.5 w-3.5" />
              AI Chat
            </div>
            <h2 className="mt-4 text-2xl font-semibold">Prototype 7 assistant</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
              This assistant is shaped for project matching, next-step guidance, chat routing, and general support inside the app.
            </p>
          </div>
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-sky-100 shadow-lg backdrop-blur">
            <Bot className="h-7 w-7" />
          </div>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto bg-slate-50 px-4 py-5 md:px-5">
        <MessageList
          messages={messages}
          currentUserId="current-user"
          showCopy
          onCopy={onCopy}
          onRetry={onRetry}
          typingLabel={typingLabel}
          emptyState={
            <div>
              <Bot className="mx-auto h-8 w-8 text-slate-400" />
              <p className="mt-3 font-medium text-slate-700">Welcome to AI chat</p>
              <p className="mt-1 max-w-sm text-sm text-slate-500">
                Ask for project recommendations, compare places, plan next actions, or request a handoff to community or project chats.
              </p>
            </div>
          }
        />
      </div>

      <div className="border-t border-slate-200 p-4">
        <MessageInput
          value={draft}
          onChange={onDraftChange}
          onSend={onSend}
          disabled={loading}
          placeholder="Ask the assistant about projects, members, next steps, or anything else"
          attachmentHint="Multimodal support can be connected later through the API route"
        />
      </div>
    </div>
  );
}
