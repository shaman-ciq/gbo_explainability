/**
 * Constraint gaps (FR-015) — ported directly from the reference app's own
 * mock data, which already uses JBC Fresh / Pilgrims Core (the change
 * driver for JBC Fresh Sponsored Brands under-pacing is this exact
 * Sponsored Brands constraint), so it lines up with the rest of this
 * prototype's story without adjustment.
 */

export type ConstraintGap = {
  id: string;
  alert: "High Deviation" | "Moderate Deviation";
  level1: string;
  level2: string;
  group: string;
  constraintType: string;
  constraintPercent: number;
  spendSharePercent: number;
  deviationPoints: number;
  plainLanguage: string;
};

function build(
  seed: Omit<ConstraintGap, "deviationPoints">,
): ConstraintGap {
  return { ...seed, deviationPoints: Math.abs(seed.constraintPercent - seed.spendSharePercent) };
}

export const CONSTRAINT_GAPS: ConstraintGap[] = [
  build({
    id: "c-competitor",
    alert: "High Deviation",
    level1: "Pilgrims Core",
    level2: "None",
    group: "Targeting Type",
    constraintType: "Competitor",
    constraintPercent: 30,
    spendSharePercent: 10.7,
    plainLanguage:
      "At the Pilgrims Core level, the Targeting Type constraint for Competitor is set at 30%, but observed spend share is only 10.7% (gap 19.3 points). This under-delivery can leave competitor conquest volume on the table while Generic absorbs excess share.",
  }),
  build({
    id: "c-generic",
    alert: "High Deviation",
    level1: "Pilgrims Core",
    level2: "None",
    group: "Targeting Type",
    constraintType: "Generic",
    constraintPercent: 70,
    spendSharePercent: 89.3,
    plainLanguage:
      "At the same level, the Targeting Type constraint for Generic is set at 70%, while actual spend share is 89.3% (19.3 points over). Because Generic is already above the 70% target, no additional generic-share increase is advisable right now.",
  }),
  build({
    id: "c-sb-share",
    alert: "High Deviation",
    level1: "JBC Fresh",
    level2: "Sponsored Brands",
    group: "Campaign Type",
    constraintType: "Sponsored Brands",
    constraintPercent: 30,
    spendSharePercent: 8.4,
    plainLanguage:
      "For JBC Fresh – Sponsored Brands, the campaign-type constraint is set at 30% share, but actual SB spend share is only 8.4% (deviation 21.6 points, 72% relative). This large gap can cause underpacing as GBO repeatedly tries to push more budget into SB than the structure supports.",
  }),
  build({
    id: "c-branded",
    alert: "High Deviation",
    level1: "Pilgrims Core",
    level2: "Sponsored Products",
    group: "Targeting Type",
    constraintType: "Branded",
    constraintPercent: 45,
    spendSharePercent: 28.2,
    plainLanguage:
      "Branded targeting on Pilgrims Core SP is capped at 45% but only 28.2% of spend is branded. GBO may be unable to defend branded search terms without relaxing this cap.",
  }),
];
