"use client";

import { History } from "lucide-react";
import { useState } from "react";

import type { ChatStore } from "./chat-store";

/**
 * Session-scoped history, modeled on the RMM Ask AI reference's "History" tab —
 * a list of questions asked this visit, not a cross-day archive (see
 * history-note.tsx). Picking one re-asks it rather than trying to fake
 * re-threading a past answer.
 */
export function ChatHistoryMenu({ store }: { store: ChatStore }) {
  const [open, setOpen] = useState(false);
  const messages = store((s) => s.messages);
  const askFreeText = store((s) => s.askFreeText);
  const questions = messages.filter((m) => m.role === "user");

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800"
      >
        <History className="size-3.5" />
        History
        {questions.length > 0 ? (
          <span className="flex size-4 items-center justify-center rounded-full bg-slate-200 text-2xs font-semibold text-slate-600">
            {questions.length}
          </span>
        ) : null}
      </button>

      {open ? (
        <>
          <button
            type="button"
            aria-label="Close history"
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-40 cursor-default"
          />
          <div className="shadow-popover fade-in-up absolute top-full right-0 z-50 mt-1.5 w-72 rounded-xl bg-white p-1.5">
            {questions.length === 0 ? (
              <p className="px-2.5 py-4 text-center text-xs text-muted-foreground">No questions yet this session.</p>
            ) : (
              <div className="flex max-h-64 flex-col gap-0.5 overflow-y-auto">
                {questions.map((q) => (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => {
                      askFreeText(q.text);
                      setOpen(false);
                    }}
                    className="rounded-lg px-2.5 py-2 text-left text-xs text-slate-700 transition-colors hover:bg-slate-50"
                  >
                    {q.text}
                  </button>
                ))}
              </div>
            )}
          </div>
        </>
      ) : null}
    </div>
  );
}
