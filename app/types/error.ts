/**
 * エラータイプ定義
 */
export type ErrorType =
  | "validation_error"
  | "authentication_error"
  | "rate_limit_error"
  | "api_error";

/**
 * OpenRouterエラーレスポンス型
 */
export interface OpenRouterError {
  error: {
    type: ErrorType;
    message: string;
    code: string;
  };
}
