"use client";

import { useEffect, useState } from "react";

import { AnalyticsTab } from "@/components/dashboard/analytics-tab";
import { DashboardTabs, type DashboardTabId } from "@/components/dashboard/dashboard-tabs";
import { ExecutiveSummaryNarrative } from "@/components/dashboard/executive-summary-narrative";
import { ExperienceSwitcher, type Variant } from "@/components/experience-switcher";
import { useNewChatStore } from "@/components/gbo-chat/chat-store";
import { InlineShell } from "@/components/gbo-chat/shells/inline-shell";
import { PaneShell } from "@/components/gbo-chat/shells/pane-shell";
import { TabShell } from "@/components/gbo-chat/shells/tab-shell";
import { TopBar } from "@/components/layout/top-bar";

const VALID_VARIANTS: Variant[] = ["pane", "tab", "inline"];

function readVariantFromUrl(): Variant {
  if (typeof window === "undefined") return "pane";
  const param = new URLSearchParams(window.location.search).get("variant");
  return (VALID_VARIANTS as string[]).includes(param ?? "") ? (param as Variant) : "pane";
}

export default function GboOptimizationPage() {
  const [variant, setVariant] = useState<Variant>("pane");
  const [tab, setTab] = useState<DashboardTabId>("executive-summary");

  // One store per variant, created once for the page's lifetime (not per-tab-render) —
  // so switching Analytics <-> Executive Summary never loses the conversation. Each
  // variant keeps its own thread; only an explicit "New chat" or a real page reload
  // clears it (this page is MTD/T-1 and refreshes daily, so nothing here survives reload
  // by design — see the reset-on-reload note in each shell).
  const paneStore = useNewChatStore();
  const inlineStore = useNewChatStore();
  const tabStore = useNewChatStore();

  useEffect(() => {
    setVariant(readVariantFromUrl());
  }, []);

  const handleVariantChange = (next: Variant) => {
    setVariant(next);
    setTab("executive-summary");
    const url = new URL(window.location.href);
    url.searchParams.set("variant", next);
    window.history.replaceState({}, "", url);
  };

  // Fixed-viewport shell (like AllyBrain's Layout.jsx): header stack has its
  // natural height, `main` takes exactly what's left. Nothing below guesses
  // its own height from `100vh` minus some assumed header size.
  return (
    <div className="flex h-screen flex-col bg-slate-50">
      <TopBar />
      <ExperienceSwitcher value={variant} onChange={handleVariantChange} />
      <DashboardTabs variant={variant} active={tab} onChange={setTab} />

      <main className="min-h-0 flex-1 overflow-hidden">
        <div className="mx-auto h-full max-w-6xl px-5 py-5">
          {tab === "analytics" ? (
            <div className="h-full overflow-y-auto">
              <AnalyticsTab />
            </div>
          ) : null}

          {tab === "executive-summary" ? (
            <>
              {variant === "pane" ? <PaneShell store={paneStore} /> : null}
              {variant === "inline" ? <InlineShell store={inlineStore} /> : null}
              {variant === "tab" ? (
                <div className="h-full overflow-y-auto">
                  <ExecutiveSummaryNarrative />
                </div>
              ) : null}
            </>
          ) : null}

          {tab === "chat" && variant === "tab" ? <TabShell store={tabStore} /> : null}
        </div>
      </main>
    </div>
  );
}
