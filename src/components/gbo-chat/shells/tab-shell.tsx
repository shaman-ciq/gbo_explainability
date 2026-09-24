"use client";

import { Sparkles } from "lucide-react";

import { ChatComposer } from "../chat-composer";
import { ChatHistoryMenu } from "../chat-history-menu";
import type { ChatStore } from "../chat-store";
import { ChatTranscript } from "../chat-transcript";
import { HistoryPolicyNote } from "../history-note";
import { MoreQuestions } from "../more-questions";
import { NewChatButton } from "../new-chat-button";
import { StarterPromptChips } from "../starter-prompt-chips";

/**
 * Variant B — Tab. Fully pull-based: nothing from the Budget Pacing email /
 * Executive Summary narrative is pre-rendered here. The user has to ask.
 * Modeled on the RMM Ask AI reference: greeting, categorized starter prompts,
 * New Chat + History controls, persistent bottom input, no other page content.
 */
export function TabShell({ store }: { store: ChatStore }) {
  const messages = store((s) => s.messages);
  const askStarterPrompt = store((s) => s.askStarterPrompt);
  const askFreeText = store((s) => s.askFreeText);
  const reset = store((s) => s.reset);

  const hasStarted = messages.length > 0;

  return (
    <div className="mx-auto flex h-full max-w-2xl flex-col">
      <div className="flex shrink-0 items-center justify-between border-b border-slate-100 py-2">
        <NewChatButton onReset={reset} disabled={!hasStarted} />
        <ChatHistoryMenu store={store} />
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto py-6">
        {!hasStarted ? (
          <div className="flex flex-col items-center gap-6 pt-10 text-center">
            <div className="flex size-11 items-center justify-center rounded-full bg-brand-50">
              <Sparkles className="size-5 text-brand-500" />
            </div>
            <h1 className="text-xl font-semibold text-slate-900">
              Hi, what would you like to know about this month&apos;s pacing?
            </h1>
            <StarterPromptChips onSelect={askStarterPrompt} className="w-full text-left" />
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <ChatTranscript store={store} />
            <MoreQuestions onSelect={askStarterPrompt} started />
          </div>
        )}
      </div>

      <div className="shrink-0 space-y-1.5 border-t border-slate-100 pt-3">
        <ChatComposer onSubmit={askFreeText} placeholder="Ask about your GBO performance…" autoFocus />
        <HistoryPolicyNote className="px-1 text-center text-2xs text-muted-foreground" />
      </div>
    </div>
  );
}
