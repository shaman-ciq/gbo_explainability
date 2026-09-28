"use client";

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { BudgetPlanTable } from "@/components/dashboard/budget-plan-table";
import { ProjectedSpendUtilisationCard } from "@/components/dashboard/projected-spend-utilisation-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InfoTooltip } from "@/components/ui/info-tooltip";
import { budgetMetrics } from "@/lib/mock/gbo-data";
import { spendTrend } from "@/lib/mock/analytics-series";

const METRICS = [
  { label: "Current Budget", value: budgetMetrics.currentBudget, delta: budgetMetrics.currentBudgetDelta, up: true },
  {
    label: "Planned budget till date",
    value: budgetMetrics.plannedBudgetTillDate,
    delta: budgetMetrics.plannedBudgetDelta,
    up: true,
  },
  {
    label: "Actual Spend till date",
    value: budgetMetrics.actualSpendTillDate,
    delta: budgetMetrics.actualSpendDelta,
    up: false,
  },
  { label: "Utilization %", value: budgetMetrics.utilizationPct, delta: budgetMetrics.utilizationDelta, up: false },
];

/**
 * Analytics tab — static visual replica of Budget Pacing (FR-012), Projected
 * spend & utilisation (FR-013), and Budget Plan (FR-014) from the live app.
 */
export function AnalyticsTab() {
  return (
    <div className="space-y-5 pb-10">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Budget Pacing</CardTitle>
          <InfoTooltip text="Month-to-date budget, planned spend, actual spend, and utilization against the current monthly plan. Figures are as of the previous day (T-1)." />
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {METRICS.map((m, i) => (
              <div
                key={m.label}
                style={{ animationDelay: `${i * 50}ms` }}
                className="fade-in-up hover:shadow-pane rounded-lg bg-slate-50/70 p-3 transition-shadow"
              >
                <p className="text-xs text-muted-foreground">{m.label}</p>
                <p className="mt-1 text-lg font-semibold tracking-tight text-slate-900">{m.value}</p>
                <p className={m.up ? "text-xs text-success-600" : "text-xs text-error-600"}>
                  {m.up ? "↑" : "↓"} {m.delta}
                </p>
              </div>
            ))}
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={spendTrend} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
                <XAxis dataKey="day" tick={{ fontSize: 11 }} interval={4} axisLine={false} tickLine={false} />
                <YAxis
                  tick={{ fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `$${Math.round(v / 1000)}K`}
                />
                <Tooltip formatter={(v: number) => [`$${v.toLocaleString()}`, "Spend"]} />
                <Line type="monotone" dataKey="spend" stroke="#875bf7" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <ProjectedSpendUtilisationCard />
      <BudgetPlanTable />
    </div>
  );
}
