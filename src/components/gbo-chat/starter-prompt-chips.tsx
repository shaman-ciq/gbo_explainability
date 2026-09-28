import { cn } from "@/lib/utils";
import { CATEGORY_PRIMARY_PROMPT_ID, PROMPT_CATEGORIES, STARTER_PROMPTS } from "./starter-prompts";

const STARTER_PROMPTS_BY_ID = Object.fromEntries(STARTER_PROMPTS.map((p) => [p.id, p]));

/**
 * Category chips that generate their commentary instantly on click — modeled
 * on the Budget Pacing email's section tabs, not a two-step menu. The other
 * prompt in each category surfaces afterward as a follow-up chip.
 */
export function StarterPromptChips({
  onSelect,
  className,
}: {
  onSelect: (promptId: string) => void;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-wrap justify-center gap-1.5", className)}>
      {PROMPT_CATEGORIES.map((cat, i) => (
        <button
          key={cat.id}
          type="button"
          onClick={() => onSelect(CATEGORY_PRIMARY_PROMPT_ID[cat.id])}
          style={{ animationDelay: `${i * 40}ms` }}
          className="shadow-pane fade-in-up hover:shadow-pane-hover rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition-all duration-150 hover:-translate-y-0.5 hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700"
        >
          {cat.label}
        </button>
      ))}
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
