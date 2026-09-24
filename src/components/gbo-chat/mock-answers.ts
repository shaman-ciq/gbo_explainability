import {
  changeDrivers,
  executionHealth,
  overridePressure,
  pacing,
  recommendations,
  watchouts,
} from "@/lib/mock/gbo-data";
import type { ChatVisual } from "./chat-visuals";
import { STARTER_PROMPTS } from "./starter-prompts";

export type ChatAnswer = {
  summary: string;
  source: string;
  followUpIds?: string[];
  visual?: ChatVisual;
};

const r = (id: string) => recommendations.find((x) => x.id === id)!;

/** Scripted answers keyed by starter-prompt id — no live model, same pattern as AllyBrain's ChatSurface. */
export const MOCK_ANSWERS: Record<string, ChatAnswer> = {
  "why-pacing-behind": {
    summary: `Account pacing MTD is **${pacing.pct}% (${pacing.status})**, with actual spend ${pacing.actualMtd} vs planned MTD ${pacing.plannedMtd}. The largest single driver is **${changeDrivers[0].title}**.`,
    source: "Executive Summary → Performance Overview",
    followUpIds: ["changed-spend-gap", "next-jbc-action"],
    visual: { kind: "pacing-bar", label: "Account pacing MTD", actualPct: pacing.pct, projectedPct: pacing.projectedUtilisationPct },
  },
  "why-pilgrims-iroas": {
    summary: `${changeDrivers[1].detail} Manual overrides are running above Ally AI's own recommendation (${overridePressure.manual} manual vs ${overridePressure.allyRecommended} Ally-recommended on sampled override days), which is pushing spend up without improving efficiency.`,
    source: "Executive Summary → What changed and why",
    followUpIds: ["next-highest-impact", "watch-general"],
    visual: {
      kind: "comparison-bars",
      unit: "ratio",
      legend: ["Goal", "Actual"],
      rows: [{ label: "Pilgrims Core SB iROAS", a: 3.8, b: 2.9 }],
    },
  },
  "changed-targeting-mix": {
    summary: `${changeDrivers[3].detail} That's a 19.3-point gap on both sides of the same constraint — the configured mix hasn't kept pace with how the campaigns are actually spending.`,
    source: "Analytics → Constraint gaps",
    followUpIds: ["next-highest-impact", "why-pilgrims-iroas"],
    visual: {
      kind: "comparison-bars",
      unit: "percent",
      legend: ["Target %", "Actual %"],
      rows: [
        { label: "Competitor", a: 30, b: 10.7 },
        { label: "Generic", a: 70, b: 89.3 },
      ],
    },
  },
  "changed-spend-gap": {
    summary: `The single largest pocket is **${changeDrivers[0].title.replace(" under-pacing", "")}**. Pilgrims Core Sponsored Products is also behind plan.`,
    source: "Analytics → Budget Plan",
    followUpIds: ["next-jbc-action", "perf-biggest-contributor"],
    visual: {
      kind: "comparison-bars",
      unit: "currency",
      legend: ["Planned", "Actual"],
      rows: [
        { label: "JBC Fresh SB", a: 180000, b: 98400 },
        { label: "Pilgrims Core SP", a: 360000, b: 239600 },
      ],
    },
  },
  "next-jbc-action": {
    summary: `**${r("jbc-sb").action}** — ${r("jbc-sb").impactLabel} impact.`,
    source: "Executive Summary → What to do this week",
    followUpIds: ["watch-general"],
    visual: { kind: "recommendation", rec: r("jbc-sb") },
  },
  "next-highest-impact": {
    summary: `The highest-impact action right now is **${r("targeting-mix").action}**.`,
    source: "Executive Summary → What to do this week",
    followUpIds: ["next-jbc-action", "watch-general"],
    visual: { kind: "recommendation", rec: r("targeting-mix") },
  },
  "watch-general": {
    summary: watchouts.map((w) => `**${w.title}.** ${w.detail}`).join("\n\n"),
    source: "Executive Summary → Watchouts",
    followUpIds: ["watch-next-month-budget"],
  },
  "watch-next-month-budget": {
    summary: `Yes — if August's planned budget isn't entered in time, Ally AI may pause campaigns.`,
    source: "Executive Summary → Watchouts",
    visual: {
      kind: "stat-tiles",
      tiles: [
        { label: "Enter budget by", value: "Aug 20–25", tone: "warning" },
        { label: "If missed", value: "Campaigns pause", tone: "warning" },
      ],
    },
  },
  "perf-execution-health": {
    summary: `GBO execution is mostly healthy — the gaps you're seeing show up in recommendation coverage rather than failed executions.`,
    source: "Executive Summary → What changed and why",
    followUpIds: ["perf-biggest-contributor"],
    visual: {
      kind: "stat-tiles",
      tiles: [
        { label: "Budget-change success", value: `${executionHealth.budgetChangeSuccessPct}%`, tone: "success" },
        { label: "Bid-change success", value: `${executionHealth.bidChangeSuccessPct}%`, tone: "success" },
        { label: "Recommendation coverage", value: `${executionHealth.recommendationCoveragePct}%`, tone: "warning" },
      ],
    },
  },
  "perf-biggest-contributor": {
    summary: `**JBC Fresh** is the biggest contributor to under-pacing, followed by **Pilgrims Core** Sponsored Products.`,
    source: "Analytics → Budget Plan",
    followUpIds: ["next-jbc-action", "changed-targeting-mix"],
    visual: {
      kind: "comparison-bars",
      unit: "percent",
      legend: ["Plan (100%)", "Actual pacing %"],
      rows: [
        { label: "JBC Fresh SB", a: 100, b: 54.7 },
        { label: "Pilgrims Core SP", a: 100, b: 66.6 },
      ],
    },
  },
};

const FALLBACK: ChatAnswer = {
  summary:
    "I don't have a scripted answer for that yet in this prototype — here's what I can help with right now.",
  source: "",
};

/**
 * Words too common to carry any topical signal — left unfiltered, a query
 * like "What's the weather like today?" shares "what" and "the" with nearly
 * every starter prompt (most start with "What...") and would score >= 2
 * purely on filler, matching a completely unrelated answer.
 */
const STOPWORDS = new Set([
  "what", "the", "is", "are", "this", "that", "can", "do", "does", "will", "would", "should",
  "could", "to", "in", "on", "of", "for", "and", "or", "you", "your", "my", "me", "it", "its",
  "was", "were", "be", "been", "being", "we", "us", "our", "did", "about", "right", "now",
  "just", "get", "got", "have", "has", "had", "with", "from", "like",
]);

function significantWords(text: string): string[] {
  return (text.toLowerCase().match(/[a-z]{3,}/g) ?? []).filter((w) => !STOPWORDS.has(w));
}

/**
 * Keyword-overlap scorer over starter-prompt question text — good enough for
 * a scripted demo, but stopword-filtered so filler words can't manufacture a
 * false match. Requires at least 2 shared significant words *and* that they
 * cover a real share of the candidate prompt's own vocabulary, so a single
 * incidental word overlap on an otherwise long, unrelated prompt doesn't win.
 */
export function matchResponse(input: string): { answer: ChatAnswer; matchedPromptId: string | null } {
  const inputWords = new Set(significantWords(input));
  if (inputWords.size === 0) return { answer: FALLBACK, matchedPromptId: null };

  let bestId: string | null = null;
  let bestScore = 0;

  for (const prompt of STARTER_PROMPTS) {
    const promptWords = significantWords(prompt.question);
    if (promptWords.length === 0) continue;
    const matched = promptWords.filter((w) => inputWords.has(w)).length;
    const coverage = matched / promptWords.length;
    if (matched >= 2 && coverage >= 0.34 && matched > bestScore) {
      bestScore = matched;
      bestId = prompt.id;
    }
  }

  if (bestId) {
    return { answer: MOCK_ANSWERS[bestId], matchedPromptId: bestId };
  }
  return { answer: FALLBACK, matchedPromptId: null };
}

export function answerForPrompt(promptId: string): ChatAnswer {
  return MOCK_ANSWERS[promptId] ?? FALLBACK;
}
