"use client";

import { Sparkles } from "lucide-react";

import { ChatComposer } from "../chat-composer";
import { useNewChatStore } from "../chat-store";
import { ChatTranscript } from "../chat-transcript";
import { StarterPromptChips } from "../starter-prompt-chips";

/**
 * Variant B — Tab. Fully pull-based: nothing from the Budget Pacing email /
 * Executive Summary narrative is pre-rendered here. The user has to ask.
 * Modeled on the RMM Ask AI reference: greeting, categorized starter prompts,
 * persistent bottom input, no other page content.
 */
export function TabShell() {
  const store = useNewChatStore();
  const messages = store((s) => s.messages);
  const askStarterPrompt = store((s) => s.askStarterPrompt);
  const askFreeText = store((s) => s.askFreeText);

  const hasStarted = messages.length > 0;

  return (
    <div className="mx-auto flex h-full max-w-2xl flex-col">
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
          <ChatTranscript store={store} />
        )}
      </div>

      <div className="shrink-0 border-t border-slate-100 pt-3">
        <ChatComposer onSubmit={askFreeText} placeholder="Ask about your GBO performance…" autoFocus />
      </div>
    </div>
  );
}
