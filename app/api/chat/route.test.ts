import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "./route";

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
    it("should return 400 for invalid request body", async () => {
      const request = new Request("http://localhost/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invalid: "data" }),
      });

      const response = await POST(request);
      expect(response.status).toBe(400);

      const data = await response.json();
      expect(data.error.type).toBe("validation_error");
    });

    it("should return 400 for empty messages array", async () => {
      const request = new Request("http://localhost/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [] }),
      });

      const response = await POST(request);
      expect(response.status).toBe(400);

      const data = await response.json();
      expect(data.error.type).toBe("validation_error");
    });

    it("should return 400 for invalid message role", async () => {
      const request = new Request("http://localhost/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "invalid", content: "Hello" }],
        }),
      });

      const response = await POST(request);
      expect(response.status).toBe(400);

      const data = await response.json();
      expect(data.error.type).toBe("validation_error");
    });
  });

  describe("API Key Validation", () => {
    it("should return 500 when API key is not set", async () => {
      delete process.env.OPENROUTER_API_KEY;

      const request = new Request("http://localhost/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: "Hello" }],
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
          messages: [{ role: "user", content: "Hello" }],
        }),
      });

      const response = await POST(request);

      // ストリーミングレスポンスの確認
      expect(response.ok).toBe(true);
      expect(response.headers.get("Content-Type")).toContain("text/plain");
    });

    it("should accept multiple messages with different roles", async () => {
      const request = new Request("http://localhost/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            { role: "system", content: "You are a helpful assistant" },
            { role: "user", content: "Hello" },
            { role: "assistant", content: "Hi! How can I help you?" },
            { role: "user", content: "Tell me a joke" },
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
      expect(response.status).toBe(400);

      const data = await response.json();
      expect(data.error.type).toBe("validation_error");
    });
  });
});
