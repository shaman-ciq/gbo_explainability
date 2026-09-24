"use client";

import { Sparkles } from "lucide-react";

import { ExecutiveSummaryNarrative } from "@/components/dashboard/executive-summary-narrative";
import { FloatingAskBar } from "../floating-ask-bar";
import type { ChatStore } from "../chat-store";
import { ChatTranscript } from "../chat-transcript";
import { HistoryPolicyNote } from "../history-note";
import { MoreQuestions } from "../more-questions";
import { NewChatButton } from "../new-chat-button";

/**
 * Variant C — Inline. The pushed narrative stays on top, same as today. The
 * conversation appends directly below it in the page flow (no side panel, no
 * drawer, no History screen) while the composer floats fixed at the bottom of
 * the viewport, always visible regardless of scroll — a temporary, one-shot
 * thread, same philosophy as AllyBrain's page-appended chat. History may come
 * back here later; for now this variant stays intentionally simple.
 */
export function InlineShell({ store }: { store: ChatStore }) {
  const messages = store((s) => s.messages);
  const askStarterPrompt = store((s) => s.askStarterPrompt);
  const askFreeText = store((s) => s.askFreeText);
  const reset = store((s) => s.reset);

  return (
    <div className="h-full overflow-y-auto">
      <div className="flex flex-col gap-6 pb-28">
        <ExecutiveSummaryNarrative />

        <section aria-label="Ask about this report" className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-2 px-1">
            <div className="flex items-center gap-2">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-brand-50 text-brand-600">
                <Sparkles className="size-3.5" />
              </span>
              <p className="text-sm font-semibold text-slate-900">Ask about this report</p>
            </div>
            {messages.length > 0 ? <NewChatButton onReset={reset} /> : null}
          </div>

          {messages.length > 0 ? <ChatTranscript store={store} /> : null}
          <MoreQuestions onSelect={askStarterPrompt} started={messages.length > 0} />
          <HistoryPolicyNote className="px-1 text-2xs text-muted-foreground" />
        </section>
      </div>

      <FloatingAskBar onSubmit={askFreeText} />
    </div>
  );
}
