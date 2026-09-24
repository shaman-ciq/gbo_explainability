import { RotateCcw } from "lucide-react";

import { cn } from "@/lib/utils";

/** Explicit reset control — the one way to clear a thread within a session (see history-note.tsx for the policy). */
export function NewChatButton({
  onReset,
  disabled,
  className,
}: {
  onReset: () => void;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onReset}
      disabled={disabled}
      className={cn(
        "flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800 disabled:pointer-events-none disabled:opacity-40",
        className,
      )}
    >
      <RotateCcw className="size-3.5" />
      New chat
    </button>
  );
}
