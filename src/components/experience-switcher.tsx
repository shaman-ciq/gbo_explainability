"use client";

import { cn } from "@/lib/utils";

export type Variant = "pane" | "tab" | "inline";

export const VARIANTS: { id: Variant; label: string; description: string }[] = [
  { id: "pane", label: "A · Pane", description: "Narrative + docked chat pane" },
  { id: "tab", label: "B · Tab", description: "Chat-only, pull-based, own tab" },
  { id: "inline", label: "C · Inline", description: "Narrative + chat appended below" },
];

export function ExperienceSwitcher({
  value,
  onChange,
}: {
  value: Variant;
  onChange: (variant: Variant) => void;
}) {
  const active = VARIANTS.find((v) => v.id === value) ?? VARIANTS[0];

  return (
    <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-b border-slate-200/70 bg-slate-50/60 px-5 py-2.5">
      <div className="shadow-pane flex items-center gap-0.5 rounded-lg bg-white p-0.5">
        {VARIANTS.map((v) => (
          <button
            key={v.id}
            type="button"
            onClick={() => onChange(v.id)}
            className={cn(
              "rounded-md px-3 py-1.5 text-xs font-semibold transition-all duration-200",
              v.id === value
                ? "shadow-brand bg-brand-500 text-white"
                : "text-slate-500 hover:bg-slate-100 hover:text-slate-800",
            )}
          >
            {v.label}
          </button>
        ))}
      </div>
      <p className="text-xs text-muted-foreground">{active.description}</p>
    </div>
  );
}
