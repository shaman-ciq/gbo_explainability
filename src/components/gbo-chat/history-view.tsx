"use client";

import { Clock, MessageSquareText } from "lucide-react";

import type { ChatStore } from "./chat-store";

/**
 * A real screen, not a bubble: every question asked this session, full width
 * of whatever surface hosts it. Picking one re-asks it and hands the caller
 * back to the conversation tab.
 */
export function HistoryView({ store, onSelect }: { store: ChatStore; onSelect: () => void }) {
  const messages = store((s) => s.messages);
  const askFreeText = store((s) => s.askFreeText);
  const questions = messages.filter((m) => m.role === "user");

  if (questions.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2 py-10 text-center">
        <span className="flex size-10 items-center justify-center rounded-full bg-slate-100 text-slate-400">
          <Clock className="size-4.5" />
        </span>
        <p className="text-sm font-medium text-slate-600">No questions yet this session</p>
        <p className="max-w-[220px] text-xs text-muted-foreground">
          Everything you ask shows up here — switch back to Conversation to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <p className="px-1 text-2xs font-semibold tracking-wide text-slate-400 uppercase">
        {questions.length} question{questions.length === 1 ? "" : "s"} this session
      </p>
      <ul className="flex flex-col gap-1.5">
        {questions.map((q) => (
          <li key={q.id}>
            <button
              type="button"
              onClick={() => {
                askFreeText(q.text);
                onSelect();
              }}
              className="shadow-pane hover:shadow-pane-hover flex w-full items-start gap-2.5 rounded-xl bg-white px-3.5 py-3 text-left transition-shadow"
            >
              <MessageSquareText className="mt-0.5 size-3.5 shrink-0 text-slate-400" />
              <div className="min-w-0">
                <p className="text-sm text-slate-800">{q.text}</p>
                <p className="mt-0.5 text-2xs text-muted-foreground">Tap to ask again</p>
              </div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
