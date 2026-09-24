export type PromptCategory =
  | "why"
  | "what-changed"
  | "what-next"
  | "watchouts"
  | "performance";

export const PROMPT_CATEGORIES: { id: PromptCategory; label: string }[] = [
  { id: "why", label: "Why this happened" },
  { id: "what-changed", label: "What changed" },
  { id: "what-next", label: "What to do next" },
  { id: "watchouts", label: "Watchouts" },
  { id: "performance", label: "Performance drivers" },
];

export type StarterPrompt = {
  id: string;
  category: PromptCategory;
  question: string;
};

/** 10 starter prompts across the five explainability categories. */
export const STARTER_PROMPTS: StarterPrompt[] = [
  { id: "why-pacing-behind", category: "why", question: "Why is account pacing behind this month?" },
  { id: "why-pilgrims-iroas", category: "why", question: "Why did Pilgrims Core Sponsored Brands iROAS fall below goal?" },
  { id: "changed-targeting-mix", category: "what-changed", question: "What changed in the targeting mix for Pilgrims Core?" },
  { id: "changed-spend-gap", category: "what-changed", question: "What's driving the gap between planned and actual spend?" },
  { id: "next-jbc-action", category: "what-next", question: "What should I do about JBC Fresh Sponsored Brands this week?" },
  { id: "next-highest-impact", category: "what-next", question: "What's the highest-impact action I can take right now?" },
  { id: "watch-general", category: "watchouts", question: "What should I be watching out for?" },
  { id: "watch-next-month-budget", category: "watchouts", question: "Is next month's budget at risk?" },
  { id: "perf-execution-health", category: "performance", question: "How is GBO execution performing overall?" },
  { id: "perf-biggest-contributor", category: "performance", question: "Which brand is contributing most to under-pacing?" },
];

export function promptsByCategory(category: PromptCategory) {
  return STARTER_PROMPTS.filter((p) => p.category === category);
}
