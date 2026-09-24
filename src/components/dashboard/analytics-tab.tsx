"use client";

import { Info } from "lucide-react";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
 * Analytics tab — static visual replica of FR-012/013 (Budget Pacing + projected
 * spend). Out of scope for the chat prototype; kept non-interactive on purpose
 * so the tab still feels real when reviewers switch to it.
 */
export function AnalyticsTab() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Budget Pacing</CardTitle>
        <Info className="size-3.5 text-slate-400" />
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {METRICS.map((m) => (
            <div key={m.label} className="rounded-lg border border-slate-200 p-3">
              <p className="text-xs text-muted-foreground">{m.label}</p>
              <p className="mt-1 text-lg font-semibold text-slate-900">{m.value}</p>
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
              <Line type="monotone" dataKey="spend" stroke="#3b82f6" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <p className="rounded-lg bg-slate-50 px-3 py-2 text-xs text-muted-foreground">
          Budget Plan and Constraint gaps (FR-014, FR-015) are out of scope for this chat prototype — this tab is a
          visual placeholder so reviewers can switch between tabs realistically.
        </p>
      </CardContent>
    </Card>
  );
}
