import { Info } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Hover-triggered explainer bubble for small info icons next to card/table
 * headers. `align="end"` (default) anchors the bubble's right edge to the
 * icon so it extends leftward — right for icons near a page/card's right
 * edge. `align="start"` anchors the left edge instead, extending rightward —
 * use it for headers near the left edge (e.g. a table's first column) where
 * extending left would run off-screen.
 */
export function InfoTooltip({
  text,
  align = "end",
  className,
}: {
  text: string;
  align?: "start" | "end";
  className?: string;
}) {
  return (
    <span className={cn("group relative inline-flex", className)}>
      <Info className="size-3.5 shrink-0 cursor-help text-slate-400" />
      <span
        role="tooltip"
        className={cn(
          "pointer-events-none absolute top-full z-50 mt-2 w-60 rounded-lg bg-slate-900 px-2.5 py-1.5 text-left text-2xs leading-snug font-normal text-white opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100",
          align === "end" ? "right-0" : "left-0",
        )}
      >
        <span
          className={cn(
            "absolute bottom-full border-4 border-transparent border-b-slate-900",
            align === "end" ? "right-1" : "left-1",
          )}
        />
        {text}
      </span>
    </span>
  );
}
