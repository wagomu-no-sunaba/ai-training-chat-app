/**
 * メッセージロール型
 */
export type MessageRole = "user" | "assistant" | "system";

/**
 * チャットメッセージ型
 */
export interface ChatMessage {
  role: MessageRole;
  content: string;
}

/**
 * チャットAPIリクエスト型
 */
export interface ChatRequest {
  messages: ChatMessage[];
}

/**
 * UIメッセージ型（useChatフック用）
 */
export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  createdAt?: Date;
}
