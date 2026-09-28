"use client";

import { Sparkles } from "lucide-react";
import { useState } from "react";

import { ChatComposer } from "./chat-composer";
import type { ChatStore } from "./chat-store";
import { ChatTranscript } from "./chat-transcript";
import { ChatViewTabs, type ChatView } from "./chat-view-tabs";
import { HistoryView } from "./history-view";
import { MoreQuestions } from "./more-questions";
import { NewChatButton } from "./new-chat-button";
import { StarterPromptChips } from "./starter-prompt-chips";

/**
 * The full chat engine UI — New chat / Conversation-History tabs, greeting or
 * transcript, composer — shared by both approaches: standalone (Chat-only,
 * centered) and embedded next to the condensed summary panel (Chat + Summary,
 * full width). Fully pull-based: nothing is pre-rendered here, the user asks.
 */
export function ChatSurface({
  store,
  greeting = "Hi, what would you like to know about this month's pacing?",
  placeholder = "Ask about your GBO performance…",
}: {
  store: ChatStore;
  greeting?: string;
  placeholder?: string;
}) {
  const messages = store((s) => s.messages);
  const history = store((s) => s.history);
  const askStarterPrompt = store((s) => s.askStarterPrompt);
  const askFreeText = store((s) => s.askFreeText);
  const reset = store((s) => s.reset);
  const [view, setView] = useState<ChatView>("conversation");

  const hasStarted = messages.length > 0;

  return (
    <div className="flex h-full flex-col">
      <div className="flex shrink-0 items-center justify-between gap-2 border-b border-slate-100 py-2.5">
        <NewChatButton
          onReset={() => {
            reset();
            setView("conversation");
          }}
          disabled={!hasStarted}
        />
        <ChatViewTabs view={view} onChange={setView} historyCount={history.length} />
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto py-6">
        {view === "history" ? (
          <HistoryView store={store} onSelect={() => setView("conversation")} />
        ) : !hasStarted ? (
          <div className="mx-auto flex max-w-xl flex-col items-center gap-6 pt-10 text-center">
            <div className="bg-brand-gradient-soft flex size-11 items-center justify-center rounded-full">
              <Sparkles className="size-5 text-brand-600" />
            </div>
            <h1 className="text-xl font-semibold text-slate-900">{greeting}</h1>
            <StarterPromptChips onSelect={askStarterPrompt} className="w-full text-left" />
          </div>
        ) : (
          <div className="mx-auto flex max-w-2xl flex-col gap-4">
            <ChatTranscript store={store} />
            <MoreQuestions onSelect={askStarterPrompt} started />
          </div>
        )}
      </div>

      <div className="mx-auto w-full max-w-2xl shrink-0 border-t border-slate-100 pt-3">
        <ChatComposer onSubmit={askFreeText} placeholder={placeholder} autoFocus />
      </div>
    </div>
  );
}
