/**
 * 97–102% "on plan" band + 3-tier color coding, ported from the reference
 * app (Goal-Based-Optimization-Revamp) so Analytics reads exactly like the
 * live product: On Plan (green), mild Behind/Ahead (amber), severe Behind
 * <85% (red).
 */

export type PacingBandStatus = "on-plan" | "behind" | "ahead";

export const PACING_BAND_MIN = 97;
export const PACING_BAND_MAX = 102;

export function getPacingBandStatus(pacingPercent: number): PacingBandStatus {
  if (pacingPercent >= PACING_BAND_MIN && pacingPercent <= PACING_BAND_MAX) return "on-plan";
  if (pacingPercent < PACING_BAND_MIN) return "behind";
  return "ahead";
}

export function pacingStatusLabel(status: PacingBandStatus): string {
  if (status === "on-plan") return "On Plan";
  if (status === "behind") return "Behind";
  return "Ahead";
}

/** On Plan → green; Ahead → amber; Behind ≥85% → amber; Behind <85% → red. */
export function pacingTone(pct: number, status: PacingBandStatus): "success" | "warning" | "error" {
  if (status === "on-plan") return "success";
  if (status === "ahead") return "warning";
  return pct >= 85 ? "warning" : "error";
}

export function pacingToneTextClass(tone: "success" | "warning" | "error"): string {
  if (tone === "success") return "text-success-700";
  if (tone === "warning") return "text-warning-600";
  return "text-error-600";
}

export function ratioToPercent(numerator: number, denominator: number): number | null {
  if (denominator === 0) return null;
  return (numerator / denominator) * 100;
}

export function formatPacingPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}

export function formatPlanUsd(value: number): string {
  const abs = Math.abs(value);
  const sign = value < 0 ? "-" : "";
  if (abs >= 1_000_000) return `${sign}$${(abs / 1_000_000).toFixed(2)}M`;
  if (abs >= 1_000) return `${sign}$${(abs / 1_000).toFixed(2)}K`;
  return `${sign}$${abs.toFixed(2)}`;
}
