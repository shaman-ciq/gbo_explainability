"use client";

import { MessageSquare } from "lucide-react";

import { cn } from "@/lib/utils";
import type { Variant } from "@/components/experience-switcher";

export type DashboardTabId = "analytics" | "executive-summary" | "chat";

/**
 * The tab set depends on the approach: "chat-only" has no pushed narrative at
 * all, so its second tab is Chat directly; "chat-summary" folds chat into the
 * Executive Summary tab (as a panel + chat layout), so there's no separate
 * Chat tab there.
 */
export function DashboardTabs({
  variant,
  active,
  onChange,
}: {
  variant: Variant;
  active: DashboardTabId;
  onChange: (tab: DashboardTabId) => void;
}) {
  const isChatOnly = variant === "chat-only";

  return (
    <div role="tablist" className="flex gap-5 border-b border-slate-200 px-5">
      <TabButton active={active === "analytics"} onClick={() => onChange("analytics")}>
        Analytics
      </TabButton>
      {isChatOnly ? (
        <TabButton active={active === "chat"} onClick={() => onChange("chat")}>
          <span className="flex items-center gap-1.5">
            <MessageSquare className="size-3.5" />
            Chat
          </span>
        </TabButton>
      ) : (
        <TabButton active={active === "executive-summary"} onClick={() => onChange("executive-summary")}>
          Executive Summary
        </TabButton>
      )}
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={cn(
        "-mb-px border-b-2 px-1 pb-3 pt-0.5 text-sm transition-colors",
        active
          ? "border-brand-500 font-semibold text-slate-900"
          : "border-transparent font-medium text-slate-500 hover:border-slate-200 hover:text-slate-700",
      )}
    >
      {children}
    </button>
  );
}
