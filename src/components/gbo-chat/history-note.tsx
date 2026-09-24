/**
 * The deliberate history policy for all three variants, stated once and reused:
 * a thread survives switching tabs/sections within this visit (it's one continuous
 * conversation, not lost the moment you glance at Analytics), but nothing is
 * persisted past a reload — this page is MTD/T-1 and refreshes daily, so
 * yesterday's answers would just be citing stale numbers. "New chat" is the
 * only in-session reset.
 */
export function HistoryPolicyNote({ className }: { className?: string }) {
  return (
    <p className={className}>
      Stays while you&apos;re on this page today — clears on reload, since figures refresh daily.
    </p>
  );
}
