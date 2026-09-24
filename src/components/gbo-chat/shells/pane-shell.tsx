"use client";

import { PanelRightClose, PanelRightOpen, Sparkles } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { ExecutiveSummaryNarrative } from "@/components/dashboard/executive-summary-narrative";
import { cn } from "@/lib/utils";
import { ChatComposer } from "../chat-composer";
import { useNewChatStore } from "../chat-store";
import { ChatTranscript } from "../chat-transcript";
import { StarterPromptChips } from "../starter-prompt-chips";

/**
 * Variant A — Pane. Today's pushed narrative stays exactly as-is; a docked chat
 * pane sits alongside it for follow-up questions. Not an overlay drawer — a
 * permanent column, since this is a data-dense report page, not the exec landing page.
 */
export function PaneShell() {
  const store = useNewChatStore();
  const messages = store((s) => s.messages);
  const askStarterPrompt = store((s) => s.askStarterPrompt);
  const askFreeText = store((s) => s.askFreeText);
  const [paneOpen, setPaneOpen] = useState(true);

  return (
    <div className="flex h-full items-stretch gap-4">
      <div className={cn("min-w-0 flex-1 overflow-y-auto transition-all", !paneOpen && "max-w-none")}>
        <ExecutiveSummaryNarrative />
      </div>

      {paneOpen ? (
        <aside className="shadow-pane flex h-full w-[360px] shrink-0 flex-col overflow-hidden rounded-xl bg-white">
          <header className="flex shrink-0 items-center justify-between gap-2 border-b border-slate-100 px-3.5 py-3">
            <div className="flex items-center gap-2">
              <Sparkles className="size-4 text-brand-500" />
              <p className="text-sm font-semibold text-slate-900">Ask about this report</p>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setPaneOpen(false)} aria-label="Collapse chat pane">
              <PanelRightClose className="size-4" />
            </Button>
          </header>

          <div className="min-h-0 flex-1 overflow-y-auto px-3.5 py-3.5">
            {messages.length === 0 ? (
              <div className="space-y-3">
                <p className="text-sm text-slate-500">
                  Ask about pacing, drivers, or what to do next — grounded in the numbers on this page.
                </p>
                <StarterPromptChips onSelect={askStarterPrompt} />
              </div>
            ) : (
              <ChatTranscript store={store} />
            )}
          </div>

          <div className="shrink-0 border-t border-slate-100 p-3">
            <ChatComposer onSubmit={askFreeText} />
          </div>
        </aside>
      ) : (
        <Button
          variant="outline"
          size="icon"
          onClick={() => setPaneOpen(true)}
          aria-label="Open chat pane"
          className="sticky top-0 shrink-0 self-start"
        >
          <PanelRightOpen className="size-4" />
        </Button>
      )}
    </div>
  );
}
