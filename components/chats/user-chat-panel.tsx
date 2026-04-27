"use client";

import { MessageSquareDashed, Users } from "lucide-react";
import type { ChatMessage, Conversation } from "@/types/prototype";
import { ChatHeader } from "@/components/chats/chat-header";
import { MessageInput } from "@/components/chats/message-input";
import { MessageList } from "@/components/chats/message-list";

export function UserChatPanel({
  selectedConversation,
  messages,
  currentUserId,
  draft,
  onDraftChange,
  onSend,
  onBack,
  showBack,
  typingLabel,
  loading,
}: {
  selectedConversation: Conversation | null;
  messages: ChatMessage[];
  currentUserId: string;
  draft: string;
  onDraftChange: (value: string) => void;
  onSend: () => void;
  onBack?: () => void;
  showBack?: boolean;
  typingLabel?: string | null;
  loading?: boolean;
}) {
  return (
    <div className="flex h-[78vh] flex-col overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
      <ChatHeader conversation={selectedConversation} onBack={onBack} showBack={showBack} />

      <div className="min-h-0 flex-1 overflow-y-auto bg-slate-50 px-4 py-5 md:px-5">
        <MessageList
          messages={messages}
          currentUserId={currentUserId}
          emptyState={
            <div>
              <Users className="mx-auto h-8 w-8 text-slate-400" />
              <p className="mt-3 font-medium text-slate-700">No chat selected yet</p>
              <p className="mt-1 max-w-sm text-sm text-slate-500">
                Choose a conversation from the list to see your messages, project rooms, or community chats.
              </p>
            </div>
          }
          typingLabel={typingLabel}
        />
      </div>

      <div className="border-t border-slate-200 p-4">
        {selectedConversation ? (
          <MessageInput
            value={draft}
            onChange={onDraftChange}
            onSend={onSend}
            disabled={loading}
            placeholder={`Message ${selectedConversation.title}`}
            attachmentHint="Image and file attachments are UI-ready for backend wiring"
          />
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-5 text-sm text-slate-500">
            <div className="flex items-center gap-2 font-medium text-slate-700">
              <MessageSquareDashed className="h-4 w-4" />
              Empty state
            </div>
            <p className="mt-2">
              Select a conversation to start chatting. On mobile, the selected conversation takes over the screen.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
