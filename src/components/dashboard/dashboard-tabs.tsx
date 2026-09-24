"use client";

import { MessageSquare } from "lucide-react";

import { cn } from "@/lib/utils";
import type { Variant } from "@/components/experience-switcher";

export type DashboardTabId = "analytics" | "executive-summary" | "chat";

/**
 * Analytics | Executive Summary, plus a third "Chat" tab that only exists in
 * Variant B (Tab). Analytics is otherwise untouched by the chat prototype.
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
  const showChatTab = variant === "tab";

  return (
    <div role="tablist" className="flex gap-5 border-b border-slate-200 px-5">
      <TabButton active={active === "analytics"} onClick={() => onChange("analytics")}>
        Analytics
      </TabButton>
      <TabButton active={active === "executive-summary"} onClick={() => onChange("executive-summary")}>
        Executive Summary
      </TabButton>
      {showChatTab ? (
        <TabButton active={active === "chat"} onClick={() => onChange("chat")}>
          <span className="flex items-center gap-1.5">
            <MessageSquare className="size-3.5" />
            Chat
          </span>
        </TabButton>
      ) : null}
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
