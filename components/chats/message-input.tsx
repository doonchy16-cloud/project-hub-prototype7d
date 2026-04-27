"use client";

import { Paperclip, Send } from "lucide-react";

export function MessageInput({
  value,
  onChange,
  onSend,
  disabled = false,
  placeholder,
  attachmentHint = "Attachments coming next",
}: {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  disabled?: boolean;
  placeholder: string;
  attachmentHint?: string;
}) {
  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-3 shadow-sm">
      <div className="flex items-end gap-3">
        <button
          type="button"
          aria-label={attachmentHint}
          title={attachmentHint}
          className="rounded-2xl border border-slate-200 p-3 text-slate-500 transition hover:border-slate-300 hover:text-slate-700"
        >
          <Paperclip className="h-4 w-4" />
        </button>

        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              if (!disabled && value.trim()) onSend();
            }
          }}
          rows={1}
          placeholder={placeholder}
          className="max-h-40 min-h-[52px] flex-1 resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none placeholder:text-slate-400"
        />

        <button
          type="button"
          onClick={onSend}
          disabled={disabled || !value.trim()}
          className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-medium text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <span className="inline-flex items-center gap-2">
            <Send className="h-4 w-4" />
            Send
          </span>
        </button>
      </div>

      <div className="mt-2 flex flex-wrap items-center justify-between gap-2 px-1 text-xs text-slate-400">
        <span>Enter to send / Shift + Enter for a new line</span>
        <span>{attachmentHint}</span>
      </div>
    </div>
  );
}
