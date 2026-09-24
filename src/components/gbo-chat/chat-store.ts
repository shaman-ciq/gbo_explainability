import { useState } from "react";
import { create, type StoreApi, type UseBoundStore } from "zustand";

import type { ChatVisual } from "./chat-visuals";
import { answerForPrompt, matchResponse, type ChatAnswer } from "./mock-answers";
import { STARTER_PROMPTS } from "./starter-prompts";

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
  source?: string;
  followUpIds?: string[];
  visual?: ChatVisual;
};

type ChatState = {
  messages: ChatMessage[];
  isResponding: boolean;
  askStarterPrompt: (promptId: string) => void;
  askFreeText: (text: string) => void;
  reset: () => void;
};

let idCounter = 0;
const nextId = () => `msg-${++idCounter}`;

function appendAnswer(
  set: (fn: (state: ChatState) => Partial<ChatState>) => void,
  answer: ChatAnswer,
) {
  window.setTimeout(
    () => {
      set((state) => ({
        isResponding: false,
        messages: [
          ...state.messages,
          {
            id: nextId(),
            role: "assistant",
            text: answer.summary,
            source: answer.source || undefined,
            followUpIds: answer.followUpIds,
            visual: answer.visual,
          },
        ],
      }));
    },
    380 + Math.random() * 260,
  );
}

/** One store per chat surface instance — variants never share a transcript. */
export function createChatStore() {
  return create<ChatState>((set) => ({
    messages: [],
    isResponding: false,
    askStarterPrompt: (promptId) => {
      const prompt = STARTER_PROMPTS.find((p) => p.id === promptId);
      if (!prompt) return;
      set((state) => ({
        isResponding: true,
        messages: [...state.messages, { id: nextId(), role: "user", text: prompt.question }],
      }));
      appendAnswer(set, answerForPrompt(promptId));
    },
    askFreeText: (text) => {
      const trimmed = text.trim();
      if (!trimmed) return;
      set((state) => ({
        isResponding: true,
        messages: [...state.messages, { id: nextId(), role: "user", text: trimmed }],
      }));
      const { answer } = matchResponse(trimmed);
      appendAnswer(set, answer);
    },
    reset: () => set({ messages: [], isResponding: false }),
  }));
}

export type ChatStore = UseBoundStore<StoreApi<ChatState>>;

/** Give each mounted shell its own isolated store instance. */
export function useNewChatStore(): ChatStore {
  const [store] = useState(() => createChatStore());
  return store;
}
