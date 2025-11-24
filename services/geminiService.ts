import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { AnalysisResult } from "../types";

const API_KEY = process.env.API_KEY || '';

// We reuse the client instance where possible, but for fresh configs we might re-init
// In a real app, you might want to handle the missing API key more gracefully in the UI.
const ai = new GoogleGenAI({ apiKey: API_KEY });

export const analyzeCompetitors = async (query: string): Promise<AnalysisResult> => {
  if (!API_KEY) throw new Error("API Key is missing");

  try {
    // Using Search Grounding for up-to-date competitor info
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Analyze the competitive landscape for the following query in the global cat market: "${query}". 
      Identify key players, their strengths/weaknesses, and potential market gaps for a new entrant. 
      Format the response using Markdown with clear headers.`,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const content = response.text || "No analysis generated.";
    
    // Extract sources from grounding chunks if available
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks
      ?.map((chunk: any) => chunk.web)
      .filter((web: any) => web && web.uri && web.title)
      .map((web: any) => ({ uri: web.uri, title: web.title })) || [];

    return { content, sources };
  } catch (error: any) {
    console.error("Competitor Analysis Error:", error);
    throw new Error(error.message || "Failed to analyze competitors.");
  }
};

export const generateProductDescription = async (productName: string, category: string): Promise<string> => {
  if (!API_KEY) return "Please set API KEY to generate description.";

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Write a short, witty, and persuasive product description (max 50 words) for a cat product named "${productName}" in the category "${category}". It should appeal to obsessed cat owners.`,
    });
    return response.text || "Description unavailable.";
  } catch (error) {
    console.error("Description Gen Error:", error);
    return "Could not generate description at this time.";
  }
};

export const createGuruChat = (): Chat => {
  if (!API_KEY) throw new Error("API Key is missing");
  
  return ai.chats.create({
    model: "gemini-2.5-flash",
    config: {
      systemInstruction: "You are the 'Purrfect Business Guru', a world-class expert in the pet industry online business. You are savvy, encouraging, and data-driven. You help users refine their cat business ideas, marketing strategies, and operational plans. Keep answers concise but high-value.",
    },
  });
};