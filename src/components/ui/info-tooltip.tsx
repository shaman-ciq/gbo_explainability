import { Info } from "lucide-react";

import { cn } from "@/lib/utils";

/** Hover-triggered explainer bubble for the small info icons next to card/table headers. */
export function InfoTooltip({ text, className }: { text: string; className?: string }) {
  return (
    <span className={cn("group relative inline-flex", className)}>
      <Info className="size-3.5 shrink-0 cursor-help text-slate-400" />
      <span
        role="tooltip"
        className="pointer-events-none absolute top-full right-0 z-50 mt-2 w-60 rounded-lg bg-slate-900 px-2.5 py-1.5 text-left text-2xs leading-snug font-normal text-white opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100"
      >
        <span className="absolute bottom-full right-1 border-4 border-transparent border-b-slate-900" />
        {text}
      </span>
    </span>
  );
}
