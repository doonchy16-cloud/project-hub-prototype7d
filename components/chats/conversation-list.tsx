"use client";

import { Search } from "lucide-react";
import type { Conversation } from "@/types/prototype";

export function ConversationList({
  conversations,
  selectedConversationId,
  onSelectConversation,
  searchQuery,
  onSearchQueryChange,
}: {
  conversations: Conversation[];
  selectedConversationId: string | null;
  onSelectConversation: (conversationId: string) => void;
  searchQuery: string;
  onSearchQueryChange: (value: string) => void;
}) {
  return (
    <div className="flex h-full flex-col rounded-[28px] border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 p-4">
        <h3 className="text-lg font-semibold text-slate-900">Conversations</h3>
        <p className="mt-1 text-sm text-slate-500">Global, project, and direct messages</p>

        <div className="relative mt-4">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={searchQuery}
            onChange={(event) => onSearchQueryChange(event.target.value)}
            placeholder="Search conversations"
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none placeholder:text-slate-400"
          />
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-3">
        <div className="space-y-2">
          {conversations.map((conversation) => {
            const active = selectedConversationId === conversation.id;
            return (
              <button
                key={conversation.id}
                type="button"
                onClick={() => onSelectConversation(conversation.id)}
                className="flex w-full items-start gap-3 rounded-2xl border p-3 text-left transition"
                style={{
                  backgroundColor: active ? "#eff6ff" : "#ffffff",
                  borderColor: active ? "#93c5fd" : "#e2e8f0",
                }}
              >
                <div className={`mt-0.5 flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br ${conversation.avatarGradient} text-sm font-semibold text-white shadow-md`}>
                  {conversation.avatarLabel}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="truncate text-sm font-semibold text-slate-900">{conversation.title}</p>
                    {conversation.unreadCount > 0 ? (
                      <span className="inline-flex min-w-6 items-center justify-center rounded-full bg-slate-900 px-2 py-0.5 text-[11px] font-medium text-white">
                        {conversation.unreadCount}
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-1 truncate text-sm text-slate-500">{conversation.subtitle}</p>
                  {conversation.online !== undefined ? (
                    <div className="mt-2 inline-flex items-center gap-1.5 text-xs text-slate-400">
                      <span className={`h-2 w-2 rounded-full ${conversation.online ? "bg-emerald-500" : "bg-slate-300"}`} />
                      <span>{conversation.online ? "Online" : "Offline"}</span>
                    </div>
                  ) : null}
                </div>
              </button>
            );
          })}

          {conversations.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-5 text-sm text-slate-500">
              No conversations match your search yet.
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
