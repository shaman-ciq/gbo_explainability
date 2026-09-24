import { Sparkles } from "lucide-react";

import { Avatar } from "@/components/ui/avatar";
import { FormattedText } from "@/components/ui/formatted-text";
import { cn } from "@/lib/utils";
import type { ChatMessage } from "./chat-store";

export function ChatMessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";

  return (
    <div className={cn("flex gap-2.5", isUser && "flex-row-reverse")}>
      <Avatar tone={isUser ? "slate" : "brand"} className="mt-0.5">
        {isUser ? "You" : <Sparkles className="size-3.5" />}
      </Avatar>
      <div className={cn("max-w-[85%] space-y-1.5", isUser && "items-end text-right")}>
        <div
          className={cn(
            "rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-line",
            isUser
              ? "rounded-tr-sm bg-brand-500 text-white"
              : "rounded-tl-sm border border-slate-200 bg-white text-slate-800",
          )}
        >
          <FormattedText text={message.text} />
        </div>
        {message.source ? (
          <p className="px-1 text-2xs text-muted-foreground">Source: {message.source}</p>
        ) : null}
      </div>
    </div>
  );
}

export function ChatTypingIndicator() {
  return (
    <div className="flex items-center gap-2.5">
      <Avatar tone="brand">
        <Sparkles className="size-3.5" />
      </Avatar>
      <div className="flex items-center gap-1 rounded-2xl rounded-tl-sm border border-slate-200 bg-white px-3.5 py-3">
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
