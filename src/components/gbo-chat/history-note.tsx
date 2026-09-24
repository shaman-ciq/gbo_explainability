/**
 * The deliberate history policy for all variants, stated once and reused:
 * a thread survives switching tabs/sections within this visit (it's one continuous
 * conversation, not lost the moment you glance at Analytics), but nothing is
 * persisted past a reload — this page is MTD/T-1 and refreshes daily, so
 * yesterday's answers would just be citing stale numbers. "New chat" is the
 * only in-session reset.
 *
 * `hasHistory` names the actual "History" tab in Pane/Tab so the caption reads
 * as an explanation of that feature, not a generic disclaimer sitting next to it.
 */
export function HistoryPolicyNote({
  className,
  hasHistory = false,
}: {
  className?: string;
  hasHistory?: boolean;
}) {
  return (
    <p className={className}>
      {hasHistory
        ? "History only covers today's session — it clears on reload, since these figures refresh daily."
        : "Stays while you're on this page today — clears on reload, since figures refresh daily."}
    </p>
  );
}
