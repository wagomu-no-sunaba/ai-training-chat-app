"use client";

import { useChat } from "@ai-sdk/react";
import { useState } from "react";
import { getErrorMessage } from "@/app/lib/errorHelpers";
import type { Message } from "@/app/types/chat";
import { ChatInput } from "./ChatInput";
import { ErrorMessage } from "./ErrorMessage";
import { MessageList } from "./MessageList";

export function ChatUI() {
  const [inputValue, setInputValue] = useState("");

  const { messages, sendMessage, status, error, regenerate, setMessages } =
    useChat();

  const isLoading = status === "streaming" || status === "submitted";

  const handleSubmit = () => {
    if (inputValue.trim()) {
      sendMessage({ text: inputValue });
      setInputValue("");
    }
  };

  const handleClearChat = () => {
    setMessages([]);
    setInputValue("");
  };

  // messagesをMessage型に変換（partsからテキストを抽出）
  const typedMessages: Message[] = messages.map((msg) => {
    const textContent = msg.parts
      .filter((part) => part.type === "text")
      .map((part) => (part as { text: string }).text)
      .join("");

    return {
      id: msg.id,
      role: msg.role as "user" | "assistant" | "system",
      content: textContent,
    };
  });

  const errorInfo = error ? getErrorMessage(error) : null;

  return (
    <div className="flex h-screen flex-col">
      {/* エラー表示 */}
      {error && errorInfo && (
        <ErrorMessage
          title={errorInfo.title}
          message={errorInfo.message}
          actionText={errorInfo.actionText}
          onRetry={() => regenerate()}
          onDismiss={() => {
            /* エラーは再試行で自動クリアされる */
          }}
        />
      )}

      {/* メッセージリスト */}
      <div className="flex-1 overflow-y-auto p-4">
        <MessageList messages={typedMessages} isStreaming={isLoading} />
      </div>

      {/* 入力エリア */}
      <div className="border-t p-4">
        <div className="flex gap-2">
          <div className="flex-1">
            <ChatInput
              value={inputValue}
              onChange={setInputValue}
              onSubmit={handleSubmit}
              disabled={isLoading}
            />
          </div>
          <button
            type="button"
            onClick={handleClearChat}
            disabled={messages.length === 0}
            className="rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-600 disabled:bg-gray-300 disabled:cursor-not-allowed whitespace-nowrap self-end"
          >
            クリア
          </button>
        </div>
      </div>
    </div>
  );
}
