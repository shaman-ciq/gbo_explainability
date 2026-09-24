"use client";

import { ExecutiveSummaryNarrative } from "@/components/dashboard/executive-summary-narrative";
import { FloatingAskBar } from "../floating-ask-bar";
import { useNewChatStore } from "../chat-store";
import { ChatTranscript } from "../chat-transcript";
import { StarterPromptChips } from "../starter-prompt-chips";

/**
 * Variant C — Inline. The pushed narrative stays on top, same as today. The
 * conversation appends directly below it in the page flow (no side panel, no
 * drawer) while the composer floats fixed at the bottom of the viewport,
 * always visible regardless of scroll — ported from AllyBrain's Layout/AskBar.
 */
export function InlineShell() {
  const store = useNewChatStore();
  const messages = store((s) => s.messages);
  const askStarterPrompt = store((s) => s.askStarterPrompt);
  const askFreeText = store((s) => s.askFreeText);

  return (
    <div className="h-full overflow-y-auto">
      <div className="flex flex-col gap-6 pb-28">
        <ExecutiveSummaryNarrative />

        <section aria-label="Ask about this report" className="flex flex-col gap-4">
          {messages.length > 0 ? <ChatTranscript store={store} /> : null}
          <StarterPromptChips onSelect={askStarterPrompt} />
        </section>
      </div>

      <FloatingAskBar onSubmit={askFreeText} />
    </div>
  );
}
