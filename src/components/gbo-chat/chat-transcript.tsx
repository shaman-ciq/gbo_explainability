"use client";

import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";
import { ChatMessageBubble, ChatTypingIndicator } from "./chat-message-bubble";
import type { ChatStore } from "./chat-store";
import { FollowUpChips } from "./starter-prompt-chips";

/** Message list for one chat store: auto-scrolls to the newest turn, shows a typing dot while resolving. */
export function ChatTranscript({ store, className }: { store: ChatStore; className?: string }) {
  const messages = store((s) => s.messages);
  const isResponding = store((s) => s.isResponding);
  const askStarterPrompt = store((s) => s.askStarterPrompt);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length, isResponding]);

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {messages.map((message) => (
        <div key={message.id} className="flex flex-col gap-2">
          <ChatMessageBubble message={message} store={store} />
          {message.role === "assistant" && message.followUpIds?.length ? (
            <FollowUpChips promptIds={message.followUpIds} onSelect={askStarterPrompt} />
          ) : null}
        </div>
      ))}
      {isResponding ? <ChatTypingIndicator /> : null}
      <div ref={endRef} />
    </div>
  );
}
