import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { Message } from "@/app/types/chat";
import { MessageItem } from "./MessageItem";

describe("MessageItem", () => {
  const userMessage: Message = {
    id: "1",
    role: "user",
    content: "Hello, how are you?",
  };

  const assistantMessage: Message = {
    id: "2",
    role: "assistant",
    content: "I'm doing well, thank you!",
  };

  it("should render user message with correct content", () => {
    render(<MessageItem message={userMessage} />);
    expect(screen.getByText("Hello, how are you?")).toBeDefined();
  });

  it("should render assistant message with correct content", () => {
    render(<MessageItem message={assistantMessage} />);
    expect(screen.getByText("I'm doing well, thank you!")).toBeDefined();
  });

  it("should apply different styles for user and assistant messages", () => {
    const { container } = render(<MessageItem message={userMessage} />);
    const userElement = container.querySelector(".bg-blue-500");
    expect(userElement).toBeDefined();

    const { container: assistantContainer } = render(
      <MessageItem message={assistantMessage} />,
    );
    const assistantElement = assistantContainer.querySelector(".bg-gray-100");
    expect(assistantElement).toBeDefined();
  });

  it("should render system message", () => {
    const systemMessage: Message = {
      id: "3",
      role: "system",
      content: "System initialized",
    };

    render(<MessageItem message={systemMessage} />);
    expect(screen.getByText("System initialized")).toBeDefined();
  });

  it("should preserve line breaks in content", () => {
    const multilineMessage: Message = {
      id: "4",
      role: "user",
      content: "Line 1\nLine 2\nLine 3",
    };

    const { container } = render(<MessageItem message={multilineMessage} />);
    const element = container.querySelector(".whitespace-pre-wrap");
    expect(element?.textContent).toBe("Line 1\nLine 2\nLine 3");
  });
});
