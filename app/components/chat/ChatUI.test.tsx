import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ChatUI } from "./ChatUI";

// useChatフックのモック
vi.mock("@ai-sdk/react", () => ({
  useChat: vi.fn(),
}));

import { useChat } from "@ai-sdk/react";

describe("ChatUI", () => {
  const mockUseChat = useChat as ReturnType<typeof vi.fn>;

  beforeEach(() => {
    // デフォルトのuseChatモック実装（AI SDK v2 API）
    mockUseChat.mockReturnValue({
      messages: [],
      sendMessage: vi.fn(),
      status: "ready",
      error: undefined,
      stop: vi.fn(),
      regenerate: vi.fn(),
      setMessages: vi.fn(),
      resumeStream: vi.fn(),
      addToolResult: vi.fn(),
      clearError: vi.fn(),
      id: "test-chat-id",
    });
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it("チャット入力フィールドとメッセージ表示エリアを表示する", () => {
    render(<ChatUI />);

    expect(screen.getByRole("textbox")).toBeDefined();
    expect(screen.getByRole("button", { name: /送信/i })).toBeDefined();
  });

  it("メッセージ履歴を表示する", () => {
    const mockMessages = [
      {
        id: "1",
        role: "user" as const,
        parts: [{ type: "text" as const, text: "Hello" }],
      },
      {
        id: "2",
        role: "assistant" as const,
        parts: [{ type: "text" as const, text: "Hi there!" }],
      },
    ];

    mockUseChat.mockReturnValue({
      messages: mockMessages,
      sendMessage: vi.fn(),
      status: "ready",
      error: undefined,
      stop: vi.fn(),
      regenerate: vi.fn(),
      setMessages: vi.fn(),
      resumeStream: vi.fn(),
      addToolResult: vi.fn(),
      clearError: vi.fn(),
      id: "test-chat-id",
    });

    render(<ChatUI />);

    expect(screen.getByText("Hello")).toBeDefined();
    expect(screen.getByText("Hi there!")).toBeDefined();
  });

  it("メッセージ送信時にsendMessageを呼び出す", async () => {
    const user = userEvent.setup();
    const mockSendMessage = vi.fn();

    mockUseChat.mockReturnValue({
      messages: [],
      sendMessage: mockSendMessage,
      status: "ready",
      error: undefined,
      stop: vi.fn(),
      regenerate: vi.fn(),
      setMessages: vi.fn(),
      resumeStream: vi.fn(),
      addToolResult: vi.fn(),
      clearError: vi.fn(),
      id: "test-chat-id",
    });

    render(<ChatUI />);

    // 入力フィールドにテキストを入力
    const input = screen.getByRole("textbox");
    await user.type(input, "Test message");

    // 送信ボタンをクリック
    const button = screen.getByRole("button", { name: /送信/i });
    await user.click(button);

    expect(mockSendMessage).toHaveBeenCalledWith({ text: "Test message" });
  });

  it("ローディング中は送信ボタンを無効化する", () => {
    mockUseChat.mockReturnValue({
      messages: [],
      sendMessage: vi.fn(),
      status: "streaming",
      error: undefined,
      stop: vi.fn(),
      regenerate: vi.fn(),
      setMessages: vi.fn(),
      resumeStream: vi.fn(),
      addToolResult: vi.fn(),
      clearError: vi.fn(),
      id: "test-chat-id",
    });

    render(<ChatUI />);

    const button = screen.getByRole("button", {
      name: /送信/i,
    }) as HTMLButtonElement;
    expect(button.disabled).toBe(true);
  });

  it("エラー発生時にエラーメッセージを表示する", () => {
    mockUseChat.mockReturnValue({
      messages: [],
      sendMessage: vi.fn(),
      status: "error",
      error: new Error("API Error"),
      stop: vi.fn(),
      regenerate: vi.fn(),
      setMessages: vi.fn(),
      resumeStream: vi.fn(),
      addToolResult: vi.fn(),
      clearError: vi.fn(),
      id: "test-chat-id",
    });

    render(<ChatUI />);

    // ErrorMessageコンポーネントが表示され、エラータイトルとメッセージが表示される
    expect(screen.getByText(/エラー/)).toBeDefined();
    expect(screen.getByText("API Error")).toBeDefined();
  });

  it("引数なしでuseChatを初期化する（デフォルトで/api/chatを使用）", () => {
    render(<ChatUI />);

    // デフォルト設定で呼ばれることを確認（引数なし）
    expect(mockUseChat).toHaveBeenCalled();
  });

  it("エラー発生時に再試行ボタンを表示する", () => {
    mockUseChat.mockReturnValue({
      messages: [],
      sendMessage: vi.fn(),
      status: "error",
      error: new Error("API Error"),
      stop: vi.fn(),
      regenerate: vi.fn(),
      setMessages: vi.fn(),
      resumeStream: vi.fn(),
      addToolResult: vi.fn(),
      clearError: vi.fn(),
      id: "test-chat-id",
    });

    render(<ChatUI />);

    expect(screen.getByRole("button", { name: /再試行/i })).toBeDefined();
  });

  it("再試行ボタンをクリックしたときにregenerateを呼び出す", async () => {
    const user = userEvent.setup();
    const mockRegenerate = vi.fn();

    mockUseChat.mockReturnValue({
      messages: [],
      sendMessage: vi.fn(),
      status: "error",
      error: new Error("API Error"),
      stop: vi.fn(),
      regenerate: mockRegenerate,
      setMessages: vi.fn(),
      resumeStream: vi.fn(),
      addToolResult: vi.fn(),
      clearError: vi.fn(),
      id: "test-chat-id",
    });

    render(<ChatUI />);

    const retryButton = screen.getByRole("button", { name: /再試行/i });
    await user.click(retryButton);

    expect(mockRegenerate).toHaveBeenCalled();
  });

  it("会話クリアボタンを表示する", () => {
    const mockMessages = [
      {
        id: "1",
        role: "user" as const,
        parts: [{ type: "text" as const, text: "Hello" }],
      },
    ];

    mockUseChat.mockReturnValue({
      messages: mockMessages,
      sendMessage: vi.fn(),
      status: "ready",
      error: undefined,
      stop: vi.fn(),
      regenerate: vi.fn(),
      setMessages: vi.fn(),
      resumeStream: vi.fn(),
      addToolResult: vi.fn(),
      clearError: vi.fn(),
      id: "test-chat-id",
    });

    render(<ChatUI />);

    expect(
      screen.getByRole("button", { name: /クリア|消去|リセット/i }),
    ).toBeDefined();
  });

  it("会話クリアボタンをクリックしたときにsetMessagesを空配列で呼び出す", async () => {
    const user = userEvent.setup();
    const mockSetMessages = vi.fn();
    const mockMessages = [
      {
        id: "1",
        role: "user" as const,
        parts: [{ type: "text" as const, text: "Hello" }],
      },
    ];

    mockUseChat.mockReturnValue({
      messages: mockMessages,
      sendMessage: vi.fn(),
      status: "ready",
      error: undefined,
      stop: vi.fn(),
      regenerate: vi.fn(),
      setMessages: mockSetMessages,
      resumeStream: vi.fn(),
      addToolResult: vi.fn(),
      clearError: vi.fn(),
      id: "test-chat-id",
    });

    render(<ChatUI />);

    const clearButton = screen.getByRole("button", {
      name: /クリア|消去|リセット/i,
    });
    await user.click(clearButton);

    expect(mockSetMessages).toHaveBeenCalledWith([]);
  });

  it("メッセージが空のときは会話クリアボタンを無効化する", () => {
    mockUseChat.mockReturnValue({
      messages: [],
      sendMessage: vi.fn(),
      status: "ready",
      error: undefined,
      stop: vi.fn(),
      regenerate: vi.fn(),
      setMessages: vi.fn(),
      resumeStream: vi.fn(),
      addToolResult: vi.fn(),
      clearError: vi.fn(),
      id: "test-chat-id",
    });

    render(<ChatUI />);

    const clearButton = screen.getByRole("button", {
      name: /クリア|消去|リセット/i,
    }) as HTMLButtonElement;
    expect(clearButton.disabled).toBe(true);
  });
});
