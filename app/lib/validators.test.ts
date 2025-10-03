import { describe, expect, it } from "vitest";
import type { ChatRequest } from "@/app/types/chat";
import { validateChatRequest } from "./validators";

describe("Chat Request Validators", () => {
  describe("validateChatRequest", () => {
    it("should return true for valid chat request", () => {
      const validRequest: ChatRequest = {
        messages: [
          { role: "user", content: "Hello" },
          { role: "assistant", content: "Hi there!" },
        ],
      };

      expect(validateChatRequest(validRequest)).toBe(true);
    });

    it("should return false when messages is empty array", () => {
      const invalidRequest = {
        messages: [],
      };

      expect(validateChatRequest(invalidRequest)).toBe(false);
    });

    it("should return false when messages is missing", () => {
      const invalidRequest = {};

      expect(validateChatRequest(invalidRequest)).toBe(false);
    });

    it("should return false when messages is not an array", () => {
      const invalidRequest = {
        messages: "not an array",
      };

      expect(validateChatRequest(invalidRequest)).toBe(false);
    });

    it("should return false when message has invalid role", () => {
      const invalidRequest = {
        messages: [{ role: "invalid", content: "Hello" }],
      };

      expect(validateChatRequest(invalidRequest)).toBe(false);
    });

    it("should return false when message is missing content", () => {
      const invalidRequest = {
        messages: [{ role: "user" }],
      };

      expect(validateChatRequest(invalidRequest)).toBe(false);
    });

    it("should return false when message content is empty string", () => {
      const invalidRequest = {
        messages: [{ role: "user", content: "" }],
      };

      expect(validateChatRequest(invalidRequest)).toBe(false);
    });

    it("should return false when message content is not a string", () => {
      const invalidRequest = {
        messages: [{ role: "user", content: 123 }],
      };

      expect(validateChatRequest(invalidRequest)).toBe(false);
    });

    it("should return true for all valid role types", () => {
      const validRequest: ChatRequest = {
        messages: [
          { role: "user", content: "User message" },
          { role: "assistant", content: "Assistant message" },
          { role: "system", content: "System message" },
        ],
      };

      expect(validateChatRequest(validRequest)).toBe(true);
    });

    it("should return false when request is null", () => {
      expect(validateChatRequest(null)).toBe(false);
    });

    it("should return false when request is undefined", () => {
      expect(validateChatRequest(undefined)).toBe(false);
    });
  });
});
