"use client";

import { ArrowUp, Sparkles } from "lucide-react";
import { useState } from "react";

/**
 * A persistent floating composer, pinned to the viewport regardless of scroll
 * position — ported from AllyBrain's Layout.jsx AskBar. Always visible, not
 * opened via a toggle; the conversation itself renders inline in the page.
 */
export function FloatingAskBar({
  onSubmit,
  placeholder = "Ask about this report…",
}: {
  onSubmit: (text: string) => void;
  placeholder?: string;
}) {
  const [value, setValue] = useState("");

  const submit = () => {
    if (!value.trim()) return;
    onSubmit(value);
    setValue("");
  };

  return (
    <>
      {/* Frosted scrim so content scrolling underneath fades out before the bar, never under it. */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 bottom-0 z-40 h-28 bg-gradient-to-t from-slate-50 via-slate-50/70 to-transparent backdrop-blur-[6px] [mask-image:linear-gradient(to_top,black_75%,transparent)]"
      />
      <div className="fixed inset-x-6 bottom-4 z-50 mx-auto max-w-[640px]">
        <div className="shadow-popover flex items-center gap-2 rounded-full bg-white/90 p-2 ring-1 ring-slate-900/5 backdrop-blur-xl">
          <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600">
            <Sparkles className="size-3.5" />
          </span>
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") submit();
            }}
            placeholder={placeholder}
            aria-label="Ask about this report"
            className="min-w-0 flex-1 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
          />
          <button
            type="button"
            onClick={submit}
            disabled={!value.trim()}
            aria-label="Send"
            className="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand-500 text-white transition-colors hover:bg-brand-600 disabled:opacity-40"
          >
            <ArrowUp className="size-4" />
          </button>
        </div>
      </div>
    </>
  );
}
