"use client";

import { useEffect, useState } from "react";

import { AnalyticsTab } from "@/components/dashboard/analytics-tab";
import { DashboardTabs, type DashboardTabId } from "@/components/dashboard/dashboard-tabs";
import { ExperienceSwitcher, type Variant } from "@/components/experience-switcher";
import { useNewChatStore } from "@/components/gbo-chat/chat-store";
import { ChatSummaryShell } from "@/components/gbo-chat/shells/chat-summary-shell";
import { TabShell } from "@/components/gbo-chat/shells/tab-shell";
import { TopBar } from "@/components/layout/top-bar";

const VALID_VARIANTS: Variant[] = ["chat-only", "chat-summary"];

function readVariantFromUrl(): Variant {
  if (typeof window === "undefined") return "chat-only";
  const param = new URLSearchParams(window.location.search).get("variant");
  return (VALID_VARIANTS as string[]).includes(param ?? "") ? (param as Variant) : "chat-only";
}

export default function GboOptimizationPage() {
  const [variant, setVariant] = useState<Variant>("chat-only");
  const [tab, setTab] = useState<DashboardTabId>("chat");

  // One store per approach, created once for the page's lifetime (not per-tab-render) —
  // so switching Analytics <-> the report tab never loses the conversation. Each
  // approach keeps its own thread; only an explicit "New chat" or a real page reload
  // clears it (this page is MTD/T-1 and refreshes daily, so nothing here survives reload
  // by design — see the reset-on-reload note in each shell).
  const chatOnlyStore = useNewChatStore();
  const chatSummaryStore = useNewChatStore();

  useEffect(() => {
    const v = readVariantFromUrl();
    setVariant(v);
    setTab(v === "chat-only" ? "chat" : "executive-summary");
  }, []);

  const handleVariantChange = (next: Variant) => {
    setVariant(next);
    setTab(next === "chat-only" ? "chat" : "executive-summary");
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

          {tab === "chat" && variant === "chat-only" ? <TabShell store={chatOnlyStore} /> : null}

          {tab === "executive-summary" && variant === "chat-summary" ? (
            <ChatSummaryShell store={chatSummaryStore} />
          ) : null}
        </div>
      </main>
    </div>
  );
}
