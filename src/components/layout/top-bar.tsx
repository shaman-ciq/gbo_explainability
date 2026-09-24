import { ChevronRight, Target } from "lucide-react";

import { Button } from "@/components/ui/button";

export function TopBar() {
  return (
    <header className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-slate-200/70 bg-white/80 px-5 py-3.5 backdrop-blur-xl">
      <div className="flex items-center gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-brand-500 text-white shadow-brand">
          <Target className="size-4.5" />
        </span>
        <div>
          <div className="flex items-center gap-1.5 text-2xs font-medium tracking-wide text-slate-400 uppercase">
            <span>Advertising</span>
            <ChevronRight className="size-3" />
            <span>Optimization</span>
          </div>
          <h1 className="text-lg leading-tight font-semibold tracking-tight text-slate-900">AI Goal Optimizer</h1>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm">
          Edit optimization
        </Button>
        <Button variant="secondary" size="sm">
          Alerts
        </Button>
      </div>
    </header>
  );
}
