import type { ChatMessage, ChatRequest, MessageRole } from "@/app/types/chat";

const VALID_ROLES: readonly MessageRole[] = ["user", "assistant", "system"];

/**
 * メッセージロールが有効かどうかを検証する
 * @param role - 検証するロール
 * @returns 有効な場合true
 */
function isValidRole(role: unknown): role is MessageRole {
  return typeof role === "string" && VALID_ROLES.includes(role as MessageRole);
}

/**
 * チャットメッセージが有効かどうかを検証する
 * @param message - 検証するメッセージ
 * @returns 有効な場合true
 */
function isValidMessage(message: unknown): message is ChatMessage {
  if (typeof message !== "object" || message === null) {
    return false;
  }

  const msg = message as Record<string, unknown>;

  return (
    isValidRole(msg.role) &&
    typeof msg.content === "string" &&
    msg.content.trim() !== ""
  );
}

/**
 * チャットリクエストを検証する
 * @param request - 検証するリクエスト
 * @returns 有効な場合true
 */
export function validateChatRequest(request: unknown): request is ChatRequest {
  if (typeof request !== "object" || request === null) {
    return false;
  }

  const req = request as Record<string, unknown>;

  if (!Array.isArray(req.messages) || req.messages.length === 0) {
    return false;
  }

  return req.messages.every(isValidMessage);
}
