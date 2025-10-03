import { createOpenRouter } from "@openrouter/ai-sdk-provider";

const DEFAULT_MODEL = "anthropic/claude-3.7-sonnet:thinking";

/**
 * OpenRouterインスタンスを初期化する
 * @throws {Error} APIキーが設定されていない場合
 * @returns OpenRouterインスタンス
 */
export function initializeOpenRouter() {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey || apiKey.trim() === "") {
    throw new Error("OPENROUTER_API_KEY environment variable is not set");
  }

  return createOpenRouter({
    apiKey,
  });
}

/**
 * OpenRouterモデルインスタンスを取得する
 * @param modelName - 使用するモデル名(オプション)
 * @returns モデルインスタンス
 */
export function getOpenRouterModel(modelName?: string) {
  const openrouter = initializeOpenRouter();
  const model = modelName || process.env.OPENROUTER_MODEL || DEFAULT_MODEL;

  return openrouter(model);
}
