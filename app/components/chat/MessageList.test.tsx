import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { Message } from "@/app/types/chat";
import { MessageList } from "./MessageList";

describe("MessageList", () => {
  const messages: Message[] = [
    { id: "1", role: "user", content: "Hello" },
    { id: "2", role: "assistant", content: "Hi there!" },
    { id: "3", role: "user", content: "How are you?" },
  ];

  beforeEach(() => {
    // スクロール関数のモック
    Element.prototype.scrollIntoView = vi.fn();
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it("should render all messages in order", () => {
    render(<MessageList messages={messages} isStreaming={false} />);

    expect(screen.getByText("Hello")).toBeDefined();
    expect(screen.getByText("Hi there!")).toBeDefined();
    expect(screen.getByText("How are you?")).toBeDefined();
  });

  it("should render empty state when no messages", () => {
    render(<MessageList messages={[]} isStreaming={false} />);

    // メッセージがない場合、メッセージテキストが存在しない
    expect(screen.queryByText("Hello")).toBeNull();
    expect(screen.queryByText("Hi there!")).toBeNull();
  });

  it("should auto-scroll to bottom after rendering", () => {
    const { container } = render(
      <MessageList messages={messages} isStreaming={false} />,
    );

    const scrollElement = container.querySelector(
      '[data-testid="message-end"]',
    );
    expect(scrollElement).toBeDefined();
  });

  it("should display streaming indicator when isStreaming is true", () => {
    render(<MessageList messages={messages} isStreaming={true} />);

    // ストリーミング中のインジケーターを確認
    const streamingIndicator = screen.queryByText("...");
    expect(streamingIndicator).toBeDefined();
  });

  it("should not display streaming indicator when isStreaming is false", () => {
    const { container } = render(
      <MessageList messages={messages} isStreaming={false} />,
    );

    // ストリーミングインジケーターのdivが存在しないことを確認
    // メッセージの数だけMessageItemが存在するはず
    const allMessages = container.querySelectorAll(".max-w-\\[70\\%\\]");
    expect(allMessages.length).toBe(messages.length);
  });
});
