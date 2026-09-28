import { Fragment } from "react";

import {
  aggregateBudgetPlanRows,
  BUDGET_PLAN_GROUPS,
  BUDGET_PLAN_TOTAL_ROW,
  projectedUtilisationPct,
  type BudgetPlanLeafRow,
} from "@/lib/mock/budget-plan-data";
import { InfoTooltip } from "@/components/ui/info-tooltip";
import {
  formatPacingPercent,
  formatPlanUsd,
  getPacingBandStatus,
  pacingStatusLabel,
  pacingTone,
  pacingToneTextClass,
  ratioToPercent,
} from "@/lib/pacing-status";
import { cn } from "@/lib/utils";

const HEADERS = [
  "Portfolio",
  "Current Budget",
  "Planned MTD",
  "Actual MTD",
  "Pacing %",
  "Projected Utilisation",
  "Projected Spend",
  "Goal",
  "Goal Value",
  "Brand iROAS",
  "Budget / Bid Opt",
  "% Time in Budget",
];

function PacingStatusText({ pct }: { pct: number | null }) {
  if (pct === null) return <span className="text-slate-400">—</span>;
  const status = getPacingBandStatus(pct);
  const tone = pacingTone(pct, status);
  return (
    <span className={cn("font-medium tabular-nums whitespace-nowrap", pacingToneTextClass(tone))}>
      {pacingStatusLabel(status)} ({formatPacingPercent(pct)})
    </span>
  );
}

function PacingCell({ actualMtd, plannedMtd }: { actualMtd: number; plannedMtd: number }) {
  return <PacingStatusText pct={ratioToPercent(actualMtd, plannedMtd)} />;
}

function ProjectedUtilisationCell({ projectedSpend, currentBudget }: { projectedSpend: number; currentBudget: number }) {
  return <PacingStatusText pct={projectedUtilisationPct(projectedSpend, currentBudget)} />;
}

function IroasCell({ actual, goal }: { actual: number; goal: number }) {
  const onGoal = actual >= goal;
  return (
    <span className={cn("font-medium tabular-nums", onGoal ? "text-success-700" : "text-error-600")}>
      {actual.toFixed(1)}x
    </span>
  );
}

function LeafRow({ row }: { row: BudgetPlanLeafRow }) {
  return (
    <tr className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60">
      <td className="sticky left-0 bg-white py-2 pr-3 pl-8 text-slate-700">{row.level2}</td>
      <td className="px-3 py-2 tabular-nums text-slate-700">{formatPlanUsd(row.currentBudget)}</td>
      <td className="px-3 py-2 tabular-nums text-slate-700">{formatPlanUsd(row.plannedMtd)}</td>
      <td className="px-3 py-2 tabular-nums text-slate-700">{formatPlanUsd(row.actualMtd)}</td>
      <td className="px-3 py-2">
        <PacingCell actualMtd={row.actualMtd} plannedMtd={row.plannedMtd} />
      </td>
      <td className="px-3 py-2">
        <ProjectedUtilisationCell projectedSpend={row.projectedSpend} currentBudget={row.currentBudget} />
      </td>
      <td className="px-3 py-2 tabular-nums text-slate-700">{formatPlanUsd(row.projectedSpend)}</td>
      <td className="px-3 py-2 text-slate-700">{row.goalMetric}</td>
      <td className="px-3 py-2 tabular-nums text-slate-700">{row.goalValue.toFixed(1)}x</td>
      <td className="px-3 py-2">
        <IroasCell actual={row.actualMetricValue} goal={row.goalValue} />
      </td>
      <td className="px-3 py-2 text-slate-500">
        {row.budgetOpt} / {row.bidOpt}
      </td>
      <td className="px-3 py-2 tabular-nums text-slate-700">
        {row.percentTimeInBudget === null ? "—" : `${row.percentTimeInBudget.toFixed(1)}%`}
      </td>
    </tr>
  );
}

/**
 * FR-014 — Budget Plan: Level 1 rollups (bg-brand-50) over their Level 2 leaf
 * rows, a Consolidated Total row, and color-coded Pacing % / Projected
 * Utilisation / iROAS columns matching the reference Analytics tab.
 */
export function BudgetPlanTable() {
  return (
    <section className="shadow-pane overflow-hidden rounded-xl bg-white">
      <header className="flex items-center gap-2 border-b border-slate-100 px-4 py-3">
        <h2 className="text-sm font-semibold text-slate-900">Budget Plan</h2>
        <InfoTooltip text="Portfolio (Level 1/Level 2) budget, pacing, and efficiency vs. goal, rolled up from Ally AI's daily budget and bid decisions." />
      </header>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[1100px] text-left text-xs">
          <thead>
            <tr className="border-b border-slate-200 text-2xs font-semibold tracking-wide text-slate-500 uppercase">
              {HEADERS.map((h) => (
                <th key={h} className={cn("px-3 py-2 whitespace-nowrap", h === HEADERS[0] && "sticky left-0 bg-white pl-8")}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {BUDGET_PLAN_GROUPS.map((group) => {
              const rollup = aggregateBudgetPlanRows(group.rows);
              return (
                <Fragment key={group.level1}>
                  <tr className="bg-brand-50 border-b border-slate-100">
                    <td className="sticky left-0 bg-brand-50 py-2 pr-3 pl-4 font-semibold text-slate-900">
                      {group.level1}
                    </td>
                    <td className="px-3 py-2 font-semibold tabular-nums text-slate-900">
                      {formatPlanUsd(rollup.currentBudget)}
                    </td>
                    <td className="px-3 py-2 font-semibold tabular-nums text-slate-900">
                      {formatPlanUsd(rollup.plannedMtd)}
                    </td>
                    <td className="px-3 py-2 font-semibold tabular-nums text-slate-900">
                      {formatPlanUsd(rollup.actualMtd)}
                    </td>
                    <td className="px-3 py-2">
                      <PacingCell actualMtd={rollup.actualMtd} plannedMtd={rollup.plannedMtd} />
                    </td>
                    <td className="px-3 py-2">
                      <ProjectedUtilisationCell
                        projectedSpend={rollup.projectedSpend}
                        currentBudget={rollup.currentBudget}
                      />
                    </td>
                    <td className="px-3 py-2 font-semibold tabular-nums text-slate-900">
                      {formatPlanUsd(rollup.projectedSpend)}
                    </td>
                    <td className="px-3 py-2 text-slate-700">{rollup.goalMetric}</td>
                    <td className="px-3 py-2 tabular-nums text-slate-700">{rollup.goalValue.toFixed(1)}x</td>
                    <td className="px-3 py-2">
                      <IroasCell actual={rollup.actualMetricValue} goal={rollup.goalValue} />
                    </td>
                    <td className="px-3 py-2 text-slate-500">
                      {rollup.budgetOpt} / {rollup.bidOpt}
                    </td>
                    <td className="px-3 py-2 tabular-nums text-slate-700">
                      {rollup.percentTimeInBudget === null ? "—" : `${rollup.percentTimeInBudget.toFixed(1)}%`}
                    </td>
                  </tr>
                  {group.rows.map((row) => (
                    <LeafRow key={row.id} row={row} />
                  ))}
                </Fragment>
              );
            })}
            <tr className="border-t-2 border-slate-200 bg-slate-50 font-semibold text-slate-900">
              <td className="sticky left-0 bg-slate-50 py-2.5 pr-3 pl-4">{BUDGET_PLAN_TOTAL_ROW.label}</td>
              <td className="px-3 py-2.5 tabular-nums">{formatPlanUsd(BUDGET_PLAN_TOTAL_ROW.currentBudget)}</td>
              <td className="px-3 py-2.5 tabular-nums">{formatPlanUsd(BUDGET_PLAN_TOTAL_ROW.plannedMtd)}</td>
              <td className="px-3 py-2.5 tabular-nums">{formatPlanUsd(BUDGET_PLAN_TOTAL_ROW.actualMtd)}</td>
              <td className="px-3 py-2.5">
                <PacingCell
                  actualMtd={BUDGET_PLAN_TOTAL_ROW.actualMtd}
                  plannedMtd={BUDGET_PLAN_TOTAL_ROW.plannedMtd}
                />
              </td>
              <td className="px-3 py-2.5">
                <ProjectedUtilisationCell
                  projectedSpend={BUDGET_PLAN_TOTAL_ROW.projectedSpend}
                  currentBudget={BUDGET_PLAN_TOTAL_ROW.currentBudget}
                />
              </td>
              <td className="px-3 py-2.5 tabular-nums">{formatPlanUsd(BUDGET_PLAN_TOTAL_ROW.projectedSpend)}</td>
              <td className="px-3 py-2.5 text-slate-400" colSpan={5}>
                —
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}
