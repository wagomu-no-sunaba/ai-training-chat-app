import type { UIMessage } from "ai";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "./route";

// UIMessage形式のヘルパー関数
function createUIMessage(
  role: "user" | "assistant" | "system",
  content: string,
  id = `msg-${Date.now()}`,
): UIMessage {
  return {
    id,
    role,
    parts: [{ type: "text", text: content }],
  };
}

describe("/api/chat Route Handler", () => {
  const originalEnv = process.env.OPENROUTER_API_KEY;

  beforeEach(() => {
    process.env.OPENROUTER_API_KEY = "sk-or-v1-test-key";
  });

  afterEach(() => {
    if (originalEnv) {
      process.env.OPENROUTER_API_KEY = originalEnv;
    } else {
      delete process.env.OPENROUTER_API_KEY;
    }
    vi.restoreAllMocks();
  });

  describe("Request Validation", () => {
    it("should return 500 for invalid request body", async () => {
      const request = new Request("http://localhost/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invalid: "data" }),
      });

      const response = await POST(request);
      expect(response.status).toBe(500);

      const data = await response.json();
      expect(data.error.type).toBe("api_error");
    });

    it("should return 500 for empty messages array", async () => {
      const request = new Request("http://localhost/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [] }),
      });

      const response = await POST(request);
      expect(response.status).toBe(500);

      const data = await response.json();
      expect(data.error.type).toBe("api_error");
    });

    it("should return 500 for invalid message role", async () => {
      const request = new Request("http://localhost/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ id: "1", role: "invalid", parts: [] }],
        }),
      });

      const response = await POST(request);
      expect(response.status).toBe(500);

      const data = await response.json();
      expect(data.error.type).toBe("api_error");
    });
  });

  describe("API Key Validation", () => {
    it("should return 500 when API key is not set", async () => {
      delete process.env.OPENROUTER_API_KEY;

      const request = new Request("http://localhost/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [createUIMessage("user", "Hello")],
        }),
      });

      const response = await POST(request);
      expect(response.status).toBe(500);

      const data = await response.json();
      expect(data.error.type).toBe("api_error");
      expect(data.error.message).toContain("OPENROUTER_API_KEY");
    });
  });

  describe("Success Cases", () => {
    it("should return streaming response for valid request", async () => {
      const request = new Request("http://localhost/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [createUIMessage("user", "Hello")],
        }),
      });

      const response = await POST(request);

      // ストリーミングレスポンスの確認
      expect(response.ok).toBe(true);
      expect(response.headers.get("Content-Type")).toContain(
        "text/event-stream",
      );
    });

    it("should accept multiple messages with different roles", async () => {
      const request = new Request("http://localhost/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            createUIMessage("system", "You are a helpful assistant", "msg-1"),
            createUIMessage("user", "Hello", "msg-2"),
            createUIMessage("assistant", "Hi! How can I help you?", "msg-3"),
            createUIMessage("user", "Tell me a joke", "msg-4"),
          ],
        }),
      });

      const response = await POST(request);
      expect(response.ok).toBe(true);
    });
  });

  describe("Error Handling", () => {
    it("should handle invalid JSON in request body", async () => {
      const request = new Request("http://localhost/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: "invalid json",
      });

      const response = await POST(request);
      expect(response.status).toBe(500);

      const data = await response.json();
      expect(data.error.type).toBe("api_error");
    });
  });
});
