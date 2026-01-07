
import { GoogleGenAI, Type } from "@google/genai";
import { SYSTEM_INSTRUCTION, GEMINI_MODEL } from "../constants";
import { StructuredResponse } from "../types";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  async generateStructuredResponse(prompt: string): Promise<StructuredResponse> {
    try {
      const response = await this.ai.models.generateContent({
        model: GEMINI_MODEL,
        contents: prompt,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          responseMimeType: "application/json",
          thinkingConfig: { thinkingBudget: 32768 },
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              plan: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Steps taken to formulate the response."
              },
              execution: {
                type: Type.STRING,
                description: "The main body of the response."
              },
              verification: {
                type: Type.STRING,
                description: "Self-correction and limitation notice."
              }
            },
            required: ["plan", "execution", "verification"]
          }
        },
      });

      const text = response.text || "";
      return JSON.parse(text) as StructuredResponse;
    } catch (error) {
      console.error("Gemini API Error:", error);
      throw new Error("Failed to generate response. Please ensure your API environment is correctly configured.");
    }
  }
}

export const geminiService = new GeminiService();
