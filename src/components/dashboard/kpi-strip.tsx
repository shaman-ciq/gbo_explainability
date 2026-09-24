import { pacing } from "@/lib/mock/gbo-data";
import { cn } from "@/lib/utils";

/**
 * A compact, scannable KPI row that stands in for the old three-bullet prose
 * block — the same numbers, read in one glance instead of three sentences.
 */
export function KpiStrip() {
  const tiles = [
    {
      label: "Account pacing MTD",
      value: `${pacing.pct}%`,
      tone: "error" as const,
      barPct: pacing.pct,
    },
    {
      label: "Actual vs planned MTD",
      value: pacing.actualMtd,
      sub: `of ${pacing.plannedMtd} planned`,
    },
    {
      label: "Projected month-end",
      value: `${pacing.projectedUtilisationPct}%`,
      tone: "error" as const,
      sub: `${pacing.projectedVsPlan} vs ${pacing.monthlyPlan} plan`,
      barPct: pacing.projectedUtilisationPct,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      {tiles.map((t, i) => (
        <div
          key={t.label}
          style={{ animationDelay: `${i * 60}ms` }}
          className="shadow-pane fade-in-up rounded-xl bg-white p-3.5"
        >
          <p className="text-2xs font-semibold tracking-wide text-slate-400 uppercase">{t.label}</p>
          <p
            className={cn(
              "mt-1 text-xl font-semibold tabular-nums tracking-tight",
              t.tone === "error" ? "text-error-600" : "text-slate-900",
            )}
          >
            {t.value}
          </p>
          {t.sub ? <p className="mt-0.5 text-xs text-muted-foreground">{t.sub}</p> : null}
          {t.barPct !== undefined ? (
            <div className="mt-2 h-1 overflow-hidden rounded-full bg-slate-100">
              <div
                className={cn("h-full rounded-full", t.tone === "error" ? "bg-error-500" : "bg-brand-500")}
                style={{ width: `${Math.min(t.barPct, 100)}%` }}
              />
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}
