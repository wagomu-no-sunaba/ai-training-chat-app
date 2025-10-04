import { describe, expect, it } from "vitest";
import { getErrorMessage } from "./errorHelpers";

describe("getErrorMessage", () => {
  it("401エラーの場合、APIキー設定ガイダンスを返す", () => {
    const error = new Error("Unauthorized");
    (error as { status?: number }).status = 401;

    const result = getErrorMessage(error);

    expect(result.title).toBe("認証エラー");
    expect(result.message).toContain("APIキー");
    expect(result.actionText).toBe("設定を確認");
  });

  it("429エラーの場合、レート制限メッセージを返す", () => {
    const error = new Error("Too Many Requests");
    (error as { status?: number }).status = 429;

    const result = getErrorMessage(error);

    expect(result.title).toBe("レート制限");
    expect(result.message).toContain("しばらく待って");
    expect(result.actionText).toBe("後で再試行");
  });

  it("500エラーの場合、サーバーエラーメッセージを返す", () => {
    const error = new Error("Internal Server Error");
    (error as { status?: number }).status = 500;

    const result = getErrorMessage(error);

    expect(result.title).toBe("サーバーエラー");
    expect(result.message).toContain("サーバーで問題が発生");
    expect(result.actionText).toBe("再試行");
  });

  it("502エラーの場合、ゲートウェイエラーメッセージを返す", () => {
    const error = new Error("Bad Gateway");
    (error as { status?: number }).status = 502;

    const result = getErrorMessage(error);

    expect(result.title).toBe("接続エラー");
    expect(result.message).toContain("AI");
    expect(result.actionText).toBe("再試行");
  });

  it("400エラーの場合、入力エラーメッセージを返す", () => {
    const error = new Error("Bad Request");
    (error as { status?: number }).status = 400;

    const result = getErrorMessage(error);

    expect(result.title).toBe("入力エラー");
    expect(result.message).toContain("入力内容");
    expect(result.actionText).toBe("修正して再試行");
  });

  it("ステータスコードがない場合、一般的なエラーメッセージを返す", () => {
    const error = new Error("Something went wrong");

    const result = getErrorMessage(error);

    expect(result.title).toBe("エラー");
    expect(result.message).toBe("Something went wrong");
    expect(result.actionText).toBe("再試行");
  });

  it("エラーメッセージがない場合、デフォルトメッセージを返す", () => {
    const error = new Error();

    const result = getErrorMessage(error);

    expect(result.message).toBe("不明なエラーが発生しました");
  });
});
