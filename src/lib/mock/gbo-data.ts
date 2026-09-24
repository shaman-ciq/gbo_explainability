/**
 * Grounded mock content pulled from the live GBO Optimization app (Analytics,
 * Executive Summary, Alerts) and the Budget Pacing email. Chat answers and the
 * pushed narrative both read from here so numbers never drift between them.
 */

export const asOfLabel = "MTD till Jul 28, 2026";
export const asOfDisclaimer =
  "Month-to-date figures are reported through the previous day (T−1). Last updated Jul 28, 2026.";

export const pacing = {
  pct: 79.6,
  status: "Behind" as const,
  actualMtd: "$804.0K",
  plannedMtd: "$1.01M",
  projectedUtilisationPct: 94.1,
  projectedVsPlan: "-$70.0K",
  monthlyPlan: "$1.19M",
};

export const budgetMetrics = {
  currentBudget: "$1.19M",
  currentBudgetDelta: "+2.46%",
  plannedBudgetTillDate: "$1.01M",
  plannedBudgetDelta: "+6.16%",
  actualSpendTillDate: "$804.0K",
  actualSpendDelta: "-20.40%",
  utilizationPct: "79.6%",
  utilizationDelta: "-26.56%",
};

export const overridePressure = {
  manual: "$231.31",
  allyRecommended: "$204.76",
};

export type ChangeDriver = { id: string; title: string; detail: string };

export const changeDrivers: ChangeDriver[] = [
  {
    id: "jbc-sb",
    title: "JBC Fresh Sponsored Brands under-pacing",
    detail:
      "Actual MTD $98.4K vs planned $180.0K (54.7% pacing). The Sponsored Brands campaign-type constraint (30% target vs 8.4% spend share) is binding against underspending campaigns.",
  },
  {
    id: "pilgrims-efficiency",
    title: "Pilgrims Core brand efficiency below goal",
    detail:
      "Pilgrims Core Sponsored Brands iROAS is 2.9 vs goal 3.8 while pacing Ahead at 107.2%. Manual overrides ($231.31 vs Ally-recommended $204.76) are contributing to over-pacing without lifting efficiency.",
  },
  {
    id: "pilgrims-sp",
    title: "Pilgrims Core Sponsored Products behind plan",
    detail:
      "Actual MTD $239.6K vs planned $360.0K (66.6% pacing). % time in budget is 64.8% — campaigns are often out of budget before day-end.",
  },
  {
    id: "targeting-mix",
    title: "Targeting mix constraints misaligned on Pilgrims Core",
    detail:
      "Competitor targeting constraint of 30% but only 10.7% spend share; Generic at 70% vs 89.3% actual. The 19.3-point gaps on both sides amplify irregular pacing until constraints are realigned.",
  },
  {
    id: "execution-healthy",
    title: "GBO execution mostly healthy",
    detail:
      "Budget-change success is 94.2% and bid-change success is 91.5%; recommendation coverage is 78%, so gaps are visible in coverage % rather than hidden.",
  },
];

export type Recommendation = {
  id: string;
  action: string;
  impactLabel: "High" | "Medium";
  lever: string;
  exactSettingChange: string;
  whyNow: string;
  expectedImpact: string;
  risk: string;
  howToMonitor: string;
};

export const recommendations: Recommendation[] = [
  {
    id: "targeting-mix",
    action: "Relax Generic vs Competitor targeting mix constraints for Pilgrims Core",
    impactLabel: "High",
    lever: "Constraint settings – Targeting Type mix within GBO",
    exactSettingChange:
      "Reduce the Competitor gap by lifting Competitor share toward observed opportunity, and ease Generic from 70% toward ~80% to narrow the gap vs the current 89.3% spend share — without pushing Generic higher than observed behavior.",
    whyNow:
      "Pilgrims Core shows 19.3-point deviations on both Competitor (30% vs 10.7%) and Generic (70% vs 89.3%). Sponsored Brands iROAS is 2.9 vs goal 3.8 while pacing is Ahead.",
    expectedImpact:
      "High – stabilizes spend mix and reduces constraint thrash so Ally AI can rebalance toward efficient inventory.",
    risk: "Medium – shifting mix may temporarily change brand/generic exposure; monitor iROAS and spend share for 5–7 days.",
    howToMonitor: "Track Targeting Type spend share, iROAS, and spend pacing for Pilgrims Core daily this week.",
  },
  {
    id: "jbc-sb",
    action: "Relax JBC Fresh Sponsored Brands campaign-type share",
    impactLabel: "High",
    lever: "Constraint settings – Campaign-type share within GBO",
    exactSettingChange:
      "Ease the Sponsored Brands campaign-type constraint down from the current 30% target toward the observed ~10–15% spend share so budget isn't held back from campaigns that are already underspending.",
    whyNow:
      "JBC Fresh Sponsored Brands is pacing at 54.7% ($98.4K / $180.0K) with the 30% campaign-type target binding against underspending campaigns.",
    expectedImpact: "High – unlocks underspending SB campaigns; estimated +$40–60K MTD spend if run-rate catches plan.",
    risk: "Medium – relaxing the constraint too far could concentrate spend in a few campaigns; watch campaign-level distribution.",
    howToMonitor: "Track JBC Fresh Sponsored Brands pacing % and campaign-type spend share daily this week.",
  },
  {
    id: "override-cap",
    action: "Cap Pilgrims Core SB manual overrides under Ally AI",
    impactLabel: "Medium",
    lever: "Manual override policy – Pilgrims Core Sponsored Brands",
    exactSettingChange:
      "Cap manual overrides at ≤10% above Ally AI's daily recommendation (currently $231 manual vs $205 Ally-recommended, ~13% above).",
    whyNow:
      "Manual overrides are running above Ally AI's recommendation on sampled days, contributing to over-pacing (107.2%) without lifting the 2.9 iROAS toward the 3.8 goal.",
    expectedImpact: "Medium – brings SB closer to the 97–102% On Plan band by month-end while protecting efficiency.",
    risk: "Low – caps only the override delta, not Ally AI's own recommended spend.",
    howToMonitor: "Compare manual vs Ally-recommended spend for Pilgrims Core SB weekly.",
  },
];

export type Watchout = { id: string; title: string; detail: string };

export const watchouts: Watchout[] = [
  {
    id: "jbc-roi",
    title: "ROI pressure on JBC Fresh Sponsored Brands",
    detail:
      "iROAS is 2.9 vs goal 3.5 while pacing is only 54.7%; aggressive constraint relaxation without monitoring could further erode efficiency.",
  },
  {
    id: "pilgrims-roi",
    title: "Pilgrims Core below goal on Sponsored Brands",
    detail:
      "iROAS is 2.9 vs a goal of 3.8 and pacing is Ahead — if this mix continues, blended profitability could decline even as spend stays high.",
  },
  {
    id: "constraint-instability",
    title: "Constraint-driven instability risk",
    detail:
      "The 19.3-point deviations between configured and actual spend shares for Competitor (30% vs 10.7%) and Generic (70% vs 89.3%) on Pilgrims Core may continue to cause irregular pacing until constraints are realigned.",
  },
  {
    id: "next-month-budget",
    title: "Next-month budget not entered",
    detail:
      "If August's planned budget is blank by the 20th–25th, Ally AI may stop campaigns. Enter next month's budget before month-end.",
  },
];

export type AlertRow = {
  actor: string;
  changes: number;
  family: string;
  detail: string;
  timestamp: string;
};

export const recentAlerts: AlertRow[] = [
  {
    actor: "Emily Carter",
    changes: 3,
    family: "Setup",
    detail: "1 conflict, 1 high deviation — bid optimization for JBC Fresh (None → Ally AI, then $22.5k → $24.0k)",
    timestamp: "4:14 PM, 24 Sep",
  },
  {
    actor: "Marcus Webb",
    changes: 1,
    family: "Setup",
    detail: "1 change",
    timestamp: "11:14 AM, 24 Sep",
  },
  {
    actor: "Ally AI",
    changes: 5,
    family: "Automation",
    detail: "2 failed actions, 3 conflicts, 4 high deviations",
    timestamp: "10:52 AM, 24 Sep",
  },
  {
    actor: "Day Parting",
    changes: 1,
    family: "Automation",
    detail: "1 change",
    timestamp: "Last updated at 9:52 AM, 24 Sep",
  },
];

export const executionHealth = {
  budgetChangeSuccessPct: 94.2,
  bidChangeSuccessPct: 91.5,
  recommendationCoveragePct: 78,
};
