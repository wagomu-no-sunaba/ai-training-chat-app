"use client";

import { useEffect, useRef } from "react";
import type { Message } from "@/app/types/chat";
import { MessageItem } from "./MessageItem";

export interface MessageListProps {
  messages: Message[];
  isStreaming: boolean;
}

export function MessageList({ messages, isStreaming }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 自動スクロール機能
  // biome-ignore lint/correctness/useExhaustiveDependencies: messages and isStreaming changes should trigger scroll
  useEffect(() => {
    if (
      messagesEndRef.current &&
      typeof messagesEndRef.current.scrollIntoView === "function"
    ) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isStreaming]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message) => (
        <MessageItem key={message.id} message={message} />
      ))}

      {isStreaming && (
        <div className="flex justify-start mb-4">
          <div className="max-w-[70%] rounded-lg px-4 py-2 bg-gray-100 text-gray-900">
            <div className="whitespace-pre-wrap break-words">...</div>
          </div>
        </div>
      )}

      <div ref={messagesEndRef} data-testid="message-end" />
    </div>
  );
}
