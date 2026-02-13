
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../types";
import { CONFIG } from "../config";

/**
 * Analyzes video frames and generates a platform-specific SEO strategy.
 * This implementation follows best practices by decoupling config from logic.
 */
export const analyzeVideo = async (frames: string[]): Promise<AnalysisResult> => {
  // 1. Robustness: Validate the configuration before making any network calls
  CONFIG.validate();

  // 2. Client Initialization: Using the key from our centralized config
  const ai = new GoogleGenAI({ apiKey: CONFIG.apiKey! });
  
  const systemInstruction = `Analyze this video file frame-by-frame. Identify the visual 'Hook' in the first 3 seconds. Provide a viral SEO strategy including:
  YouTube: High-CTR Title, Keyword-rich Description up to ${CONFIG.MAX_DESCRIPTION_LENGTH} chars, and ${CONFIG.MAX_TAGS_LENGTH} chars of Tags.
  TikTok: 3 catchy captions with trending hashtags.
  Facebook: A shareable post caption to drive comments.
  Policy Check: Highlight if any content violates platform community guidelines.`;

  // Define the expected JSON structure for strict output parsing.
  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      visualHook: { type: Type.STRING, description: 'The identified visual hook from first 3 seconds.' },
      youtube: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          tags: { type: Type.STRING }
        },
        required: ['title', 'description', 'tags']
      },
      tiktok: {
        type: Type.OBJECT,
        properties: {
          captions: { type: Type.ARRAY, items: { type: Type.STRING } },
          hashtags: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ['captions', 'hashtags']
      },
      facebook: {
        type: Type.OBJECT,
        properties: {
          caption: { type: Type.STRING }
        },
        required: ['caption']
      },
      policyCheck: {
        type: Type.OBJECT,
        properties: {
          status: { type: Type.STRING, description: 'Safe, Warning, or Violation' },
          notes: { type: Type.STRING }
        },
        required: ['status', 'notes']
      }
    },
    required: ['visualHook', 'youtube', 'tiktok', 'facebook', 'policyCheck']
  };

  const imageParts = frames.map(f => ({
    inlineData: {
      mimeType: 'image/jpeg',
      data: f
    }
  }));

  try {
    const response = await ai.models.generateContent({
      model: CONFIG.AI_MODEL,
      contents: {
        parts: [
          { text: systemInstruction },
          ...imageParts
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: CONFIG.TEMPERATURE,
        thinkingConfig: { thinkingBudget: CONFIG.THINKING_BUDGET }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("The AI model returned an empty response. Please try again with a different video.");
    }
    
    return JSON.parse(text) as AnalysisResult;
  } catch (error: any) {
    // 3. Robustness: Graceful error mapping for specific API failures
    const message = error?.message || "";
    
    if (message.includes('429')) {
      throw new Error("API rate limit exceeded. Please wait a minute and try again.");
    }
    if (message.includes('401') || message.includes('403')) {
      throw new Error("Authentication failed. Please verify your Gemini API key in Google AI Studio.");
    }
    if (message.includes('Requested entity was not found')) {
      throw new Error(`The model '${CONFIG.AI_MODEL}' is not available for your API key.`);
    }
    
    console.error("Gemini API Error Details:", error);
    throw new Error(error.message || "An unexpected error occurred during video analysis.");
  }
};
