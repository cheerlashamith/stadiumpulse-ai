/**
 * Result structure returned by input sanitization utility.
 *
 * @interface SanitizationResult
 * @property {boolean} isValid - Flag signaling if input passed security checks.
 * @property {string} sanitizedText - Capped, HTML-stripped, clean query text.
 * @property {string} [error] - Informative validation block message if suspicious characters/keywords matched.
 */
export interface SanitizationResult {
  isValid: boolean;
  sanitizedText: string;
  error?: string;
}

/**
 * Validates user prompt inputs to secure backend queries against prompt injection and XSS exploits.
 * Strips HTML script structures, caps maximum request size, and inspects keywords for malicious activity.
 *
 * @param {string} input - Raw conversational user prompt or text log.
 * @param {number} [maxLen=500] - Hard length cap constraint to defend against DOS buffer spam.
 * @returns {SanitizationResult} Result containing clean text and validation status.
 * 
 * Serves Area 3 (Security)
 */
export function sanitizeInput(input: string, maxLen: number = 500): SanitizationResult {
  if (!input) {
    return {
      isValid: false,
      sanitizedText: "",
      error: "Input cannot be empty"
    };
  }

  let text = input.trim();
  if (text.length === 0) {
    return {
      isValid: false,
      sanitizedText: "",
      error: "Input cannot consist of only whitespace"
    };
  }

  // 1. Check for prompt injection keywords
  const injectionPatterns = [
    /ignore previous instructions/i,
    /ignore all previous/i,
    /system prompt/i,
    /you are now a/i,
    /override your instructions/i,
    /reveal your instructions/i,
    /reveal system prompt/i,
    /disregard/i
  ];

  const containsInjection = injectionPatterns.some(pattern => pattern.test(text));
  if (containsInjection) {
    return {
      isValid: false,
      sanitizedText: "[PROMPT INJECTION BLOCKED]",
      error: "Suspicious input pattern detected"
    };
  }

  // 2. Strip basic HTML & script tags to prevent XSS
  text = text.replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, "");
  text = text.replace(/<\/?[^>]+(>|$)/g, "");

  // 3. Length capping
  if (text.length > maxLen) {
    text = text.substring(0, maxLen);
  }

  return {
    isValid: true,
    sanitizedText: text
  };
}
