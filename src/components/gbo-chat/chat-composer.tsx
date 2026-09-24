"use client";

import { ArrowUp } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { PromptInput, PromptInputActions, PromptInputTextarea } from "@/components/ui/prompt-input";

export function ChatComposer({
  onSubmit,
  disabled,
  placeholder = "Ask about pacing, drivers, or what to do next…",
  autoFocus,
}: {
  onSubmit: (text: string) => void;
  disabled?: boolean;
  placeholder?: string;
  autoFocus?: boolean;
}) {
  const [value, setValue] = useState("");

  const handleSubmit = () => {
    if (!value.trim() || disabled) return;
    onSubmit(value);
    setValue("");
  };

  return (
    <PromptInput value={value} onValueChange={setValue} onSubmit={handleSubmit} disabled={disabled}>
      <PromptInputTextarea placeholder={placeholder} autoFocus={autoFocus} />
      <PromptInputActions>
        <Button
          type="button"
          size="icon"
          disabled={disabled || !value.trim()}
          onClick={handleSubmit}
          aria-label="Send"
          className="rounded-full"
        >
          <ArrowUp />
        </Button>
      </PromptInputActions>
    </PromptInput>
  );
}
