"use client";

import { cn } from "@/lib/utils";

export type ChatView = "conversation" | "history";

/** Conversation vs History as real tabs — switching view, not popping a bubble over it. */
export function ChatViewTabs({
  view,
  onChange,
  historyCount,
}: {
  view: ChatView;
  onChange: (view: ChatView) => void;
  historyCount: number;
}) {
  return (
    <div className="flex items-center gap-0.5 rounded-lg bg-slate-100 p-0.5">
      <TabButton active={view === "conversation"} onClick={() => onChange("conversation")}>
        Conversation
      </TabButton>
      <TabButton active={view === "history"} onClick={() => onChange("history")}>
        History
        {historyCount > 0 ? (
          <span
            className={cn(
              "flex size-4 items-center justify-center rounded-full text-2xs font-semibold",
              view === "history" ? "bg-brand-100 text-brand-700" : "bg-slate-200 text-slate-600",
            )}
          >
            {historyCount}
          </span>
        ) : null}
      </TabButton>
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
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold transition-all duration-150",
        active ? "shadow-pane bg-white text-slate-900" : "text-slate-500 hover:text-slate-800",
      )}
    >
      {children}
    </button>
  );
}
