"use client";

import { Fragment, type ReactNode } from "react";

function renderInline(text: string) {
  const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g).filter(Boolean);
  return parts.map((part, index) => {
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code key={index} className="rounded-md bg-slate-900/90 px-1.5 py-0.5 text-[0.92em] text-slate-100">
          {part.slice(1, -1)}
        </code>
      );
    }

    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={index} className="font-semibold">
          {part.slice(2, -2)}
        </strong>
      );
    }

    return <Fragment key={index}>{part}</Fragment>;
  });
}

export function MarkdownRenderer({ content }: { content: string }) {
  const blocks = content.split(/```([\s\S]*?)```/g);

  return (
    <div className="space-y-4 text-sm leading-7">
      {blocks.map((block, blockIndex) => {
        if (blockIndex % 2 === 1) {
          const lines = block.split("\n");
          const maybeLang = lines[0]?.trim();
          const code = lines.slice(1).join("\n").trim() || block.trim();

          return (
            <div key={blockIndex} className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950">
              <div className="flex items-center justify-between border-b border-slate-800 px-4 py-2 text-xs uppercase tracking-[0.18em] text-slate-400">
                <span>{maybeLang || "code"}</span>
                <span>snippet</span>
              </div>
              <pre className="overflow-x-auto p-4 text-xs text-slate-100">
                <code>{code}</code>
              </pre>
            </div>
          );
        }

        const lines = block.split("\n");
        const rendered: ReactNode[] = [];
        let listItems: string[] = [];

        const flushList = () => {
          if (listItems.length > 0) {
            rendered.push(
              <ul key={`list-${blockIndex}-${rendered.length}`} className="list-disc space-y-1 pl-5">
                {listItems.map((item, itemIndex) => (
                  <li key={itemIndex}>{renderInline(item)}</li>
                ))}
              </ul>
            );
            listItems = [];
          }
        };

        lines.forEach((line, lineIndex) => {
          const trimmed = line.trim();
          if (!trimmed) {
            flushList();
            return;
          }

          if (trimmed.startsWith("- ")) {
            listItems.push(trimmed.slice(2));
            return;
          }

          flushList();

          if (trimmed.startsWith("### ")) {
            rendered.push(
              <h3 key={`${blockIndex}-${lineIndex}`} className="text-base font-semibold">
                {renderInline(trimmed.slice(4))}
              </h3>
            );
            return;
          }

          if (trimmed.startsWith("## ")) {
            rendered.push(
              <h2 key={`${blockIndex}-${lineIndex}`} className="text-lg font-semibold">
                {renderInline(trimmed.slice(3))}
              </h2>
            );
            return;
          }

          if (trimmed.startsWith("# ")) {
            rendered.push(
              <h1 key={`${blockIndex}-${lineIndex}`} className="text-xl font-semibold">
                {renderInline(trimmed.slice(2))}
              </h1>
            );
            return;
          }

          if (trimmed.startsWith("> ")) {
            rendered.push(
              <blockquote key={`${blockIndex}-${lineIndex}`} className="border-l-4 border-sky-400/70 pl-4 italic text-slate-600">
                {renderInline(trimmed.slice(2))}
              </blockquote>
            );
            return;
          }

          rendered.push(
            <p key={`${blockIndex}-${lineIndex}`}>{renderInline(trimmed)}</p>
          );
        });

        flushList();

        return <div key={blockIndex} className="space-y-3">{rendered}</div>;
      })}
    </div>
  );
}
