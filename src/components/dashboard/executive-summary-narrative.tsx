"use client";

import { AlertTriangle, Info, Sparkles } from "lucide-react";
import { useState } from "react";

import { FormattedText } from "@/components/ui/formatted-text";
import {
  asOfDisclaimer,
  asOfLabel,
  changeDrivers,
  pacing,
  recommendations,
  watchouts,
} from "@/lib/mock/gbo-data";
import { AccordionSection } from "./accordion-section";

/** The pushed narrative: Performance Overview (FR-016) + email-parity sections (FR-017). */
export function ExecutiveSummaryNarrative() {
  return (
    <div className="flex flex-col gap-4">
      <PerformanceOverviewCard />
      <AccordionSection title="What changed and why" description="Top drivers behind pacing and performance shifts">
        <ol className="divide-y divide-slate-100">
          {changeDrivers.map((d, i) => (
            <li key={d.id} className="flex gap-3 px-4 py-3">
              <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-md bg-brand-50 text-xs font-bold tabular-nums text-brand-700">
                {i + 1}
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold leading-snug text-slate-900">{d.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-slate-600">{d.detail}</p>
              </div>
            </li>
          ))}
        </ol>
      </AccordionSection>

      <AccordionSection title="What to do this week" description="Expand an action for lever, impact, and monitoring">
        <ActionsList />
      </AccordionSection>

      <AccordionSection title="Watchouts" description="Risks to monitor while you act on recommendations">
        <ul className="grid gap-x-6 gap-y-2 px-4 py-3 md:grid-cols-2">
          {watchouts.map((w) => (
            <li key={w.id} className="flex gap-2 text-sm leading-snug">
              <AlertTriangle className="mt-0.5 size-3.5 shrink-0 text-warning-600" />
              <span>
                <span className="font-medium text-slate-900">{w.title}. </span>
                <span className="text-slate-600">{w.detail}</span>
              </span>
            </li>
          ))}
        </ul>
      </AccordionSection>
    </div>
  );
}

function PerformanceOverviewCard() {
  const headline = `Account pacing MTD is **${pacing.pct}% (${pacing.status})**, with actual spend ${pacing.actualMtd} vs planned MTD ${pacing.plannedMtd}.`;
  const highlights = [
    `Largest under-pacing pocket: **JBC Fresh Sponsored Brands** at 54.7% ($98.4K / $180.0K).`,
    `Projected month-end utilisation is **${pacing.projectedUtilisationPct}% (Behind)** on a ${pacing.monthlyPlan} monthly plan (${pacing.projectedVsPlan} vs plan).`,
    `Manual overrides are contributing to spend pressure: $231.31 manual vs $204.76 Ally-recommended on sampled override days.`,
  ];

  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-4 py-3">
        <div className="flex min-w-0 flex-1 items-center gap-2.5">
          <Sparkles className="size-4 shrink-0 text-brand-500" />
          <h2 className="text-sm font-semibold text-slate-900">Performance Overview</h2>
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          <p className="text-xs tabular-nums text-slate-500">{asOfLabel}</p>
          <Info className="size-3.5 text-slate-400" />
        </div>
      </header>
      <p className="border-b border-slate-100 bg-slate-50 px-4 py-2 text-xs leading-relaxed text-slate-600">
        {asOfDisclaimer}
      </p>
      <div className="space-y-6 p-4">
        <div className="space-y-3">
          <p className="text-base font-medium leading-snug text-slate-900">
            <FormattedText text={headline} />
          </p>
          <ul className="space-y-2">
            {highlights.map((item) => (
              <li key={item.slice(0, 30)} className="flex gap-2 text-sm leading-snug text-slate-700">
                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-slate-400" />
                <span>
                  <FormattedText text={item} />
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-2xs font-semibold uppercase tracking-wider text-slate-500">Recommendations</p>
          <ol className="mt-3 space-y-2.5">
            {recommendations.map((rec, i) => (
              <li key={rec.id} className="flex items-start gap-3">
                <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-md bg-brand-50 text-xs font-bold tabular-nums text-brand-700">
                  {i + 1}
                </span>
                <p className="min-w-0 text-sm leading-snug text-slate-800">{rec.action}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

function ActionsList() {
  const [openId, setOpenId] = useState<string | null>(recommendations[0]?.id ?? null);

  return (
    <ul className="divide-y divide-slate-100">
      {recommendations.map((rec, i) => {
        const open = openId === rec.id;
        return (
          <li key={rec.id}>
            <button
              type="button"
              onClick={() => setOpenId(open ? null : rec.id)}
              aria-expanded={open}
              className="flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-slate-50"
            >
              <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-md bg-brand-50 text-xs font-bold tabular-nums text-brand-700">
                {i + 1}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold leading-snug text-slate-900">{rec.action}</p>
                <p className="mt-1 line-clamp-1 text-sm text-slate-500">{rec.expectedImpact}</p>
              </div>
            </button>
            {open ? (
              <div className="space-y-3 border-t border-slate-100 bg-slate-50/60 px-4 py-3 pl-[3.25rem]">
                <Detail label="Lever" value={rec.lever} />
                <Detail label="Exact setting change" value={rec.exactSettingChange} />
                <Detail label="Why this now" value={rec.whyNow} />
                <div className="grid gap-3 sm:grid-cols-2">
                  <Detail label="Expected impact" value={rec.expectedImpact} />
                  <Detail label="Risk" value={rec.risk} />
                </div>
                <Detail label="How to monitor" value={rec.howToMonitor} />
              </div>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-2xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-0.5 text-sm leading-snug text-slate-700">{value}</p>
    </div>
  );
}
