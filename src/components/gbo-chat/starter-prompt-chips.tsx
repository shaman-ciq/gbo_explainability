"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";
import {
  PROMPT_CATEGORIES,
  promptsByCategory,
  STARTER_PROMPTS,
  type PromptCategory,
} from "./starter-prompts";

const STARTER_PROMPTS_BY_ID = Object.fromEntries(STARTER_PROMPTS.map((p) => [p.id, p]));

/** Category tabs + question chips, same shape as the RMM Ask AI "Popular Prompts" panel. */
export function StarterPromptChips({
  onSelect,
  className,
}: {
  onSelect: (promptId: string) => void;
  className?: string;
}) {
  const [active, setActive] = useState<PromptCategory>(PROMPT_CATEGORIES[0].id);

  return (
    <div className={cn("space-y-2.5", className)}>
      <div className="flex flex-wrap gap-1.5">
        {PROMPT_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setActive(cat.id)}
            className={cn(
              "rounded-full border px-2.5 py-1 text-xs font-medium transition-colors",
              active === cat.id
                ? "border-brand-500 bg-brand-50 text-brand-700"
                : "border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-900",
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-1.5">
        {promptsByCategory(active).map((prompt) => (
          <button
            key={prompt.id}
            type="button"
            onClick={() => onSelect(prompt.id)}
            className="rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-left text-sm text-slate-700 transition-colors hover:border-brand-300 hover:bg-brand-50/50"
          >
            {prompt.question}
          </button>
        ))}
      </div>
    </div>
  );
}

/** Small inline follow-up chips shown under an assistant message (AllyBrain-style, retire on click). */
export function FollowUpChips({
  promptIds,
  onSelect,
}: {
  promptIds: string[];
  onSelect: (promptId: string) => void;
}) {
  const items = promptIds
    .map((id) => STARTER_PROMPTS_BY_ID[id])
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  if (items.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1.5 pl-9">
      {items.map((prompt) => (
        <button
          key={prompt.id}
          type="button"
          onClick={() => onSelect(prompt.id)}
          className="rounded-full border border-brand-200 bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-700 transition-colors hover:bg-brand-100"
        >
          {prompt.question}
        </button>
      ))}
    </div>
  );
}
