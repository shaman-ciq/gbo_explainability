"use client";

import { AlertTriangle, Check, Send, UserRound } from "lucide-react";
import { useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import type { Recommendation } from "@/lib/mock/gbo-data";
import { cn } from "@/lib/utils";
import type { ChatStore } from "./chat-store";
import { useDelegationStore } from "./delegation-store";

export type ChatVisual =
  | { kind: "stat-tiles"; tiles: { label: string; value: string; tone?: "success" | "warning" | "neutral" }[] }
  | {
      kind: "comparison-bars";
      unit: "percent" | "currency" | "ratio";
      legend: [string, string];
      rows: { label: string; a: number; b: number; note?: string }[];
    }
  | { kind: "pacing-bar"; label: string; actualPct: number; projectedPct: number }
  | { kind: "recommendation"; rec: Recommendation };

export function ChatVisualCard({ visual, store }: { visual: ChatVisual; store?: ChatStore }) {
  return (
    <div className="shadow-pane fade-in-up w-full max-w-[420px] overflow-hidden rounded-xl bg-white p-3.5">
      {visual.kind === "stat-tiles" ? <StatTiles tiles={visual.tiles} /> : null}
      {visual.kind === "comparison-bars" ? <ComparisonBars {...visual} /> : null}
      {visual.kind === "pacing-bar" ? <PacingBar {...visual} /> : null}
      {visual.kind === "recommendation" ? <RecommendationVisual rec={visual.rec} store={store} /> : null}
    </div>
  );
}

function StatTiles({ tiles }: { tiles: Extract<ChatVisual, { kind: "stat-tiles" }>["tiles"] }) {
  return (
    <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${tiles.length}, minmax(0, 1fr))` }}>
      {tiles.map((t) => (
        <div key={t.label} className="rounded-lg bg-slate-50 px-2.5 py-2.5 text-center">
          <p
            className={cn(
              "text-base font-semibold tabular-nums",
              t.tone === "success" && "text-success-600",
              t.tone === "warning" && "text-warning-600",
              (!t.tone || t.tone === "neutral") && "text-slate-900",
            )}
          >
            {t.value}
          </p>
          <p className="mt-0.5 text-2xs leading-snug text-muted-foreground">{t.label}</p>
        </div>
      ))}
    </div>
  );
}

function ComparisonBars({ unit, legend, rows }: Extract<ChatVisual, { kind: "comparison-bars" }>) {
  const fmt = (v: number) =>
    unit === "percent" ? `${v}%` : unit === "ratio" ? `${v}x` : `$${(v / 1000).toFixed(0)}K`;
  const data = rows.map((r) => ({ label: r.label, [legend[0]]: r.a, [legend[1]]: r.b }));
  const height = Math.max(rows.length * 44, 90);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-3 text-2xs text-muted-foreground">
        <LegendDot className="bg-slate-300" label={legend[0]} />
        <LegendDot className="bg-brand-500" label={legend[1]} />
      </div>
      <div style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 0, right: 8, bottom: 0, left: 0 }} barGap={2}>
            <CartesianGrid horizontal={false} stroke="#f1f5f9" />
            <XAxis type="number" hide />
            <YAxis
              type="category"
              dataKey="label"
              width={110}
              tick={{ fontSize: 11, fill: "#475569" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip formatter={(v: number) => fmt(v)} cursor={{ fill: "#f8fafc" }} />
            <Bar dataKey={legend[0]} fill="#cbd5e1" radius={[3, 3, 3, 3]} barSize={7} />
            <Bar dataKey={legend[1]} fill="#3b82f6" radius={[3, 3, 3, 3]} barSize={7} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      {rows.some((r) => r.note) ? (
        <div className="space-y-0.5">
          {rows
            .filter((r) => r.note)
            .map((r) => (
              <p key={r.label} className="text-2xs text-muted-foreground">
                <span className="font-medium text-slate-600">{r.label}:</span> {r.note}
              </p>
            ))}
        </div>
      ) : null}
    </div>
  );
}

function LegendDot({ className, label }: { className: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className={cn("size-2 rounded-full", className)} />
      {label}
    </span>
  );
}

function PacingBar({ label, actualPct, projectedPct }: Extract<ChatVisual, { kind: "pacing-bar" }>) {
  const clampedActual = Math.min(actualPct, 100);
  const behind = actualPct < 100;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium text-slate-700">{label}</span>
        <span className={cn("font-semibold tabular-nums", behind ? "text-error-600" : "text-success-600")}>
          {actualPct}%
        </span>
      </div>
      <div className="relative h-2.5 overflow-hidden rounded-full bg-slate-100">
        <div
          className={cn("h-full rounded-full", behind ? "bg-error-500" : "bg-success-500")}
          style={{ width: `${clampedActual}%` }}
        />
        <div
          className="absolute top-0 h-full w-0.5 bg-slate-500"
          style={{ left: `${Math.min(projectedPct, 100)}%` }}
          title="Projected"
        />
        <div className="absolute top-0 right-0 h-full w-0.5 bg-slate-900" title="Target — 100%" />
      </div>
      <div className="flex justify-between text-2xs text-muted-foreground">
        <span>Actual</span>
        <span>Projected {projectedPct}%</span>
        <span>Target 100%</span>
      </div>
    </div>
  );
}

const DUE_OPTIONS = ["Today", "Tomorrow", "This week"] as const;

function RecommendationVisual({ rec, store }: { rec: Recommendation; store?: ChatStore }) {
  const delegation = useDelegationStore((s) => s.delegations[rec.id]);
  const delegate = useDelegationStore((s) => s.delegate);
  const [composing, setComposing] = useState(false);
  const [note, setNote] = useState(`Please action: ${rec.action}.`);
  const [due, setDue] = useState<(typeof DUE_OPTIONS)[number]>("This week");

  const send = () => {
    delegate(rec.id, note.trim() || rec.action, due);
    setComposing(false);
    store?.getState().appendSystemMessage(
      `Sent to **Sales Analyst** — "${rec.action}", due ${due.toLowerCase()}. You'll hear back once it's handled.`,
    );
  };

  return (
    <div className="space-y-2.5">
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-semibold leading-snug text-slate-900">{rec.action}</p>
        <span
          className={cn(
            "shrink-0 rounded-full px-2 py-0.5 text-2xs font-semibold",
            rec.impactLabel === "High" ? "bg-error-50 text-error-700" : "bg-warning-50 text-warning-700",
          )}
        >
          {rec.impactLabel}
        </span>
      </div>
      <dl className="space-y-1.5 text-xs">
        <Row label="Lever" value={rec.lever} />
        <Row label="Why now" value={rec.whyNow} />
        <Row label="Risk" value={rec.risk} />
      </dl>

      <div className="border-t border-slate-100 pt-2.5">
        {delegation ? (
          <div className="flex items-center gap-2 rounded-lg bg-success-50 px-2.5 py-2 text-xs text-success-700">
            <Check className="size-3.5 shrink-0" />
            <span>
              Assigned to <strong className="font-semibold">{delegation.toPersona}</strong> · Due{" "}
              {delegation.dueLabel.toLowerCase()}
            </span>
          </div>
        ) : composing ? (
          <div className="space-y-2 rounded-lg bg-slate-50 p-2.5">
            <div className="flex items-center gap-1.5 text-2xs font-semibold text-slate-500">
              <span className="flex size-5 items-center justify-center rounded-full bg-brand-100 text-brand-700">
                <UserRound className="size-3" />
              </span>
              Sales Analyst
            </div>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={2}
              className="w-full resize-none rounded-md border border-slate-200 bg-white px-2 py-1.5 text-xs text-slate-700 outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
            />
            <div className="flex flex-wrap items-center gap-1.5">
              {DUE_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setDue(opt)}
                  className={cn(
                    "rounded-full px-2 py-0.5 text-2xs font-medium transition-colors",
                    due === opt ? "bg-brand-500 text-white" : "bg-white text-slate-500 ring-1 ring-slate-200 hover:text-slate-800",
                  )}
                >
                  {opt}
                </button>
              ))}
            </div>
            <div className="flex justify-end gap-1.5 pt-0.5">
              <button
                type="button"
                onClick={() => setComposing(false)}
                className="rounded-md px-2 py-1 text-2xs font-medium text-slate-500 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={send}
                className="flex items-center gap-1 rounded-md bg-brand-500 px-2.5 py-1 text-2xs font-semibold text-white hover:bg-brand-600"
              >
                <Send className="size-3" />
                Send
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setComposing(true)}
            className="flex items-center gap-1.5 text-xs font-medium text-brand-600 hover:text-brand-700"
          >
            <UserRound className="size-3.5" />
            Ask Sales Analyst to handle this
          </button>
        )}
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-2xs font-semibold tracking-wide text-slate-400 uppercase">{label}</dt>
      <dd className="mt-0.5 leading-snug text-slate-600">{value}</dd>
    </div>
  );
}

export function WatchoutBadge() {
  return <AlertTriangle className="size-3.5 shrink-0 text-warning-600" />;
}
