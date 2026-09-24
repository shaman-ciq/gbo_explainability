"use client";

import { ChevronDown, Sparkles } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";
import { StarterPromptChips } from "./starter-prompt-chips";

/**
 * The starter-prompt category picker, always reachable — open by default
 * before a conversation starts, collapsed behind a toggle once one exists so
 * a seeded/ongoing thread doesn't bury itself under the full prompt list.
 */
export function MoreQuestions({
  onSelect,
  started,
}: {
  onSelect: (promptId: string) => void;
  started: boolean;
}) {
  const [open, setOpen] = useState(!started);

  if (!started) {
    return (
      <div className="space-y-3">
        <p className="text-sm text-slate-500">
          Ask about pacing, drivers, or what to do next — grounded in the numbers on this page.
        </p>
        <StarterPromptChips onSelect={onSelect} />
      </div>
    );
  }

  return (
    <div className="border-t border-slate-100 pt-3">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-2 text-xs font-medium text-slate-500 hover:text-slate-800"
      >
        <span className="flex items-center gap-1.5">
          <Sparkles className="size-3.5 text-brand-500" />
          Ask something else
        </span>
        <ChevronDown className={cn("size-3.5 transition-transform", open && "rotate-180")} />
      </button>
      {open ? <StarterPromptChips onSelect={onSelect} className="mt-2.5" /> : null}
    </div>
  );
}
