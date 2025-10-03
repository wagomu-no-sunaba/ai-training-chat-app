import type { Message } from "@/app/types/chat";

export interface MessageItemProps {
  message: Message;
}

export function MessageItem({ message }: MessageItemProps) {
  const isUser = message.role === "user";
  const isSystem = message.role === "system";

  return (
    <div
      className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4 ${
        isSystem ? "justify-center" : ""
      }`}
    >
      <div
        className={`max-w-[70%] rounded-lg px-4 py-2 ${
          isUser
            ? "bg-blue-500 text-white"
            : isSystem
              ? "bg-gray-200 text-gray-700 italic"
              : "bg-gray-100 text-gray-900"
        }`}
      >
        <div className="whitespace-pre-wrap break-words">{message.content}</div>
      </div>
    </div>
  );
}
