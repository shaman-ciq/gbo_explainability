"use client";

import React, {
  createContext,
  useContext,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type PromptInputContextType = {
  value: string;
  setValue: (value: string) => void;
  onSubmit?: () => void;
  disabled?: boolean;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
};

const PromptInputContext = createContext<PromptInputContextType>({
  value: "",
  setValue: () => {},
  onSubmit: undefined,
  disabled: false,
  textareaRef: React.createRef<HTMLTextAreaElement>(),
});

function usePromptInput() {
  return useContext(PromptInputContext);
}

export type PromptInputProps = {
  value?: string;
  onValueChange?: (value: string) => void;
  onSubmit?: () => void;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
};

function PromptInput({
  className,
  value,
  onValueChange,
  onSubmit,
  children,
  disabled = false,
}: PromptInputProps) {
  const [internalValue, setInternalValue] = useState(value || "");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleChange = (newValue: string) => {
    setInternalValue(newValue);
    onValueChange?.(newValue);
  };

  return (
    <PromptInputContext.Provider
      value={{
        value: value ?? internalValue,
        setValue: onValueChange ?? handleChange,
        onSubmit,
        disabled,
        textareaRef,
      }}
    >
      <div
        onClick={() => !disabled && textareaRef.current?.focus()}
        className={cn(
          "flex cursor-text items-end gap-2 rounded-2xl border border-input bg-background p-2 shadow-xs transition-colors focus-within:border-ring",
          disabled && "cursor-not-allowed opacity-60",
          className,
        )}
      >
        {children}
      </div>
    </PromptInputContext.Provider>
  );
}

function PromptInputTextarea({
  className,
  placeholder = "Ask a question…",
  autoFocus,
}: {
  className?: string;
  placeholder?: string;
  autoFocus?: boolean;
}) {
  const { value, setValue, onSubmit, disabled, textareaRef } = usePromptInput();

  const adjustHeight = (el: HTMLTextAreaElement | null) => {
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  };

  useLayoutEffect(() => {
    adjustHeight(textareaRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <Textarea
      ref={textareaRef}
      value={value}
      placeholder={placeholder}
      rows={1}
      disabled={disabled}
      autoFocus={autoFocus}
      onChange={(e) => {
        adjustHeight(e.target);
        setValue(e.target.value);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          onSubmit?.();
        }
      }}
      className={cn(
        "min-h-9 flex-1 resize-none border-none bg-transparent px-1.5 py-1.5 shadow-none focus-visible:ring-0",
        className,
      )}
    />
  );
}

function PromptInputActions({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn("flex shrink-0 items-center gap-1.5", className)}>{children}</div>;
}

export { PromptInput, PromptInputTextarea, PromptInputActions, usePromptInput };
