import { FormattedText } from "@/components/ui/formatted-text";
import { InfoLabel } from "@/components/ui/info-label";
import { pacing } from "@/lib/mock/gbo-data";
import { cn } from "@/lib/utils";

const PROJECTED_STRIPE =
  "repeating-linear-gradient(-45deg, transparent, transparent 3px, rgba(255,255,255,0.6) 3px, rgba(255,255,255,0.6) 6px)";

/**
 * FR-013 — Projected spend & utilisation: Current MTD (solid), Projected
 * month-end (striped), Target (100%, tick) on one scale. Matches the
 * reference Analytics tab's own widget of the same name.
 */
export function ProjectedSpendUtilisationCard() {
  const currentPct = pacing.pct;
  const projectedPct = pacing.projectedUtilisationPct;
  const scaleMax = Math.max(100, projectedPct, currentPct);
  const toPos = (pct: number) => (pct / scaleMax) * 100;

  return (
    <section className="shadow-pane overflow-hidden rounded-xl bg-white">
      <header className="flex items-center gap-2 border-b border-slate-100 px-4 py-3">
        <h2 className="text-sm font-semibold text-slate-900">Projected spend &amp; utilisation</h2>
        <InfoLabel tooltip="Projects month-end spend and utilization from the current run-rate, and compares it against the monthly budget target." />
      </header>

      <div className="space-y-5 p-4">
        <div>
          <p className="text-sm text-slate-500">Projected month-end</p>
          <div className="mt-1.5 flex flex-wrap items-baseline gap-x-6 gap-y-1">
            <p className="text-3xl font-bold tracking-tight tabular-nums text-slate-900">
              {pacing.projectedSpend}
            </p>
            <p className="flex items-baseline gap-1.5">
              <span className="text-xl font-semibold tracking-tight tabular-nums text-slate-700">
                {projectedPct}%
              </span>
              <span className="text-sm text-slate-500">utilisation</span>
            </p>
          </div>
        </div>

        <div>
          <p className="mb-4 text-sm leading-snug text-slate-600">
            <FormattedText
              text={`Projected month-end **${pacing.projectedSpend}** (**${projectedPct}%**) is **${pacing.projectedVsPlan}** (**${pacing.projectedVsPlanPct}%**) under the **${pacing.monthlyPlan}** budget; current MTD is **${pacing.actualMtd}** (**${currentPct}%**).`}
            />
          </p>

          <div className="relative pt-6 pb-7">
            <div className="relative h-3.5 overflow-hidden rounded-full bg-slate-100">
              <div
                className="absolute inset-y-0 left-0 bg-warning-300"
                style={{ width: `${toPos(projectedPct)}%`, backgroundImage: PROJECTED_STRIPE }}
              />
              <div className="absolute inset-y-0 left-0 bg-brand-500" style={{ width: `${toPos(currentPct)}%` }} />
            </div>

            <Tick pos={toPos(currentPct)} color="bg-brand-600" />
            <Tick pos={toPos(projectedPct)} color="bg-warning-600" />
            <Tick pos={toPos(100)} color="bg-slate-900" />

            <Label pos={toPos(currentPct)} above={false} value={pacing.actualMtd} sub={`${currentPct}%`} />
            <Label pos={toPos(projectedPct)} above value={pacing.projectedSpend} sub={`${projectedPct}%`} />
            <Label pos={toPos(100)} above={false} value={pacing.monthlyPlan} sub="100%" align="end" />
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600">
            <Legend swatchClass="bg-brand-500" label="Current" />
            <Legend swatchClass="bg-warning-300" swatchStripe label="Projected" />
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2.5 w-px bg-slate-900" />
              Target (100%)
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

function Tick({ pos, color }: { pos: number; color: string }) {
  return (
    <div
      className={cn("absolute top-6 h-3.5 w-0.5 -translate-x-1/2", color)}
      style={{ left: `${pos}%` }}
    />
  );
}

function Label({
  pos,
  above,
  value,
  sub,
  align = "middle",
}: {
  pos: number;
  above: boolean;
  value: string;
  sub: string;
  align?: "middle" | "end";
}) {
  return (
    <div
      className={cn(
        "absolute flex flex-col",
        above ? "bottom-[calc(100%-1.25rem)] items-center" : "top-[calc(100%-0.75rem)] items-center",
        align === "end" ? "items-end" : "items-center",
      )}
      style={{
        left: align === "end" ? undefined : `${pos}%`,
        right: align === "end" ? `${100 - pos}%` : undefined,
        transform: align === "end" ? undefined : "translateX(-50%)",
      }}
    >
      <span className="text-xs font-semibold tabular-nums text-slate-900">{value}</span>
      <span className="text-2xs tabular-nums text-slate-400">{sub}</span>
    </div>
  );
}

function Legend({
  swatchClass,
  swatchStripe,
  label,
}: {
  swatchClass: string;
  swatchStripe?: boolean;
  label: string;
}) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        className={cn("size-2.5 rounded-sm", swatchClass)}
        style={swatchStripe ? { backgroundImage: PROJECTED_STRIPE } : undefined}
      />
      {label}
    </span>
  );
}
