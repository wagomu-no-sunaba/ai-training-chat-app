import type { ErrorType, OpenRouterError } from "@/app/types/error";

/**
 * 構造化されたエラーレスポンスを作成する
 * @param type - エラータイプ
 * @param message - エラーメッセージ
 * @param code - エラーコード
 * @returns 構造化されたエラーレスポンス
 */
export function createErrorResponse(
  type: ErrorType,
  message: string,
  code: string,
): OpenRouterError {
  return {
    error: {
      type,
      message,
      code,
    },
  };
}

/**
 * オブジェクトがOpenRouterErrorかどうかを判定する型ガード
 * @param error - 判定対象のオブジェクト
 * @returns OpenRouterErrorの場合true
 */
export function isOpenRouterError(error: unknown): error is OpenRouterError {
  if (typeof error !== "object" || error === null) {
    return false;
  }

  const err = error as Record<string, unknown>;

  if (typeof err.error !== "object" || err.error === null) {
    return false;
  }

  const errorDetail = err.error as Record<string, unknown>;

  return (
    typeof errorDetail.type === "string" &&
    typeof errorDetail.message === "string" &&
    typeof errorDetail.code === "string"
  );
}
