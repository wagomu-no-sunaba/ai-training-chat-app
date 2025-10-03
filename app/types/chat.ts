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
