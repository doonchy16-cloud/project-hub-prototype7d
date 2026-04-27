"use client";

import { Hash, Lock, MessageSquare, Users } from "lucide-react";
import type { Conversation } from "@/types/prototype";

export function ChatHeader({
  conversation,
  onBack,
  showBack,
}: {
  conversation: Conversation | null;
  onBack?: () => void;
  showBack?: boolean;
}) {
  if (!conversation) {
    return (
      <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Select a conversation</h3>
          <p className="mt-1 text-sm text-slate-500">Choose a chat from the sidebar to start messaging.</p>
        </div>
      </div>
    );
  }

  const icon =
    conversation.kind === "global" ? <Users className="h-4 w-4" /> : conversation.kind === "project" ? <Hash className="h-4 w-4" /> : <MessageSquare className="h-4 w-4" />;

  return (
    <div className="flex items-center justify-between gap-4 border-b border-slate-200 px-5 py-4">
      <div className="flex items-center gap-3">
        {showBack ? (
          <button
            type="button"
            onClick={onBack}
            className="rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-600 transition hover:border-slate-300 hover:text-slate-900 lg:hidden"
          >
            Back
          </button>
        ) : null}

        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${conversation.avatarGradient} text-sm font-semibold text-white shadow-lg`}>
          {conversation.avatarLabel}
        </div>

        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-slate-900">{conversation.title}</h3>
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] uppercase tracking-[0.14em] text-slate-500">
              {icon}
              {conversation.kind}
            </span>
            {conversation.kind === "project" ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] uppercase tracking-[0.14em] text-slate-500">
                <Lock className="h-3 w-3" />
                members
              </span>
            ) : null}
          </div>
          <div className="mt-1 flex items-center gap-2 text-sm text-slate-500">
            {conversation.online !== undefined ? (
              <>
                <span className={`h-2.5 w-2.5 rounded-full ${conversation.online ? "bg-emerald-500" : "bg-slate-300"}`} />
                <span>{conversation.online ? "Online now" : "Offline"}</span>
                <span>•</span>
              </>
            ) : null}
            <span>{conversation.subtitle}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
