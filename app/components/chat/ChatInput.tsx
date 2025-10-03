"use client";

import type { KeyboardEvent } from "react";

export interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (message: string) => void;
  disabled: boolean;
  placeholder?: string;
}

export function ChatInput({
  value,
  onChange,
  onSubmit,
  disabled,
  placeholder = "メッセージを入力してください...",
}: ChatInputProps) {
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    if (value.trim() === "") {
      return;
    }
    onSubmit(value);
  };

  return (
    <div className="flex gap-2">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        placeholder={placeholder}
        className="flex-1 resize-none rounded border border-gray-300 p-2 focus:border-blue-500 focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
        rows={1}
      />
      <button
        type="button"
        onClick={handleSubmit}
        disabled={disabled || value.trim() === ""}
        className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        送信
      </button>
    </div>
  );
}
