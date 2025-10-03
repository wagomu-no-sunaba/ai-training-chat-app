import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ChatInput } from "./ChatInput";

describe("ChatInput", () => {
  afterEach(() => {
    cleanup();
  });
  it("テキスト入力フィールドと送信ボタンを表示する", () => {
    render(
      <ChatInput
        value=""
        onChange={vi.fn()}
        onSubmit={vi.fn()}
        disabled={false}
      />,
    );

    expect(screen.getByRole("textbox")).toBeDefined();
    expect(screen.getByRole("button", { name: /送信/i })).toBeDefined();
  });

  it("入力値が変更されたときにonChangeを呼び出す", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(
      <ChatInput
        value=""
        onChange={handleChange}
        onSubmit={vi.fn()}
        disabled={false}
      />,
    );

    const input = screen.getByRole("textbox");
    await user.type(input, "H");

    expect(handleChange).toHaveBeenCalledWith("H");
  });

  it("送信ボタンをクリックしたときにonSubmitを呼び出す", async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();

    render(
      <ChatInput
        value="Test message"
        onChange={vi.fn()}
        onSubmit={handleSubmit}
        disabled={false}
      />,
    );

    const button = screen.getByRole("button", { name: /送信/i });
    await user.click(button);

    expect(handleSubmit).toHaveBeenCalledWith("Test message");
  });

  it("Enterキーを押したときにonSubmitを呼び出す", async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();

    render(
      <ChatInput
        value="Test message"
        onChange={vi.fn()}
        onSubmit={handleSubmit}
        disabled={false}
      />,
    );

    const input = screen.getByRole("textbox");
    await user.type(input, "{Enter}");

    expect(handleSubmit).toHaveBeenCalledWith("Test message");
  });

  it("Shift+Enterキーを押したときは送信しない", async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();

    render(
      <ChatInput
        value="Test message"
        onChange={vi.fn()}
        onSubmit={handleSubmit}
        disabled={false}
      />,
    );

    const input = screen.getByRole("textbox");
    await user.type(input, "{Shift>}{Enter}{/Shift}");

    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it("disabled=trueのときは入力フィールドと送信ボタンを無効化する", () => {
    render(
      <ChatInput
        value=""
        onChange={vi.fn()}
        onSubmit={vi.fn()}
        disabled={true}
      />,
    );

    const textbox = screen.getByRole("textbox") as HTMLTextAreaElement;
    const button = screen.getByRole("button", {
      name: /送信/i,
    }) as HTMLButtonElement;

    expect(textbox.disabled).toBe(true);
    expect(button.disabled).toBe(true);
  });

  it("空のメッセージでは送信できない", async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();

    render(
      <ChatInput
        value=""
        onChange={vi.fn()}
        onSubmit={handleSubmit}
        disabled={false}
      />,
    );

    const button = screen.getByRole("button", { name: /送信/i });
    await user.click(button);

    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it("placeholderを表示する", () => {
    render(
      <ChatInput
        value=""
        onChange={vi.fn()}
        onSubmit={vi.fn()}
        disabled={false}
        placeholder="メッセージを入力..."
      />,
    );

    expect(screen.getByPlaceholderText("メッセージを入力...")).toBeDefined();
  });
});
