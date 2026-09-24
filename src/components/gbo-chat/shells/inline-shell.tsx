"use client";

import { Sparkles } from "lucide-react";

import { ExecutiveSummaryNarrative } from "@/components/dashboard/executive-summary-narrative";
import { ChatComposer } from "../chat-composer";
import { useNewChatStore } from "../chat-store";
import { ChatTranscript } from "../chat-transcript";
import { StarterPromptChips } from "../starter-prompt-chips";

/**
 * Variant C — Inline. The pushed narrative stays on top, same as today. Instead
 * of a side panel, a chat box sits below it; asking a question appends the Q&A
 * turn further down the page — no drawer, no separate surface.
 */
export function InlineShell() {
  const store = useNewChatStore();
  const messages = store((s) => s.messages);
  const askStarterPrompt = store((s) => s.askStarterPrompt);
  const askFreeText = store((s) => s.askFreeText);

  return (
    <div className="flex flex-col gap-5">
      <ExecutiveSummaryNarrative />

      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <header className="flex items-center gap-2 border-b border-slate-100 px-4 py-3">
          <Sparkles className="size-4 text-brand-500" />
          <p className="text-sm font-semibold text-slate-900">Ask about this report</p>
        </header>

        <div className="flex flex-col gap-4 p-4">
          {messages.length === 0 ? (
            <StarterPromptChips onSelect={askStarterPrompt} />
          ) : (
            <ChatTranscript store={store} />
          )}
          <ChatComposer onSubmit={askFreeText} />
        </div>
      </section>
    </div>
  );
}
