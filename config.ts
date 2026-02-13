
/**
 * VidSEO AI Configuration
 * Centralized settings for the application to improve maintainability and security.
 */

export const CONFIG = {
  // Model settings
  AI_MODEL: 'gemini-3-pro-preview',
  THINKING_BUDGET: 4000,
  TEMPERATURE: 0.7,
  
  // SEO Strategy Constants
  MAX_DESCRIPTION_LENGTH: 1500,
  MAX_TAGS_LENGTH: 500,
  
  // Environment access (Encapsulated)
  // We use a getter to ensure we always fetch the current state of process.env
  get apiKey(): string | undefined {
    return process.env.API_KEY;
  },
  
  /**
   * Validation helper to ensure the app is properly configured
   * before attempting expensive operations.
   */
  validate() {
    if (!this.apiKey) {
      throw new Error("CRITICAL: Gemini API_KEY is missing from environment variables.");
    }
  }
};
