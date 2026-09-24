import {
  changeDrivers,
  executionHealth,
  overridePressure,
  pacing,
  recommendations,
  watchouts,
} from "@/lib/mock/gbo-data";
import { STARTER_PROMPTS } from "./starter-prompts";

export type ChatAnswer = {
  summary: string;
  source: string;
  followUpIds?: string[];
};

const r = (id: string) => recommendations.find((x) => x.id === id)!;

/** Scripted answers keyed by starter-prompt id — no live model, same pattern as AllyBrain's ChatSurface. */
export const MOCK_ANSWERS: Record<string, ChatAnswer> = {
  "why-pacing-behind": {
    summary: `Account pacing MTD is **${pacing.pct}% (${pacing.status})**, with actual spend ${pacing.actualMtd} vs planned MTD ${pacing.plannedMtd}. The largest single driver is **${changeDrivers[0].title}**: ${changeDrivers[0].detail} Projected month-end utilisation is ${pacing.projectedUtilisationPct}% (Behind) on a ${pacing.monthlyPlan} plan (${pacing.projectedVsPlan} vs plan).`,
    source: "Executive Summary → Performance Overview",
    followUpIds: ["changed-spend-gap", "next-jbc-action"],
  },
  "why-pilgrims-iroas": {
    summary: `${changeDrivers[1].detail} Manual overrides are running above Ally AI's own recommendation (${overridePressure.manual} manual vs ${overridePressure.allyRecommended} Ally-recommended on sampled override days), which is pushing spend up without improving efficiency.`,
    source: "Executive Summary → What changed and why",
    followUpIds: ["next-highest-impact", "watch-general"],
  },
  "changed-targeting-mix": {
    summary: `${changeDrivers[3].detail} That's a 19.3-point gap on both sides of the same constraint — the configured mix hasn't kept pace with how the campaigns are actually spending.`,
    source: "Analytics → Constraint gaps",
    followUpIds: ["next-highest-impact", "why-pilgrims-iroas"],
  },
  "changed-spend-gap": {
    summary: `The single largest pocket is **${changeDrivers[0].title.replace(" under-pacing", "")}**: ${changeDrivers[0].detail} Pilgrims Core Sponsored Products is also behind plan — ${changeDrivers[2].detail}`,
    source: "Analytics → Budget Plan",
    followUpIds: ["next-jbc-action", "perf-biggest-contributor"],
  },
  "next-jbc-action": {
    summary: buildRecommendationSummary(r("jbc-sb")),
    source: "Executive Summary → What to do this week",
    followUpIds: ["watch-general"],
  },
  "next-highest-impact": {
    summary: `The highest-impact action right now is **${r("targeting-mix").action}**. ${r("targeting-mix").whyNow} Expected impact: ${r("targeting-mix").expectedImpact}`,
    source: "Executive Summary → What to do this week",
    followUpIds: ["next-jbc-action", "watch-general"],
  },
  "watch-general": {
    summary: watchouts.map((w) => `**${w.title}.** ${w.detail}`).join("\n\n"),
    source: "Executive Summary → Watchouts",
    followUpIds: ["watch-next-month-budget"],
  },
  "watch-next-month-budget": {
    summary: `Yes — ${watchouts.find((w) => w.id === "next-month-budget")!.detail}`,
    source: "Executive Summary → Watchouts",
  },
  "perf-execution-health": {
    summary: `GBO execution is mostly healthy: budget-change success is **${executionHealth.budgetChangeSuccessPct}%** and bid-change success is **${executionHealth.bidChangeSuccessPct}%**. Recommendation coverage is ${executionHealth.recommendationCoveragePct}%, so the gaps you're seeing show up in coverage rather than failed executions.`,
    source: "Executive Summary → What changed and why",
    followUpIds: ["perf-biggest-contributor"],
  },
  "perf-biggest-contributor": {
    summary: `**JBC Fresh** is the biggest contributor to under-pacing — its Sponsored Brands campaigns are at 54.7% of planned spend ($98.4K / $180.0K). **Pilgrims Core** Sponsored Products is the second-largest gap, at 66.6% of plan ($239.6K / $360.0K).`,
    source: "Analytics → Budget Plan",
    followUpIds: ["next-jbc-action", "changed-targeting-mix"],
  },
};

function buildRecommendationSummary(rec: (typeof recommendations)[number]) {
  return `**${rec.action}** (${rec.impactLabel} impact).\n\nLever: ${rec.lever}\nExact change: ${rec.exactSettingChange}\nWhy now: ${rec.whyNow}\nRisk: ${rec.risk}`;
}

const FALLBACK: ChatAnswer = {
  summary:
    "I don't have a scripted answer for that yet in this prototype — here's what I can help with right now.",
  source: "",
};

/** Very small keyword scorer over starter-prompt question text; good enough for a scripted demo. */
export function matchResponse(input: string): { answer: ChatAnswer; matchedPromptId: string | null } {
  const normalized = input.trim().toLowerCase();
  if (!normalized) return { answer: FALLBACK, matchedPromptId: null };

  let bestId: string | null = null;
  let bestScore = 0;

  for (const prompt of STARTER_PROMPTS) {
    const words = prompt.question.toLowerCase().match(/[a-z]{3,}/g) ?? [];
    const score = words.reduce((acc, w) => (normalized.includes(w) ? acc + 1 : acc), 0);
    if (score > bestScore) {
      bestScore = score;
      bestId = prompt.id;
    }
  }

  if (bestId && bestScore >= 2) {
    return { answer: MOCK_ANSWERS[bestId], matchedPromptId: bestId };
  }
  return { answer: FALLBACK, matchedPromptId: null };
}

export function answerForPrompt(promptId: string): ChatAnswer {
  return MOCK_ANSWERS[promptId] ?? FALLBACK;
}
