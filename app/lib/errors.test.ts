import { describe, expect, it } from "vitest";
import type { OpenRouterError } from "@/app/types/error";
import { createErrorResponse, isOpenRouterError } from "./errors";

describe("Error handling utilities", () => {
  describe("createErrorResponse", () => {
    it("should create validation error response", () => {
      const error = createErrorResponse(
        "validation_error",
        "Invalid request format",
        "INVALID_REQUEST",
      );

      expect(error).toEqual({
        error: {
          type: "validation_error",
          message: "Invalid request format",
          code: "INVALID_REQUEST",
        },
      });
    });

    it("should create authentication error response", () => {
      const error = createErrorResponse(
        "authentication_error",
        "Invalid API key",
        "INVALID_API_KEY",
      );

      expect(error).toEqual({
        error: {
          type: "authentication_error",
          message: "Invalid API key",
          code: "INVALID_API_KEY",
        },
      });
    });

    it("should create rate limit error response", () => {
      const error = createErrorResponse(
        "rate_limit_error",
        "Too many requests",
        "RATE_LIMIT_EXCEEDED",
      );

      expect(error).toEqual({
        error: {
          type: "rate_limit_error",
          message: "Too many requests",
          code: "RATE_LIMIT_EXCEEDED",
        },
      });
    });

    it("should create api error response", () => {
      const error = createErrorResponse(
        "api_error",
        "Internal server error",
        "INTERNAL_ERROR",
      );

      expect(error).toEqual({
        error: {
          type: "api_error",
          message: "Internal server error",
          code: "INTERNAL_ERROR",
        },
      });
    });
  });

  describe("isOpenRouterError", () => {
    it("should return true for valid OpenRouterError", () => {
      const error: OpenRouterError = {
        error: {
          type: "validation_error",
          message: "Test error",
          code: "TEST_CODE",
        },
      };

      expect(isOpenRouterError(error)).toBe(true);
    });

    it("should return false for non-error object", () => {
      expect(isOpenRouterError({})).toBe(false);
      expect(isOpenRouterError(null)).toBe(false);
      expect(isOpenRouterError(undefined)).toBe(false);
      expect(isOpenRouterError("string")).toBe(false);
    });

    it("should return false for error object with missing properties", () => {
      expect(isOpenRouterError({ error: {} })).toBe(false);
      expect(isOpenRouterError({ error: { type: "test" } })).toBe(false);
      expect(isOpenRouterError({ error: { message: "test" } })).toBe(false);
    });
  });
});
