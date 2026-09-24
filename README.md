# GBO Explainability — chat prototypes

Three directional variants of chat-based explainability for the GBO Optimization Executive Summary, built for a customer-facing team review (not production-ready — see the PRD, FR-012–017).

Flip between variants with the segmented control at the top of the page (also mirrored in the URL as `?variant=pane|tab|inline`).

- **A · Pane** — today's pushed narrative (Performance Overview, What changed and why, What to do this week, Watchouts) stays as-is; a docked chat pane sits alongside it for follow-ups.
- **B · Tab** — a new "Chat" tab next to Analytics / Executive Summary. Fully pull-based: nothing is pre-rendered, matching the RMM Ask AI pattern (greeting, categorized starter prompts, persistent input).
- **C · Inline** — the pushed narrative stays on top; a chat box sits below it, and asking a question appends the Q&A turn further down the page instead of opening a side panel.

## Architecture

Shared primitives, thin presentational shells — built this way so any variant can be tweaked or recombined without a rewrite:

- `src/lib/mock/gbo-data.ts` — grounded content pulled from the live GBO app (Analytics, Executive Summary, Alerts) and the Budget Pacing email. Both the pushed narrative and the chat's mock answers read from here.
- `src/components/gbo-chat/` — the chat engine: `chat-store.ts` (per-instance zustand store, session-only), `mock-answers.ts` (scripted response engine, no live LLM), `starter-prompts.ts` (10 prompts across 5 categories), and shared UI atoms (transcript, composer, message bubble, starter chips).
- `src/components/gbo-chat/shells/` — `pane-shell.tsx`, `tab-shell.tsx`, `inline-shell.tsx`: the three variants, each just composing the shared atoms differently.
- `src/components/dashboard/executive-summary-narrative.tsx` — the pushed narrative content (Variants A & C only; omitted entirely in B).
- `src/components/dashboard/analytics-tab.tsx` — static visual placeholder; Analytics (FR-013–015) is out of scope for this prototype.

## Running locally

```bash
npm install
npm run dev
```
