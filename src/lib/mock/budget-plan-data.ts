/**
 * Budget Plan rows (FR-014) — same Level 1 / Level 2 shape and column set as
 * the reference Analytics tab, but built from the JBC Fresh / Pilgrims Core
 * numbers already used across the Executive Summary and chat (rather than
 * the reference's own unrelated demo brands), so one row here ties back to
 * the same story everywhere else in this prototype.
 */

export type BudgetPlanLeafRow = {
  id: string;
  level2: string;
  currentBudget: number;
  plannedMtd: number;
  actualMtd: number;
  projectedSpend: number;
  goalMetric: string;
  goalValue: number;
  actualMetricValue: number;
  budgetOpt: string;
  bidOpt: string;
  percentTimeInBudget: number | null;
};

export type BudgetPlanGroup = {
  level1: string;
  rows: BudgetPlanLeafRow[];
};

export const BUDGET_PLAN_TOTAL_ROW = {
  label: "Consolidated Total",
  currentBudget: 1_190_000,
  plannedMtd: 1_010_000,
  actualMtd: 804_000,
  projectedSpend: 1_119_900,
} as const;

export const BUDGET_PLAN_GROUPS: BudgetPlanGroup[] = [
  {
    level1: "JBC Fresh",
    rows: [
      {
        id: "bp-jbc-sb",
        level2: "Sponsored Brands",
        currentBudget: 200_000,
        plannedMtd: 180_000,
        actualMtd: 98_400,
        projectedSpend: 135_000,
        goalMetric: "iROAS",
        goalValue: 3.5,
        actualMetricValue: 2.8,
        budgetOpt: "Ally AI",
        bidOpt: "Ally AI",
        percentTimeInBudget: 70.0,
      },
      {
        id: "bp-jbc-sp",
        level2: "Sponsored Products",
        currentBudget: 90_000,
        plannedMtd: 65_000,
        actualMtd: 60_000,
        projectedSpend: 82_000,
        goalMetric: "iROAS",
        goalValue: 2.0,
        actualMetricValue: 2.3,
        budgetOpt: "Ally AI",
        bidOpt: "Ally AI",
        percentTimeInBudget: 88.4,
      },
    ],
  },
  {
    level1: "Pilgrims Core",
    rows: [
      {
        id: "bp-pc-sb",
        level2: "Sponsored Brands",
        currentBudget: 230_000,
        plannedMtd: 200_000,
        actualMtd: 214_400,
        projectedSpend: 250_000,
        goalMetric: "iROAS",
        goalValue: 3.8,
        actualMetricValue: 2.9,
        budgetOpt: "Ally AI",
        bidOpt: "Ally AI",
        percentTimeInBudget: 96.0,
      },
      {
        id: "bp-pc-sp",
        level2: "Sponsored Products",
        currentBudget: 420_000,
        plannedMtd: 360_000,
        actualMtd: 239_600,
        projectedSpend: 290_000,
        goalMetric: "iROAS",
        goalValue: 2.5,
        actualMetricValue: 2.2,
        budgetOpt: "Ally AI",
        bidOpt: "Ally AI",
        percentTimeInBudget: 64.8,
      },
    ],
  },
];

function unanimousLabel(values: string[]): string {
  if (values.length === 0) return "—";
  return values.every((v) => v === values[0]) ? values[0] : "Mixed";
}

function weightedAverage(rows: BudgetPlanLeafRow[], getValue: (row: BudgetPlanLeafRow) => number): number {
  let weightedSum = 0;
  let weightTotal = 0;
  for (const row of rows) {
    const weight = row.actualMtd > 0 ? row.actualMtd : 1;
    weightedSum += getValue(row) * weight;
    weightTotal += weight;
  }
  return weightTotal === 0 ? 0 : weightedSum / weightTotal;
}

export function aggregateBudgetPlanRows(rows: BudgetPlanLeafRow[]) {
  const money = rows.reduce(
    (acc, row) => ({
      currentBudget: acc.currentBudget + row.currentBudget,
      plannedMtd: acc.plannedMtd + row.plannedMtd,
      actualMtd: acc.actualMtd + row.actualMtd,
      projectedSpend: acc.projectedSpend + row.projectedSpend,
    }),
    { currentBudget: 0, plannedMtd: 0, actualMtd: 0, projectedSpend: 0 },
  );
  const timeRows = rows.filter((r) => r.percentTimeInBudget !== null);
  const percentTimeInBudget =
    timeRows.length === 0 ? null : weightedAverage(timeRows, (r) => r.percentTimeInBudget as number);

  return {
    ...money,
    goalMetric: unanimousLabel(rows.map((r) => r.goalMetric)),
    goalValue: weightedAverage(rows, (r) => r.goalValue),
    actualMetricValue: weightedAverage(rows, (r) => r.actualMetricValue),
    budgetOpt: unanimousLabel(rows.map((r) => r.budgetOpt)),
    bidOpt: unanimousLabel(rows.map((r) => r.bidOpt)),
    percentTimeInBudget,
  };
}

export function projectedUtilisationPct(projectedSpend: number, currentBudget: number): number | null {
  if (currentBudget === 0) return null;
  return (projectedSpend / currentBudget) * 100;
}
