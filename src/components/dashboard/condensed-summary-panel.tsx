"use client";

import { AlertTriangle, Check, Info } from "lucide-react";
import { useState } from "react";

import { FormattedText } from "@/components/ui/formatted-text";
import { useDelegationStore } from "@/components/gbo-chat/delegation-store";
import {
  asOfDisclaimer,
  asOfLabel,
  changeDrivers,
  overridePressure,
  recommendations,
  watchouts,
} from "@/lib/mock/gbo-data";
import { AccordionSection } from "./accordion-section";
import { KpiStrip } from "./kpi-strip";

/**
 * Approach 2's left panel: the same Executive Summary content, condensed to
 * titles-first — every section collapsed by default, expand only what you
 * need. Chat is the primary surface here; this panel is a quick-reference,
 * not the main event.
 */
export function CondensedSummaryPanel() {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2 px-0.5">
        <h2 className="text-sm font-semibold text-slate-900">Executive Summary</h2>
        <p className="text-2xs tabular-nums text-slate-400">{asOfLabel}</p>
      </div>

      <KpiStrip compact />

      <AccordionSection
        title="Performance Overview"
        description="Headline pacing story and recommendations"
        defaultOpen={false}
      >
        <PerformanceOverviewCondensed />
      </AccordionSection>

      <AccordionSection
        title="What changed and why"
        description="Top drivers behind pacing shifts"
        defaultOpen={false}
      >
        <ol className="divide-y divide-slate-100">
          {changeDrivers.map((d) => (
            <li key={d.id} className="px-3.5 py-2.5">
              <p className="text-xs font-semibold leading-snug text-slate-900">{d.title}</p>
              <p className="mt-0.5 text-xs leading-relaxed text-slate-600">{d.detail}</p>
            </li>
          ))}
        </ol>
      </AccordionSection>

      <AccordionSection
        title="What to do this week"
        description="Recommendations, with delegation status"
        defaultOpen={false}
      >
        <ActionsListCondensed />
      </AccordionSection>

      <AccordionSection
        title="Watchouts"
        description="Risks to monitor"
        defaultOpen={false}
      >
        <ul className="flex flex-col gap-2 px-3.5 py-2.5">
          {watchouts.map((w) => (
            <li key={w.id} className="flex gap-1.5 text-xs leading-snug">
              <AlertTriangle className="mt-0.5 size-3 shrink-0 text-warning-600" />
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

function PerformanceOverviewCondensed() {
  const headline = `Largest under-pacing pocket: **JBC Fresh Sponsored Brands** at 54.7% ($98.4K / $180.0K). Manual overrides (${overridePressure.manual} vs ${overridePressure.allyRecommended} Ally-recommended) are adding spend pressure.`;

  return (
    <div className="space-y-4 px-3.5 py-3">
      <div className="flex items-start gap-2 text-xs text-slate-500">
        <Info className="mt-0.5 size-3 shrink-0" />
        <span>{asOfDisclaimer}</span>
      </div>
      <p className="text-xs leading-relaxed text-slate-700">
        <FormattedText text={headline} />
      </p>
      <div>
        <p className="text-2xs font-semibold tracking-wider text-slate-500 uppercase">Recommendations</p>
        <ol className="mt-2 space-y-2">
          {recommendations.map((rec, i) => (
            <li key={rec.id} className="flex items-start gap-2">
              <span className="mt-0.5 flex size-4.5 shrink-0 items-center justify-center rounded-md bg-brand-50 text-2xs font-bold tabular-nums text-brand-700">
                {i + 1}
              </span>
              <p className="min-w-0 text-xs leading-snug text-slate-800">{rec.action}</p>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

function ActionsListCondensed() {
  const [openId, setOpenId] = useState<string | null>(null);
  const delegations = useDelegationStore((s) => s.delegations);

  return (
    <ul className="divide-y divide-slate-100">
      {recommendations.map((rec, i) => {
        const open = openId === rec.id;
        const delegation = delegations[rec.id];
        return (
          <li key={rec.id}>
            <button
              type="button"
              onClick={() => setOpenId(open ? null : rec.id)}
              aria-expanded={open}
              className="flex w-full items-start gap-2 px-3.5 py-2.5 text-left transition-colors hover:bg-slate-50"
            >
              <span className="mt-0.5 flex size-4.5 shrink-0 items-center justify-center rounded-md bg-brand-50 text-2xs font-bold tabular-nums text-brand-700">
                {i + 1}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold leading-snug text-slate-900">{rec.action}</p>
                {delegation ? (
                  <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-success-50 px-1.5 py-0.5 text-2xs font-medium text-success-700">
                    <Check className="size-2.5" />
                    Assigned to {delegation.toPersona}
                  </span>
                ) : (
                  <p className="mt-0.5 line-clamp-1 text-2xs text-slate-500">{rec.expectedImpact}</p>
                )}
              </div>
            </button>
            {open ? (
              <div className="fade-in-up space-y-2 border-t border-slate-100 bg-slate-50/60 px-3.5 py-2.5 pl-[2.75rem] text-xs">
                <Detail label="Lever" value={rec.lever} />
                <Detail label="Why now" value={rec.whyNow} />
                <Detail label="Risk" value={rec.risk} />
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
      <p className="text-2xs font-semibold tracking-wide text-slate-500 uppercase">{label}</p>
      <p className="mt-0.5 leading-snug text-slate-700">{value}</p>
    </div>
  );
}
