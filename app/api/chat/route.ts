import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { createErrorResponse } from "@/app/lib/errors";
import { getOpenRouterModel } from "@/app/lib/openrouter";

/**
 * POST /api/chat - チャットAPI
 * OpenRouterを使用してAIモデルとストリーミング対話を行う
 */
export async function POST(request: Request) {
  try {
    // リクエストボディのパース
    const { messages }: { messages: UIMessage[] } = await request.json();

    // メッセージ配列の検証
    if (!messages || messages.length === 0) {
      return Response.json(
        createErrorResponse(
          "api_error",
          "Messages array must not be empty",
          "INVALID_MESSAGES",
        ),
        { status: 500 },
      );
    }

    // OpenRouterモデルの取得
    let model: ReturnType<typeof getOpenRouterModel>;
    try {
      model = getOpenRouterModel();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      console.error("OpenRouter initialization error:", errorMessage);

      return Response.json(
        createErrorResponse("api_error", errorMessage, "OPENROUTER_INIT_ERROR"),
        { status: 500 },
      );
    }

    // ストリーミングレスポンスの生成
    const result = streamText({
      model,
      messages: convertToModelMessages(messages),
    });

    // ストリーミングレスポンスを返す
    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("Chat API error:", error);

    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred";

    return Response.json(
      createErrorResponse("api_error", errorMessage, "INTERNAL_ERROR"),
      { status: 500 },
    );
  }
}
