import { cleanup, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ErrorMessage } from "./ErrorMessage";

describe("ErrorMessage", () => {
  afterEach(() => {
    cleanup();
  });

  it("一般的なエラーメッセージを表示する", () => {
    const mockOnRetry = vi.fn();
    const mockOnDismiss = vi.fn();

    render(
      <ErrorMessage
        message="エラーが発生しました"
        onRetry={mockOnRetry}
        onDismiss={mockOnDismiss}
      />,
    );

    expect(screen.getByText(/エラーが発生しました/)).toBeDefined();
  });

  it("再試行ボタンをクリックするとonRetryが呼ばれる", async () => {
    const user = userEvent.setup();
    const mockOnRetry = vi.fn();
    const mockOnDismiss = vi.fn();

    render(
      <ErrorMessage
        message="エラーが発生しました"
        onRetry={mockOnRetry}
        onDismiss={mockOnDismiss}
      />,
    );

    await user.click(screen.getByRole("button", { name: /再試行/ }));
    expect(mockOnRetry).toHaveBeenCalledTimes(1);
  });

  it("閉じるボタンをクリックするとonDismissが呼ばれる", async () => {
    const user = userEvent.setup();
    const mockOnRetry = vi.fn();
    const mockOnDismiss = vi.fn();

    render(
      <ErrorMessage
        message="エラーが発生しました"
        onRetry={mockOnRetry}
        onDismiss={mockOnDismiss}
      />,
    );

    await user.click(screen.getByRole("button", { name: /閉じる/ }));
    expect(mockOnDismiss).toHaveBeenCalledTimes(1);
  });

  it("タイトルが提供された場合、タイトルを表示する", () => {
    const mockOnRetry = vi.fn();
    const mockOnDismiss = vi.fn();

    render(
      <ErrorMessage
        title="認証エラー"
        message="APIキーが無効です"
        onRetry={mockOnRetry}
        onDismiss={mockOnDismiss}
      />,
    );

    expect(screen.getByText(/認証エラー/)).toBeDefined();
    expect(screen.getByText("APIキーが無効です")).toBeDefined();
  });

  it("actionTextが提供された場合、カスタムアクションボタンテキストを表示する", () => {
    const mockOnRetry = vi.fn();
    const mockOnDismiss = vi.fn();

    render(
      <ErrorMessage
        message="レート制限に達しました"
        actionText="後で再試行"
        onRetry={mockOnRetry}
        onDismiss={mockOnDismiss}
      />,
    );

    expect(screen.getByRole("button", { name: /後で再試行/ })).toBeDefined();
  });

  it("typeがerrorの場合、赤色のスタイルを適用する", () => {
    const mockOnRetry = vi.fn();
    const mockOnDismiss = vi.fn();

    const { container } = render(
      <ErrorMessage
        message="エラー"
        type="error"
        onRetry={mockOnRetry}
        onDismiss={mockOnDismiss}
      />,
    );

    const errorDiv = container.querySelector(".bg-red-100");
    expect(errorDiv).not.toBeNull();
  });

  it("typeがwarningの場合、黄色のスタイルを適用する", () => {
    const mockOnRetry = vi.fn();
    const mockOnDismiss = vi.fn();

    const { container } = render(
      <ErrorMessage
        message="警告"
        type="warning"
        onRetry={mockOnRetry}
        onDismiss={mockOnDismiss}
      />,
    );

    const warningDiv = container.querySelector(".bg-yellow-100");
    expect(warningDiv).not.toBeNull();
  });

  it("onRetryが提供されていない場合、再試行ボタンを表示しない", () => {
    const mockOnDismiss = vi.fn();

    render(<ErrorMessage message="エラー" onDismiss={mockOnDismiss} />);

    expect(screen.queryByRole("button", { name: /再試行/ })).toBeNull();
  });

  it("onDismissが提供されていない場合、閉じるボタンを表示しない", () => {
    const mockOnRetry = vi.fn();

    render(<ErrorMessage message="エラー" onRetry={mockOnRetry} />);

    expect(screen.queryByRole("button", { name: /閉じる/ })).toBeNull();
  });
});
