import { create } from "zustand";

/**
 * Cross-persona handoff, the AllyBrain pattern (RequestsContext): asking
 * someone else to handle a recommendation, not just reading about it.
 * One global store (not per-chat-instance, unlike ChatStore) — a delegation
 * is a fact about the recommendation itself, so it shows the same way
 * whichever variant or surface you're looking at it from.
 */
export type Delegation = {
  toPersona: string;
  note: string;
  dueLabel: string;
  assignedAt: number;
};

type DelegationState = {
  delegations: Record<string, Delegation>;
  delegate: (recommendationId: string, note: string, dueLabel: string) => void;
};

export const useDelegationStore = create<DelegationState>((set) => ({
  delegations: {},
  delegate: (recommendationId, note, dueLabel) =>
    set((state) => ({
      delegations: {
        ...state.delegations,
        [recommendationId]: { toPersona: "Sales Analyst", note, dueLabel, assignedAt: Date.now() },
      },
    })),
}));
