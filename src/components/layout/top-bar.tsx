import { ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";

export function TopBar() {
  return (
    <header className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-white px-5 py-4">
      <div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span>Advertising</span>
          <ChevronRight className="size-3" />
          <span>Optimization</span>
        </div>
        <h1 className="mt-0.5 text-lg font-semibold text-slate-900">AI Goal Optimizer</h1>
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
