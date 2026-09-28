"use client";

import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { CondensedSummaryPanel } from "@/components/dashboard/condensed-summary-panel";
import { cn } from "@/lib/utils";
import { ChatSurface } from "../chat-surface";
import type { ChatStore } from "../chat-store";

/**
 * Approach 2 — Chat + Summary. Chat is the primary surface and takes most of
 * the width; the Executive Summary is a condensed panel on the left (titles
 * first, expand what you need), not an equal-width column.
 */
export function ChatSummaryShell({ store }: { store: ChatStore }) {
  const [panelOpen, setPanelOpen] = useState(true);

  return (
    <div className="flex h-full items-stretch gap-4">
      {panelOpen ? (
        <aside className="w-[320px] shrink-0 overflow-y-auto pr-0.5">
          <div className="flex items-center justify-between gap-2 pb-2">
            <p className="text-2xs font-semibold tracking-wide text-slate-400 uppercase">Summary panel</p>
            <Button variant="ghost" size="icon" onClick={() => setPanelOpen(false)} aria-label="Collapse summary panel">
              <PanelLeftClose className="size-4" />
            </Button>
          </div>
          <CondensedSummaryPanel />
        </aside>
      ) : (
        <Button
          variant="outline"
          size="icon"
          onClick={() => setPanelOpen(true)}
          aria-label="Open summary panel"
          className="sticky top-0 shrink-0 self-start"
        >
          <PanelLeftOpen className="size-4" />
        </Button>
      )}

      <div className={cn("min-w-0 flex-1", !panelOpen && "max-w-none")}>
        <ChatSurface store={store} greeting="What would you like to know about this report?" />
      </div>
    </div>
  );
}
