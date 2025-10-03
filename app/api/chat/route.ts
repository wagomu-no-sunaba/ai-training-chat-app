import { streamText } from "ai";
import { createErrorResponse } from "@/app/lib/errors";
import { getOpenRouterModel } from "@/app/lib/openrouter";
import { validateChatRequest } from "@/app/lib/validators";

/**
 * POST /api/chat - チャットAPI
 * OpenRouterを使用してAIモデルとストリーミング対話を行う
 */
export async function POST(request: Request) {
  try {
    // リクエストボディのパース
    const body = await request.json().catch(() => null);

    // リクエストの検証
    if (!validateChatRequest(body)) {
      return Response.json(
        createErrorResponse(
          "validation_error",
          "Invalid request body. Expected { messages: Array<{ role: 'user' | 'assistant' | 'system', content: string }> }",
          "INVALID_REQUEST_BODY",
        ),
        { status: 400 },
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
      messages: body.messages,
    });

    // ストリーミングレスポンスを返す
    return result.toTextStreamResponse();
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
