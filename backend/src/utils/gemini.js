import dotenv from "dotenv";
dotenv.config();

import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function getGeminiResponse(prompt) {
  try {
    const result = await ai.models.generateContent({
      model: "gemini-2.0-flash", // You can switch to gemini-1.5-pro if needed
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    const text = result?.candidates?.[0]?.content?.parts?.[0]?.text;
    return text?.trim() || "No response";
  } catch (error) {
    console.error("❌ Gemini API Error:", error.message);
    return "No response";
  }
}
