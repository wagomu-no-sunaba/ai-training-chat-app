"use client";

import { useChat } from "@ai-sdk/react";
import { useState } from "react";
import type { Message } from "@/app/types/chat";
import { ChatInput } from "./ChatInput";
import { MessageList } from "./MessageList";

export function ChatUI() {
  const [inputValue, setInputValue] = useState("");

  const { messages, sendMessage, status, error } = useChat();

  const isLoading = status === "streaming" || status === "submitted";

  const handleSubmit = () => {
    if (inputValue.trim()) {
      sendMessage({ text: inputValue });
      setInputValue("");
    }
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

  return (
    <div className="flex h-screen flex-col">
      {/* エラー表示 */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <strong className="font-bold">エラーが発生しました: </strong>
          <span className="block sm:inline">{error.message}</span>
        </div>
      )}

      {/* メッセージリスト */}
      <div className="flex-1 overflow-y-auto p-4">
        <MessageList messages={typedMessages} isStreaming={isLoading} />
      </div>

      {/* 入力エリア */}
      <div className="border-t p-4">
        <ChatInput
          value={inputValue}
          onChange={setInputValue}
          onSubmit={handleSubmit}
          disabled={isLoading}
        />
      </div>
    </div>
  );
}
