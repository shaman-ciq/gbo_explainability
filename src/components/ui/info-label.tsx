import { CircleHelp } from "lucide-react";

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

type InfoLabelProps = {
  label?: string;
  tooltip?: string;
  className?: string;
};

/** A label with a hover-triggered definition — the DS pattern for column/section headers that need explaining. */
export function InfoLabel({ label, tooltip, className }: InfoLabelProps) {
  return (
    <span className={cn("inline-flex items-center gap-1", className)}>
      {label}
      <Tooltip>
        <TooltipTrigger
          className="inline-flex shrink-0 cursor-help text-slate-400 hover:text-slate-600"
          aria-label={label ? `More info about ${label}` : "More info"}
        >
          <CircleHelp className="size-3.5" />
        </TooltipTrigger>
        {tooltip ? <TooltipContent>{tooltip}</TooltipContent> : null}
      </Tooltip>
    </span>
  );
}
