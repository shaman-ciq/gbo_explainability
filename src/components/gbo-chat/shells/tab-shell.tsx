"use client";

import { ChatSurface } from "../chat-surface";
import type { ChatStore } from "../chat-store";

/**
 * Approach 1 — Chat only. No Executive Summary tab at all; Chat is the report
 * experience, fully pull-based. Modeled on the RMM Ask AI reference.
 */
export function TabShell({ store }: { store: ChatStore }) {
  return (
    <div className="mx-auto h-full max-w-2xl">
      <ChatSurface store={store} />
    </div>
  );
}
