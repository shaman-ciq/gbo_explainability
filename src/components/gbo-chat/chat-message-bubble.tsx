import { Sparkles } from "lucide-react";

import { FormattedText } from "@/components/ui/formatted-text";
import { cn } from "@/lib/utils";
import { ChatVisualCard } from "./chat-visuals";
import type { ChatMessage, ChatStore } from "./chat-store";

export function ChatMessageBubble({ message, store }: { message: ChatMessage; store?: ChatStore }) {
  const isUser = message.role === "user";

  return (
    <div className={cn("fade-in-up flex gap-2.5", isUser && "flex-row-reverse")}>
      <MessageAvatar isUser={isUser} />
      <div className={cn("min-w-0 max-w-[88%] space-y-2", isUser && "items-end text-right")}>
        <div
          className={cn(
            "rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-line",
            isUser ? "rounded-tr-sm bg-brand-500 text-white" : "shadow-pane rounded-tl-sm bg-white text-slate-800",
          )}
        >
          <FormattedText text={message.text} />
        </div>
        {message.visual ? <ChatVisualCard visual={message.visual} store={store} /> : null}
        {message.source ? (
          <p className="px-1 text-2xs text-muted-foreground">Source: {message.source}</p>
        ) : null}
      </div>
    </div>
  );
}

function MessageAvatar({ isUser }: { isUser: boolean }) {
  if (isUser) {
    return (
      <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-slate-200 text-2xs font-semibold text-slate-700">
        You
      </span>
    );
  }
  return (
    <span className="shadow-brand mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg bg-brand-500 text-white">
      <Sparkles className="size-3.5" />
    </span>
  );
}

export function ChatTypingIndicator() {
  return (
    <div className="fade-in-up flex items-center gap-2.5">
      <MessageAvatar isUser={false} />
      <div className="shadow-pane flex items-center gap-1 rounded-2xl rounded-tl-sm bg-white px-3.5 py-3">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="size-1.5 animate-bounce rounded-full bg-slate-400"
            style={{ animationDelay: `${i * 120}ms` }}
          />
        ))}
      </div>
    </div>
  );
}
